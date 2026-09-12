import Link from "next/link";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { Section, SectionLabel } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/content";
import { ButtonLink } from "@/components/Button";
import { CategoryIcon } from "@/components/ds/CategoryIcon";
import { Prose } from "@/components/service/Blocks";
import { serviceBySlug, servicesByGroup } from "@/lib/services";
import {
  CITY_CONTENT,
  CITY_PAGES,
  LAUNCH_CITY_IDS,
  cityById,
  servicesForCity,
} from "@/lib/places";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, type Crumb } from "@/lib/jsonld";

/**
 * A city.
 *
 * WHY THERE ARE SIX OF THESE AND NOT THIRTY-FOUR. A city page exists where the
 * registry knows the city's neighbourhoods, which is the same place the app can
 * position a post precisely and the same place this page can name real streets
 * instead of adjectives. The other twenty-eight cities are named on /areas in
 * plain text; sending somebody from a search result to a page that says nothing
 * they could not have guessed is how a site earns a reputation for wasting
 * people's time, with Google and with readers.
 *
 * NO LocalBusiness MARKUP. Help24 has no premises in any of these cities. The
 * page describes a marketplace that operates here, not a branch, and the
 * structured data says exactly that much and no more.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return CITY_PAGES.map((c) => ({ city: c.id }));
}

export function generateMetadata({ params }: { params: { city: string } }) {
  const city = cityById(params.city);
  const content = CITY_CONTENT[params.city];
  if (!city || !content) return {};
  return pageMetadata({
    title: `Local Services in ${city.name} — Plumbers, Electricians, Cleaners`,
    description: content.description,
    path: `/areas/${city.id}`,
  });
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = cityById(params.city);
  const content = CITY_CONTENT[params.city];
  if (!city || !content || !CITY_PAGES.some((c) => c.id === city.id)) notFound();

  const withPages = servicesForCity(city.id)
    .map((s) => serviceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const withPageSlugs = new Set(withPages.map((s) => s.slug));
  const isLaunchCity = (LAUNCH_CITY_IDS as readonly string[]).includes(city.id);

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Where we work", path: "/areas" },
    { name: city.name, path: `/areas/${city.id}` },
  ];

  return (
    <SitePage>
      <JsonLd data={breadcrumbLd(trail)} />

      <section className="relative overflow-hidden border-b border-border bg-atmosphere">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
          <Breadcrumbs trail={trail} />
          <div className="flex max-w-3xl flex-col items-start text-left">
            <span className="mb-4 inline-flex items-center gap-2 rounded-badge bg-primary/10 px-3 py-1.5 text-label-md font-medium text-primary-bright">
              {city.county} County
              {isLaunchCity ? " · Launch city" : ""}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Local services in {city.name}
            </h1>
            <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
              Post what you need, get offers from providers near you, and agree the price before
              anyone starts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/download">Post a job in {city.name}</ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                Browse all services
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <Prose paragraphs={content.intro} />
      </Section>

      {withPages.length > 0 && (
        <Section className="border-t border-border bg-surface">
          <SectionLabel>Services in {city.name}</SectionLabel>
          <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
            Written up for {city.name}
          </h2>
          <p className="mt-3 max-w-prose text-body-lg text-text-secondary">
            These have a page of their own for this city, covering what is different about the
            work here.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {withPages.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}/${city.id}`}
                  className="flex h-full items-start gap-3 rounded-card border border-border bg-card p-4 shadow-card transition-colors hover:border-primary/40"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-tag bg-primary/10 text-primary">
                    <CategoryIcon name={s.icon} size={14} />
                  </span>
                  <span>
                    <span className="block text-body font-semibold text-text-primary">
                      {s.workers.charAt(0).toUpperCase() + s.workers.slice(1)} in {city.name}
                    </span>
                    <span className="mt-0.5 block text-body-sm leading-relaxed text-text-secondary">
                      {s.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section className="border-t border-border">
        <SectionLabel>Commonly posted</SectionLabel>
        <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
          What {city.name} tends to need
        </h2>
        <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {content.common.map((c) => (
            <li key={c} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-bright"
              />
              <span className="text-body leading-relaxed text-text-secondary">{c}</span>
            </li>
          ))}
        </ul>
      </Section>

      {city.neighbourhoods && city.neighbourhoods.length > 0 && (
        <Section className="border-t border-border bg-surface">
          <SectionLabel>Coverage</SectionLabel>
          <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
            {city.neighbourhoods.length} {city.name} areas in the app
          </h2>
          <p className="mt-3 max-w-prose text-body-lg text-text-secondary">
            Jobs are posted to a neighbourhood, not to the whole city, so the people who see
            yours are the ones close enough to do it.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {city.neighbourhoods.map((n) => (
              <li
                key={n}
                className="rounded-badge border border-border bg-card px-3 py-1.5 text-body-sm text-text-secondary"
              >
                {n}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Everything else the app carries — national pages, honestly labelled. */}
      <Section className="border-t border-border">
        <SectionLabel>Everything else</SectionLabel>
        <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
          Other services you can post in {city.name}
        </h2>
        <p className="mt-3 max-w-prose text-body-lg text-text-secondary">
          All of these work in {city.name}. They do not have a {city.name} page yet, so these
          links go to the national ones.
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {servicesByGroup().map((group) => {
            const rest = group.items.filter((s) => !withPageSlugs.has(s.slug));
            if (rest.length === 0) return null;
            return (
              <div key={group.name}>
                <h3 className="text-body-lg font-semibold text-text-primary">{group.name}</h3>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {rest.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="text-body-sm text-text-secondary transition-colors hover:text-primary-bright hover:underline"
                      >
                        {s.category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <CtaBand
        title={`Post a job in ${city.name}`}
        description="Free to post. Offers come from providers near you, and the payment is held until the work is done."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: "/areas", label: "Where else Help24 works" }}
      />
    </SitePage>
  );
}
