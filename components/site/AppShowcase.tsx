/**
 * The app, in one phone.
 *
 * The old page ran four screenshot sections stacked down the page, each with a
 * paragraph beside it. This is one frame that stays put while its screen
 * changes — because the thing being shown is that these are four parts of one
 * product, and four separate sections argue the opposite.
 *
 * THIS IS THE ONLY PLACE ON THE SITE THAT USES SCREENSHOTS. Everywhere else a
 * card is real DOM: sharp at any density, responsive, theme-aware, selectable.
 * Here the subject IS the app, so a picture of the app is the honest thing to
 * show.
 *
 * TAPS, NOT SCROLL POSITION. The step list is a set of buttons on every screen
 * size. Scroll-driven versions of this need hover or a viewport-centre
 * heuristic to feel right, and both fail on a phone — where most of Help24's
 * visitors are. It advances on its own while it is on screen and stops the
 * moment somebody takes hold of it.
 *
 * A frame with no export is not rendered at all: no numbered placeholder, no
 * broken image, no 404. The section reads as finished with four screens and
 * becomes five the moment a fifth file lands.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Glyph } from "@/components/ds/glyphs";
import { useReducedMotion } from "@/components/useReducedMotion";
import { useInView } from "./useSequence";

/** The exports are 720×1600 PNGs of the app. The frame derives its own shape. */
const SCREEN_W = 720;
const SCREEN_H = 1600;

const DWELL = 4000;

type Frame = { src: string | null; step: string; line: string; alt: string };

/**
 * The sequence, in the order the product happens.
 *
 * Each line is one clause. The screenshot is doing the explaining; a caption
 * that describes what the reader is already looking at is noise.
 */
const ALL: Frame[] = [
  {
    src: "/walkthrough/discover.png",
    step: "Discover",
    line: "Everything happening near you.",
    alt: "The Help24 Discover feed: a search field, All / Requests / Offers filters, and cards for a catering request in Mtwapa and a welding offer in Mombasa showing budgets and Offer Service and Enquire buttons.",
  },
  {
    src: "/walkthrough/post.png",
    step: "Post",
    line: "Ask, offer, or advertise a job.",
    alt: "The Help24 posting screen asking What would you like to do, with three choices: Request a Service, Offer a Service, and Post a Job.",
  },
  {
    src: "/walkthrough/chats.png",
    step: "Chat",
    line: "Details in one thread, with the job pinned.",
    alt: "A Help24 chat between a customer and a provider, with the job pinned above the messages and an Arrived notice from the provider.",
  },
  {
    src: "/walkthrough/payment.png",
    step: "Pay",
    line: "Cost, fee and total — before you authorise anything.",
    alt: "The Help24 payment screen: service cost, platform fee and total to secure, a note that an M-Pesa prompt will be sent, and a Pay Securely button.",
  },
  {
    // Awaiting the export. Set this to "/walkthrough/rating.png" and the step
    // returns to the sequence with no other edit.
    src: null,
    step: "Done",
    line: "Rate the work. It is attached to a job that was paid for.",
    alt: "The Help24 rating screen after a completed job, with a star rating and a comment field.",
  },
];

const FRAMES = ALL.filter((f): f is Frame & { src: string } => f.src !== null);

export function AppShowcase() {
  const region = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(region);

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held || reduced || !inView || FRAMES.length < 2) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % FRAMES.length), DWELL);
    return () => window.clearTimeout(t);
  }, [active, held, reduced, inView]);

  if (FRAMES.length === 0) return null;

  return (
    <section
      id="app"
      ref={region}
      className="scroll-mt-20 border-t border-border py-section sm:scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-label-md font-semibold uppercase tracking-[0.14em] text-primary-bright">
          In the app
        </p>
        <h2 className="max-w-2xl text-[clamp(1.6rem,4.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary">
          Posted here. Finished on your phone.
        </h2>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          {/* ── The frame ──────────────────────────────────────────────── */}
          <Phone>
            {FRAMES.map((f, i) => (
              <div
                key={f.step}
                aria-hidden={i !== active}
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  width={SCREEN_W}
                  height={SCREEN_H}
                  /*
                   * The exports are 720×1600 PNGs — roughly 1.4MB for the set —
                   * displayed at 200px on a phone. Shipping the originals would
                   * put more bytes through this one section than the rest of
                   * the page combined, on the connection least able to afford
                   * it. `sizes` is what makes Next serve a ~200px WebP instead.
                   */
                  sizes="(min-width: 1024px) 300px, 200px"
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </Phone>

          {/* ── The steps ──────────────────────────────────────────────── */}
          {/* Capped, not full-width. Four rows of four-word captions stretched
              across 700px of a wide screen read as a table of contents; at
              32rem they read as a sequence. */}
          <ol role="radiogroup" aria-label="App screens" className="min-w-0 max-w-lg space-y-1.5">
            {FRAMES.map((f, i) => {
              const on = i === active;
              return (
                <li key={f.step}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      setActive(i);
                      setHeld(true);
                    }}
                    className={`flex w-full items-start gap-4 rounded-card border px-4 py-3.5 text-left transition-all duration-300 ${
                      on
                        ? "border-primary bg-card shadow-card"
                        : "border-transparent hover:border-border hover:bg-card"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-label-md font-bold transition-colors duration-300 ${
                        on ? "bg-primary text-white" : "bg-pill-inactive text-text-secondary"
                      }`}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-h5 font-bold tracking-[-0.01em] transition-colors duration-300 ${
                          on ? "text-text-primary" : "text-text-secondary"
                        }`}
                      >
                        {f.step}
                      </span>
                      <span className="mt-0.5 block text-body text-text-secondary">{f.line}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-10">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-body font-semibold text-primary-bright underline-offset-4 hover:underline"
          >
            See the whole flow, step by step
            <Glyph name="arrowRight" size={14} />
          </Link>
        </p>
      </div>
    </section>
  );
}

/**
 * The bezel.
 *
 * Height is never stated — the inner surface carries the export's own aspect
 * ratio and the bezel grows around it, so a differently-shaped export needs one
 * edit to SCREEN_W/SCREEN_H and no CSS. The box is reserved before any image
 * arrives, so nothing shifts as they load.
 */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[min(58vw,200px)] lg:w-[300px]">
      {/* A soft pool of brand colour under the phone, so it sits ON the page
          rather than being pasted onto it. Purely atmospheric; hidden from
          assistive tech and cheap to paint (one blurred radial). */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-primary/10 blur-2xl"
        aria-hidden
      />
      <div
        className="relative overflow-hidden border-[10px] border-border-strong bg-page shadow-lift"
        style={{ borderRadius: 40 }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: `${SCREEN_W} / ${SCREEN_H}`, borderRadius: 30 }}
        >
          {children}
        </div>
        {/* The pill cut-out. Part of the frame, drawn over the export's own
            status bar — which is why the exports need a clean one. */}
        <span
          className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-border-strong"
          aria-hidden
        />
      </div>
    </div>
  );
}
