/**
 * Nearby. Agreed. Protected.
 *
 * The three reasons to trust a marketplace that has not launched yet, as three
 * full-width acts rather than three cards in a row.
 *
 * WHY IT IS NOT A THREE-CARD GRID ANY MORE. Three equal cards side by side is
 * the most common section on the internet, and it flattens an argument that is
 * not flat: "we find people close to you" is a fact about geography, "you pick
 * from real quotes" is a fact about power, and "the money waits" is a fact about
 * risk. Giving each one a full band, its own composition and room to breathe is
 * what turns a feature list into three claims somebody can weigh.
 *
 * IT ABSORBED THE PAYMENT SECTION. The money used to travel down a spine in a
 * section of its own, immediately after this one made the same promise in a card
 * — the page said "your money is protected", then said it again with an
 * animation. Now the animation IS the third act, which is where the claim was
 * always heading. The `#escrow` anchor lives on it, because /safety,
 * /for-providers and /how-it-works all link to `/#escrow` and that link has
 * always meant this argument.
 *
 * WHAT IS DRAWN FROM REAL DATA. The outline is the national boundary from
 * OpenStreetMap (lib/kenya.ts) with pins projected from real coordinates; the
 * three quotes are the real applicants on the sample plumbing request, at their
 * real prices. Nothing here is a picture of a marketplace — it is the same
 * marketplace the rest of the page is running.
 */
"use client";

import { useRef } from "react";
import Link from "next/link";
import { COPY, kes } from "@/lib/tokens";
import { CITY_PINS, POSTS } from "@/lib/demo/seed";
import { KENYA_PATH, KENYA_VIEWBOX, projectKE } from "@/lib/kenya";
import { Avatar } from "@/components/ds/Avatar";
import { Glyph } from "@/components/ds/glyphs";
import { useReducedMotion } from "@/components/useReducedMotion";
import { useInView, useSequence } from "./useSequence";

const PINS = CITY_PINS.map((p) => ({ ...p, ...projectKE(p.lon, p.lat) }));

/** The sample plumbing request — the same job the hero opens with. */
const REQUEST = POSTS.find((p) => p.id === "p1")!;
const QUOTES = REQUEST.applicants ?? [];
const CHOSEN = QUOTES[0];

const AMOUNT = 1500;

export function Trust() {
  return (
    <section className="bg-surface py-section">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <h2 className="max-w-3xl text-[clamp(1.9rem,5.2vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-text-primary">
          Nearby. Agreed. Protected.
        </h2>

        <div className="mt-14 space-y-16 sm:mt-16 sm:space-y-24">
          <Act
            index="01"
            title="Nearby"
            line="Help24 looks in your own area first, so the person who answers is someone who can actually get to you today."
          >
            <NearbyMap />
          </Act>

          <Act
            index="02"
            title="Agreed"
            line="Providers quote their own price and you pick one. Nobody is assigned to you, and nothing starts before you have agreed a number."
            flip
          >
            <Quotes />
          </Act>

          <Act
            index="03"
            title="Protected"
            line="You pay by M-Pesa and Help24 holds it. The provider can see the money is there — but neither of you can move it until the job is done."
            anchor="escrow"
            link={{ href: "/safety", label: "What happens if something goes wrong" }}
          >
            <MoneyTrack />
          </Act>
        </div>
      </div>
    </section>
  );
}

/**
 * One act: a number, a word, a sentence, and the thing itself.
 *
 * `flip` alternates which side the visual sits on, which is what stops three
 * full-width bands from reading as three identical rows. On a phone the order
 * is always text then visual, because a picture whose caption is underneath it
 * has to be understood before it is explained.
 */
function Act({
  index,
  title,
  line,
  anchor,
  link,
  flip = false,
  children,
}: {
  index: string;
  title: string;
  line: string;
  anchor?: string;
  link?: { href: string; label: string };
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      id={anchor}
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-20 ${
        anchor ? "scroll-mt-24" : ""
      }`}
    >
      <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
        <p className="text-label-md font-semibold tracking-[0.22em] text-text-tertiary">{index}</p>
        <h3 className="mt-3 text-[clamp(1.6rem,4.2vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-text-primary">
          {title}
        </h3>
        <p className="mt-4 max-w-md text-body-lg leading-relaxed text-text-secondary">{line}</p>
        {link ? (
          <Link
            href={link.href}
            className="mt-6 inline-flex items-center gap-2 text-body-lg font-semibold text-primary-bright underline-offset-4 hover:underline"
          >
            {link.label}
            <Glyph name="arrowRight" size={16} />
          </Link>
        ) : null}
      </div>
      <div className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>{children}</div>
    </div>
  );
}

/**
 * Kenya, with the three launch markets on it.
 *
 * A hand-drawn approximation of your own country is the sort of detail a Kenyan
 * visitor notices immediately, so this one is the real boundary and the pins are
 * projected rather than placed by eye.
 */
function NearbyMap() {
  return (
    <div className="flex items-center gap-8 sm:gap-12">
      <div
        className="relative h-[190px] shrink-0 sm:h-[230px]"
        style={{ aspectRatio: `${KENYA_VIEWBOX.width} / ${KENYA_VIEWBOX.height}` }}
      >
        <svg
          viewBox={`0 0 ${KENYA_VIEWBOX.width} ${KENYA_VIEWBOX.height}`}
          className="h-full w-full"
          role="img"
          aria-label="Kenya, with Kisumu, Nairobi and Mombasa marked"
        >
          <path
            d={KENYA_PATH}
            fill="rgb(var(--primary-rgb) / 0.14)"
            stroke="rgb(var(--primary-rgb) / 0.6)"
            strokeWidth={0.7}
            strokeLinejoin="round"
          />
          {PINS.map((p) => (
            <circle key={p.city} cx={p.x} cy={p.y} r={2.2} fill="var(--primary-bright)" />
          ))}
        </svg>
        {/* The locate pulse, on Mombasa — the launch market. Opacity and
            transform only, and `.motion-only` so a reduced-motion visitor gets
            a plain dot rather than a frozen ring. */}
        <span
          className="motion-only absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary"
          style={{
            left: `${(PINS[2].x / KENYA_VIEWBOX.width) * 100}%`,
            top: `${(PINS[2].y / KENYA_VIEWBOX.height) * 100}%`,
          }}
          aria-hidden
        />
      </div>

      <ul className="min-w-0 space-y-3">
        {PINS.map((p, i) => (
          <li key={p.city}>
            <span className="flex items-center gap-2">
              <Glyph
                name="pin"
                size={15}
                className={i === 2 ? "text-primary-bright" : "text-text-tertiary"}
              />
              <span
                className={`truncate text-body-lg ${
                  i === 2 ? "font-semibold text-text-primary" : "text-text-secondary"
                }`}
              >
                {p.city}
              </span>
            </span>
            {i === 2 ? (
              <span className="mt-0.5 block pl-[23px] text-body-sm text-text-secondary">
                {p.blurb}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Three quotes on one job, one of them taken.
 *
 * The picked one is deliberately NOT the cheapest: choosing is a judgement about
 * rating, distance and price together, and a demo that always takes the lowest
 * number teaches the wrong thing about what the offers are for.
 */
function Quotes() {
  return (
    <div>
      <ul className="space-y-2.5">
        {QUOTES.slice(0, 3).map((q) => {
          const picked = q.id === CHOSEN.id;
          return (
            <li key={q.id}>
              <div
                className={`flex items-center gap-3 rounded-card border bg-card px-3 py-2.5 transition-colors ${
                  picked ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border"
                }`}
              >
                <Avatar name={q.name} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-semibold text-text-primary">
                    {q.name}
                  </span>
                  <span className="block truncate text-label-md text-text-secondary">
                    {q.profession}
                  </span>
                </span>
                <span className="shrink-0 text-body font-bold text-money">{kes(q.price)}</span>
                {picked ? (
                  <Glyph name="check" size={16} className="shrink-0 text-primary-bright" />
                ) : (
                  <span className="w-4 shrink-0" aria-hidden />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-body text-text-secondary">
        You picked {CHOSEN.name.split(" ")[0]} — not the cheapest.
      </p>
    </div>
  );
}

/* ── Act three: the money ─────────────────────────────────────────────────── */

/**
 * The four beats. `at` is where the money sits, as a percentage down the track.
 *
 * Beats 1 and 2 share a position on purpose: the money does not move while the
 * work happens, and showing it hold still for a beat is the clearest way to say
 * that neither side can pull it back.
 */
const STOPS = [
  { at: 8, tone: "muted" as const, label: "Agreed" },
  { at: 50, tone: "warning" as const, label: COPY.paymentProtected },
  { at: 50, tone: "warning" as const, label: "Work in progress" },
  { at: 92, tone: "money" as const, label: "Released" },
];

const STOP_DURATIONS = [2600, 3000, 2700, 3400];

const TONE = {
  muted: { text: "text-text-secondary", border: "border-border-strong", fill: "bg-card" },
  warning: { text: "text-warning", border: "border-warning/45", fill: "bg-warning/10" },
  money: { text: "text-money", border: "border-money/45", fill: "bg-money/10" },
};

/**
 * The track's geometry, in pixels, stated once.
 *
 * SPINE is how far in the vertical line sits. Everything else derives from it:
 * the markers straddle it and the money travels in a lane to its left. Fixed
 * pixels rather than percentages, because the marker is a fixed 40px and the
 * money pill a fixed width — a percentage spine would let them collide at one
 * width and drift apart at another.
 */
const SPINE = 128;
const MARKER = 40;
const LANE = SPINE - MARKER / 2 - 16;

function MoneyTrack() {
  const region = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(region);
  const { step, goTo } = useSequence(STOP_DURATIONS, inView && !reduced);

  const stop = STOPS[step];
  const tone = TONE[stop.tone];

  return (
    <div ref={region} className="w-full max-w-[23rem]">
      <div className="relative h-[280px]">
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

        <Node top={8} label="You" sub="Customer" reached>
          <Avatar name="Ann" size={MARKER} />
        </Node>

        <Node top={50} label="Help24" sub="Holds the payment" reached={step >= 1}>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-500 ${
              step >= 1 ? "border-warning/50 bg-warning/15" : "border-border-strong bg-card"
            }`}
          >
            <Glyph
              name="lock"
              size={17}
              className={step >= 1 ? "text-warning" : "text-text-secondary"}
            />
          </span>
        </Node>

        <Node top={92} label={CHOSEN.name.split(" ")[0]} sub="Provider" reached={step >= 3}>
          <Avatar name={CHOSEN.name} size={MARKER} />
        </Node>

        {/*
          The money. One element, one property. `top` is transitioned rather than
          `transform` because the destination is a percentage of a fixed-height
          container — there is no layout to recalculate and the browser can still
          composite it.
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
        {/* Left-aligned to the same margin as the node labels, not centred on
            the spine: centred, the line ran through the middle of the words. */}
        <span
          className={`absolute top-[71%] -translate-y-1/2 whitespace-nowrap text-label-md font-semibold transition-colors duration-500 ${
            step >= 2 ? "text-money" : "text-text-secondary"
          }`}
          style={{ left: SPINE + MARKER / 2 + 12 }}
        >
          {step >= 2 ? "Job completed" : "Job in progress"}
        </span>
      </div>

      {/* Four hairlines, the current one lit — the same control as the hero's
          rail, so the two sequences are operated the same way. */}
      <div className="mt-6 flex items-center gap-1.5" role="group" aria-label="Payment stage">
        {STOPS.map((s, i) => (
          <button
            key={s.label + i}
            type="button"
            onClick={() => goTo(i)}
            aria-current={i === step}
            title={s.label}
            className="group flex h-5 flex-1 items-center"
          >
            <span
              className={`h-0.5 w-full rounded-full transition-colors duration-300 ${
                i === step ? "bg-primary" : i < step ? "bg-primary/30" : "bg-border-strong/50"
              } group-hover:bg-primary/60`}
            />
            <span className="sr-only">{s.label}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className={`mt-2 text-body font-semibold ${tone.text}`}>
        {stop.label}
      </p>
    </div>
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
     * The marker straddles the spine; the label sits beside it. Offsetting by
     * half a marker — rather than centring the whole marker-plus-label row —
     * is what keeps the marker on the line whatever the label says.
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
          className={`block text-body font-semibold transition-colors duration-500 ${
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
