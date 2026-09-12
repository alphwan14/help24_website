import { AuthChrome } from "../AuthChrome";

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
    <AuthChrome>
      <div
        className="w-full animate-pulse rounded-card border border-border bg-card p-6 shadow-card sm:p-8"
        role="status"
        aria-label="Loading"
      >
        <div className="h-10 w-10 rounded-badge bg-border/60" aria-hidden />
        <div className="mt-6 h-6 w-2/3 rounded bg-border/60" aria-hidden />
        <div className="mt-4 h-4 w-full rounded bg-border/40" aria-hidden />
        <div className="mt-2 h-4 w-5/6 rounded bg-border/40" aria-hidden />
      </div>
    </AuthChrome>
  );
}
