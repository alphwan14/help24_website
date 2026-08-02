interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  narrow?: boolean;
}

export function Section({
  id,
  children,
  className = "",
  containerClassName = "",
  narrow = false,
}: SectionProps) {
  return (
    // `scroll-mt` because the header is fixed: /safety and /for-providers both
    // link to `/#escrow`, and without it the anchor lands with the section
    // heading underneath the header bar.
    <section id={id} className={`py-section ${id ? "scroll-mt-20 sm:scroll-mt-24" : ""} ${className}`}>
      <div
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-3xl" : ""} ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The small uppercase eyebrow above a section heading.
 *
 * Uses `primary-bright`, not `primary`. This is 12px text on a near-black
 * background, where the brand indigo scores 4.37:1 — below AA. Darkening
 * `primary` so buttons could carry white text made this case slightly worse,
 * not better, which is exactly why the two are separate tokens.
 */
export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p className={`mb-4 text-label-md font-medium uppercase tracking-wider text-primary-bright ${className}`}>
      {children}
    </p>
  );
}
