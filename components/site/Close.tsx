/**
 * The last word: a date, one field, and the fork.
 *
 * WHY THIS IS ONE SECTION AND NOT TWO. The page used to end with a dual CTA —
 * two bordered panels, "Need something done?" and "Have a skill?" — and then a
 * waitlist section immediately below it. Both were asking for the same click
 * from the same person at the same moment, and the first of them repeated the
 * hero's two buttons word for word. Two closing sections do not double the
 * conversion; they make the page look unsure what it is asking for.
 *
 * So there is one ask — leave an address, because that is the only thing anyone
 * can actually do before launch — and the fork sits underneath it as two lines
 * of type rather than two cards. Nothing was dropped: both audiences are still
 * addressed, and both links are still here.
 *
 * TWO THINGS THIS DELIBERATELY DOES NOT DO, carried over unchanged because they
 * were right:
 *
 *   NO COUNTDOWN. A clock ticking toward 19 October is a pressure device. The
 *   date on its own is the whole message.
 *
 *   NO SIGNUP COUNT UNLESS IT IS REAL. The API returns null until
 *   WAITLIST_COUNT_URL is configured, and null renders nothing — not "join 1,200
 *   others", not a placeholder, not a number rounded up from hope.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LAUNCH, SITE } from "@/lib/site";
import { Glyph } from "@/components/ds/glyphs";

type State = "idle" | "sending" | "done" | "error" | "unconfigured";

export function Close() {
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
    <section id="launch" className="scroll-mt-24 py-section">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-label-md font-semibold uppercase tracking-[0.22em] text-text-tertiary">
            Launching{" "}
            <time dateTime={LAUNCH.iso} className="text-text-secondary">
              {LAUNCH.label}
            </time>
          </p>

          <h2 className="mt-6 text-[clamp(1.9rem,5.2vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-text-primary">
            Be there on day one.
          </h2>
          <p className="mt-4 max-w-md text-body-lg leading-relaxed text-text-secondary">
            One email on launch day with the download link. Nothing before it.
          </p>

          {state === "done" ? (
            <p
              role="status"
              className="mt-8 flex items-center gap-2.5 text-body-lg font-semibold text-money"
            >
              <Glyph name="check" size={18} />
              You are on the list. See you on {LAUNCH.short}.
            </p>
          ) : (
            /* A rule, not a bordered box — the same treatment the hero's field
               uses, so the two inputs on this page are the same input. */
            <form onSubmit={submit} className="relative mt-8 max-w-md">
              <label htmlFor="waitlist-email" className="sr-only">
                Your email address
              </label>
              <div className="flex items-center gap-3 border-b-2 border-border-strong pb-2.5 focus-within:border-primary">
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full min-w-0 bg-transparent text-body-lg text-text-primary caret-primary placeholder:text-text-tertiary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="shrink-0 text-body-lg font-semibold text-primary-bright underline-offset-4 hover:underline disabled:opacity-50"
                >
                  {state === "sending" ? "Adding…" : "Join"}
                </button>
              </div>
              {/*
                Not `display:none` — some bots skip hidden fields, and the point
                is that a bot fills this in. Clipped to a 1px box inside the form
                rather than pushed to a negative offset: a `left:-9999px` element
                sits outside the page box, which is a horizontal-overflow bug
                waiting to happen (and does happen in RTL). Out of the tab order
                and out of the accessibility tree, so no person ever meets it.
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

        {/* ── The fork ───────────────────────────────────────────────────── */}
        <div className="mt-16 grid gap-8 border-t border-border pt-10 sm:mt-20 sm:grid-cols-2 sm:gap-12">
          <Path
            eyebrow="Customers"
            title="Need something done?"
            line="Post it in a minute. Offers come to you."
            href="/download"
            cta="Get Help"
          />
          <Path
            eyebrow="Providers"
            title="Have a skill?"
            line="Your work sits on the same board. No lead fees, no paying to be seen."
            href="/for-providers"
            cta="Earn with Help24"
          />
        </div>
      </div>
    </section>
  );
}

/** One side of the fork. Type and a link — no panel, no border, no fill. */
function Path({
  eyebrow,
  title,
  line,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  line: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-label-md font-semibold uppercase tracking-[0.18em] text-text-tertiary">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-[clamp(1.35rem,3vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.025em] text-text-primary">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-body-lg text-text-secondary">{line}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 text-body-lg font-semibold text-primary-bright underline-offset-4 hover:underline"
      >
        {cta}
        <Glyph name="arrowRight" size={16} />
      </Link>
    </div>
  );
}
