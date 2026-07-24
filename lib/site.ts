/**
 * Single source of truth for the Help24 website: canonical URL, brand strings,
 * navigation and the app-store state. Header, Footer, sitemap, metadata and the
 * download page all read from here so a route or a store link changes in ONE
 * place.
 *
 * Canonical domain is help24.co.ke (never the hosting-vendor domain) — this must
 * stay in lock-step with the Flutter app's `AppUrls` (lib/config/app_urls.dart).
 */

export const SITE = {
  name: "Help24",
  url: "https://help24.co.ke",
  domain: "help24.co.ke",
  tagline: "Kenya's trusted marketplace for local services",
  description:
    "Help24 connects you with trusted local service providers across Kenya — from urgent repairs to everyday tasks. Agree a price, pay securely, get it done.",
  supportEmail: "support@help24.co.ke",
  // Target response time surfaced on the Support page and in-app copy.
  supportResponseHours: 24,
} as const;

export type NavLink = { label: string; href: string; external?: boolean };

/** Primary header navigation. */
export const HEADER_NAV: NavLink[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "For providers", href: "/for-providers" },
  { label: "Safety", href: "/safety" },
  { label: "Help Centre", href: "/help" },
];

/** Footer link groups. */
export const FOOTER_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "For customers", href: "/for-customers" },
      { label: "For providers", href: "/for-providers" },
      { label: "Safety & Escrow", href: "/safety" },
      { label: "Download the app", href: "/download" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Become a provider", href: "/become-a-provider" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/help" },
      { label: "Contact Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Community Guidelines", href: "/community-guidelines" },
    ],
  },
];

/**
 * App-store availability. Until a listing exists, `url` stays null and the
 * button renders as an elegant "Coming soon". Publishing later is a one-line
 * change: set `url` and flip `available` to true.
 */
export const APP_STORES = {
  googlePlay: {
    label: "Google Play",
    url: null as string | null,
    available: false,
  },
  appStore: {
    label: "App Store",
    url: null as string | null,
    available: false,
  },
} as const;

/** Routes emitted into the sitemap, with relative priority. */
export const SITEMAP_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/download", priority: 0.9 },
  { path: "/how-it-works", priority: 0.8 },
  { path: "/for-customers", priority: 0.8 },
  { path: "/for-providers", priority: 0.8 },
  { path: "/become-a-provider", priority: 0.8 },
  { path: "/help", priority: 0.8 },
  { path: "/safety", priority: 0.7 },
  { path: "/support", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/privacy", priority: 0.5 },
  { path: "/terms", priority: 0.5 },
  { path: "/community-guidelines", priority: 0.5 },
];
