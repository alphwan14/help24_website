/**
 * The last word: a date and one field.
 *
 * TWO THINGS THIS DELIBERATELY DOES NOT DO, carried over unchanged from the
 * previous build because they were right:
 *
 *   NO COUNTDOWN. A clock ticking toward 19 October is a pressure device. The
 *   date on its own is the whole message.
 *
 *   NO SIGNUP COUNT UNLESS IT IS REAL. The API returns null until
 *   WAITLIST_COUNT_URL is configured, and null renders nothing — not "join
 *   1,200 others", not a placeholder, not a number rounded up from hope. When
 *   the endpoint exists the figure appears on its own.
 */
"use client";

import { useEffect, useState } from "react";
import { LAUNCH, SITE } from "@/lib/site";
import { Glyph } from "@/components/ds/glyphs";

type State = "idle" | "sending" | "done" | "error" | "unconfigured";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<State>("idle");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d: { count: number | null }) => {
        if (alive && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {
        /* No count is the default state, not an error worth showing. */
      });
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    // A native submit would reload the page and throw away everything the
    // visitor has built on it. This form never navigates.
    e.preventDefault();
    if (!email.trim() || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const body = (await res.json()) as { ok?: boolean; reason?: string };
      if (body.ok) {
        setState("done");
        setEmail("");
      } else {
        setState(body.reason === "unconfigured" ? "unconfigured" : "error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <section id="launch" className="scroll-mt-20 border-t border-border bg-surface py-section sm:scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3 py-1.5 text-label-md font-medium text-text-secondary">
            <Glyph name="timer" size={13} className="text-primary-bright" />
            Launching{" "}
            <time dateTime={LAUNCH.iso} className="font-semibold text-text-primary">
              {LAUNCH.label}
            </time>
          </p>

          <h2 className="mt-5 text-[clamp(1.6rem,4.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary">
            Be there on day one.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-body sm:text-body-lg text-text-secondary">
            One email on launch day with the download link. Nothing before it.
          </p>

          {state === "done" ? (
            <p
              role="status"
              className="mx-auto mt-8 inline-flex items-center gap-2 rounded-button border border-money/40 bg-money/10 px-5 py-3.5 text-body font-semibold text-text-primary"
            >
              <Glyph name="check" size={18} className="text-money" />
              You are on the list. See you on {LAUNCH.short}.
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="relative mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <label htmlFor="waitlist-email" className="sr-only">
                Your email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="min-w-0 flex-1 rounded-button border border-border bg-card px-4 py-3.5 text-body text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
              />
              {/*
                Not `display:none` — some bots skip hidden fields, and the point
                is that a bot fills this in. Clipped to a 1px box inside the
                form rather than pushed to a negative offset: a `left:-9999px`
                element sits outside the page box, which is a horizontal
                overflow bug waiting to happen (and does happen in RTL). Out of
                the tab order and out of the accessibility tree, so no person
                ever meets it.
              */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-0 top-0 h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]"
              />
              <button
                type="submit"
                disabled={state === "sending"}
                className="shrink-0 rounded-button bg-primary px-6 py-3.5 text-body font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
              >
                {state === "sending" ? "Adding…" : "Join the waitlist"}
              </button>
            </form>
          )}

          {state === "error" ? (
            <p role="alert" className="mt-3 text-body-sm text-error">
              We could not save that. Try again, or email{" "}
              <a href={`mailto:${SITE.supportEmail}`} className="underline">
                {SITE.supportEmail}
              </a>
              .
            </p>
          ) : null}

          {state === "unconfigured" ? (
            <p role="alert" className="mt-3 text-body-sm text-warning">
              The waitlist is not connected yet. Email{" "}
              <a href={`mailto:${SITE.supportEmail}`} className="underline">
                {SITE.supportEmail}
              </a>{" "}
              and we will add you by hand.
            </p>
          ) : null}

          {/* Rendered only when the number is real. See the file header. */}
          {count !== null ? (
            <p className="mt-4 text-body-sm text-text-secondary">
              {count.toLocaleString("en-KE")} {count === 1 ? "person is" : "people are"} on the list.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
