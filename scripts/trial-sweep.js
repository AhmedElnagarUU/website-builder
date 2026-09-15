#!/usr/bin/env node
/**
 * Cron job: Trial Expiration Sweep
 * Runs daily at 00:00 UTC.
 *
 * Finds all subscriptions where:
 *   status === "trialing" AND trialEndsAt < now
 * And sets the associated Membership.accountStatus = "suspended".
 *
 * This is a fallback for users whose trial expired but who never
 * hit a protected endpoint (lazy enforcement didn't trigger).
 *
 * NOTE: Run from project root: `node scripts/trial-sweep.js`
 * Uses a standalone MongoDB connection (does not import Next.js aliases).
 */
const { MongoClient } = require("mongodb");
const path = require("path");
const fs = require("fs");

// Load .env manually (cron runs outside of Next.js)
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valParts] = trimmed.split("=");
      const val = valParts.join("=").trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB_NAME || "website_builder";

async function runSweep() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const now = new Date();
    console.log(`[trial-sweep] Running sweep at ${now.toISOString()}`);

    const subsCollection = db.collection("subscriptions");
    const membershipsCollection = db.collection("memberships");

    // Find all trialing subscriptions with expired trials
    const expiredSubs = await subsCollection
      .find({
        status: "trialing",
        trialEndsAt: { $lt: now },
      })
      .toArray();

    if (expiredSubs.length === 0) {
      console.log("[trial-sweep] No expired trials found.");
      return;
    }

    console.log(`[trial-sweep] Found ${expiredSubs.length} expired trial(s).`);

    for (const sub of expiredSubs) {
      const userId = sub.userId;
      // Set account to suspended
      await membershipsCollection.updateOne(
        { userId },
        { $set: { accountStatus: "suspended", updatedAt: now } },
        { upsert: true }
      );
      console.log(`[trial-sweep] Suspended user ${userId} (trial expired at ${sub.trialEndsAt})`);
    }

    console.log(`[trial-sweep] Sweep complete. ${expiredSubs.length} account(s) suspended.`);
  } finally {
    await client.close();
  }
}

runSweep().catch((err) => {
  console.error("[trial-sweep] ERROR:", err);
  process.exit(1);
});
