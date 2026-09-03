/**
 * The stage: Help24 working, in the open.
 *
 * A sentence types itself, drops into the marketplace as a card, providers are
 * found nearby, offers arrive, one is chosen, the price is agreed, the money is
 * secured, the job completes — then it resets and does it with a different job.
 *
 * TWO LANES, NOT ONE COLUMN. The left lane is you: what you asked for, and what
 * state it is in. The right lane is the market: who answered. Running them side
 * by side is the difference between a list of steps and a marketplace — you see
 * both sides at once, which is the thing being sold. On a phone they stack in
 * the same order and read as one sequence.
 *
 * IT IS NOT IN A BOX. No frame, no panel, no header bar, no shadow around any
 * of this. The only bordered objects on the stage are real product objects — a
 * request, an offer — because those are cards in the app too. Everything else is
 * type on the page. A demo wrapped in a card reads as a screenshot of a product;
 * a demo with no wrapper reads as the product.
 *
 * THE TRUST CLAIMS LIVE IN THE FLOW. "Free to post", "KES 1,100 agreed",
 * "Payment secured", "Released after completion" are no longer a bullet list
 * under the buttons — they are the state line, and each appears at the moment it
 * becomes true. The product demonstrates its own trust model instead of
 * asserting it above the fold.
 *
 * IT IS NOT A VIDEO. The field is real: type your own job, press the button, and
 * the sequence runs with your words against the sample data.
 *
 * WHAT IT REFUSES TO DO. No time on any card. No counter climbing on its own.
 * No "142 providers online". The whole module carries a Demo chip, because
 * Help24 has no supply yet and a marketplace that looks busy before it is busy
 * is the one lie a launch site must not tell.
 *
 * COST. One timeout at a time, and it does not run at all while the section is
 * off screen or when the visitor has asked for reduced motion. Every moving
 * property is `opacity` or `transform`.
 */
"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cardMoneyLabel, kes } from "@/lib/tokens";
import {
  SCENARIOS,
  chosenOffer,
  resolveTyped,
  type DemoOffer,
  type Scenario,
} from "@/lib/demo/scenarios";
import { Avatar } from "@/components/ds/Avatar";
import { CategoryChip } from "@/components/ds/CategoryChip";
import { DemoChip } from "@/components/ds/DemoChip";
import { UrgencyBadge, PostTypeBadge } from "@/components/ds/Badge";
import { Glyph } from "@/components/ds/glyphs";
import { useReducedMotion } from "@/components/useReducedMotion";
import { useInView, useSequence, useTypewriter } from "./useSequence";

/* ── The timeline ─────────────────────────────────────────────────────────── */

const ASK = 0;
const DROP = 1;
const SEARCH = 2;
const OFFERS = 3;
const CHOOSE = 4;
const AGREED = 5;
const SECURED = 6;
const DONE = 7;

/**
 * Milliseconds per beat.
 *
 * SLOWER THAN IT WANTS TO BE. The loop is about twenty-two seconds; the first
 * version ran it in fifteen. The faster one demonstrated that something was
 * happening. This one lets you actually read a provider's rating, distance and
 * price and form an opinion before the next beat arrives — which is the only
 * reason the offers are on screen at all, so `OFFERS` is the longest beat.
 * `DROP` is the shortest: it is one physical movement, and holding on it after
 * the card lands turns a gesture into a pause.
 */
const DURATIONS = [4200, 1500, 2300, 3800, 2400, 2100, 2700, 3400];

type Tone = "muted" | "accent" | "warning" | "money";

const TONE: Record<Tone, string> = {
  muted: "text-text-secondary",
  accent: "text-primary-bright",
  warning: "text-warning",
  money: "text-money",
};

/** Screen-reader narration for the rail. One short phrase per beat. */
const CAPTIONS = [
  "Say what you need",
  "Posted to the marketplace",
  "Looking nearby",
  "Offers come to you",
  "You choose",
  "Price agreed",
  "Payment secured",
  "Done, and paid",
];

/** `Bamburi, Mombasa`, or just `Your area` when there is no city to name. */
function placeOf(s: Scenario): string {
  return [s.area, s.city].filter(Boolean).join(", ");
}

/** Providers are addressed by first name everywhere in the product. */
function firstName(o: DemoOffer | undefined): string {
  return o?.name.split(" ")[0] ?? "";
}

export function StoryDemo({ className = "" }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(stage);

  const [draft, setDraft] = useState("");
  /** A scenario the visitor produced. Outranks the rotation until it finishes. */
  const [custom, setCustom] = useState<Scenario | null>(null);

  const running = inView && !reduced;
  const { step, cycle, goTo } = useSequence(DURATIONS, running);

  // The visitor's job survives exactly one pass, then the rotation resumes.
  // Leaving it up for ever would mean a page that stops demonstrating Help24
  // and starts displaying one sentence somebody typed a minute ago.
  const passRef = useRef(cycle);
  useEffect(() => {
    if (cycle !== passRef.current) {
      passRef.current = cycle;
      setCustom(null);
    }
  }, [cycle]);

  const scenario = custom ?? SCENARIOS[cycle % SCENARIOS.length];
  const chosen = chosenOffer(scenario);
  /** Whether the rest of the sequence has anything to be about. */
  const answerable = scenario.matched && scenario.offers.length > 0;
  const typed = useTypewriter(scenario.typed, running && step === ASK && !custom);

  const submit = () => {
    const text = draft.trim();
    if (text.length < 4) return;
    setCustom(resolveTyped(text));
    setDraft("");
    goTo(DROP);
  };

  const restart = () => {
    goTo(ASK);
    setCustom(null);
    // Focus after the state has flushed, or the field the visitor is being
    // sent to does not exist yet.
    requestAnimationFrame(() => input.current?.focus());
  };

  if (reduced) return <StaticStory className={className} />;

  return (
    <div ref={stage} className={className}>
      {/*
        The lanes. Both are fixed-height so the page below the hero cannot move
        while the sequence plays — eight layout shifts per loop is the worst
        thing an ambient animation can do to a page.
      */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* ── Lane A · what you asked for ──────────────────────────────── */}
        <div>
          <div className="relative h-[124px] lg:h-[148px]">
            <Layer show={step === ASK}>
              <AskField
                ref={input}
                display={draft || typed}
                typing={!draft && step === ASK}
                value={draft}
                onChange={setDraft}
                onSubmit={submit}
              />
            </Layer>
            <Layer show={step > ASK}>
              {/* `key` restarts the drop for each new scenario — the card has
                  to fall again, not cross-fade into the next job. */}
              <RequestCard key={scenario.id} scenario={scenario} dropping={step === DROP} />
            </Layer>
          </div>

          {/* The state line. See the note on trust claims in the file header. */}
          <div className="relative mt-5 h-7">
            <Layer show={step === ASK}>
              <State tone="muted" icon="check">
                Free to post
              </State>
            </Layer>
            <Layer show={step === DROP}>
              <State tone="accent" icon="send">
                Posted to {placeOf(scenario)}
              </State>
            </Layer>
            <Layer show={step === SEARCH}>
              <Searching label={scenario.searching} />
            </Layer>
            {/*
             * Everything from here needs an offer to talk about. When somebody
             * typed a job the sandbox has no providers for, the line says so
             * and stays — see `matched` in lib/demo/scenarios.ts.
             */}
            <Layer show={step >= OFFERS && !answerable}>
              <State tone="muted" icon="search">
                Nothing like this in the sample
              </State>
            </Layer>
            <Layer show={step === OFFERS && answerable}>
              <State tone="accent" icon="people">
                {scenario.offers.length} nearby · from{" "}
                {kes(Math.min(...scenario.offers.map((o) => o.price)))}
              </State>
            </Layer>
            <Layer show={step === CHOOSE && answerable}>
              <State tone="accent" icon="handshake">
                You chose {firstName(chosen)}
              </State>
            </Layer>
            <Layer show={step === AGREED && answerable}>
              <State tone="accent" icon="handshake">
                {kes(chosen?.price ?? 0)} agreed
              </State>
            </Layer>
            <Layer show={step === SECURED && answerable}>
              <State tone="warning" icon="lock">
                Payment secured
              </State>
            </Layer>
            <Layer show={step === DONE && answerable}>
              <State tone="money" icon="check">
                Released after completion
              </State>
            </Layer>
          </div>
        </div>

        {/* ── Lane B · who answered ────────────────────────────────────── */}
        <div className="relative h-[236px] lg:h-[276px]">
          <Layer show={step < SEARCH}>
            <p className="flex h-full items-center text-body text-text-tertiary">
              Offers from providers near you appear here.
            </p>
          </Layer>
          <Layer show={step === SEARCH}>
            <GhostOffers />
          </Layer>
          <Layer show={step >= OFFERS && !answerable}>
            <NoSample />
          </Layer>
          <Layer show={(step === OFFERS || step === CHOOSE) && answerable}>
            <ul className="space-y-2.5">
              {scenario.offers.slice(0, 3).map((o, i) => (
                <li
                  key={`${scenario.id}-${o.id}`}
                  className="animate-slide-in transition-all duration-500 ease-out"
                  style={{
                    animationDelay: `${i * 170}ms`,
                    // At CHOOSE the losing offers retreat rather than vanish —
                    // they are still there, you simply picked someone else.
                    opacity: step === CHOOSE && o.id !== scenario.chosenId ? 0.3 : 1,
                    transform:
                      step === CHOOSE && o.id !== scenario.chosenId ? "scale(0.98)" : "none",
                  }}
                >
                  <OfferRow offer={o} picked={step === CHOOSE && o.id === scenario.chosenId} />
                </li>
              ))}
            </ul>
          </Layer>
          <Layer show={step >= AGREED && answerable}>
            {/*
             * The chosen provider stays exactly where their offer row was — the
             * top of this lane — so choosing reads as one person moving into a
             * job rather than as a list being replaced by a panel. (Every
             * scenario lists its chosen provider first for this reason; see the
             * note on `chosenId` in lib/demo/scenarios.ts.)
             */}
            <div className="space-y-5">
              <OfferRow offer={chosen} picked />
              <JobProgress step={step} />
            </div>
          </Layer>
        </div>
      </div>

      <Rail step={step} onJump={goTo} />

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <DemoChip title="A working sample, so you can see how Help24 behaves before launch. The people, prices and offers are written for this page." />
        <button
          type="button"
          onClick={restart}
          className="text-body-sm font-semibold text-primary-bright underline-offset-4 hover:underline"
        >
          Try it with your own job
        </button>
      </div>
    </div>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────────── */

/**
 * A cross-fading layer.
 *
 * Every beat occupies the same box and only opacity changes, which is what keeps
 * each lane a fixed height.
 *
 * THE INCOMING LAYER IS DELAYED, THE OUTGOING ONE IS NOT. A symmetric cross-fade
 * puts both at half opacity for a moment, and when both are text in the same
 * place the result is two sentences printed on top of each other — legible
 * enough to read as a fault rather than as a transition. Holding the arrival
 * back lets the old one clear first, so the beat reads as "that, then this".
 */
function Layer({ show, children }: { show: boolean; children: React.ReactNode }) {
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

interface AskFieldProps {
  display: string;
  typing: boolean;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

/**
 * The field, doing two jobs at once.
 *
 * When nobody has touched it, it shows the scripted sentence arriving one
 * character at a time — painted over a real, empty, focusable input. The moment
 * a visitor types, their text takes over and the script stops. There is no mode
 * switch and nothing to click first: the demo is already a control.
 *
 * It is drawn as a RULE, not a box. An input styled as a bordered pill would be
 * one more rounded rectangle in a hero that just had its rectangles removed, and
 * it would read as a form to fill in rather than as a thing being said.
 */
const AskField = forwardRef<HTMLInputElement, AskFieldProps>(function AskField(
  { display, typing, value, onChange, onSubmit },
  ref,
) {
  return (
    <div className="flex h-full flex-col justify-center">
      <label
        htmlFor="story-input"
        className="mb-2.5 block text-label-md font-semibold uppercase tracking-[0.14em] text-text-tertiary"
      >
        Tell us what you need
      </label>
      <div className="relative flex items-center border-b-2 border-border-strong pb-2.5 focus-within:border-primary">
        <input
          id="story-input"
          ref={ref}
          type="text"
          value={value}
          maxLength={90}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
          className="w-full min-w-0 bg-transparent pr-14 text-[clamp(1rem,2.1vw,1.15rem)] text-text-primary caret-primary focus:outline-none"
          /* The scripted sentence is painted underneath, so the real
             placeholder must stay empty or the two overlap. */
          placeholder=""
          aria-describedby="story-input-hint"
          autoComplete="off"
        />
        {!value ? (
          /* Both edges anchored, deliberately. An absolutely positioned span
             with only a `left` has no width, so it sizes to its own text and
             `truncate` has nothing to truncate against — the longest scripted
             sentence then ran past the lane and gave the whole page a
             horizontal scrollbar on a phone. */
          <span
            className="pointer-events-none absolute inset-x-0 truncate pr-14 text-[clamp(1rem,2.1vw,1.15rem)] text-text-primary"
            aria-hidden
          >
            {display}
            {typing ? (
              <span className="motion-only ml-px inline-block h-[1.05em] w-px translate-y-[0.15em] bg-primary" />
            ) : null}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onSubmit}
          className="absolute right-0 text-label-lg font-semibold text-primary-bright underline-offset-4 hover:underline"
        >
          Post
        </button>
      </div>
      <p id="story-input-hint" className="sr-only">
        A sandbox. Nothing you type here is sent anywhere or published.
      </p>
    </div>
  );
});

/**
 * The request, as a card — the same shape the app's feed draws.
 *
 * This one keeps its border because a post IS a card in the product. See the
 * note on card language in the file header.
 */
function RequestCard({ scenario, dropping }: { scenario: Scenario; dropping: boolean }) {
  return (
    <article
      className={`h-full rounded-card border border-border bg-card px-3.5 py-3 shadow-card ${
        dropping ? "animate-drop" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <PostTypeBadge type="request" />
        <CategoryChip name={scenario.category} />
        <UrgencyBadge value={scenario.urgency} />
      </div>
      <h3 className="mt-2 line-clamp-2 text-card-heading font-bold text-text-primary">
        {scenario.title}
      </h3>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1 text-card-location text-text-secondary">
          <Glyph name="pin" size={12} className="shrink-0" />
          <span className="truncate">{placeOf(scenario)}</span>
        </span>
        {/* `cardMoneyLabel` is the app's own rule, so a request with no number
            reads "Open to offers" here exactly as it does on a feed card. */}
        <span className="shrink-0 text-card-title font-bold text-money">
          {cardMoneyLabel("request", scenario.budget)}
        </span>
      </div>
    </article>
  );
}

/** The state line: a glyph and a few words, on the page. No pill, no fill. */
function State({ tone, icon, children }: { tone: Tone; icon: string; children: React.ReactNode }) {
  return (
    <p
      aria-live="polite"
      className={`flex h-full items-center gap-2 text-body font-semibold sm:text-body-lg ${TONE[tone]}`}
    >
      <Glyph name={icon} size={16} className="shrink-0" />
      <span className="truncate">{children}</span>
    </p>
  );
}

/**
 * The search beat.
 *
 * A pin with a locate pulse, and a sweep travelling along the rule under the
 * words. The sweep is a translated gradient rather than a width animation, so it
 * composites on the GPU and never lays anything out. Both are `.motion-only`, so
 * under reduced motion this is simply a labelled line.
 */
function Searching({ label }: { label: string }) {
  return (
    <div className="relative flex h-full items-center gap-2 overflow-hidden">
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <span
          className="motion-only absolute inset-0 animate-ping rounded-full bg-primary"
          aria-hidden
        />
        <Glyph name="pin" size={15} className="relative text-primary-bright" />
      </span>
      <span className="truncate text-body font-semibold text-text-secondary sm:text-body-lg">{label}</span>
      <span className="motion-only absolute inset-x-0 bottom-0 h-px overflow-hidden" aria-hidden>
        <span className="absolute inset-y-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-primary to-transparent" />
      </span>
    </div>
  );
}

/**
 * One provider's offer — the object the whole sequence exists to arrive at.
 *
 * Name, rating, distance, availability, price: everything somebody actually
 * weighs, on one line, in the order they weigh it.
 */
function OfferRow({ offer, picked = false }: { offer: DemoOffer; picked?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-card border bg-card px-3 py-2.5 transition-[border-color,box-shadow] duration-300 lg:px-4 lg:py-3.5 ${
        picked ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border"
      }`}
    >
      <Avatar name={offer.name} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body font-semibold text-text-primary">{offer.name}</p>
        <p className="flex items-center gap-1.5 truncate text-label-md text-text-secondary">
          {offer.rating === null ? (
            <span className="font-medium">New</span>
          ) : (
            <span className="inline-flex items-center gap-0.5">
              <Glyph name="star" size={10} className="text-warning" />
              {offer.rating.toFixed(1)}
            </span>
          )}
          <span aria-hidden>·</span>
          {offer.distance}
          <span aria-hidden>·</span>
          {offer.available}
        </p>
      </div>
      <span className="shrink-0 text-body font-bold text-money">{kes(offer.price)}</span>
    </div>
  );
}

/** Three shapes where offers are about to be. Never labelled, never counted. */
function GhostOffers() {
  return (
    <ul className="space-y-2.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-card border border-border bg-card px-3 py-2.5 opacity-55 lg:px-4 lg:py-3.5"
        >
          <span className="h-9 w-9 shrink-0 rounded-full bg-border" />
          <span className="flex-1 space-y-1.5">
            <span className="block h-2.5 w-2/5 rounded-full bg-border" />
            <span className="block h-2 w-3/5 rounded-full bg-border opacity-70" />
          </span>
          <span className="h-3 w-14 shrink-0 rounded-full bg-border" />
        </li>
      ))}
    </ul>
  );
}

/**
 * The honest dead end.
 *
 * The sandbox holds twelve posts. When somebody types a job none of them
 * answers, the alternative to this is to hand them the nearest match and hope
 * they do not notice a plumber quoting for their laptop.
 */
function NoSample() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <p className="text-body-lg font-semibold text-text-primary">
        No sample providers for that one
      </p>
      <p className="max-w-sm text-body text-text-secondary">
        This page carries a dozen written examples. In the app your post goes to
        everyone near you, whatever the job is.
      </p>
      <Link
        href="/download"
        className="mt-1 inline-flex items-center gap-1.5 self-start text-body font-semibold text-primary-bright underline-offset-4 hover:underline"
      >
        Get the app
        <Glyph name="arrowRight" size={14} />
      </Link>
    </div>
  );
}

/**
 * Agreed → secured → completed, as three lit dots on a line.
 *
 * No border and no fill: it is a progress indicator, not a panel. The amounts
 * are not repeated here — the state line to the left is already saying them, and
 * a number printed twice on one screen reads as two numbers.
 */
function JobProgress({ step }: { step: number }) {
  const stages = [
    { at: AGREED, label: "Agreed" },
    { at: SECURED, label: "Secured" },
    { at: DONE, label: "Completed" },
  ];

  return (
    <ol className="flex items-start gap-1.5">
      {stages.map((s, i) => {
        const reached = step >= s.at;
        const isDone = s.at === DONE && reached;
        return (
          <li key={s.label} className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
            <span className="flex w-full items-center gap-1.5">
              {i > 0 ? (
                <span
                  className={`h-px flex-1 transition-colors duration-500 ${
                    reached ? "bg-primary" : "bg-border-strong"
                  }`}
                  aria-hidden
                />
              ) : null}
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                  reached
                    ? isDone
                      ? "border-money bg-money text-white"
                      : "border-primary bg-primary text-white"
                    : "border-border-strong text-text-secondary"
                }`}
              >
                {reached ? <Glyph name="check" size={11} /> : null}
              </span>
              {i < stages.length - 1 ? (
                <span
                  className={`h-px flex-1 transition-colors duration-500 ${
                    step > s.at ? "bg-primary" : "bg-border-strong"
                  }`}
                  aria-hidden
                />
              ) : null}
            </span>
            <span
              className={`truncate text-label-md font-medium transition-colors duration-500 ${
                reached ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The rail: eight hairlines, the current one lit, all of them tappable.
 *
 * It is a control, not a progress bar — somebody who wants to see the payment
 * beat again should not have to wait twenty seconds for it to come round. It
 * carries no caption of its own: the state line in lane A is already the
 * caption, and printing it twice was the sequence talking over itself.
 */
function Rail({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  return (
    <div className="mt-9 flex items-center gap-1.5" role="group" aria-label="Jump to a step">
      {CAPTIONS.map((c, i) => (
        <button
          key={c}
          type="button"
          onClick={() => onJump(i)}
          aria-current={i === step}
          title={c}
          /* The visible line is 2px; the button is 20px tall with the extra
             height transparent, so a thumb has something to hit. */
          className="group flex h-5 flex-1 items-center"
        >
          <span
            className={`h-0.5 w-full rounded-full transition-colors duration-300 ${
              i === step ? "bg-primary" : i < step ? "bg-primary/30" : "bg-border-strong/50"
            } group-hover:bg-primary/60`}
          />
          <span className="sr-only">{c}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * The reduced-motion build.
 *
 * Not a still frame of the animation and not an apology for it — the same
 * sequence, all present at once, in the order it happens. Somebody who never
 * sees it move still gets the complete argument, which is the standard the rest
 * of this site holds itself to.
 */
function StaticStory({ className = "" }: { className?: string }) {
  const s = SCENARIOS[0];

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="h-[124px] lg:h-[148px]">
            <RequestCard scenario={s} dropping={false} />
          </div>
          <p className="mt-5 flex h-7 items-center gap-2 text-body-lg font-semibold text-money">
            <Glyph name="check" size={16} />
            Released after completion
          </p>
        </div>
        <div>
          <ul className="space-y-2.5">
            {s.offers.slice(0, 3).map((o) => (
              <li key={o.id}>
                <OfferRow offer={o} picked={o.id === s.chosenId} />
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <JobProgress step={DONE} />
          </div>
        </div>
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2">
        <DemoChip />
        <Link
          href="/how-it-works"
          className="text-body-sm font-semibold text-primary-bright underline-offset-4 hover:underline"
        >
          Read how it works
        </Link>
      </div>
    </div>
  );
}
