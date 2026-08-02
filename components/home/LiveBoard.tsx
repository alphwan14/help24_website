/**
 * The board — a column of real feed cards that drifts slowly upward and stops
 * when you touch it.
 *
 * HOW THE LOOP WORKS. The column is rendered twice inside one track and the
 * track is animated to −50%: at the end of a cycle the second copy is exactly
 * where the first started, so the reset is invisible and there is no scroll
 * listener, no requestAnimationFrame, and nothing that runs on the main thread
 * per frame. The duplicate is `aria-hidden` and its controls are taken out of
 * the tab order (see PostCard's `inert`).
 *
 * WHAT IT IS NOT. It is not a live feed. Nothing arrives, nothing counts up,
 * no card carries a time. It is the same twelve sample posts on a loop, and
 * the Demo chip says so.
 *
 * Pausing is CSS (`.board-viewport:hover .board-track`) so it works before
 * hydration; an expanded card pauses it from JS, because a card growing inside
 * a moving column is unreadable.
 */
"use client";

import { useEffect, useState } from "react";
import { ApplicantList, PostCard, type FeedPost } from "@/components/ds/PostCard";
import { CARD_METRICS } from "@/lib/tokens";
import { useReducedMotion } from "./useReducedMotion";

interface Props {
  posts: FeedPost[];
  viewer?: "visitor" | "owner";
  /** The composer's card, played in once. */
  landedId?: string | null;
  /** Seconds each card spends crossing the viewport. */
  paceSeconds?: number;
  /** Fixed viewport height. The board never grows the page. */
  height?: string;
  className?: string;
  /** Turns the drift off entirely — used by the two-sided section. */
  still?: boolean;
  label: string;
}

export function LiveBoard({
  posts,
  viewer = "visitor",
  landedId = null,
  paceSeconds = 9,
  height = "clamp(420px, 62vh, 560px)",
  className = "",
  still = false,
  label,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  /**
   * The seam-hiding duplicate column is an artefact of the animation, so it
   * has no business in the server HTML: before hydration nothing is moving,
   * the second copy is below the masked viewport where nobody can see it, and
   * it doubles the markup of the heaviest module on the page. Mounting it
   * client-side halves the hero's initial HTML and cannot shift the layout,
   * because the board's height is fixed either way.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // A card that is no longer on the board cannot stay expanded — otherwise
  // filtering to a different category leaves an invisible open panel holding
  // the animation paused.
  useEffect(() => {
    if (expandedId && !posts.some((p) => p.id === expandedId)) setExpandedId(null);
  }, [posts, expandedId]);

  // Fewer than four cards cannot loop convincingly: the duplicate would be on
  // screen at the same time as the original.
  const drifting = mounted && !still && !reduced && posts.length >= 4;
  const duration = `${posts.length * paceSeconds}s`;

  const column = (copy: number) =>
    posts.map((post) => (
      <div key={`${copy}-${post.id}`} style={{ marginBottom: CARD_METRICS.bottomMargin }}>
        <PostCard
          post={post}
          viewer={viewer}
          expanded={expandedId === post.id}
          onToggle={() => setExpandedId((id) => (id === post.id ? null : post.id))}
          landing={post.id === landedId}
          inert={copy === 1}
        >
          <ApplicantList applicants={post.applicants ?? []} />
        </PostCard>
      </div>
    ));

  return (
    <div
      className={`board-viewport relative ${drifting ? "overflow-hidden" : "overflow-y-auto"} ${className}`}
      style={{
        height,
        // The column has to end somewhere; a hard edge reads as a crop, a fade
        // reads as more marketplace continuing past the frame.
        maskImage: "linear-gradient(to bottom, transparent, black 7%, black 93%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 7%, black 93%, transparent)",
      }}
      aria-label={label}
      role="region"
    >
      <div
        className={drifting ? "board-track" : ""}
        style={{
          ["--board-duration" as string]: duration,
          // An open card pauses the drift from here rather than from the
          // stylesheet, because the stylesheet cannot know a card is open.
          animationPlayState: expandedId ? "paused" : undefined,
        }}
      >
        {column(0)}
        {drifting ? (
          <div aria-hidden="true">{column(1)}</div>
        ) : null}
      </div>
    </div>
  );
}
