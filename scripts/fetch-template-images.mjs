#!/usr/bin/env node

// Pexels License (https://www.pexels.com/api/documentation/):
// "All content is available free of charge...for anything you'd like,
// as long as it is within our Guidelines."
// Guidelines: "show a prominent link to Pexels" and "credit our
// photographers when possible." Self-hosted images in a website
// builder's templates satisfy this: we include a NOTE in each
// rendered site's footer (or equivalent) linking to Pexels.
// Commercial use is explicitly allowed. No attribution _required_
// for the free tier, but we credit photographers in alt text.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public", "templates", "real");

const API_BASE = "https://api.pexels.com/v1/search";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const RATE_LIMIT_DELAY_MS = 70000;
const PER_HOUR_LIMIT = 190;
const PER_MONTH_LIMIT = 19000;

let requestsThisHour = 0;
let requestsThisMonth = 0;
let lastHourReset = Date.now();

const DRY_RUN = process.argv.includes("--dry-run");
const API_KEY = process.env.PEXELS_API_KEY;

if (!API_KEY) {
  console.error("ERROR: PEXELS_API_KEY environment variable is not set.");
  console.error("Usage: PEXELS_API_KEY=your_key node scripts/fetch-template-images.mjs [--dry-run]");
  process.exit(1);
}

function log(msg) {
  console.log(`[pexels] ${msg}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function checkRateLimit() {
  if (Date.now() - lastHourReset > 3_600_000) {
    requestsThisHour = 0;
    lastHourReset = Date.now();
  }
  if (requestsThisHour >= PER_HOUR_LIMIT) {
    log(`Hourly rate limit (${PER_HOUR_LIMIT}) reached, waiting 70s...`);
    await sleep(RATE_LIMIT_DELAY_MS);
    requestsThisHour = 0;
    lastHourReset = Date.now();
  }
  if (requestsThisMonth >= PER_MONTH_LIMIT) {
    throw new Error("Monthly rate limit exceeded. Wait or request a higher limit.");
  }
}

async function pexelsSearch(query, orientation, perPage = 10) {
  await checkRateLimit();
  const params = new URLSearchParams({
    query,
    orientation,
    per_page: String(perPage),
    locale: "en-US",
  });
  const searchUrl = `${API_BASE}?${params}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(searchUrl, {
        headers: { Authorization: API_KEY },
      });
      requestsThisHour++;
      requestsThisMonth++;

      if (res.status === 429) {
        log(`Rate limited (429), waiting ${RATE_LIMIT_DELAY_MS}ms...`);
        await sleep(RATE_LIMIT_DELAY_MS);
        continue;
      }
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
      }
      const data = await res.json();
      return data.photos || [];
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const delay = RETRY_DELAY_MS * 2 ** (attempt - 1);
      log(`Search retry ${attempt}/${MAX_RETRIES} for "${query}": ${err.message}. Waiting ${delay}ms...`);
      await sleep(delay);
    }
  }
  return [];
}

function buildCropUrl(originalUrl, w, h) {
  const u = new URL(originalUrl);
  u.searchParams.set("w", String(w));
  u.searchParams.set("h", String(h));
  u.searchParams.set("fit", "crop");
  return u.toString();
}

function selectVariant(photo, orientation, minW, minH) {
  if (orientation === "landscape") {
    if (photo.width >= minW && photo.height >= minH) return photo.src.original;
    return photo.src.large2x || photo.src.large;
  }
  if (orientation === "portrait") {
    if (photo.width >= minW && photo.height >= minH) return photo.src.original;
    return photo.src.portrait || photo.src.large2x;
  }
  if (photo.width >= minW && photo.height >= minH) return photo.src.original;
  return photo.src.large2x || photo.src.large;
}

async function downloadFile(url, destPath) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, buf);
      return buf.length;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const delay = RETRY_DELAY_MS * 2 ** (attempt - 1);
      log(`  Download retry ${attempt}/${MAX_RETRIES}: ${err.message}. Waiting ${delay}ms...`);
      await sleep(delay);
    }
  }
  return 0;
}

function detectImageDimensions(filePath) {
  const fd = fs.openSync(filePath, "r");
  try {
    const header = Buffer.alloc(24);
    fs.readSync(fd, header, 0, 24, 0);

    if (header[0] === 0xff && header[1] === 0xd8) {
      const stat = fs.fstatSync(fd);
      const buf = Buffer.alloc(Math.min(stat.size, 65536));
      fs.readSync(fd, buf, 0, buf.length, 0);
      let offset = 2;
      while (offset < buf.length - 1) {
        if (buf[offset] !== 0xff) { offset++; continue; }
        const marker = buf[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          const h = buf.readUInt16BE(offset + 5);
          const w = buf.readUInt16BE(offset + 7);
          return { width: w, height: h };
        }
        if (marker === 0xd9 || marker === 0xda) break;
        const segLen = buf.readUInt16BE(offset + 2);
        offset += 2 + segLen;
      }
    }

    if (header[0] === 0x89 && header[1] === 0x50) {
      const w = header.readUInt32BE(16);
      const h = header.readUInt32BE(20);
      return { width: w, height: h };
    }

    throw new Error("Unrecognized image format");
  } finally {
    fs.closeSync(fd);
  }
}

// ---------------------------------------------------------------------------
// Template → Image mapping
// Derived from audit-report.md personas, not generic category labels.
// ---------------------------------------------------------------------------

const TEMPLATES = [
  {
    id: "classic-services",
    category: "services",
    slots: [
      { slotId: "logo", query: "desk office supplies minimal", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "plumber fixing kitchen sink pipes", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "electrician working on wiring", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "hvac technician repair service", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "home maintenance repair tools", orientation: "landscape", w: 800, h: 600 },
      { slotId: "team_1", query: "professional male portrait business", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_2", query: "professional female portrait business", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_3", query: "diverse professional portrait friendly", orientation: "portrait", w: 480, h: 480 },
    ],
  },
  {
    id: "modern-studio",
    category: "services",
    slots: [
      { slotId: "logo", query: "minimalist dark workspace desk", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "creative agency modern office design", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "design team brainstorming session", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "modern studio workspace interior", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "creative professionals collaborating", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_4", query: "digital agency team working together", orientation: "landscape", w: 800, h: 600 },
      { slotId: "team_1", query: "creative professional portrait dark", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_2", query: "designer professional portrait confident", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_3", query: "creative director professional portrait", orientation: "portrait", w: 480, h: 480 },
    ],
  },
  {
    id: "warm-kitchen",
    category: "restaurant",
    slots: [
      { slotId: "logo", query: "fresh ingredients herbs cooking", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "cozy restaurant interior warm lighting", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "homemade pasta Italian food dish", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "fresh bread bakery artisan", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "grilled steak dinner restaurant", orientation: "landscape", w: 800, h: 600 },
      { slotId: "team_1", query: "professional chef portrait kitchen", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_2", query: "sous chef portrait professional", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_3", query: "restaurant staff friendly team", orientation: "portrait", w: 480, h: 480 },
    ],
  },
  {
    id: "bistro-menu",
    category: "restaurant",
    slots: [
      { slotId: "logo", query: "elegant dining table setting", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "bistro restaurant elegant interior", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "fine dining plating food art", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "gourmet dessert pastry chef", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "espresso coffee cup cafe", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_4", query: "fresh salad healthy food plate", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_5", query: "wine glasses table restaurant dinner", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_6", query: "breakfast brunch table spread", orientation: "landscape", w: 800, h: 600 },
    ],
  },
  {
    id: "simple-shop",
    category: "retail",
    slots: [
      { slotId: "logo", query: "shopping bag retail minimal", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "boutique shop interior modern", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "handmade pottery ceramics craft", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "artisan candles home decor products", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "gift shop products display shelf", orientation: "landscape", w: 800, h: 600 },
    ],
  },
  {
    id: "product-focus",
    category: "retail",
    slots: [
      { slotId: "logo", query: "minimal product logo design", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "premium wireless headphones product", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "smartphone modern technology product", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "smartwatch wearable technology gadget", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "laptop modern tech workspace clean", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_4", query: "portable speaker wireless audio device", orientation: "landscape", w: 800, h: 600 },
    ],
  },
  {
    id: "professional-profile",
    category: "professional",
    slots: [
      { slotId: "logo", query: "business card professional minimal", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "executive portrait professional office", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "team_1", query: "businessman suit professional portrait", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_2", query: "businesswoman professional corporate portrait", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_3", query: "senior executive portrait confident", orientation: "portrait", w: 480, h: 480 },
    ],
  },
  {
    id: "consultant-page",
    category: "professional",
    slots: [
      { slotId: "logo", query: "modern office desk workspace minimal", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "financial advisor meeting client office", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "business strategy meeting boardroom", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "data analysis charts business presentation", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "consulting team collaboration workspace", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_4", query: "professional handshake business deal", orientation: "landscape", w: 800, h: 600 },
      { slotId: "team_1", query: "management consultant professional portrait", orientation: "portrait", w: 480, h: 480 },
    ],
  },
  {
    id: "clean-portfolio",
    category: "portfolio",
    slots: [
      { slotId: "logo", query: "camera photography equipment minimal", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "photographer studio professional workspace", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "landscape photography mountain scenery", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "portrait photography natural light", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "street photography urban architecture", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_4", query: "abstract art photography modern", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_5", query: "nature macro photography flower", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_6", query: "travel photography city skyline", orientation: "landscape", w: 800, h: 600 },
      { slotId: "team_1", query: "photographer portrait creative professional", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_2", query: "creative director portrait studio", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_3", query: "artist portrait creative workspace", orientation: "portrait", w: 480, h: 480 },
    ],
  },
  {
    id: "visual-showcase",
    category: "portfolio",
    slots: [
      { slotId: "logo", query: "abstract paint brush artistic minimal", orientation: "portrait", w: 400, h: 400 },
      { slotId: "hero_image", query: "modern art gallery exhibition dark", orientation: "landscape", w: 1200, h: 675 },
      { slotId: "gallery_1", query: "digital art illustration creative modern", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_2", query: "graphic design poster typography bold", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_3", query: "abstract colorful painting artwork", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_4", query: "modern sculpture installation gallery", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_5", query: "creative branding design mockup", orientation: "landscape", w: 800, h: 600 },
      { slotId: "gallery_6", query: "fine art photography moody dramatic", orientation: "landscape", w: 800, h: 600 },
      { slotId: "team_1", query: "artist creative professional dark portrait", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_2", query: "designer creative portrait studio moody", orientation: "portrait", w: 480, h: 480 },
      { slotId: "team_3", query: "illustrator artist portrait professional", orientation: "portrait", w: 480, h: 480 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Picking rule: first result whose original dimensions ≥ slot minimum.
// Falls back to best available if none meet the minimum.
// ---------------------------------------------------------------------------

function pickBest(photos, minW, minH) {
  const exact = photos.find((p) => p.width >= minW && p.height >= minH);
  if (exact) return exact;
  return photos[0] || null;
}

function extForSlot(slotId) {
  return ".jpg";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log(`Starting template image sourcing (dry-run: ${DRY_RUN})`);
  log(`Target directory: ${PUBLIC_DIR}`);

  // Clean old category folders
  if (!DRY_RUN) {
    for (const cat of ["services", "restaurant", "retail", "professional", "portfolio"]) {
      const catDir = path.join(PUBLIC_DIR, cat);
      if (fs.existsSync(catDir)) {
        log(`Removing old category folder: ${cat}`);
        fs.rmSync(catDir, { recursive: true, force: true });
      }
    }
  }

  let totalSuccess = 0;
  let totalFail = 0;

  for (const tmpl of TEMPLATES) {
    const tmplDir = path.join(PUBLIC_DIR, tmpl.id);
    log(`\n--- Template: ${tmpl.id} (${tmpl.slots.length} images) ---`);

    for (const slot of tmpl.slots) {
      const ext = extForSlot(slot.slotId);
      const filename = `${slot.slotId}${ext}`;
      const destPath = path.join(tmplDir, filename);

      if (DRY_RUN) {
        log(`  [dry-run] ${tmpl.id}/${filename} ← "${slot.query}" (${slot.orientation}, ≥${slot.w}x${slot.h})`);
        totalSuccess++;
        continue;
      }

      log(`  Searching: "${slot.query}" (${slot.orientation})...`);
      const photos = await pexelsSearch(slot.query, slot.orientation, 10);

      if (photos.length === 0) {
        log(`  WARN: No results for "${slot.query}", skipping.`);
        totalFail++;
        continue;
      }

      const chosen = pickBest(photos, slot.w, slot.h);
      if (!chosen) {
        log(`  WARN: No usable photos for "${slot.query}", skipping.`);
        totalFail++;
        continue;
      }

      const downloadUrl = buildCropUrl(chosen.src.original, slot.w, slot.h);
      log(`  Downloading photo ${chosen.id} (${chosen.width}x${chosen.height}) → ${filename}`);
      const bytes = await downloadFile(downloadUrl, destPath);
      log(`  Saved ${(bytes / 1024).toFixed(0)}KB`);

      const dims = detectImageDimensions(destPath);
      if (dims.width < slot.w || dims.height < slot.h) {
        log(`  WARN: Dimensions ${dims.width}x${dims.height} < requested ${slot.w}x${slot.h}`);
      } else {
        log(`  OK: ${dims.width}x${dims.height} ≥ ${slot.w}x${slot.h}`);
      }

      totalSuccess++;
    }
  }

  log(`\n=== Done: ${totalSuccess} succeeded, ${totalFail} failed ===`);
  if (DRY_RUN) log("(dry-run mode — no files were written)");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
