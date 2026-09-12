import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { Section, SectionLabel } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/content";
import { Coverage } from "@/components/home/Coverage";
import { CategoryIcon } from "@/components/ds/CategoryIcon";
import { SERVICES, servicesByGroup } from "@/lib/services";
import { CITY_PAGES } from "@/lib/places";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, type Crumb } from "@/lib/jsonld";

/**
 * The catalogue hub.
 *
 * WHAT CHANGED HERE. This page used to be thirty-one chips in nine groups —
 * accurate, and a dead end. Every category is now a link to a page of its own,
 * which is what turns this from a list into the top of a crawl path: hub →
 * service → service in a city, with the city pages linking sideways to each
 * other. Chips became cards because a chip is not an obvious link and the
 * anchor text on a chip is one word.
 *
 * THE LIST IS STILL THE APP'S OWN. Every entry maps to a category the composer
 * can actually select; tests/services.test.ts fails if the two drift.
 */

export const metadata = pageMetadata({
  title: "Services on Help24 — Find Local Providers Across Kenya",
  description:
    "Every service Help24 covers, from plumbing and electrical to cleaning, moving, repairs and tutoring. Post a job free, compare offers from providers near you, and agree the price before work starts.",
  path: "/services",
});

const trail: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  const groups = servicesByGroup();

  return (
    <SitePage>
      <JsonLd data={breadcrumbLd(trail)} />

      <PageHero
        eyebrow="Services"
        title={`${SERVICES.length} services, one marketplace`}
        description="If it is work somebody nearby can do, it belongs on Help24. Each of these has a page explaining what the job involves, what to put in your request, and what moves the price."
        align="left"
      >
        <Breadcrumbs trail={trail} />
      </PageHero>

      {groups.map((group, i) => (
        <Section
          key={group.name}
          className={i === 0 ? "" : `border-t border-border ${i % 2 ? "bg-surface" : ""}`}
        >
          <SectionLabel>{group.name}</SectionLabel>
          <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
            {group.name}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="flex h-full items-start gap-3 rounded-card border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/40"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-tag bg-primary/10 text-primary">
                    <CategoryIcon name={s.icon} size={15} />
                  </span>
                  <span>
                    <span className="block text-body-lg font-semibold text-text-primary">
                      {s.category}
                    </span>
                    <span className="mt-1 block text-body-sm leading-relaxed text-text-secondary">
                      {s.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <Section className="border-t border-border">
        <div className="max-w-prose space-y-5 text-body-lg leading-relaxed text-text-secondary">
          <p>
            Nothing quite right? Post it under{" "}
            <span className="font-medium text-text-primary">Other</span> and describe it in your
            own words — providers see the description, not just the label.
          </p>
          <p>
            Looking for a particular place rather than a particular trade?{" "}
            <Link href="/areas" className="text-primary-bright hover:underline">
              See where Help24 works
            </Link>{" "}
            — {CITY_PAGES.length} cities have a page of their own, and the app carries every
            Kenyan city and all 47 county headquarters.
          </p>
        </div>
      </Section>

      <Coverage />

      <CtaBand
        title="Post it and see who answers"
        description="Free to post. You agree the price before anyone starts."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: "/for-providers", label: "Offer a service" }}
      />
    </SitePage>
  );
}
