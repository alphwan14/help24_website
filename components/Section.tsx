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
 * Uses `primary-bright`, not `primary`. This is 12px text, and the brand
 * indigo is chosen to carry WHITE letters on ITSELF — which makes it too light
 * to be letters on the page in the light theme and too dark in the dark one.
 * `primary-bright` is the same brand colour resolved for the opposite job, per
 * theme: 7.5:1 on paper, 6.6:1 on near-black. That is the whole reason the two
 * are separate tokens rather than one colour with an opacity on it.
 */
export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p className={`mb-4 text-label-md font-medium uppercase tracking-wider text-primary-bright ${className}`}>
      {children}
    </p>
  );
}
