/**
 * What an inbound identity link is asking for, decided from the query string
 * alone.
 *
 * WHY THIS IS A SEPARATE FILE
 * ---------------------------
 * Everything here is the security-relevant half of the action handler: which
 * actions Help24 will perform, what counts as a link too broken to act on, and
 * where a finished action is allowed to send the user. The other half —
 * calling the identity service, rendering a form — needs a browser and a React
 * tree to exercise. This half needs neither, so it is written as pure
 * functions over a query string and covered by tests that run in a bare Node
 * process, with no test framework and no new dependency.
 *
 * That split is the point. The properties worth defending are decidable from
 * the URL: an unknown `mode` must not be guessed at, a missing `oobCode` must
 * not reach the identity service, and no value a stranger can put in the link
 * may influence where the user is sent afterwards. All three are asserted in
 * `tests/action-request.test.ts`.
 *
 * WHAT IS DELIBERATELY NOT READ
 * -----------------------------
 * `continueUrl`, `apiKey`, `lang`, and anything else the provider appends. A
 * real link carries `continueUrl=https://help24.co.ke/auth/continue` because
 * that is what the app asks for in `ActionCodeSettings`, but a link is a
 * string in an email — anyone can send one, and the value is whatever they
 * typed. Reading it to decide a redirect would make this page an open redirect
 * on the one domain a user has just been told to trust. So it is not read at
 * all: the destination is built by `continueHref` in ../continue/outcome.ts
 * from the mode, and the mode is one of four words.
 *
 * Not validated against an allow-list, either. Validation is a filter someone
 * has to keep correct forever; ignoring the parameter is a property that
 * cannot rot.
 *
 * THIS FILE IMPORTS NOTHING, DELIBERATELY
 * ---------------------------------------
 * That is what lets `node --test` load it directly. One import of a module
 * that reaches React, Next or the identity SDK would put the whole toolchain
 * between these rules and the tests that check them.
 */

/** The actions Help24 performs on this page. */
export type Mode =
  | "resetPassword"
  | "verifyEmail"
  | "recoverEmail"
  | "verifyAndChangeEmail";

export type ActionRequest =
  /** A supported action with a code to spend on it. */
  | { readonly kind: "run"; readonly mode: Mode; readonly oobCode: string }
  /** `mode` or `oobCode` absent — there is nothing to attempt. */
  | { readonly kind: "malformed" }
  /** A `mode` the provider supports and Help24 does not, including `signIn`. */
  | { readonly kind: "unsupported" };

export function isMode(value: string): value is Mode {
  return (
    value === "resetPassword" ||
    value === "verifyEmail" ||
    value === "recoverEmail" ||
    value === "verifyAndChangeEmail"
  );
}

/**
 * Classify a link's query string.
 *
 * Total: every input, including `""`, produces exactly one of the three shapes
 * above. Nothing throws, because the input is a string from someone's email
 * client and a thrown error here would render the blank page a locked-out user
 * cannot recover from.
 *
 * A repeated parameter yields the FIRST value, which is `URLSearchParams.get`'s
 * behaviour and the right one: `?mode=verifyEmail&mode=resetPassword` is a
 * malformed link, not a choice, and taking the first makes the answer
 * deterministic rather than dependent on ordering.
 */
export function parseActionRequest(search: string): ActionRequest {
  const params = new URLSearchParams(search);
  const mode = params.get("mode");
  const oobCode = params.get("oobCode");

  // Blank is the same as absent. An email client that wraps a long link can
  // deliver `oobCode=` with nothing after it, and sending that to the identity
  // service would spend a round trip to be told what is already obvious here.
  if (!mode || !oobCode) return { kind: "malformed" };
  if (!isMode(mode)) return { kind: "unsupported" };

  return { kind: "run", mode, oobCode };
}

