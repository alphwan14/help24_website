import Image from "next/image";

/**
 * The Help24 mark, in the variant the active theme can actually show.
 *
 * WHY TWO FILES AND NOT ONE. The mark's uprights are Ink on a light ground and
 * Bone on a dark one. There is no single rendition that works on both: the
 * light lockup's uprights are #12161A, which on the dark page is very nearly
 * the page itself, and the gold bar would appear to float unattached to
 * anything. `currentColor` is no help either — the mark is three fixed brand
 * colours, not one tintable shape.
 *
 * So both are rendered and CSS shows one. The swap is CSS rather than a React
 * state because the theme is resolved before hydration (see ThemeScript) and a
 * `useEffect` would flash the wrong variant on first paint — on the very
 * element a visitor uses to identify the site.
 *
 * The hidden one is `aria-hidden` and carries no alt text, so a screen reader
 * hears the name once rather than twice.
 */
export function BrandLockup({
  className = "h-10 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src="/help24-lockup.svg"
        alt="Help24"
        width={224}
        height={64}
        priority={priority}
        className={`brand-on-light ${className}`}
      />
      <Image
        src="/help24-lockup-on-dark.svg"
        alt=""
        aria-hidden
        width={224}
        height={64}
        priority={priority}
        className={`brand-on-dark ${className}`}
      />
    </>
  );
}

/**
 * The bare glyph, for places that already say the name in text. Using the
 * lockup there would set "Help24" twice in the same eyeful.
 */
export function BrandMark({
  className = "h-24 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src="/help24-mark.svg"
        alt=""
        aria-hidden
        width={60}
        height={56}
        priority={priority}
        className={`brand-on-light ${className}`}
      />
      <Image
        src="/help24-mark-on-dark.svg"
        alt=""
        aria-hidden
        width={60}
        height={56}
        priority={priority}
        className={`brand-on-dark ${className}`}
      />
    </>
  );
}
