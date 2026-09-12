import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { BLOCKED_PREFIXES, SITEMAP_URL } from "@/lib/routes";

/**
 * robots.txt.
 *
 * WHAT IS BLOCKED, AND WHAT IS DELIBERATELY NOT. Two prefixes are disallowed:
 * the identity action handler, which receives single-use credentials in its
 * query string and should not be fetched by anything, and /api.
 *
 * Everything else stays crawlable, including the pages that carry `noindex`.
 * That is the counter-intuitive part and it is correct: Google cannot read a
 * noindex on a page it is not allowed to fetch, so a disallowed URL that
 * somebody links to can still end up in the index — as a bare URL with no
 * description, which is the worst of both outcomes. Crawlable-and-noindexed is
 * the stronger control; blocked is for things that must not be requested at all.
 *
 * No CSS or JS is blocked. Googlebot renders the page and needs both; a
 * disallowed stylesheet produces a rendered page that looks broken to the
 * renderer and is judged accordingly.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: BLOCKED_PREFIXES,
    },
    sitemap: SITEMAP_URL,
    host: SITE.url,
  };
}
