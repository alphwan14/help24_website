/**
 * Discover's search bar (screens/discover_screen.dart:398) rendered with the
 * app's `inputDecorationTheme` (theme/app_theme.dart:148-165):
 * filled with `--card`, 12px radius, 1px `--border`, 1.5px `--primary` when
 * focused, 16/14 padding, `--text-tertiary` hint, leading search glyph and a
 * clear button that appears once there is text.
 */
"use client";

import { forwardRef, useId } from "react";
import { RADIUS } from "@/lib/tokens";
import { Glyph } from "./glyphs";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  /** Visually hidden, but every field needs one. */
  label: string;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Larger target for the hero, card-sized elsewhere. */
  size?: "md" | "lg";
  className?: string;
  /** Announced to screen readers as the field's live result count. */
  describedBy?: string;
}

export const SearchField = forwardRef<HTMLInputElement, Props>(function SearchField(
  { value, onChange, placeholder, label, onFocus, onBlur, size = "md", className = "", describedBy },
  ref,
) {
  const id = useId();
  const big = size === "lg";

  return (
    <div
      className={`group relative flex items-center bg-card transition-[border-color,box-shadow] duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_1px_var(--primary)] ${className}`}
      style={{ borderRadius: RADIUS.button, border: "1px solid var(--border)" }}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute left-4 text-text-secondary" aria-hidden>
        <Glyph name="search" size={big ? 20 : 18} />
      </span>
      <input
        id={id}
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete="off"
        aria-describedby={describedBy}
        className={`w-full min-w-0 bg-transparent pl-11 text-text-primary placeholder:text-text-tertiary focus:outline-none ${
          big ? "py-4 pr-12 text-body-lg" : "py-3.5 pr-11 text-body"
        }`}
        style={{ borderRadius: RADIUS.button }}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-text-primary"
          aria-label="Clear search"
        >
          <Glyph name="close" size={16} />
        </button>
      ) : null}
    </div>
  );
});
