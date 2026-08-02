/**
 * Builds every rendition of the Help24 mark from one source.
 *
 *   public/help24-icon.png   1024×1024 — the original, 173KB
 *        ↓  resize only
 *   public/help24-logo.png   192  header, footer, download page
 *   public/icon-192.png      192  web app manifest (purpose: any)
 *   public/icon-512.png      512  web app manifest (purpose: maskable)
 *   app/icon.png              96  favicon (Next file convention)
 *   app/apple-icon.png       180  iOS home screen
 *
 * THE SHAPE IS THE APP'S SHAPE.
 *
 * `mobile-app/assets/splash_badge.png` is what the app puts on screen at
 * launch: a 464×464 WHITE SQUARE with the mark sitting inside it at 56.0% ×
 * 50.4%, corners rounded at 95/464 = 20.5% of the side, on the #0A0A0A field.
 * Measured against the source icon, that is the same composition, pixel for
 * pixel — the splash badge is simply the square artwork with its corners cut.
 *
 * So these are a plain RESIZE. Nothing is trimmed and nothing is re-padded.
 *
 * An earlier version of this script trimmed the white margin so the mark
 * filled ~87% of the tile, on the theory that a bigger mark reads better at
 * 36px. It does not: the logo is drawn to sit in a square with air around it,
 * and cropping to its bounding box makes it look cramped and starved — the
 * whitespace is part of the artwork, not waste. The tile is made bigger
 * instead, which is the change that was actually needed.
 *
 * The corners are NOT baked in here. They are rounded in CSS at
 * `LOGO_CORNER_RATIO` (lib/tokens.ts), which is crisp at every size and
 * follows the element. Baking them would also be wrong for three of these
 * files: the maskable manifest icon and the iOS touch icon must be full-bleed
 * squares, because the platform applies its own mask and would cut a second
 * time.
 *
 * WEIGHT. `app/icon.png`, `app/apple-icon.png` and both manifest icon entries
 * used to be the same 1024×1024, 173KB file. A browser fetched it twice on
 * every page load — 347KB for a favicon and a manifest entry nobody looks at.
 * Each rendition is now the size it is actually used at.
 *
 * The background stays WHITE and opaque. The logo's "24" and "HELP" are black;
 * knocking the background out would make them invisible on the near-black
 * site, and recolouring them would no longer be the logo.
 *
 * `public/help24-icon.png` is left alone: it is the source here and the source
 * `generate-og-icon.mjs` reads. The Flutter app is read-only — the splash
 * badge above was measured, never modified, and the source used is the copy
 * already in this site's public/ directory.
 *
 * Run: npm run generate:logo
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "public", "help24-icon.png");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const OUTPUTS = [
  { file: ["public", "help24-logo.png"], size: 192, use: "header / footer / download" },
  { file: ["public", "icon-192.png"], size: 192, use: "manifest, purpose any" },
  { file: ["public", "icon-512.png"], size: 512, use: "manifest, purpose maskable" },
  { file: ["app", "icon.png"], size: 96, use: "favicon" },
  { file: ["app", "apple-icon.png"], size: 180, use: "iOS home screen" },
];

const meta = await sharp(SRC).metadata();
// Reported so a change to the source artwork is visible in the build log
// rather than discovered on the page.
const mark = await sharp(SRC).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
console.log(
  `source ${meta.width}×${meta.height}; mark occupies ` +
    `${((mark.info.width / meta.width) * 100).toFixed(1)}% × ` +
    `${((mark.info.height / meta.height) * 100).toFixed(1)}% ` +
    `(the app's splash badge is 56.0% × 50.4% — these should match)`,
);

for (const { file, size, use } of OUTPUTS) {
  const out = await sharp(SRC)
    .resize(size, size, { fit: "contain", background: WHITE })
    .flatten({ background: WHITE })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  await sharp(out).toFile(path.join(root, ...file));
  console.log(
    `  ${file.join("/").padEnd(24)} ${String(size).padStart(4)}px  ` +
      `${(out.length / 1024).toFixed(1).padStart(6)} KB   ${use}`,
  );
}
