/**
 * What to show on /auth/continue, decided from the query string alone.
 *
 * WHERE THIS PAGE SITS IN THE REAL FLOW
 * -------------------------------------
 * The Flutter app sends `ActionCodeSettings.url = https://help24.co.ke/auth/continue`
 * with `handleCodeInApp: false` (see mobile-app/lib/config/app_urls.dart and
 * auth_service.dart), so this URL is what the action is told to hand off to
 * once it is finished.
 *
 * The action itself is performed at `/auth/action` — Help24's own handler,
 * which the identity console's "Custom action URL" points at. It consumes the
 * one-time code, and only after that succeeds does it link the user here, as
 * `?s=<mode>`. (Before that handler existed the provider's own hosted page did
 * the consuming and offered the same hand-off; either way this page is the
 * step AFTER the credential has been spent.)
 *
 * So the ordinary arrival here is a page-view with no one-time code attached,
 * and the honest thing to say is "that worked — here is what to do next".
 * This page performs no verification, holds no credential and calls no
 * identity API. It is the landing strip, not the runway.
 *
 * THE ONE CASE THAT MUST NOT BE PAPERED OVER
 * ------------------------------------------
 * If a one-time code (`oobCode`) is still attached, the hand-off did NOT go
 * through the provider's handler — the code has not been consumed by anyone,
 * so nothing has been reset, confirmed or restored. Claiming success there
 * would be a lie the user acts on: they would close the tab believing their
 * password had changed.
 *
 * That is also exactly what would happen if someone later repoints the
 * console's "Custom action URL" at THIS page instead of `/auth/action`. This
 * file refuses that quietly and visibly instead: [attention], not [done]. If
 * you are reading this because the page "wrongly" says it could not finish,
 * the fix is upstream — point the console back at `/auth/action`. Do not make
 * this branch report success.
 *
 * HOW THE INCOMING PARAMETERS ARE CONTAINED
 * -----------------------------------------
 * Every parameter the provider may attach — `oobCode`, `apiKey`, `continueUrl`,
 * `lang`, and any error string — is read ONCE, here, and reduced to a single
 * [OutcomeKey]. The page then redirects to the canonical `?s=<key>` form and
 * renders from that alone.
 *
 * That redirect is not cosmetic. A server-rendered page serialises its props
 * into the streamed payload, so simply *not displaying* a value still leaves it
 * in the HTML that was sent — and an unconsumed one-time code sitting in the
 * page source, in browser history and in the `Referer` of every outbound link
 * on the page is exactly the disclosure this page exists to avoid. Reducing to
 * a key first means there is nothing left to leak: the only value that survives
 * the redirect is one of the fixed strings below.
 */

/** A single query value, normalised out of Next's `string | string[]`. */
export type QueryValue = string | string[] | undefined;
export type Query = Record<string, QueryValue>;

export type OutcomeTone = "done" | "attention";

/**
 * The closed set of things this page can say. The canonical URL carries one of
 * these and nothing else, so this type IS the leak boundary — a value that is
 * not listed here cannot reach the rendered page.
 */
export type OutcomeKey =
  | "generic"
  | "resetPassword"
  | "verifyEmail"
  | "recoverEmail"
  | "verifyAndChangeEmail"
  | "unsupported"
  | "incomplete";

/** The query parameter the canonical URL uses. Short, and not provider-shaped. */
export const OUTCOME_PARAM = "s";

export interface OutcomeAction {
  readonly label: string;
  readonly href: string;
}

export interface Outcome {
  readonly key: OutcomeKey;
  readonly tone: OutcomeTone;
  readonly title: string;
  /** The one sentence that says what happened. */
  readonly body: string;
  /** The one sentence that says what to do now. */
  readonly next: string;
  readonly primary: OutcomeAction;
  readonly secondary: OutcomeAction;
}

/** First value only — a repeated parameter is a malformed link, not a list. */
function first(value: QueryValue): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (Array.isArray(value)) return first(value[0]);
  return null;
}

const BACK_HOME: OutcomeAction = { label: "Back to Help24", href: "/" };
const GET_APP: OutcomeAction = { label: "Get the app", href: "/download" };
const HELP_CENTRE: OutcomeAction = { label: "Visit Help Centre", href: "/help" };
const CONTACT: OutcomeAction = { label: "Contact support", href: "/support" };

/** Sign in again in the app — the next step after every completed action. */
const RETURN_TO_APP = "Open Help24 on your phone and sign in to carry on.";

/** Every outcome, keyed. The one table both entry paths read. */
const OUTCOMES: Record<OutcomeKey, Outcome> = {
  generic: {
    key: "generic",
    tone: "done",
    title: "You're all set",
    body: "That's been taken care of. There is nothing else to do on this page.",
    next: RETURN_TO_APP,
    primary: BACK_HOME,
    secondary: GET_APP,
  },
  resetPassword: {
    key: "resetPassword",
    tone: "done",
    title: "Your password has been changed",
    body: "The old password no longer works, on this or any other device.",
    next: RETURN_TO_APP,
    primary: BACK_HOME,
    secondary: GET_APP,
  },
  verifyEmail: {
    key: "verifyEmail",
    tone: "done",
    title: "Your email address is confirmed",
    body:
      "This is now the address we use to get you back into your account if " +
      "you are ever locked out.",
    next: RETURN_TO_APP,
    primary: BACK_HOME,
    secondary: GET_APP,
  },
  recoverEmail: {
    key: "recoverEmail",
    tone: "done",
    title: "Your email address has been restored",
    body:
      "The change to your account email has been reversed. If you did not ask " +
      "for it, reset your password now — someone else may have had access.",
    next: RETURN_TO_APP,
    primary: BACK_HOME,
    secondary: GET_APP,
  },
  verifyAndChangeEmail: {
    key: "verifyAndChangeEmail",
    tone: "done",
    title: "Your email address has been updated",
    body: "Help24 will use this address for signing in and for account recovery.",
    next: RETURN_TO_APP,
    primary: BACK_HOME,
    secondary: GET_APP,
  },
  unsupported: {
    key: "unsupported",
    tone: "attention",
    title: "This link isn't one we can open here",
    body: "We couldn't tell what this link was for, so we haven't changed anything on your account.",
    next: "Open the most recent Help24 email and use the link there, or start again from the app.",
    primary: HELP_CENTRE,
    secondary: CONTACT,
  },
  incomplete: {
    key: "incomplete",
    tone: "attention",
    title: "We couldn't complete that link",
    body:
      "This link hasn't been used yet, so nothing on your account has changed. " +
      "That usually means it was opened in an unusual way, or it has already expired.",
    next:
      "Links last a short time for your security. Ask for a fresh one from " +
      "the Help24 app and open it straight from your email.",
    primary: HELP_CENTRE,
    secondary: CONTACT,
  },
};

/** The provider action names whose completion this page can report. */
const COMPLETED_MODES: readonly OutcomeKey[] = [
  "resetPassword",
  "verifyEmail",
  "recoverEmail",
  "verifyAndChangeEmail",
];

function isCompletedMode(value: string): value is OutcomeKey {
  return (COMPLETED_MODES as readonly string[]).includes(value);
}

/** Reads one parameter, already trimmed, or null when absent or blank. */
type Getter = (name: string) => string | null;

/**
 * Reduce a provider hand-off to one outcome key.
 *
 * Pure and total: every input produces exactly one key, and no input can
 * produce a key that was not written above.
 *
 * Written against a getter rather than a concrete shape because the same
 * decision has to be made in two runtimes — the middleware sees a
 * `URLSearchParams`, the page sees Next's record — and the two must never be
 * able to disagree about what a link means.
 */
function keyFrom(get: Getter): OutcomeKey {
  const code = get("oobCode");
  // Some hand-offs carry a provider error rather than a code. Its VALUE is
  // never read beyond checking that one is present.
  const failed = get("error") !== null;

  // An unconsumed code, or an explicit failure: nothing has happened yet.
  if (code !== null || failed) return "incomplete";

  const mode = get("mode");
  if (mode === null) return "generic";
  if (isCompletedMode(mode)) return mode;

  // A mode we do not recognise — including `signIn`, which belongs to an
  // email-link flow this app does not use. Say so rather than inventing a
  // success we cannot vouch for.
  return "unsupported";
}

/** Hand-off key from Next's page `searchParams` record. */
export function keyFromHandoff(query: Query): OutcomeKey {
  return keyFrom((name) => first(query[name]));
}

/** Hand-off key from a `URLSearchParams` — the middleware's view of the URL. */
export function keyFromSearchParams(params: URLSearchParams): OutcomeKey {
  return keyFrom((name) => {
    const value = params.get(name);
    return value !== null && value.trim() !== "" ? value.trim() : null;
  });
}

/**
 * The canonical URL for this page, carrying one outcome key.
 *
 * The ONE place that knows how to address `/auth/continue`. The action handler
 * links here after a completed action, and it must not have to know the
 * parameter name — a second spelling of `?s=` would produce a link that this
 * route's own middleware treats as a foreign hand-off and rewrites, which is a
 * loop nobody would look for.
 *
 * Relative and internal BY CONSTRUCTION, and that is the security property.
 * The only input is a key from the closed set above, so no value from an
 * inbound link — `continueUrl` above all — can reach the returned string. An
 * open redirect here would be Help24 vouching for wherever an emailed link
 * decided to send someone.
 */
export function continueHref(key: OutcomeKey): string {
  return `/auth/continue?${OUTCOME_PARAM}=${key}`;
}

/** The outcome for a canonical `?s=` value; anything unknown reads as generic. */
export function outcomeFor(value: QueryValue): Outcome {
  const key = first(value);
  if (key !== null && Object.prototype.hasOwnProperty.call(OUTCOMES, key)) {
    return OUTCOMES[key as OutcomeKey];
  }
  return OUTCOMES.generic;
}

/**
 * True when the URL is already in canonical form and can be rendered as-is:
 * either bare, or carrying only the outcome parameter.
 *
 * This is what stops the redirect below from looping — a canonical URL never
 * redirects, and every non-canonical URL redirects to one that is.
 */
export function isCanonical(query: Query): boolean {
  return canonical(Object.keys(query));
}

/** As [isCanonical], for the middleware's `URLSearchParams`. */
export function isCanonicalSearchParams(params: URLSearchParams): boolean {
  return canonical(Array.from(params.keys()));
}

function canonical(keys: readonly string[]): boolean {
  if (keys.length === 0) return true;
  return keys.length === 1 && keys[0] === OUTCOME_PARAM;
}
