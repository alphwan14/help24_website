import { AuthChrome } from "../AuthChrome";

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
    <AuthChrome>
      <div
        className="w-full animate-pulse rounded-card border border-border bg-card p-6 shadow-card sm:p-8"
        role="status"
        aria-label="Finishing up"
      >
        <div className="h-10 w-10 rounded-badge bg-border/60" aria-hidden />
        <div className="mt-5 h-6 w-2/3 rounded bg-border/60" aria-hidden />
        <div className="mt-4 h-4 w-full rounded bg-border/40" aria-hidden />
        <div className="mt-2 h-4 w-5/6 rounded bg-border/40" aria-hidden />
        <div className="mt-5 h-16 w-full rounded-button bg-border/30" aria-hidden />
        <div className="mt-7 flex flex-col gap-3 sm:flex-row" aria-hidden>
          <div className="h-11 w-full rounded-button bg-border/60 sm:w-40" />
          <div className="h-11 w-full rounded-button bg-border/40 sm:w-36" />
        </div>
      </div>
    </AuthChrome>
  );
}
