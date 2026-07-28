/**
 * Generates the /download QR code as a static SVG.
 *
 * WHY THIS IS A BUILD STEP AND NOT A COMPONENT
 * -------------------------------------------
 * A QR code is a pure function of one string that changes approximately never
 * (see `QR_TARGET_URL` — it points at the page, not at a versioned artifact).
 * Encoding it in the browser would ship a Reed-Solomon implementation to every
 * visitor to render a picture that is identical every time. So it is rendered
 * once, here, into `public/download-qr.svg`, and the page serves it as an
 * ordinary image: no runtime dependency, no client JavaScript, no layout shift.
 *
 *   npm run generate:qr
 *
 * Re-run only if `QR_TARGET_URL` changes. Publishing a new APK does not
 * require it — that is the whole reason the QR points at the page.
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "..", "public", "download-qr.svg");

// Must match QR_ENCODED_URL in lib/release.ts. Kept as a literal because this
// script runs outside the TypeScript build; the check below is what stops the
// two drifting apart silently — a QR that disagrees with the page is a defect
// nobody notices until a printed flyer is already out in the world.
const TARGET = "https://help24.co.ke/download?src=qr";

const source = readFileSync(resolve(here, "..", "lib", "release.ts"), "utf8");
const base = source.match(/QR_TARGET_URL\s*=\s*"([^"]+)"/)?.[1];
const param = source.match(/QR_SCAN_PARAM\s*=\s*"([^"]+)"/)?.[1];
const declared = base && param ? `${base}?${param}` : undefined;
if (declared !== TARGET) {
  console.error(
    `QR target mismatch:\n  this script:    ${TARGET}\n  lib/release.ts: ${declared}\n` +
      "Update both, then re-run.",
  );
  process.exit(1);
}

const svg = await QRCode.toString(TARGET, {
  type: "svg",
  // Q (25%) rather than the M default: this code is meant to survive being
  // printed on a flyer, photographed off a laptop screen at an angle, and
  // scanned in a poorly lit room.
  errorCorrectionLevel: "Q",
  margin: 1,
  // Rendered on a light plate inside the card, because a QR inverted on a dark
  // background fails to scan on a meaningful number of older Android cameras.
  color: { dark: "#0A0A0A", light: "#FFFFFF" },
});

mkdirSync(dirname(OUT), { recursive: true });
// `width`/`height` are stripped so the SVG scales to its container; the
// viewBox carries the aspect ratio. The library already sets
// `shape-rendering="crispEdges"`, which is what keeps the modules sharp at any
// size instead of anti-aliasing them into mush — so only the accessible name
// is added here.
const scalable = svg
  .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, "<svg$1")
  .replace(
    "<svg",
    '<svg role="img" aria-label="QR code linking to the Help24 download page"',
  );

// Self-check: rebuild the module matrix from the SVG that will actually ship
// and compare it against the encoder's. The post-processing above only edits
// the opening <svg> tag, but "only" is exactly the assumption worth testing
// when the failure mode is a code that silently stops scanning.
const expected = QRCode.create(TARGET, { errorCorrectionLevel: "Q" }).modules;
const margin = 1;
const grid = Array.from({ length: expected.size }, () =>
  new Array(expected.size).fill(false),
);
// The renderer emits horizontal runs as `M<x> <y+0.5>h<n>` then `m<dx> <dy>h<n>`
// for each subsequent run. Two details matter and both are easy to get wrong:
//   * `m` is RELATIVE to where the pen currently is, and after `h<n>` the pen
//     sits at the END of the run — not where the run started;
//   * `y` is offset by 0.5 because these are stroked lines centred on the row.
let cursorX = 0;
let cursorY = 0;
for (const [, cmd, a, b, run] of scalable.matchAll(
  /([Mm])([\d.-]+) ([\d.-]+)h([\d.-]+)/g,
)) {
  const x = cmd === "M" ? Number(a) : cursorX + Number(a);
  const y = cmd === "M" ? Number(b) : cursorY + Number(b);
  const length = Number(run);
  const row = Math.floor(y) - margin;
  for (let i = 0; i < length; i++) {
    const col = Math.round(x) - margin + i;
    if (row >= 0 && row < expected.size && col >= 0 && col < expected.size) {
      grid[row][col] = true;
    }
  }
  cursorX = x + length;
  cursorY = y;
}

let mismatches = 0;
for (let row = 0; row < expected.size; row++) {
  for (let col = 0; col < expected.size; col++) {
    if (grid[row][col] !== Boolean(expected.get(row, col))) mismatches++;
  }
}
if (mismatches > 0) {
  console.error(
    `QR self-check FAILED: ${mismatches} of ${expected.size ** 2} modules differ ` +
      "from the encoder's output. The SVG post-processing has corrupted the code.",
  );
  process.exit(1);
}

writeFileSync(OUT, scalable, "utf8");
console.log(
  `wrote ${OUT}\n  encodes: ${TARGET}\n  ${expected.size}×${expected.size} modules, ECC Q, verified`,
);
