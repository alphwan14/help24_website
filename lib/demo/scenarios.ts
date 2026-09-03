/**
 * The hero sequence's script.
 *
 * The homepage's job is to make someone understand Help24 without reading a
 * paragraph, and the way it does that is by playing the product: a request is
 * typed, it drops into the marketplace, offers arrive, one is chosen, the money
 * is secured, the job finishes. This file is the content that sequence plays.
 *
 * IT IS DERIVED, NOT INVENTED. Every scenario is built from a post that already
 * exists in seed.ts, and the providers, their quotes and their prices are that
 * post's real applicants. So the plumber who offers KES 1,100 in the hero is
 * the same plumber who offers KES 1,100 anywhere else on the site — there is
 * one cast, not one per section.
 *
 * THE SAME THREE RULES AS seed.ts APPLY, and one more:
 *
 *   1. No timestamps. `available` says "Today", never "4 minutes ago".
 *   2. No counters that move on their own.
 *   3. Every surface that renders this carries a <DemoChip/>.
 *   4. DISTANCE IS THE ONLY FIELD INVENTED HERE. A provider's distance is not
 *      in seed.ts because a feed card does not show one, and the hero does —
 *      it is the whole point of "nearby". It is written as a rounded figure
 *      against the request's own area, and it is sample data like everything
 *      else around it.
 */

import { POSTS, matchPosts } from "./seed";
import type { FeedPost } from "@/components/ds/PostCard";
import type { UrgencyKey } from "@/lib/tokens";

export interface DemoOffer {
  id: string;
  name: string;
  profession: string;
  /** null renders as "New" — the app never invents a star rating. */
  rating: number | null;
  reviews: number;
  /** "2.1 km" — see rule 4 in the file header. */
  distance: string;
  /** Availability, in the app's own vocabulary: a day, never a clock time. */
  available: string;
  price: number;
}

export interface Scenario {
  id: string;
  /** The sentence that types itself into the field. */
  typed: string;
  /** The card the sentence becomes. Derived from a real seed post. */
  title: string;
  category: string;
  area: string;
  city: string;
  urgency: UrgencyKey;
  /** 0 means "Open to offers" — the app's own wording for an unpriced request. */
  budget: number;
  /** What the status strip says while providers are being found. */
  searching: string;
  offers: DemoOffer[];
  /**
   * Which offer the customer picks.
   *
   * INVARIANT: it is always `offers[0]`. The sequence morphs the chosen offer
   * into the active job by leaving it exactly where its row was, so the pick
   * has to be the row at the top or the transition becomes a jump. Every
   * scenario below satisfies this, and `resolveTyped` preserves it.
   */
  chosenId: string;
  /**
   * False when the visitor typed something the sample data cannot answer.
   *
   * The module then says so and stops, rather than handing them a plumber for
   * a broken laptop. Sample data has an edge and pretending otherwise is
   * exactly the kind of small lie this project keeps refusing to tell.
   */
  matched: boolean;
}

function post(id: string): FeedPost {
  const hit = POSTS.find((p) => p.id === id);
  if (!hit) throw new Error(`scenario references unknown seed post: ${id}`);
  return hit;
}

/**
 * Distance and availability, per applicant id.
 *
 * Kept in one small table rather than sprinkled through the scenarios so the
 * two invented fields are visible in one place and easy to audit.
 */
const NEARBY: Record<string, { distance: string; available: string }> = {
  p1a1: { distance: "1.8 km", available: "Today" },
  p1a2: { distance: "3.4 km", available: "Today" },
  p1a3: { distance: "5.1 km", available: "Tomorrow" },
  p2a1: { distance: "4.2 km", available: "Weekdays" },
  p2a2: { distance: "7.6 km", available: "Weekdays" },
  p3a1: { distance: "2.3 km", available: "Saturday" },
  p3a2: { distance: "4.8 km", available: "Friday" },
};

function offersFor(id: string): DemoOffer[] {
  return (post(id).applicants ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    profession: a.profession,
    rating: a.rating,
    reviews: a.reviews,
    distance: NEARBY[a.id]?.distance ?? "Nearby",
    available: NEARBY[a.id]?.available ?? "This week",
    price: a.price,
  }));
}

/**
 * The three scenarios, played in turn.
 *
 * Three rather than one because a single looping example teaches a visitor
 * that Help24 fixes sinks. Three teaches them it is a marketplace — a repair,
 * a recurring arrangement and a household job — without a category grid and
 * without a sentence explaining the range.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: "sink",
    typed: "I need someone to fix my leaking sink.",
    title: post("p1").title,
    category: post("p1").category,
    area: post("p1").area,
    city: post("p1").city,
    urgency: post("p1").urgency,
    budget: post("p1").price,
    searching: "Finding plumbers near Bamburi",
    offers: offersFor("p1"),
    /* The cheapest is not automatically the pick, and it matters that the demo
       shows that: choosing is a judgement about rating, distance and price
       together, which is the argument for offers over a fixed price list. */
    chosenId: "p1a1",
    matched: true,
  },
  {
    id: "driver",
    typed: "I need a driver for the school run, weekdays.",
    title: post("p2").title,
    category: post("p2").category,
    area: post("p2").area,
    city: post("p2").city,
    urgency: post("p2").urgency,
    budget: post("p2").price,
    searching: "Finding drivers near Karen",
    offers: offersFor("p2"),
    chosenId: "p2a1",
    matched: true,
  },
  {
    id: "clean",
    typed: "I need the flat deep-cleaned before I hand it over.",
    title: post("p3").title,
    category: post("p3").category,
    area: post("p3").area,
    city: post("p3").city,
    urgency: post("p3").urgency,
    budget: post("p3").price,
    searching: "Finding cleaners near Milimani",
    offers: offersFor("p3"),
    chosenId: "p3a1",
    matched: true,
  },
];

/** The chosen offer for a scenario, resolved once so no view has to search. */
export function chosenOffer(s: Scenario): DemoOffer {
  return s.offers.find((o) => o.id === s.chosenId) ?? s.offers[0];
}

/* ────────────────────────────────────────────────────────────────────────────
 * THE VISITOR'S OWN JOB
 * ──────────────────────────────────────────────────────────────────────────── */

/** The requests the sandbox can actually answer: real posts with real offers. */
const ANSWERABLE = POSTS.filter((p) => p.type === "request" && (p.applicants?.length ?? 0) > 0);

/**
 * The title, from what somebody typed.
 *
 * First sentence if there is one and it is long enough to stand alone,
 * otherwise the whole thing — the same split the app's post flow makes.
 */
function titleFrom(text: string): string {
  const trimmed = text.trim();
  const stop = trimmed.search(/[.!?](\s|$)/);
  return (stop > 8 ? trimmed.slice(0, stop) : trimmed).slice(0, 90);
}

/**
 * Turn a typed sentence into a playable scenario.
 *
 * `matchPosts` already knows how to read "leak" as plumbing — it is the same
 * matcher the marketplace search uses, including the per-post keyword lists —
 * so this scores its hits by how many of the visitor's words each one answers
 * and takes the leader. Reusing it is the point: one definition of what counts
 * as a match, not a second one that drifts.
 *
 * WHEN NOTHING MATCHES it returns an unmatched scenario rather than the nearest
 * thing. The sandbox holds twelve posts; a visitor who types something outside
 * them should be told that, not handed a plumber. The module renders that case
 * as an honest dead end with a link to the app, which is a better answer than a
 * confident wrong one.
 */
export function resolveTyped(text: string): Scenario {
  const terms = text.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  const best = matchPosts(text, ANSWERABLE)
    .map((p) => {
      const hay = [p.title, p.description, p.category, p.area, p.city, ...(p.keywords ?? [])]
        .join(" ")
        .toLowerCase();
      return { post: p, score: terms.filter((t) => hay.includes(t)).length };
    })
    .sort((a, b) => b.score - a.score)[0];

  const title = titleFrom(text);

  if (!best) {
    return {
      id: `custom-none-${title.length}`,
      typed: text,
      title,
      category: "Other",
      area: "Your area",
      city: "",
      urgency: "soon",
      budget: 0,
      searching: "Looking for providers near you",
      offers: [],
      chosenId: "",
      matched: false,
    };
  }

  const p = best.post;
  const offers = offersFor(p.id);
  return {
    id: `custom-${p.id}`,
    typed: text,
    title,
    category: p.category,
    area: p.area,
    city: p.city,
    urgency: p.urgency,
    /* Their job, not the seed post's — so no budget is claimed on their
       behalf. `0` renders as the app's "Open to offers". */
    budget: 0,
    searching: `Finding ${p.category.toLowerCase()} providers near ${p.area}`,
    offers,
    // Preserves the offers[0] invariant documented on `chosenId`.
    chosenId: offers[0]?.id ?? "",
    matched: true,
  };
}

/**
 * The situation lines further down the page.
 *
 * Each one is the first thing somebody would actually type, and each maps to a
 * seed post so selecting it can show that post's real offers. No situation is
 * listed that the sample data cannot answer — a page that invites you to pick
 * "Laptop stopped working" and then has nothing behind it is worse than one
 * that offers five things and means all five.
 */
export const SITUATIONS: { line: string; postId: string; lead: string }[] = [
  { line: "Sink is leaking.", postId: "p1", lead: "Plumbers near you" },
  { line: "Need a driver.", postId: "p2", lead: "Drivers near you" },
  { line: "Moving this weekend.", postId: "p12", lead: "Movers near you" },
  { line: "House needs a deep clean.", postId: "p3", lead: "Cleaners near you" },
  { line: "Fridge stopped cooling.", postId: "p4", lead: "Technicians near you" },
  { line: "Car won't start.", postId: "p7", lead: "Mechanics near you" },
];
