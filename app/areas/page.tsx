import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { Section, SectionLabel } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/content";
import { CITY_PAGES, LAUNCH_CITY_IDS } from "@/lib/places";
import { CITIES, TOWNS } from "@/lib/generated/places";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, type Crumb } from "@/lib/jsonld";

/**
 * Where Help24 works.
 *
 * TWO DIFFERENT TRUTHS, KEPT APART. The app covers every Kenyan city and all 47
 * county headquarters — that is what the registry contains and it is true. Six
 * of those cities have their own page, because six is where the registry knows
 * neighbourhoods and a page can therefore say something specific. Conflating
 * the two would either under-sell the app or over-sell the website, so this
 * page states both and links only the six.
 *
 * The remaining cities and towns are named in plain text rather than linked to
 * pages that do not exist. A visitor from Nyeri can see Nyeri here and knows the
 * app reaches them; they are not sent to a page that would have nothing on it.
 */

export const metadata = pageMetadata({
  title: "Where Help24 Works — Cities and Towns Across Kenya",
  description:
    "Help24 covers every Kenyan city and all 47 county headquarters. See the neighbourhoods in Mombasa, Nairobi, Kisumu, Nakuru, Eldoret and Thika, and how posting a local job works.",
  path: "/areas",
});

const trail: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Where we work", path: "/areas" },
];

export default function AreasPage() {
  const launch = CITY_PAGES.filter((c) =>
    (LAUNCH_CITY_IDS as readonly string[]).includes(c.id),
  );
  const otherPages = CITY_PAGES.filter(
    (c) => !(LAUNCH_CITY_IDS as readonly string[]).includes(c.id),
  );
  const linked = new Set(CITY_PAGES.map((c) => c.id));
  const unlinkedCities = CITIES.filter((c) => !linked.has(c.id));

  return (
    <SitePage>
      <JsonLd data={breadcrumbLd(trail)} />

      <PageHero
        eyebrow="Where we work"
        title="Help24 across Kenya"
        description="The app carries every Kenyan city, all 47 county headquarters and the neighbourhoods of the big urban centres. These are the places the website can tell you something specific about."
        align="left"
      >
        <Breadcrumbs trail={trail} />
      </PageHero>

      <Section>
        <SectionLabel>Launch cities</SectionLabel>
        <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
          Mombasa, Nairobi and Kisumu first
        </h2>
        <p className="mt-3 max-w-prose text-body-lg text-text-secondary">
          These are the three cities the launch effort is going into. Posts anywhere else in
          Kenya still reach whoever is nearby — there are simply fewer providers there today.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {launch.map((c) => (
            <li key={c.id}>
              <Link
                href={`/areas/${c.id}`}
                className="block h-full rounded-card border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/40"
              >
                <span className="text-h4 font-semibold text-text-primary">{c.name}</span>
                <span className="mt-1 block text-body-sm text-text-secondary">
                  {c.county} County · {c.neighbourhoods?.length} areas
                </span>
                <span className="mt-3 block text-body-sm leading-relaxed text-text-secondary">
                  {c.neighbourhoods?.slice(0, 6).join(", ")}
                  {(c.neighbourhoods?.length ?? 0) > 6 ? " and more" : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-border bg-surface">
        <SectionLabel>Also mapped</SectionLabel>
        <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
          Cities with neighbourhood-level coverage
        </h2>
        <p className="mt-3 max-w-prose text-body-lg text-text-secondary">
          Posting to a neighbourhood rather than a city is what keeps offers realistic — the
          people who see your job are the ones who can actually get to you.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherPages.map((c) => (
            <li key={c.id}>
              <Link
                href={`/areas/${c.id}`}
                className="block h-full rounded-card border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/40"
              >
                <span className="text-h4 font-semibold text-text-primary">{c.name}</span>
                <span className="mt-1 block text-body-sm text-text-secondary">
                  {c.county} County · {c.neighbourhoods?.length} areas
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-border">
        <SectionLabel>Everywhere else</SectionLabel>
        <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
          The rest of the country
        </h2>
        <p className="mt-3 max-w-prose text-body-lg text-text-secondary">
          The app carries these too. They do not have their own page on this website yet, because
          there is nothing specific we could honestly tell you about them that the pages above do
          not already say.
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-body-lg font-semibold text-text-primary">Other cities</h3>
            <p className="mt-3 text-body leading-relaxed text-text-secondary">
              {unlinkedCities.map((c) => c.name).join(" · ")}
            </p>
          </div>
          <div>
            <h3 className="text-body-lg font-semibold text-text-primary">
              County headquarters
            </h3>
            <p className="mt-3 text-body leading-relaxed text-text-secondary">
              {TOWNS.map((t) => t.name).join(" · ")}
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Post a job where you are"
        description="Free to post, wherever in Kenya you are. You agree the price before anyone starts."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: "/services", label: "Browse all services" }}
      />
    </SitePage>
  );
}
