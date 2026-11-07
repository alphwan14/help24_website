import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { BrandMark } from "@/components/Brand";
import { DownloadButton } from "@/components/download/DownloadButton";
import { trackerScript } from "@/lib/analytics";
import { initials, loadProviderCard } from "@/lib/provider-card";
import { ANDROID_RELEASE, PRIMARY_PLATFORM } from "@/lib/release";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

/**
 * A provider's Help24 card: `help24.co.ke/p/<id>` (shared as a link) or
 * `…?src=qr` (scanned from the card). See lib/provider-card.ts.
 *
 * With Help24 installed, Android opens the link straight in the app (App
 * Links, verified by /.well-known/assetlinks.json) on the provider's profile.
 * This page is for everyone else: who the provider is, then download, then
 * "Open in Help24" — an intent:// link that carries the profile into the app
 * even where the browser would not.
 */

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ src?: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const card = await loadProviderCard(id);
  // A person's card is for the people they hand it to — never a search result.
  return pageMetadata({
    // The layout's title template adds " · Help24".
    title: card ? `${card.name}, ${card.profession}` : "Provider",
    description: card
      ? `See ${card.name}'s profile and message them on Help24.`
      : "Find trusted local help on Help24.",
    path: `/p/${id}`,
    robots: "noindex",
  });
}

export default async function ProviderCardPage({ params, searchParams }: Props) {
  const { id } = await params;
  const card = await loadProviderCard(id);
  if (!card) notFound();
  const fromQr = (await searchParams).src === "qr";
  const firstName = card.name.split(/\s+/)[0];

  const appLink = `help24.co.ke/p/${card.id}${fromQr ? "?src=qr" : ""}`;
  const fallback = encodeURIComponent(`${SITE.url}/download`);
  const openInApp = `intent://${appLink}#Intent;scheme=https;package=com.help24.help24;S.browser_fallback_url=${fallback};end`;

  // Collected first-party (lib/analytics.ts → /api/e → Help24's own
  // database), so the card's owner can be counted: "is this provider handing
  // their card out?" is the question Phase A is judged on. It never reaches a
  // third party, and no cookie or visitor identifier is involved.
  const track = `${trackerScript(ANDROID_RELEASE.version)}
window.help24Track('provider_card_open', { source: ${JSON.stringify(fromQr ? "qr" : "link")}, provider_id: ${JSON.stringify(card.id)} });`;

  return (
    <SitePage>
      <section className="relative overflow-hidden border-b border-border bg-atmosphere">
        <div className="relative mx-auto flex max-w-xl flex-col items-center px-4 pb-16 pt-12 text-center sm:px-6 sm:pt-16">
          <BrandMark className="mb-8 h-12 w-auto" priority />

          <div className="w-full rounded-card border border-border bg-card px-6 py-6">
            <div className="flex items-center gap-4 text-left">
              {card.photoUrl ? (
                // A member's own photo from their profile; not a site asset to optimise.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.photoUrl}
                  alt=""
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary"
                >
                  {initials(card.name)}
                </span>
              )}
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-text-primary" data-testid="provider-name">
                  {card.name}
                </h1>
                <p className="mt-0.5 font-semibold text-primary">{card.profession}</p>
                {card.record ? <p className="mt-1 text-sm text-text-secondary">{card.record}</p> : null}
              </div>
            </div>
            {card.bio ? <p className="mt-5 whitespace-pre-line text-left text-text-secondary">{card.bio}</p> : null}
            {card.memberSinceYear ? (
              <p className="mt-4 text-left text-sm text-text-secondary">On Help24 since {card.memberSinceYear}</p>
            ) : null}
          </div>

          <h2 className="mt-10 text-xl font-bold text-text-primary">Message {firstName} on Help24</h2>
          <ol className="mt-6 w-full space-y-5 text-left">
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
                <p className="font-semibold text-text-primary">Once it&apos;s installed, open {firstName}&apos;s profile from here</p>
                <a
                  href={openInApp}
                  data-track="provider_card_open_app"
                  data-track-provider={card.id}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-button border-2 border-primary bg-card px-6 py-4 text-body-lg font-semibold text-primary"
                >
                  Open in Help24
                </a>
              </div>
            </li>
          </ol>
          <p className="mt-8 text-sm text-text-secondary">
            Reviews and jobs on this card come from work done through Help24.
          </p>
        </div>
      </section>
      <script dangerouslySetInnerHTML={{ __html: track }} />
    </SitePage>
  );
}
