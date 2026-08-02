/**
 * The task composer — three inline steps, no route change and no modal.
 *
 * What a visitor types here is assembled into the SAME `PostCard` the board is
 * built from and dropped onto that board. That is the argument the section is
 * making: this is what your job will look like to a provider, and it took you
 * twenty seconds.
 *
 * The budget step is the only place on the site that puts a number next to a
 * category, so it is careful about where the number comes from. The guide
 * ranges are estimates for someone who has never priced this work, they say so
 * in the sentence itself, and they are not described as anything Help24 has
 * observed — because Help24 has not observed anything yet.
 *
 * No <form>. Nothing here submits anywhere; a form element would only be a
 * chance to reload the page and throw the state away.
 */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, COPY, URGENCY, kes, type UrgencyKey } from "@/lib/tokens";
import { CITIES, benchmarkSentence, budgetRange } from "@/lib/demo/seed";
import type { FeedPost } from "@/components/ds/PostCard";
import { PostCard } from "@/components/ds/PostCard";
import { CategoryChip } from "@/components/ds/CategoryChip";
import { DemoChip } from "@/components/ds/DemoChip";
import { FilterPill } from "@/components/ds/FilterPill";
import { Glyph } from "@/components/ds/glyphs";
import { Section, SectionLabel } from "@/components/Section";
import { useMarketplace } from "./MarketplaceContext";
import { useReducedMotion } from "./useReducedMotion";

/** The composed card always replaces itself, so re-running never stacks up. */
const COMPOSED_ID = "composed";

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pl-11">
      <span
        className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-body-sm font-semibold text-primary-bright"
        aria-hidden
      >
        {n}
      </span>
      <h3 className="text-h5 font-semibold text-text-primary">{title}</h3>
      {hint ? <p className="mt-1 text-body-sm text-text-secondary">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </li>
  );
}

export function TaskComposer() {
  const { addPost, setSide, setQuery } = useMarketplace();
  const reduced = useReducedMotion();

  const [text, setText] = useState("");
  const [category, setCategory] = useState<string>("Plumbing");
  const [when, setWhen] = useState<UrgencyKey>("soon");
  const [city, setCity] = useState<string>("Mombasa");
  const range = useMemo(() => budgetRange(category, city), [category, city]);
  const [budget, setBudget] = useState<number | null>(null);
  const [placed, setPlaced] = useState(false);

  // The slider sits at the middle of the guide range until it is touched, so
  // the first thing a visitor sees is a sensible number rather than zero.
  const value = budget ?? range.start;
  const fill = ((value - range.min) / (range.max - range.min)) * 100;

  const ready = text.trim().length >= 8;

  const place = () => {
    const trimmed = text.trim();
    // First sentence becomes the title, the whole thing stays as the body —
    // the same split the app's post flow makes.
    const firstStop = trimmed.search(/[.!?](\s|$)/);
    const title = (firstStop > 8 ? trimmed.slice(0, firstStop) : trimmed).slice(0, 90);

    const post: FeedPost = {
      id: COMPOSED_ID,
      type: "request",
      title,
      description: trimmed.length > title.length ? trimmed : "",
      category,
      area: "Your area",
      city,
      price: value,
      pricing: range.unit === "hour" ? "hour" : range.unit === "month" ? "month" : "task",
      urgency: when,
      authorName: "You",
      // Yours, so the card shows the owner's button. No applicants are
      // invented for it — a post that arrives with three offers already on it
      // would be the exact fiction this site refuses to tell.
      owned: true,
      applicants: [],
    };

    addPost(post);
    // A request only shows on the "I need help" side; landing a card the board
    // is currently filtered away from would look like nothing happened.
    setSide("need");
    setQuery("");
    setPlaced(true);
    document
      .getElementById("board")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  const preview: FeedPost = {
    id: "preview",
    type: "request",
    title: text.trim() || "Your job, as a provider will see it",
    description: "",
    category,
    area: "Your area",
    city,
    price: value,
    pricing: range.unit === "hour" ? "hour" : range.unit === "month" ? "month" : "task",
    urgency: when,
    authorName: "You",
    owned: true,
  };

  return (
    <Section id="compose" className="border-t border-border">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <SectionLabel>Try it</SectionLabel>
          <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
            Write a job in three steps
          </h2>
          <p className="mt-3 max-w-prose text-body sm:text-body-lg text-text-secondary">
            The same three questions the app asks. Nothing is sent anywhere — this builds a card and
            puts it on the board above.
          </p>
        </div>
        <DemoChip />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <ol className="space-y-10">
          <Step n={1} title="Describe" hint="A sentence is enough. Pick the category it belongs to.">
            <label htmlFor="composer-text" className="sr-only">
              What needs doing?
            </label>
            <textarea
              id="composer-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder="e.g. The pipe under my kitchen sink is leaking and the cabinet is getting wet."
              className="w-full resize-y rounded-button border border-border bg-card px-4 py-3 text-body text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
            />
            <div
              className="no-scrollbar mt-3 flex max-h-32 flex-wrap gap-2 overflow-y-auto"
              role="group"
              aria-label="Category"
            >
              {CATEGORIES.map((c) => (
                <CategoryChip
                  key={c.name}
                  name={c.name}
                  selectable
                  selected={c.name === category}
                  onSelect={setCategory}
                />
              ))}
            </div>
          </Step>

          <Step n={2} title="When" hint="The app's three states, and the only three it has.">
            <div className="flex flex-wrap gap-2.5" role="group" aria-label="How urgent">
              {URGENCY.map((u) => {
                const active = u.key === when;
                return (
                  <button
                    key={u.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setWhen(u.key)}
                    className="inline-flex items-center gap-2 rounded-pill px-4 py-2.5 text-body font-semibold transition-colors duration-200"
                    style={{
                      // The urgency colours are the app's exact values and stay
                      // that way. An UNSELECTED chip carries them on the dot and
                      // the outline instead of the letters, because #E53935 as
                      // 14px text on its own tint is 4.3:1 — under AA, and this
                      // is a control someone has to read to answer a question.
                      // Selected, the colour becomes the fill and the label goes
                      // to the page black, which is 8:1 or better on all three.
                      color: active ? "var(--bg-dark)" : "var(--text-primary)",
                      backgroundColor: active
                        ? `var(--${u.token})`
                        : `color-mix(in srgb, var(--${u.token}) 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, var(--${u.token}) ${active ? 100 : 35}%, transparent)`,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: active ? "var(--bg-dark)" : `var(--${u.token})` }}
                      aria-hidden
                    />
                    {u.label}
                  </button>
                );
              })}
            </div>
          </Step>

          <Step n={3} title="Budget" hint="What you expect to pay. Providers can still quote above or below it.">
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="City">
              {CITIES.map((c) => (
                <FilterPill key={c} label={c} active={c === city} onClick={() => setCity(c)} />
              ))}
            </div>

            <div className="rounded-card border border-border bg-card p-4">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="composer-budget" className="text-body-sm text-text-secondary">
                  Your budget
                </label>
                <output htmlFor="composer-budget" className="text-h4 font-bold text-money">
                  {kes(value)}
                  {range.unit === "hour" ? " /hr" : range.unit === "month" ? " /mo" : ""}
                </output>
              </div>
              <input
                id="composer-budget"
                type="range"
                className="h24-range mt-2"
                min={range.min}
                max={range.max}
                step={range.step}
                value={value}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ ["--fill" as string]: `${fill}%` }}
                aria-describedby="budget-benchmark"
                aria-valuetext={kes(value)}
              />
              <div className="flex justify-between text-label-md text-text-secondary">
                <span>{kes(range.min)}</span>
                <span>{kes(range.max)}</span>
              </div>
              {/*
                aria-live so a screen-reader user hears the guidance update as
                they drag, rather than discovering it only if they go looking.
              */}
              <p
                id="budget-benchmark"
                aria-live="polite"
                className="mt-3 border-t border-border pt-3 text-body-sm text-text-secondary"
              >
                {benchmarkSentence(category, city)}
              </p>
            </div>
          </Step>
        </ol>

        {/* ── Preview + landing ────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-label-md font-medium uppercase tracking-wider text-text-secondary">
            Your card
          </p>
          <PostCard post={preview} />

          <button
            type="button"
            onClick={place}
            disabled={!ready}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-button bg-primary px-6 py-3.5 text-body font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Put it on the board
            <Glyph name="arrowRight" size={16} />
          </button>
          {!ready ? (
            <p className="mt-2 text-body-sm text-text-secondary">
              Write a line about the job to continue.
            </p>
          ) : null}

          {placed ? (
            <div
              role="status"
              className="mt-5 rounded-card border border-border bg-card p-4"
            >
              <p className="flex items-start gap-2 text-body font-semibold text-text-primary">
                <Glyph name="check" size={18} className="mt-0.5 shrink-0 text-money" />
                Your task is ready. Get the app to publish it.
              </p>
              <p className="mt-2 text-body-sm text-text-secondary">
                It is sitting at the top of the board above. Publishing it for real — and receiving
                offers on it — happens in the app.
              </p>
              <Link
                href="/download"
                className="mt-4 inline-flex items-center gap-2 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95"
              >
                Get the app to {COPY.post.toLowerCase()} it
                <Glyph name="arrowRight" size={16} />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
