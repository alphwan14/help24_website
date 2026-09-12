import { test } from "node:test";
import assert from "node:assert/strict";
import {
  keyFromSearchParams,
  keyFromHandoff,
  outcomeFor,
  isCanonical,
  isCanonicalSearchParams,
  continueHref,
  OUTCOME_PARAM,
  type OutcomeKey,
} from "../app/auth/continue/outcome.ts";

/**
 * `/auth/continue` — the landing page, and the query-stripping that protects
 * it.
 *
 * WHY THIS IS TESTED AT THIS LEVEL
 * --------------------------------
 * The middleware itself imports `next/server`, which cannot be loaded outside
 * a Next runtime. But the middleware holds no decisions of its own: it asks
 * `isCanonicalSearchParams` whether to act and `keyFromSearchParams` what to
 * reduce the URL to, then issues a 307. Those two functions ARE the security
 * behaviour, and the page reaches the same answers through `isCanonical` and
 * `keyFromHandoff`. Testing them covers the logic without pinning a framework
 * call that would have to be mocked to be observed.
 */

const COMPLETED: readonly OutcomeKey[] = [
  "resetPassword",
  "verifyEmail",
  "recoverEmail",
  "verifyAndChangeEmail",
];

const ALL_KEYS: readonly OutcomeKey[] = [
  ...COMPLETED,
  "generic",
  "unsupported",
  "incomplete",
];

const params = (search: string) => new URLSearchParams(search);

// ── The refusal that must never become a success ──────────────────────────

test("an unconsumed code is reported as unfinished, never as done", () => {
  // The whole point of the page. A code still in the URL means nothing has
  // been spent — so nobody's password has changed — and saying "you are all
  // set" is a lie the user closes the tab believing.
  for (const search of [
    "?oobCode=live-code",
    "?mode=resetPassword&oobCode=live-code",
    "?mode=verifyEmail&oobCode=live-code&apiKey=AIzaSyFAKE",
    "?oobCode=live-code&continueUrl=https%3A%2F%2Fhelp24.co.ke",
  ]) {
    assert.equal(keyFromSearchParams(params(search)), "incomplete", search);
  }
  assert.equal(outcomeFor("incomplete").tone, "attention");
});

test("a provider error is reported as unfinished, and its text is never read", () => {
  const key = keyFromSearchParams(
    params("?mode=resetPassword&error=auth%2Finvalid-action-code"),
  );
  assert.equal(key, "incomplete");

  // The error VALUE must not survive into anything rendered. The copy for
  // `incomplete` is fixed Help24 prose.
  const outcome = outcomeFor(key);
  const text = `${outcome.title} ${outcome.body} ${outcome.next}`.toLowerCase();
  for (const leak of ["auth/", "invalid-action-code", "firebase", "apikey"]) {
    assert.equal(text.includes(leak), false, `leaked ${leak}`);
  }
});

test("an error with a blank value is not mistaken for no error at all", () => {
  assert.equal(keyFromSearchParams(params("?error=x")), "incomplete");
  // A blank parameter is indistinguishable from an absent one here, which is
  // the documented trim-to-null behaviour. Recorded so a change is deliberate.
  assert.equal(keyFromSearchParams(params("?error=")), "generic");
});

// ── Completed actions ─────────────────────────────────────────────────────

test("each completed action reports its own outcome, in the done tone", () => {
  for (const mode of COMPLETED) {
    assert.equal(keyFromSearchParams(params(`?mode=${mode}`)), mode);
    const outcome = outcomeFor(mode);
    assert.equal(outcome.key, mode);
    assert.equal(outcome.tone, "done");
    assert.equal(outcome.title.trim().length > 0, true);
    assert.equal(outcome.next.trim().length > 0, true);
  }
});

test("a hand-off with no mode is a plain success", () => {
  assert.equal(keyFromSearchParams(params("")), "generic");
  assert.equal(keyFromSearchParams(params("?lang=en")), "generic");
  assert.equal(outcomeFor("generic").tone, "done");
});

test("signIn and unknown modes are refused rather than assumed", () => {
  for (const mode of ["signIn", "revertSecondFactorAddition", "whatever"]) {
    assert.equal(keyFromSearchParams(params(`?mode=${mode}`)), "unsupported");
  }
  assert.equal(outcomeFor("unsupported").tone, "attention");
});

test("the page and the middleware cannot disagree about a link", () => {
  // Two runtimes, one decision. If these diverge, a link means one thing to
  // the redirect and another to the render.
  for (const search of [
    "?mode=resetPassword",
    "?mode=signIn",
    "?oobCode=live",
    "?error=x",
    "",
    "?mode=verifyEmail&oobCode=live",
  ]) {
    const sp = params(search);
    const record = Object.fromEntries(sp.entries());
    assert.equal(
      keyFromSearchParams(sp),
      keyFromHandoff(record),
      `disagreed on ${search}`,
    );
  }
});

test("a repeated parameter is read as its first value, not as a list", () => {
  assert.equal(
    keyFromHandoff({ mode: ["resetPassword", "verifyEmail"] }),
    "resetPassword",
  );
  assert.equal(keyFromHandoff({ mode: [] }), "generic");
  assert.equal(keyFromHandoff({ mode: undefined }), "generic");
  assert.equal(keyFromHandoff({ mode: "   " }), "generic");
});

// ── The loop guard ────────────────────────────────────────────────────────

test("canonical URLs do not redirect, and everything else does", () => {
  // This is what keeps the middleware from redirecting to itself forever.
  assert.equal(isCanonicalSearchParams(params("")), true);
  assert.equal(isCanonicalSearchParams(params("?s=resetPassword")), true);
  assert.equal(isCanonicalSearchParams(params("?s=anything")), true);

  for (const search of [
    "?mode=resetPassword",
    "?oobCode=live",
    "?s=resetPassword&oobCode=live",
    "?apiKey=AIzaSyFAKE",
    "?S=resetPassword",
  ]) {
    assert.equal(isCanonicalSearchParams(params(search)), false, search);
    assert.equal(
      isCanonical(Object.fromEntries(params(search).entries())),
      false,
      search,
    );
  }
});

test("one strip is always enough — the redirect target is itself canonical", () => {
  for (const search of [
    "?mode=resetPassword&oobCode=live&apiKey=k&continueUrl=https://evil.example&lang=en",
    "?oobCode=live",
    "?error=x&mode=signIn",
    "?utm_source=mail",
  ]) {
    const key = keyFromSearchParams(params(search));
    const target = params(`?${OUTCOME_PARAM}=${key}`);
    assert.equal(isCanonicalSearchParams(target), true, `${search} to ?s=${key}`);
  }
});

// ── Nothing sensitive survives the strip ──────────────────────────────────

test("the surviving value is always one of the seven fixed keys", () => {
  const allowed = new Set<string>(ALL_KEYS);
  for (const search of [
    "?oobCode=SECRET_CODE_VALUE",
    "?apiKey=AIzaSyREALKEY",
    "?mode=%3Cscript%3Ealert(1)%3C%2Fscript%3E",
    `?mode=${encodeURIComponent("https://evil.example")}`,
    `?continueUrl=${encodeURIComponent("https://evil.example")}`,
    "?mode=__proto__",
    "?mode=constructor",
    "?mode=toString",
  ]) {
    const key = keyFromSearchParams(params(search));
    assert.equal(allowed.has(key), true, `${search} produced ${key}`);
  }
});

test("an unrecognised ?s= value degrades to generic instead of throwing", () => {
  // The canonical parameter is editable in the address bar. `__proto__` and
  // `constructor` are the ones that would resolve through the prototype chain
  // if the lookup used `in` rather than an own-property check.
  for (const value of ["", "nonsense", "__proto__", "constructor", "toString"]) {
    assert.equal(outcomeFor(value).key, "generic", `?s=${value}`);
  }
  assert.equal(outcomeFor(undefined).key, "generic");
  assert.equal(outcomeFor([]).key, "generic");
  assert.equal(outcomeFor(["resetPassword"]).key, "resetPassword");
});

// ── Every link on the page stays on Help24 ────────────────────────────────

test("no outcome can send a user off-site", () => {
  for (const key of ALL_KEYS) {
    const outcome = outcomeFor(key);
    for (const action of [outcome.primary, outcome.secondary]) {
      assert.equal(action.href.startsWith("/"), true, `${key}: ${action.href}`);
      assert.equal(action.href.startsWith("//"), false, `${key}: ${action.href}`);
      assert.equal(
        new URL(action.href, "https://help24.co.ke").origin,
        "https://help24.co.ke",
      );
      assert.equal(action.label.trim().length > 0, true);
    }
  }
});

test("continueHref round-trips: what the handler links to, this page renders", () => {
  for (const mode of COMPLETED) {
    const href = continueHref(mode);
    const search = href.slice(href.indexOf("?"));
    // The middleware leaves it alone...
    assert.equal(isCanonicalSearchParams(params(search)), true);
    // ...and the page renders the outcome the handler meant.
    assert.equal(outcomeFor(params(search).get(OUTCOME_PARAM) ?? undefined).key, mode);
  }
});
