/**
 * The manual theme control.
 *
 * THREE STATES, NOT TWO. A plain light/dark switch has no way to say "do what
 * my phone does", so the moment someone touches it they are opted out of their
 * own system setting for good — including out of an automatic switch at
 * sunset. Auto is therefore a real, selectable, and DEFAULT option rather than
 * an implied starting position.
 *
 * WHY IT IS NOT A CYCLING BUTTON. One button that rotates through three states
 * requires the visitor to know the order, gives no way back without going
 * forward, and can only ever announce where it is, not where it can go. Three
 * small targets in a group cost about eighty pixels and answer both questions
 * at a glance.
 *
 * SEMANTICS. It is a radio group, because that is what it is: one choice out
 * of three, always exactly one selected. `aria-checked` says which — not
 * `aria-pressed`, which would describe three independent toggles that happen
 * to look related.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type ThemeChoice } from "./ThemeScript";

const OPTIONS: { value: ThemeChoice; label: string; icon: JSX.Element }[] = [
  {
    value: "system",
    label: "Match system",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M9 21h6M12 17v4" />
      </>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  },
];

function read(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  /**
   * Starts at "system" on both server and client so the two agree, then
   * corrects in an effect. Nothing VISUAL depends on this state — the page is
   * already painted in the right theme by ThemeScript — so the correction has
   * no flash to cause; it only moves which of three buttons is marked current.
   */
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(read());
    setReady(true);
  }, []);

  const apply = useCallback((next: ThemeChoice) => {
    const root = document.documentElement;

    /**
     * Suppress every transition for one frame.
     *
     * Without this, changing the tokens re-runs each `transition-colors` on
     * the page at its own duration and the site visibly ripples — headers
     * fading at 300ms over cards fading at 200ms. Two rAFs, because the class
     * has to survive the frame in which the new values are computed.
     */
    root.classList.add("theme-switching");

    if (next === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);

    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* Storage denied. The choice still applies to this page; it simply will
         not survive a reload, which is better than refusing to switch. */
    }

    setChoice(next);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("theme-switching")),
    );
  }, []);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`inline-flex items-center gap-0.5 rounded-pill border border-border bg-card p-0.5 ${className}`}
    >
      {OPTIONS.map((o) => {
        const active = ready && choice === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.label}
            onClick={() => apply(o.value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
              active
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-card-hover hover:text-text-primary"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              {o.icon}
            </svg>
            <span className="sr-only">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
