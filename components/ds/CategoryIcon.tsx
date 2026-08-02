/**
 * Stroke glyphs for the app's 32 categories.
 *
 * The Flutter app draws these with Material icons, which do not exist on the
 * web without pulling in a font. Each path here is a stroke equivalent of the
 * specific Material glyph the app uses — the Material name is recorded beside
 * every category in lib/tokens.ts, so the two lists can be checked against each
 * other.
 *
 * Deliberately inline SVG, not an icon package: the whole set is ~3KB, renders
 * at any size without a font swap, and inherits `currentColor` so a chip can
 * colour its icon and its label from one token.
 */
import type { SVGProps } from "react";

const paths: Record<string, string> = {
  // Home & Property
  plumbing: "M7 21h10 M12 21v-6 M6 11h12v1a6 6 0 0 1-12 0z M12 11V7a3 3 0 0 1 3-3h3",
  electrical: "M13 2 4 14h7l-1 8 9-12h-7z",
  masonry: "M3 6h18v5H3z M3 13h18v5H3z M9 6v5 M15 6v5 M7 13v5 M13 13v5 M19 13v5",
  carpentry: "M4 20 13 11 M11 7l4-4 5 5-4 4z M11.5 7.5l5 5",
  painting: "M3 4h13v5H3z M9.5 9v3 M7.5 12h4v9h-4z M16 6.5h5",
  welding: "M6 22 10 13 M14 2l5 3-6.5 9.5L8 11z M8.5 12.5 13 15",
  // Cleaning & Household
  cleaning: "M12 3v6 M8 9h8l1 12H7z M10.5 13v4 M14 13v4",
  laundry: "M4 3h16v18H4z M12 17a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z M7.5 6h.01 M10.5 6h.01",
  gardening: "M2 21h20 M5 21c0-5 2.5-8.5 4-10.5 M12 21c0-6.5 2-10 4.5-12 M19.5 21c-.5-4-1.5-6.5-3-8.5",
  // Security & Transport
  security: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  driver:
    "M3 13.5 5 8a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5.5V18h-3 M3 18v-4.5 M3 18h3 M6 18h12 M6.5 16h.01 M17.5 16h.01",
  delivery:
    "M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M8 16h8 M16.5 16 13 6h-2 M13.5 8H17l2 6",
  // Automotive
  mechanic: "M14.7 6.3a4 4 0 0 0 5 5l-9 9a2.12 2.12 0 0 1-3-3z M14.7 6.3l3 3",
  carwash: "M5 13h14v5H5z M6.5 13 8 9h8l1.5 4 M8 21v-3 M16 21v-3 M8 6V3 M12 6V3 M16 6V3",
  // Appliance & Tech Repair
  appliance: "M6 2h12v20H6z M6 10h12 M9 5.5v2.5 M9 13v2.5",
  ac: "M12 2v20 M4.9 6.5l14.2 11 M19.1 6.5 4.9 17.5 M9.5 4 12 6l2.5-2 M9.5 20 12 18l2.5 2",
  phone: "M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M10.5 18.5h3",
  computer: "M3 4h18v12H3z M8 20h8 M12 16v4",
  // Creative & Digital
  design: "M9 11.9 3 18v3h3l6.1-6.1 M14 7l3 3 M17.5 3.5a2.12 2.12 0 0 1 3 3L12 15l-3-3z",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  photography: "M3 7h4l2-2h6l2 2h4v12H3z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  videography: "M2 6h13v12H2z M15 10l7-4v12l-7-4z",
  // Events & Hospitality
  events: "M3 21l7-15 7 7z M15 3c.5 1 1.5 1.5 2.5 1.5 M19 8c1 0 1.8.6 2 1.5 M14 12h.01 M20 15h.01",
  catering: "M6 3v7a2 2 0 0 0 4 0V3 M8 10v11 M17 3c-1.6 1.8-2 3.6-2 6v2h4V9c0-2.4-.4-4.2-2-6z M17 11v10",
  // Education & Care
  tutoring: "M22 9 12 4 2 9l10 5z M6 11.5V16c0 1.6 3 3 6 3s6-1.4 6-3v-4.5",
  babysitting: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9 10h.01 M15 10h.01 M9 14.5a4 4 0 0 0 6 0",
  caregiving: "M12 21S4 16.5 4 11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 11c0 5.5-8 10-8 10z",
  // Moving & Construction
  moving: "M4 21h16 M12 3v9 M9 6l3-3 3 3 M6 13h12v5H6z",
  interior: "M6 19v2 M18 19v2 M7 12V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7 M5 12h14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z",
  construction: "M12 3v8 M12 11 5 21h14z M9 17h6",
  labour: "M4 18h16v3H4z M6 18v-3a6 6 0 0 1 12 0v3 M10 9V6h4v3",
  // Fallback
  other: "M6 12h.01 M12 12h.01 M18 12h.01",
};

export type CategoryIconName = keyof typeof paths;

interface Props extends Omit<SVGProps<SVGSVGElement>, "name"> {
  /** The `icon` field on a CATEGORIES entry in lib/tokens.ts. */
  name: string;
  size?: number;
}

export function CategoryIcon({ name, size = 12, className = "", ...rest }: Props) {
  const d = paths[name] ?? paths.other;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
