import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initials, isMemberId, recordLine } from "../lib/provider-card.ts";

/**
 * `/p/<id>` — a provider's Help24 card on the web.
 *
 * The record line must match the app's card word for word (the customer may
 * see both), and the page must not promise payment protection before it is
 * live — see docs/provider-card.md in the app repository.
 */

test("only a member id reaches the data sources", () => {
  assert.ok(isMemberId("Xb3k9QmT2vLp8sR4nY6wZ1aC5dE7"));
  for (const bad of ["", "short", "abc'; drop", "Xb3k9QmT2vLp8sR4nY6w/../x", "a".repeat(129)]) {
    assert.equal(isMemberId(bad), false, bad);
  }
});

test("the record line says what the profile says, never a guess", () => {
  assert.equal(recordLine(null), null);
  assert.equal(recordLine({}), "New on Help24");
  assert.equal(recordLine({ total_reviews: 0, completed_jobs: 0 }), "New on Help24");
  assert.equal(
    recordLine({ average_rating: 4.84, total_reviews: 12, completed_jobs: 9 }),
    "★ 4.8 (12) · 9 jobs done on Help24",
  );
  assert.equal(recordLine({ completed_jobs: 1 }), "1 job done on Help24");
});

test("initials come from the first two names", () => {
  assert.equal(initials("Amina Wanjiru Otieno"), "AW");
  assert.equal(initials("  juma "), "J");
});

test("the card page promises nothing about money while Phase A holds", () => {
  const page = readFileSync(new URL("../app/p/[id]/page.tsx", import.meta.url), "utf8");
  const copy = page.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").toLowerCase();
  for (const claim of ["protect", "escrow", "secure", "guarantee", "held safely", "pay "]) {
    assert.ok(!copy.includes(claim), `the card page says "${claim}"`);
  }
});
