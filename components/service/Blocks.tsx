import Link from "next/link";
import { Section, SectionLabel } from "@/components/Section";
import { Icon } from "@/components/Icon";
import { CategoryIcon } from "@/components/ds/CategoryIcon";
import { withArticle, type Service } from "@/lib/services";

/**
 * The blocks a service page is made of.
 *
 * These are shared between /services/<service> and
 * /services/<service>/<city> so that the national and city pages present the
 * same information in the same shapes — the city page's difference lives in its
 * local note and its neighbourhood list, not in a different visual language.
 */

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-prose space-y-5 text-body-lg leading-relaxed text-text-secondary">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  );
}

/** What people post in this category. A two-column list, not a wall. */
export function TaskList({
  service,
  heading,
  intro,
}: {
  service: Service;
  heading: string;
  intro?: string;
}) {
  return (
    <Section className="border-t border-border">
      <SectionLabel>What people post</SectionLabel>
      <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">{heading}</h2>
      {intro && (
        <p className="mt-3 max-w-prose text-body-lg text-text-secondary">{intro}</p>
      )}
      <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {service.tasks.map((t) => (
          <li key={t} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-tag bg-primary/10 text-primary">
              <CategoryIcon name={service.icon} size={13} />
            </span>
            <span className="text-body leading-relaxed text-text-secondary">{t}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/**
 * The two lists that make these pages worth landing on: what to put in the
 * request, and what moves the price. Side by side because people read them
 * together — one is what you control, the other is what it costs you.
 */
export function RequestAndPrice({ service }: { service: Service }) {
  return (
    <Section className="border-t border-border bg-surface">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionLabel>Writing the request</SectionLabel>
          <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
            What to include so the offers come back usable
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {service.detailsToInclude.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-tag bg-success/20 text-success">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <span className="text-body leading-relaxed text-text-secondary">{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionLabel>What moves the price</SectionLabel>
          <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
            Why two quotes for the same job differ
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {service.priceFactors.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-bright"
                />
                <span className="text-body leading-relaxed text-text-secondary">{p}</span>
              </li>
            ))}
          </ul>
          {/*
            The honest note. Help24 has no completed-job price data worth
            publishing, so this page gives the factors and refuses to invent
            figures. Said out loud rather than left as an absence people have to
            notice.
          */}
          <p className="mt-6 max-w-prose rounded-card border border-border bg-card p-4 text-body-sm leading-relaxed text-text-secondary">
            Help24 does not publish price ranges for {service.category.toLowerCase()}. Quotes come
            from the {service.workers} themselves, and the number you agree is the number the
            payment is held against.
          </p>
        </div>
      </div>
    </Section>
  );
}

/** Trade-specific things to verify. The part nobody else writes properly. */
export function ChecksBlock({ service }: { service: Service }) {
  return (
    <Section className="border-t border-border">
      <SectionLabel>Before work starts</SectionLabel>
      <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
        What to check with{" "}
        {service.workers === "labourers" ? "anyone you hire" : withArticle(service.worker)}
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {service.checks.map((c) => (
          <li
            key={c.slice(0, 40)}
            className="rounded-card border border-border bg-card p-5 text-body leading-relaxed text-text-secondary shadow-card"
          >
            {c}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** How the marketplace itself works, told in the vocabulary of this trade. */
export function HowItWorksFor({ service }: { service: Service }) {
  const steps = [
    {
      title: "Describe the job",
      body: `Say what needs doing and where you are. Posting is free, and you are not committing to anything by posting.`,
    },
    {
      title: `Nearby ${service.workers} send offers`,
      body: `Providers near you quote their own price. Nobody is assigned to you — you see the offers and you choose.`,
    },
    {
      title: "Agree the price first",
      body: "Nothing starts until you have accepted an offer. The number you agree is the number that gets held.",
    },
    {
      title: "Pay by M-Pesa, released when it's done",
      body: "Help24 holds the payment while the work happens. The provider can see it is there; neither side can move it until you confirm the job is finished.",
    },
  ];
  return (
    <Section className="border-t border-border bg-surface">
      <SectionLabel>How Help24 works</SectionLabel>
      <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
        Posting {withArticle(service.category.toLowerCase())} job
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="rounded-card border border-border bg-card p-6 shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-badge bg-primary/10 text-body-lg font-bold text-primary">
              {i + 1}
            </div>
            <h3 className="mt-4 text-body-lg font-semibold text-text-primary">{s.title}</h3>
            <p className="mt-2 text-body leading-relaxed text-text-secondary">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-prose text-body text-text-secondary">
        More detail on{" "}
        <Link href="/how-it-works" className="text-primary-bright hover:underline">
          how posting and offers work
        </Link>
        , and on{" "}
        <Link href="/safety" className="text-primary-bright hover:underline">
          how payment protection works
        </Link>
        .
      </p>
    </Section>
  );
}

/**
 * Related services and the places this one has a page for.
 *
 * This is the internal linking graph made visible. Anchor text is the service's
 * own name in a sentence rather than a keyword block, and the list is short on
 * purpose — four related services, not thirty.
 */
export function RelatedLinks({
  related,
  cities,
  service,
}: {
  related: { slug: string; category: string; summary: string }[];
  cities: { id: string; name: string }[];
  service: Service;
}) {
  return (
    <Section className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div>
          <SectionLabel>Related services</SectionLabel>
          <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
            Often needed alongside {service.category.toLowerCase()}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/services/${r.slug}`}
                  className="block h-full rounded-card border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/40"
                >
                  <span className="text-body-lg font-semibold text-text-primary">
                    {r.category}
                  </span>
                  <span className="mt-1 block text-body-sm leading-relaxed text-text-secondary">
                    {r.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {cities.length > 0 && (
          <div>
            <SectionLabel>By city</SectionLabel>
            <h2 className="text-h4 font-semibold text-text-primary sm:text-h3">
              {service.category} near you
            </h2>
            <ul className="mt-6 flex flex-col gap-2">
              {cities.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/services/${service.slug}/${c.id}`}
                    className="inline-flex items-center gap-2 text-body text-primary-bright hover:underline"
                  >
                    <Icon name="chevron" className="h-4 w-4" />
                    {service.workers.charAt(0).toUpperCase() + service.workers.slice(1)} in{" "}
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-body-sm leading-relaxed text-text-secondary">
              The app covers every Kenyan city and all 47 county headquarters.{" "}
              <Link href="/areas" className="text-primary-bright hover:underline">
                See where Help24 works
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
