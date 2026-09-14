# Problem: S3 image upload is broken (image upload "doesn't work")

> Investigated 2026-09-13. **Diagnosis only — no fix was applied.** No code, `.env`, or
> S3 bucket object was created or modified during this investigation.

## Symptom (owner's report + what the UI shows)

- Owner report: uploading an image to a website "doesn't work".
- UI shows the `bucket_rejected` error message (`editor.image.error.bucket_rejected`,
  "The image storage server rejected the upload — check storage permissions (CORS).").
- Because the failure is at the browser→S3 PUT, the app cannot distinguish "bucket
  misconfigured" from "bucket wrong region"; the message on screen points at CORS,
  which (see evidence) is **not** misconfigured.

## The numbered pipeline and every failure point (file:line)

1. **Client validates the file** — `src/features/editor/lib/uploadImage.ts:35` (`validateImageFile`).
   Rejects >10 MB at `uploadImage.ts:40` (surfaces as `too_large`), unsupported types via `MIME_EXT`.
2. **Client POSTs an upload ticket** — `uploadImage.ts:109` → `POST /api/sites/{siteId}/image-upload`.
3. **Paywall gate** (works as designed) — `src/app/api/sites/[siteId]/image-upload/route.ts:20`
   (`withEntitlement`) checks the file size against the plan's `maxImageBytes`
   (`src/features/monetization/lib/checkLimit.ts:94`; Free = 10 MB,
   `src/features/monetization/plans.ts:16`, `src/shared/lib/image-upload.ts:9`). Over-limit
   Free uploads get `402 / limit_reached` **before S3 is touched.** Not the bug.
4. **Owner/authorization** (strict, by design) — `request-image-upload.ts:36` returns `401`
   without a session, `404` (`:39`) when the site isn't owned by the caller. Not the bug.
5. **Server signs a presigned PUT (10 min)** — `request-image-upload.ts:54` creates the S3
   client from `createS3Client()` (`src/features/images/lib/s3.ts:8`), `request-image-upload.ts:55-60`
   builds `PutObjectCommand` and calls `getSignedUrl(..., { expiresIn: 600 })`.
   - `src/features/images/lib/s3.ts:6` — `S3_REGION = process.env.S3_REGION ?? "us-east-1"`.
   - `createS3Client()` never validates the region against the bucket, and `getSignedUrl` is
     **purely offline** (signing only — probe confirmed it does not throw for a wrong region).
     So a missing/wrong region does **not** land in the `catch` at `request-image-upload.ts:61-63`
     (`config_error`). The server happily returns a ticket pointing at the *configured* region.
6. **Browser PUTs the file directly to S3** — `uploadImage.ts:128`:
   `fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": mime } })`.
   - `uploadImage.ts:133` — `!put.ok` → `UploadFlowError("bucket_rejected")`. **This is the
     failure surface the owner actually sees.**
   - **Confirmed cause:** the presigned URL asks the browser to PUT to
     `…s3.<S3_REGION>.amazonaws.com`, but the bucket physically lives in a different region;
     S3 answers `301 PermanentRedirect` to the real region. The browser follows the redirect;
     the SigV4 signature was computed for the *configured* region's endpoint, so the re-sent PUT
     fails (`SignatureDoesNotMatch`/denied). Upload dies here with `bucket_rejected`.
7. **PATCH records the slot** — `uploadImage.ts:147` → `PATCH /api/sites/{siteId}/images`
   (`src/app/api/sites/[siteId]/images/route.ts:4` → `record-image-slot.ts:35`). Re-validates the
   slot exists (`record-image-slot.ts:52`) and that the key is scoped to the site
   (`record-image-slot.ts:53` via `isImageKeyForSite`, `s3.ts:23`). Only reached after a
   successful PUT; not the failure today.

## Evidence table (all verified during this investigation)

| Claim | Evidence |
|---|---|
| The four `S3_*` key names exist in `.env` | `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` all present (values not printed). |
| `.env` region vs bucket real region | `.env` `S3_REGION=eu-north-1`. Read-only probe: `GET https://s3.eu-north-1.amazonaws.com/<bucket>` → HTTP **301** with header `x-amz-bucket-region: us-east-1`. The bucket (`ecommerctestbucket`) actually lives in **us-east-1**. |
| Credentials are valid | `HeadBucket` against `us-east-1` endpoint → **OK**. Bad/missing keys are *not* the cause. |
| Presign doesn't catch wrong-region buckets | `getSignedUrl` succeeds offline and returns a URL on `…s3.eu-north-1.amazonaws.com` (no `config_error`). The mismatch surfaces only at the browser PUT (step 6). |
| CORS allows the browser PUT | `GetBucketCors` (read-only, us-east-1): one rule — `AllowedOrigins ["*"]`, methods `GET PUT POST DELETE`, `AllowedHeaders ["*"]`. PUT with `Content-Type` is **allowed**. CORS is not the problem. |
| Bucket policy for objects | `GetBucketPolicy`: single statement `AllowAllS3Actions` (Principal `*`, Action `s3:*`) but `Resource = arn:aws:s3:::ecommerctestbucket` — the **bucket only, no `/*`**. Object-level `GetObject`/`PutObject` is therefore *not* covered by this statement (Block-Public-Access/ACLs and the IAM user's own permissions are separate; see checklist). |
| `S3_PUBLIC_BASE_URL` absent | Not in `.env` (present in `.env.example` as a comment template). Effect: the app has no public CDN base for `<img src>`, so **display of an uploaded image in the editor preview breaks**. It does **not** affect the upload itself. |
| Free plan cap = 10 MB | `MAX_IMAGE_BYTES = 10 * 1024 * 1024` (`src/shared/lib/image-upload.ts:9`); Free `maxImageBytes: 10 * 1024 * 1024` (`src/features/monetization/plans.ts:16`). Over-limit files are stopped by the paywall (402) before S3 — working as designed. |

## Likely root causes, ranked (each tagged code vs AWS/config)

1. **Code/config — CONFIRMED (region mismatch).** `S3_REGION` in `.env` (`eu-north-1`) does not
   match the bucket's real region (`us-east-1`). Every presigned PUT points at the wrong-region
   endpoint, S3 redirects, and the signed request is rejected. This alone breaks **every** image
   upload from the browser, independent of CORS or policies.
   - Interaction with our error mapping: because presigning is offline, the mismatch never
     produces `config_error`; it surfaces as `bucket_rejected`, whose message wrongly blames CORS.
2. **Code/config — POSSIBLE (missing `S3_PUBLIC_BASE_URL`).** Unset env var means no public base
   URL for served objects; uploads that *would* succeed still can't render in the preview
   (`<img src>`). Non-fatal for the PUT itself, fatal for the feature's visible result.
3. **AWS/config — UNDER VERIFICATION (object-level access).** The bucket policy's only statement
   targets the bucket ARN without `/*`, so it does not visibly grant `GetObject`/`PutObject` on
   objects; whether uploaded keys are readable publicly depends on Block-Public-Access, object
   ACLs, or an IAM policy we could not inspect via the S3 API (read-only rules forbid a write
   probe of `PutObject`). Also unverified: the IAM user's `s3:PutObject` on `sites/*` (we only
   confirmed bucket-level `HeadBucket`).

## Checklist to verify in the AWS console

- [ ] Confirm the bucket `ecommerctestbucket` region is **us-east-1** and set `S3_REGION` there
      (the confirmed fix).
- [ ] IAM: does the user behind `S3_ACCESS_KEY_ID` have `s3:PutObject` (and `s3:GetObject`) on
      `arn:aws:s3:::<bucket>/sites/*`?
- [ ] Permissions: is **Block Public Access** off (or the bucket served via CloudFront with an
      origin-access identity) so `sites/…` objects can be read by browsers?
- [ ] Bucket policy: add/confirm a `GetObject` statement on `arn:aws:s3:::<bucket>/*` for `*`
      (public read) if the site images are meant to be public via the plain S3 base URL.
- [ ] CORS: already valid for this app (PUT, `*` origins/headers) — no change needed unless the
      app origin list is tightened.

## Recommended next actions — labelled **to do in a future fix** (NOT done now)

1. *(fix, config)* Set `S3_REGION` in `.env` to the bucket's real region (`us-east-1`). Then retest
   one upload. Re-verify after deploy that the fresh presigned URL hosts on
   `s3.us-east-1.amazonaws.com`.
2. *(fix, config)* Set `S3_PUBLIC_BASE_URL` (e.g. the bucket's region endpoint or a CDN) so
   uploaded images render in the editor preview.

## Verdict

**Root cause: both.** On our side it is **code/config (confirmed)**: `S3_REGION` in `.env`
(`eu-north-1`) does not match the bucket's actual region (`us-east-1`), so every presigned PUT is
redirected and rejected — this alone breaks all uploads. On the AWS side (verify in the console,
see checklist), the bucket's only policy statement targets the bucket and not the `/*` object keys, so
uploaded images may still not be readable publicly, and the object-level `PutObject` permission
is unconfirmed. CORS is correctly configured and is **not** the cause.