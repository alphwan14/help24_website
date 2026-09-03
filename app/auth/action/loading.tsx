import { SitePage } from "@/components/SitePage";

/**
 * Shown while the route segment loads.
 *
 * The page itself is static, so this is not on the critical path of a link
 * opened from an email — the shell is already built. It covers client-side
 * navigation into the route, and it holds the exact shape of the card that
 * follows so nothing jumps when the handler mounts and starts checking.
 *
 * The in-flight state that users actually see — "checking your link" — belongs
 * to the handler, not here, because only the handler knows when the identity
 * round-trip finishes.
 */
export default function Loading() {
  return (
    <SitePage>
      <section className="relative overflow-hidden">
        <div className="bg-atmosphere pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-4 py-20 sm:px-6"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Loading…</span>
          <div
            className="w-full animate-pulse rounded-card border border-border bg-card p-6 shadow-card sm:p-10"
            aria-hidden
          >
            <div className="h-14 w-14 rounded-badge bg-border/60" />
            <div className="mt-6 h-3 w-24 rounded bg-border/60" />
            <div className="mt-4 h-8 w-3/4 rounded bg-border/60" />
            <div className="mt-5 h-4 w-full rounded bg-border/40" />
            <div className="mt-2 h-4 w-5/6 rounded bg-border/40" />
          </div>
        </div>
      </section>
    </SitePage>
  );
}
