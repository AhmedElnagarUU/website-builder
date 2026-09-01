# Task 02 — Image slot UX (uploader + reposition + warnings)

## Context

The renderer already makes image slots tappable in edit mode (`onRequestEdit(slotId)`). This task replaces the no-op with a real image flow: tap an image slot → open a small uploader → select/drag a file → presign-PUT-PATCH (Task 01) → preview updates immediately. It enforces format/max-size with friendly messages, warns on low resolution without blocking, and lets the user reposition the crop within the slot's fixed aspect ratio (PRD 14.3).

## Scope

- `ImageSlotEditor` modal/popover triggered by tapping an image slot in the editor preview.
- Client flow: pick file → validate MIME + size client-side → POST `image-upload` → PUT bytes to `uploadUrl` → PATCH `images` with `s3Key` + measured width/height → refresh preview.
- Reposition control: a small picker (nine positions, `Position9`) that sets `position` via the same PATCH; the rendered crop shifts (`object-position`) without resizing the slot.
- Low-res warning when measured width/height is below the slot's `minWidth`/`minHeight`; unsupported-format and too-large messages in plain language.
- Strings under `editor.image.*`.

## Technical details

Files:

```
src/features/editor/components/ImageSlotEditor.tsx   // modal: upload + reposition + warnings
src/features/editor/lib/uploadImage.ts               // orchestration: presign → PUT → PATCH
src/features/editor/components/EditorShell.tsx        // wire slot tap → open ImageSlotEditor (edit existing)
```

Rules:
- The renderer's `SlotImage` must resolve an uploaded `s3Key` to `S3_PUBLIC_BASE_URL + '/' + s3Key` so the preview actually shows the upload (replaces the Milestone 01 `s3://` placeholder; expose the base via a public constant or prop — see MILESTONE.md).
- MIME/size validated BOTH client-side (fast, friendly) and the server re-validates MIME (Task 01); no file is PUT before `uploadUrl` is obtained.
- The PUT uses `fetch(uploadUrl, { method:'PUT', body:file, headers:{ 'Content-Type': mimeType } })`; on success read `file.width`/`file.height` mutable fields (after load) or use an `Image` element to measure.
- Repositioning is an "immediate preview" change: PATCH `position`, the renderer's `object-position` updates without reload.
- Once a slot has an uploaded image, the uploader shows a "Replace" affordance (no separate delete in MVP; a slot is emptied by replacing with nothing only if defined — otherwise keep last).
- Arabic: RTL-correct UI (`text-start`, logical spacing); never directional utilities.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `editor.image.upload` | `Upload image` | `ارفع صورة` |
| `editor.image.replace` | `Replace image` | `استبدال الصورة` |
| `editor.image.unsupported` | `Use a JPG, PNG, or WebP image.` | `استخدم صورة بصيغة JPG أو PNG أو WebP.` |
| `editor.image.too_large` | `File is too large (max 10 MB).` | `الملف كبير جداً (الحد الأقصى 10 ميغابايت).` |
| `editor.image.low_res` | `This image may look blurry when enlarged.` | `قد تبدو هذه الصورة ضبابية عند تكبيرها.` |
| `editor.image.reposition` | `Position` | `الموضع` |
| `editor.image.upload_error` | `Couldn't upload — try again` | `تعذّر الرفع — حاول مجدداً` |
| `editor.image.uploading` | `Uploading…` | `جارٍ الرفع…` |

## Dependencies

- `epics/04-preview-and-edit/04-image-handling/01-presign-upload-api.md`
- `epics/04-preview-and-edit/01-site-render/01-template-renderer-engine.md` (slot tap + rendering, `object-position` support already present)
- `epics/04-preview-and-edit/01-site-render/02-editor-preview-page.md` (EditorShell chrome)

## Out of scope

- Client-side image resize/crop beyond repositioning (PRD 14.3 fixes the slot, user repositions only).
- Deleting objects from S3; galleries/reordering; multiple images per slot.
- Image flow on the live public site (Epic 05 renders stored data only).

## Acceptance criteria

- [ ] Tapping an empty image slot opens the uploader (shows "Upload image"); tapping an occupied one shows "Replace image".
- [ ] A valid PNG/JPG/WebP upload → preview object appears in that slot immediately (no reload); a slot with no upload still shows the template `defaultAsset`.
- [ ] An unsupported file → friendly message naming JPG/PNG/WebP; nothing is uploaded.
- [ ] A >10 MB file → friendly too-large message; nothing uploaded/put.
- [ ] An image below the slot's `minWidth`/`minHeight` uploads successfully but shows "This image may look blurry when enlarged." warning.
- [ ] Selecting a `Position9` value repositions the crop in preview (object-position changes) and persists via PATCH.
- [ ] Arabic uploader is RTL and correctly aligned.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no hardcoded strings; no new dependencies.
