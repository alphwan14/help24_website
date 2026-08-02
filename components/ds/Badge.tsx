/**
 * The three badge shapes a feed card uses. All colour comes in as a token NAME
 * and is resolved through `var(--token)` — no component in this project knows
 * a hex value.
 *
 *   type      the Request / Offer / Job badge  (post_card.dart:158-176)
 *             8px radius, 15% fill, 50% border, 11px/600
 *   tag       urgency and highlight chips      (post_card.dart:_SmallTag, 553)
 *             6px radius, 12% fill, no border, 10.5px/600
 *   category  see CategoryChip.tsx
 */
import type { ReactNode } from "react";
import { PALETTE, POST_TYPES, urgency, type PaletteKey, type PostTypeKey, type UrgencyKey } from "@/lib/tokens";
import { Glyph } from "./glyphs";

type Variant = "type" | "tag";

interface BadgeProps {
  variant?: Variant;
  /** A key of PALETTE — resolved to `var(--key)`. */
  token: PaletteKey;
  children: ReactNode;
  /** Optional leading glyph, matching the app's iconned tags. */
  icon?: string;
  className?: string;
}

/**
 * `--primary` measured as a LABEL on its own 12–20% tint over `--card` is
 * 3.3:1 — the fill lightens the background just enough to sink it well under
 * AA. `--primary-bright` is the same colour lightened for exactly this case
 * (it already exists in this project for the same reason on section eyebrows)
 * and scores 5.1:1 there. The fill still comes from `--primary`, so the chip
 * looks like the app's; only the glyph and the letters are lifted.
 *
 * Urgency and post-type keep their exact values — see the contrast note in the
 * rebuild notes for what that costs and what the fix would be.
 */
const TEXT_SUBSTITUTE: Partial<Record<PaletteKey, PaletteKey>> = {
  primary: "primary-bright",
};

export function Badge({ variant = "tag", token, children, icon, className = "" }: BadgeProps) {
  const fill = `var(--${token})`;
  const color = `var(--${TEXT_SUBSTITUTE[token] ?? token})`;
  const isType = variant === "type";

  return (
    <span
      className={[
        "inline-flex items-center gap-1 whitespace-nowrap font-semibold",
        isType ? "rounded-badge px-2 py-1 text-badge-type" : "rounded-tag px-[7px] py-[3px] text-badge-tag",
        className,
      ].join(" ")}
      style={{
        color,
        // The app fills a type badge at 15%. At 10% the badge is visually the
        // same and the label clears AA (4.44 → 4.80 for the Request blue) —
        // the alpha moved, the colour did not.
        backgroundColor: `color-mix(in srgb, ${fill} ${isType ? 10 : 12}%, transparent)`,
        border: isType ? `1px solid color-mix(in srgb, ${fill} 50%, transparent)` : undefined,
      }}
    >
      {icon ? <Glyph name={icon} size={isType ? 11 : 10} /> : null}
      {children}
    </span>
  );
}

/** `Request` / `Offer` / `Job` — PostModel.typeDisplayLabel + typeBadgeColor. */
export function PostTypeBadge({ type, className = "" }: { type: PostTypeKey; className?: string }) {
  const t = POST_TYPES.find((p) => p.key === type)!;
  return (
    <Badge variant="type" token={t.token} className={className}>
      {t.label}
    </Badge>
  );
}

/**
 * `Urgent` / `Soon` / `Flexible` — PostModel.urgencyText + urgencyColor.
 *
 * Note these use the `urgency-*` tokens, not `error` / `warning` / `success`.
 * The app defines both sets and renders this one on cards; see
 * STATUS_COLOR_CONFLICT in lib/tokens.ts.
 */
export function UrgencyBadge({ value, className = "" }: { value: UrgencyKey; className?: string }) {
  const u = urgency(value);
  return (
    <Badge token={u.token} className={className}>
      {u.label}
    </Badge>
  );
}

/** Exposed so a gallery can enumerate every token without importing PALETTE. */
export const BADGE_TOKENS = Object.keys(PALETTE) as PaletteKey[];
