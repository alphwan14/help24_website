import { NextResponse, type NextRequest } from "next/server";
import {
  OUTCOME_PARAM,
  isCanonicalSearchParams,
  keyFromSearchParams,
} from "@/app/auth/continue/outcome";

/**
 * Strips an identity hand-off down to one harmless word before anything
 * renders.
 *
 * WHY THIS IS MIDDLEWARE AND NOT A `redirect()` IN THE PAGE
 * ---------------------------------------------------------
 * It was a `redirect()` in the page first, and that does not work here. The
 * route has a `loading.tsx`, which wraps it in a Suspense boundary — so Next
 * commits the HTTP response and streams the skeleton BEFORE the page component
 * runs. By the time `redirect()` is reached the status line is already sent,
 * and Next can only degrade it to a client-side navigation: HTTP 200, the
 * original query still in the payload, and the cleanup depending on JavaScript
 * that may never run.
 *
 * Measured, not assumed: with the page-level redirect in place, a request to
 * `/auth/continue?oobCode=…&apiKey=…` returned 200 with both values present in
 * the HTML.
 *
 * Middleware runs before routing, so it can still send a real 307. The page
 * therefore only ever sees `?s=<key>`, and keeps its own redirect purely as a
 * backstop for the case where this never ran.
 *
 * WHAT IS ACTUALLY BEING PROTECTED
 * --------------------------------
 * A password-reset link that has NOT been consumed is a live credential. Left
 * in the URL it goes into browser history, into the `Referer` of every outbound
 * link on the page, into any shared-device address bar, and into the HTML of a
 * page that a proxy may cache. Along with it travel the provider's project id
 * and its raw error strings — the vendor detail the whole white-label boundary
 * exists to keep away from users.
 *
 * None of that is displayed by the page. Being sent at all is the problem.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Already `/auth/continue` or `/auth/continue?s=…` — nothing to strip, and
  // returning early is what stops this from redirecting to itself forever.
  if (isCanonicalSearchParams(url.searchParams)) return NextResponse.next();

  const clean = url.clone();
  // Rebuild the query rather than deleting known keys: an allow-list survives
  // the provider adding a parameter we have never heard of, a deny-list does
  // not.
  clean.search = "";
  clean.searchParams.set(OUTCOME_PARAM, keyFromSearchParams(url.searchParams));

  // 307, not 308: what this page says depends on the link that was followed,
  // so the redirect must never be cached as permanent.
  return NextResponse.redirect(clean, 307);
}

/**
 * Scoped to the single route. Middleware that matches broadly is middleware
 * that eventually breaks something unrelated; this one has no business running
 * anywhere else on the site.
 */
export const config = {
  matcher: "/auth/continue",
};
