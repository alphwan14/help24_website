/**
 * Sample marketplace data for the website.
 *
 * NONE OF THIS IS REAL. Help24 has no provider supply yet, and this file is
 * what lets a visitor play with the product before there is any. Three rules
 * govern everything in here, and they are the reason the site can show a
 * working marketplace without lying about having one:
 *
 *   1. No timestamps, anywhere. Not absolute, not relative, not "just now".
 *      A post with a time on it claims someone wrote it at that time.
 *   2. No counters that move on their own — no "142 providers online", no
 *      matches ticking up. Numbers here describe the sample, nothing else.
 *   3. Every surface that renders this module also renders a <DemoChip/>.
 *
 * Names are ordinary Kenyan names and the prices are plausible 2026 market
 * rates, because a sandbox that reads as obviously fake teaches a visitor
 * nothing. The `Demo` chip is what does the disclosing, not bad data.
 */

import type { FeedPost } from "@/components/ds/PostCard";

/** The three cities the app's location registry surfaces in the demo. */
export const CITIES = ["Mombasa", "Nairobi", "Kisumu"] as const;
export type City = (typeof CITIES)[number];

export const POSTS: FeedPost[] = [
  {
    id: "p1",
    type: "request",
    title: "Leaking kitchen sink, water pooling under the cabinet",
    description:
      "The pipe under the sink has been dripping for two days. Cabinet floor is already soft. Need someone who can bring their own fittings.",
    category: "Plumbing",
    area: "Bamburi",
    city: "Mombasa",
    price: 1200,
    urgency: "urgent",
    authorName: "Amina Yusuf",
    tags: ["Today"],
    keywords: ["leak", "leaking", "sink", "pipe", "water", "tap", "drip"],
    applicants: [
      {
        id: "p1a1",
        name: "Joseph Mwangi",
        profession: "Plumber",
        rating: 4.8,
        reviews: 34,
        quote: "I can be there within the hour. Price includes the replacement trap.",
        price: 1100,
      },
      {
        id: "p1a2",
        name: "Salim Bakari",
        profession: "Plumber",
        rating: 4.6,
        reviews: 12,
        quote: "Have the fittings in stock. Will check the cabinet for rot too.",
        price: 1350,
      },
      {
        id: "p1a3",
        name: "Peter Otieno",
        profession: "Handyman",
        rating: null,
        reviews: 0,
        quote: "Available this afternoon, can do the same-day fix.",
        price: 900,
      },
    ],
  },
  {
    id: "p2",
    type: "request",
    title: "Driver needed, weekdays, school run and errands",
    description:
      "Morning and evening school run plus occasional errands. Must have a clean licence and know the Karen–Langata roads well.",
    category: "Driver",
    area: "Karen",
    city: "Nairobi",
    price: 32000,
    pricing: "month",
    urgency: "flexible",
    authorName: "Grace Wanjiru",
    tags: ["Weekdays"],
    keywords: ["driver", "school", "run", "chauffeur", "car", "errands", "weekdays"],
    applicants: [
      {
        id: "p2a1",
        name: "Daniel Kiptoo",
        profession: "Driver",
        rating: 4.9,
        reviews: 21,
        quote: "Eight years driving in Nairobi, clean record, references available.",
        price: 30000,
      },
      {
        id: "p2a2",
        name: "Moses Njoroge",
        profession: "Driver",
        rating: 4.4,
        reviews: 7,
        quote: "I live in Ngong so the morning run is easy for me.",
        price: 33000,
      },
    ],
  },
  {
    id: "p3",
    type: "request",
    title: "Deep clean, 2-bedroom apartment before handover",
    description:
      "Moving out on Saturday and the landlord wants it spotless. Kitchen, two bathrooms, windows inside and out.",
    category: "House Cleaning",
    area: "Milimani",
    city: "Kisumu",
    price: 3500,
    urgency: "soon",
    authorName: "Brian Ochieng",
    tags: ["2 bedrooms"],
    keywords: ["clean", "cleaning", "deep clean", "apartment", "move out", "house"],
    applicants: [
      {
        id: "p3a1",
        name: "Mary Akinyi",
        profession: "Cleaner",
        rating: 4.7,
        reviews: 18,
        quote: "Team of two, we bring our own supplies. Four hours for a 2-bed.",
        price: 3200,
      },
      {
        id: "p3a2",
        name: "Faith Adhiambo",
        profession: "Cleaner",
        rating: null,
        reviews: 0,
        quote: "Can do Friday or Saturday morning, whichever suits you.",
        price: 2800,
      },
    ],
  },
  {
    id: "p4",
    type: "request",
    title: "Fridge stopped cooling, compressor sounds wrong",
    description:
      "Two-door fridge, about four years old. Freezer still works but the lower section is warm.",
    category: "Appliance Repair",
    area: "Nyali",
    city: "Mombasa",
    price: 2500,
    urgency: "soon",
    authorName: "Hassan Omar",
    keywords: ["fridge", "refrigerator", "cooling", "compressor", "appliance", "repair"],
    applicants: [
      {
        id: "p4a1",
        name: "Kevin Mutua",
        profession: "Appliance Technician",
        rating: 4.5,
        reviews: 9,
        quote: "Sounds like the relay. I'll diagnose on site, no callout fee.",
        price: 2200,
      },
    ],
  },
  {
    id: "p5",
    type: "request",
    title: "Rewire two sockets and fit an outdoor security light",
    description:
      "Sockets in the sitting room trip the breaker. Also want a motion-sensor light above the gate.",
    category: "Electrical",
    area: "Westlands",
    city: "Nairobi",
    price: 4500,
    urgency: "flexible",
    authorName: "Sarah Njeri",
    tags: ["Materials included"],
    keywords: ["electric", "electrical", "socket", "wiring", "rewire", "light", "power", "breaker"],
    applicants: [
      {
        id: "p5a1",
        name: "Anthony Kariuki",
        profession: "Electrician",
        rating: 4.9,
        reviews: 41,
        quote: "Licensed, and I'll test the whole ring while I'm there.",
        price: 4800,
      },
      {
        id: "p5a2",
        name: "Victor Barasa",
        profession: "Electrician",
        rating: 4.2,
        reviews: 5,
        quote: "Can supply the sensor light at cost. Two hours of work.",
        price: 4000,
      },
    ],
  },
  {
    id: "p6",
    type: "request",
    title: "Maths tutor for Form 3, twice a week",
    description:
      "Struggling with calculus ahead of mocks. Prefer someone who can come to the house on Tuesday and Thursday evenings.",
    category: "Tutoring",
    area: "Mamboleo",
    city: "Kisumu",
    price: 900,
    pricing: "hour",
    urgency: "flexible",
    authorName: "Elizabeth Atieno",
    tags: ["Twice a week"],
    keywords: ["tutor", "tutoring", "maths", "math", "teacher", "lessons", "school"],
    applicants: [
      {
        id: "p6a1",
        name: "Collins Owino",
        profession: "Tutor",
        rating: 4.8,
        reviews: 15,
        quote: "I teach Form 3 and 4 maths. Free first session so she can see the fit.",
        price: 1000,
      },
    ],
  },
  {
    id: "p7",
    type: "request",
    title: "Car won't start, clicking noise from the engine bay",
    description:
      "Toyota Fielder, 2012. Battery was replaced last month so I doubt that's it. Car is parked at home.",
    category: "Mechanic",
    area: "South B",
    city: "Nairobi",
    price: 0,
    urgency: "urgent",
    authorName: "Dennis Kimani",
    keywords: ["car", "mechanic", "engine", "start", "starter", "battery", "vehicle", "repair"],
    applicants: [
      {
        id: "p7a1",
        name: "Erick Wafula",
        profession: "Mechanic",
        rating: 4.6,
        reviews: 27,
        quote: "Clicking usually means the starter motor. I do mobile callouts.",
        price: 3500,
      },
      {
        id: "p7a2",
        name: "Stephen Muli",
        profession: "Mechanic",
        rating: 4.3,
        reviews: 11,
        quote: "I can come this evening with a tester and quote after checking.",
        price: 2800,
      },
    ],
  },
  {
    id: "p8",
    type: "offer",
    title: "Phone and tablet screen replacement, same day",
    description:
      "Screens, batteries and charging ports for most Android and iPhone models. Walk-in or I collect within Mombasa town.",
    category: "Phone Repair",
    area: "Tudor",
    city: "Mombasa",
    price: 1500,
    urgency: "flexible",
    authorName: "Ali Mwinyi",
    timeSignal: "Same day",
    mpesa: true,
    keywords: ["phone", "screen", "repair", "tablet", "battery", "iphone", "android"],
  },
  {
    id: "p9",
    type: "offer",
    title: "Carpentry — fitted wardrobes, kitchen units, repairs",
    description:
      "Fifteen years making and fitting units. Free measure-up and drawing before you commit to anything.",
    category: "Carpentry",
    area: "Kilimani",
    city: "Nairobi",
    price: 12000,
    urgency: "flexible",
    authorName: "Francis Mbugua",
    timeSignal: "Weekdays",
    mpesa: true,
    keywords: ["carpenter", "carpentry", "wardrobe", "furniture", "wood", "kitchen", "units"],
  },
  {
    id: "p10",
    type: "offer",
    title: "Event photography — weddings, graduations, corporate",
    description:
      "Full-day coverage with edited gallery inside a week. Travel across Nyanza included in the price.",
    category: "Photography",
    area: "Nyalenda",
    city: "Kisumu",
    price: 18000,
    urgency: "flexible",
    authorName: "Cynthia Anyango",
    timeSignal: "Weekends",
    mpesa: true,
    keywords: ["photo", "photography", "photographer", "wedding", "event", "camera", "shoot"],
  },
  {
    id: "p11",
    type: "offer",
    title: "AC servicing and gas top-up for homes and offices",
    description:
      "Split and window units. Service, regas, and installation. Covering Mombasa island and the north coast.",
    category: "AC Repair",
    area: "Shanzu",
    city: "Mombasa",
    price: 3000,
    urgency: "flexible",
    authorName: "Rashid Juma",
    timeSignal: "Within 24 hrs",
    mpesa: true,
    keywords: ["ac", "air", "conditioning", "aircon", "cooling", "gas", "service"],
  },
  {
    id: "p12",
    type: "request",
    title: "Move a one-bedroom flat across town on Sunday",
    description:
      "Bed, sofa, fridge and about eight boxes. Third floor, no lift, but the new place is ground floor.",
    category: "Moving Services",
    area: "Likoni",
    city: "Mombasa",
    price: 6000,
    urgency: "soon",
    authorName: "Nancy Wambui",
    tags: ["Sunday"],
    keywords: ["move", "moving", "movers", "relocate", "shift", "transport", "boxes"],
    applicants: [
      {
        id: "p12a1",
        name: "Baraka Movers",
        profession: "Moving Services",
        rating: 4.4,
        reviews: 16,
        quote: "Three-tonne lorry and two loaders. Sunday morning works for us.",
        price: 5500,
      },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * BUDGET GUIDANCE
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Guide ranges for the composer's budget step, keyed `Category|City`.
 *
 * These are ESTIMATES — a starting point for someone who has never priced this
 * work — not a summary of transactions on Help24, because there have not been
 * any. Everything that renders them says "Estimate" and carries a Demo chip,
 * and `benchmarkSentence` is deliberately worded so it cannot be read as an
 * observed average.
 *
 * When real completed jobs exist, this table is what gets replaced by a query.
 */
type Range = { low: number; high: number; unit?: "hour" | "month" };

const BENCHMARKS: Record<string, Range> = {
  "Plumbing|Mombasa": { low: 800, high: 1500 },
  "Plumbing|Nairobi": { low: 1000, high: 2000 },
  "Plumbing|Kisumu": { low: 700, high: 1400 },
  "Electrical|Mombasa": { low: 1500, high: 3500 },
  "Electrical|Nairobi": { low: 2000, high: 5000 },
  "Electrical|Kisumu": { low: 1200, high: 3000 },
  "House Cleaning|Mombasa": { low: 1500, high: 3000 },
  "House Cleaning|Nairobi": { low: 2000, high: 4000 },
  "House Cleaning|Kisumu": { low: 1200, high: 2800 },
  "Appliance Repair|Mombasa": { low: 1500, high: 3500 },
  "Appliance Repair|Nairobi": { low: 2000, high: 4500 },
  "Appliance Repair|Kisumu": { low: 1200, high: 3000 },
  "AC Repair|Mombasa": { low: 2500, high: 5000 },
  "AC Repair|Nairobi": { low: 3000, high: 6000 },
  "AC Repair|Kisumu": { low: 2000, high: 4500 },
  "Mechanic|Mombasa": { low: 2000, high: 5000 },
  "Mechanic|Nairobi": { low: 2500, high: 6000 },
  "Mechanic|Kisumu": { low: 1800, high: 4500 },
  "Carpentry|Mombasa": { low: 4000, high: 12000 },
  "Carpentry|Nairobi": { low: 6000, high: 18000 },
  "Carpentry|Kisumu": { low: 3500, high: 10000 },
  "Painting|Mombasa": { low: 5000, high: 15000 },
  "Painting|Nairobi": { low: 7000, high: 20000 },
  "Painting|Kisumu": { low: 4000, high: 12000 },
  "Moving Services|Mombasa": { low: 4000, high: 9000 },
  "Moving Services|Nairobi": { low: 5000, high: 12000 },
  "Moving Services|Kisumu": { low: 3500, high: 8000 },
  "Tutoring|Mombasa": { low: 600, high: 1200, unit: "hour" },
  "Tutoring|Nairobi": { low: 800, high: 1800, unit: "hour" },
  "Tutoring|Kisumu": { low: 500, high: 1100, unit: "hour" },
  "Driver|Mombasa": { low: 22000, high: 35000, unit: "month" },
  "Driver|Nairobi": { low: 28000, high: 45000, unit: "month" },
  "Driver|Kisumu": { low: 20000, high: 32000, unit: "month" },
  "Photography|Mombasa": { low: 12000, high: 30000 },
  "Photography|Nairobi": { low: 15000, high: 40000 },
  "Photography|Kisumu": { low: 10000, high: 25000 },
  "Gardening|Mombasa": { low: 800, high: 2000 },
  "Gardening|Nairobi": { low: 1000, high: 2500 },
  "Gardening|Kisumu": { low: 700, high: 1800 },
  "Phone Repair|Mombasa": { low: 1000, high: 4000 },
  "Phone Repair|Nairobi": { low: 1200, high: 5000 },
  "Phone Repair|Kisumu": { low: 900, high: 3500 },
};

/** Used when a category has no city-specific entry — a wide, honest bracket. */
const FALLBACK: Range = { low: 1000, high: 5000 };

export function benchmarkFor(category: string, city: string): Range {
  return BENCHMARKS[`${category}|${city}`] ?? FALLBACK;
}

/** True when we hold a real guide for this pair rather than the wide fallback. */
export function hasBenchmark(category: string, city: string): boolean {
  return `${category}|${city}` in BENCHMARKS;
}

/**
 * The line under the budget slider.
 *
 * Worded as a planning estimate, never as an observation: "usually budgeted
 * around", not "settle between". The difference matters — one is advice, the
 * other is a claim about transactions that have not happened.
 */
export function benchmarkSentence(category: string, city: string): string {
  const { low, high, unit } = benchmarkFor(category, city);
  const suffix = unit === "hour" ? " per hour" : unit === "month" ? " per month" : "";
  const scope = hasBenchmark(category, city)
    ? `${category.toLowerCase()} jobs in ${city}`
    : `jobs like this in ${city}`;
  const fmt = (n: number) => n.toLocaleString("en-KE");
  return `Estimate — ${scope} are usually budgeted around KES ${fmt(low)} to ${fmt(high)}${suffix}.`;
}

/** Slider bounds for a category/city: a little either side of the guide range. */
export function budgetRange(category: string, city: string) {
  const { low, high, unit } = benchmarkFor(category, city);
  const step = unit === "month" ? 1000 : high > 10000 ? 500 : 100;
  return {
    min: Math.max(step, Math.round((low * 0.4) / step) * step),
    max: Math.round((high * 1.8) / step) * step,
    step,
    start: Math.round(((low + high) / 2 / step)) * step,
    unit,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * COVERAGE
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * The pins on the Coverage map.
 *
 * Real longitude and latitude — `projectKE` in lib/kenya.ts turns them into
 * viewBox coordinates against the actual national boundary. Nothing here is
 * positioned by eye against the artwork, so adding a city is adding its
 * coordinates and nothing else.
 *
 * The category list per city is derived from THIS FILE, not from a supply
 * database — it says what the sandbox contains, which is a fact, rather than
 * what is available in that city, which is not yet.
 */
export const CITY_PINS: {
  city: City;
  lon: number;
  lat: number;
  blurb: string;
  /** Which side of the pin the label sits on, so it never runs off the map. */
  side: "left" | "right";
}[] = [
  {
    city: "Kisumu",
    lon: 34.768,
    lat: -0.0917,
    blurb: "Lakeside — Milimani, Mamboleo, Nyalenda",
    side: "right",
  },
  {
    city: "Nairobi",
    lon: 36.8219,
    lat: -1.2921,
    blurb: "Karen, Westlands, Kilimani, South B",
    side: "right",
  },
  {
    city: "Mombasa",
    lon: 39.6682,
    lat: -4.0435,
    blurb: "Bamburi, Nyali, Tudor, Likoni, Shanzu",
    side: "left",
  },
];

export function categoriesInCity(city: string): string[] {
  return Array.from(new Set(POSTS.filter((p) => p.city === city).map((p) => p.category))).sort();
}

/* ────────────────────────────────────────────────────────────────────────────
 * SEARCH
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * The hero's left-hand field filters the board on the right.
 *
 * Matches title, description, category, location and the per-post `keywords`
 * list, so "leak" finds the plumbing post whose title says "leaking" and whose
 * category says "Plumbing".
 */
export function matchPosts(query: string, posts: FeedPost[] = POSTS): FeedPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;
  const terms = q.split(/\s+/).filter(Boolean);

  return posts.filter((p) => {
    const haystack = [
      p.title,
      p.description,
      p.category,
      p.area,
      p.city,
      ...(p.tags ?? []),
      ...(p.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return terms.some((t) => haystack.includes(t));
  });
}

/** The category to light up for a query, or null when nothing dominates. */
export function matchedCategory(query: string, posts: FeedPost[] = POSTS): string | null {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return null;
  const hits = matchPosts(q, posts);
  if (hits.length === 0) return null;
  const counts = new Map<string, number>();
  for (const p of hits) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  const ranked = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  // Only claim a match when one category actually leads.
  if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) return null;
  return ranked[0][0];
}

/** The rotating examples in the hero placeholder. */
export const SEARCH_EXAMPLES = [
  "Fix a leaking sink in Bamburi",
  "Driver, weekdays, Karen",
  "Deep clean, 2-bedroom",
] as const;
