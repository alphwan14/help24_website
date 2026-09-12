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

/**
 * Launch. Stated once, read by the hero badge and the waitlist section.
 *
 * There is no countdown on the site. A ticking clock is a pressure device, and
 * the one number a visitor actually needs — the date — does not need animating.
 */
export const LAUNCH = {
  /** Machine-readable, for <time datetime>. Nairobi is UTC+3. */
  iso: "2026-10-19",
  label: "19 October 2026",
  short: "19 Oct 2026",
} as const;

/**
 * Help24's own social accounts. EMPTY ON PURPOSE.
 *
 * This list used to hold twitter.com/help24, linkedin.com/company/help24 and
 * instagram.com/help24. None of them belong to this company — the Instagram
 * handle is a private individual's, display name "Kaycie" — so every page on
 * the site carried three links under the Help24 lockup pointing at strangers.
 *
 * The same three URLs were also asserted as `sameAs` in the Organization
 * schema, which told Google those accounts WERE this entity. Both are gone.
 *
 * ADD A HANDLE ONLY AFTER OPENING IT. Check that the account exists, that
 * Help24 controls it, and add it to `organizationLd()` in lib/jsonld.ts at the
 * same time — the footer and the schema should never disagree about who this
 * company is.
 */
export const SOCIALS: { label: string; href: string; mark: string }[] = [];

export type NavLink = { label: string; href: string; external?: boolean };

/**
 * Header navigation — the SECONDARY links only.
 *
 * "Get Help" and "Become a Provider" are the primary actions and are rendered
 * as controls by the header itself, not as entries here: a list that mixes
 * "Safety" with "Get Help" gives them the same visual weight, which is exactly
 * the flattening this navigation is trying to avoid.
 *
 * Four items. Contact reaches the same people as Help Centre and lives in the
 * footer; a fifth link buys nothing and costs the bar its quietness.
 */
export const HEADER_NAV: NavLink[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Services", href: "/services" },
  { label: "Safety", href: "/safety" },
  { label: "Help Centre", href: "/help" },
];

/** Footer link groups. */
export const FOOTER_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "All services", href: "/services" },
      { label: "Where we work", href: "/areas" },
      { label: "Guides", href: "/guides" },
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

/**
 * The sitemap used to be a hand-maintained array here, next to the navigation.
 * It is now derived in lib/routes.ts from the catalogues themselves, because a
 * second list of "pages that should be in Google" is a list that goes stale the
 * first time somebody adds a route and updates only one of them. That is not
 * hypothetical — /components was crawlable and absent from this array for
 * months, which is exactly the disagreement a single source removes.
 */
