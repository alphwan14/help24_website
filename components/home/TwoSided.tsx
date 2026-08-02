/**
 * One control for the two sides of the marketplace.
 *
 * It mirrors Discover's Requests / Offers filter, and flipping it changes the
 * board here AND the board in the hero — they are the same state, so the page
 * never contradicts itself. React state only; nothing is written to storage, so
 * a reload starts from "I need help" again, which is the correct default for a
 * visitor we know nothing about.
 *
 * The homepage used to carry a separate provider pitch further down. It said
 * the same things this toggle demonstrates, so it is gone; /for-providers is
 * where that argument belongs and it is one click away.
 */
"use client";

import Link from "next/link";
import { Section, SectionLabel } from "@/components/Section";
import { DemoChip } from "@/components/ds/DemoChip";
import { Glyph } from "@/components/ds/glyphs";
import { LiveBoard } from "./LiveBoard";
import { useMarketplace, type Side } from "./MarketplaceContext";

const COPY_FOR: Record<
  Side,
  { label: string; heading: string; body: string; cta: string; href: string; boardLabel: string }
> = {
  need: {
    label: "I need help",
    heading: "Post what you need. Providers come to you.",
    body: "Write the job, set a budget, and wait. Providers near you send an offer with their own price, and you pick — nobody starts work before you have agreed a number.",
    cta: "Get the app",
    href: "/download",
    boardLabel: "Sample requests on Help24",
  },
  offer: {
    label: "I offer services",
    heading: "List what you do. Jobs come to you.",
    body: "Your services sit on the same board customers browse. When a request matches what you do, you send an offer at your price — no bidding war, no lead fees, no paying to be seen.",
    cta: "Become a provider",
    href: "/for-providers",
    boardLabel: "Sample offers on Help24",
  },
};

export function TwoSided() {
  const { side, setSide, posts } = useMarketplace();
  const copy = COPY_FOR[side];

  // This section shows a still column — the hero already has one board in
  // motion, and two moving things on one page compete rather than compound.
  const wanted = side === "need" ? "request" : "offer";
  const cards = posts.filter((p) => p.type === wanted).slice(0, 4);

  return (
    <Section id="two-sided" className="border-t border-border">
      <SectionLabel>Both sides</SectionLabel>

      {/* Full-width, two equal columns on a phone — a pair of pills sized by
          their own text runs out of room at 320px, and "I offer services" is
          the longer label. From `sm` it shrinks to fit its content. */}
      <div
        className="mt-2 grid w-full max-w-md grid-cols-2 rounded-pill border border-border bg-card p-1 sm:inline-flex sm:w-auto"
        role="group"
        aria-label="Which side of the marketplace are you on?"
      >
        {(Object.keys(COPY_FOR) as Side[]).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={side === s}
            onClick={() => setSide(s)}
            className={`rounded-pill px-3 py-2.5 text-body-sm font-semibold transition-colors duration-200 sm:px-5 sm:text-body ${
              side === s ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {COPY_FOR[s].label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">{copy.heading}</h2>
          <p className="mt-4 max-w-prose text-body sm:text-body-lg text-text-secondary">
            {copy.body}
          </p>
          <Link
            href={copy.href}
            className="mt-7 inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3.5 text-body font-semibold text-white transition-opacity hover:opacity-95"
          >
            {copy.cta}
            <Glyph name="arrowRight" size={16} />
          </Link>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-section-title font-semibold text-text-primary">
              {side === "need" ? "What customers post" : "What your listing looks like"}
            </p>
            <DemoChip />
          </div>
          <LiveBoard
            still
            label={copy.boardLabel}
            posts={cards}
            viewer={side === "need" ? "visitor" : "owner"}
            height="clamp(380px, 52vh, 480px)"
          />
        </div>
      </div>
    </Section>
  );
}
