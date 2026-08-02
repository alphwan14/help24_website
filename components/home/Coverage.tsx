/**
 * Coverage.
 *
 * This replaces "Now live across Kenya", which was a claim nobody could back:
 * vague enough to sound impressive and specific enough to be wrong. What is
 * true and checkable is named instead — three cities, and the categories this
 * sandbox actually contains in each.
 *
 * THE MAP IS REAL. The outline is the national boundary from OpenStreetMap
 * data (see lib/kenya.ts), not a shape drawn from memory, and the pins are
 * projected from the cities' real coordinates. The labels are HTML positioned
 * over the SVG rather than <text> inside it, so they stay crisp at any size,
 * carry a proper focus ring, and give a finger something bigger than a 3px dot
 * to hit.
 */
"use client";

import { useState } from "react";
import { Section, SectionLabel } from "@/components/Section";
import { CategoryChip } from "@/components/ds/CategoryChip";
import { DemoChip } from "@/components/ds/DemoChip";
import { CITY_PINS, categoriesInCity } from "@/lib/demo/seed";
import { KENYA_PATH, KENYA_VIEWBOX, projectKE } from "@/lib/kenya";

const PINS = CITY_PINS.map((p) => ({ ...p, ...projectKE(p.lon, p.lat) }));

export function Coverage() {
  const [pinned, setPinned] = useState<string>("Mombasa");
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? pinned;
  const entry = PINS.find((c) => c.city === active) ?? PINS[0];

  return (
    <Section id="coverage" className="border-t border-border">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Where</SectionLabel>
          <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
            Mombasa, Nairobi and Kisumu first
          </h2>
          <p className="mt-3 max-w-prose text-body sm:text-body-lg text-text-secondary">
            The app carries every Kenyan city, all 47 county headquarters and the neighbourhoods of
            the big urban centres — but these three are where the launch effort is going, and where
            the sample posts on this page come from.
          </p>
        </div>
        <DemoChip title="The categories listed here are the ones in this page's sample data — not a count of providers available in that city." />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:items-center md:gap-14 lg:gap-20">
        <div
          className="relative mx-auto w-full max-w-[17rem] sm:max-w-xs"
          style={{ aspectRatio: `${KENYA_VIEWBOX.width} / ${KENYA_VIEWBOX.height}` }}
          onMouseLeave={() => setHovered(null)}
        >
          <svg
            viewBox={`0 0 ${KENYA_VIEWBOX.width} ${KENYA_VIEWBOX.height}`}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Map of Kenya with Kisumu, Nairobi and Mombasa marked"
          >
            <path
              d={KENYA_PATH}
              fill="color-mix(in srgb, var(--primary) 12%, transparent)"
              stroke="color-mix(in srgb, var(--primary) 55%, transparent)"
              strokeWidth={0.6}
              strokeLinejoin="round"
            />
            {PINS.map((p) => (
              <g key={p.city}>
                {p.city === active ? (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={5}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth={0.8}
                    opacity={0.55}
                  />
                ) : null}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.city === active ? 2.6 : 1.9}
                  fill={p.city === active ? "var(--primary-bright)" : "var(--primary)"}
                  className="transition-all duration-200"
                />
              </g>
            ))}
          </svg>

          {/* Labels and hit areas, in HTML so they are legible and tappable. */}
          {PINS.map((p) => (
            <button
              key={p.city}
              type="button"
              aria-pressed={pinned === p.city}
              onClick={() => setPinned(p.city)}
              onMouseEnter={() => setHovered(p.city)}
              onFocus={() => setHovered(p.city)}
              onBlur={() => setHovered(null)}
              className={`absolute z-10 whitespace-nowrap rounded-tag px-2 py-1.5 text-label-md font-semibold transition-colors ${
                p.city === active
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              style={{
                left: `${(p.x / KENYA_VIEWBOX.width) * 100}%`,
                top: `${(p.y / KENYA_VIEWBOX.height) * 100}%`,
                // Centred vertically on the dot, and pushed clear of it on the
                // side that has room — Mombasa sits in the bottom-right corner,
                // so its label goes left or it hangs off the map.
                transform:
                  p.side === "right"
                    ? "translate(0.5rem, -50%)"
                    : "translate(calc(-100% - 0.5rem), -50%)",
              }}
            >
              {p.city}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="min-h-[13rem]">
          <h3 className="text-h4 font-semibold text-text-primary sm:text-h3">{entry.city}</h3>
          <p className="mt-1 text-body text-text-secondary">{entry.blurb}</p>
          <p className="mt-6 text-label-md font-medium uppercase tracking-wider text-text-secondary">
            Categories in this sample
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoriesInCity(entry.city).map((c) => (
              <CategoryChip key={c} name={c} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
