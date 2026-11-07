import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { parseBeacon } from "../lib/site-events.ts";
import { trackerScript } from "../lib/analytics.ts";

/**
 * First-party event collection: the tracker beacons to /api/e, which passes
 * well-formed events on to record_site_event() (migration 137).
 */

const MEMBER = "Xb3k9QmT2vLp8sR4nY6wZ1aC5dE7";

test("a provider card open becomes a record for that member, with no extras", () => {
  assert.deepEqual(
    parseBeacon({ e: "provider_card_open", p: MEMBER, s: "qr", pl: "android", b: "chrome", v: "1.0.9", path: `/p/${MEMBER}` }, "KE"),
    {
      p_event: "provider_card_open", p_provider_id: MEMBER, p_source: "qr", p_platform: "android",
      p_browser: "chrome", p_app_version: "1.0.9", p_country: "KE", p_path: `/p/${MEMBER}`,
    },
  );
});

test("junk is dropped before it costs a round trip", () => {
  assert.equal(parseBeacon(null, null), null);
  assert.equal(parseBeacon("x", null), null);
  assert.equal(parseBeacon({ e: "page_view" }, null), null);
  assert.equal(parseBeacon({ e: "provider_card_open" }, null), null, "a card event needs a member id");
  assert.equal(parseBeacon({ e: "provider_card_open", p: "../../etc" }, null), null);
});

test("fields that are not the expected shape are blanked, not passed on", () => {
  const r = parseBeacon({ e: "download_click", p: MEMBER, s: "email", pl: "tv", b: "<b>", v: "latest", path: "/download?ref=abc" }, "Kenya");
  assert.deepEqual(r, {
    p_event: "download_click", p_provider_id: null, p_source: null, p_platform: null,
    p_browser: null, p_app_version: null, p_country: null, p_path: null,
  });
});

/** Runs the inline tracker against a fake browser and returns what it sent. */
function runTracker(nav: Record<string, unknown>, search = "") {
  const sent: string[] = [];
  const dataLayer: unknown[] = [];
  const listeners: Array<(e: unknown) => void> = [];
  const window: Record<string, unknown> = { dataLayer };
  class FakeBlob {
    parts: string[];
    constructor(parts: string[]) {
      this.parts = parts;
    }
  }
  const context = {
    window,
    navigator: {
      userAgent: "Mozilla/5.0 (Linux; Android 14) Chrome/130.0",
      sendBeacon: (_url: string, blob: FakeBlob) => { sent.push(blob.parts.join("")); return true; },
      ...nav,
    },
    location: { pathname: `/p/${MEMBER}`, search },
    document: { addEventListener: (_: string, fn: (e: unknown) => void) => listeners.push(fn) },
    Blob: FakeBlob,
    fetch: () => { throw new Error("fetch should not be needed when sendBeacon works"); },
  };
  runInNewContext(`${trackerScript("1.0.9")}; window.help24Track('provider_card_open', { source: 'link', provider_id: '${MEMBER}' });`, context);
  return { sent: sent.map((s) => JSON.parse(s)), dataLayer };
}

test("the tracker beacons to Help24's own /api/e, with no cookie or identifier", () => {
  const { sent, dataLayer } = runTracker({});
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0], { e: "provider_card_open", p: MEMBER, s: "link", pl: "android", b: "chrome", v: "1.0.9", path: `/p/${MEMBER}` });
  assert.equal(dataLayer.length, 1, "still queued for any tag manager added later");
  assert.ok(!/document\.cookie|localStorage|sessionStorage/.test(trackerScript("1.0.9")));
});

test("a browser that asks not to be tracked sends nothing", () => {
  assert.equal(runTracker({ doNotTrack: "1" }).sent.length, 0);
  assert.equal(runTracker({ globalPrivacyControl: true }).sent.length, 0);
});

test("the card page counts its owner and its open-in-app taps", () => {
  const page = readFileSync(new URL("../app/p/[id]/page.tsx", import.meta.url), "utf8");
  assert.match(page, /provider_id: \$\{JSON\.stringify\(card\.id\)\}/);
  assert.match(page, /data-track-provider=\{card\.id\}/);
});
