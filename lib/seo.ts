import type { Metadata } from "next";
import { SITE } from "./site";

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
  const ogTitle = `${title} · ${SITE.name}`;
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
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
