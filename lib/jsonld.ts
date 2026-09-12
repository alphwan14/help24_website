/**
 * Structured data.
 *
 * WHAT IS HERE AND WHY EACH ONE EARNED ITS PLACE
 * ----------------------------------------------
 * Organization + WebSite  the entity itself, once, in the root layout. This is
 *                         the part that teaches Google that "Help24" is a
 *                         Kenyan services marketplace rather than one of the
 *                         several unrelated things called Help24.
 * BreadcrumbList          on every nested page. Google still renders breadcrumb
 *                         trails in results, and it is the cheapest way to make
 *                         the service → city hierarchy legible.
 * Service                 on service and service+city pages. No rich result
 *                         attaches to it; it is here because it states plainly
 *                         what the page is about, who provides it and where,
 *                         which is what entity understanding and the AI
 *                         surfaces read.
 *
 * WHAT IS DELIBERATELY ABSENT
 * ---------------------------
 * LocalBusiness   requires a physical `address`, and means a place a customer
 *                 can go to. Help24 has no branches. Putting LocalBusiness on
 *                 /services/plumbing/mombasa would assert a Help24 premises in
 *                 Mombasa that does not exist — the exact misrepresentation
 *                 Google's structured data policies treat as spam.
 * FAQPage         Google deprecated FAQ rich results; as of May 2026 the
 *                 documentation is withdrawn and the feature is shown only for
 *                 government and health sites. The questions on these pages are
 *                 real and stay as ordinary headed prose, which is what both
 *                 readers and AI surfaces actually consume. Marking them up
 *                 would add bytes and buy nothing.
 * AggregateRating Help24 holds two reviews in production. A rating derived from
 *                 two reviews is not a rating, and Google requires review
 *                 markup to reflect what is genuinely on the page.
 * SearchAction    the sitelinks searchbox it powered was retired in 2024.
 *
 * EVERY VALUE BELOW IS ALSO ON THE PAGE. That is the standing rule for
 * structured data and the one most often broken. Nothing here describes
 * something a visitor cannot see.
 */

import { SITE } from "./site";
import { canonical } from "./seo";

/**
 * Stable node id for the organisation.
 *
 * Every other block references the entity through this rather than repeating
 * its name and URL, so a consumer stitching the graph together across pages
 * gets one Help24 rather than one per page.
 */
export const ORG_ID = `${SITE.url}/#organization`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: "Help24 Kenya",
    url: SITE.url,
    logo: `${SITE.url}/help24-icon.png`,
    image: `${SITE.url}/help24-icon-bleed.png`,
    email: SITE.supportEmail,
    description: SITE.description,
    slogan: SITE.tagline,
    /**
     * The country, as a Country node rather than the bare string "KE".
     * `areaServed: "KE"` is ambiguous enough that consumers have to guess;
     * naming it costs nothing.
     */
    areaServed: { "@type": "Country", name: "Kenya" },
    knowsLanguage: ["en-KE", "sw-KE"],
    /**
     * NO `sameAs`.
     *
     * This block used to claim twitter.com/help24, instagram.com/help24 and
     * linkedin.com/company/help24. None of them belong to this company — the
     * Instagram handle is a private individual's. `sameAs` is an identity
     * assertion: it tells Google those accounts ARE this entity, which both
     * misdirects the entity graph onto strangers and hands anything they post
     * a claim on the Help24 name. The field comes back when Help24 owns
     * accounts and somebody can name them.
     */
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-KE",
    publisher: { "@id": ORG_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Breadcrumbs. The trail passed in is the trail rendered on the page — see
 * components/Breadcrumbs.tsx, which takes the same array.
 */
export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: canonical(c.path),
    })),
  };
}

/**
 * A service Help24 connects people to.
 *
 * `provider` is Help24 because Help24 is what provides the marketplace service
 * being described; the description on every page says in plain words that the
 * work itself is done by independent providers, so the markup and the visible
 * text agree. `areaServed` narrows to a city on the city pages and is the
 * country elsewhere.
 */
export function serviceLd({
  name,
  description,
  path,
  areaServed,
}: {
  name: string;
  description: string;
  path: string;
  /** City name, or undefined for the national page. */
  areaServed?: { city: string; county: string; lat?: number; lng?: number };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    provider: { "@id": ORG_ID },
    areaServed: areaServed
      ? {
          "@type": "City",
          name: areaServed.city,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: `${areaServed.county} County`,
            containedInPlace: { "@type": "Country", name: "Kenya" },
          },
          ...(areaServed.lat !== undefined && areaServed.lng !== undefined
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: areaServed.lat,
                  longitude: areaServed.lng,
                },
              }
            : null),
        }
      : { "@type": "Country", name: "Kenya" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: canonical(path),
      availableLanguage: ["en", "sw"],
    },
  };
}

/** An editorial guide, with a named author and real dates. */
export function articleLd({
  headline,
  description,
  path,
  published,
  modified,
}: {
  headline: string;
  description: string;
  path: string;
  published: string;
  modified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: canonical(path),
    datePublished: published,
    dateModified: modified,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-KE",
    isAccessibleForFree: true,
  };
}
