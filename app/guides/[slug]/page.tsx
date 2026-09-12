import Link from "next/link";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/content";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { serviceBySlug } from "@/lib/services";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { articleLd, breadcrumbLd, type Crumb } from "@/lib/jsonld";

/**
 * One guide.
 *
 * The article markup carries a real `datePublished` and a real `dateModified`
 * from lib/guides.ts, and `author` is the organisation rather than an invented
 * byline. Both of those are visible on the page too — a date in the markup that
 * a reader cannot see is the mismatch Google's structured data policies name.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = guideBySlug(params.slug);
  if (!guide) return {};
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
  });
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guideBySlug(params.slug);
  if (!guide) notFound();

  const related = guide.relatedServices
    .map((s) => serviceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.h1, path: `/guides/${guide.slug}` },
  ];

  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbLd(trail),
          articleLd({
            headline: guide.title,
            description: guide.description,
            path: `/guides/${guide.slug}`,
            published: guide.published,
            modified: guide.modified,
          }),
        ]}
      />

      <section className="relative overflow-hidden border-b border-border bg-atmosphere">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
          <Breadcrumbs trail={trail} />
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {guide.h1}
            </h1>
            <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
              {guide.standfirst}
            </p>
            <p className="mt-6 text-body-sm text-text-secondary">
              By the {SITE.name} team ·{" "}
              <time dateTime={guide.published}>
                {DATE_FORMAT.format(new Date(guide.published))}
              </time>{" "}
              · {guide.minutes} min read
            </p>
          </div>
        </div>
      </section>

      <Section>
        <article className="max-w-prose">
          {guide.sections.map((section) => (
            <section key={section.heading} className="mb-12 last:mb-0">
              <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-body-lg leading-relaxed text-text-secondary">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-5 flex flex-col gap-2.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-bright"
                      />
                      <span className="text-body leading-relaxed text-text-secondary">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </Section>

      {related.length > 0 && (
        <Section className="border-t border-border bg-surface">
          <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
            Services this applies to
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="block h-full rounded-card border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/40"
                >
                  <span className="text-body-lg font-semibold text-text-primary">
                    {s.category}
                  </span>
                  <span className="mt-1 block text-body-sm leading-relaxed text-text-secondary">
                    {s.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section className="border-t border-border">
        <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">More guides</h2>
        <ul className="mt-6 flex flex-col gap-3">
          {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="text-body-lg text-primary-bright hover:underline"
              >
                {g.h1}
              </Link>
              <span className="mt-0.5 block text-body-sm text-text-secondary">
                {g.standfirst}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Ready to post?"
        description="Free to post. You see the offers, you agree the price, and the payment is held until the work is done."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: "/services", label: "Browse all services" }}
      />
    </SitePage>
  );
}
