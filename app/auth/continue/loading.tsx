import { SitePage } from "@/components/SitePage";

/**
 * Shown while the continuation page resolves.
 *
 * The route is dynamic (it reads the query string), so there is a real render
 * on every visit. Someone arriving here has just typed a new password and is
 * waiting to be told whether it worked — a blank frame in that moment reads as
 * a failure. This holds the exact shape of the card that is about to appear so
 * nothing jumps when it does.
 */
export default function Loading() {
  return (
    <SitePage>
      <section className="relative overflow-hidden">
        <div className="bg-radial-glow pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-4 py-20 sm:px-6"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Finishing up…</span>
          <div
            className="w-full animate-pulse rounded-card border border-border bg-card p-6 shadow-card sm:p-10"
            aria-hidden
          >
            <div className="h-14 w-14 rounded-badge bg-border/60" />
            <div className="mt-6 h-3 w-24 rounded bg-border/60" />
            <div className="mt-4 h-8 w-3/4 rounded bg-border/60" />
            <div className="mt-5 h-4 w-full rounded bg-border/40" />
            <div className="mt-2 h-4 w-5/6 rounded bg-border/40" />
            <div className="mt-6 h-16 w-full rounded-card bg-border/30" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="h-12 w-full rounded-button bg-border/60 sm:w-40" />
              <div className="h-12 w-full rounded-button bg-border/40 sm:w-36" />
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
