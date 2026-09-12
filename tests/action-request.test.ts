import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseActionRequest,
  isMode,
  type Mode,
} from "../app/auth/action/request.ts";
import { continueHref } from "../app/auth/continue/outcome.ts";

/**
 * The action handler's decision layer.
 *
 * WHAT THESE TESTS ARE FOR
 * ------------------------
 * A password-reset link is a live credential in a URL. The handler decides,
 * from that URL alone, whether to spend it and where to send the person
 * afterwards. These assert the decisions, not the rendering — a test that
 * mounted the component would be asserting React, and would go red the next
 * time a class name changed.
 *
 * Every case below is a real shape the provider or an attacker can produce.
 */

const SUPPORTED: readonly Mode[] = [
  "resetPassword",
  "verifyEmail",
  "recoverEmail",
  "verifyAndChangeEmail",
];

/** A link exactly as the provider builds it, custom action handler and all. */
function providerLink(mode: string, code = "AbC-123_xyz"): string {
  return (
    `?mode=${mode}&oobCode=${code}&apiKey=AIzaSyFAKE` +
    `&continueUrl=${encodeURIComponent("https://help24.co.ke/auth/continue")}` +
    `&lang=en`
  );
}

test("every action Help24 performs is accepted, with its code intact", () => {
  for (const mode of SUPPORTED) {
    const request = parseActionRequest(providerLink(mode));
    assert.deepEqual(
      request,
      { kind: "run", mode, oobCode: "AbC-123_xyz" },
      `${mode} must be runnable`,
    );
  }
});

test("a leading '?' is optional — the raw search string parses either way", () => {
  const withQuestion = parseActionRequest("?mode=verifyEmail&oobCode=c");
  const without = parseActionRequest("mode=verifyEmail&oobCode=c");
  assert.deepEqual(withQuestion, without);
  assert.equal(withQuestion.kind, "run");
});

test("signIn is refused rather than guessed at", () => {
  // Email-link sign-in. The provider supports it; Help24 does not use it, and
  // a handler that improvised would be acting on a credential it has no flow
  // for.
  assert.deepEqual(parseActionRequest(providerLink("signIn")), {
    kind: "unsupported",
  });
});

test("a mode nobody has heard of is refused, not treated as a default", () => {
  for (const mode of [
    "revertSecondFactorAddition",
    "resetpassword", // wrong case — the provider never sends this
    "resetPassword2",
    " resetPassword",
    "__proto__",
    "constructor",
  ]) {
    assert.equal(
      parseActionRequest(providerLink(mode)).kind,
      "unsupported",
      `${mode} must not be run`,
    );
  }
});

test("a link missing either half is malformed, and never reaches the network", () => {
  const cases: Record<string, string> = {
    "no parameters at all": "",
    "bare question mark": "?",
    "mode without a code": "?mode=resetPassword",
    "code without a mode": "?oobCode=AbC-123",
    "blank code (an email client wrapped the line)": "?mode=resetPassword&oobCode=",
    "blank mode": "?mode=&oobCode=AbC-123",
    "someone else's query string": "?utm_source=newsletter&ref=twitter",
  };
  for (const [why, search] of Object.entries(cases)) {
    assert.deepEqual(parseActionRequest(search), { kind: "malformed" }, why);
  }
});

test("a repeated parameter takes the first value, deterministically", () => {
  // `?mode=a&mode=b` is a broken link, not a choice. What matters is that the
  // answer does not depend on ordering luck.
  const request = parseActionRequest(
    "?mode=verifyEmail&mode=resetPassword&oobCode=first&oobCode=second",
  );
  assert.deepEqual(request, {
    kind: "run",
    mode: "verifyEmail",
    oobCode: "first",
  });
});

test("the code is passed through byte for byte, whatever is in it", () => {
  // Provider codes are URL-safe base64, but the handler must not be the thing
  // that corrupts one — a mangled code reads to the user as "your link is
  // broken" when it was fine.
  const code = "ABC-_123.~abcDEF456ghiJKL789";
  const request = parseActionRequest(`?mode=resetPassword&oobCode=${code}`);
  assert.equal(request.kind === "run" && request.oobCode, code);
});

test("isMode admits exactly four values", () => {
  for (const mode of SUPPORTED) assert.equal(isMode(mode), true);
  for (const other of ["signIn", "", "resetPassword ", "RESETPASSWORD"]) {
    assert.equal(isMode(other), false, `${other} must not be a mode`);
  }
});

// ── Open redirect ─────────────────────────────────────────────────────────
//
// The one attack this page is uniquely exposed to. A link arrives by email,
// the user is told they are on the real Help24, and the page then sends them
// somewhere. If "somewhere" can be set by whoever wrote the email, Help24 is
// the thing lending credibility to the destination.

test("no continueUrl an attacker can write changes where the user is sent", () => {
  const hostile = [
    "https://help24.co.ke.evil.example/steal",
    "https://evil.example/steal",
    "//evil.example/steal",
    "javascript:alert(document.cookie)",
    "data:text/html,<script>fetch('//evil.example')</script>",
    "http://help24.co.ke@evil.example",
    "/\evil.example",
    "https://help24.co.ke/auth/continue?next=https://evil.example",
    "\u0000https://evil.example",
  ];

  for (const url of hostile) {
    const search =
      `?mode=resetPassword&oobCode=live-code` +
      `&continueUrl=${encodeURIComponent(url)}`;

    const request = parseActionRequest(search);
    assert.equal(request.kind, "run", "a hostile continueUrl must not break the flow");

    // The destination is a function of the mode. There is no argument it could
    // have taken the hostile value through.
    const href = continueHref((request as { mode: Mode }).mode);
    assert.equal(href, "/auth/continue?s=resetPassword");
    assert.equal(href.includes("evil.example"), false);
  }
});

test("the continue destination is relative, internal, and mode-shaped", () => {
  for (const mode of SUPPORTED) {
    const href = continueHref(mode);
    assert.equal(href, `/auth/continue?s=${mode}`);
    // Relative: it starts with a single slash, so no scheme and no host can be
    // smuggled in, and a protocol-relative `//host` is impossible by shape.
    assert.equal(href.startsWith("/"), true);
    assert.equal(href.startsWith("//"), false);
    assert.equal(/^[a-z][a-z0-9+.-]*:/i.test(href), false, "no scheme");
    // Resolving it against a hostile base still lands on Help24's own origin.
    assert.equal(
      new URL(href, "https://help24.co.ke").origin,
      "https://help24.co.ke",
    );
  }
});

test("unknown provider parameters are ignored rather than acted on", () => {
  // The provider has added parameters before and will again. An unrecognised
  // one must change nothing.
  const request = parseActionRequest(
    "?mode=verifyEmail&oobCode=c&tenantId=x&newParamFrom2027=y&continueUrl=https://evil.example",
  );
  assert.deepEqual(request, { kind: "run", mode: "verifyEmail", oobCode: "c" });
});
