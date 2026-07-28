import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Force design-system colors to be generated (avoid purge making site look B&W)
    "bg-primary", "text-primary", "border-primary", "text-primary-bright",
    "bg-secondary", "text-secondary", "border-secondary",
    "bg-success", "text-success", "border-success",
    "bg-warning", "text-warning", "border-warning",
    "bg-error", "text-error", "border-error",
    "bg-bg-dark", "bg-surface", "bg-card", "border-border",
    "text-text-primary", "text-text-secondary", "text-text-tertiary",
    "bg-primary/10", "bg-primary/20", "bg-secondary/20", "bg-success/20", "bg-error/15", "bg-warning/15",
  ],
  theme: {
    extend: {
      colors: {
        // Help24 design system (hex so opacity modifiers like bg-primary/10 work)
        /**
         * The brand indigo. Was #6366F1, which carried white text at 4.467:1 —
         * just under the 4.5 threshold WCAG AA requires — so every filled
         * primary button on the site was marginally non-compliant.
         *
         * #6265F0 is the PERCEPTUALLY CLOSEST colour that clears it: ΔE 0.39
         * from the original in CIELAB, which is below the just-noticeable
         * difference, and 4.527:1 against white. Nothing looks different; the
         * buttons are now compliant.
         */
        primary: "#6265F0",
        /**
         * The same indigo, lightened for use as TEXT on the dark surfaces.
         *
         * Fill and text pull in opposite directions and one colour cannot serve
         * both: darkening `primary` to carry white text makes it WORSE as text
         * on #0A0A0A (4.43 → 4.37). This variant goes the other way — #818CF8
         * scores 6.3:1 on the dark background and still reads as the same
         * colour. Use it for links and labels; use `primary` for fills.
         */
        "primary-bright": "#818CF8",
        secondary: "#22D3EE",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        "type-request": "#2196F3",
        "type-offer": "#4CAF50",
        "type-job": "#9C27B0",
        "bg-dark": "#0A0A0A",
        surface: "#141414",
        card: "#1C1C1E",
        border: "#2C2C30",
        "bg-light": "#F8F9FA",
        "surface-light": "#FFFFFF",
        "border-light": "#E5E7EB",
        "text-primary": "#F9FAFB",
        "text-secondary": "#9CA3AF",
        "text-tertiary": "#6B7280",
        "text-primary-light": "#111827",
        "text-secondary-light": "#6B7280",
        "text-tertiary-light": "#9CA3AF",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      fontSize: {
        /* Headings: H1 32/700, H2 28/600, H3 24/600, H4 20/600, H5 18/600 */
        "h1": ["32px", { lineHeight: "1.2" }],
        "h2": ["28px", { lineHeight: "1.25" }],
        "h3": ["24px", { lineHeight: "1.3" }],
        "h4": ["20px", { lineHeight: "1.35" }],
        "h5": ["18px", { lineHeight: "1.4" }],
        "section-title": ["16px", { lineHeight: "1.4" }],
        "card-title": ["14px", { lineHeight: "1.4" }],
        "labels": ["12px", { lineHeight: "1.4" }],
        /* Body: 16/400, 14/400, 12/400. Label: 14/500, 12/500, 10/500 */
        "body-lg": ["16px", { lineHeight: "1.5" }],
        "body": ["14px", { lineHeight: "1.5" }],
        "body-sm": ["12px", { lineHeight: "1.5" }],
        "label-lg": ["14px", { lineHeight: "1.4" }],
        "label-md": ["12px", { lineHeight: "1.4" }],
        "label-sm": ["10px", { lineHeight: "1.4" }],
        "badge-type": ["11px", { lineHeight: "1.3" }],
        "badge-tag": ["11px", { lineHeight: "1.3" }],
      },
      borderRadius: {
        "button": "12px",
        "card": "16px",
        "badge": "8px",
        "tag": "6px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.2)",
        "card-glow": "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.2)",
        "nav-bottom": "0 -4px 12px rgba(0,0,0,0.15)",
      },
      spacing: {
        "section": "clamp(4rem, 10vw, 7rem)",
        "card-gap": "12px",
      },
      maxWidth: {
        "prose": "42rem",
        "prose-lg": "48rem",
      },
    },
  },
  plugins: [],
};

export default config;
