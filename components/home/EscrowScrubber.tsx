/**
 * The escrow scrubber.
 *
 * With no reviews and no completed jobs yet, this is the whole trust story, so
 * it gets the room and it gets to be operated rather than described. Four
 * stops, and the visitor drags the money through them.
 *
 * WHY A RANGE INPUT. A hand-rolled drag handle would need pointer capture,
 * touch-action juggling and its own key handling, and would still not be
 * announced properly. `<input type="range">` is draggable with a mouse,
 * draggable with a finger, and steppable with the arrow keys, Home and End —
 * for free and correctly. The visible track is drawn over it from tokens.
 *
 * COLOUR. Amber is `--warning` (AppTheme.warningOrange) and green is `--money`
 * (AppTheme.successGreen) — the same two the app uses on a held payment and a
 * settled one. Note these are NOT the urgency amber and green; the app defines
 * both pairs and this module deliberately follows the escrow one.
 *
 * The app never says "escrow" to a user — it says "Payment Protected". This
 * section is titled for the web, where people arrive searching for the word,
 * but the in-product language is what appears on the badge.
 */
"use client";

import { useState } from "react";
import { COPY, kes } from "@/lib/tokens";
import { Avatar } from "@/components/ds/Avatar";
import { Badge } from "@/components/ds/Badge";
import { Glyph } from "@/components/ds/glyphs";
import { Section, SectionLabel } from "@/components/Section";
import { useReducedMotion } from "./useReducedMotion";

const AMOUNT = 1500;

type Stop = {
  title: string;
  copy: string;
  /** Where the money sits, as a percentage across the track. */
  at: number;
  /**
   * `text-secondary`, not `text-tertiary`, for the neutral first stop: the
   * app's tertiary grey measures 3.5:1 on a card, which is under AA and this
   * badge is a state a visitor has to read.
   */
  badge: { token: "text-secondary" | "warning" | "money"; label: string; icon?: string };
};

const STOPS: Stop[] = [
  {
    title: "Price agreed",
    copy: `You accept an offer at ${kes(AMOUNT)}. That is the number — it does not move once the provider has seen the job.`,
    at: 6,
    badge: { token: "text-secondary", label: "Agreed" },
  },
  {
    title: "Held by Help24",
    copy: "You pay by M-Pesa and Help24 holds it. The provider can see the money is there, which is why they will travel — but they cannot touch it.",
    at: 50,
    badge: { token: "warning", label: COPY.paymentProtected, icon: "lock" },
  },
  {
    title: "Work in progress",
    copy: "The job happens. Neither side can pull the money back on their own while it is underway.",
    at: 50,
    badge: { token: "warning", label: COPY.paymentProtected, icon: "lock" },
  },
  {
    title: "Released",
    copy: `You confirm the work is done and Help24 releases ${kes(AMOUNT)} to the provider. If something is wrong, you raise a dispute instead and the money stays put.`,
    at: 94,
    badge: { token: "money", label: "Released", icon: "check" },
  },
];

export function EscrowScrubber() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const stop = STOPS[i];

  return (
    <Section id="escrow" className="border-t border-border">
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel className="text-center">Payment protection</SectionLabel>
        <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
          Your money waits where neither of you can reach it
        </h2>
        <p className="mx-auto mt-4 max-w-prose text-body sm:text-body-lg text-text-secondary">
          Drag through what happens to {kes(AMOUNT)} from the moment you agree a price to the moment
          the provider is paid.
        </p>
      </div>

      {reduced ? <StaticSteps /> : <Track i={i} setI={setI} stop={stop} />}
    </Section>
  );
}

function Track({ i, setI, stop }: { i: number; setI: (n: number) => void; stop: Stop }) {
  return (
    <div className="mx-auto mt-10 max-w-3xl sm:mt-14">
      {/* Customer → money → provider */}
      {/*
        On a phone the money pill is clamped near the left edge at the first
        stop, which puts it beside the customer avatar rather than above it.
        The two are given separate bands here — pill on top, parties below —
        so nothing has to share a line with anything. From `sm` the track is
        wide enough that they never meet and the original height returns.
      */}
      <div className="relative h-44 sm:h-24">
        <div className="absolute inset-x-0 top-[5.5rem] flex items-start justify-between sm:top-8">
          <Party name="Ann" role="Customer" />
          <Party name="Joseph" role="Provider" align="right" />
        </div>

        <div
          className="absolute top-0 -translate-x-1/2 transition-[left] duration-500 ease-out"
          style={{
            // The pill is centred on its stop, but a stop at 6% on a 300px
            // phone would hang the pill off the left edge. `clamp` keeps its
            // centre at least half its own width inside the track, so the
            // travel still reads as customer → held → provider without the
            // ends being cut off.
            left: `clamp(4.25rem, ${stop.at}%, calc(100% - 4.25rem))`,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-body font-bold transition-colors duration-300"
              style={{
                color: `var(--${stop.badge.token})`,
                borderColor: `color-mix(in srgb, var(--${stop.badge.token}) 45%, transparent)`,
                backgroundColor: `color-mix(in srgb, var(--${stop.badge.token}) 12%, transparent)`,
              }}
            >
              {stop.badge.icon ? <Glyph name={stop.badge.icon} size={13} /> : null}
              {kes(AMOUNT)}
            </span>
            <Badge token={stop.badge.token}>{stop.badge.label}</Badge>
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <label htmlFor="escrow-scrubber" className="sr-only">
          Escrow stage
        </label>
        <input
          id="escrow-scrubber"
          type="range"
          className="h24-range"
          min={0}
          max={STOPS.length - 1}
          step={1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-valuetext={`Step ${i + 1} of ${STOPS.length}: ${stop.title}`}
          aria-describedby="escrow-copy"
          style={{ ["--fill" as string]: `${(i / (STOPS.length - 1)) * 100}%` }}
        />
        {/*
          Four labels across a 288px phone would be four columns of about 60px
          — "Work in progress" cannot live there. Below `sm` they become a 2×2
          grid of real tap targets; from `sm` they line up under the track as
          stop markers.
        */}
        <ol className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 sm:mt-2 sm:flex sm:justify-between sm:gap-0">
          {STOPS.map((s, n) => (
            <li
              key={s.title}
              className="min-w-0 sm:flex-1 sm:text-center sm:first:text-left sm:last:text-right"
            >
              <button
                type="button"
                onClick={() => setI(n)}
                aria-current={n === i}
                className={`w-full py-1 text-left text-label-md font-medium transition-colors sm:w-auto sm:py-0 sm:text-center ${
                  n === i ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span className="sm:hidden" aria-hidden>
                  {n + 1}.{" "}
                </span>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p
        id="escrow-copy"
        aria-live="polite"
        className="mx-auto mt-8 min-h-[7rem] max-w-xl text-center text-body sm:min-h-[5.5rem] sm:text-body-lg text-text-secondary"
      >
        {stop.copy}
      </p>
    </div>
  );
}

function Party({ name, role, align = "left" }: { name: string; role: string; align?: "left" | "right" }) {
  return (
    <div className={`flex flex-col ${align === "right" ? "items-end" : "items-start"} gap-2`}>
      <Avatar name={name} size={44} />
      <div className={align === "right" ? "text-right" : ""}>
        <p className="text-body-sm font-medium text-text-primary">{name}</p>
        <p className="text-label-md text-text-secondary">{role}</p>
      </div>
    </div>
  );
}

/**
 * The reduced-motion fallback: the same four stops, all visible, nothing that
 * moves and nothing to operate. It is a complete explanation on its own, not a
 * stub apologising for the interactive version.
 */
function StaticSteps() {
  return (
    <ol className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
      {STOPS.map((s, n) => (
        <li key={s.title} className="rounded-card border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-label-md font-semibold text-text-secondary">
              {n + 1}
            </span>
            <h3 className="text-h5 font-semibold text-text-primary">{s.title}</h3>
          </div>
          <p className="mt-3 text-body text-text-secondary">{s.copy}</p>
          <div className="mt-4">
            <Badge token={s.badge.token} icon={s.badge.icon}>
              {s.badge.label}
            </Badge>
          </div>
        </li>
      ))}
    </ol>
  );
}
