import Link from "next/link";
import { notFound } from "next/navigation";
import { PAYMENTS } from "@/lib/site";
import { SitePage } from "@/components/SitePage";
import { Section, SectionLabel } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/content";
import { ButtonLink } from "@/components/Button";
import { CategoryIcon } from "@/components/ds/CategoryIcon";
import { ChecksBlock, Prose, RequestAndPrice } from "@/components/service/Blocks";
import { serviceBySlug, withArticle } from "@/lib/services";
import { cityById } from "@/lib/places";
import {
  SERVICE_NEIGHBOURHOOD_PAGES,
  neighbourhoodBySlug,
  neighbourhoodNote,
  neighbourhoodPageCopy,
  neighbourhoodsForService,
  servicesForNeighbourhood,
} from "@/lib/neighbourhoods";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, serviceLd, type Crumb } from "@/lib/jsonld";

/**
 * Service in a neighbourhood: "plumber in Changamwe".
 *
 * Same gate as the city tier, one level down. generateStaticParams returns
 * SERVICE_NEIGHBOURHOOD_PAGES, which comes from the keys of NEIGHBOURHOOD_NOTES
 * in lib/neighbourhoods.ts. No note, no page. dynamicParams = false makes every
 * other combination a real 404.
 *
 * WHAT THE PAGE CARRIES. The neighbourhood note is the reason the URL exists
 * and sits at the top. Below it are the service's request and checks blocks,
 * which are useful to someone about to post. The city note is NOT repeated
 * here; it is linked instead. Repeating it would put the same paragraphs on
 * several URLs and make each neighbourhood page read like its parent.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_NEIGHBOURHOOD_PAGES.map((p) => ({ ...p }));
}

type Params = { service: string; city: string; neighbourhood: string };

export function generateMetadata({ params }: { params: Params }) {
  const copy = neighbourhoodPageCopy(
    params.service,
    params.city,
    params.neighbourhood,
    PAYMENTS.methods,
  );
  if (!copy) return {};
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/services/${params.service}/${params.city}/${params.neighbourhood}`,
  });
}

export default function ServiceNeighbourhoodPage({ params }: { params: Params }) {
  const service = serviceBySlug(params.service);
  const city = cityById(params.city);
  const n = neighbourhoodBySlug(params.city, params.neighbourhood);
  const note = neighbourhoodNote(params.service, params.city, params.neighbourhood);
  const copy = neighbourhoodPageCopy(
    params.service,
    params.city,
    params.neighbourhood,
    PAYMENTS.methods,
  );
  // The same gate generateStaticParams uses, so a direct render cannot get past it.
  if (!service || !city || !n || !note || !copy) notFound();

  const path = `/services/${service.slug}/${city.id}/${n.slug}`;
  const cityPath = `/services/${service.slug}/${city.id}`;

  const nearby = neighbourhoodsForService(service.slug, city.id).filter(
    (other) => other.slug !== n.slug,
  );
  const otherTrades = servicesForNeighbourhood(city.id, n.slug)
    .filter((s) => s !== service.slug)
    .map((s) => serviceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.category, path: `/services/${service.slug}` },
    { name: city.name, path: cityPath },
    { name: n.name, path },
  ];

  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbLd(trail),
          serviceLd({
            name: `${service.category} in ${n.name}, ${city.name}`,
            description: `${service.summary} Available through Help24 in ${n.name}, ${city.name}.`,
            path,
            areaServed: {
              city: city.name,
              county: city.county,
              lat: city.lat,
              lng: city.lng,
              neighbourhood: n.name,
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
              {service.category} · {city.name}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {copy.h1}
            </h1>
            <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
              Post the job to {n.name} and it reaches providers close enough to get to you.
              Posting is free, and the price is agreed before anyone starts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/download">Post a job in {n.name}</ButtonLink>
              <ButtonLink href={cityPath} variant="secondary">
                {service.category} across {city.name}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* The neighbourhood note: the reason this URL exists. */}
      <Section>
        <SectionLabel>
          {service.category} in {n.name}
        </SectionLabel>
        <h2 className="mb-6 text-h3 font-semibold text-text-primary sm:text-h2">
          What is particular about {n.name}
        </h2>
        <Prose paragraphs={note} />
        <p className="mt-8 max-w-prose text-body-sm leading-relaxed text-text-secondary">
          The wider picture, including what affects {service.category.toLowerCase()} across the
          whole city, is on the{" "}
          <Link href={cityPath} className="text-primary-bright hover:underline">
            {service.category.toLowerCase()} in {city.name}
          </Link>{" "}
          page.
        </p>
      </Section>

      <RequestAndPrice service={service} />

      <ChecksBlock service={service} />

      {(nearby.length > 0 || otherTrades.length > 0) && (
        <Section className="border-t border-border">
          {nearby.length > 0 && (
            <>
              <SectionLabel>Elsewhere in {city.name}</SectionLabel>
              <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
                {service.category} in other {city.name} neighbourhoods
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {nearby.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/services/${service.slug}/${city.id}/${other.slug}`}
                      className="inline-block rounded-badge border border-border bg-card px-3 py-1.5 text-body-sm text-text-secondary transition-colors hover:border-primary/40 hover:text-primary-bright"
                    >
                      {other.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {otherTrades.length > 0 && (
            <div className={nearby.length > 0 ? "mt-10" : undefined}>
              <SectionLabel>Also in {n.name}</SectionLabel>
              <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
                Other services written up for {n.name}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {otherTrades.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}/${city.id}/${n.slug}`}
                      className="inline-flex items-center gap-2 rounded-badge border border-border bg-card px-3 py-1.5 text-body-sm text-text-secondary transition-colors hover:border-primary/40 hover:text-primary-bright"
                    >
                      <CategoryIcon name={s.icon} size={12} />
                      {s.category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      <CtaBand
        title={`Post ${withArticle(service.category.toLowerCase())} job in ${n.name}`}
        description="Free to post. You see the offers, you agree the price, and the payment is held until the work is done."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: `/areas/${city.id}`, label: `All services in ${city.name}` }}
      />
    </SitePage>
  );
}
