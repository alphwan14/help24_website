import { ImageResponse } from "next/og";
import { APP_ICON_DATA_URI } from "@/lib/generated/app-icon";
import { ANDROID_RELEASE, formatBytes } from "@/lib/release";
import { SITE } from "@/lib/site";
// satori has no CSS custom properties, so this is the one renderer that needs
// the token VALUES rather than `var(--…)`. They still come from lib/tokens.ts.
import { PALETTE, withAlpha } from "@/lib/tokens";

/**
 * The social card for /download.
 *
 * Generated ONCE at build time by Next's file convention — the output is a
 * static PNG served from the CDN, so this costs a visitor nothing. It exists
 * because this link gets pasted into WhatsApp, which is how most people in
 * Kenya will actually receive it, and an unfurl showing the version and size
 * answers "is this the real thing?" before anyone taps.
 *
 * The version and size are read from the same config the page renders, so the
 * card cannot advertise a release the page isn't serving.
 */

export const alt = `Download ${SITE.name} for Android — v${ANDROID_RELEASE.version}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The EDGE bundle of `@vercel/og`, not the Node one.
 *
 * The Node build resolves its bundled font and wasm with
 * `path.join(import.meta.url, …)` — `path.join` applied to a file URL. On
 * Windows that rewrites `file:///C:/…` into `file:\C:\…`, which then throws
 * `Invalid URL`, so `next build` fails on every Windows machine while
 * succeeding on Vercel's Linux builders. A build that only works on the
 * deployment target is a trap for whoever runs it next.
 *
 * The edge bundle loads the same assets as wasm imports instead, which has no
 * path handling to get wrong. The image is still generated once at build time
 * and served as a static PNG; the runtime setting only decides which bundle
 * does the rendering.
 */
export const runtime = "edge";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: PALETTE["bg-dark"],
          // Mirrors the page's own radial glow so the card and the destination
          // read as the same surface.
          backgroundImage: `radial-gradient(ellipse 80% 60% at 20% 0%, ${withAlpha("primary", 0.22)}, transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, ${withAlpha("secondary", 0.12)}, transparent 60%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {/* The real app icon, compiled in as a data URI. The edge runtime has
              no filesystem and a build-time fetch would make the build depend
              on the deployment it produces — see scripts/generate-og-icon.mjs.
              People recognise the icon; a drawn substitute is the difference
              between an unfurl that looks official and one that looks like a
              phishing attempt. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={APP_ICON_DATA_URI}
            width={112}
            height={112}
            alt=""
            style={{ borderRadius: 26 }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: PALETTE["text-primary"],
                letterSpacing: "-0.02em",
              }}
            >
              Download Help24
            </div>
            <div style={{ fontSize: 30, color: PALETTE["text-secondary"], marginTop: 6 }}>
              for Android
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 32,
            color: PALETTE["text-secondary"],
            marginTop: 44,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Connect with trusted local service providers, find jobs, offer
          services, and get help whenever you need it.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: 52,
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: PALETTE.primary,
              color: PALETTE.white,
              fontSize: 28,
              fontWeight: 600,
              padding: "18px 34px",
              borderRadius: "14px",
            }}
          >
            Download for Android
          </div>
          <div style={{ display: "flex", fontSize: 26, color: PALETTE["text-tertiary"] }}>
            v{ANDROID_RELEASE.version} ·{" "}
            {formatBytes(ANDROID_RELEASE.apkSizeBytes)} ·{" "}
            {ANDROID_RELEASE.minimumAndroid}+
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: PALETTE["text-tertiary"],
            marginTop: "auto",
          }}
        >
          {SITE.domain}/download
        </div>
      </div>
    ),
    size,
  );
}
