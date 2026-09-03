/**
 * The machinery behind every timed thing on the homepage.
 *
 * Two hooks, and they exist together because they are always used together:
 * nothing on this site is allowed to animate while nobody is looking at it.
 *
 * WHY THAT MATTERS. The hero sequence and the living marketplace both run for
 * as long as the tab is open. On a mid-range Android — the device most of
 * Help24's visitors will actually arrive on — a timer firing a re-render every
 * second and a half behind three screens of scrolled-past content is battery
 * spent on nothing. `useInView` is what stops that, and it stops it for free:
 * an IntersectionObserver costs nothing while it is not intersecting.
 */
"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * True while the element is on screen.
 *
 * `rootMargin` deliberately extends the box: the sequence should already be
 * playing by the time it scrolls into view, not start from step zero the
 * instant its top edge appears — otherwise a visitor scrolling at a normal
 * speed always meets it mid-restart.
 */
export function useInView<T extends Element>(
  ref: RefObject<T>,
  rootMargin = "160px",
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browsers, some in-app webviews): the
    // honest fallback is "always visible". A stopped animation would be a
    // broken page; a running one is merely the old behaviour.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

interface SequenceState {
  /** Index into `durations`. */
  step: number;
  /** How many complete passes have finished. Drives scenario rotation. */
  cycle: number;
  /** Jump to a step. The clock restarts from there rather than pausing. */
  goTo: (step: number) => void;
}

/**
 * A stepped timeline with a duration per step.
 *
 * PER-STEP DURATIONS, NOT ONE TICK. "Three offers arrive" needs longer on
 * screen than "the money is now held", and a uniform interval makes the fast
 * beats drag and the slow ones unreadable. Pacing is the difference between a
 * sequence that explains something and a slideshow.
 *
 * When `enabled` is false — reduced motion, or scrolled away — the timeline
 * simply does not advance. It does not reset. Coming back to a sequence and
 * finding it where you left it is correct; finding it snapped to step zero is
 * the thing that makes a page feel like it is performing at you.
 */
export function useSequence(durations: number[], enabled: boolean): SequenceState {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  // `durations` is usually a module constant, but a caller building it inline
  // would otherwise re-arm the timer on every render and never advance.
  const spans = useRef(durations);
  spans.current = durations;

  useEffect(() => {
    if (!enabled) return;
    const last = spans.current.length - 1;
    const t = window.setTimeout(() => {
      if (step < last) {
        setStep(step + 1);
      } else {
        setStep(0);
        setCycle((c) => c + 1);
      }
    }, spans.current[step]);
    return () => window.clearTimeout(t);
  }, [step, enabled]);

  return { step, cycle, goTo: setStep };
}

/**
 * A string revealing itself one character at a time.
 *
 * Returns the whole string immediately when `enabled` is false, so the
 * reduced-motion and off-screen paths render finished text rather than an
 * empty field — the sentence is the content, and the typing is only the
 * delivery.
 */
export function useTypewriter(text: string, enabled: boolean, msPerChar = 38): string {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    setN(0);

    let interval = 0;
    // A short beat before the first character, so the caret is seen sitting in
    // an empty field. Without it the sentence looks already half typed.
    const lead = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setN((prev) => {
          if (prev >= text.length) {
            window.clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, msPerChar);
    }, 240);

    return () => {
      window.clearTimeout(lead);
      window.clearInterval(interval);
    };
  }, [text, enabled, msPerChar]);

  return enabled ? text.slice(0, n) : text;
}
