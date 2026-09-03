/**
 * Situations.
 *
 * Six sentences somebody would actually say out loud, and what Help24 does with
 * each one — played, not listed.
 *
 * WHY NOT A CATEGORY GRID. "Plumbing, Electrical, Carpentry, Masonry" is how a
 * database thinks. Nobody wakes up needing masonry; they wake up because the
 * sink is leaking. A list of services asks the visitor to translate their
 * problem into our taxonomy before we will help them. A list of problems does
 * the translating for them, and the category name appears in the answer, which
 * is the right order.
 *
 * EACH LINE RUNS A MINIATURE OF THE HERO. Selecting one plays three beats — the
 * situation, then looking nearby, then who answered — using the same offer rows,
 * the same locate pulse and the same vocabulary as the stage at the top of the
 * page. That shared language is doing real work: it says these are the same
 * marketplace seen twice, not two sections that both happen to mention
 * providers.
 *
 * IT ALSO ANSWERS "WHAT ELSE?". The breadth line and the link to the full
 * catalogue live here now. They used to be a separate section with its own
 * heading and its own drifting board of sample posts, which was a third telling
 * of the same marketplace loop. Six situations demonstrate range better than a
 * scrolling column of cards ever did.
 *
 * The lines advance on their own until somebody picks one, then they stop for
 * good. An interface that keeps moving after you have taken hold of it is
 * fighting you.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES, kes } from "@/lib/tokens";
import { POSTS } from "@/lib/demo/seed";
import { SITUATIONS } from "@/lib/demo/scenarios";
import { Avatar } from "@/components/ds/Avatar";
import { DemoChip } from "@/components/ds/DemoChip";
import { Glyph } from "@/components/ds/glyphs";
import { useReducedMotion } from "@/components/useReducedMotion";
import { useInView } from "./useSequence";

/** The three beats of the miniature, in milliseconds. */
const TO_SEARCHING = 900;
const TO_ANSWERED = 1600;
/** How long the answer stays up before the next situation takes over. */
const DWELL = 2800;

/** The six named on the homepage. The other twenty-six live on /services. */
const HEADLINE_CATEGORIES = ["Plumbing", "Cleaning", "Electrical", "Moving", "Driving", "Repairs"];

export function Situations() {
  const region = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(region);

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  /** 0 = the situation, 1 = looking nearby, 2 = who answered. */
  const [phase, setPhase] = useState(2);

  const playing = inView && !reduced;

  // Beats one and two. Restarting whenever `active` changes is what makes
  // selecting a line replay the miniature rather than swap its contents.
  // When nothing is playing the answer is what shows, so a reduced-motion
  // visitor and a visitor scrolled past both get the useful frame.
  useEffect(() => {
    if (!playing) {
      setPhase(2);
      return;
    }
    setPhase(0);
    const a = window.setTimeout(() => setPhase(1), TO_SEARCHING);
    const b = window.setTimeout(() => setPhase(2), TO_SEARCHING + TO_ANSWERED);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [active, playing]);

  // Beat three: hand over to the next situation, unless somebody is holding it.
  useEffect(() => {
    if (!playing || held || phase < 2) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % SITUATIONS.length), DWELL);
    return () => window.clearTimeout(t);
  }, [playing, held, phase, active]);

  const situation = SITUATIONS[active];
  const post = POSTS.find((p) => p.id === situation.postId)!;
  const offers = post.applicants ?? [];
  const from = offers.length ? Math.min(...offers.map((o) => o.price)) : 0;

  return (
    <section id="situations" ref={region} className="py-section">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <h2 className="max-w-2xl text-[clamp(1.9rem,5.2vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-text-primary">
          Sound like your week?
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          {/* ── The lines ──────────────────────────────────────────────── */}
          {/*
            A radio group, not a tab list. Each line selects which situation the
            miniature answers; none navigates and none reveals a panel of its
            own. `aria-checked` is the honest description of that.
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
                    className="group flex w-full items-center gap-4 py-2 text-left"
                  >
                    {/* The marker grows into the accent rather than appearing —
                        one moving property, and it reads as the line being
                        picked up rather than as a bullet switching on. */}
                    <span
                      aria-hidden
                      className={`h-[3px] shrink-0 rounded-full transition-all duration-300 ease-spring ${
                        on ? "w-10 bg-primary" : "w-4 bg-border-strong group-hover:w-7"
                      }`}
                    />
                    <span
                      className={`text-[clamp(1.25rem,3.6vw,2rem)] font-semibold leading-tight tracking-[-0.025em] transition-colors duration-300 ${
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

          {/* ── The miniature ──────────────────────────────────────────── */}
          {/*
            Fixed height, because it changes three times per situation and the
            page below must not move while it does. No card around it — the
            offers are the only real product objects here and they carry their
            own borders, exactly as they do in the hero.
          */}
          <div className="min-w-0">
            <div className="relative h-[248px]">
              {/* Beat 1 · what happened */}
              <Beat show={phase === 0}>
                <p className="flex h-full items-center text-body font-semibold text-text-primary sm:text-body-lg">
                  {situation.line}
                </p>
              </Beat>

              {/* Beat 2 · looking nearby */}
              <Beat show={phase === 1}>
                <div className="flex h-full items-center gap-2.5">
                  <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <span
                      className="motion-only absolute inset-0 animate-ping rounded-full bg-primary"
                      aria-hidden
                    />
                    <Glyph name="pin" size={15} className="relative text-primary-bright" />
                  </span>
                  <span className="truncate text-body font-semibold text-text-secondary sm:text-body-lg">
                    Finding {post.category.toLowerCase()} near you
                  </span>
                </div>
              </Beat>

              {/* Beat 3 · who answered */}
              <Beat show={phase === 2}>
                <div className="flex h-full flex-col">
                  <p className="flex items-center gap-2 text-body font-semibold text-primary-bright sm:text-body-lg">
                    <Glyph name="people" size={16} className="shrink-0" />
                    {offers.length} {offers.length === 1 ? "provider" : "providers"} nearby
                    {from > 0 ? ` · from ${kes(from)}` : ""}
                  </p>

                  <ul className="mt-4 space-y-2.5">
                    {offers.slice(0, 3).map((o, i) => (
                      <li
                        key={`${situation.line}-${o.id}`}
                        className="animate-slide-in"
                        style={{ animationDelay: `${i * 140}ms` }}
                      >
                        <div className="flex items-center gap-3 rounded-card border border-border bg-card px-3 py-2.5">
                          <Avatar name={o.name} size={36} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-body font-semibold text-text-primary">
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
                          <span className="shrink-0 text-body font-bold text-money">
                            {kes(o.price)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Beat>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <DemoChip />
              <Link
                href="/download"
                className="text-body-sm font-semibold text-primary-bright underline-offset-4 hover:underline"
              >
                Post one of these
              </Link>
            </div>
          </div>
        </div>

        {/* ── What else ──────────────────────────────────────────────────── */}
        {/*
          Six category names and a count, not a grid of thirty-two tiles. A
          visitor needs the SHAPE of what Help24 covers; somebody who wants the
          list wants a page, and /services is that page.
        */}
        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:mt-20 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <p className="text-body-lg font-medium text-text-primary">
            {HEADLINE_CATEGORIES.join(" · ")}
            <span className="text-text-secondary"> and {CATEGORIES.length - 6} more</span>
          </p>
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 text-body-lg font-semibold text-primary-bright underline-offset-4 hover:underline"
          >
            Explore services
            <Glyph name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** A cross-fading beat. Same delayed-entry rule as the hero's `Layer`. */
function Beat({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!show}
      className={`absolute inset-0 transition-opacity duration-300 ease-out ${
        show ? "opacity-100 delay-[200ms]" : "pointer-events-none opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
