/**
 * The hero.
 *
 * Four things and nothing else: what this is, what to do about it, one line of
 * reassurance, and a working Help24 running beside it.
 *
 * WHAT IS DELIBERATELY NOT HERE. No paragraph under the headline. The old hero
 * carried two sentences explaining that you describe a job, receive offers and
 * agree a price before anyone starts — which is precisely what the sequence to
 * the right does in fifteen seconds without asking anyone to read. A paragraph
 * that duplicates a demonstration is not support for it; it is a second, worse
 * copy of it.
 *
 * THE HEADLINE IS A QUESTION AND AN ANSWER. "Need something done?" is the
 * thought somebody already has when they arrive. "Find someone nearby. Get it
 * done." is the whole product. Six words of promise beats sixty of feature.
 */
import Link from "next/link";
import { LAUNCH } from "@/lib/site";
import { Glyph } from "@/components/ds/glyphs";
import { StoryDemo } from "./StoryDemo";

/**
 * The reassurance line: three facts, no adjectives.
 *
 * Each is checkable and each is answered in full further down the page — free
 * to post by the pricing, M-Pesa by the payment section, the hold by the money
 * flow. Here they are three words each, because at the top of a page a claim
 * only has to be legible, not proved.
 */
const ASSURANCES = [
  { icon: "check", label: "Free to post" },
  { icon: "wallet", label: "Pay with M-Pesa" },
  { icon: "lock", label: "Money held until it's done" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Two ground layers, both `aria-hidden` and neither carrying meaning:
          a grid for texture and a wide bleed of brand colour so the top of the
          page is warmer than the bottom. Both are theme-aware — see
          `.bg-atmosphere` in globals.css for why light needs less of it. */}
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-atmosphere" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8 lg:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,29rem)] lg:gap-14">
          {/* ── The claim ──────────────────────────────────────────────── */}
          <div className="min-w-0">
            <p className="mb-6 inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3 py-1.5 text-label-md font-medium text-text-secondary">
              <Glyph name="timer" size={13} className="text-primary-bright" />
              Launching{" "}
              <time dateTime={LAUNCH.iso} className="font-semibold text-text-primary">
                {LAUNCH.label}
              </time>
            </p>

            {/*
              `clamp` rather than breakpoints, because this line has to survive
              a 320px screen without either wrapping into four lines or growing
              into the oversized, childish thing a fixed `text-6xl` becomes on
              a phone. The floor is 2rem; the ceiling stops well short of the
              container width.
            */}
            <h1 className="text-[clamp(2rem,7.2vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.035em] text-text-primary">
              Need something done?
            </h1>
            <p className="mt-3 text-[clamp(1.1rem,3.2vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-text-secondary">
              Find someone <span className="h24-gradient-word">nearby</span>. Get it done.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/download"
                className="inline-flex items-center justify-center gap-2 rounded-button bg-primary px-7 py-4 text-body-lg font-semibold text-white shadow-card transition-transform duration-200 ease-spring hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Help
                <Glyph name="arrowRight" size={17} />
              </Link>
              <Link
                href="/for-providers"
                className="inline-flex items-center justify-center gap-2 rounded-button border border-border-strong bg-card px-7 py-4 text-body-lg font-semibold text-text-primary transition-colors duration-200 hover:bg-card-hover"
              >
                Earn with Help24
              </Link>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5">
              {ASSURANCES.map((a) => (
                <li
                  key={a.label}
                  className="flex items-center gap-1.5 text-body-sm font-medium text-text-secondary"
                >
                  <Glyph name={a.icon} size={13} className="text-money" />
                  {a.label}
                </li>
              ))}
            </ul>
          </div>

          {/* ── The product ────────────────────────────────────────────── */}
          {/* On a phone this sits under the CTAs rather than above them: the
              sequence is the argument, but the button is the errand, and a
              visitor who has already decided should not have to scroll past a
              demonstration to act. */}
          <StoryDemo className="mx-auto w-full max-w-[30rem] lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
