import { SectionLabel } from "./Section";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Actions, meta rows or badges rendered under the description. */
  children?: React.ReactNode;
  align?: "center" | "left";
}

/**
 * Reusable page header used by every sub-page. Mirrors the homepage Hero's
 * treatment (radial glow + faint grid) at a calmer scale so inner pages feel
 * part of the same site.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  align = "center",
}: PageHeroProps) {
  const aligned =
    align === "center"
      ? "mx-auto items-center text-center"
      : "items-start text-left";

  return (
    <section className="relative overflow-hidden border-b border-border bg-radial-glow">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
        <div className={`flex max-w-3xl flex-col ${aligned}`}>
          {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
              {description}
            </p>
          )}
          {children && <div className="mt-8 w-full">{children}</div>}
        </div>
      </div>
    </section>
  );
}
