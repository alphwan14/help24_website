import type { Config } from "tailwindcss";
import { PALETTE, RADIUS, CARD_METRICS } from "./lib/tokens";

/**
 * Colours, radii and card geometry are GENERATED from lib/tokens.ts — the one
 * file in this project that holds a hex value. Add a colour there, not here.
 *
 * WHY EVERY COLOUR IS A `var()` AND NOT THE HEX ITSELF.
 *
 * The site has two themes. If `bg-card` compiled to `#1C1C1E`, switching theme
 * would mean shipping a second copy of every colour utility under a selector —
 * the classic `.dark:bg-x` duplication, which doubles the stylesheet and puts
 * two names on one idea. Pointing the utility at the custom property instead
 * means `bg-card` compiles ONCE and simply resolves differently depending on
 * which `:root` block is winning. Theme switching costs nothing at build time
 * and nothing at runtime beyond a repaint.
 *
 * The `<alpha-value>` placeholder is what keeps `bg-primary/10` working, and
 * it is the reason tokensCss() emits a bare `r g b` triple alongside each
 * colour: Tailwind can substitute an alpha into `rgb(98 101 240 / 0.1)` but
 * not into a hex and not into a var() holding a finished colour.
 */
const colors = Object.fromEntries(
  Object.keys(PALETTE).map((name) => [name, `rgb(var(--${name}-rgb) / <alpha-value>)`]),
) as Record<string, string>;

const borderRadius = Object.fromEntries(
  Object.entries(RADIUS).map(([name, px]) => [name, `${px}px`]),
) as Record<string, string>;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
      /* Elevation follows the theme for the same reason colour does — see
         SHADOWS in lib/tokens.ts for why a dark shadow and a light one cannot
         be the same value. */
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        feed: "var(--shadow-feed)",
        "nav-bottom": "0 -4px 12px rgb(var(--page-rgb) / 0.5)",
      },
      spacing: {
        section: "clamp(4.5rem, 11vw, 8rem)",
        "card-gap": `${CARD_METRICS.gap}px`,
        "card-pad": `${CARD_METRICS.padding}px`,
      },
      maxWidth: {
        prose: "42rem",
        "prose-lg": "48rem",
      },
      /**
       * MOTION.
       *
       * Two easings do almost all the work on this site, and they are named so
       * a component can say which one it means rather than pasting four
       * magic numbers:
       *
       *   `spring`   overshoots slightly and settles. For anything ARRIVING —
       *              a card dropping onto the board, an offer sliding in. It
       *              is the closest a pure CSS curve gets to physics, and it
       *              is why the drop interaction reads as weight rather than
       *              as a fade.
       *   `out`      decelerates and stops dead. For anything LEAVING or
       *              moving between two states that both already exist.
       */
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1.4, 0.36, 1)",
        out: "cubic-bezier(0.2, 0.8, 0.2, 1)",
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
        /* The signature drop: a request falling into the marketplace. */
        drop: {
          "0%": { opacity: "0", transform: "translateY(-38px) scale(0.94)" },
          "60%": { opacity: "1" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        /* An offer arriving from the side of the board. */
        "slide-in": {
          from: { opacity: "0", transform: "translateY(14px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        /* The search sweep under the hero card while providers are found. */
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        /* The locate pulse behind a pin. Opacity only past the first frame,
           so it composites without touching layout. */
        ping: {
          "0%": { opacity: "0.5", transform: "scale(0.6)" },
          "100%": { opacity: "0", transform: "scale(2.2)" },
        },
      },
      animation: {
        "board-drift": "board-drift linear infinite",
        "card-land": "card-land 420ms cubic-bezier(0.2,0.8,0.2,1) both",
        drop: "drop 620ms cubic-bezier(0.22,1.4,0.36,1) both",
        "slide-in": "slide-in 460ms cubic-bezier(0.22,1.4,0.36,1) both",
        sweep: "sweep 1.4s cubic-bezier(0.4,0,0.2,1) infinite",
        ping: "ping 2.4s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
