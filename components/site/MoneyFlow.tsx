/**
 * Where the money goes.
 *
 * KES 1,500 leaves the customer, stops at Help24, waits for the job to be
 * finished, and only then reaches the provider. The whole argument is that
 * middle stop, and the whole point of animating it is that a stop is a thing
 * you see rather than a thing you read.
 *
 * WHY THE TRACK IS VERTICAL IN EVERY SIZE. A horizontal money-flow needs a
 * second, differently-shaped implementation for phones, and the two drift. A
 * vertical spine is the same design at 320px and at 1440px — it simply has more
 * air around it — and it happens to be the orientation people already read a
 * transaction in, from a statement or an M-Pesa message.
 *
 * WHAT THE COPY IS ALLOWED TO SAY. The app never uses the word "escrow" with a
 * customer; it says "Payment Protected". The heading here is written for the
 * web, where people arrive having searched for the concept, but every label on
 * the track is the app's own wording.
 *
 * The reduced-motion build is not a still of this: it is the four stops, all
 * present, as a list. Somebody who never sees the money move still gets the
 * complete argument.
 */
"use client";

import { useRef } from "react";
import Link from "next/link";
import { COPY, kes } from "@/lib/tokens";
import { Avatar } from "@/components/ds/Avatar";
import { Glyph } from "@/components/ds/glyphs";
import { useReducedMotion } from "@/components/useReducedMotion";
import { useInView, useSequence } from "./useSequence";

const AMOUNT = 1500;

/**
 * The four beats.
 *
 * `at` is where the money sits, as a percentage down the track. Beats 1 and 2
 * share a position on purpose: the money does not move while the work happens,
 * and showing it hold still for a beat is the clearest way to say that neither
 * side can pull it back.
 */
const STOPS = [
  {
    at: 8,
    tone: "muted" as const,
    label: "Agreed",
    caption: `You accept an offer at ${kes(AMOUNT)}. That number does not move.`,
  },
  {
    at: 50,
    tone: "warning" as const,
    label: COPY.paymentProtected,
    caption: "You pay by M-Pesa and Help24 holds it. The provider can see it is there.",
  },
  {
    at: 50,
    tone: "warning" as const,
    label: COPY.paymentProtected,
    caption: "The work happens. Neither of you can pull the money back alone.",
  },
  {
    at: 92,
    tone: "money" as const,
    label: "Released",
    caption: "You confirm the job is done, and Help24 pays the provider.",
  },
];

const DURATIONS = [2600, 2900, 2600, 3200];

/**
 * The track's geometry, in pixels, stated once.
 *
 * SPINE is how far in the vertical line sits. Everything else is derived from
 * it: the markers straddle it, the money travels in a lane to its left, and
 * the labels start to its right. It is a fixed pixel offset rather than a
 * percentage because the marker is a fixed 40px and the money pill is a fixed
 * 92px — a percentage spine would let them collide at one width and drift
 * apart at another.
 */
const SPINE = 128;
const MARKER = 40;
/** The money lane: from the left edge to 16px clear of the marker. */
const LANE = SPINE - MARKER / 2 - 16;

const TONE = {
  muted: { text: "text-text-secondary", border: "border-border", fill: "bg-card" },
  warning: { text: "text-warning", border: "border-warning/45", fill: "bg-warning/10" },
  money: { text: "text-money", border: "border-money/45", fill: "bg-money/10" },
};

export function MoneyFlow() {
  const region = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(region);
  const { step, goTo } = useSequence(DURATIONS, inView && !reduced);

  const stop = STOPS[step];
  const tone = TONE[stop.tone];

  return (
    /* The `#escrow` id is load-bearing: /safety and /for-providers both link to
       `/#escrow`, and this section is what that link has always meant. */
    <section
      id="escrow"
      ref={region}
      className="scroll-mt-20 border-t border-border bg-surface py-section sm:scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-label-md font-semibold uppercase tracking-[0.14em] text-primary-bright">
          Payment protection
        </p>
        <h2 className="max-w-2xl text-[clamp(1.6rem,4.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary">
          Your money stays protected until the job is done.
        </h2>

        {reduced ? <StaticStops /> : (
          /*
           * TWO COLUMNS ON A WIDE SCREEN, ONE ON A PHONE.
           *
           * The track is a fixed-width object — a 300px spine with pixel-placed
           * markers — so on a 1440px page it cannot fill a band on its own, and
           * centring it left a section that looked like a diagram somebody
           * forgot to finish. Pairing it with the stage list gives the width to
           * something that wants width, and turns the captions from a single
           * line that swaps into a list you can see the shape of.
           */
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
            {/* ── The track ─────────────────────────────────────────────── */}
            <div className="relative mx-auto h-[300px] w-full max-w-[23rem] lg:mx-0">
              {/* Spine, and the part of it the money has already covered. */}
              <span
                className="absolute top-0 h-full w-0.5 -translate-x-1/2 rounded-full bg-border-strong"
                style={{ left: SPINE }}
                aria-hidden
              />
              <span
                className="absolute top-0 w-0.5 -translate-x-1/2 rounded-full bg-primary transition-[height] duration-700 ease-out"
                style={{ left: SPINE, height: `${stop.at}%` }}
                aria-hidden
              />

              <Node top={8} reached label="You" sub="Customer">
                <Avatar name="Ann" size={40} />
              </Node>

              <Node top={50} reached={step >= 1} label="Help24" sub="Holds the payment">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-500 ${
                    step >= 1 ? "border-warning/50 bg-warning/15" : "border-border bg-card"
                  }`}
                >
                  <Glyph
                    name="lock"
                    size={17}
                    className={step >= 1 ? "text-warning" : "text-text-tertiary"}
                  />
                </span>
              </Node>

              <Node top={92} reached={step >= 3} label="Joseph" sub="Provider">
                <Avatar name="Joseph" size={40} />
              </Node>

              {/* ── The money ───────────────────────────────────────────── */}
              {/*
                One element, one property. `top` is transitioned rather than
                `transform` here because the destination is expressed as a
                percentage of a container whose height is fixed — so there is no
                layout to recalculate and the browser can still composite it.
              */}
              <div
                className="absolute left-0 -translate-y-1/2 text-right transition-[top] duration-700 ease-spring"
                style={{ top: `${stop.at}%`, width: LANE }}
              >
                <span
                  className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-2 text-body font-bold shadow-card transition-colors duration-500 ${tone.border} ${tone.fill} ${tone.text}`}
                >
                  {step >= 1 && step < 3 ? <Glyph name="lock" size={13} /> : null}
                  {step >= 3 ? <Glyph name="check" size={13} /> : null}
                  {kes(AMOUNT)}
                </span>
              </div>

              {/* The work, as a checkpoint between the hold and the release. */}
              <span
                className={`absolute top-[71%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-tag border border-border bg-card px-2 py-1 text-label-sm font-semibold transition-all duration-500 ${
                  step >= 2 ? "scale-100 text-money opacity-100" : "scale-95 text-text-secondary opacity-100"
                }`}
                style={{ left: SPINE }}
              >
                {step >= 2 ? "Job completed" : "Job in progress"}
              </span>
            </div>

            {/* ── The stages ───────────────────────────────────────────── */}
            {/*
              All four captions, always visible, with the current one lit —
              rather than one caption that swaps. A visitor can see how many
              stages there are and what the shape of the whole thing is without
              waiting eleven seconds to find out, and jumping back to the beat
              they missed is one tap rather than a full cycle.

              `aria-live` stays on the list so the change is still announced;
              the text does not move, so there is nothing to read twice.
            */}
            <ol
              aria-live="polite"
              role="radiogroup"
              aria-label="Payment stage"
              className="min-w-0 space-y-1"
            >
              {STOPS.map((s, i) => {
                const on = i === step;
                return (
                  <li key={s.caption}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => goTo(i)}
                      className={`flex w-full items-start gap-3.5 rounded-card border px-4 py-3 text-left transition-all duration-300 ${
                        on ? "border-border bg-card shadow-card" : "border-transparent"
                      }`}
                    >
                      <span
                        className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-label-sm font-bold transition-colors duration-300 ${
                          on ? "bg-primary text-white" : "bg-pill-inactive text-text-secondary"
                        }`}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`text-body sm:text-body-lg transition-colors duration-300 ${
                          on ? "text-text-primary" : "text-text-secondary"
                        }`}
                      >
                        {s.caption}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        <p className="mt-10">
          <Link
            href="/safety"
            className="inline-flex items-center gap-1.5 text-body font-semibold text-primary-bright underline-offset-4 hover:underline"
          >
            What happens if something goes wrong
            <Glyph name="arrowRight" size={14} />
          </Link>
        </p>
      </div>
    </section>
  );
}

/** A stop on the spine: marker, name, role. */
function Node({
  top,
  reached,
  label,
  sub,
  children,
}: {
  top: number;
  reached: boolean;
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    /*
     * The marker straddles the spine; the label sits beside it.
     *
     * This used to be one flex row centred with `-translate-x-1/2`, which
     * centres the ROW — marker plus label — on the spine, and therefore put the
     * marker half a label's width to the left of the line it is meant to be on.
     * Offsetting by half a marker instead puts the marker exactly on the spine
     * whatever the label says.
     */
    <div
      className="absolute flex -translate-y-1/2 items-center gap-3"
      style={{ top: `${top}%`, left: SPINE - MARKER / 2 }}
    >
      {/* The ring is the section's own background, so the spine appears to pass
          behind the marker rather than through it. */}
      <span className="rounded-full ring-4 ring-surface">{children}</span>
      <span className="whitespace-nowrap">
        <span
          className={`block text-body-sm font-semibold transition-colors duration-500 ${
            reached ? "text-text-primary" : "text-text-secondary"
          }`}
        >
          {label}
        </span>
        <span className="block text-label-md text-text-secondary">{sub}</span>
      </span>
    </div>
  );
}

/**
 * The reduced-motion build: the same four stops, all visible, in order.
 * Complete on its own — not a stub apologising for the animated version.
 */
function StaticStops() {
  return (
    <ol className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
      {STOPS.map((s, i) => {
        const tone = TONE[s.tone];
        return (
          <li key={s.caption} className="rounded-card border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-label-md font-semibold text-text-secondary">
                {i + 1}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-label-md font-semibold ${tone.border} ${tone.fill} ${tone.text}`}
              >
                {s.label}
              </span>
            </div>
            <p className="mt-3 text-body text-text-secondary">{s.caption}</p>
          </li>
        );
      })}
    </ol>
  );
}
