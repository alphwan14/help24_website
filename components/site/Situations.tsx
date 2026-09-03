/**
 * Situations.
 *
 * Six sentences somebody would actually say out loud, and what Help24 does
 * with each one.
 *
 * WHY NOT A CATEGORY GRID. "Plumbing, Electrical, Carpentry, Masonry" is how a
 * database thinks. Nobody wakes up needing masonry; they wake up because the
 * sink is leaking. A list of services asks the visitor to translate their
 * problem into our taxonomy before we will help them. A list of problems does
 * the translating for them — and the answer panel is where the category name
 * finally appears, which is the right order.
 *
 * The goal for this section is one thought: "oh, I could use this."
 *
 * The lines cycle on their own until somebody picks one, then they stop for
 * good. An interface that keeps moving after you have taken hold of it is
 * fighting you.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { kes } from "@/lib/tokens";
import { POSTS } from "@/lib/demo/seed";
import { SITUATIONS } from "@/lib/demo/scenarios";
import { Avatar } from "@/components/ds/Avatar";
import { CategoryChip } from "@/components/ds/CategoryChip";
import { DemoChip } from "@/components/ds/DemoChip";
import { Glyph } from "@/components/ds/glyphs";
import { useReducedMotion } from "@/components/useReducedMotion";
import { useInView } from "./useSequence";

const DWELL = 3400;

export function Situations() {
  const region = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(region);

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held || reduced || !inView) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % SITUATIONS.length), DWELL);
    return () => window.clearTimeout(t);
  }, [active, held, reduced, inView]);

  const situation = SITUATIONS[active];
  const post = POSTS.find((p) => p.id === situation.postId)!;
  const offers = post.applicants ?? [];
  const from = offers.length ? Math.min(...offers.map((o) => o.price)) : 0;

  return (
    <section
      id="situations"
      ref={region}
      className="scroll-mt-20 border-t border-border bg-surface py-section sm:scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-label-md font-semibold uppercase tracking-[0.14em] text-primary-bright">
          Situations
        </p>
        <h2 className="max-w-2xl text-[clamp(1.6rem,4.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary">
          Sound like your week?
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-16">
          {/* ── The lines ──────────────────────────────────────────────── */}
          {/*
            A radio group, not a tab list. Each line selects which situation the
            panel answers; none of them navigates and none reveals a panel of
            its own. `aria-checked` is the honest description of that.
          */}
          <ul role="radiogroup" aria-label="Pick a situation" className="min-w-0 space-y-1">
            {SITUATIONS.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.line}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      setActive(i);
                      setHeld(true);
                    }}
                    className="group flex w-full items-center gap-3 py-1.5 text-left"
                  >
                    {/* The marker grows into the accent rather than appearing —
                        one moving property, and it reads as the line being
                        picked up rather than as a bullet switching on. */}
                    <span
                      aria-hidden
                      className={`h-[3px] shrink-0 rounded-full transition-all duration-300 ease-spring ${
                        on ? "w-8 bg-primary" : "w-3 bg-border-strong group-hover:w-5"
                      }`}
                    />
                    <span
                      className={`text-[clamp(1.15rem,3.4vw,1.75rem)] font-semibold leading-tight tracking-[-0.02em] transition-colors duration-300 ${
                        on
                          ? "text-text-primary"
                          : "text-text-secondary group-hover:text-text-primary"
                      }`}
                    >
                      {s.line}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ── The answer ─────────────────────────────────────────────── */}
          <div className="min-w-0 mx-auto w-full max-w-[30rem] lg:max-w-none">
            <div className="rounded-card border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-section-title font-semibold text-text-primary">
                  {situation.lead}
                </p>
                <DemoChip />
              </div>

              <div className="mt-2.5">
                <CategoryChip name={post.category} />
              </div>

              {/*
                A floor, not a fixed height. Situations have one, two or three
                offers behind them and pinning the panel to the tallest would
                leave a hole under the shortest — but letting it collapse would
                bounce the section every three seconds. The floor is the height
                of the two-offer case, which is most of them.
              */}
              <ul
                aria-live="polite"
                className="mt-3 min-h-[8.5rem] space-y-2 border-t border-border pt-3"
              >
                {offers.slice(0, 3).map((o) => (
                  <li
                    key={`${situation.line}-${o.id}`}
                    className="flex animate-slide-in items-center gap-2.5"
                  >
                    <Avatar name={o.name} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-card-title font-semibold text-text-primary">
                        {o.name}
                      </span>
                      <span className="flex items-center gap-1.5 truncate text-label-md text-text-secondary">
                        {o.rating === null ? (
                          "New"
                        ) : (
                          <span className="inline-flex items-center gap-0.5">
                            <Glyph name="star" size={10} className="text-warning" />
                            {o.rating.toFixed(1)}
                          </span>
                        )}
                        <span aria-hidden>·</span>
                        {o.profession}
                      </span>
                    </span>
                    <span className="shrink-0 text-card-title font-bold text-money">
                      {kes(o.price)}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 border-t border-border pt-3 text-body-sm text-text-secondary">
                {offers.length} {offers.length === 1 ? "offer" : "offers"}
                {from > 0 ? ` · from ${kes(from)}` : ""} · you pick one
              </p>
            </div>

            <Link
              href="/download"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-button bg-primary px-6 py-3.5 text-body font-semibold text-white transition-transform duration-200 ease-spring hover:-translate-y-0.5"
            >
              Post something like this
              <Glyph name="arrowRight" size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
