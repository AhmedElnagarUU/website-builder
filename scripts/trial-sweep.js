#!/usr/bin/env node
/**
 * Cron job: Trial Expiration Sweep
 * Runs daily at 00:00 UTC.
 *
 * Finds all subscriptions where:
 *   status === "trialing" AND trialEndsAt < now
 * And sets the associated account's status to "suspended" in the
 * memberships collection.
 *
 * This is a safety net — the lazy enforcement in withEntitlement
 * handles active users. This catches users who haven't made any
 * requests since their trial expired.
 */
const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI || !MONGODB_DB_NAME) {
  console.error("MONGODB_URI and MONGODB_DB_NAME must be set");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);

    const now = new Date();

    // Find expired-trial subscriptions
    const expired = await db
      .collection("subscriptions")
      .find({
        status: "trialing",
        trialEndsAt: { $lt: now },
      })
      .toArray();

    let suspendedCount = 0;
    for (const sub of expired) {
      const result = await db
        .collection("memberships")
        .updateOne(
          { userId: sub.userId },
          {
            $set: { accountStatus: "suspended", updatedAt: now },
            $setOnInsert: {
              userId: sub.userId,
              createdAt: now,
            },
          },
          { upsert: true }
        );
      if (result.upsertedId || result.modifiedCount > 0) {
        suspendedCount++;
      }
    }

    console.log(
      `[Trial Sweep] ${expired.length} expired subscriptions found, ` +
      `${suspendedCount} accounts suspended.`
    );
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("[Trial Sweep] Error:", err);
  process.exit(1);
});
