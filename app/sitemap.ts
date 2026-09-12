import type { MetadataRoute } from "next";
import { allIndexableRoutes } from "@/lib/routes";

/**
 * The sitemap.
 *
 * WHAT CHANGED AND WHY. The previous version emitted `changefreq` and
 * `priority` on every entry. Google's current sitemap documentation says
 * plainly that it "ignores <priority> and <changefreq> values" — so those tags
 * were bytes that did nothing except invite somebody to tune them. They are
 * gone. `lastmod` IS used, but only where it is "consistently and verifiably
 * accurate", which rules out stamping every URL with today's date on every
 * build: a sitemap that claims 90 pages changed this morning teaches Google to
 * disregard the field entirely. So nothing carries a lastmod until there is a
 * real content date to carry — the guides, which have one.
 *
 * ONE FILE, NOT A SITEMAP INDEX. The limit is 50,000 URLs; this site has under
 * a hundred. Splitting into pages/services/locations sitemaps would buy
 * separate coverage reporting in Search Console and cost an extra fetch and a
 * file to keep in step. Worth doing at a few thousand URLs, not at ninety.
 *
 * THE LIST COMES FROM lib/routes.ts, which is also what the indexing tests read.
 * A page that is noindexed cannot appear here, because both facts are declared
 * in the same place.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allIndexableRoutes().map((route) => ({
    url: route.url,
    ...(route.lastModified ? { lastModified: route.lastModified } : null),
  }));
}
