# Task — Diagnose the S3 Image Upload Failure

## Title
Investigate why uploading an image to S3 fails, and write a decision-ready problem doc to `docs/05-problems/`. **No code changes.**

## Context
The owner reports the S3 image upload "doesn't work" and wants to know where the problem originates. Our job is a rigorous trace of the code path plus evidence (code reading, env-key presence, and optional read-only AWS checks), documented so a non-technical decision can be made (+ near-term fix options).

## Scope
1. **Trace** the full pipeline (files listed in the milestone) and identify every point where the upload can fail:
   - entitlement failures (402 paywall — works as designed);
   - authorization/ownership (401/404 — strict);
   - `config_error` surface (server signing);
   - `bucket_rejected` surface (browser PUT);
   - post-PUT PATCH failure (`record-image-slot.ts` — slot re-validation, `isImageKeyForSite`).
2. **Check the config side without changing it:** the four `S3_*` key names are present in `.env`; inspect `createS3Client()` for how empty values would behave (e.g. region default `us-east-1`), verify `S3_PUBLIC_BASE_URL` absence and its (non-fatal) impact. **Never print secret values.**
3. **Optional read-only AWS probe** (only if you can do it safely): run a tiny one-off Node script using the repo's own `@aws-sdk/client-s3` (an approved dep) calling `HeadBucket` + `GetBucketCors`/`GetBucketPolicy` with the credentials from `.env`. This is read-only — NEVER PUT/write any object to S3, NEVER change bucket config. If you cannot run it safely, say so in the doc and rely on the code trace.
4. **Write the doc** `docs/05-problems/02-s3-image-upload-broken.md` containing:
   - Symptom (owner's report + what the UI shows: which error message/key: `config_error` vs `bucket_rejected` vs network vs paywall);
   - The numbered pipeline with the exact file:line of each failure point;
   - Evidence table: env key presence, region default, missing `S3_PUBLIC_BASE_URL`, Free 10 MB paywall gate;
   - Likely root cause(s) ranked, each tagged **code** or **AWS/config**, with the reasoning;
   - Checklist of what to verify in the AWS console (bucket permissions, public-read policy, CORS `PUT` for the app origin, key permissions `s3:PutObject`);
   - A one-line verdict: **"Root cause: … (code / AWS / both)"**;
   - Recommended next actions, explicitly labelled "to do in a future fix" (do NOT implement them now).

## Dependencies
CODE_RULES.md; `.env.example` (public), `.env` (key names only); `features/images/**`, `editor/lib/uploadImage.ts`, `monetization/lib/checkLimit.ts`.

## Out of scope
Any code/env/bucket modification; reproducing by actually uploading an object; fixing the upload.

## Acceptance criteria
1. `docs/05-problems/02-s3-image-upload-broken.md` exists, self-contained, in English, with the verdict line at the end.
2. The doc names each failure surface with real file:line references and tags code vs AWS.
3. Evidence claims are true (spot-check: env key names present; `S3_PUBLIC_BASE_URL` absent; Free limit = 10 MB).
4. No code/src/.env/bucket changes (verify with `git status` that no `src/**` file is modified by this milestone).
5. `tsc --noEmit` + `npm run lint` pass (repo unchanged).