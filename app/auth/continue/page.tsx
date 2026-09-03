import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SitePage } from "@/components/SitePage";
import { Icon } from "@/components/Icon";
import { SITE } from "@/lib/site";
import {
  isCanonical,
  keyFromHandoff,
  outcomeFor,
  OUTCOME_PARAM,
  type Query,
} from "./outcome";

/**
 * Where a Help24 password-reset or email-confirmation link lands once the
 * action itself is done.
 *
 * Until this route existed, every one of those emails pointed at a URL that
 * returned the site's 404 page — so the last thing a user saw after resetting
 * their password was "This page took a day off". The decision logic, and the
 * one case that must never be reported as success, is in ./outcome.ts.
 */

export const metadata: Metadata = {
  title: "Continue",
  description:
    "Finish signing in to Help24 after confirming your email or resetting your password.",
  // Deliberately not in SITEMAP_ROUTES and deliberately noindex: this page is
  // only ever reached from a link in someone's inbox. Indexing it would put a
  // bare "You're all set" page in search results for "Help24 password".
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE.url}/auth/continue` },
};

/**
 * Reading `searchParams` opts this route out of static generation, which is
 * correct and required — the copy depends on the link that was followed.
 */
export const dynamic = "force-dynamic";

export default function AuthContinuePage({
  searchParams,
}: {
  searchParams: Query;
}) {
  // Reduce the provider's hand-off to one word, then get rid of the hand-off.
  //
  // The redirect is a security step, not tidiness. Whatever arrives here can
  // include an unconsumed one-time code and a provider error string, and a
  // server-rendered page ships its props inside the streamed payload — so a
  // value that is never displayed is still *sent*, still lands in browser
  // history, and still rides the `Referer` of every link on this page. Cutting
  // it down to `?s=<key>` before rendering means there is nothing left to
  // disclose. `isCanonical` is what keeps this from looping.
  if (!isCanonical(searchParams)) {
    redirect(`/auth/continue?${OUTCOME_PARAM}=${keyFromHandoff(searchParams)}`);
  }

  const outcome = outcomeFor(searchParams[OUTCOME_PARAM]);
  const done = outcome.tone === "done";

  const accent = done ? "text-money" : "text-warning";
  const accentBg = done ? "bg-money/10" : "bg-warning/10";
  const accentRing = done ? "ring-money/20" : "ring-warning/20";

  return (
    <SitePage>
      <section className="relative overflow-hidden">
        <div className="bg-atmosphere pointer-events-none absolute inset-0" aria-hidden />

        <div
          className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-4 py-20 sm:px-6"
          data-outcome={outcome.key}
        >
          <div className="w-full rounded-card border border-border bg-card p-6 shadow-card sm:p-10">
            {/* Status mark */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-badge ring-8 ${accentBg} ${accentRing} ${accent}`}
            >
              <Icon name={done ? "check" : "alert"} className="h-7 w-7" />
            </div>

            <p
              className={`mt-6 text-label-md font-medium uppercase tracking-wider ${
                done ? "text-money" : "text-warning"
              }`}
            >
              {outcome.eyebrow}
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {outcome.title}
            </h1>

            <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">
              {outcome.body}
            </p>

            {/* What to do now — separated from what happened, because they are
                different questions and users read the second one first. */}
            <div className="mt-6 flex items-start gap-3 rounded-card border border-border bg-bg-dark/40 p-4">
              <span className="mt-0.5 shrink-0 text-primary-bright">
                <Icon name="phone" className="h-5 w-5" />
              </span>
              <p className="text-body text-text-secondary">{outcome.next}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={outcome.primary.href}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95"
              >
                {outcome.primary.label}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link
                href={outcome.secondary.href}
                className="inline-flex items-center justify-center gap-2 rounded-button border border-border bg-transparent px-5 py-3 text-body font-semibold text-text-primary transition-colors hover:bg-card/50"
              >
                {outcome.secondary.label}
              </Link>
            </div>
          </div>

          {/* Reassurance, and the only address on the page. Someone who
              followed an email link is entitled to know they are on the real
              Help24 and how to reach a human without going back to the app. */}
          <p className="mt-6 px-2 text-center text-body-sm text-text-tertiary">
            You&apos;re on {SITE.domain}, the official Help24 site. Didn&apos;t
            request this?{" "}
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="font-medium text-primary-bright hover:underline"
            >
              Tell us
            </a>{" "}
            and we&apos;ll secure your account.
          </p>
        </div>
      </section>
    </SitePage>
  );
}
