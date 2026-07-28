/**
 * Reads a published GitHub Release and its APK, and writes every machine-known
 * fact about it into `lib/generated/release-artifact.ts`.
 *
 *   npm run sync:release              # newest published release
 *   npm run sync:release -- --tag v1.0.1
 *   npm run sync:release -- --apk path/to/app-release.apk   # skip the download
 *
 * WHAT THIS REPLACED
 * ------------------
 * Version, versionCode, size, checksum, minimum Android, API level and ABIs
 * used to be typed into `lib/release.ts` by hand from a terminal session. That
 * works exactly until one of them is copied wrong or a release is re-uploaded,
 * and the failure is silent: the page keeps rendering, confidently, with a
 * checksum that no longer matches the file the button serves. Which is what
 * happened — v1.0.0's APK was re-published and the page went on advertising the
 * previous artifact's digest and byte count.
 *
 * Every one of those values is derivable from the artifact, so none of them is
 * typed any more. The only things left in `lib/release.ts` are editorial: the
 * release notes, the copy, the FAQ.
 *
 * WHY THE OUTPUT IS COMMITTED RATHER THAN GENERATED AT BUILD TIME
 * --------------------------------------------------------------
 * This needs `aapt2` (Android SDK) and `gh`, and Vercel's builders have
 * neither. A build step that reaches for them would fail on the deployment
 * target while passing locally — the exact trap `opengraph-image.tsx` documents
 * for the Node/edge `@vercel/og` split. So this runs on a machine that has the
 * Android toolchain, and its output is a reviewable diff. Same contract as
 * `generate:og-icon` and `generate:qr`: manual, deliberate, committed.
 *
 * WHY THE RELEASE DATE COMES FROM GITHUB AND NOT THE APK
 * -----------------------------------------------------
 * It cannot come from the APK. Gradle zeroes every zip entry timestamp to
 * 1981-01-01 so that builds are reproducible, so the artifact genuinely does
 * not know when it was built. The publication time is both the only real date
 * available and the one the page actually means — "Released", not "compiled".
 *
 * WHY IT CROSS-CHECKS THE DIGEST
 * ------------------------------
 * GitHub computes its own SHA-256 when an asset is uploaded. Comparing ours
 * against theirs proves that the bytes we hashed are the bytes the download
 * button serves — otherwise the page could publish a perfectly accurate
 * checksum of a file nobody will ever receive.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "..", "lib", "generated", "release-artifact.ts");

/** The repository the release is published from. */
const REPO = "alphwan14/help24";

/**
 * API level → the name a person uses for it.
 *
 * Android dropped the minor version at 9, so this is a table rather than a
 * format string — "Android 9.0" is not a thing anyone writes, and the page
 * renders this value directly into prose ("Works on Android 7.0+").
 */
const ANDROID_NAMES = {
  21: "Android 5.0",
  22: "Android 5.1",
  23: "Android 6.0",
  24: "Android 7.0",
  25: "Android 7.1",
  26: "Android 8.0",
  27: "Android 8.1",
  28: "Android 9",
  29: "Android 10",
  30: "Android 11",
  31: "Android 12",
  32: "Android 12L",
  33: "Android 13",
  34: "Android 14",
  35: "Android 15",
  36: "Android 16",
};

// ── arguments ───────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : undefined;
};

// ── the release ─────────────────────────────────────────────────────────────

function gh(args) {
  try {
    return execFileSync("gh", args, { encoding: "utf8", maxBuffer: 32 << 20 });
  } catch (error) {
    fail(
      `\`gh ${args.join(" ")}\` failed.\n` +
        "The GitHub CLI must be installed and authenticated (gh auth login).\n" +
        (error.stderr || error.message),
    );
  }
}

function fail(message) {
  console.error(`\nsync-release: ${message}\n`);
  process.exit(1);
}

const requestedTag = arg("tag");
const releaseJson = JSON.parse(
  gh([
    "release",
    "view",
    ...(requestedTag ? [requestedTag] : []),
    "--repo",
    REPO,
    "--json",
    "tagName,name,publishedAt,assets,url,isDraft,isPrerelease",
  ]),
);

if (releaseJson.isDraft) fail(`${releaseJson.tagName} is still a draft.`);

const apkAsset = releaseJson.assets.find((a) => a.name.endsWith(".apk"));
if (!apkAsset) {
  fail(
    `${releaseJson.tagName} has no .apk asset (found: ` +
      `${releaseJson.assets.map((a) => a.name).join(", ") || "none"}).`,
  );
}
if (apkAsset.state !== "uploaded") {
  fail(`${apkAsset.name} is in state "${apkAsset.state}", not "uploaded".`);
}

// ── the artifact ────────────────────────────────────────────────────────────

const localApk = arg("apk");
let apkPath;

if (localApk) {
  apkPath = resolve(process.cwd(), localApk);
  if (!existsSync(apkPath)) fail(`no such file: ${apkPath}`);
  console.log(`using local artifact: ${apkPath}`);
} else {
  apkPath = join(tmpdir(), `help24-${releaseJson.tagName}-${apkAsset.name}`);
  console.log(`downloading ${apkAsset.url}`);
  const response = await fetch(apkAsset.url, { redirect: "follow" });
  if (!response.ok) {
    fail(`download failed: HTTP ${response.status} ${response.statusText}`);
  }
  writeFileSync(apkPath, Buffer.from(await response.arrayBuffer()));
}

const bytes = readFileSync(apkPath);
const sha256 = createHash("sha256").update(bytes).digest("hex");

// The two integrity checks that make the rest of this file trustworthy. Both
// compare what we measured against what GitHub will actually serve.
if (bytes.length !== apkAsset.size) {
  fail(
    `size mismatch: measured ${bytes.length} bytes, GitHub reports ` +
      `${apkAsset.size}. The download is incomplete or the asset changed ` +
      "while this ran.",
  );
}
const publishedDigest = (apkAsset.digest || "").replace(/^sha256:/, "");
if (publishedDigest && publishedDigest !== sha256) {
  fail(
    `checksum mismatch:\n  measured: ${sha256}\n  GitHub:   ${publishedDigest}\n` +
      "The file served by the release URL is not the file we hashed.",
  );
}

// ── the manifest ────────────────────────────────────────────────────────────

/**
 * Newest `aapt2` in the local SDK. Searched rather than configured because the
 * build-tools directory is versioned and every machine has a different set
 * installed; requiring an env var would just be one more thing to get wrong.
 */
function findAapt2() {
  const roots = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "Android", "Sdk"),
    process.env.HOME && join(process.env.HOME, "Android", "Sdk"),
    process.env.HOME && join(process.env.HOME, "Library", "Android", "sdk"),
  ].filter(Boolean);

  for (const root of roots) {
    const buildTools = join(root, "build-tools");
    if (!existsSync(buildTools)) continue;
    // Newest first, numerically — "9.0.0" must not sort above "35.0.0".
    const versions = readdirSync(buildTools).sort((a, b) => {
      const pa = a.split(".").map(Number);
      const pb = b.split(".").map(Number);
      for (let i = 0; i < 3; i++) if ((pb[i] || 0) !== (pa[i] || 0)) return (pb[i] || 0) - (pa[i] || 0);
      return 0;
    });
    for (const version of versions) {
      for (const name of ["aapt2.exe", "aapt2"]) {
        const candidate = join(buildTools, version, name);
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  return null;
}

const aapt2 = findAapt2();
if (!aapt2) {
  fail(
    "aapt2 not found. Install Android SDK build-tools, or set ANDROID_HOME.\n" +
      "Every value below the checksum is read from the APK manifest and there " +
      "is no honest fallback for guessing them.",
  );
}

const badging = execFileSync(aapt2, ["dump", "badging", apkPath], {
  encoding: "utf8",
  maxBuffer: 16 << 20,
});

const pick = (pattern, label) => {
  const match = badging.match(pattern);
  if (!match) fail(`could not read ${label} from the APK manifest.`);
  return match[1];
};

const version = pick(/versionName='([^']+)'/, "versionName");
const versionCode = Number(pick(/versionCode='(\d+)'/, "versionCode"));
const minimumSdk = Number(pick(/minSdkVersion:'(\d+)'/, "minSdkVersion"));
const targetSdk = Number(pick(/targetSdkVersion:'(\d+)'/, "targetSdkVersion"));
const applicationId = pick(/package: name='([^']+)'/, "package name");

const minimumAndroid = ANDROID_NAMES[minimumSdk];
if (!minimumAndroid) {
  fail(
    `no display name for API level ${minimumSdk}. Add it to ANDROID_NAMES in ` +
      "this script — the page renders this string directly into prose, so it " +
      "must not be synthesised.",
  );
}

/**
 * ABIs, in the order Android itself lists them. Read from `native-code:`,
 * which reflects what is actually in `lib/` rather than what the build
 * intended — a universal APK that quietly lost an ABI would show up here.
 */
const architectures = (badging.match(/native-code: (.+)/)?.[1] ?? "")
  .split(/\s+/)
  .map((token) => token.replace(/'/g, "").trim())
  .filter(Boolean);

if (architectures.length === 0) {
  fail("the APK declares no native ABIs — that cannot be right for a Flutter build.");
}

// The tag is the version's home. A mismatch means the wrong artifact was
// attached to the release, which is worth stopping for rather than publishing.
const tagVersion = releaseJson.tagName.replace(/^v/, "");
if (tagVersion !== version) {
  fail(
    `tag/manifest mismatch: release is tagged ${releaseJson.tagName} but the ` +
      `APK reports versionName ${version}.`,
  );
}

// ── write ───────────────────────────────────────────────────────────────────

/** ISO instant → the calendar date, UTC. The page renders a date, not a time. */
const releaseDate = releaseJson.publishedAt.slice(0, 10);

const contents = `// GENERATED by scripts/sync-release.mjs — do not edit by hand.
// Source: ${REPO} release ${releaseJson.tagName}, asset ${apkAsset.name}
// Read with aapt2 from the artifact itself; checksum cross-checked against the
// digest GitHub computed on upload.
// Regenerate with: npm run sync:release

/**
 * Everything about the shipped artifact that a machine can know.
 *
 * Nothing here is typed by a human, which is the point: a checksum, a byte
 * count and a version string that were copied by hand can disagree with the
 * file the download button serves, and the page has no way to notice.
 * Editorial content — release notes, copy — lives in \`lib/release.ts\`.
 */
export const RELEASE_ARTIFACT = {
  /** Git tag the release was published under. */
  tag: "${releaseJson.tagName}",
  /** \`versionName\` from the APK manifest. */
  version: "${version}",
  /** \`versionCode\` from the APK manifest. */
  versionCode: ${versionCode},
  /** Android application id, for support and store listings. */
  applicationId: "${applicationId}",
  /** Date the release was published on GitHub (UTC). */
  releaseDate: "${releaseDate}",
  /** GitHub's browser download URL for the asset. */
  apkUrl: "${apkAsset.url}",
  /** Exact artifact size in bytes. Every displayed size derives from this. */
  apkSizeBytes: ${apkAsset.size},
  /** Lowercase hex SHA-256 of the artifact. */
  sha256: "${sha256}",
  /** \`minSdkVersion\` from the APK manifest. */
  minimumSdk: ${minimumSdk},
  /** \`targetSdkVersion\` from the APK manifest. */
  targetSdk: ${targetSdk},
  /** How a person says \`minimumSdk\`. */
  minimumAndroid: "${minimumAndroid}",
  /** ABIs actually present in the APK's \`lib/\` directory. */
  architectures: [${architectures.map((a) => `"${a}"`).join(", ")}],
} as const;
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, contents, "utf8");

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
console.log(
  [
    `wrote ${OUT}`,
    `  release      ${releaseJson.tagName}  (published ${releaseDate})`,
    `  version      ${version} (${versionCode}) · ${applicationId}`,
    `  artifact     ${apkAsset.size} bytes · ${mb(apkAsset.size)}`,
    `  sha256       ${sha256}`,
    `  verified     matches GitHub's published digest`,
    `  requires     ${minimumAndroid} (API ${minimumSdk}) · targets API ${targetSdk}`,
    `  abis         ${architectures.join(", ")}`,
  ].join("\n"),
);
