import type { Metadata } from "next";
import { SITE } from "./site";

/**
 * The share card.
 *
 * The OPAQUE rendition, matching the root layout: social clients composite a
 * transparent PNG onto a background of their own choosing, so the transparent
 * tile shows four bright notches at its corners in some clients and not others.
 */
const OG_IMAGE = {
  url: "/help24-icon-bleed.png",
  width: 1024,
  height: 1024,
  alt: SITE.name,
} as const;

/**
 * Per-route metadata. Keeps canonical URL, Open Graph and Twitter tags
 * consistent across pages.
 *
 * WHY `path` IS NOT OPTIONAL. The root layout sets `alternates: { canonical:
 * "/" }`, and Next's metadata resolution means any page that does not override
 * it INHERITS it — declaring itself a duplicate of the homepage. That is not a
 * hypothetical: /components shipped with `<link rel="canonical"
 * href="https://help24.co.ke">` on it for months. Every route that renders its
 * own page must call this, and `tests/metadata.test.ts` checks that none has
 * been missed.
 *
 * TITLES ARE INTENT-FIRST. The root layout appends `· Help24`, so the string
 * passed here should lead with what the page is about rather than with the
 * brand. "Plumbers in Mombasa" beats "Mombasa · Services" because the first
 * three words are the ones a person scans in a result list, and they are also
 * the ones that have to match what they typed.
 */
export function pageMetadata({
  title,
  description,
  path,
  robots,
}: {
  title: string;
  description: string;
  path: string;
  /**
   * Set `noindex` for pages people need and search engines do not. Anything
   * noindexed here must also be absent from the sitemap — the two are checked
   * against each other by tests/sitemap.test.ts.
   */
  robots?: "index" | "noindex";
}): Metadata {
  const url = canonical(path);
  // Do not brand a title that is already branded. See the note above.
  const ogTitle = title.includes(SITE.name) ? title : `${title} · ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    ...(robots === "noindex"
      ? { robots: { index: false, follow: false } }
      : null),
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "en_KE",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      /*
       * `summary`, not `summary_large_image`. The only card art this site has
       * is the 1024x1024 app icon, and a square image in a large-image card is
       * letterboxed with bars down both sides. The small card is the one that
       * was designed for a square.
       */
      card: "summary",
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/**
 * The one place a path becomes an absolute URL.
 *
 * The site serves no trailing slashes — `/services/` 308s to `/services` — so
 * the canonical must not carry one either, or every canonical would point at a
 * URL that redirects. The root is the exception and is emitted bare.
 */
export function canonical(path: string): string {
  if (path === "/") return SITE.url;
  const clean = path.endsWith("/") ? path.slice(0, -1) : path;
  return `${SITE.url}${clean.startsWith("/") ? clean : `/${clean}`}`;
}
