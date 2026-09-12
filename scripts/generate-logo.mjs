/**
 * Builds every raster rendition of the Help24 mark from the brand vectors.
 *
 *   mobile-app/branding/help24-icon-dark.svg
 *        ↓  render
 *   public/help24-icon.png        768  the brand tile, transparent corners
 *        ↓  resize only
 *   public/icon-192.png           192  web app manifest (purpose: any)
 *
 *   mobile-app/branding/help24-icon-1024.png
 *        ↓  copy / resize
 *   public/help24-icon-bleed.png 1024  opaque, full-bleed ink — og:image
 *   public/icon-512.png           512  web app manifest (purpose: maskable)
 *   app/apple-icon.png            180  iOS home screen
 *
 *   mobile-app/branding/help24-favicon-32.png
 *        ↓  copy
 *   app/icon.png                   32  favicon, browser tabs (hand-drawn)
 *
 *   mobile-app/branding/help24-favicon.svg
 *        ↓  render
 *   app/icon1.png                  96  favicon, Google Search results
 *   app/favicon.ico            32 + 48  the /favicon.ico fallback
 *
 *   mobile-app/branding/help24-{lockup,mark}{,-on-dark}.svg
 *        ↓  copy
 *   public/help24-{lockup,mark}{,-on-dark}.svg  header, footer, download
 *
 * WHY THE SOURCES ARE VECTORS NOW
 * -------------------------------
 * The mark is two uprights with a gold crossbar floating between them, and the
 * GAPS either side of that bar are the whole idea — two parties, the payment
 * held in the middle, touching neither. Rendering each size from the vector
 * keeps those gaps geometrically exact. Deriving small sizes by resampling a
 * big raster is what closes them.
 *
 * WHY TWO MASTERS
 * ---------------
 * The tile carries its own boundary — a rounded tile with transparent corners.
 * Everywhere the site draws it itself, that boundary is the shape and nothing
 * may round it a second time.
 *
 * Two consumers apply a mask of their own and would cut into it: a
 * `purpose: maskable` manifest icon and the iOS touch icon (which also
 * composites transparency onto black). Those read the bleed master — a flat
 * ink square — so the platform's mask lands on brand Ink rather than on a
 * corner of the mark or a black triangle.
 *
 * THE FAVICON IS NOT A SMALL ICON. It is a separate drawing with widened gaps,
 * because below roughly 24px antialiasing fills the standard mark's gaps in and
 * it reads as a solid blob. It is copied at its native size, never generated
 * from the tile, and the tile is never shrunk into its place.
 *
 * NO `flatten()`. The tile carries its own ink field, so it needs no backing.
 * Flattening it onto white is how a logo becomes a white rectangle in a dark
 * footer.
 *
 * Run: npm run generate:logo
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// The vector sources, VENDORED INTO THIS REPO ON PURPOSE.
//
// The masters live in the app repo, at mobile-app/branding/. This script used
// to reach across to them by relative path, which works only on a machine where
// both repos happen to sit side by side — this is a separate repository, and a
// fresh clone of it has no sibling to reach. The renditions below are committed
// output, so a build never runs this script and the site deploys fine either
// way; but the script itself has to be runnable from the repo that contains it.
//
// The cost is that a change to the artwork has to be copied here. That is a
// deliberate trade: an explicit copy that a diff will show, rather than a path
// that silently resolves to something different depending on who checked out
// what. Keep brand/ in step with mobile-app/branding/ when the mark changes.
const BRAND = path.resolve(root, "brand");

const TILE_SVG = path.join(BRAND, "help24-icon-dark.svg");
const BLEED_SRC = path.join(BRAND, "help24-icon-1024.png");
const FAVICON_SRC = path.join(BRAND, "help24-favicon-32.png");
const FAVICON_SVG = path.join(BRAND, "help24-favicon.svg");

const TILE = path.join(root, "public", "help24-icon.png");
const BLEED = path.join(root, "public", "help24-icon-bleed.png");

/** Rasterise an SVG so its width lands on exactly `px`, preserving aspect. */
async function renderSvg(file, px) {
  const svg = await fs.readFile(file);
  const vb = svg.toString("utf8", 0, 400).match(/viewBox="([\d.\s-]+)"/);
  if (!vb) throw new Error(`no viewBox in ${path.basename(file)}`);
  const [, , vw, vh] = vb[1].trim().split(/\s+/).map(Number);
  return sharp(svg, { density: Math.min(2400, (72 * px) / vw) })
    .resize({ width: px, height: Math.round((px * vh) / vw), fit: "fill" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const report = (file, size, bytes, use) =>
  console.log(
    `  ${file.padEnd(30)} ${String(size).padStart(4)}px  ` +
      `${(bytes / 1024).toFixed(1).padStart(6)} KB   ${use}`,
  );

// ── the two masters ──────────────────────────────────────────────────────────
const tile768 = await renderSvg(TILE_SVG, 768);
await fs.writeFile(TILE, tile768);
report("public/help24-icon.png", 768, tile768.length, "master: tile, JSON-LD logo");

await fs.copyFile(BLEED_SRC, BLEED);
const bleedBytes = (await fs.stat(BLEED)).size;
report("public/help24-icon-bleed.png", 1024, bleedBytes, "master: bleed, og:image");

// ── derived ──────────────────────────────────────────────────────────────────
const OUTPUTS = [
  { src: TILE, file: ["public", "icon-192.png"], size: 192, use: "manifest, purpose any" },
  { src: BLEED, file: ["public", "icon-512.png"], size: 512, use: "manifest, purpose maskable" },
  { src: BLEED, file: ["app", "apple-icon.png"], size: 180, use: "iOS home screen" },
];

for (const { src, file, size, use } of OUTPUTS) {
  const out = await sharp(src)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await sharp(out).toFile(path.join(root, ...file));
  report(file.join("/"), size, out.length, use);
}

// ── copied verbatim ──────────────────────────────────────────────────────────
await fs.copyFile(FAVICON_SRC, path.join(root, "app", "icon.png"));
report("app/icon.png", 32, (await fs.stat(path.join(root, "app", "icon.png"))).size, "favicon — the widened-gap drawing");

// ── favicon for Google Search ────────────────────────────────────────────────
//
// WHY A SECOND FAVICON. The 32px drawing above is right for a browser tab and
// wrong for Google. Google Search requires a square favicon and recommends one
// LARGER than 48x48, because results render it at up to 48 device pixels on a
// high-density screen — a 32px source is upscaled there and goes soft, and the
// gaps either side of the crossbar are the first thing to blur shut.
//
// So the tab keeps its hand-drawn 32 (app/icon.png) and Google gets a 96 — a
// multiple of 48 — rendered from the same favicon drawing's VECTOR, never by
// enlarging the 32. Next's file convention accepts a numbered sibling, so both
// are declared as <link rel="icon"> and each consumer picks the size it wants.
const favicon96 = await renderSvg(FAVICON_SVG, 96);
await fs.writeFile(path.join(root, "app", "icon1.png"), favicon96);
report("app/icon1.png", 96, favicon96.length, "favicon — Google Search, 2x of 48");

// WHY /favicon.ico. It returned 404. Browsers, bookmark services and a lot of
// crawlers request /favicon.ico by convention before they read any <link> tag,
// and a 404 there is logged as a missing icon regardless of what the page
// declares. An ICO may carry PNG payloads, so this is a thin container around
// the hand-drawn 32 and a 48 rendered from the vector — no second artwork.
const favicon48 = await renderSvg(FAVICON_SVG, 48);
const ico = buildIco([
  { size: 32, png: await fs.readFile(FAVICON_SRC) },
  { size: 48, png: favicon48 },
]);
await fs.writeFile(path.join(root, "app", "favicon.ico"), ico);
report("app/favicon.ico", "32+48", ico.length, "favicon — the /favicon.ico fallback");

/**
 * An ICO container holding PNG images, which every browser since IE7 reads.
 *   6-byte header (reserved, type=1 icon, count)
 *   16-byte directory entry per image (w, h, colours, reserved, planes, bpp,
 *   byte length, offset), then the PNG bytes in the same order.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = header.length + dir.length;
  images.forEach(({ size, png }, i) => {
    const at = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, at);
    dir.writeUInt8(size >= 256 ? 0 : size, at + 1);
    dir.writeUInt8(0, at + 2);
    dir.writeUInt8(0, at + 3);
    dir.writeUInt16LE(1, at + 4);
    dir.writeUInt16LE(32, at + 6);
    dir.writeUInt32LE(png.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });
  return Buffer.concat([header, dir, ...images.map((img) => img.png)]);
}

for (const name of [
  "help24-lockup.svg",
  "help24-lockup-on-dark.svg",
  "help24-mark.svg",
  "help24-mark-on-dark.svg",
]) {
  await fs.copyFile(path.join(BRAND, name), path.join(root, "public", name));
  const bytes = (await fs.stat(path.join(root, "public", name))).size;
  report(`public/${name}`, "vec", bytes, "header / footer / download");
}
