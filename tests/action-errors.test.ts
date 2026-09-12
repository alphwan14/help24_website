import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toFailure,
  isFixableOnForm,
  validatePassword,
  passwordStrength,
  STRENGTH_LABELS,
  MIN_PASSWORD_LENGTH,
  MALFORMED,
  UNSUPPORTED,
  type ActionFailure,
} from "../app/auth/action/errors.ts";

/**
 * The translation layer between the identity provider and a person holding a
 * broken link.
 *
 * THE PROPERTY BEING DEFENDED
 * ---------------------------
 * No provider text reaches the screen, and no branch is a dead end. The mobile
 * app enforces the same contract in `lib/utils/auth_error_mapper.dart` and
 * tests it the same way, because a user who fails on the web and retries in
 * the app must be told the same thing twice.
 */

/**
 * Vocabulary a Help24 user must never encounter. Kept deliberately in step
 * with `_forbidden` in mobile-app/test/auth_error_mapper_test.dart.
 */
const FORBIDDEN = [
  "firebase",
  "firebaseapp",
  "supabase",
  "render",
  "onrender",
  "google provider",
  "identity toolkit",
  "identitytoolkit",
  "oauth",
  "api key",
  "apikey",
  "jwt",
  "sdk",
  "exception",
  "undefined",
  "null",
  "auth/",
];

function expectClean(failure: ActionFailure, because: string): void {
  const text =
    `${failure.title} ${failure.message} ${failure.next}`.toLowerCase();
  for (const word of FORBIDDEN) {
    assert.equal(
      text.includes(word),
      false,
      `leaked "${word}" (${because}): ${failure.title} — ${failure.message}`,
    );
  }
  // No dead ends: every failure says what happened AND what to do now.
  assert.equal(failure.title.trim().length > 0, true, because);
  assert.equal(failure.message.trim().length > 0, true, because);
  assert.equal(failure.next.trim().length > 0, true, because);
}

/** Every code the identity SDK can raise on this page, and then some. */
const PROVIDER_CODES = [
  "auth/invalid-action-code",
  "auth/expired-action-code",
  "auth/user-disabled",
  "auth/user-not-found",
  "auth/weak-password",
  "auth/missing-password",
  "auth/network-request-failed",
  "auth/too-many-requests",
  "auth/internal-error",
  // Not mapped explicitly — must still come back as Help24 copy.
  "auth/invalid-api-key",
  "auth/operation-not-allowed",
  "auth/quota-exceeded",
  "auth/unauthorized-domain",
  "auth/some-code-invented-in-2027",
];

test("every provider code maps to Help24 copy with a next step", () => {
  for (const code of PROVIDER_CODES) {
    const failure = toFailure({
      code,
      // The provider's own prose, which names systems the reader has never
      // heard of. It must not survive into any field.
      message: `Firebase: The action code is invalid (${code}). API key AIzaSyFAKE.`,
      name: "FirebaseError",
    });
    expectClean(failure, code);
  }
});

test("the mapper is total — anything thrown produces usable copy", () => {
  const thrown: unknown[] = [
    undefined,
    null,
    "",
    "a bare string",
    0,
    new Error("Firebase: something went wrong (auth/internal-error)"),
    { code: 123 },
    { code: null },
    {},
    [],
    Symbol("x"),
  ];
  for (const error of thrown) {
    let failure: ActionFailure;
    try {
      failure = toFailure(error);
    } catch {
      assert.fail(`toFailure threw on ${String(error)}`);
    }
    expectClean(failure, `thrown: ${String(error)}`);
  }
});

test("a prototype-chain name is not mistaken for a mapped code", () => {
  // The lookup uses an own-property check. If it used `in`, these would
  // resolve through Object.prototype and return a function, not copy.
  for (const code of ["__proto__", "constructor", "toString", "hasOwnProperty"]) {
    const failure = toFailure({ code });
    expectClean(failure, code);
    assert.equal(typeof failure.title, "string");
  }
});

test("the three states of a spent code are not distinguished to the user", () => {
  // `auth/invalid-action-code` covers mistyped, already-used and superseded.
  // Telling an attacker which is a small oracle, so the copy covers all three.
  const failure = toFailure({ code: "auth/invalid-action-code" });
  const text = `${failure.message} ${failure.next}`.toLowerCase();
  assert.equal(text.includes("already have been used"), true);
  assert.equal(text.includes("replaced by a newer one"), true);
  // And it reassures that nothing changed, which is the question users ask.
  assert.equal(failure.message.toLowerCase().includes("nothing on"), true);
});

test("an expired code says so and points at a fresh link", () => {
  const failure = toFailure({ code: "auth/expired-action-code" });
  expectClean(failure, "expired");
  assert.equal(failure.title.toLowerCase().includes("expired"), true);
  assert.equal(failure.next.toLowerCase().includes("new link"), true);
});

// ── Malformed and unsupported links ───────────────────────────────────────

test("the malformed and unsupported messages are usable and clean", () => {
  expectClean(MALFORMED, "malformed link");
  expectClean(UNSUPPORTED, "unsupported mode");
  // Both must be clear that the account was not touched — that is the first
  // thing someone who clicked a link that failed wants to know.
  assert.equal(
    UNSUPPORTED.message.toLowerCase().includes("nothing on your account has changed"),
    true,
  );
});

// ── Staying on the form vs. leaving it ────────────────────────────────────

test("a fixable password problem keeps the user on the form", () => {
  // The code is still unspent, so throwing them out would cost them the link
  // over one weak password.
  assert.equal(isFixableOnForm({ code: "auth/weak-password" }), true);
  assert.equal(isFixableOnForm({ code: "auth/missing-password" }), true);
});

test("a dead code does not keep the user typing into a pointless form", () => {
  for (const code of [
    "auth/invalid-action-code",
    "auth/expired-action-code",
    "auth/user-disabled",
    "auth/user-not-found",
    "auth/too-many-requests",
    "auth/network-request-failed",
  ]) {
    assert.equal(isFixableOnForm({ code }), false, code);
  }
  assert.equal(isFixableOnForm(undefined), false);
  assert.equal(isFixableOnForm("weak-password"), false);
});

// ── Password rules ────────────────────────────────────────────────────────

test("the password rules match what the app accepts", () => {
  // A password the app would take but this page rejects is a contradiction the
  // user experiences as the product being broken. Mirrors
  // AuthService.validatePassword in mobile-app.
  assert.equal(validatePassword(""), "Enter a password.");
  assert.equal(validatePassword("short"), `Use at least ${MIN_PASSWORD_LENGTH} characters.`);
  assert.equal(validatePassword("1234567"), `Use at least ${MIN_PASSWORD_LENGTH} characters.`);
  assert.equal(validatePassword("12345678"), "Add letters as well as numbers.");
  assert.equal(validatePassword("00000000000000"), "Add letters as well as numbers.");

  // Accepted.
  assert.equal(validatePassword("abcd1234"), null);
  assert.equal(validatePassword("password"), null);
  assert.equal(validatePassword("Nairobi2026!"), null);
  // Exactly at the boundary.
  assert.equal(validatePassword("a".repeat(MIN_PASSWORD_LENGTH)), null);
  assert.equal(validatePassword("a".repeat(MIN_PASSWORD_LENGTH - 1)) !== null, true);
});

test("a long or unusual password is not rejected for being unusual", () => {
  // Rejecting spaces, emoji or length is a rule users hit and nobody benefits
  // from — and it silently breaks password managers.
  assert.equal(validatePassword("correct horse battery staple"), null);
  assert.equal(validatePassword("a".repeat(200)), null);
  assert.equal(validatePassword("pässwörd1"), null);
  assert.equal(validatePassword("🔐🔐🔐 secure1"), null);
});

// ── The strength meter must agree with the app's ─────────────────────────────

test("password strength scores the same as the mobile app's meter", () => {
  // Ported from AuthService.passwordStrength in mobile-app. The two runtimes
  // cannot share code, so the bands are pinned here instead: a password the
  // app calls "Strong" and this page calls "Okay" reads as one of the two
  // being broken, on the one screen where confidence matters most.
  const cases: [string, number][] = [
    ["", 0],
    ["short", 0],
    ["1234567", 0], // below the minimum length
    ["12345678", 0], // long enough, but all digits — the validator refuses it
    ["password", 1], // long enough, one class
    ["password12", 1], // two classes, under 12 characters
    ["Password12", 2], // three classes
    ["passwordlong1", 2], // 12+, two classes
    ["Password123!", 3], // 12+, four classes
  ];
  for (const [password, expected] of cases) {
    assert.equal(
      passwordStrength(password),
      expected,
      `passwordStrength(${JSON.stringify(password)})`,
    );
  }
});

test("every strength score has a label to render", () => {
  for (let score = 0; score <= 3; score++) {
    assert.equal(typeof STRENGTH_LABELS[score], "string");
    assert.equal(STRENGTH_LABELS[score].length > 0, true);
  }
  // Exactly four bands. A fifth would have no bar to fill.
  assert.equal(STRENGTH_LABELS.length, 4);
});

test("the meter never scores a password the form would reject", () => {
  // Anything validatePassword refuses must sit at zero, so the bar cannot say
  // "Okay" under a field the submit button is about to bounce.
  for (const bad of ["", "abc", "1234567", "12345678"]) {
    if (validatePassword(bad) !== null) {
      assert.equal(passwordStrength(bad), 0, JSON.stringify(bad));
    }
  }
});
