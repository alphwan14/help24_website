/**
 * Help24 design tokens — THE single source of truth for the website.
 *
 * Every value here was read out of the Flutter app (mobile-app/lib) so the web
 * and the phone are the same product. The Flutter side is read-only: nothing in
 * this repo writes back to it, and when the app changes, this file is what gets
 * updated.
 *
 * Provenance is recorded per group. Where the app contains two competing
 * definitions of "the same" colour, BOTH are kept and named separately rather
 * than silently merged — see URGENCY vs STATUS below.
 *
 * Nothing downstream may hard-code a hex value. Components read Tailwind
 * classes (generated from PALETTE in tailwind.config.ts) or the CSS custom
 * properties emitted by `tokensCss()` in app/layout.tsx.
 */

/* ────────────────────────────────────────────────────────────────────────────
 * COLOUR
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Flat palette. The keys are the Tailwind colour names AND the CSS custom
 * property names (`--primary`, `--bg-dark`, …), so there is exactly one
 * spelling of every colour across the whole site.
 */
export const PALETTE = {
  /* Surfaces — AppTheme.dark* (lib/theme/app_theme.dart:6-10) */
  "bg-dark": "#0A0A0A", // scaffoldBackgroundColor — the near-black page
  surface: "#141414", // darkSurface — bottom nav, footer
  card: "#1C1C1E", // darkCard — every feed card, input fill
  "card-hover": "#252528", // darkCardHover
  border: "#2C2C30", // darkBorder — the 1px card boundary

  /* Accents — AppTheme (app_theme.dart:19-23) */
  primary: "#6265F0", // primaryAccent — buttons, active pill, category chip, Post FAB
  /**
   * Web-only variant. `primary` on `bg-dark` measures 4.37:1, below the 4.5
   * AA threshold, so it cannot carry small TEXT on this site even though the
   * app uses it that way at 11px. Fills use `primary`; standalone text and
   * links use this (6.3:1). Deliberately NOT sent back to the app.
   */
  "primary-bright": "#818CF8",
  secondary: "#22D3EE", // secondaryAccent — gradient tail only

  /**
   * Money green. successGreen. This is the colour on `KES 500`,
   * `Budget KES 1,000` and `From KES 300` in PostCard's bottom row
   * (widgets/post_card.dart:411).
   */
  money: "#10B981",
  success: "#10B981", // same value, semantic alias for non-money success states
  warning: "#F59E0B", // warningOrange — escrow hold, "Payment Protected", Sponsored
  error: "#EF4444", // errorRed

  /**
   * Urgency. Read from PostModel.urgencyColor (models/post_model.dart:646-655)
   * — these are the values that actually render on a feed card, and they are
   * NOT AppTheme.errorRed / warningOrange / successGreen. See the note on
   * STATUS_COLOR_CONFLICT below.
   */
  "urgency-urgent": "#E53935",
  "urgency-soon": "#FF9800",
  "urgency-flexible": "#4CAF50",

  /* Post type badge — PostModel.typeBadgeColor (post_model.dart:678-684) */
  "type-request": "#2196F3", // the blue on the Request badge outline
  "type-offer": "#4CAF50",
  "type-job": "#9C27B0",

  /* Text — AppTheme.darkText* (app_theme.dart:26-28) */
  "text-primary": "#F9FAFB",
  "text-secondary": "#9CA3AF",
  "text-tertiary": "#6B7280", // "muted"

  /* Filter pill, unselected — widgets/filter_pill.dart:46-48 */
  "pill-inactive": "#242428",
  "pill-inactive-border": "#3A3A42",

  white: "#FFFFFF",
} as const;

export type PaletteKey = keyof typeof PALETTE;

/**
 * KNOWN CONFLICT, carried deliberately rather than resolved.
 *
 * The app defines each of red / amber / green TWICE, and both definitions are
 * live on the same screen:
 *
 *   role          AppTheme (theme file)      PostModel.urgencyColor (model)
 *   red           errorRed      #EF4444      urgent    #E53935
 *   amber         warningOrange #F59E0B      soon      #FF9800
 *   green         successGreen  #10B981      flexible  #4CAF50
 *
 * A feed card can show a `Soon` tag (#FF9800) and a `Payment Protected` tag
 * (#F59E0B) side by side. That is the app's current behaviour, so the website
 * reproduces it: urgency uses the `urgency-*` tokens, everything else uses the
 * AppTheme tokens. The escrow module uses `warning` / `money` because the
 * app's escrow surfaces do.
 */
export const STATUS_COLOR_CONFLICT = {
  red: { theme: PALETTE.error, urgency: PALETTE["urgency-urgent"] },
  amber: { theme: PALETTE.warning, urgency: PALETTE["urgency-soon"] },
  green: { theme: PALETTE.money, urgency: PALETTE["urgency-flexible"] },
} as const;

/* ────────────────────────────────────────────────────────────────────────────
 * SHAPE + TYPE
 * ──────────────────────────────────────────────────────────────────────────── */

/** Radius scale, in px. Sources noted per entry. */
export const RADIUS = {
  tag: 6, // _SmallTag — urgency/highlight chips (post_card.dart:557)
  badge: 8, // type + category badge (post_card.dart:162, 654)
  thumb: 10, // card media thumbnail (post_card.dart:368)
  button: 12, // elevatedButtonTheme / inputDecorationTheme (app_theme.dart:154)
  card: 16, // FeedCardTokens.radius, cardTheme (feed_card_tokens.dart:6)
  chip: 20, // chipTheme stadium (app_theme.dart:196)
  pill: 24, // FilterPill._radius (filter_pill.dart:29)
  full: 9999, // avatars
} as const;

/**
 * The corner radius of the logo tile, as a fraction of its side.
 *
 * Measured off the app's launch badge (`mobile-app/assets/splash_badge.png`):
 * a 464px white square with the corners cut at 95px — 20.5%. Expressed as a
 * percentage rather than px so a 36px header tile and a 96px download-page
 * tile are the same shape rather than the same number.
 *
 * It is not in RADIUS above because that scale is in pixels and describes UI
 * chrome; this describes one piece of artwork.
 */
export const LOGO_CORNER_RATIO = "20.5%";

/** Geometry of a feed card — FeedCardTokens (widgets/feed_card_tokens.dart). */
export const CARD_METRICS = {
  padding: 12,
  gap: 8,
  avatar: 32,
  media: 64,
  bottomMargin: 10,
  buttonMinHeight: 38,
  /** FilterPill height + inter-pill gap (filter_pill.dart:30, 36). */
  pillHeight: 42,
  pillGap: 10,
} as const;

/**
 * Typography. The app is `GoogleFonts.poppinsTextTheme` over an explicit
 * TextTheme (app_theme.dart:46-121). These are the weights actually used —
 * 400 body, 500 labels/name, 600 headings/buttons, 700 display + money + title.
 */
export const TYPE = {
  family: "Poppins",
  weights: [400, 500, 600, 700] as const,
  /** size / weight pairs that a card is built from. */
  card: {
    title: { size: 15, weight: 700, lineHeight: 1.24 }, // post_card.dart:196-201
    name: { size: 14, weight: 500 },
    money: { size: 14, weight: 700 }, // post_card.dart:410-414
    description: { size: 12.5, weight: 400, lineHeight: 1.3 },
    location: { size: 11.5, weight: 400 },
    badge: { size: 11, weight: 600 }, // type badge
    categoryBadge: { size: 11, weight: 500 },
    tag: { size: 10.5, weight: 600 }, // _SmallTag
    timestamp: { size: 12, weight: 500 },
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────────
 * STRUCTURE — enums and vocabulary lifted from the app
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * The full category list, in the app's own order and grouping.
 * Source: `Category.all` (models/post_model.dart:67-110).
 *
 * `icon` is the key into components/ds/CategoryIcon.tsx, which draws a stroke
 * equivalent of the Material glyph the app uses (named in the comment).
 */
export const CATEGORIES = [
  // Home & Property
  { name: "Plumbing", icon: "plumbing", group: "Home & Property" }, // Icons.plumbing
  { name: "Electrical", icon: "electrical", group: "Home & Property" }, // Icons.electrical_services
  { name: "Masonry", icon: "masonry", group: "Home & Property" }, // Icons.foundation
  { name: "Carpentry", icon: "carpentry", group: "Home & Property" }, // Icons.handyman
  { name: "Painting", icon: "painting", group: "Home & Property" }, // Icons.format_paint
  { name: "Welding", icon: "welding", group: "Home & Property" }, // Icons.construction
  // Cleaning & Household
  { name: "House Cleaning", icon: "cleaning", group: "Cleaning & Household" }, // Icons.cleaning_services
  { name: "Laundry", icon: "laundry", group: "Cleaning & Household" }, // Icons.local_laundry_service
  { name: "Gardening", icon: "gardening", group: "Cleaning & Household" }, // Icons.grass
  // Security & Transport
  { name: "Security Guard", icon: "security", group: "Security & Transport" }, // Icons.security
  { name: "Driver", icon: "driver", group: "Security & Transport" }, // Icons.directions_car
  { name: "Delivery Rider", icon: "delivery", group: "Security & Transport" }, // Icons.delivery_dining
  // Automotive
  { name: "Mechanic", icon: "mechanic", group: "Automotive" }, // Icons.car_repair
  { name: "Car Wash", icon: "carwash", group: "Automotive" }, // Icons.local_car_wash
  // Appliance & Tech Repair
  { name: "Appliance Repair", icon: "appliance", group: "Appliance & Tech Repair" }, // Icons.kitchen
  { name: "AC Repair", icon: "ac", group: "Appliance & Tech Repair" }, // Icons.ac_unit
  { name: "Phone Repair", icon: "phone", group: "Appliance & Tech Repair" }, // Icons.phone_android
  { name: "Computer Repair", icon: "computer", group: "Appliance & Tech Repair" }, // Icons.computer
  // Creative & Digital
  { name: "Graphic Design", icon: "design", group: "Creative & Digital" }, // Icons.brush
  { name: "Software Development", icon: "code", group: "Creative & Digital" }, // Icons.code
  { name: "Photography", icon: "photography", group: "Creative & Digital" }, // Icons.camera_alt
  { name: "Videography", icon: "videography", group: "Creative & Digital" }, // Icons.videocam
  // Events & Hospitality
  { name: "Event Planning", icon: "events", group: "Events & Hospitality" }, // Icons.celebration
  { name: "Catering", icon: "catering", group: "Events & Hospitality" }, // Icons.restaurant
  // Education & Care
  { name: "Tutoring", icon: "tutoring", group: "Education & Care" }, // Icons.school
  { name: "Babysitting", icon: "babysitting", group: "Education & Care" }, // Icons.child_care
  { name: "Caregiving", icon: "caregiving", group: "Education & Care" }, // Icons.favorite
  // Moving & Construction
  { name: "Moving Services", icon: "moving", group: "Moving & Construction" }, // Icons.move_up
  { name: "Interior Design", icon: "interior", group: "Moving & Construction" }, // Icons.chair
  { name: "Construction", icon: "construction", group: "Moving & Construction" }, // Icons.architecture
  { name: "General Labour", icon: "labour", group: "Moving & Construction" }, // Icons.engineering
  // Fallback
  { name: "Other", icon: "other", group: "Other" }, // Icons.more_horiz
] as const;

export type CategoryName = (typeof CATEGORIES)[number]["name"];
export type Category = (typeof CATEGORIES)[number];

export function categoryByName(name: string): Category {
  const hit = CATEGORIES.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
  // Mirrors Category.fromName: an unknown non-empty name keeps its label with a
  // generic glyph rather than collapsing to "Other".
  return hit ?? (CATEGORIES[CATEGORIES.length - 1] as Category);
}

/**
 * Urgency. `enum Urgency { urgent, soon, flexible }` (post_model.dart:49) with
 * the labels from `PostModel.urgencyText` and the colours from
 * `PostModel.urgencyColor`.
 */
export const URGENCY = [
  { key: "urgent", label: "Urgent", token: "urgency-urgent" },
  { key: "soon", label: "Soon", token: "urgency-soon" },
  { key: "flexible", label: "Flexible", token: "urgency-flexible" },
] as const;

export type UrgencyKey = (typeof URGENCY)[number]["key"];

export function urgency(key: UrgencyKey) {
  return URGENCY.find((u) => u.key === key)!;
}

/**
 * Post type. `enum PostType { request, offer, job }` (post_model.dart:7), with
 * `typeDisplayLabel` and `typeBadgeColor`. The website surfaces request and
 * offer; `job` is carried so the token set stays complete.
 */
export const POST_TYPES = [
  { key: "request", label: "Request", token: "type-request" },
  { key: "offer", label: "Offer", token: "type-offer" },
  { key: "job", label: "Job", token: "type-job" },
] as const;

export type PostTypeKey = (typeof POST_TYPES)[number]["key"];

export function postType(key: PostTypeKey) {
  return POST_TYPES.find((t) => t.key === key)!;
}

/** `enum PricingType` suffixes — PricingTypeExtension.shortSuffix (post_model.dart:14-22). */
export const PRICING_SUFFIX = {
  task: "",
  hour: "/hr",
  day: "/day",
  week: "/wk",
  month: "/mo",
} as const;

export type PricingKey = keyof typeof PRICING_SUFFIX;

/**
 * Verbatim button and label copy. Changing a string here changes it everywhere
 * on the site; it should only ever be changed to track the app.
 */
export const COPY = {
  /** The CTA a visitor sees on someone else's listing — post_card.dart:461-465. */
  cta: {
    request: "Offer Service",
    offer: "Enquire",
    job: "Apply",
  },
  /** Already responded — post_card.dart:445-449. */
  applied: {
    request: "Offer sent",
    offer: "Enquired",
    job: "Applied",
  },
  /** The button on your OWN listing — OwnerCta (marketplace_card_components.dart:49-93). */
  owner: {
    offer: "My Offer",
    manage: "Manage",
    /** `Applications (3)` once at least one has arrived. */
    applications: (n: number) => `Applications (${n})`,
    inProgress: "In Progress",
    completed: "Completed",
  },
  /** Discover's filter row — discover_screen.dart:229, 453-469. */
  filters: ["All", "Requests", "Offers"] as const,
  /** Discover's search field — discover_screen.dart:419-423. */
  searchHint: {
    all: "Search all posts...",
    requests: "Search requests...",
    offers: "Search offers...",
  },
  /** Bottom-nav centre action — custom_bottom_nav.dart:238. */
  post: "Post",
  /** Payment-hold tag — post_card.dart:271. The app never says "escrow" to a user. */
  paymentProtected: "Payment Protected",
} as const;

/* ────────────────────────────────────────────────────────────────────────────
 * FORMATTING
 * ──────────────────────────────────────────────────────────────────────────── */

/** `formatPriceWithCommas` — utils/format_utils.dart:8. */
export function withCommas(value: number): string {
  const v = Math.trunc(value);
  const s = Math.abs(v).toString();
  const grouped = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return v < 0 ? `-${grouped}` : grouped;
}

/** `formatPriceDisplay` — "KES 1,000". */
export function kes(value: number): string {
  return `KES ${withCommas(value)}`;
}

/**
 * The money string on a card, per intent.
 * `cardMoneyLabel` — models/attribute_display.dart:14-27.
 * Returns null when the card should show no money row at all.
 */
export function cardMoneyLabel(
  type: PostTypeKey,
  price: number,
  pricing: PricingKey = "task",
): string | null {
  const suffix = PRICING_SUFFIX[pricing];
  switch (type) {
    case "request":
      return price <= 0 ? "Open to offers" : `Budget ${kes(price)}`;
    case "offer":
      return price <= 0 ? null : `From ${kes(price)}${suffix}`;
    case "job":
      return price <= 0 ? null : `${kes(price)}${suffix}`;
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * CSS CUSTOM PROPERTIES
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * A palette colour at a given alpha, as `rgba(…)`.
 *
 * The site itself never needs this — CSS `color-mix(in srgb, var(--x) N%, …)`
 * does the same job without leaving the token layer. It exists for the two
 * places that render outside a browser and therefore cannot resolve a custom
 * property: the OG image (satori) and anything else built with inline styles at
 * build time.
 */
export function withAlpha(key: PaletteKey, alpha: number): string {
  const hex = PALETTE[key].replace("#", "");
  const n = parseInt(hex, 16);
  // eslint-disable-next-line no-bitwise
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/**
 * Emits `:root { --primary: #6265F0; … }` from PALETTE.
 *
 * Injected once by app/layout.tsx. This is why no stylesheet in this project
 * contains a hex literal: globals.css and design-system.css reference
 * `var(--name)` and the values arrive from here.
 */
export function tokensCss(): string {
  const vars = Object.entries(PALETTE)
    .map(([name, hex]) => `--${name}:${hex.toLowerCase()}`)
    .join(";");
  const radii = Object.entries(RADIUS)
    .map(([name, px]) => `--radius-${name}:${px}px`)
    .join(";");
  return `:root{${vars};${radii}}`;
}
