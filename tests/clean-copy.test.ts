import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

/**
 * Clean UI copy: no em dashes and no middle dots in anything a visitor reads
 * (string literals, template text, JSX text). Comments are not checked.
 *
 * One exception: lib/provider-card.ts must match the app's provider card word
 * for word, and the app's record line uses a middle dot.
 */
const ALLOW = new Set(["lib/provider-card.ts"]);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return files(p);
    return /\.(ts|tsx)$/.test(p) ? [p] : [];
  });
}

test("no em dash or middle dot in visible copy", () => {
  const found: string[] = [];
  for (const f of ["app", "components", "lib"].flatMap(files)) {
    if (ALLOW.has(f)) continue;
    const src = readFileSync(f, "utf8");
    if (!/[—·]/.test(src)) continue;
    const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, f.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visit = (n: ts.Node) => {
      const k = n.kind;
      if (
        k === ts.SyntaxKind.StringLiteral || k === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
        k === ts.SyntaxKind.TemplateHead || k === ts.SyntaxKind.TemplateMiddle ||
        k === ts.SyntaxKind.TemplateTail || k === ts.SyntaxKind.JsxText
      ) {
        const text = n.getText(sf);
        if (/[—·]/.test(text)) found.push(`${f}: ${text.trim().slice(0, 80)}`);
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  assert.deepEqual(found, [], "use a full stop, comma, colon or parentheses instead");
});
