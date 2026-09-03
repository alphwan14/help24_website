/**
 * The living marketplace.
 *
 * Three cards, and one of them changes every few seconds. That is the whole
 * module.
 *
 * WHY THREE AND NOT TWELVE. The old page put a scrolling column of a dozen
 * sample posts on screen and a second copy of it further down. Twelve cards is
 * a catalogue: the eye stops reading them and starts skimming shapes. Three
 * cards that keep changing is a marketplace — you read each one, and the fact
 * that a new one arrived while you were reading is the entire point being made.
 *
 * WHY IT DOES NOT SCROLL. A drifting column has to be paused to be read, which
 * means the interface is fighting the reader. Recycling one slot at a time
 * leaves the other two still, so there is always something to finish reading.
 *
 * WHAT IT IS NOT. Not a live feed. The cards carry no time, nothing counts up,
 * and the same twelve written posts cycle round. The Demo chip says so, and
 * `presentational` on each card means none of the buttons pretend to work.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/tokens";
import { POSTS } from "@/lib/demo/seed";
import { PostCard } from "@/components/ds/PostCard";
import { DemoChip } from "@/components/ds/DemoChip";
import { Glyph } from "@/components/ds/glyphs";
import { useReducedMotion } from "@/components/useReducedMotion";
import { useInView } from "./useSequence";

/** How many are on screen. Deliberately small — see the file header. */
const SLOTS = 3;
/** How long a card sits before its slot recycles. */
const CYCLE = 4200;
/**
 * How long the outgoing card takes to leave. Must match the CSS duration below.
 *
 * Kept short on purpose. The slot keeps its height while its card fades, so for
 * this many milliseconds there is a gap in the column — that gap IS the
 * recycling, and it reads as one card making way for another. Any longer and it
 * reads as a card that failed to load.
 */
const FADE = 260;

/**
 * The six categories named in the strip.
 *
 * Six, not thirty-two. The full list is a real thing the app has and a real
 * thing somebody might want to check, so it gets a page; it does not get the
 * homepage. A visitor needs to know the shape of what Help24 covers, and six
 * words plus a count does that better than a grid of icons.
 */
const HEADLINE_CATEGORIES = ["Plumbing", "Cleaning", "Electrical", "Moving", "Driving", "Repairs"];

export function Marketplace() {
  const region = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(region);
  const running = inView && !reduced;

  const [cards, setCards] = useState(() => POSTS.slice(0, SLOTS));
  /** Where in POSTS the next arrival comes from. */
  const [next, setNext] = useState(SLOTS);
  /** The slot currently on its way out, or null while all three are settled. */
  const [leaving, setLeaving] = useState<number | null>(null);

  // Beat one: after CYCLE, mark a slot as leaving. Slots recycle in turn, so
  // the same card is never replaced twice in a row.
  useEffect(() => {
    if (!running || leaving !== null) return;
    const t = window.setTimeout(() => setLeaving((next - SLOTS) % SLOTS), CYCLE);
    return () => window.clearTimeout(t);
  }, [running, next, leaving]);

  // Beat two: once it has faded, swap in the arrival. The new card mounts with
  // a fresh key, which is what plays its spring.
  useEffect(() => {
    if (leaving === null) return;
    const t = window.setTimeout(() => {
      setCards((current) =>
        current.map((c, i) => (i === leaving ? POSTS[next % POSTS.length] : c)),
      );
      setNext((n) => n + 1);
      setLeaving(null);
    }, FADE);
    return () => window.clearTimeout(t);
  }, [leaving, next]);

  return (
    <section id="marketplace" className="scroll-mt-20 border-t border-border py-section sm:scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
          {/* ── What it is ─────────────────────────────────────────────── */}
          <div className="min-w-0">
            <p className="mb-4 text-label-md font-semibold uppercase tracking-[0.14em] text-primary-bright">
              The marketplace
            </p>
            <h2 className="max-w-xl text-[clamp(1.6rem,4.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary">
              Everything people actually need doing.
            </h2>

            <p className="mt-6 text-body-lg font-medium leading-relaxed text-text-primary">
              {HEADLINE_CATEGORIES.join(" · ")}
              <span className="text-text-secondary"> + {CATEGORIES.length - 6} more</span>
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-button border border-border-strong bg-card px-5 py-3 text-body font-semibold text-text-primary transition-colors hover:bg-card-hover"
            >
              Explore services
              <Glyph name="arrowRight" size={15} />
            </Link>
          </div>

          {/* ── The stream ─────────────────────────────────────────────── */}
          <div ref={region} className="min-w-0 mx-auto w-full max-w-[30rem] lg:max-w-none">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-section-title font-semibold text-text-primary">On the board</p>
              <DemoChip />
            </div>

            {/*
              A fixed height for the whole stack.
              Cards vary in height by a line or two of title, and letting the
              container follow them would nudge everything below this section
              every four seconds. The stack is pinned; individual cards are
              free to be whatever height they are inside it.
            */}
            <ul className="space-y-2.5" aria-label="Sample Help24 posts">
              {cards.map((post, i) => (
                <li
                  key={`${i}-${post.id}`}
                  className={`transition-all duration-[260ms] ease-out ${
                    leaving === i
                      ? "-translate-y-1.5 scale-[0.98] opacity-0"
                      : "animate-slide-in opacity-100"
                  }`}
                >
                  <PostCard post={post} presentational />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
