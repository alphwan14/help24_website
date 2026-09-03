/**
 * The one script that is allowed to block the first paint.
 *
 * THE PROBLEM IT SOLVES. The theme has three states — follow the system, force
 * light, force dark — and the third piece of information lives in
 * localStorage, which the server cannot read. If the override were applied
 * from a `useEffect`, the server's guess would paint first and the correction
 * would land after hydration: a visitor who chose dark on a light machine gets
 * a white flash on every navigation. That flash is the single most common
 * defect in theme implementations and it is not fixable after the fact.
 *
 * So this runs synchronously in <head>, before <body> exists, and stamps
 * `data-theme` on <html>. It is roughly 300 bytes, it is not hydrated, it
 * ships no React, and it is the only inline script on the site.
 *
 * WHEN THE PREFERENCE IS "system" IT WRITES NOTHING. The absence of the
 * attribute is what lets `@media (prefers-color-scheme: dark)` decide, and
 * that media query is already correct in the very first stylesheet — so the
 * default path costs one localStorage read and no DOM write at all.
 */

export const THEME_STORAGE_KEY = "help24-theme";

export type ThemeChoice = "system" | "light" | "dark";

/**
 * Kept as a string rather than a function reference: it is injected verbatim,
 * so it must not close over anything, must not be minified into a call to
 * something that will not exist yet, and must not throw. Private-mode Safari
 * makes `localStorage` itself throw on access, hence the try/catch around a
 * read that looks like it cannot fail.
 */
const SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
