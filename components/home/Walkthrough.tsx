/**
 * The product walkthrough — a phone frame pinned while the copy scrolls past
 * it, the screen advancing one frame per step.
 *
 * THIS IS THE ONLY PLACE ON THE SITE THAT USES SCREENSHOTS. Everywhere else,
 * a card is a card: real DOM, sharp at any density, responsive, and
 * interactive. Here the point is the app itself, so an image of the app is the
 * honest thing to show.
 *
 * The slots are numbered and empty until real exports are dropped in. Each one
 * declares its intrinsic size up front so the frame never reflows when an image
 * arrives, and everything below the first frame is lazy — the walkthrough is
 * roughly a screen and a half down the page and must not cost anything before
 * that.
 *
 * Sticky, not scroll-jacked: the page scrolls at the speed the reader chose.
 * The frame simply stays put while it does.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Section, SectionLabel } from "@/components/Section";
import { useReducedMotion } from "./useReducedMotion";

/**
 * The exports are 720×1600 PNGs of the app in its dark theme.
 *
 * The frame derives its own aspect ratio from these numbers, so a future
 * export at a different resolution needs one edit here and no CSS.
 */
export const SCREEN_WIDTH = 720;
export const SCREEN_HEIGHT = 1600;

/**
 * The six screens, in the order the product happens.
 *
 * `src: null` means the export does not exist yet, and that frame is simply
 * NOT RENDERED — no numbered placeholder, no broken image, no 404 in the
 * console. The section reads as finished with four frames and becomes six the
 * moment the files land: the only edit is filling in the `src`, and the frame
 * reappears in its correct position in the sequence.
 *
 * The copy is written against what each screenshot actually shows. A caption
 * describing a screen the reader is not looking at is worse than no caption.
 */
type Frame = {
  slot: number;
  src: string | null;
  screen: string;
  title: string;
  copy: string;
  alt: string;
};

const ALL_FRAMES: Frame[] = [
  {
    slot: 1,
    src: "/walkthrough/discover.png",
    screen: "Discover",
    title: "Everything happening near you",
    copy: "Requests and offers from your own area in one feed, each with its category, how soon it is needed and what it pays. The same board you have been playing with at the top of this page.",
    alt: "The Help24 Discover feed: a search field, All / Requests / Offers filters, and cards for a catering request in Mtwapa and a welding offer in Mombasa showing budgets and Offer Service and Enquire buttons.",
  },
  {
    slot: 2,
    src: "/walkthrough/post.png",
    screen: "Post",
    title: "Say what kind of post it is",
    copy: "Request a service, offer one, or advertise a job. The app asks only the questions that apply to your answer — a plumbing request and a driving job are not the same form.",
    alt: "The Help24 posting screen asking What would you like to do, with three choices: Request a Service, Offer a Service, and Post a Job.",
  },
  {
    slot: 3,
    // Awaiting the export. Set this to "/walkthrough/applications.png" and the
    // frame returns to the sequence.
    src: null,
    screen: "Applications",
    title: "Providers come to you",
    copy: "Each offer arrives with its own price and a message. You compare them side by side and pick one — nobody is assigned to you, and nothing starts before you choose.",
    alt: "The Help24 applications screen listing providers who have offered on a request, each with their quoted price.",
  },
  {
    slot: 4,
    src: "/walkthrough/chats.png",
    screen: "Chat",
    title: "Sort out the details in the thread",
    copy: "The job is pinned to the top of the conversation, so neither of you has to remember which one this is. Directions, photos and an arrival notice when they reach you — none of it lost in a WhatsApp scroll.",
    alt: "A Help24 chat between a customer and a provider, with the job pinned above the messages and an Arrived notice from the provider.",
  },
  {
    slot: 5,
    src: "/walkthrough/payment.png",
    screen: "Payment",
    title: "The money goes in before the work starts",
    copy: "You pay by M-Pesa and Help24 holds it until the job is done. The cost, the fee and the total are all on the screen before you authorise anything — nothing is added afterwards.",
    alt: "The Help24 payment screen: service cost, platform fee and total to secure, a note that an M-Pesa prompt will be sent, and a Pay Securely button.",
  },
  {
    slot: 6,
    // Awaiting the export. Set this to "/walkthrough/rating.png".
    src: null,
    screen: "Rating",
    title: "Rate the work",
    copy: "Your rating is what the next customer sees. It is attached to a job that was completed and paid for, which is what makes a Help24 rating hard to fake.",
    alt: "The Help24 rating screen after a completed job, with a star rating and a comment field.",
  },
];

/** Only the frames that have an export. See the note on `src` above. */
const FRAMES = ALL_FRAMES.filter((f): f is Frame & { src: string } => f.src !== null);

export function Walkthrough() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // The step nearest the middle of the viewport is the one being read.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const n = Number((e.target as HTMLElement).dataset.step);
            if (!Number.isNaN(n)) setActive(n);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // With no exports at all the section has nothing to show and should not
  // announce itself. Placed after the hooks so the hook order never changes.
  if (FRAMES.length === 0) return null;
  const current = FRAMES[Math.min(active, FRAMES.length - 1)];

  return (
    <Section id="walkthrough" className="border-t border-border">
      <SectionLabel>In the app</SectionLabel>
      <h2 className="max-w-2xl text-h3 font-semibold text-text-primary sm:text-h2">
        Posted here, finished in the app
      </h2>

      <div className="mt-10 grid gap-12 sm:mt-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
        {/* The pinned frame. Hidden below lg, where a sticky column has nowhere
            to stick — there the frame travels inline with its own step. */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Phone width={300}>
              {FRAMES.map((f, n) => (
                <div
                  key={f.slot}
                  className={`absolute inset-0 ${reduced ? "" : "transition-opacity duration-500"}`}
                  style={{ opacity: n === active ? 1 : 0 }}
                  aria-hidden={n !== active}
                >
                  <Screen frame={f} eager={n === 0} />
                </div>
              ))}
            </Phone>
            <p className="mt-4 text-center text-label-md text-text-secondary">
              {current.screen} · {active + 1} of {FRAMES.length}
            </p>
          </div>
        </div>

        <ol className="space-y-20 lg:space-y-40">
          {FRAMES.map((f, n) => (
            <li
              key={f.slot}
              data-step={n}
              ref={(el) => {
                stepRefs.current[n] = el;
              }}
              className="scroll-mt-32"
            >
              <p className="text-label-md font-semibold uppercase tracking-wider text-primary-bright">
                {f.screen}
              </p>
              <h3 className="mt-2 text-h4 font-semibold text-text-primary sm:text-h3">{f.title}</h3>
              <p className="mt-3 max-w-prose text-body sm:text-body-lg text-text-secondary">
                {f.copy}
              </p>

              <div className="mt-6 lg:hidden">
                <Phone width={230}>
                  <Screen frame={f} eager={n === 0} />
                </Phone>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/**
 * The bezel.
 *
 * Height is never stated — the inner surface carries the export's own aspect
 * ratio and the bezel grows around it, so changing SCREEN_WIDTH/HEIGHT is the
 * only edit a differently-shaped export needs. `width` is a ceiling, not a
 * fixed size: at 230px on a 320px screen it still has room to breathe.
 */
function Phone({ width, children }: { width: number; children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto overflow-hidden border-[10px] border-border bg-bg-dark shadow-card"
      style={{ width: `min(100%, ${width}px)`, borderRadius: 40 }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${SCREEN_WIDTH} / ${SCREEN_HEIGHT}`, borderRadius: 30 }}
      >
        {children}
      </div>
      {/* The pill cut-out. Part of the frame, drawn over the export's own
          status bar — which is why the exports need a clean one. */}
      <span
        className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-border"
        aria-hidden
      />
    </div>
  );
}

/**
 * One screen.
 *
 * `onError` is a safety net for a renamed or corrupt file — it swaps in the
 * numbered slot rather than leaving a broken-image icon inside the bezel. A
 * frame with no export never reaches here at all; it is filtered out above.
 */
function Screen({ frame, eager }: { frame: Frame & { src: string }; eager: boolean }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-card p-6 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-h5 font-bold text-text-secondary">
          {frame.slot}
        </span>
        <p className="text-body font-medium text-text-primary">{frame.screen}</p>
        <p className="text-label-md text-text-secondary">
          {SCREEN_WIDTH}×{SCREEN_HEIGHT} PNG
        </p>
        <code className="break-all text-label-sm text-text-secondary">public{frame.src}</code>
      </div>
    );
  }

  return (
    /*
     * next/image, not a plain <img>.
     *
     * The exports are 720×1600 PNGs — about 1.4MB for the four of them — and
     * they are displayed at 210px wide on a phone and 280px on a desktop.
     * Shipping the originals would put more bytes through this one section
     * than the rest of the page combined, on the connection least able to
     * afford it. `sizes` tells Next what it is actually rendering at, so a
     * phone gets a ~210px WebP.
     *
     * Intrinsic width and height are still declared, so the bezel reserves the
     * right box before anything arrives and the layout never shifts.
     */
    <Image
      src={frame.src}
      alt={frame.alt}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      sizes="(min-width: 1024px) 280px, 210px"
      loading={eager ? "eager" : "lazy"}
      onError={() => setMissing(true)}
      className="h-full w-full object-cover"
    />
  );
}
