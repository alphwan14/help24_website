/**
 * The signature interaction: Help24, played rather than described.
 *
 * A sentence types itself into a field, drops into the marketplace as a card,
 * providers are found nearby, three offers arrive, one is chosen, the money is
 * secured, the job completes. Eight beats, roughly fifteen seconds, on a loop,
 * with a different job each time round.
 *
 * THIS IS THE ONE ANIMATION ON THE PAGE THAT IS ALLOWED TO BE ELABORATE.
 * Everything else moves only to show a state change. The rule the rest of the
 * site follows — one or two signature interactions, not dozens of small ones —
 * only works if the signature one is genuinely worth the room.
 *
 * IT IS NOT A VIDEO. The field is real: type your own job, press the button,
 * and the sequence runs with your words against the sample data. That is the
 * difference between showing someone a product and letting them hold it, and
 * it costs one text input and one matcher we already had.
 *
 * WHAT IT REFUSES TO DO. No time on any card. No counter climbing on its own.
 * No "142 providers online". The whole module carries a Demo chip, because
 * Help24 has no supply yet and a marketplace that looks busy before it is busy
 * is the one lie a launch site must not tell.
 *
 * COST. One timeout at a time, and it does not run at all while the section is
 * off screen or when the visitor has asked for reduced motion. Every moving
 * property is `opacity` or `transform`, so nothing here touches layout after
 * first paint and nothing forces a reflow mid-sequence.
 */
"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cardMoneyLabel, kes } from "@/lib/tokens";
import { SCENARIOS, chosenOffer, resolveTyped, type DemoOffer, type Scenario } from "@/lib/demo/scenarios";
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
const ACTIVE = 5;
const SECURED = 6;
const DONE = 7;

/**
 * Milliseconds per beat, tuned by reading rather than by symmetry.
 *
 * `ASK` has to outlast its own typing. `OFFERS` is the longest because three
 * cards arrive in it and each one carries a name, a rating, a distance and a
 * price that a visitor is meant to actually compare. `DROP` is the shortest:
 * it is one physical movement and holding on it after the card lands turns a
 * gesture into a pause.
 */
const DURATIONS = [3200, 1150, 1750, 3000, 1900, 1750, 2150, 2600];

/** `Bamburi, Mombasa`, or just `Your area` when there is no city to name. */
function placeOf(s: Scenario): string {
  return [s.area, s.city].filter(Boolean).join(", ");
}

/** Providers are addressed by first name everywhere in the product. */
function firstName(o: DemoOffer | undefined): string {
  return o?.name.split(" ")[0] ?? "";
}

/** The line under the rail. One short sentence per beat, never two. */
const CAPTIONS = [
  "Say what you need",
  "Posted to the marketplace",
  "Looking nearby",
  "Offers come to you",
  "You choose",
  "Job accepted",
  "Money held by Help24",
  "Done, and paid",
];

export function StoryDemo({ className = "" }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(frame);

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
    <div
      ref={frame}
      className={`relative ${className}`}
    >
      {/* ── Frame header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 pb-3">
        <DemoChip title="A working sample, so you can see how Help24 behaves before launch. The people, prices and offers are written for this page." />
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1.5 text-label-md font-semibold text-primary-bright transition-colors hover:bg-card-hover"
        >
          <Glyph name="send" size={12} />
          Try your own
        </button>
      </div>

      <div className="space-y-2.5">
        {/* ── A. The request ───────────────────────────────────────────── */}
        <div className="relative h-[116px]">
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
            {/* `key` restarts the drop animation for each new scenario — the
                card has to fall again, not cross-fade into the next job. */}
            <RequestCard key={scenario.id} scenario={scenario} dropping={step === DROP} />
          </Layer>
        </div>

        {/* ── B. What is happening ─────────────────────────────────────── */}
        <div className="relative h-[52px]">
          <Layer show={step === ASK}>
            <Status tone="muted" icon="timer">
              Free to post. Nobody starts until you agree a price.
            </Status>
          </Layer>
          <Layer show={step === DROP}>
            <Status tone="accent" icon="check">
              Posted to {placeOf(scenario)}
            </Status>
          </Layer>
          <Layer show={step === SEARCH}>
            <Searching label={scenario.searching} />
          </Layer>
          {/*
           * Everything from here needs an offer to talk about. When the
           * visitor typed something the sandbox has no providers for, the
           * strip says exactly that and stays there — see `matched` in
           * lib/demo/scenarios.ts for why that is the right answer.
           */}
          <Layer show={step >= OFFERS && !answerable}>
            <Status tone="muted" icon="search">
              Nothing like this in the sample data
            </Status>
          </Layer>
          <Layer show={step === OFFERS && answerable}>
            <Status tone="accent" icon="people">
              {scenario.offers.length} offers · from{" "}
              {kes(Math.min(...scenario.offers.map((o) => o.price)))}
            </Status>
          </Layer>
          <Layer show={(step === CHOOSE || step === ACTIVE) && answerable}>
            <Status tone="accent" icon="handshake">
              Agreed with {firstName(chosen)} at {kes(chosen?.price ?? 0)}
            </Status>
          </Layer>
          <Layer show={step === SECURED && answerable}>
            <Status tone="warning" icon="lock">
              {kes(chosen?.price ?? 0)} held by Help24
            </Status>
          </Layer>
          <Layer show={step === DONE && answerable}>
            <Status tone="money" icon="check">
              Released to {firstName(chosen)}
            </Status>
          </Layer>
        </div>

        {/* ── C. Offers, then the job ──────────────────────────────────── */}
        <div className="relative h-[204px]">
          <Layer show={step === SEARCH}>
            <GhostOffers />
          </Layer>
          <Layer show={step >= OFFERS && !answerable}>
            <NoSample />
          </Layer>
          <Layer show={(step === OFFERS || step === CHOOSE) && answerable}>
            <ul className="space-y-2">
              {scenario.offers.slice(0, 3).map((o, i) => (
                <li
                  key={`${scenario.id}-${o.id}`}
                  className="animate-slide-in transition-all duration-500 ease-out"
                  style={{
                    animationDelay: `${i * 150}ms`,
                    // At CHOOSE the losing offers retreat rather than vanish —
                    // they are still there, you simply picked someone else.
                    opacity: step === CHOOSE && o.id !== scenario.chosenId ? 0.28 : 1,
                    transform:
                      step === CHOOSE && o.id !== scenario.chosenId ? "scale(0.97)" : "none",
                  }}
                >
                  <OfferRow offer={o} picked={step === CHOOSE && o.id === scenario.chosenId} />
                </li>
              ))}
            </ul>
          </Layer>
          <Layer show={step >= ACTIVE && answerable}>
            {/*
             * The chosen provider stays exactly where their offer row was —
             * the top of this region — so choosing reads as one person moving
             * into a job rather than as a list being replaced by a panel.
             * (Every scenario lists its chosen provider first for this reason;
             * see the note on `chosenId` in lib/demo/scenarios.ts.)
             */}
            <div className="space-y-3">
              <OfferRow offer={chosen} picked />
              <JobProgress step={step} amount={chosen.price} />
            </div>
          </Layer>
          <Layer show={step < SEARCH}>
            <Prompt />
          </Layer>
        </div>
      </div>

      {/* ── The rail ─────────────────────────────────────────────────────── */}
      <Rail step={step} onJump={goTo} />
    </div>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────────── */

/**
 * A cross-fading layer.
 *
 * Every beat occupies the same box and only opacity changes, which is what
 * keeps the frame a fixed height. A height that responded to its content would
 * make the whole page below the hero jump eight times per loop — the single
 * worst thing an ambient animation can do to Cumulative Layout Shift.
 *
 * `pointer-events` and `inert`-by-tabIndex are handled by `aria-hidden` plus
 * the `pointer-events-none`, so a hidden layer never eats a tap and never
 * appears in the accessibility tree.
 */
function Layer({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!show}
      /*
       * THE INCOMING LAYER IS DELAYED, THE OUTGOING ONE IS NOT.
       *
       * A symmetric cross-fade puts both layers at half opacity for a moment,
       * and when both are text in the same place the result is two sentences
       * printed on top of each other — legible enough to be read as a fault
       * rather than as a transition. Holding the arrival back by 180ms lets
       * the old one clear first, so the beat reads as "that, then this".
       */
      className={`absolute inset-0 transition-opacity duration-300 ease-out ${
        show ? "opacity-100 delay-[180ms]" : "pointer-events-none opacity-0"
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
 * character at a time — painted over a real, empty, focusable input. The
 * moment a visitor types, their text takes over and the script stops. There is
 * no mode switch and nothing to click first: the demo is simply already a
 * control, which is the point.
 */
const AskField = forwardRef<HTMLInputElement, AskFieldProps>(function AskField(
  { display, typing, value, onChange, onSubmit },
  ref,
) {
  return (
    <div className="flex h-full flex-col justify-center">
      <label htmlFor="story-input" className="mb-2 block text-label-md font-medium text-text-secondary">
        Tell us what you need
      </label>
      <div className="relative flex items-center rounded-button border border-border bg-card focus-within:border-primary focus-within:shadow-[0_0_0_1px_var(--primary)]">
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
          className="w-full min-w-0 bg-transparent py-3 pl-3.5 pr-24 text-body text-text-primary caret-primary focus:outline-none"
          /* The scripted sentence is painted underneath, so the real
             placeholder must stay empty or the two overlap. */
          placeholder=""
          aria-describedby="story-input-hint"
          autoComplete="off"
        />
        {!value ? (
          <span
            /* Both edges anchored, deliberately. An absolutely positioned
               span with only a `left` has no width, so it sizes to its own
               text and `truncate` has nothing to truncate against — the
               longest scripted sentence then ran past the card and gave the
               whole page a horizontal scrollbar on a phone. */
            className="pointer-events-none absolute left-3.5 right-[5.25rem] truncate text-body text-text-primary"
            aria-hidden
          >
            {display}
            {typing ? (
              <span className="ml-px inline-block h-[1.05em] w-px translate-y-[0.15em] bg-primary motion-only" />
            ) : null}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onSubmit}
          className="absolute right-1.5 inline-flex items-center gap-1 rounded-button bg-primary px-3 py-2 text-label-lg font-semibold text-white transition-opacity hover:opacity-95"
        >
          Post
          <Glyph name="arrowRight" size={13} />
        </button>
      </div>
      <p id="story-input-hint" className="sr-only">
        A sandbox. Nothing you type here is sent anywhere or published.
      </p>
    </div>
  );
});

/** The request, as a card — the same shape the app's feed draws. */
function RequestCard({ scenario, dropping }: { scenario: Scenario; dropping: boolean }) {
  return (
    <article
      className={`h-full rounded-card border border-border bg-card px-3 py-2.5 ${
        dropping ? "animate-drop" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <PostTypeBadge type="request" />
        <CategoryChip name={scenario.category} />
        <UrgencyBadge value={scenario.urgency} />
      </div>
      <h3 className="mt-1.5 line-clamp-2 text-card-heading font-bold text-text-primary">
        {scenario.title}
      </h3>
      <div className="mt-1 flex items-center justify-between gap-2">
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

type Tone = "muted" | "accent" | "warning" | "money";

const TONE: Record<Tone, string> = {
  muted: "text-text-secondary",
  accent: "text-primary-bright",
  warning: "text-warning",
  money: "text-money",
};

function Status({ tone, icon, children }: { tone: Tone; icon: string; children: React.ReactNode }) {
  return (
    <p
      className={`flex h-full items-center gap-2 text-body font-medium ${TONE[tone]}`}
    >
      <Glyph name={icon} size={15} className="shrink-0" />
      <span className="truncate">{children}</span>
    </p>
  );
}

/**
 * The search beat.
 *
 * A pin with a locate pulse and a sweep across the strip. The sweep is a
 * translated gradient, not a width animation, so it composites on the GPU and
 * never lays anything out. Both are `.motion-only`, so under reduced motion
 * the strip is simply a labelled row.
 */
function Searching({ label }: { label: string }) {
  return (
    <div className="relative h-full overflow-hidden">
      <span
        className="motion-only absolute inset-y-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-primary/15 to-transparent"
        aria-hidden
      />
      <p className="relative flex h-full items-center gap-2 text-body font-medium text-text-secondary">
        <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
          <span
            className="motion-only absolute inset-0 animate-ping rounded-full bg-primary"
            aria-hidden
          />
          <Glyph name="pin" size={14} className="relative text-primary-bright" />
        </span>
        <span className="truncate">{label}</span>
      </p>
    </div>
  );
}

/** One provider's offer. The row the whole sequence is built to arrive at. */
function OfferRow({ offer, picked = false }: { offer: DemoOffer; picked?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-card border bg-card px-2.5 py-2 transition-[border-color,box-shadow] duration-300 ${
        picked ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border"
      }`}
    >
      <Avatar name={offer.name} size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-card-title font-semibold text-text-primary">{offer.name}</p>
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
      <span className="shrink-0 text-card-title font-bold text-money">{kes(offer.price)}</span>
    </div>
  );
}

/** Three shapes where offers are about to be. Never labelled, never counted. */
function GhostOffers() {
  return (
    <ul className="space-y-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex items-center gap-2.5 rounded-card border border-border bg-card px-2.5 py-2 opacity-60"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <span className="h-8 w-8 shrink-0 rounded-full bg-border" />
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

/** Accepted → held → done, as three lit dots rather than three sentences. */
function JobProgress({ step, amount }: { step: number; amount: number }) {
  const stages = [
    { at: ACTIVE, label: "Accepted" },
    { at: SECURED, label: `${kes(amount)} held` },
    { at: DONE, label: "Completed" },
  ];

  return (
    <ol className="flex items-start gap-1.5 py-1">
      {stages.map((s, i) => {
        const reached = step >= s.at;
        const isDone = s.at === DONE && reached;
        return (
          <li key={s.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
            <span className="flex w-full items-center gap-1.5">
              {i > 0 ? (
                <span
                  className={`h-px flex-1 transition-colors duration-500 ${
                    reached ? "bg-primary" : "bg-border"
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
                    : "border-border bg-card text-text-tertiary"
                }`}
              >
                {reached ? <Glyph name="check" size={11} /> : null}
              </span>
              {i < stages.length - 1 ? (
                <span
                  className={`h-px flex-1 transition-colors duration-500 ${
                    step > s.at ? "bg-primary" : "bg-border"
                  }`}
                  aria-hidden
                />
              ) : null}
            </span>
            <span
              className={`truncate text-label-sm font-medium transition-colors duration-500 ${
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
 * The honest dead end.
 *
 * The sandbox holds twelve posts. When somebody types a job none of them
 * answers, the alternative to this panel is to hand them the nearest match and
 * hope they do not notice that a plumber has quoted for their laptop. This
 * says what happened, says what the real app does instead, and offers the one
 * action that is actually available.
 */
function NoSample() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2.5 text-center">
      <Glyph name="search" size={20} className="text-text-tertiary" />
      <p className="text-body font-semibold text-text-primary">
        No sample providers for that one
      </p>
      <p className="max-w-[24rem] text-body-sm text-text-secondary">
        This page carries a dozen written examples. In the app your post goes to
        everyone near you, whatever the job is.
      </p>
      <Link
        href="/download"
        className="mt-1 inline-flex items-center gap-1.5 rounded-button bg-primary px-4 py-2.5 text-body font-semibold text-white transition-opacity hover:opacity-95"
      >
        Get the app
        <Glyph name="arrowRight" size={14} />
      </Link>
    </div>
  );
}

/** What sits in the offers region before anything has been posted. */
function Prompt() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <Glyph name="handshake" size={22} className="text-text-tertiary" />
      <p className="text-body-sm text-text-secondary">
        Offers from providers near you land here.
      </p>
    </div>
  );
}

/**
 * The rail: eight segments, the current one filled, all of them tappable.
 *
 * It is a control, not a progress bar — a visitor who wants to see the payment
 * beat again should not have to wait fifteen seconds for it to come round. The
 * caption underneath is `aria-live`, so the sequence narrates itself to a
 * screen reader instead of being eight silent opacity changes.
 */
function Rail({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  return (
    <div className="pt-3">
      <div className="flex items-center gap-1" role="group" aria-label="Jump to a step">
        {CAPTIONS.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => onJump(i)}
            aria-current={i === step}
            title={c}
            /* The visible bar is 3px; the button is 20px tall with the extra
               height transparent, so a thumb has something to hit. */
            className="group flex h-5 flex-1 items-center"
          >
            <span
              className={`h-[3px] w-full rounded-full transition-colors duration-300 ${
                i === step ? "bg-primary" : i < step ? "bg-primary/35" : "bg-border"
              } group-hover:bg-primary/60`}
            />
            <span className="sr-only">{c}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-1.5 text-label-md font-medium text-text-secondary">
        {CAPTIONS[step]}
      </p>
    </div>
  );
}

/**
 * The reduced-motion build.
 *
 * Not a still frame of the animation and not an apology for it — the same
 * eight beats, all present at once, in the order they happen. Somebody who
 * never sees the sequence move still gets the complete argument, which is the
 * standard the rest of this site holds itself to.
 */
function StaticStory({ className = "" }: { className?: string }) {
  const s = SCENARIOS[0];
  const chosen = chosenOffer(s);

  return (
    <div className={className}>
      <div className="flex items-center justify-between pb-3">
        <DemoChip />
        <span className="text-label-md font-medium text-text-secondary">How a job runs</span>
      </div>
      <div className="space-y-3">
        <RequestCard scenario={s} dropping={false} />
        <ul className="space-y-2">
          {s.offers.slice(0, 3).map((o) => (
            <li key={o.id}>
              <OfferRow offer={o} picked={o.id === s.chosenId} />
            </li>
          ))}
        </ul>
        <JobProgress step={DONE} amount={chosen.price} />
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-1.5 text-body font-semibold text-primary-bright underline-offset-4 hover:underline"
        >
          Read how it works
          <Glyph name="arrowRight" size={14} />
        </Link>
      </div>
    </div>
  );
}
