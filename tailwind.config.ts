import type { Config } from "tailwindcss";
import { PALETTE, RADIUS, CARD_METRICS } from "./lib/tokens";

/**
 * Colours, radii and card geometry are GENERATED from lib/tokens.ts — the one
 * file that holds a hex value in this project. Add a colour there, not here.
 */
const colors = Object.fromEntries(Object.entries(PALETTE)) as Record<string, string>;

const borderRadius = Object.fromEntries(
  Object.entries(RADIUS).map(([name, px]) => [name, `${px}px`]),
) as Record<string, string>;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Kept from the original config: these are the classes the older marketing
    // pages apply, and a purge miss turned the site monochrome once already.
    // The new modules colour themselves with `var(--token)` instead, so this
    // list does not have to grow as tokens are added.
    "bg-primary", "text-primary", "border-primary", "text-primary-bright",
    "bg-secondary", "text-secondary", "border-secondary",
    "bg-success", "text-success", "border-success",
    "bg-warning", "text-warning", "border-warning",
    "bg-error", "text-error", "border-error",
    "bg-bg-dark", "bg-surface", "bg-card", "border-border",
    "text-text-primary", "text-text-secondary", "text-text-tertiary",
    "bg-primary/10", "bg-primary/20", "bg-secondary/20", "bg-success/20",
    "bg-error/15", "bg-warning/15",
    "text-money", "bg-money", "bg-money/10", "bg-money/15",
  ],
  theme: {
    extend: {
      colors,
      borderRadius,
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      fontSize: {
        /* Headings: H1 32/700, H2 28/600, H3 24/600, H4 20/600, H5 18/600 */
        h1: ["32px", { lineHeight: "1.2" }],
        h2: ["28px", { lineHeight: "1.25" }],
        h3: ["24px", { lineHeight: "1.3" }],
        h4: ["20px", { lineHeight: "1.35" }],
        h5: ["18px", { lineHeight: "1.4" }],
        "section-title": ["16px", { lineHeight: "1.4" }],
        "card-title": ["14px", { lineHeight: "1.4" }],
        labels: ["12px", { lineHeight: "1.4" }],
        /* Body: 16/400, 14/400, 12/400. Label: 14/500, 12/500, 10/500 */
        "body-lg": ["16px", { lineHeight: "1.5" }],
        body: ["14px", { lineHeight: "1.5" }],
        "body-sm": ["12px", { lineHeight: "1.5" }],
        "label-lg": ["14px", { lineHeight: "1.4" }],
        "label-md": ["12px", { lineHeight: "1.4" }],
        "label-sm": ["10px", { lineHeight: "1.4" }],
        /* Feed-card scale — mirrors TYPE.card in lib/tokens.ts */
        "card-heading": ["15px", { lineHeight: "1.24" }],
        "card-body": ["12.5px", { lineHeight: "1.3" }],
        "card-location": ["11.5px", { lineHeight: "1.3" }],
        "badge-type": ["11px", { lineHeight: "1.3" }],
        "badge-tag": ["10.5px", { lineHeight: "1.3" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.2)",
        "card-glow": "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.2)",
        "nav-bottom": "0 -4px 12px rgba(0,0,0,0.15)",
        /* The feed card's own shadow — post_card.dart:124-129 */
        feed: "0 2px 8px rgba(0,0,0,0.2)",
      },
      spacing: {
        section: "clamp(4rem, 10vw, 7rem)",
        "card-gap": `${CARD_METRICS.gap}px`,
        "card-pad": `${CARD_METRICS.padding}px`,
      },
      maxWidth: {
        prose: "42rem",
        "prose-lg": "48rem",
      },
      keyframes: {
        "board-drift": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(0,-50%,0)" },
        },
        "card-land": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "board-drift": "board-drift linear infinite",
        "card-land": "card-land 420ms cubic-bezier(0.2,0.8,0.2,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
