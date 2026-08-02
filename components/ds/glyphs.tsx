/**
 * The handful of non-category glyphs the feed components need.
 *
 * Each one mirrors the Material icon the Flutter card uses, named in the
 * comment so the two can be checked against each other.
 */
import type { SVGProps } from "react";

const paths: Record<string, string> = {
  pin: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", // Icons.location_on_outlined
  people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75", // Icons.people_outline
  wallet: "M3 7a2 2 0 0 1 2-2h12v4 M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6H7a2 2 0 0 1 0-4 M17 13.5h.01", // Icons.account_balance_wallet_outlined
  lock: "M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z M8 11V7a4 4 0 0 1 8 0v4", // Icons.lock_outline
  star: "M12 3l2.6 5.7 6.4.7-4.7 4.3 1.3 6.3L12 16.8 6.4 20l1.3-6.3L3 9.4l6.4-.7z", // Icons.star_rounded
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35", // Iconsax.search_normal
  close: "M6 6l12 12 M18 6 6 18", // Icons.close
  check: "M20 6 9 17l-5-5",
  chevronDown: "M6 9l6 6 6-6",
  arrowRight: "M5 12h14 M12 5l7 7-7 7",
  timer: "M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 10v4l2.5 2 M9 2h6", // Iconsax.timer_1
  storefront: "M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z M3 9l1.6-4.4A1 1 0 0 1 5.5 4h13a1 1 0 0 1 .9.6L21 9 M9 21v-6h6v6", // Icons.storefront_outlined
  send: "M22 2 11 13 M22 2l-7 20-4-9-9-4z",
  handshake: "M11 17 8 20a2 2 0 0 1-3-3l3-3 M2 12l4-4 4 4-4 4z M13 7l3-3a2 2 0 0 1 3 3l-3 3 M22 12l-4 4-4-4 4-4z",
};

export type GlyphName = keyof typeof paths;

interface Props extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: GlyphName | string;
  size?: number;
}

export function Glyph({ name, size = 14, className = "", ...rest }: Props) {
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
      <path d={paths[name] ?? paths.check} />
    </svg>
  );
}
