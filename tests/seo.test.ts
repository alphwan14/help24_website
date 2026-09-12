/**
 * The checks that stop the SEO architecture rotting.
 *
 * Every assertion here corresponds to a mistake that is easy to make once and
 * invisible afterwards: a service page for a category the app cannot post, a
 * city page with no local content behind it, a noindexed URL in the sitemap, a
 * canonical pointing at a URL that redirects. None of those break a build or
 * show up in a browser. They show up six weeks later in Search Console.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  SERVICES,
  serviceBySlug,
  servicesByGroup,
  titleCaseWorker,
  withArticle,
} from "../lib/services.ts";
import {
  CITY_CONTENT,
  CITY_PAGES,
  SERVICE_CITY_PAIRS,
  LOCAL_NOTES,
  cityById,
  isCityPage,
} from "../lib/places.ts";
import { GUIDES } from "../lib/guides.ts";
import { CITIES } from "../lib/generated/places.ts";
import { allIndexableRoutes, NOINDEX_ROUTES, STATIC_INDEXABLE } from "../lib/routes.ts";
import { canonical, pageMetadata } from "../lib/seo.ts";
import { SITE, SOCIALS } from "../lib/site.ts";
import { breadcrumbLd, serviceLd, organizationLd, articleLd } from "../lib/jsonld.ts";

/**
 * The app's own category list, copied here rather than imported.
 *
 * lib/tokens.ts pulls in the colour system and would drag half the design
 * tokens into a node:test run. This list is the contract itself: if the app
 * gains or loses a category, this array is the thing that has to be updated,
 * and updating it is what makes the next assertion fail until the catalogue
 * catches up.
 */
const APP_CATEGORIES = [
  "Plumbing", "Electrical", "Masonry", "Carpentry", "Painting", "Welding",
  "House Cleaning", "Laundry", "Gardening",
  "Security Guard", "Driver", "Delivery Rider",
  "Mechanic", "Car Wash",
  "Appliance Repair", "AC Repair", "Phone Repair", "Computer Repair",
  "Graphic Design", "Software Development", "Photography", "Videography",
  "Event Planning", "Catering",
  "Tutoring", "Babysitting", "Caregiving",
  "Moving Services", "Interior Design", "Construction", "General Labour",
  "Other",
];

// ─────────────────────────────────────────────── the catalogue

test("every service maps to a real app category", () => {
  for (const s of SERVICES) {
    assert.ok(
      APP_CATEGORIES.includes(s.category),
      `${s.slug} claims category "${s.category}", which the app does not have`,
    );
  }
});

test('every app category except "Other" has a page', () => {
  const covered = new Set(SERVICES.map((s) => s.category));
  for (const category of APP_CATEGORIES) {
    if (category === "Other") continue;
    assert.ok(covered.has(category), `no service page for "${category}"`);
  }
});

test('"Other" has no page of its own', () => {
  // It is the composer's fallback label, not a service somebody searches for.
  assert.equal(SERVICES.find((s) => s.category === "Other"), undefined);
});

test("slugs are unique, lowercase and URL-safe", () => {
  const seen = new Set<string>();
  for (const s of SERVICES) {
    assert.match(s.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug: ${s.slug}`);
    assert.ok(!seen.has(s.slug), `duplicate slug: ${s.slug}`);
    seen.add(s.slug);
  }
});

test("every service carries enough content to justify a page", () => {
  for (const s of SERVICES) {
    assert.ok(s.intro.length >= 2, `${s.slug}: fewer than 2 intro paragraphs`);
    assert.ok(s.tasks.length >= 6, `${s.slug}: fewer than 6 tasks`);
    assert.ok(s.detailsToInclude.length >= 4, `${s.slug}: too few request tips`);
    assert.ok(s.priceFactors.length >= 4, `${s.slug}: too few price factors`);
    assert.ok(s.checks.length >= 3, `${s.slug}: too few checks`);
    assert.ok(s.alsoCalled.length >= 2, `${s.slug}: needs 2+ alternate names`);
  }
});

test("related services exist and are not self-references", () => {
  for (const s of SERVICES) {
    for (const slug of s.related) {
      assert.notEqual(slug, s.slug, `${s.slug} lists itself as related`);
      assert.ok(serviceBySlug(slug), `${s.slug} relates to unknown "${slug}"`);
    }
  }
});

test("titles and descriptions are distinct and within sane lengths", () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const s of SERVICES) {
    assert.ok(!titles.has(s.title), `duplicate title: ${s.title}`);
    assert.ok(!descriptions.has(s.description), `duplicate description on ${s.slug}`);
    titles.add(s.title);
    descriptions.add(s.description);
    assert.ok(s.title.length <= 70, `${s.slug}: title is ${s.title.length} chars`);
    assert.ok(
      s.description.length >= 70 && s.description.length <= 200,
      `${s.slug}: description is ${s.description.length} chars`,
    );
  }
});

test("the indefinite article matches every worker and category name", () => {
  // "Find a AC technician Near You" shipped as a page title before this
  // existed. A fifth of the catalogue starts with a vowel.
  assert.equal(withArticle("plumber"), "a plumber");
  assert.equal(withArticle("electrician"), "an electrician");
  assert.equal(withArticle("AC technician"), "an AC technician");
  for (const s of SERVICES) {
    for (const word of [s.worker, s.category.toLowerCase()]) {
      const expected = /^[aeiou]/i.test(word) ? "an " : "a ";
      assert.ok(
        withArticle(word).startsWith(expected),
        `wrong article for "${word}"`,
      );
    }
  }
  assert.equal(titleCaseWorker("AC technician"), "AC Technician");
  assert.equal(titleCaseWorker("plumber"), "Plumber");
});

test("grouping covers every service exactly once", () => {
  const flat = servicesByGroup().flatMap((g) => g.items.map((s) => s.slug));
  assert.equal(flat.length, SERVICES.length);
  assert.equal(new Set(flat).size, SERVICES.length);
});

// ──────────────────────────────────────────────── the locations

test("city pages exist only where the registry knows neighbourhoods", () => {
  for (const city of CITY_PAGES) {
    assert.ok(
      (city.neighbourhoods?.length ?? 0) > 0,
      `${city.id} has a page but no neighbourhoods`,
    );
  }
  const withAreas = CITIES.filter((c) => (c.neighbourhoods?.length ?? 0) > 0);
  assert.equal(CITY_PAGES.length, withAreas.length);
});

test("every city page has written content", () => {
  for (const city of CITY_PAGES) {
    const content = CITY_CONTENT[city.id];
    assert.ok(content, `${city.id} has a page but no CITY_CONTENT entry`);
    assert.ok(content.intro.length >= 2, `${city.id}: fewer than 2 paragraphs`);
    assert.ok(content.common.length >= 4, `${city.id}: too few common jobs`);
    assert.ok(content.description.length >= 70, `${city.id}: description too short`);
  }
});

test("no CITY_CONTENT entry without a page", () => {
  for (const id of Object.keys(CITY_CONTENT)) {
    assert.ok(isCityPage(id), `CITY_CONTENT has "${id}", which has no page`);
  }
});

/**
 * THE LOAD-BEARING ONE.
 *
 * If this ever fails open — if a pair can exist without a note — the route
 * becomes a generator for 1,020 near-identical URLs, which is scaled content
 * abuse and a sitewide risk. The assertion is not about tidiness.
 */
test("every service+city page has a hand-written local note", () => {
  assert.ok(SERVICE_CITY_PAIRS.length > 0, "no service+city pages at all");
  for (const pair of SERVICE_CITY_PAIRS) {
    const note = LOCAL_NOTES[`${pair.service}:${pair.city}`];
    assert.ok(note, `${pair.service}:${pair.city} has a page but no note`);
    assert.ok(note.length >= 2, `${pair.service}:${pair.city}: note needs 2 paragraphs`);
    for (const paragraph of note) {
      assert.ok(
        paragraph.length >= 120,
        `${pair.service}:${pair.city}: paragraph too thin to be local knowledge`,
      );
    }
  }
});

test("local notes reference real services and real city pages", () => {
  for (const key of Object.keys(LOCAL_NOTES)) {
    const [slug, cityId] = key.split(":");
    const service = serviceBySlug(slug);
    assert.ok(service, `local note for unknown service "${slug}"`);
    assert.ok(service.local, `local note for "${slug}", which is not local-intent`);
    assert.ok(cityById(cityId), `local note for unknown city "${cityId}"`);
    assert.ok(isCityPage(cityId), `local note for "${cityId}", which has no city page`);
  }
});

test("local notes are unique — no note reused across cities", () => {
  const seen = new Map<string, string>();
  for (const [key, note] of Object.entries(LOCAL_NOTES)) {
    const body = note.join(" ");
    const previous = seen.get(body);
    assert.equal(previous, undefined, `${key} reuses the note from ${previous}`);
    seen.set(body, key);
  }
});

test("a local note names its own city or something specific to it", () => {
  // Guards against a note that would read identically with the place swapped —
  // which is the template this whole gate exists to prevent.
  for (const [key, note] of Object.entries(LOCAL_NOTES)) {
    const [, cityId] = key.split(":");
    const city = cityById(cityId)!;
    const body = note.join(" ");
    const names = [city.name, ...(city.neighbourhoods ?? [])];
    assert.ok(
      names.some((n) => body.includes(n)) || body.includes(city.county),
      `${key}: the note never names ${city.name} or anywhere in it`,
    );
  }
});

// ─────────────────────────────────────────────────── the guides

test("guides have real dates, distinct slugs and enough sections", () => {
  const seen = new Set<string>();
  for (const g of GUIDES) {
    assert.ok(!seen.has(g.slug), `duplicate guide slug: ${g.slug}`);
    seen.add(g.slug);
    assert.match(g.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.match(g.published, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(g.modified, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      new Date(g.modified) >= new Date(g.published),
      `${g.slug}: modified is before published`,
    );
    assert.ok(g.sections.length >= 5, `${g.slug}: fewer than 5 sections`);
    for (const section of g.sections) {
      assert.ok(section.paragraphs.length >= 1, `${g.slug}/${section.heading}: empty`);
    }
  }
});

test("guides link only to services that exist", () => {
  for (const g of GUIDES) {
    for (const slug of g.relatedServices) {
      assert.ok(serviceBySlug(slug), `${g.slug} links to unknown service "${slug}"`);
    }
  }
});

// ─────────────────────────────────────── indexing and canonicals

test("canonical never emits a trailing slash", () => {
  // The site 308s /services/ to /services, so a canonical with a slash would
  // point every page at a URL that redirects.
  assert.equal(canonical("/"), SITE.url);
  assert.equal(canonical("/services"), `${SITE.url}/services`);
  assert.equal(canonical("/services/"), `${SITE.url}/services`);
  assert.equal(canonical("services"), `${SITE.url}/services`);
});

test("every sitemap URL is absolute, canonical and on the real domain", () => {
  for (const route of allIndexableRoutes()) {
    assert.ok(route.url.startsWith(`${SITE.url}`), `off-domain: ${route.url}`);
    assert.ok(!route.url.endsWith("/") || route.url === SITE.url, `trailing slash: ${route.url}`);
    assert.ok(!route.url.includes("?"), `query string in sitemap: ${route.url}`);
    assert.ok(!route.url.includes("//", 8), `double slash: ${route.url}`);
  }
});

test("the sitemap has no duplicates", () => {
  const urls = allIndexableRoutes().map((r) => r.url);
  assert.equal(new Set(urls).size, urls.length);
});

test("no noindexed route appears in the sitemap", () => {
  const urls = new Set(allIndexableRoutes().map((r) => r.url));
  for (const path of NOINDEX_ROUTES) {
    assert.ok(!urls.has(canonical(path)), `${path} is noindexed but in the sitemap`);
  }
});

test("private and internal areas are never in the sitemap", () => {
  const forbidden = ["/auth", "/api", "/components"];
  for (const route of allIndexableRoutes()) {
    const path = route.url.slice(SITE.url.length);
    for (const prefix of forbidden) {
      assert.ok(!path.startsWith(prefix), `${path} must not be indexable`);
    }
  }
});

test("the sitemap contains every service, city, pair and guide", () => {
  const urls = new Set(allIndexableRoutes().map((r) => r.url));
  for (const s of SERVICES) {
    assert.ok(urls.has(canonical(`/services/${s.slug}`)), `missing /services/${s.slug}`);
  }
  for (const c of CITY_PAGES) {
    assert.ok(urls.has(canonical(`/areas/${c.id}`)), `missing /areas/${c.id}`);
  }
  for (const p of SERVICE_CITY_PAIRS) {
    assert.ok(
      urls.has(canonical(`/services/${p.service}/${p.city}`)),
      `missing /services/${p.service}/${p.city}`,
    );
  }
  for (const g of GUIDES) {
    assert.ok(urls.has(canonical(`/guides/${g.slug}`)), `missing /guides/${g.slug}`);
  }
  for (const path of STATIC_INDEXABLE) {
    assert.ok(urls.has(canonical(path)), `missing static route ${path}`);
  }
});

test("only the guides carry a lastmod", () => {
  // Google uses lastmod only where it is consistently accurate. Stamping every
  // URL with the build date is how a site trains it to ignore the field.
  for (const route of allIndexableRoutes()) {
    if (route.lastModified) {
      assert.ok(route.url.includes("/guides/"), `unjustified lastmod on ${route.url}`);
    }
  }
});

// ────────────────────────────────────────────── structured data

test("the organisation makes no unverified identity claims", () => {
  const org = organizationLd() as Record<string, unknown>;
  // sameAs asserts that an account IS this entity. The three that used to be
  // here belonged to other people.
  assert.equal(org.sameAs, undefined, "sameAs is back — verify every URL first");
  assert.equal(org["@id"], `${SITE.url}/#organization`);
  // No address: Help24 publishes no premises, and an invented one would be the
  // fabrication that LocalBusiness markup is most often caught doing.
  assert.equal(org.address, undefined);
});

test("no page links to a social account Help24 does not own", () => {
  /*
   * The Organization schema and the footer both claimed twitter.com/help24,
   * linkedin.com/company/help24 and instagram.com/help24. None belong to this
   * company. Removing the schema entry while leaving three links under the
   * lockup on every page would have fixed the assertion and kept the problem.
   */
  assert.deepEqual(SOCIALS, [], "SOCIALS is populated — verify Help24 owns every handle first");
});

test("metadata carries a share image and does not double-brand", () => {
  const branded = pageMetadata({
    title: `${SITE.name} — Find Trusted Local Service Providers in Kenya`,
    description: "x".repeat(80),
    path: "/",
  }) as any;
  assert.equal(
    branded.openGraph.title,
    `${SITE.name} — Find Trusted Local Service Providers in Kenya`,
    "the brand was appended to a title that already had it",
  );

  const plain = pageMetadata({
    title: "Plumbers in Kenya",
    description: "x".repeat(80),
    path: "/services/plumbing",
  }) as any;
  assert.equal(plain.openGraph.title, `Plumbers in Kenya · ${SITE.name}`);
  // Next replaces a parent's openGraph object rather than merging into it, so
  // omitting images here strips the share card from every page that calls this.
  assert.ok(plain.openGraph.images?.[0]?.url, "no og:image");
  assert.ok(plain.twitter.images?.[0], "no twitter:image");
});

test("breadcrumb positions are 1-based and items are canonical", () => {
  const ld = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Plumbing", path: "/services/plumbing" },
  ]) as { itemListElement: { position: number; item: string; name: string }[] };
  assert.deepEqual(
    ld.itemListElement.map((i) => i.position),
    [1, 2, 3],
  );
  assert.equal(ld.itemListElement[0].item, SITE.url);
  assert.equal(ld.itemListElement[2].item, `${SITE.url}/services/plumbing`);
});

test("service markup references the organisation and never invents a place", () => {
  const national = serviceLd({
    name: "Plumbing",
    description: "x",
    path: "/services/plumbing",
  }) as Record<string, any>;
  assert.deepEqual(national.provider, { "@id": `${SITE.url}/#organization` });
  assert.equal(national.areaServed["@type"], "Country");
  assert.equal(national["@type"], "Service");
  // Never LocalBusiness: Help24 has no premises anywhere.
  assert.notEqual(national["@type"], "LocalBusiness");

  const city = cityById("mombasa")!;
  const local = serviceLd({
    name: "Plumbing in Mombasa",
    description: "x",
    path: "/services/plumbing/mombasa",
    areaServed: { city: city.name, county: city.county, lat: city.lat, lng: city.lng },
  }) as Record<string, any>;
  assert.equal(local.areaServed["@type"], "City");
  assert.equal(local.areaServed.name, "Mombasa");
  assert.equal(local.areaServed.geo.latitude, city.lat);
  assert.equal(local.availableChannel.serviceUrl, `${SITE.url}/services/plumbing/mombasa`);
});

test("article markup carries the dates the page displays", () => {
  const g = GUIDES[0];
  const ld = articleLd({
    headline: g.title,
    description: g.description,
    path: `/guides/${g.slug}`,
    published: g.published,
    modified: g.modified,
  }) as Record<string, any>;
  assert.equal(ld.datePublished, g.published);
  assert.equal(ld.dateModified, g.modified);
  assert.deepEqual(ld.author, { "@id": `${SITE.url}/#organization` });
});

test("every JSON-LD block survives serialisation", () => {
  const blocks = [
    organizationLd(),
    serviceLd({ name: "Plumbing", description: "x", path: "/services/plumbing" }),
    breadcrumbLd([{ name: "Home", path: "/" }]),
  ];
  for (const block of blocks) {
    const round = JSON.parse(JSON.stringify(block));
    assert.equal(round["@context"], "https://schema.org");
    // A script tag inside a JSON-LD payload would break out of the block.
    assert.ok(!JSON.stringify(block).includes("</script"));
  }
});

// ────────────────────────────────────────── honesty about supply

test("no page claims a provider count, rating or price", () => {
  /*
   * Production held 16 accounts, 0 verified providers and 2 reviews in
   * September 2026. Any number on these pages would be invented, and an
   * invented number outlives the sprint that invented it. This scans the
   * catalogues for the shapes those claims take.
   */
  const corpus = [
    ...SERVICES.flatMap((s) => [...s.intro, ...s.tasks, ...s.priceFactors, s.description]),
    ...Object.values(LOCAL_NOTES).flat(),
    ...Object.values(CITY_CONTENT).flatMap((c) => [...c.intro, ...c.common]),
  ];
  const claims = [
    /\b\d+\+?\s+(verified\s+)?(providers|plumbers|electricians|cleaners|fundis)\b/i,
    /\bKES\s?[\d,]+/,
    /\b\d[\d,]*\s*(shillings|bob)\b/i,
    /\b\d(\.\d)?\s*(star|\/\s*5)\b/i,
    /\b(rated|rating of)\s+\d/i,
  ];
  for (const text of corpus) {
    for (const claim of claims) {
      assert.ok(!claim.test(text), `unsupported claim: "${text.slice(0, 110)}…"`);
    }
  }
});
