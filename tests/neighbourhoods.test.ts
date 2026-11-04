/**
 * The neighbourhood tier's gate, and the checks that keep it a gate.
 *
 * The risk here is larger than at the city tier. Cities × services is about
 * a thousand URLs. Neighbourhoods × services is a few thousand, and any of them
 * could be produced by a template in an afternoon. Every test below exists so
 * that a templated page cannot get through quietly.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { CITIES } from "../lib/generated/places.ts";
import { CITY_PAGES, LOCAL_NOTES, cityById, isCityPage, localNote } from "../lib/places.ts";
import { serviceBySlug } from "../lib/services.ts";
import {
  NEIGHBOURHOOD_NOTES,
  SERVICE_NEIGHBOURHOOD_PAGES,
  neighbourhoodBySlug,
  neighbourhoodPageCopy,
  neighbourhoodSlug,
  neighbourhoodsOf,
} from "../lib/neighbourhoods.ts";
import { allIndexableRoutes } from "../lib/routes.ts";
import { canonical } from "../lib/seo.ts";
import { PAYMENTS } from "../lib/site.ts";
import { serviceLd } from "../lib/jsonld.ts";

// ─────────────────────────────────────────────────── slugs

test("neighbourhood slugs are URL-safe and unique within their city", () => {
  for (const city of CITY_PAGES) {
    const seen = new Map<string, string>();
    for (const n of neighbourhoodsOf(city.id)) {
      assert.match(n.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug "${n.slug}" for ${n.name}`);
      const clash = seen.get(n.slug);
      assert.equal(clash, undefined, `${city.id}: "${n.name}" and "${clash}" share slug ${n.slug}`);
      seen.set(n.slug, n.name);
    }
  }
  assert.equal(neighbourhoodSlug("Nairobi CBD"), "nairobi-cbd");
  assert.equal(neighbourhoodSlug("Section 58"), "section-58");
  assert.equal(neighbourhoodSlug("Old Town"), "old-town");
});

// ──────────────────────────────────────────────────── the gate

test("every neighbourhood note passes every condition of the gate", () => {
  // SERVICE_NEIGHBOURHOOD_PAGES silently drops a note that fails the gate.
  // That is right for the build and wrong for the author, so this says why.
  for (const key of Object.keys(NEIGHBOURHOOD_NOTES)) {
    const parts = key.split(":");
    assert.equal(parts.length, 3, `"${key}" is not service:city:neighbourhood`);
    const [slug, cityId, area] = parts;
    const service = serviceBySlug(slug);
    assert.ok(service, `${key}: unknown service "${slug}"`);
    assert.ok(service.local, `${key}: "${slug}" is not a local-intent service`);
    assert.ok(cityById(cityId), `${key}: unknown city "${cityId}"`);
    assert.ok(isCityPage(cityId), `${key}: "${cityId}" has no city page`);
    assert.ok(
      neighbourhoodBySlug(cityId, area),
      `${key}: "${area}" is not a ${cityId} neighbourhood in the registry`,
    );
    assert.ok(
      localNote(slug, cityId),
      `${key}: write the ${slug}:${cityId} city note first — a neighbourhood page cannot hang off a 404`,
    );
  }
  assert.equal(SERVICE_NEIGHBOURHOOD_PAGES.length, Object.keys(NEIGHBOURHOOD_NOTES).length);
});

/**
 * THE LOAD-BEARING ONE, as at the city tier. If a page could exist without a
 * substantial note, this route would generate thousands of near-identical URLs.
 */
test("every neighbourhood page has a substantial written note", () => {
  for (const p of SERVICE_NEIGHBOURHOOD_PAGES) {
    const key = `${p.service}:${p.city}:${p.neighbourhood}`;
    const note = NEIGHBOURHOOD_NOTES[key];
    assert.ok(note, `${key} has a page but no note`);
    assert.ok(note.length >= 2, `${key}: needs at least 2 paragraphs`);
    for (const paragraph of note) {
      assert.ok(paragraph.length >= 160, `${key}: paragraph too thin to be local knowledge`);
    }
  }
});

test("a neighbourhood note names its neighbourhood, not just the city", () => {
  // A note that only says "Nairobi" is a city note in the wrong file.
  for (const [key, note] of Object.entries(NEIGHBOURHOOD_NOTES)) {
    const [, cityId, area] = key.split(":");
    const n = neighbourhoodBySlug(cityId, area);
    if (!n) continue; // reported by the gate test
    const body = note.join(" ");
    assert.ok(body.includes(n.name), `${key}: never names ${n.name}`);
  }
});

/**
 * THE TEMPLATE DETECTOR.
 *
 * The failure this gate exists to prevent is not a missing note. It is the same
 * note written once and copied with the place names swapped. Every place name
 * in the registry is masked out, and then every pair of notes, at both tiers,
 * is compared on overlapping four-word runs. Hand-written notes share almost
 * none. A templated pair shares nearly all of them.
 */
test("no two local notes are the same text with the places swapped", () => {
  const places = Array.from(
    new Set(
      CITIES.flatMap((c) => [c.name, c.county, ...(c.neighbourhoods ?? [])]).concat("Kenya"),
    ),
  ).sort((a, b) => b.length - a.length);
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const placeRe = new RegExp(`\\b(${places.map(escape).join("|")})\\b`, "g");

  const shingles = (text: string) => {
    const words = text
      .replace(placeRe, " PLACE ")
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    const set = new Set<string>();
    for (let i = 0; i + 4 <= words.length; i++) set.add(words.slice(i, i + 4).join(" "));
    return set;
  };

  const notes = [
    ...Object.entries(LOCAL_NOTES),
    ...Object.entries(NEIGHBOURHOOD_NOTES),
  ].map(([key, paras]) => ({ key, set: shingles(paras.join(" ")) }));

  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const a = notes[i].set;
      const b = notes[j].set;
      let shared = 0;
      a.forEach((s) => {
        if (b.has(s)) shared++;
      });
      const jaccard = shared / (a.size + b.size - shared);
      assert.ok(
        jaccard < 0.15,
        `${notes[i].key} and ${notes[j].key} overlap ${(jaccard * 100).toFixed(0)}% once place names are removed — one is a template of the other`,
      );
    }
  }
});

// ──────────────────────────────────────────── what ships to Google

test("titles and descriptions promise nothing Help24 cannot show", () => {
  /*
   * "Best emergency plumbers in Changamwe" is the title a page farm would use.
   * Help24 cannot yet show that any provider is the best, the cheapest, or
   * available around the clock, and a title is a claim like any other.
   */
  const banned =
    /\b(best|top|top-rated|cheap|cheapest|affordable|emergency|guaranteed|trusted|24\/7|#1|number one)\b/i;
  for (const p of SERVICE_NEIGHBOURHOOD_PAGES) {
    const copy = neighbourhoodPageCopy(p.service, p.city, p.neighbourhood, PAYMENTS.methods);
    assert.ok(copy, `no copy for ${p.service}/${p.city}/${p.neighbourhood}`);
    for (const text of [copy.title, copy.description, copy.h1]) {
      assert.ok(!banned.test(text), `unsupported claim in "${text}"`);
    }
    assert.ok(copy.title.length <= 60, `title is ${copy.title.length} chars: ${copy.title}`);
    assert.ok(
      copy.description.length >= 70 && copy.description.length <= 200,
      `description is ${copy.description.length} chars for ${copy.title}`,
    );
    assert.match(copy.description, /^Post an? /, "article mismatch in the description");
    assert.doesNotMatch(copy.description, /\ba [aeiou]/i, `wrong article: ${copy.description}`);
  }
});

test("titles are distinct across every neighbourhood page", () => {
  const titles = SERVICE_NEIGHBOURHOOD_PAGES.map(
    (p) => neighbourhoodPageCopy(p.service, p.city, p.neighbourhood, PAYMENTS.methods)!.title,
  );
  assert.equal(new Set(titles).size, titles.length);
});

test("every neighbourhood page is in the sitemap, and nothing else at that depth", () => {
  const urls = allIndexableRoutes().map((r) => r.url);
  const expected = new Set(
    SERVICE_NEIGHBOURHOOD_PAGES.map((p) =>
      canonical(`/services/${p.service}/${p.city}/${p.neighbourhood}`),
    ),
  );
  expected.forEach((url) => assert.ok(urls.includes(url), `missing ${url}`));
  const depth4 = urls.filter((u) => /\/services\/[^/]+\/[^/]+\/[^/]+$/.test(u));
  assert.deepEqual(new Set(depth4), expected);
});

test("neighbourhood markup names the place without inventing its coordinates", () => {
  const city = cityById("mombasa")!;
  const ld = serviceLd({
    name: "Plumbing in Changamwe, Mombasa",
    description: "x",
    path: "/services/plumbing/mombasa/changamwe",
    areaServed: {
      city: city.name,
      county: city.county,
      lat: city.lat,
      lng: city.lng,
      neighbourhood: "Changamwe",
    },
  }) as Record<string, any>;
  assert.equal(ld.areaServed["@type"], "Place");
  assert.equal(ld.areaServed.name, "Changamwe");
  // The registry has no neighbourhood coordinates; the city's must not be
  // presented as Changamwe's.
  assert.equal(ld.areaServed.geo, undefined);
  assert.equal(ld.areaServed.containedInPlace["@type"], "City");
  assert.equal(ld.areaServed.containedInPlace.name, "Mombasa");
  assert.equal(ld.areaServed.containedInPlace.geo.latitude, city.lat);
});
