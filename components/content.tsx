import { Section, SectionLabel } from "./Section";
import { ButtonLink } from "./Button";
import { Icon } from "./Icon";

/**
 * Shared content blocks for marketing/company pages. Every block composes the
 * existing Section/Card design vocabulary so pages stay visually consistent.
 * Colour utilities are limited to the guaranteed safelisted set.
 */

interface Feature {
  icon: string;
  title: string;
  body: string;
}

export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: Feature[];
  columns?: 2 | 3;
}) {
  const cols =
    columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-card border border-border bg-card p-6 shadow-card"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-badge bg-primary/10 text-primary">
            <Icon name={it.icon} />
          </div>
          <h3 className="mt-4 text-body-lg font-semibold text-text-primary">
            {it.title}
          </h3>
          <p className="mt-2 text-body leading-relaxed text-text-secondary">
            {it.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Steps({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((s, i) => (
        <div
          key={s.title}
          className="relative rounded-card border border-border bg-card p-6 shadow-card"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-badge bg-primary/10 text-body-lg font-bold text-primary">
            {i + 1}
          </div>
          <h3 className="mt-4 text-body-lg font-semibold text-text-primary">
            {s.title}
          </h3>
          <p className="mt-2 text-body leading-relaxed text-text-secondary">
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Checklist of short points with a green check. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-tag bg-success/20 text-success">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <span className="text-body leading-relaxed text-text-secondary">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function ContentSection({
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Section className={className}>
      {(eyebrow || title || intro) && (
        <div className="mx-auto max-w-prose text-center">
          {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}
          {title && (
            <h2 className="text-h2 font-semibold text-text-primary">{title}</h2>
          )}
          {intro && (
            <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
              {intro}
            </p>
          )}
        </div>
      )}
      {children && <div className="mt-10 sm:mt-12">{children}</div>}
    </Section>
  );
}

export function CtaBand({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-card border border-border bg-card p-8 text-center shadow-card sm:p-12">
        <div className="bg-radial-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">
          <h2 className="text-h2 font-semibold text-text-primary">{title}</h2>
          <p className="mx-auto mt-3 max-w-md text-body-lg text-text-secondary">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
            {secondary && (
              <ButtonLink variant="secondary" href={secondary.href}>
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
