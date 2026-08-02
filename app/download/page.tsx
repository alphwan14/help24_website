import Image from "next/image";
import { SitePage } from "@/components/SitePage";
import { Section, SectionLabel } from "@/components/Section";
import { Icon } from "@/components/Icon";
import { DownloadButton } from "@/components/download/DownloadButton";
import { QrPanel } from "@/components/download/QrPanel";
import { CompatibilityRow } from "@/components/download/CompatibilityRow";
import { InstallSteps } from "@/components/download/InstallSteps";
import { VersionCard, ChecksumRow } from "@/components/download/VersionCard";
import { ReleaseNotes } from "@/components/download/ReleaseNotes";
import { TrustPoints } from "@/components/download/TrustPoints";
import { OfficialDownloadNotice } from "@/components/download/OfficialDownloadNotice";
import { DownloadFaq } from "@/components/download/DownloadFaq";
import { PlatformCards } from "@/components/download/PlatformCards";
import { COPY_SCRIPT, trackerScript } from "@/lib/analytics";
import {
  ANDROID_RELEASE,
  DOWNLOAD_FAQ,
  PRIMARY_PLATFORM,
  formatReleaseDate,
} from "@/lib/release";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { LOGO_CORNER_RATIO } from "@/lib/tokens";

/**
 * The Download page.
 *
 * A visitor arrives, understands what Help24 is, sees one obvious action, and
 * installs it. Nothing on this page asks them to know what GitHub is.
 *
 * HOW IT STAYS FAST
 * -----------------
 * The entire page is a Server Component and is statically generated — there is
 * no client component anywhere in the tree, so React ships no hydration work
 * for it. Everything interactive is done by two small inline scripts (platform
 * detection, and click delegation for analytics + copy), together under 2 KB,
 * and by native HTML: `<details>` for the disclosure, an `<a>` for the
 * download. The QR code is a build-time SVG, not a runtime encoder.
 *
 * HOW IT STAYS CORRECT
 * --------------------
 * Every fact — version, size, checksum, minimum Android, ABIs, release notes —
 * comes from `lib/release.ts`. There is no version string anywhere in this
 * file.
 *
 * And nothing in that config is typed by hand either: `npm run sync:release`
 * reads the published artifact and writes `lib/generated/release-artifact.ts`,
 * so the page cannot advertise a checksum or a byte count that disagrees with
 * the file the button actually serves. Shipping a release is that command plus
 * the release notes.
 */

export const metadata = pageMetadata({
  title: "Download Help24 for Android",
  description:
    "Download the official Help24 Android app to find trusted local services, offer professional services, and connect with your community.",
  path: "/download",
});

/**
 * Sets `data-platform` on <html> before the body paints.
 *
 * Inline and synchronous on purpose: doing this in React would mean the wrong
 * variant renders first and swaps after hydration, which is a visible flash on
 * the one page that must feel instant. With JS disabled the attribute is never
 * set, no rule matches, and every variant shows — the honest fallback.
 */
const PLATFORM_SCRIPT = `
(function(){var u=navigator.userAgent,p='desktop';
if(/Android/i.test(u))p='android';else if(/iPhone|iPad|iPod/i.test(u))p='ios';
document.documentElement.setAttribute('data-platform',p);})();
`;

/**
 * Rich result for the app itself. Gives search engines the version, price and
 * platform directly rather than making them infer it from prose.
 */
function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    operatingSystem: `Android ${ANDROID_RELEASE.minimumAndroid.replace("Android ", "")}+`,
    applicationCategory: "BusinessApplication",
    softwareVersion: ANDROID_RELEASE.version,
    datePublished: ANDROID_RELEASE.releaseDate,
    fileSize: `${Math.round(ANDROID_RELEASE.apkSizeBytes / 1024)}KB`,
    installUrl: `${SITE.url}/download`,
    downloadUrl: ANDROID_RELEASE.apkUrl,
    description: SITE.description,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    offers: { "@type": "Offer", price: "0", priceCurrency: "KES" },
  };
}

/**
 * The same FAQ the page renders, as structured data.
 *
 * Built from `DOWNLOAD_FAQ` rather than restated, so the answer Google shows
 * can never drift from the answer on the page. Mirrors what /help already does
 * with the Help Centre content.
 */
function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DOWNLOAD_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export default function DownloadPage() {
  return (
    <SitePage>
      <script
        dangerouslySetInnerHTML={{ __html: PLATFORM_SCRIPT }}
        // eslint-disable-next-line react/no-danger
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd()) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-radial-glow">
        <div
          className="bg-grid pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            {/* Left: the pitch and the action */}
            <div className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
              {/* Same square and same corner ratio as the header and the app's
                  launch badge, at 96px. */}
              <Image
                src="/help24-logo.png"
                alt=""
                width={192}
                height={192}
                sizes="96px"
                className="mb-6 h-24 w-24 bg-white shadow-card-glow"
                style={{ borderRadius: LOGO_CORNER_RATIO }}
                priority
              />
              <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                Download Help24
              </h1>
              <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
                Connect with trusted local service providers, find jobs, offer
                services, and get help whenever you need it.
              </p>

              <div className="mt-8 flex w-full flex-col items-center gap-4 lg:items-start">
                <DownloadButton
                  platform={PRIMARY_PLATFORM}
                  sizeBytes={ANDROID_RELEASE.apkSizeBytes}
                  className="w-full sm:w-auto"
                />
                {/* Will this run on my phone? Answered here, at the moment of
                    hesitation, rather than in the spec table further down. */}
                <CompatibilityRow />
                <p className="text-body-sm text-text-secondary">
                  Version {ANDROID_RELEASE.version} · released{" "}
                  {formatReleaseDate(ANDROID_RELEASE.releaseDate)}
                </p>
              </div>

              {/* iOS visitors are told the truth immediately rather than
                  being offered an APK they cannot install. */}
              <p className="only-ios mt-6 rounded-card border border-border bg-card px-4 py-3 text-body text-text-secondary">
                You&apos;re on iPhone — this download is for Android. Help24 for
                iOS is in development;{" "}
                <a
                  href={`mailto:${SITE.supportEmail}?subject=Notify%20me%20about%20Help24%20for%20iOS`}
                  className="font-medium text-primary-bright underline-offset-4 hover:underline"
                >
                  ask us to let you know
                </a>{" "}
                when it lands.
              </p>
            </div>

            {/* Right: QR for anyone reading this on a laptop */}
            <QrPanel />
          </div>
        </div>
      </section>

      {/* ── Install steps ────────────────────────────────────────────── */}
      <Section>
        <SectionLabel>Installing</SectionLabel>
        <h2 className="max-w-2xl text-h3 font-semibold text-text-primary sm:text-h2">
          Three steps, about a minute
        </h2>
        <p className="mt-3 max-w-2xl text-body-lg text-text-secondary">
          Help24 isn&apos;t on Google Play yet, so Android will ask you to
          confirm the install once. That&apos;s normal.
        </p>
        <div className="mt-8">
          <InstallSteps />
        </div>
      </Section>

      {/* ── Release detail ───────────────────────────────────────────── */}
      <Section className="border-t border-border bg-surface/40">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <div>
            <SectionLabel>This release</SectionLabel>
            <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
              What you&apos;re installing
            </h2>
            <p className="mt-3 text-body-lg leading-relaxed text-text-secondary">
              Published {formatReleaseDate(ANDROID_RELEASE.releaseDate)}. One
              file, no installer, no extras.
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <ReleaseNotes />
              <ChecksumRow />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <VersionCard />
            <DownloadButton
              platform={PRIMARY_PLATFORM}
              sizeBytes={ANDROID_RELEASE.apkSizeBytes}
              className="w-full"
            />
          </div>
        </div>
      </Section>

      {/* ── Trust ────────────────────────────────────────────────────── */}
      <Section className="border-t border-border">
        <SectionLabel>Safe to install</SectionLabel>
        <h2 className="max-w-2xl text-h3 font-semibold text-text-primary sm:text-h2">
          Official, and verifiable
        </h2>
        {/* Placed FIRST in this section, before the supporting points: it is
            the one claim on the page a user may need to act on. */}
        <div className="mt-8">
          <OfficialDownloadNotice />
        </div>
        <div className="mt-8">
          <TrustPoints />
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Section className="border-t border-border bg-surface/40">
        <SectionLabel>Questions</SectionLabel>
        <h2 className="max-w-2xl text-h3 font-semibold text-text-primary sm:text-h2">
          Before you install
        </h2>
        <p className="mt-3 max-w-2xl text-body-lg text-text-secondary">
          The short answers. Everything else lives in the{" "}
          <a
            href="/help"
            className="font-medium text-primary-bright underline-offset-4 hover:underline"
          >
            Help Centre
          </a>
          .
        </p>
        <div className="mt-8 max-w-3xl">
          <DownloadFaq />
        </div>
      </Section>

      {/* ── Other platforms ──────────────────────────────────────────── */}
      <Section className="border-t border-border">
        <SectionLabel>More platforms</SectionLabel>
        <h2 className="max-w-2xl text-h3 font-semibold text-text-primary sm:text-h2">
          Coming to the app stores
        </h2>
        <p className="mt-3 max-w-2xl text-body-lg text-text-secondary">
          We&apos;ll turn these on the moment each listing is live. The Android
          download above stays available either way.
        </p>
        <div className="mt-8">
          <PlatformCards />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-body text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <Icon name="mail" className="h-4 w-4 text-text-tertiary" />
            Trouble installing?{" "}
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="font-medium text-primary-bright underline-offset-4 hover:underline"
            >
              {SITE.supportEmail}
            </a>
          </span>
        </div>
      </Section>

      {/* Interaction: analytics delegation + checksum copy. Loaded after the
          document so neither can block first paint. */}
      <script
        dangerouslySetInnerHTML={{
          __html: trackerScript(ANDROID_RELEASE.version) + COPY_SCRIPT,
        }}
      />
    </SitePage>
  );
}
