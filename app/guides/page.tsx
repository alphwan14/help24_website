import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/content";
import { GUIDES } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, type Crumb } from "@/lib/jsonld";

/**
 * The guides hub.
 *
 * Three guides, not thirty. Each one is something Help24 can write from what it
 * actually knows — how a request becomes usable offers, what the Kenyan trade
 * credentials really are, and what has to be settled before work starts. The
 * obvious fourth, pricing, is missing on purpose and the page says so rather
 * than leaving a hole a reader has to notice.
 */

export const metadata = pageMetadata({
  title: "Guides — Hiring Local Services in Kenya",
  description:
    "Practical guides to hiring in Kenya: writing a job request that gets good offers, checking a fundi's licences and references, and what to agree before work starts.",
  path: "/guides",
});

const trail: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Guides", path: "/guides" },
];

export default function GuidesPage() {
  return (
    <SitePage>
      <JsonLd data={breadcrumbLd(trail)} />

      <PageHero
        eyebrow="Guides"
        title="Hiring, without the guesswork"
        description="Short, practical guides to getting work done well in Kenya — written from what Help24 sees go right and wrong between customers and providers."
        align="left"
      >
        <Breadcrumbs trail={trail} />
      </PageHero>

      <Section>
        <ul className="grid gap-4 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="flex h-full flex-col rounded-card border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/40"
              >
                <span className="text-label-md font-medium uppercase tracking-wider text-primary-bright">
                  {g.minutes} min read
                </span>
                <span className="mt-3 text-h4 font-semibold leading-snug text-text-primary">
                  {g.h1}
                </span>
                <span className="mt-3 text-body leading-relaxed text-text-secondary">
                  {g.standfirst}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 max-w-prose rounded-card border border-border bg-card p-6">
          <h2 className="text-body-lg font-semibold text-text-primary">
            What we have not written
          </h2>
          <p className="mt-2 text-body leading-relaxed text-text-secondary">
            There is no pricing guide here, and that is deliberate. Help24 launches in October
            2026 and does not yet have enough completed jobs to publish honest cost ranges for
            anything. Every service page explains what moves a quote up or down instead. When
            there is real transaction data to draw on, the numbers will follow.
          </p>
        </div>
      </Section>

      <CtaBand
        title="Post a job and see what comes back"
        description="Free to post. You agree the price before anyone starts."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: "/services", label: "Browse all services" }}
      />
    </SitePage>
  );
}
