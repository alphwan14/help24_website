interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  narrow?: boolean;
  /**
   * Marks the section's text as seed data so it is excluded from search
   * snippets and AI Overviews. See the note on the attribute below.
   */
  nosnippet?: boolean;
}

export function Section({
  id,
  children,
  className = "",
  containerClassName = "",
  narrow = false,
  nosnippet = false,
}: SectionProps) {
  return (
    // `scroll-mt` because the header is fixed: /safety and /for-providers both
    // link to `/#escrow`, and without it the anchor lands with the section
    // heading underneath the header bar.
    <section
      id={id}
      /*
       * WHAT A CRAWLER SEES THAT A READER DOES NOT.
       *
       * The demo modules render seed data — "Joseph Mwangi · 4.8 · KES 1,100" —
       * and that text is in the server HTML, deliberately, because the sandbox
       * has to work without JavaScript. A person sees it inside a module
       * captioned Demo and understands. A snippet or an AI Overview lifts the
       * sentence out of the module and away from the caption, and Help24 then
       * appears to claim a provider called Joseph Mwangi rated 4.8.
       *
       * `data-nosnippet` is Google's documented control for precisely this. The
       * text stays crawlable and indexable; it just cannot be quoted back. The
       * visible DemoChip stays too — this is the same honesty, aimed at the
       * other audience.
       */
      {...(nosnippet ? { "data-nosnippet": true } : null)}
      className={`py-section ${id ? "scroll-mt-20 sm:scroll-mt-24" : ""} ${className}`}
    >
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
