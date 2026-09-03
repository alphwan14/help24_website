"use client";

import { useEffect, useState } from "react";

/**
 * `prefers-reduced-motion: reduce`, as a boolean.
 *
 * Most of the honouring is done in CSS — that is where auto-scroll, the pulse
 * and the arrival animation are switched off, so they degrade even before
 * hydration. This hook exists for the three behaviours CSS cannot express:
 * stopping the placeholder cycling, expanding a card instantly instead of
 * animating its height, and freezing the escrow amount in place rather than
 * flying it between avatars.
 *
 * Starts `false` so the server and the first client render agree; the effect
 * corrects it before anything has had time to move.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}
