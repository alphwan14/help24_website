import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { BrandMark } from "@/components/Brand";
import { DownloadButton } from "@/components/download/DownloadButton";
import { trackerScript } from "@/lib/analytics";
import { ANDROID_RELEASE, PRIMARY_PLATFORM } from "@/lib/release";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

/**
 * An agent's invitation: `help24.co.ke/a/H24-7K3Q` (shared as a link) or
 * `…?src=qr` (printed as a QR code). See docs/partner-portal-plan.md in the
 * app repository.
 *
 * With Help24 installed, Android opens the link straight in the app (App
 * Links, verified by /.well-known/assetlinks.json) and the app credits the
 * agent. This page is for everyone else: download, then come back and tap
 * "Open Help24" — an intent:// link that hands the code to the app even where
 * the browser would not — or type the code when signing up.
 *
 * Nothing here credits anyone. The app does, as the signed-in member, through
 * the server's rules (one agent per member, first 3 days, never your own code).
 */

/** No 0/O/1/I, 4–6 characters after H24- (migration 127's CHECK). */
function normalize(raw: string): string | null {
  let s = decodeURIComponent(raw).toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (s.startsWith("H24")) s = s.slice(3);
  return /^[A-HJ-NP-Z2-9]{4,6}$/.test(s) ? `H24-${s}` : null;
}

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ src?: string }> };

export async function generateMetadata({ params }: Props) {
  const code = normalize((await params).code) ?? "invite";
  // An invitation is for the person it was given to — never in search results.
  return pageMetadata({
    title: "You're invited to Help24",
    description: "Download Help24 and add your agent's code when you sign up.",
    path: `/a/${code}`,
    robots: "noindex",
  });
}

export default async function AgentInvitePage({ params, searchParams }: Props) {
  const code = normalize((await params).code);
  if (!code) notFound();
  const fromQr = (await searchParams).src === "qr";

  const appLink = `help24.co.ke/a/${code}${fromQr ? "?src=qr" : ""}`;
  const fallback = encodeURIComponent(`${SITE.url}/download`);
  const openInApp = `intent://${appLink}#Intent;scheme=https;package=com.help24.help24;S.browser_fallback_url=${fallback};end`;

  const track = `${trackerScript(ANDROID_RELEASE.version)}
window.help24Track('agent_link_open', { agent_code: ${JSON.stringify(code)}, source: ${JSON.stringify(fromQr ? "qr" : "link")} });
document.addEventListener('click', function (e) {
  var btn = e.target && e.target.closest && e.target.closest('[data-copy-code]');
  if (!btn || !navigator.clipboard) return;
  navigator.clipboard.writeText(btn.getAttribute('data-copy-code')).then(function () {
    var done = btn.querySelector('[data-copy-done]'); if (done) done.hidden = false;
  });
});`;

  return (
    <SitePage>
      <section className="relative overflow-hidden border-b border-border bg-atmosphere">
        <div className="relative mx-auto flex max-w-xl flex-col items-center px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <BrandMark className="mb-6 h-16 w-auto" priority />
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">You&apos;re invited to Help24</h1>
          <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
            A Help24 agent shared this with you. Find trusted local help, or offer your own services — and let your agent be
            thanked for helping you join.
          </p>

          <div className="mt-8 w-full rounded-card border border-border bg-card px-6 py-5">
            <p className="text-sm font-medium text-text-secondary">Your agent&apos;s code</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-text-primary" data-testid="agent-code">
              {code}
            </p>
            <button
              type="button"
              data-copy-code={code}
              className="mt-3 inline-flex items-center gap-2 rounded-button border border-border px-4 py-2 text-sm font-semibold text-text-primary"
            >
              Copy code <span data-copy-done hidden className="text-success">✓ Copied</span>
            </button>
          </div>

          <ol className="mt-8 w-full space-y-5 text-left">
            <li className="flex gap-3">
              <span className="font-bold text-text-primary">1.</span>
              <div className="flex-1">
                <p className="font-semibold text-text-primary">Download Help24</p>
                <DownloadButton platform={PRIMARY_PLATFORM} sizeBytes={ANDROID_RELEASE.apkSizeBytes} className="mt-3 w-full" />
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-text-primary">2.</span>
              <div className="flex-1">
                <p className="font-semibold text-text-primary">Once it&apos;s installed, open it from here</p>
                <p className="mt-1 text-sm text-text-secondary">Your agent&apos;s code goes in by itself.</p>
                <a
                  href={openInApp}
                  data-track="agent_open_app"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-button border-2 border-primary bg-card px-6 py-4 text-body-lg font-semibold text-primary"
                >
                  Open Help24
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-text-primary">3.</span>
              <p className="flex-1 text-sm text-text-secondary">
                Or type <span className="font-mono font-semibold text-text-primary">{code}</span> in “Agent code” when you set
                up your profile — or later in Profile → Who helped you join? You have 3 days after joining.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <script dangerouslySetInnerHTML={{ __html: track }} />
    </SitePage>
  );
}
