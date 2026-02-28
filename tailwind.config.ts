import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary / Accent
        primary: "#6366F1",
        secondary: "#22D3EE",
        // Semantic
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        // Type badges
        "type-request": "#2196F3",
        "type-offer": "#4CAF50",
        "type-job": "#9C27B0",
        // Dark theme
        "bg-dark": "#0A0A0A",
        surface: "#141414",
        card: "#1C1C1E",
        border: "#2C2C30",
        // Light theme (for future use)
        "bg-light": "#F8F9FA",
        "surface-light": "#FFFFFF",
        "border-light": "#E5E7EB",
        // Text dark
        "text-primary": "#F9FAFB",
        "text-secondary": "#9CA3AF",
        "text-tertiary": "#6B7280",
        // Text light
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
