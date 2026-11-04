/**
 * What to write next.
 *
 *   npm run seo:coverage
 *   npm run seo:coverage -- --queries ~/Downloads/Queries.csv
 *
 * The site grows one written note at a time (docs/seo-architecture.md §4).
 * This script answers the question that leaves open: which note is worth
 * writing next?
 *
 * WITHOUT --queries it reports structure: how many service-in-city and
 * neighbourhood pages exist, and which city-level notes are missing. A missing
 * city note blocks every neighbourhood page under it, so those come first.
 *
 * WITH --queries it reads a Search Console Performance export (Queries.csv, from
 * Performance → Export → CSV) and matches each query to a service and a place.
 * Queries that already earn impressions for a page Help24 has not written are
 * the best evidence there is that the page is wanted. That is demand, measured,
 * and it replaces guessing at search volume.
 *
 * This script never writes a note and never creates a page. It only lists what
 * is missing.
 */

import { readFileSync } from "node:fs";
import { SERVICES } from "../lib/services.ts";
import { CITY_PAGES, LAUNCH_CITY_IDS, SERVICE_CITY_PAIRS, localNote } from "../lib/places.ts";
import {
  SERVICE_NEIGHBOURHOOD_PAGES,
  neighbourhoodNote,
  neighbourhoodsOf,
} from "../lib/neighbourhoods.ts";

const local = SERVICES.filter((s) => s.local);
const cityOrder = (id) => {
  const i = LAUNCH_CITY_IDS.indexOf(id);
  return i === -1 ? 100 + CITY_PAGES.findIndex((c) => c.id === id) : i;
};
const cities = [...CITY_PAGES].sort((a, b) => cityOrder(a.id) - cityOrder(b.id));

// ─────────────────────────────────────────────── structure

const cityCeiling = local.length * CITY_PAGES.length;
const unlocked = SERVICE_CITY_PAIRS.reduce(
  (sum, p) => sum + neighbourhoodsOf(p.city).length,
  0,
);

console.log("\nHelp24 local page coverage\n");
console.log(`  Service-in-city pages     ${SERVICE_CITY_PAIRS.length} of ${cityCeiling} possible`);
console.log(
  `  Neighbourhood pages       ${SERVICE_NEIGHBOURHOOD_PAGES.length} written, ${unlocked} unlocked by existing city notes`,
);

console.log("\n  Neighbourhood pages by city");
for (const city of cities) {
  const n = SERVICE_NEIGHBOURHOOD_PAGES.filter((p) => p.city === city.id).length;
  const parents = SERVICE_CITY_PAIRS.filter((p) => p.city === city.id).length;
  console.log(
    `    ${city.name.padEnd(10)} ${String(n).padStart(3)} pages · ${parents} city notes · ${neighbourhoodsOf(city.id).length} neighbourhoods`,
  );
}

console.log("\n  Missing city notes (each one unlocks that city's neighbourhoods for the trade)");
for (const city of cities) {
  const missing = local.filter((s) => !localNote(s.slug, city.id)).map((s) => s.slug);
  if (missing.length) console.log(`    ${city.name.padEnd(10)} ${missing.join(", ")}`);
}

// ──────────────────────────────────────────── search demand

const flag = process.argv.indexOf("--queries");
if (flag === -1) {
  console.log(
    "\n  Add --queries <Search Console Queries.csv> to rank missing pages by real impressions.\n",
  );
  process.exit(0);
}

const file = process.argv[flag + 1];
if (!file) {
  console.error("--queries needs a path to a Search Console Queries.csv export");
  process.exit(1);
}

/** Minimal RFC 4180 parser: quoted fields, escaped quotes, CRLF. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") row.push(field), (field = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field), rows.push(row), (row = []), (field = "");
    } else field += c;
  }
  if (field || row.length) row.push(field), rows.push(row);
  return rows.filter((r) => r.some((f) => f.trim()));
}

const [header, ...rows] = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));
const qi = header.findIndex((h) => /quer/i.test(h));
const ii = header.findIndex((h) => /impression/i.test(h));
if (qi === -1 || ii === -1) {
  console.error(`Expected Query and Impressions columns; found: ${header.join(", ")}`);
  process.exit(1);
}

const has = (q, term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(q);

const serviceTerms = local.map((s) => ({
  slug: s.slug,
  terms: [s.category, s.worker, s.workers, s.slug.replace(/-/g, " "), ...s.alsoCalled],
}));

/** key → { label, impressions, queries[], exists } */
const demand = new Map();
let matched = 0;

for (const r of rows) {
  const q = r[qi] ?? "";
  const impressions = Number(String(r[ii]).replace(/,/g, "")) || 0;
  const services = serviceTerms.filter((s) => s.terms.some((t) => has(q, t))).map((s) => s.slug);
  if (!services.length) continue;

  const cityHits = CITY_PAGES.filter((c) => has(q, c.name));
  let areaHits = CITY_PAGES.flatMap((c) =>
    neighbourhoodsOf(c.id)
      .filter((n) => has(q, n.name))
      .map((n) => ({ city: c, n })),
  );
  // "Huruma", "Pipeline" and "Milimani" each exist in two cities. A city named
  // in the query settles it; otherwise both candidates are listed.
  if (cityHits.length && areaHits.length > 1) {
    const narrowed = areaHits.filter((a) => cityHits.some((c) => c.id === a.city.id));
    if (narrowed.length) areaHits = narrowed;
  }

  const targets = [];
  for (const slug of services) {
    if (areaHits.length) {
      for (const { city, n } of areaHits) {
        targets.push({
          key: `${slug}:${city.id}:${n.slug}`,
          label: `/services/${slug}/${city.id}/${n.slug}${areaHits.length > 1 ? "  (name exists in more than one city)" : ""}`,
          exists: Boolean(neighbourhoodNote(slug, city.id, n.slug)),
          blockedBy: localNote(slug, city.id) ? null : `${slug}:${city.id}`,
        });
      }
    } else {
      for (const city of cityHits) {
        targets.push({
          key: `${slug}:${city.id}`,
          label: `/services/${slug}/${city.id}`,
          exists: Boolean(localNote(slug, city.id)),
          blockedBy: null,
        });
      }
    }
  }
  if (targets.length) matched++;
  for (const t of targets) {
    const entry = demand.get(t.key) ?? { ...t, impressions: 0, queries: [] };
    entry.impressions += impressions;
    entry.queries.push(`${q} (${impressions})`);
    demand.set(t.key, entry);
  }
}

const ranked = [...demand.values()].sort((a, b) => b.impressions - a.impressions);
const missing = ranked.filter((d) => !d.exists);

console.log(`\n  Search Console: ${rows.length} queries, ${matched} matched a local service and place`);

console.log("\n  Missing pages with real impressions, highest first");
if (!missing.length) console.log("    none");
for (const d of missing.slice(0, 25)) {
  console.log(`    ${String(d.impressions).padStart(6)}  ${d.label}`);
  if (d.blockedBy) console.log(`            write the ${d.blockedBy} city note first`);
  console.log(`            ${d.queries.slice(0, 3).join(" · ")}`);
}

const live = ranked.filter((d) => d.exists);
if (live.length) {
  console.log("\n  Written pages with matching queries");
  for (const d of live.slice(0, 15)) {
    console.log(`    ${String(d.impressions).padStart(6)}  ${d.label}`);
  }
}
console.log("");
