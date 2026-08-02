/**
 * Discover's All / Requests / Offers row — `FilterPill`
 * (widgets/filter_pill.dart).
 *
 * Each pill is INDEPENDENT: its own surface, its own boundary, real space
 * between it and its neighbours. It is not a segment of a shared track. The
 * selected pill needs no outline — its fill already separates it — and gets no
 * shadow, because a glow spreads the accent into the background and blurs the
 * edge. 42px tall, 24px radius, 18px horizontal padding, 10px gap.
 */
"use client";

import { CARD_METRICS, RADIUS } from "@/lib/tokens";

interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export function FilterPill({ label, active, onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center justify-center px-[18px] text-body transition-all duration-200 ${
        active ? "font-semibold text-white" : "font-medium text-text-primary"
      } ${className}`}
      style={{
        height: CARD_METRICS.pillHeight,
        borderRadius: RADIUS.pill,
        letterSpacing: "0.1px",
        backgroundColor: active ? "var(--primary)" : "var(--pill-inactive)",
        border: active ? "1px solid transparent" : "1px solid var(--pill-inactive-border)",
      }}
    >
      {label}
    </button>
  );
}

/** The row itself, so the 10px gap is stated once. */
export function FilterPillRow({
  options,
  value,
  onChange,
  className = "",
  label,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`flex flex-wrap ${className}`}
      style={{ gap: CARD_METRICS.pillGap }}
    >
      {options.map((o) => (
        <FilterPill key={o} label={o} active={o === value} onClick={() => onChange(o)} />
      ))}
    </div>
  );
}
