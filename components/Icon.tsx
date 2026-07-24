/**
 * Lightweight inline icon set (stroke, currentColor) so pages stay self-contained
 * with no icon dependency. Add new glyphs here as `name → <path/>` entries.
 */
import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  rocket: (
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  ),
  wallet: (
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a2 2 0 0 0 0 4h4v-4z" />
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />,
  briefcase: (
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
  ),
  user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  badge: (
    <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M9 21v-4l3 1 3-1v4l-3-1.5z M12 3v2" />
  ),
  safety: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01" />,
  scale: (
    <path d="M12 3v18 M7 21h10 M5 7h14 M8 3l-4 8a3 3 0 0 0 6 0zM16 3l4 8a3 3 0 0 1-6 0z" />
  ),
  wrench: (
    <path d="M14.7 6.3a4 4 0 0 0 5 5l-9 9a2.12 2.12 0 0 1-3-3z M14.7 6.3l3 3" />
  ),
  search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  mail: <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6" />,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  alert: <path d="M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  "check-circle": <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3" />,
  arrow: <path d="M5 12h14 M12 5l7 7-7 7" />,
  book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />,
  clock: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2" />,
  sparkle: <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />,
  play: <path d="M3 3.5v17a1 1 0 0 0 1.5.87l14-8.5a1 1 0 0 0 0-1.74l-14-8.5A1 1 0 0 0 3 3.5z" />,
  apple: (
    <path d="M12 6.5c.5-2 2-3.5 4-3.5 .2 2-1 3.7-2 4.4M16.5 12c0-2 1.3-3 2-3.4-1-1.5-2.5-2.1-3.8-2.1-1.5 0-2.3.8-3.2.8s-1.8-.8-3-.8C3.8 4.5 2 7 2 10.5c0 3.5 2.5 8 4.5 8 1 0 1.6-.8 3-.8s1.9.8 3 .8c1.6 0 3.3-3 3.9-5-2-.6-2.9-2-2.9-3.5z" />
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof paths | string;
}

export function Icon({ name, className = "h-5 w-5", ...props }: IconProps) {
  const glyph = paths[name] ?? paths.sparkle;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {glyph}
    </svg>
  );
}
