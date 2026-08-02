/**
 * The hero.
 *
 * Left: the sentence, one input, one text link. Right: a working board.
 * Typing on the left filters the board on the right and lights the matching
 * category — the two halves are one thing, which is the whole point. The old
 * hero had a headline, two stacked buttons and a static "Sample task" card
 * that described the product; this one hands it over.
 *
 * The gradient sits on ONE WORD. A gradient across a whole line stops being
 * emphasis and becomes decoration, and at this size it was the main thing
 * making the page read as a template.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/tokens";
import { LAUNCH } from "@/lib/site";
import { SEARCH_EXAMPLES } from "@/lib/demo/seed";
import { SearchField } from "@/components/ds/SearchField";
import { CategoryChip } from "@/components/ds/CategoryChip";
import { DemoChip } from "@/components/ds/DemoChip";
import { Glyph } from "@/components/ds/glyphs";
import { LiveBoard } from "./LiveBoard";
import { useMarketplace } from "./MarketplaceContext";
import { useReducedMotion } from "./useReducedMotion";

/** "What do you need done?" first, then the examples, then round again. */
const PLACEHOLDERS = ["What do you need done?", ...SEARCH_EXAMPLES];
const CYCLE_MS = 3600;

export function Hero() {
  const { query, setQuery, visible, totalForSide, highlighted, landedId, side } = useMarketplace();
  const reduced = useReducedMotion();
  const [slot, setSlot] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycling stops while the field has focus — a placeholder changing under
  // someone who is about to type is a distraction, and under reduced motion it
  // never starts.
  const cycling = !reduced && !focused && query.length === 0;

  useEffect(() => {
    if (!cycling) return;
    const t = window.setInterval(() => setSlot((s) => (s + 1) % PLACEHOLDERS.length), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [cycling]);

  const placeholder = reduced ? PLACEHOLDERS[0] : PLACEHOLDERS[slot];

  // The chips shown beside the board: the categories currently on it, with the
  // matched one lit. Capped so the rail never wraps to three lines.
  const railCategories = Array.from(new Set(visible.map((p) => p.category))).slice(0, 6);
  const rail =
    highlighted && !railCategories.includes(highlighted)
      ? [highlighted, ...railCategories].slice(0, 6)
      : railCategories;

  return (
    <section className="relative overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24">
      <div className="absolute inset-0 bg-grid bg-bg-dark" aria-hidden />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
          {/* ── Left ─────────────────────────────────────────────────────── */}
          <div className="min-w-0">
            <p className="mb-5 inline-flex items-center gap-2 rounded-badge border border-border bg-card px-3 py-1.5 text-label-md font-medium text-text-secondary">
              <Glyph name="timer" size={13} className="text-primary-bright" />
              Launching {LAUNCH.label}
            </p>

            {/*
              Two lines, held by a hard break — so the size has to be the thing
              that adapts, not the wrapping. `clamp` ties it to the viewport
              between a 23px floor and a 48px ceiling: at 320px the longer line
              ("Post it in 30 seconds.") measures about 250px inside 288px of
              usable width, and it stops growing well before the text becomes
              the oversized, childish thing it was.
            */}
            <h1 className="text-[clamp(1.45rem,6.6vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em] text-text-primary">
              Need a <span className="h24-hero-gradient">fundi</span>?
              <br />
              Post it in 30 seconds.
            </h1>

            <p className="mt-4 max-w-lg text-body sm:text-body-lg text-text-secondary">
              Describe the job, get offers from providers near you, and agree the price before
              anyone starts.
            </p>

            <div className="mt-7 max-w-lg">
              <SearchField
                ref={inputRef}
                size="lg"
                label="Try the marketplace — describe what you need done"
                value={query}
                onChange={setQuery}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                describedBy="board-status"
              />
              <p className="mt-2.5 text-body-sm text-text-secondary">
                Type to filter the board — this one is a sandbox, nothing is sent.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/download"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-button bg-primary px-6 py-3.5 text-body font-semibold text-white transition-opacity hover:opacity-95 sm:flex-none"
              >
                Get the app
                <Glyph name="arrowRight" size={16} />
              </Link>
              {/* Padded to a 37px-tall target. It is a standalone link, not one
                  inside a sentence, so the 24px minimum applies to it. */}
              <Link
                href="/for-providers"
                className="inline-flex items-center py-2 text-body font-medium text-primary-bright underline-offset-4 hover:underline"
              >
                Become a provider
              </Link>
            </div>
          </div>

          {/* ── Right: the board ─────────────────────────────────────────── */}
          {/* `id` is the composer's scroll target once it lands a card here. */}
          <div className="min-w-0 scroll-mt-24" id="board">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-section-title font-semibold text-text-primary">
                {side === "need" ? "People are posting" : "Providers are listing"}
              </h2>
              <DemoChip />
            </div>

            {rail.length > 0 ? (
              <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
                {rail.map((c) => (
                  <CategoryChip
                    key={c}
                    name={c}
                    highlighted={c === highlighted}
                    className="shrink-0"
                  />
                ))}
              </div>
            ) : null}

            <LiveBoard
              label="Sample Help24 posts"
              posts={visible}
              landedId={landedId}
              viewer={side === "need" ? "visitor" : "owner"}
            />

            <p
              id="board-status"
              aria-live="polite"
              className="mt-3 text-body-sm text-text-secondary"
            >
              {query.trim()
                ? `${visible.length} of ${totalForSide} sample posts match “${query.trim()}”.`
                : `${totalForSide} sample posts. Tap a card to see the offers on it.`}
            </p>
          </div>
        </div>

        {/* A quiet index of what the app covers — the real Category.all list,
            not a marketing subset. */}
        <p className="mt-14 max-w-3xl text-body-sm leading-relaxed text-text-secondary">
          <span className="font-medium text-text-secondary">
            {CATEGORIES.length} categories in the app —{" "}
          </span>
          {CATEGORIES.slice(0, 12)
            .map((c) => c.name)
            .join(" · ")}{" "}
          and {CATEGORIES.length - 12} more.
        </p>
      </div>
    </section>
  );
}
