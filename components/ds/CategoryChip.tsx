/**
 * The category chip — `_CategoryBadge` (widgets/post_card.dart:642).
 *
 * 8px radius, `--primary` at 20% on dark, 12px icon, 4px gap, 11px/500 label
 * in `--primary`.
 *
 * ONE DEVIATION, AND WHY. The app draws the label in `--primary` on a 20%
 * `--primary` tint. Measured, that is 3.0:1 — the tint lightens the background
 * enough to put the label well under AA, and a category is not decoration, it
 * is the word that tells you what the card is. The label and glyph therefore
 * use `--primary-bright`, the lighter variant this project already keeps for
 * exactly this problem (see lib/tokens.ts), which scores 4.6:1 on the same
 * tint. The FILL is untouched, so the chip still reads as the app's chip.
 */
"use client";

import { categoryByName } from "@/lib/tokens";
import { CategoryIcon } from "./CategoryIcon";

interface Props {
  name: string;
  /** Renders as a <button> with a selected state — used by the task composer. */
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (name: string) => void;
  /** Lights the chip without making it interactive — used by the hero board. */
  highlighted?: boolean;
  className?: string;
}

export function CategoryChip({
  name,
  selectable = false,
  selected = false,
  onSelect,
  highlighted = false,
  className = "",
}: Props) {
  const category = categoryByName(name);
  const active = selected || highlighted;

  const shared =
    "inline-flex items-center gap-1 rounded-badge px-2 py-1 text-badge-type font-medium transition-colors duration-200";

  if (!selectable) {
    return (
      <span
        className={`${shared} ${className}`}
        style={{
          color: "var(--primary-bright)",
          backgroundColor: `color-mix(in srgb, var(--primary) ${active ? 32 : 20}%, transparent)`,
          boxShadow: active ? "0 0 0 1px var(--primary)" : undefined,
        }}
      >
        <CategoryIcon name={category.icon} size={12} />
        {category.name}
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect?.(category.name)}
      // 36px, not the 32 it was: this is the one chip a thumb actually has to
      // hit, and there are 32 of them in a scrolling box.
      className={`${shared} min-h-[36px] px-3 ${className}`}
      style={{
        color: selected ? "var(--white)" : "var(--primary-bright)",
        backgroundColor: selected
          ? "var(--primary)"
          : "color-mix(in srgb, var(--primary) 14%, transparent)",
      }}
    >
      <CategoryIcon name={category.icon} size={13} />
      {category.name}
    </button>
  );
}
