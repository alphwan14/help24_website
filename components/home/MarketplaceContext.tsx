/**
 * The homepage's shared marketplace state.
 *
 * Four modules read and write the same board — the hero search filters it, the
 * composer lands a card in it, the two-sided toggle changes which half of the
 * marketplace it shows, and the coverage map reads the same posts. Holding that
 * in one context is what makes the page behave like one product instead of
 * several independent widgets.
 *
 * REACT STATE ONLY. No localStorage, no sessionStorage, no cookie. A visitor's
 * poke at the demo does not survive a reload and is not meant to: nothing here
 * is worth persisting and persisting it would mean storing something about a
 * person who has not asked us to.
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FeedPost } from "@/components/ds/PostCard";
import { POSTS, matchPosts, matchedCategory } from "@/lib/demo/seed";

/** Mirrors Discover's Requests / Offers filter (discover_screen.dart:229). */
export type Side = "need" | "offer";

interface MarketplaceState {
  query: string;
  setQuery: (v: string) => void;

  side: Side;
  setSide: (s: Side) => void;

  /** Seed posts plus anything the composer has produced this session. */
  posts: FeedPost[];
  /** The composed card, so the board can play its arrival animation once. */
  landedId: string | null;
  addPost: (post: FeedPost) => void;

  /** Posts for the current side and query, composed card first. */
  visible: FeedPost[];
  /** How many the current side holds before the query narrows it. */
  totalForSide: number;
  /** Category to light up while typing, or null when nothing leads. */
  highlighted: string | null;
}

const Ctx = createContext<MarketplaceState | null>(null);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [side, setSide] = useState<Side>("need");
  const [composed, setComposed] = useState<FeedPost[]>([]);
  const [landedId, setLandedId] = useState<string | null>(null);

  const addPost = useCallback((post: FeedPost) => {
    // Newest composed card first, and only ever one from a given composer run —
    // re-running the composer replaces its previous card rather than stacking.
    setComposed((prev) => [post, ...prev.filter((p) => p.id !== post.id)]);
    setLandedId(post.id);
  }, []);

  const posts = useMemo(() => [...composed, ...POSTS], [composed]);

  const value = useMemo<MarketplaceState>(() => {
    const wanted = side === "need" ? "request" : "offer";
    const forSide = posts.filter((p) => p.type === wanted);
    const matched = matchPosts(query, forSide);
    return {
      query,
      setQuery,
      side,
      setSide,
      posts,
      landedId,
      addPost,
      // A query that matches nothing leaves the board as it was rather than
      // emptying it: an empty board on a marketing page reads as "no supply",
      // which is a claim we are not making either way.
      visible: matched.length > 0 ? matched : forSide,
      totalForSide: forSide.length,
      highlighted: matchedCategory(query, forSide),
    };
  }, [query, side, posts, landedId, addPost]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMarketplace(): MarketplaceState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMarketplace must be used inside <MarketplaceProvider>");
  return ctx;
}
