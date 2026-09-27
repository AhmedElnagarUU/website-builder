#!/usr/bin/env node
/**
 * Ensures the S3 bucket grants the access the app needs for site images.
 *
 * The bucket must be able to do two things that are NOT covered by the default
 * "AllowAllS3Actions" statement (that one only names the bucket ARN, never the
 * objects under it, so every object-level action is denied):
 *
 *   1. PublicReadSiteImages    s3:GetObject for anyone, on bucket/sites/*
 *                              -> published sites serve images from
 *                                 S3_PUBLIC_BASE_URL with no expiring signature
 *                                 (see CODE_RULES.md section 7, key layout
 *                                 sites/{siteId}/{slotId}/{uuid}.{ext})
 *
 *   2. AppUserDeleteSiteImages s3:DeleteObject for the app's IAM user, on
 *                                 bucket/sites/*
 *                              -> deleting a site removes its images
 *                                 (src/features/sites/api/delete-site.ts)
 *
 * Scoped to sites/* on purpose: the bucket also holds unrelated keys such as
 * products/*, which must stay private.
 *
 * The script MERGES by Sid, so any other statement on the bucket is preserved,
 * and it backs up the current policy before writing.
 *
 * Run from project root:  node scripts/s3/ensure-site-image-access.mjs
 */
const path = require("path");
const fs = require("fs");
const {
  S3Client,
  GetBucketPolicyCommand,
  PutBucketPolicyCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");

const ROOT = path.resolve(__dirname, "..", "..");
const BACKUP_PATH = path.join(__dirname, "bucket-policy.backup.json");
const APP_PRINCIPAL_ARN =
  process.env.S3_IAM_PRINCIPAL_ARN || "arn:aws:iam::337909740554:user/ecommerc-app-test";

const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const BUCKET = process.env.S3_BUCKET;
if (!BUCKET) {
  console.error("S3_BUCKET is not set in .env");
  process.exit(1);
}

const client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const imageResource = `arn:aws:s3:::${BUCKET}/sites/*`;

const requiredStatements = [
  {
    Sid: "PublicReadSiteImages",
    Effect: "Allow",
    Principal: "*",
    Action: "s3:GetObject",
    Resource: imageResource,
  },
  {
    Sid: "AppUserDeleteSiteImages",
    Effect: "Allow",
    Principal: { AWS: APP_PRINCIPAL_ARN },
    Action: "s3:DeleteObject",
    Resource: imageResource,
  },
];

function mergeStatements(current, required) {
  const statements = Array.isArray(current?.Statement) ? [...current.Statement] : [];
  for (const statement of required) {
    const index = statements.findIndex((s) => s.Sid === statement.Sid);
    if (index === -1) statements.push(statement);
    else statements[index] = statement;
  }
  return { ...(current || {}), Version: "2012-10-17", Statement: statements };
}

async function readPolicy() {
  try {
    const res = await client.send(new GetBucketPolicyCommand({ Bucket: BUCKET }));
    return JSON.parse(res.Policy);
  } catch {
    return undefined;
  }
}

async function firstImageKey() {
  try {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "sites/", MaxKeys: 1 })
    );
    return res.Contents?.[0]?.Key;
  } catch {
    return undefined;
  }
}

async function verify() {
  const publicBase = (process.env.S3_PUBLIC_BASE_URL || `https://${BUCKET}.s3.amazonaws.com`).replace(/\/+$/, "");
  const imageKey = await firstImageKey();

  if (imageKey) {
    const res = await fetch(`${publicBase}/${imageKey}`);
    console.log(`  anonymous GET sites/.../${imageKey.slice(-24)}: ${res.status}`);
  } else {
    console.log("  anonymous GET: skipped (no sites/ object uploaded yet)");
  }

  try {
    await client.send(
      new DeleteObjectCommand({ Bucket: BUCKET, Key: "sites/zz-permission-probe/never-existed.png" })
    );
    console.log("  app-user DeleteObject on sites/*: ALLOWED (nothing was actually deleted)");
  } catch (e) {
    console.log(`  app-user DeleteObject on sites/*: DENIED (${e.name})`);
  }

  try {
    const res = await fetch(`${publicBase}/products/1780095161220-970897983.png`, { method: "HEAD" });
    console.log(`  anonymous GET products/...: ${res.status} (must stay 403)`);
  } catch (e) {
    console.log(`  anonymous GET products/...: request failed (${e.message})`);
  }
}

async function run() {
  const current = await readPolicy();
  const merged = mergeStatements(current, requiredStatements);
  const changed = JSON.stringify(current) !== JSON.stringify(merged);

  console.log(`bucket: ${BUCKET}`);
  if (!changed) {
    console.log("policy: already correct, nothing to write");
  } else {
    if (current) {
      fs.writeFileSync(BACKUP_PATH, JSON.stringify(current, null, 2));
      console.log(`policy: backed up previous version to ${path.relative(ROOT, BACKUP_PATH)}`);
    }
    await client.send(
      new PutBucketPolicyCommand({ Bucket: BUCKET, Policy: JSON.stringify(merged) })
    );
    console.log("policy: written");
  }

  console.log("verify:");
  await verify();
}

run().catch((e) => {
  console.error(`${e.name}: ${e.message}`);
  process.exit(1);
});
