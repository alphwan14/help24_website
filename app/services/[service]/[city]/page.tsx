import Link from "next/link";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { Section, SectionLabel } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/content";
import { ButtonLink } from "@/components/Button";
import { CategoryIcon } from "@/components/ds/CategoryIcon";
import {
  ChecksBlock,
  HowItWorksFor,
  Prose,
  RequestAndPrice,
  TaskList,
} from "@/components/service/Blocks";
import { serviceBySlug, titleCaseWorker, withArticle } from "@/lib/services";
import {
  LAUNCH_CITY_IDS,
  SERVICE_CITY_PAIRS,
  cityById,
  localNote,
  servicesForCity,
} from "@/lib/places";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, serviceLd, type Crumb } from "@/lib/jsonld";

/**
 * Service in a city — the tier that answers "plumber in Mombasa".
 *
 * THE PAGE LIST IS THE CONTENT LIST. `generateStaticParams` returns
 * SERVICE_CITY_PAIRS, which is derived from the keys of LOCAL_NOTES in
 * lib/places.ts — a map whose values are paragraphs a person wrote about doing
 * that trade in that place. There is no product of two arrays anywhere in this
 * file. Adding a page means writing the note; there is no other route in.
 *
 * That constraint is doing real work. The naive version of this route is
 * `SERVICES × CITIES`, which is 1,020 URLs whose only difference is a place
 * name — scaled content abuse as Google's spam policies currently define it,
 * and a sitewide risk rather than a per-page one. Thirty-odd pages that each
 * say something specifically true is the version that survives.
 *
 * WHAT THESE PAGES DO NOT CLAIM. No provider counts, no "12 plumbers near you",
 * no ratings, no availability. Production holds 16 accounts and 0 verified
 * providers; every one of those numbers would have to be invented. The page
 * instead promises what is true — the app covers these neighbourhoods, posting
 * is free, and the price is agreed before anyone starts.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_CITY_PAIRS.map((p) => ({ service: p.service, city: p.city }));
}

export function generateMetadata({
  params,
}: {
  params: { service: string; city: string };
}) {
  const service = serviceBySlug(params.service);
  const city = cityById(params.city);
  if (!service || !city) return {};

  const Workers = service.workers.charAt(0).toUpperCase() + service.workers.slice(1);
  return pageMetadata({
    title: `${Workers} in ${city.name} — Find ${withArticle(titleCaseWorker(service.worker))} Near You`,
    description: `Post a ${service.category.toLowerCase()} job in ${city.name} on Help24 and get offers from ${service.workers} nearby. Agree the price before work starts and pay securely by M-Pesa.`,
    path: `/services/${service.slug}/${city.id}`,
  });
}

export default function ServiceCityPage({
  params,
}: {
  params: { service: string; city: string };
}) {
  const service = serviceBySlug(params.service);
  const city = cityById(params.city);
  const note = service && city ? localNote(service.slug, city.id) : undefined;
  // No note, no page. This is the same gate generateStaticParams uses, repeated
  // here so a direct render can never outrun it.
  if (!service || !city || !note) notFound();

  const Workers = service.workers.charAt(0).toUpperCase() + service.workers.slice(1);
  const isLaunchCity = (LAUNCH_CITY_IDS as readonly string[]).includes(city.id);
  const neighbourhoods = city.neighbourhoods ?? [];
  const siblings = servicesForCity(city.id)
    .filter((s) => s !== service.slug)
    .map((s) => serviceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.category, path: `/services/${service.slug}` },
    { name: city.name, path: `/services/${service.slug}/${city.id}` },
  ];

  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbLd(trail),
          serviceLd({
            name: `${service.category} in ${city.name}`,
            description: `${service.summary} Available through Help24 across ${city.name}, ${city.county} County.`,
            path: `/services/${service.slug}/${city.id}`,
            areaServed: {
              city: city.name,
              county: city.county,
              lat: city.lat,
              lng: city.lng,
            },
          }),
        ]}
      />

      <section className="relative overflow-hidden border-b border-border bg-atmosphere">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
          <Breadcrumbs trail={trail} />
          <div className="flex max-w-3xl flex-col items-start text-left">
            <span className="mb-4 inline-flex items-center gap-2 rounded-badge bg-primary/10 px-3 py-1.5 text-label-md font-medium text-primary-bright">
              <CategoryIcon name={service.icon} size={14} />
              {service.category} · {city.county} County
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {Workers} in {city.name}
            </h1>
            <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
              {service.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/download">Post a job in {city.name}</ButtonLink>
              <ButtonLink href={`/services/${service.slug}`} variant="secondary">
                {service.category} across Kenya
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* The local note — the reason this URL exists at all. */}
      <Section>
        <SectionLabel>{service.category} in {city.name}</SectionLabel>
        <h2 className="mb-6 text-h3 font-semibold text-text-primary sm:text-h2">
          What is different about {service.category.toLowerCase()} here
        </h2>
        <Prose paragraphs={note} />
      </Section>

      {/* Real coverage, from the registry the app itself uses. */}
      {neighbourhoods.length > 0 && (
        <Section className="border-t border-border bg-surface">
          <SectionLabel>Coverage</SectionLabel>
          <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
            {city.name} areas you can post to
          </h2>
          <p className="mt-3 max-w-prose text-body-lg text-text-secondary">
            Help24 places a job at the neighbourhood rather than the city, so the providers who
            see it are the ones who can actually reach you. These are the {city.name} areas the
            app carries.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {neighbourhoods.map((n) => (
              <li
                key={n}
                className="rounded-badge border border-border bg-card px-3 py-1.5 text-body-sm text-text-secondary"
              >
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-prose text-body-sm leading-relaxed text-text-secondary">
            {isLaunchCity
              ? `${city.name} is one of the three cities Help24's launch effort is going into. `
              : `Help24's launch effort is concentrated on Mombasa, Nairobi and Kisumu, so there are fewer providers in ${city.name} today. The app covers it fully. `}
            <Link href={`/areas/${city.id}`} className="text-primary-bright hover:underline">
              More about Help24 in {city.name}
            </Link>
            .
          </p>
        </Section>
      )}

      <TaskList
        service={service}
        heading={`${service.category} jobs posted in ${city.name}`}
        intro={`Every one of these can be posted as a one-off job to ${city.name} providers.`}
      />

      <RequestAndPrice service={service} />

      <ChecksBlock service={service} />

      <HowItWorksFor service={service} />

      {/* Sideways links: the other trades with a real page in this city. */}
      {siblings.length > 0 && (
        <Section className="border-t border-border">
          <SectionLabel>Other services in {city.name}</SectionLabel>
          <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
            More Help24 services in {city.name}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((s) => (
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

      <CtaBand
        title={`Post ${withArticle(service.category.toLowerCase())} job in ${city.name}`}
        description="Free to post. You see the offers, you agree the price, and the payment is held until the work is done."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: `/areas/${city.id}`, label: `All services in ${city.name}` }}
      />
    </SitePage>
  );
}
