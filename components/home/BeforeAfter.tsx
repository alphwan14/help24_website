/**
 * Before / with Help24 — one switch, one frame, same width.
 *
 * This replaces the old "Sound familiar?" section: four cards of abstract
 * complaints behind `!` `?` `…` glyphs that read as placeholder art nobody
 * came back to finish. The problem is not hard to state — you ask a relative
 * for a number, the number does not answer, and the price changes when he
 * arrives — so the section states it, in the medium it actually happens in.
 *
 * No scroll-jacking: the switch is a switch. Scrolling scrolls the page.
 */
"use client";

import { useState } from "react";
import { ApplicantList, PostCard } from "@/components/ds/PostCard";
import { DemoChip } from "@/components/ds/DemoChip";
import { Glyph } from "@/components/ds/glyphs";
import { Section, SectionLabel } from "@/components/Section";
import { POSTS } from "@/lib/demo/seed";
import { kes } from "@/lib/tokens";

type Mode = "before" | "after";

/**
 * The thread. Deliberately mundane and deliberately undated — the point is the
 * sequence, and a timestamp would be inventing a day this happened on.
 */
const THREAD: { from: "you" | "them"; text: string; unanswered?: boolean }[] = [
  { from: "you", text: "Aunty, do you still have the number for that plumber who did your sink?" },
  { from: "them", text: "Let me look. I think I deleted it when I changed phone 🙈" },
  { from: "you", text: "Anyone else? The cabinet is getting wet" },
  { from: "them", text: "Try Kevin. He did my neighbour's tap. 07XX XXX XXX" },
  { from: "you", text: "Hi Kevin, my sink is leaking in Bamburi. How much?" },
  { from: "you", text: "Hello?", unanswered: true },
];

export function BeforeAfter() {
  const [mode, setMode] = useState<Mode>("before");
  const post = POSTS.find((p) => (p.applicants?.length ?? 0) >= 3)!;
  const quotes = post.applicants ?? [];
  const agreed = Math.min(...quotes.map((q) => q.price));

  return (
    <Section id="before-after" className="border-t border-border">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>The difference</SectionLabel>
          <h2 className="text-h3 font-semibold text-text-primary sm:text-h2">
            One leaking sink, two ways to solve it
          </h2>
        </div>
        <div
          className="grid w-full max-w-xs grid-cols-2 rounded-pill border border-border bg-card p-1 sm:inline-flex sm:w-auto sm:max-w-none"
          role="group"
          aria-label="Before Help24, or with Help24"
        >
          {(["before", "after"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-pill px-3 py-2.5 text-body-sm font-semibold transition-colors duration-200 sm:px-5 sm:text-body ${
                mode === m ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {m === "before" ? "Before" : "With Help24"}
            </button>
          ))}
        </div>
      </div>

      {/* One frame, one width. Switching must not move anything around it. */}
      <div className="mt-8 rounded-card border border-border bg-surface p-3 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-section-title font-semibold text-text-primary">
            {mode === "before"
              ? "Asking around, and hoping"
              : "Three offers, and a price before anyone starts"}
          </p>
          {/* On both sides: the thread is written, the board is seed data, and
              neither is a transcript of anything that happened. */}
          <DemoChip title="An illustration, not a transcript. The thread and the posts are both written for this page." />
        </div>

        <div className="mx-auto min-h-[26rem] max-w-xl">
          {mode === "before" ? <Thread /> : <WithHelp24 post={post} agreed={agreed} />}
        </div>

        <p className="mx-auto mt-5 max-w-xl border-t border-border pt-4 text-body-sm text-text-secondary">
          {mode === "before" ? (
            <>
              You end up with one number, no idea what the job should cost, and a quote that can
              change once he has seen it.
            </>
          ) : (
            <>
              Three providers, three prices, and the money is held until the work is done. The quote
              you accept is the quote you pay.
            </>
          )}
        </p>
      </div>
    </Section>
  );
}

function Thread() {
  return (
    <ol className="space-y-2.5">
      {THREAD.map((m, i) => (
        <li key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[80%] rounded-card px-3.5 py-2.5 text-body ${
              m.from === "you"
                ? "rounded-br-tag bg-card text-text-primary"
                : "rounded-bl-tag border border-border bg-bg-dark text-text-secondary"
            }`}
          >
            {m.text}
            {m.unanswered ? (
              <span className="mt-2 flex items-center gap-1.5 text-label-md text-text-secondary">
                <Glyph name="check" size={12} />
                Delivered — no reply
              </span>
            ) : null}
          </div>
        </li>
      ))}
      <li className="pt-2 text-center text-body-sm text-text-secondary">
        Two days later, he arrives and says it will be more than he said on the phone.
      </li>
    </ol>
  );
}

function WithHelp24({ post, agreed }: { post: React.ComponentProps<typeof PostCard>["post"]; agreed: number }) {
  return (
    <div>
      <PostCard post={post} expanded>
        <ApplicantList applicants={post.applicants ?? []} />
      </PostCard>
      <p className="mt-4 flex items-center justify-center gap-2 rounded-button border border-border bg-card px-4 py-3 text-body font-semibold text-text-primary">
        <Glyph name="lock" size={16} className="text-warning" />
        Agreed at <span className="text-money">{kes(agreed)}</span>, held until the job is done
      </p>
    </div>
  );
}
