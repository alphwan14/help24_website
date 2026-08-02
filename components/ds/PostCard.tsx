/**
 * The Discover feed card — a DOM reproduction of `PostCard`
 * (mobile-app/lib/widgets/post_card.dart), not a screenshot of it.
 *
 * Geometry is FeedCardTokens: 16px radius, 12px padding, 8px gaps, 32px
 * avatar, 38px minimum button height, 10px between stacked cards.
 *
 * ONE DELIBERATE OMISSION. The app's card carries a relative timestamp
 * ("2 min ago") in the top-right. It is not reproduced here. Help24 has no
 * provider supply yet, and a card reading "4 min ago" on a marketing site
 * claims a marketplace that is being used right now. The slot is left empty
 * rather than filled with a made-up time.
 */
"use client";

import { useId, type ReactNode } from "react";
import {
  CARD_METRICS,
  COPY,
  cardMoneyLabel,
  kes,
  type PostTypeKey,
  type PricingKey,
  type UrgencyKey,
} from "@/lib/tokens";
import { Avatar } from "./Avatar";
import { Badge, PostTypeBadge, UrgencyBadge } from "./Badge";
import { CategoryChip } from "./CategoryChip";
import { Glyph } from "./glyphs";

export interface FeedApplicant {
  id: string;
  name: string;
  /** users.profession, rendered as the app's applicant chip does. */
  profession: string;
  /** null means no reviews yet — the app shows "New" rather than a number. */
  rating: number | null;
  reviews: number;
  quote: string;
  price: number;
}

export interface FeedPost {
  id: string;
  type: PostTypeKey;
  title: string;
  description: string;
  category: string;
  /** Rendered as `Area, City` behind a pin, exactly as the app stores it. */
  area: string;
  city: string;
  price: number;
  pricing?: PricingKey;
  urgency: UrgencyKey;
  authorName: string;
  /** Highlight chips from the category question schema — primary coloured. */
  tags?: string[];
  /** Availability signal on offers — money-green, as `timeSignalChip` renders. */
  timeSignal?: string;
  /** Offer author has an M-Pesa number on file. Never worded as "Verified". */
  mpesa?: boolean;
  applicants?: FeedApplicant[];
  /**
   * The visitor authored this one (the composer's card).
   *
   * An author never sees "Offer Service" on their own listing — the app is
   * strict about this, and reproducing it is the difference between a board
   * that behaves like the product and a board that just looks like it.
   */
  owned?: boolean;
  /** Extra words the demo search should match on. Never shown. */
  keywords?: string[];
}

type Viewer = "visitor" | "owner";

interface Props {
  post: FeedPost;
  /**
   * Which side of the marketplace is looking.
   *   visitor → `Offer Service` on a request, `Enquire` on an offer
   *   owner   → `Applications (n)` / `Manage` on a request, `My Offer` on an offer
   */
  viewer?: Viewer;
  expanded?: boolean;
  onToggle?: () => void;
  /** Plays the arrival animation — used when the composer lands a card. */
  landing?: boolean;
  /**
   * Takes this card out of the tab order.
   *
   * The drifting board renders a second copy of the column so its loop has no
   * seam. That copy is `aria-hidden`, and a focusable control inside an
   * aria-hidden subtree is a trap — the focus ring vanishes and the screen
   * reader announces nothing. Mouse clicks still work.
   */
  inert?: boolean;
  className?: string;
  /** Slot under the footer, e.g. the applicant list when expanded. */
  children?: ReactNode;
}

export function PostCard({
  post,
  viewer = "visitor",
  expanded = false,
  onToggle,
  landing = false,
  inert = false,
  className = "",
  children,
}: Props) {
  const panelId = useId();
  const isRequest = post.type === "request";
  const money = cardMoneyLabel(post.type, post.price, post.pricing ?? "task");
  const applicantCount = post.applicants?.length ?? 0;
  const location = [post.area, post.city].filter(Boolean).join(", ") || "Kenya";

  return (
    <article
      className={`w-full overflow-hidden border border-border bg-card shadow-feed ${
        landing ? "card-landing animate-card-land" : ""
      } ${onToggle ? "cursor-pointer" : ""} ${className}`}
      style={{ borderRadius: CARD_METRICS.padding + 4 }}
      onClick={onToggle}
    >
      <div style={{ padding: `${CARD_METRICS.padding}px ${CARD_METRICS.padding}px 0` }}>
        {/* Type + category. The app puts a relative timestamp opposite these; see file header. */}
        <div className="flex flex-wrap items-center gap-1.5">
          <PostTypeBadge type={post.type} />
          <CategoryChip name={post.category} />
        </div>

        <h3 className="mt-1.5 text-card-heading font-bold text-text-primary">
          {onToggle ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              aria-expanded={expanded}
              aria-controls={panelId}
              tabIndex={inert ? -1 : undefined}
              // A single line of 15px text is a 19px-tall target. The padding
              // takes it past the 24px minimum without moving anything, since
              // the heading owns the vertical rhythm either way.
              className="w-full py-1 text-left"
            >
              {post.title}
            </button>
          ) : (
            post.title
          )}
        </h3>

        {/* Intent-aware tags: requests show urgency, offers show availability. */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {isRequest ? <UrgencyBadge value={post.urgency} /> : null}
          {post.timeSignal ? <Badge token="money">{post.timeSignal}</Badge> : null}
          {post.tags?.map((t) => (
            <Badge key={t} token="primary">
              {t}
            </Badge>
          ))}
          {post.type === "offer" && post.mpesa ? (
            <Badge token="money" icon="wallet">
              M-Pesa
            </Badge>
          ) : null}
          {isRequest && applicantCount > 0 ? (
            <Badge token="primary" icon="people">
              {applicantCount} applied
            </Badge>
          ) : null}
        </div>

        <div className="mt-1.5 flex items-start gap-2">
          <Avatar name={post.authorName} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-card-title font-medium text-text-primary">
                {post.authorName}
              </span>
              {/* The app's ReputationCompact shows "New" until a provider has
                  a real review. Nothing here invents a star rating. */}
              <span className="shrink-0 text-label-sm font-medium text-text-secondary">New</span>
            </div>
            <div className="mt-px flex items-center gap-1 text-card-location text-text-secondary">
              <Glyph name="pin" size={13} className="shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {post.description ? (
          <p className="mt-1.5 line-clamp-2 text-card-body text-text-secondary">{post.description}</p>
        ) : null}
      </div>

      <div
        className="flex items-center gap-3"
        style={{ padding: `8px ${CARD_METRICS.padding}px ${CARD_METRICS.padding}px` }}
      >
        {money ? (
          <span className="truncate text-card-title font-bold text-money">{money}</span>
        ) : null}
        <span className="ml-auto shrink-0">
          <CardCta
            post={post}
            viewer={post.owned ? "owner" : viewer}
            count={applicantCount}
            inert={inert}
          />
        </span>
      </div>

      {children ? (
        /*
         * Expands in place. The 0fr → 1fr grid row is the only way to animate
         * to a height nobody has measured; `motion-reduce` drops the
         * transition so the panel simply appears, which is what
         * prefers-reduced-motion asks for.
         */
        <div
          id={panelId}
          className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
          style={{
            gridTemplateRows: expanded ? "1fr" : "0fr",
            visibility: expanded ? "visible" : "hidden",
          }}
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      ) : null}
    </article>
  );
}

/**
 * The button in the bottom-right.
 *
 * Two shapes, exactly as the app draws them: the visitor's action is a FILLED
 * stadium button, the owner's is an OUTLINED 12px-radius button with a leading
 * icon — "this is mine" must not look like "do something".
 */
function CardCta({
  post,
  viewer,
  count,
  inert,
}: {
  post: FeedPost;
  viewer: Viewer;
  count: number;
  inert: boolean;
}) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const tabIndex = inert ? -1 : undefined;

  if (viewer === "owner") {
    const isOffer = post.type === "offer";
    const hasApps = count > 0;
    const label = isOffer
      ? COPY.owner.offer
      : hasApps
        ? COPY.owner.applications(count)
        : COPY.owner.manage;
    return (
      <button
        type="button"
        onClick={stop}
        tabIndex={tabIndex}
        className="inline-flex items-center gap-1.5 rounded-button border border-border px-3.5 py-2 text-card-title font-medium"
        style={{
          minHeight: CARD_METRICS.buttonMinHeight,
          color: isOffer
            ? "var(--text-primary)"
            : hasApps
              ? "var(--primary-bright)"
              : "var(--text-secondary)",
        }}
      >
        <Glyph name={isOffer ? "storefront" : "people"} size={15} />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={stop}
      tabIndex={tabIndex}
      className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-card-title font-semibold text-white transition-opacity hover:opacity-95"
      style={{ minHeight: CARD_METRICS.buttonMinHeight }}
    >
      {COPY.cta[post.type]}
    </button>
  );
}

/**
 * The applicants revealed when a card is expanded in the hero board.
 *
 * Avatars, rating, quote and quoted price. It lives here rather than in the
 * board so an expanded card is one component wherever it is used.
 */
export function ApplicantList({ applicants }: { applicants: FeedApplicant[] }) {
  if (applicants.length === 0) {
    return (
      <p className="border-t border-border px-3 py-3 text-body-sm text-text-secondary">
        No offers on this sample post.
      </p>
    );
  }

  return (
    <ul className="border-t border-border">
      {applicants.map((a) => (
        <li key={a.id} className="flex gap-2.5 border-b border-border/60 px-3 py-2.5 last:border-b-0">
          <Avatar name={a.name} size={28} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="truncate text-card-title font-medium text-text-primary">{a.name}</span>
              <span className="flex shrink-0 items-center gap-0.5 text-label-sm text-text-secondary">
                {a.rating === null ? (
                  "New"
                ) : (
                  <>
                    <Glyph name="star" size={10} />
                    {a.rating.toFixed(1)} ({a.reviews})
                  </>
                )}
              </span>
            </div>
            <p className="truncate text-label-md text-text-secondary">{a.profession}</p>
            <p className="mt-1 text-card-body text-text-secondary">&ldquo;{a.quote}&rdquo;</p>
          </div>
          <span className="shrink-0 self-center text-card-title font-bold text-money">
            {kes(a.price)}
          </span>
        </li>
      ))}
    </ul>
  );
}
