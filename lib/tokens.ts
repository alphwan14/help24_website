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

  /**
   * WEB-ONLY SURFACES. The app has no equivalent because the app has one
   * theme; the website has two and needs two names the app never needed.
   *
   * `page` is the ground the whole site stands on. In dark it is exactly
   * `bg-dark`, the app's scaffold colour. In light it is warm paper. New code
   * should say `page`; `bg-dark` stays because twenty existing class names
   * spell it that way and renaming them would be churn with nothing to show.
   *
   * `border-strong` is the boundary meant to be SEEN rather than felt.
   *
   * It outlines the secondary button, and that is what sets its value: a white
   * button on warm paper differs from its background by about 1.03:1, so the
   * outline is not decoration — it is the only thing that says a control is
   * there. WCAG asks 3:1 of anything doing that job, which is why the light
   * value is a mid warm grey (3.0:1) rather than the pale hairline that looks
   * more tasteful in isolation and disappears in use.
   */
  page: "#0A0A0A",
  /* Not the app's `darkBorder` one step up, which is what this was: at
     #3A3A42 it measured 1.8:1 on the page and could not do the one job it is
     named for. This clears 3:1 on all three dark surfaces. */
  "border-strong": "#6B6B76",

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
 * THEME
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * The light theme, as overrides on PALETTE.
 *
 * PALETTE above IS the dark theme — every value in it was read out of the
 * Flutter app, and dark is where the website and the phone are literally the
 * same colours. That parity is not negotiable, so light is expressed as a diff
 * rather than by forking the palette in two: a token absent from this map is
 * identical in both themes, and a token present here has been chosen for light
 * on purpose.
 *
 * IT IS NOT AN INVERSION. Three things are decided differently here:
 *
 *   PAPER, NOT WHITE. The ground is #FBF9F6 and the secondary band is #F4F0E9
 *   — a warm, faintly yellow grey. Cards are true white and therefore lift off
 *   it without needing a shadow to prove they are cards. A pure-white page
 *   with pure-white cards has to draw borders everywhere to stay legible, and
 *   that is what makes a light theme feel like a form.
 *
 *   TEXT-SAFE ACCENTS. #10B981 money-green is 4.9:1 on near-black and 2.1:1 on
 *   white. Amber is worse. Every colour this site puts LETTERS in is therefore
 *   darkened for light — the fills stay recognisably the same hue, the text
 *   drops a step or two down the ramp. This is the problem `primary-bright`
 *   was invented for on dark, solved the same way and in the same place.
 *
 *   BORDERS DO MORE WORK. On dark a card separates from the page by being
 *   lighter than it. On light it separates by being whiter AND by having a
 *   real edge, so `border` here is a colour you can see rather than a hairline
 *   that only registers against black.
 */
export const LIGHT: Partial<Record<PaletteKey, string>> = {
  /* Surfaces — warm paper, not sterile white. */
  page: "#FBF9F6",
  "bg-dark": "#FBF9F6", // the compatibility alias, kept in step with `page`
  surface: "#F4F0E9", // the quieter band: footer, inset panels
  card: "#FFFFFF",
  "card-hover": "#FBF8F3",
  border: "#E6E0D6",
  "border-strong": "#8F897E",

  /* Accents. The indigo FILL goes a shade deeper so white letters clear AA on
     it (5.6:1); `primary-bright` stops meaning "lighter" and starts meaning
     "the accent you may set text in", which is what it always was. */
  primary: "#5457E8",
  "primary-bright": "#4338CA",
  secondary: "#0E7490",

  /*
     Money and status, darkened until they can carry 12–14px text on white AND
     on their own tint.

     THE SECOND CONDITION IS THE BINDING ONE. These colours mostly appear as a
     badge: the label in the colour, on a 10–12% wash of the same colour. That
     wash lightens the background just enough to cost roughly a tenth of a
     point, so a value chosen against plain white lands just under AA on the
     chip it is actually used in. Amber and green are both here for that reason
     and not because they failed on white — they did not. */
  money: "#047857",
  success: "#047857",
  warning: "#AB4E08",
  error: "#DC2626",

  /* Urgency keeps the app's hues, one step down the ramp each — same tint
     arithmetic as above; Urgent already cleared it and is untouched. */
  "urgency-urgent": "#C62828",
  "urgency-soon": "#AB4E08",
  "urgency-flexible": "#2B7530",

  /* Post type badge. */
  "type-request": "#1565C0",
  "type-offer": "#2B7530",
  "type-job": "#7B1FA2",

  /* Text. Near-black rather than black — #141317 on #FBF9F6 measures 17.6:1,
     and true black on warm paper reads as a printing error.

     All three are measured against the DARKEST ground they can land on, which
     is `surface`, not `page`: tertiary at #78747F cleared AA on paper and
     missed it by a tenth on the situations band, which is exactly the sort of
     near-miss that only shows up if you check the worst case rather than the
     representative one. */
  "text-primary": "#141317",
  "text-secondary": "#55525C", // 7.3:1 on page, 7.6:1 on card, 6.7:1 on surface
  "text-tertiary": "#6E6A76",

  /* Filter pill, unselected. */
  "pill-inactive": "#F1ECE3",
  "pill-inactive-border": "#DFD7C9",
};

/**
 * WHAT WAS MEASURED, AND WHAT IS KNOWINGLY LEFT.
 *
 * Every pair the site actually paints was checked against WCAG — text at 4.5:1
 * and control boundaries at 3:1 — including the case that catches people out:
 * a badge label sits on a 10–12% wash of ITS OWN colour, not on the card, and
 * that wash costs about a tenth of a point. Several light values here are one
 * step darker than they look like they need to be for exactly that reason.
 *
 * Everything the WEBSITE owns passes in both themes. Three pairs do not, all of
 * them in dark, and all of them values read straight out of the Flutter app:
 *
 *   text-tertiary on a card        3.5:1   the app's "muted"
 *   Urgent on its own 12% tint     3.6:1   PostModel.urgencyColor
 *   Job badge on its own 10% tint  2.6:1   PostModel.typeBadgeColor
 *
 * They are carried rather than corrected because this file is a mirror of the
 * app and silently diverging would make it a worse mirror. What the website
 * does instead is refuse to put WORDS in them: `text-tertiary` is for glyphs
 * and placeholders only (there is a `primary-bright`-shaped fix available for
 * the badges if the app ever wants it, and `primary-bright` is precisely what
 * that fix looked like the last time it was needed).
 */

/**
 * Elevation, per theme.
 *
 * A shadow is not a colour and cannot live in PALETTE, but it is the token
 * that most obviously cannot be shared: on dark, depth comes from a lighter
 * surface and the shadow is nearly invisible; on light, depth IS the shadow
 * and it has to be soft, warm and layered or the card looks stamped on.
 */
export const SHADOWS = {
  dark: {
    card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)",
    lift: "0 2px 4px rgba(0,0,0,0.45), 0 16px 40px -16px rgba(0,0,0,0.75)",
    feed: "0 2px 8px rgba(0,0,0,0.2)",
  },
  light: {
    card: "0 1px 2px rgba(31,26,17,0.05), 0 8px 24px -14px rgba(31,26,17,0.18)",
    lift: "0 2px 6px rgba(31,26,17,0.07), 0 20px 44px -18px rgba(31,26,17,0.24)",
    feed: "0 1px 3px rgba(31,26,17,0.07), 0 6px 16px -10px rgba(31,26,17,0.16)",
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────────
 * CSS CUSTOM PROPERTIES
 * ──────────────────────────────────────────────────────────────────────────── */

/** `#6265F0` becomes `98 101 240`. */
function channels(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  // eslint-disable-next-line no-bitwise
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/**
 * A palette colour at a given alpha, as `rgba(…)`.
 *
 * The site itself never needs this — in a browser `rgb(var(--x-rgb) / 0.4)`
 * says the same thing and follows the theme, which a baked rgba() cannot. It
 * exists for the one surface that renders outside a browser and therefore
 * cannot resolve a custom property: the OG image (satori). That surface is
 * dark-only, so reading PALETTE directly is correct there.
 */
export function withAlpha(key: PaletteKey, alpha: number): string {
  return `rgba(${channels(PALETTE[key]).split(" ").join(",")},${alpha})`;
}

/**
 * Every token, twice: once as a colour and once as a bare `r g b` triple.
 *
 * The triple is what keeps `bg-primary/10` working. Tailwind builds an opacity
 * utility by substituting into `rgb(var(--primary-rgb) / <alpha-value>)`,
 * which it cannot do with a hex or with a `var()` holding a whole colour — so
 * without the triples, making colours theme-aware would have cost every
 * `/opacity` class on the site. Inline styles and `color-mix()` keep using the
 * plain `var(--primary)` form, which is why both are emitted.
 */
function themeBlock(map: Record<string, string>, shadows: Record<string, string>): string {
  const colours = Object.entries(map)
    .map(([name, hex]) => `--${name}:${hex.toLowerCase()};--${name}-rgb:${channels(hex)}`)
    .join(";");
  const shade = Object.entries(shadows)
    .map(([name, value]) => `--shadow-${name}:${value}`)
    .join(";");
  return `${colours};${shade}`;
}

/**
 * The stylesheet injected into <head> by app/layout.tsx.
 *
 * THE CASCADE, IN ORDER, AND WHY IT IS THIS ORDER:
 *
 *   1. `:root` is LIGHT. Light is the design's primary reference, so it is the
 *      default rather than the special case, and a browser that reports no
 *      preference lands on the theme that was drawn first.
 *   2. `prefers-color-scheme: dark` switches to dark — but only on
 *      `:root:not([data-theme="light"])`, so a visitor who has explicitly
 *      chosen light is not overruled by their operating system.
 *   3. `[data-theme="dark"]` switches to dark unconditionally, so the manual
 *      choice wins in the other direction too, on a light-preferring system.
 *
 * A tiny blocking script (components/ThemeScript.tsx) stamps `data-theme`
 * before first paint, so neither override arrives late enough to flash.
 */
export function tokensCss(): string {
  const light = { ...PALETTE, ...LIGHT };
  const radii = Object.entries(RADIUS)
    .map(([name, px]) => `--radius-${name}:${px}px`)
    .join(";");

  const lightBlock = themeBlock(light, SHADOWS.light);
  const darkBlock = themeBlock(PALETTE, SHADOWS.dark);

  return [
    `:root{color-scheme:light;${lightBlock};${radii}}`,
    `@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;${darkBlock}}}`,
    `:root[data-theme="dark"]{color-scheme:dark;${darkBlock}}`,
  ].join("");
}
