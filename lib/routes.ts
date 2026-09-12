/**
 * The indexing policy, in one place.
 *
 * WHY THIS FILE EXISTS. Indexability was previously spread across three
 * unrelated spots: a hand-maintained array in lib/site.ts that the sitemap read,
 * a `robots` key in whichever page remembered to set one, and robots.txt. Those
 * three can disagree, and they did — /components was crawlable, absent from the
 * sitemap, and canonicalised to the homepage, which is three different opinions
 * about one URL. Anything a search engine is told about a route is now decided
 * here, and tests/routes.test.ts checks the sitemap and the pages agree with it.
 *
 * THREE STATES, AND THE DIFFERENCE BETWEEN THE LAST TWO
 * ----------------------------------------------------
 * INDEX     public, useful, in the sitemap.
 * NOINDEX   reachable and crawlable, but carrying `noindex`. Used where a page
 *           must be FETCHED for the directive to be seen — which is exactly why
 *           these are not disallowed in robots.txt. A URL blocked in robots.txt
 *           can still be indexed from external links, and Google cannot read the
 *           noindex it was never allowed to fetch. Blocking is the weaker
 *           control, not the stronger one.
 * BLOCKED   disallowed in robots.txt. Only for routes where crawling itself is
 *           the thing to prevent — the identity hand-off, which carries
 *           single-use credentials in its query string, and the API.
 */

import { SITE } from "./site";
import { canonical } from "./seo";
import { SERVICES } from "./services";
import { CITY_PAGES, SERVICE_CITY_PAIRS } from "./places";
import { GUIDES } from "./guides";

export interface IndexableRoute {
  url: string;
  /** Only set where a real, verifiable content date exists. */
  lastModified?: string;
}

/**
 * Static pages that should be in Google.
 *
 * Ordered as a crawler would usefully meet them rather than alphabetically:
 * entry points, then the two hubs, then the audience pages, then trust, then
 * legal.
 */
export const STATIC_INDEXABLE: string[] = [
  "/",
  "/services",
  "/areas",
  "/guides",
  "/how-it-works",
  "/download",
  "/for-customers",
  "/for-providers",
  "/become-a-provider",
  "/safety",
  "/help",
  "/support",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/community-guidelines",
];

/**
 * Reachable, crawlable, deliberately not indexed.
 *
 * Each one must call `pageMetadata({ robots: "noindex" })` — that is what
 * tests/routes.test.ts asserts, because a route listed here without the
 * directive is a page that quietly became indexable.
 */
export const NOINDEX_ROUTES: string[] = [
  // The internal design-system parity gallery. Useful to the team, meaningless
  // in a search result, and it was indexable until now.
  "/components",
  // The post-identity-action landing page. Says one word about an outcome; has
  // no standalone meaning and should never be a search result.
  "/auth/continue",
];

/**
 * Disallowed in robots.txt.
 *
 * KEPT DELIBERATELY SHORT. Over-blocking is the classic self-inflicted SEO
 * wound, and blocking a path also blocks any noindex inside it. These two earn
 * it: /auth/action receives single-use credentials in its query string and must
 * not be fetched by anything, and /api is machine surface with no rendering.
 */
export const BLOCKED_PREFIXES: string[] = ["/auth/action", "/api/"];

/** Every URL that belongs in the sitemap, canonical and deduplicated. */
export function allIndexableRoutes(): IndexableRoute[] {
  const routes: IndexableRoute[] = [];

  for (const path of STATIC_INDEXABLE) {
    routes.push({ url: canonical(path) });
  }

  for (const service of SERVICES) {
    routes.push({ url: canonical(`/services/${service.slug}`) });
  }

  // Only the pairs that have a hand-written local note. See lib/places.ts.
  for (const pair of SERVICE_CITY_PAIRS) {
    routes.push({ url: canonical(`/services/${pair.service}/${pair.city}`) });
  }

  for (const city of CITY_PAGES) {
    routes.push({ url: canonical(`/areas/${city.id}`) });
  }

  // The guides are the only URLs with a lastmod, because they are the only ones
  // with a date that means anything. See app/sitemap.ts.
  for (const guide of GUIDES) {
    routes.push({
      url: canonical(`/guides/${guide.slug}`),
      lastModified: guide.modified,
    });
  }

  const seen = new Set<string>();
  return routes.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

/** True when `path` must never appear in the sitemap. */
export function isExcluded(path: string): boolean {
  if (NOINDEX_ROUTES.includes(path)) return true;
  return BLOCKED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/** Absolute sitemap URL, for robots.txt and for the Search Console checklist. */
export const SITEMAP_URL = `${SITE.url}/sitemap.xml`;
