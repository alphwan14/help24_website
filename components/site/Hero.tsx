/**
 * The hero.
 *
 * An editorial opening — label, headline, answer, two actions — and then the
 * product running underneath it at full width.
 *
 * WHAT WAS REMOVED, AND WHY IT MATTERS MORE THAN WHAT WAS ADDED.
 *
 *   A 64px background grid. A texture with no product meaning; the single
 *   biggest reason the page read as a template rather than as Help24.
 *
 *   A "Launching 19 October" pill above the headline. A bordered chip is a
 *   thing to look at before the headline, and the headline is the only thing
 *   that should be first. The date is not lost — it opens the closing section
 *   and sits in the footer of every page, which is where somebody who wants it
 *   goes looking.
 *
 *   A three-item assurance row under the buttons. Free to post / Pay with
 *   M-Pesa / Money held — three claims, asserted, above a sequence that spends
 *   twenty seconds proving them. They now appear inside the sequence at the
 *   moment each becomes true. That is the whole idea: the product makes its own
 *   case rather than being introduced by a list of adjectives.
 *
 * Nothing replaced any of it. The hero's visual interest is the product, and
 * the room it now has is the point rather than a gap left by a deletion.
 *
 * THE HEADLINE IS A QUESTION AND AN ANSWER. "Need something done?" is the
 * thought somebody already has when they arrive; "Find someone nearby. Get it
 * done." is the whole product. Six words of promise beats sixty of feature.
 *
 * IT IS LEFT-ALIGNED, NOT CENTRED. A centred headline over two centred buttons
 * is the most recognisable landing-page composition on the web, and the brief
 * for this page was to stop looking like every other landing page. A
 * left-aligned opening reads as an editorial spread and gives the stage below a
 * margin to align to.
 */
import Link from "next/link";
import { SITE } from "@/lib/site";
import { Glyph } from "@/components/ds/glyphs";
import { StoryDemo } from "./StoryDemo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* The only decoration on this page: one very low bleed of brand colour
          entering from above the fold, so the top of the page is fractionally
          warmer than the bottom. No edge, no shape, no second layer — see
          `.bg-atmosphere` in globals.css. */}
      <div className="pointer-events-none absolute inset-0 bg-atmosphere" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-36">
        {/* ── The claim ────────────────────────────────────────────────── */}
        <div className="max-w-3xl">
          <p className="text-label-md font-semibold uppercase tracking-[0.22em] text-text-tertiary">
            {SITE.name} · Kenya
          </p>

          {/*
            `clamp` rather than breakpoints. This line has to survive a 320px
            screen without wrapping to four lines, and reach display size on a
            desktop without being set by a media query nobody will remember to
            update. The tight tracking is what stops it looking like a default
            type ramp at the top end.
          */}
          <h1 className="mt-6 text-[clamp(2.4rem,8vw,5rem)] font-bold leading-[1.0] tracking-[-0.04em] text-text-primary">
            Need something done?
          </h1>
          <p className="mt-5 max-w-xl text-[clamp(1.2rem,3.4vw,1.9rem)] font-medium leading-[1.28] tracking-[-0.02em] text-text-secondary">
            Find someone <span className="h24-gradient-word">nearby</span>. Get it done.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 rounded-button bg-primary px-8 py-4 text-body-lg font-semibold text-white transition-transform duration-200 ease-spring hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Help
              <Glyph name="arrowRight" size={17} />
            </Link>
            {/* A text link, not a second button. Two filled-or-outlined buttons
                side by side ask the visitor to choose before they know which
                one they are; this weight says "this, unless you are the other
                one", which is the honest ratio of the audience. */}
            <Link
              href="/for-providers"
              /* `self-start` on a phone: everything else in this hero is set
                 from the left margin, and a centred link under a full-width
                 button is the one thing that would break that line. */
              className="inline-flex items-center gap-2 self-start px-1 py-3 text-body-lg font-semibold text-text-primary underline-offset-[6px] hover:underline sm:self-auto sm:px-2"
            >
              Earn with Help24
              <Glyph name="arrowRight" size={16} className="text-text-tertiary" />
            </Link>
          </div>
        </div>

        {/* ── The product ──────────────────────────────────────────────── */}
        {/*
          Below the typography and across the full measure, which is what makes
          it the anchor rather than an illustration beside the copy. The rule
          above it is the only thing separating them: a hairline costs nothing
          and does the work a card was doing.
        */}
        <StoryDemo className="mt-12 border-t border-border pt-10 sm:mt-20 sm:pt-14" />
      </div>
    </section>
  );
}
