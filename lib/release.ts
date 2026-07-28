import { RELEASE_ARTIFACT } from "@/lib/generated/release-artifact";

/**
 * THE ONE FILE YOU EDIT TO SHIP A RELEASE — and it no longer contains a single
 * number.
 *
 * Everything the /download page states about the app comes from here, and this
 * file gets it from two places that do not overlap:
 *
 *   * the ARTIFACT — version, versionCode, size, checksum, minimum Android,
 *     API level, ABIs, publication date. Read from the APK and the GitHub
 *     release by `scripts/sync-release.mjs` into `lib/generated/`. Never typed.
 *   * the EDITORIAL — release notes, platform copy, trust points, FAQ. Written
 *     by a person, below.
 *
 * SHIPPING A RELEASE
 * ------------------
 *   1. publish the GitHub release with its APK attached
 *   2. npm run sync:release
 *   3. write the release notes in `ANDROID_RELEASE.releaseNotes`
 *
 * Step 2 is the whole reason this split exists. `apkSizeBytes` and `sha256`
 * used to be pasted in from a terminal, and a download page that states a
 * checksum has no way to notice when the paste goes stale — it renders
 * confidently either way, and the checksum is the half people actually verify.
 * That is not hypothetical: v1.0.0's APK was re-published, and the page went on
 * advertising the previous artifact's digest and byte count until the mismatch
 * was found by hand.
 *
 * The display strings are still DERIVED from the raw values (see `formatBytes`)
 * rather than written down, for the same reason.
 */

/**
 * The direct APK link — GitHub's own download URL for the asset on the release
 * that `sync:release` last read.
 *
 * Deliberately NOT the URL behind the QR code — see `QR_TARGET_URL`.
 */
export const APK_DOWNLOAD_URL: string = RELEASE_ARTIFACT.apkUrl;

/**
 * What the QR code points at: this page, never the artifact.
 *
 * A QR pointing straight at a versioned APK would have to be reprinted for
 * every release, and any copy already in the wild — a poster, a shop window, a
 * WhatsApp forward — would go on serving an old build forever. Pointing at the
 * page makes the QR permanent and the release detail dynamic.
 *
 * This is also the URL shown to humans next to the code.
 */
export const QR_TARGET_URL = "https://help24.co.ke/download";

/**
 * The query marker that makes a scan attributable.
 *
 * A QR scan is an ordinary page view: the camera opens a browser and nothing
 * distinguishes it from someone typing the address. Attribution therefore has
 * to be carried IN the link — there is no other mechanism. The parameter is
 * version-independent, so the code still never needs reprinting, and the
 * canonical URL stays param-free so search engines see one page.
 */
export const QR_SCAN_PARAM = "src=qr";

/** Exactly what the printed code encodes. */
export const QR_ENCODED_URL = `${QR_TARGET_URL}?${QR_SCAN_PARAM}`;

export interface AndroidRelease {
  /** Marketing version, exactly as `versionName` in the APK manifest. */
  version: string;
  /** Android `versionCode`. Surfaced for support, not for users. */
  versionCode: number;
  /** ISO date the release was published. Rendered in the reader's locale. */
  releaseDate: string;
  apkUrl: string;
  /** Exact size of the artifact, in bytes. Display strings derive from this. */
  apkSizeBytes: number;
  /** Lowercase hex SHA-256 of the APK, for anyone who wants to verify it. */
  sha256: string;
  /** Minimum Android release, as a person would say it. */
  minimumAndroid: string;
  /** The API level behind `minimumAndroid`, for the spec-minded. */
  minimumSdk: number;
  /**
   * ABIs bundled in the APK — a universal build carries several.
   *
   * `readonly` because it arrives from a generated `as const` object. Widening
   * it to a mutable array here would mean copying, and a copy is a place for
   * the two to disagree.
   */
  architectures: readonly string[];
  /** Short, honest, user-facing. Not a changelog. */
  releaseNotes: string[];
}

/**
 * The shipped release.
 *
 * The spread is every fact `sync:release` read from the APK and the GitHub
 * release — version, versionCode, date, URL, size, checksum, minimum Android,
 * API level, ABIs. It is spread rather than restated so that adding a field to
 * the generated artifact makes it available here without an edit, and so that
 * nothing in this file can contradict the binary.
 *
 * Only the notes are written by hand, because only the notes are a judgement
 * about what mattered to users. Update them when you publish; everything else
 * updates itself.
 */
export const ANDROID_RELEASE: AndroidRelease = {
  ...RELEASE_ARTIFACT,
  releaseNotes: [
    "Smarter recommendations — the Discover feed ranks by distance, profession and urgency",
    "A calm feed that no longer reorders itself while you read it",
    "More accurate location, so nearby really means nearby",
    "Faster messaging and better offline behaviour",
    "Performance, security and reliability improvements throughout",
  ],
};

/**
 * A distribution channel. The page renders one card per entry, so adding
 * Google Play, the App Store or Huawei AppGallery later is an object here —
 * no component changes, no layout surgery.
 */
export interface Platform {
  id: string;
  /** Shown on the card. */
  name: string;
  /** One line: who this is for. */
  tagline: string;
  /** Icon name from `components/Icon`. */
  icon: string;
  /** Null until the channel exists — the card then renders as "Coming soon". */
  url: string | null;
  available: boolean;
  /** Label for the action when `available`. */
  ctaLabel: string;
  /** Analytics id for the click event. */
  trackId: string;
}

export const PLATFORMS: Platform[] = [
  {
    id: "android-apk",
    name: "Android",
    tagline: `Direct download · ${ANDROID_RELEASE.minimumAndroid} and above`,
    icon: "android",
    url: ANDROID_RELEASE.apkUrl,
    available: true,
    ctaLabel: "Download for Android",
    trackId: "android_apk",
  },
  {
    id: "google-play",
    name: "Google Play",
    tagline: "Automatic updates, once we're listed",
    icon: "play",
    url: null,
    available: false,
    ctaLabel: "Get it on Google Play",
    trackId: "google_play",
  },
  {
    id: "app-store",
    name: "App Store",
    tagline: "iPhone and iPad — in development",
    icon: "apple",
    url: null,
    available: false,
    ctaLabel: "Download on the App Store",
    trackId: "app_store",
  },
];

/** The channel the big button uses. */
export const PRIMARY_PLATFORM = PLATFORMS[0];

/** Channels other than the primary one, for the "More platforms" grid. */
export const SECONDARY_PLATFORMS = PLATFORMS.filter(
  (p) => p.id !== PRIMARY_PLATFORM.id,
);

export interface InstallStep {
  title: string;
  body: string;
}

/**
 * Three steps. Not four.
 *
 * Sideloading only genuinely surprises people once — at the "unknown sources"
 * prompt — so that is the only step that gets an explanation rather than an
 * instruction.
 */
export const INSTALL_STEPS: InstallStep[] = [
  {
    title: "Download the APK",
    body: "Tap the button above. Your browser may ask you to confirm the download.",
  },
  {
    title: "Allow the install",
    body: "Android asks permission the first time you install outside the Play Store. Tap Settings, turn on the switch, then go back.",
  },
  {
    title: "Open Help24 and sign in",
    body: "Create an account with your phone number or email, and you're ready to go.",
  },
];

/**
 * The three facts that decide whether the APK will run on the phone in the
 * reader's hand, shown next to the button rather than buried in a spec table.
 *
 * Derived, not written down: same source as the version card, so the two can
 * never disagree.
 */
export function compatibility(
  release: AndroidRelease = ANDROID_RELEASE,
): { icon: string; label: string; value: string }[] {
  return [
    {
      icon: "android",
      label: "Works on",
      value: `${release.minimumAndroid}+`,
    },
    {
      icon: "chip",
      label: "Architecture",
      // "Universal" is the honest summary: this APK carries every ABI Android
      // ships on, so there is no variant for the reader to choose between.
      value: "Universal",
    },
    {
      icon: "download",
      label: "Download size",
      value: formatBytes(release.apkSizeBytes),
    },
  ];
}

/**
 * The official distribution channels, in the order a user should trust them.
 *
 * Stated explicitly because sideloading teaches people to accept APKs from
 * wherever, and a marketplace app handling M-Pesa payments is exactly the kind
 * of thing that attracts repackaged, trojanised copies. Naming the only two
 * legitimate sources gives someone a way to check.
 */
export const OFFICIAL_SOURCES = [
  {
    label: `${new URL(QR_TARGET_URL).host}/download`,
    href: QR_TARGET_URL,
    detail: "This page — always the current release",
  },
  {
    label: "github.com/alphwan14/help24/releases",
    href: "https://github.com/alphwan14/help24/releases",
    detail: "The signed artifacts themselves, with checksums",
  },
] as const;

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * The three questions people actually ask before installing an APK.
 *
 * Not a help centre — the full one lives at /help. These are only the
 * objections that stop someone completing THIS page: is it safe, will it
 * update itself, and what will it cost me.
 */
export const DOWNLOAD_FAQ: FaqItem[] = [
  {
    q: "How do I install the APK?",
    a: "Tap Download for Android, then open the file when it finishes. Because Help24 isn't on Google Play yet, Android will ask you once for permission to install from this source — tap Settings, turn the switch on, then go back. The install takes a few seconds and Help24 appears in your app drawer like any other app.",
  },
  {
    q: "How do I get updates?",
    a: "Help24 tells you in the app when a new version is available, and you download it from this page the same way. Installing over the top keeps your account, messages and saved items — you never need to uninstall first. Once we're on Google Play, updates become automatic.",
  },
  {
    q: "Is Help24 free?",
    a: "Yes. The app is free to download and free to use — posting a request, browsing offers, messaging and applying for jobs all cost nothing. Help24 charges a service fee only when money actually moves through a completed job, and you always see that amount before you agree to anything.",
  },
  {
    q: "Is it safe to install an app from outside the Play Store?",
    a: "It is when you know where it came from. This APK is built and signed by Help24, published from our own repository, and its SHA-256 checksum is listed on this page so you can verify the exact file you downloaded. Only ever install Help24 from help24.co.ke or our official GitHub releases.",
  },
  {
    q: "Which phones does it work on?",
    a: `Any phone running ${ANDROID_RELEASE.minimumAndroid} or later — that covers the large majority of Android devices in use. The download includes support for every processor type Android runs on, so there is no variant to choose between. An iPhone version is in development.`,
  },
];

export interface TrustPoint {
  icon: string;
  title: string;
  body: string;
}

export const TRUST_POINTS: TrustPoint[] = [
  {
    icon: "badge",
    title: "Built and signed by Help24",
    body: "This is the official build, published by us. Nobody else can sign an update for it.",
  },
  {
    icon: "shield",
    title: "The only official download",
    body: `Help24 is distributed from ${new URL(QR_TARGET_URL).host} and nowhere else.`,
  },
  {
    icon: "no-ads",
    title: "No ads, no bundled software",
    body: "The APK contains the app and nothing else — no third-party installers, no toolbars.",
  },
  {
    icon: "lock",
    title: "Verifiable",
    body: "Check the SHA-256 below against your download to prove the file arrived intact.",
  },
];

/**
 * Bytes → a size a person recognises.
 *
 * Binary units (MiB semantics under an "MB" label), because that is what
 * Android's own installer and every file manager on the device will show —
 * matching them matters more here than matching the SI definition, since the
 * whole point is that the number agrees with what the user sees next.
 */
export function formatBytes(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

/** ISO date → "28 July 2026". Fixed locale so server and client agree. */
export function formatReleaseDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The rows of the version card, derived so nothing is written down twice. */
export function releaseSpecs(
  release: AndroidRelease = ANDROID_RELEASE,
): { label: string; value: string }[] {
  return [
    { label: "Version", value: `v${release.version}` },
    { label: "Released", value: formatReleaseDate(release.releaseDate) },
    { label: "Size", value: formatBytes(release.apkSizeBytes) },
    { label: "Requires", value: `${release.minimumAndroid} or later` },
    { label: "Architecture", value: release.architectures.join(", ") },
  ];
}
