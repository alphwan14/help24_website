import Link from "next/link";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/content";
import { ButtonLink } from "@/components/Button";
import { CategoryIcon } from "@/components/ds/CategoryIcon";
import {
  ChecksBlock,
  HowItWorksFor,
  Prose,
  RelatedLinks,
  RequestAndPrice,
  TaskList,
} from "@/components/service/Blocks";
import { SERVICES, serviceBySlug, withArticle } from "@/lib/services";
import { citiesForService } from "@/lib/places";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, serviceLd, type Crumb } from "@/lib/jsonld";

/**
 * One page per service in the app's own catalogue.
 *
 * STATIC, NOT DYNAMIC. `generateStaticParams` enumerates the catalogue at build
 * time, so every one of these is a real file on the CDN with its content in the
 * initial HTML response. Googlebot's renderer is good, but it is a second pass
 * on a queue, and a page that needs it is a page whose indexing depends on
 * capacity that is not ours. There is no client component in this tree and no
 * fetch — the crawler and the reader are served identical bytes.
 *
 * `dynamicParams = false` turns a slug that is not in the catalogue into a real
 * 404 rather than a rendered page for a service Help24 does not carry. That
 * matters: a 200 on /services/anything is a soft 404 generator, and soft 404s
 * are how a site teaches Google to stop trusting its URLs.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export function generateMetadata({ params }: { params: { service: string } }) {
  const service = serviceBySlug(params.service);
  if (!service) return {};
  return pageMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default function ServicePage({ params }: { params: { service: string } }) {
  const service = serviceBySlug(params.service);
  if (!service) notFound();

  const cities = citiesForService(service.slug);
  const related = service.related
    .map((slug) => serviceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ slug: s.slug, category: s.category, summary: s.summary }));

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.category, path: `/services/${service.slug}` },
  ];

  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbLd(trail),
          serviceLd({
            name: service.category,
            description: service.summary,
            path: `/services/${service.slug}`,
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
              {service.group}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {service.h1}
            </h1>
            <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
              {service.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/download">Post a job — it&apos;s free</ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary">
                How Help24 works
              </ButtonLink>
            </div>
            {/*
              The words people actually use, including Kiswahili. Useful to a
              reader who calls it something else, and genuine vocabulary rather
              than a keyword list — which is why it is a sentence.
            */}
            <p className="mt-6 text-body-sm text-text-secondary">
              Also called {service.alsoCalled.slice(0, -1).join(", ")} or{" "}
              {service.alsoCalled[service.alsoCalled.length - 1]}.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <Prose paragraphs={service.intro} />
      </Section>

      <TaskList
        service={service}
        heading={`${service.category} jobs on Help24`}
        intro={`Anything in this list can be posted as a single job — you do not need an ongoing arrangement to use Help24.`}
      />

      <RequestAndPrice service={service} />

      <ChecksBlock service={service} />

      <HowItWorksFor service={service} />

      <RelatedLinks
        service={service}
        related={related}
        cities={cities.map((c) => ({ id: c.id, name: c.name }))}
      />

      <CtaBand
        title={`Post your ${service.category.toLowerCase()} job`}
        description="Free to post. You see the offers, you agree the price, and the payment is held until the work is done."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: "/services", label: "Browse all services" }}
      />

      <Section className="border-t border-border">
        <p className="text-body-sm text-text-secondary">
          Offer {service.category.toLowerCase()} services?{" "}
          <Link href="/become-a-provider" className="text-primary-bright hover:underline">
            Join Help24 as {withArticle(service.worker)}
          </Link>
          .
        </p>
      </Section>
    </SitePage>
  );
}
