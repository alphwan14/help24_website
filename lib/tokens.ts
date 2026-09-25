/**
 * Help24 design tokens — the website's view of the app's design system.
 *
 * ── What changed, and why it matters ────────────────────────────────────────
 * This file used to open by calling itself "THE single source of truth for the
 * website", and three lines later explain that every value in it "was read out
 * of the Flutter app". Both were true, and together they were the defect: the
 * transcription was a HUMAN. So when the app re-toned, the website went on
 * confidently serving a palette the product had already retired — `#6265F0`
 * indigo, `#22D3EE` cyan, and a block faithfully reproducing duplicate status
 * colours the app had deleted.
 *
 * Nothing in either file was wrong. The integration was.
 *
 * The values now arrive from `design-tokens.generated.json`, written out of
 * `mobile-app/lib/theme/tokens.dart` by
 * `mobile-app/test/design_tokens_export_test.dart`. That test also FAILS on
 * drift, so the app and this file cannot disagree without the app's suite going
 * red. Do not edit the generated file; regenerate it:
 *
 *     cd mobile-app && flutter test test/design_tokens_export_test.dart \
 *       --dart-define=update_tokens=true
 *
 * ── Why the names here did not change ───────────────────────────────────────
 * The app's vocabulary is role-based (`actionFill`, `contentPrimary`); this
 * file's is surface-based (`card`, `primary`). Adopting the app's names would
 * have rewritten ~1,598 Tailwind colour classes for no user-visible gain. So
 * the NAMES stay a stable internal API and only the VALUES are synchronised —
 * through [ROLE] below, which is the one mapping a human maintains.
 *
 * Nothing downstream may hard-code a hex. Components read Tailwind classes
 * (generated from the palette in tailwind.config.ts) or the CSS custom
 * properties emitted by `tokensCss()` in app/layout.tsx.
 */
import generated from "./design-tokens.generated.json";

/* ────────────────────────────────────────────────────────────────────────────
 * COLOUR
 * ──────────────────────────────────────────────────────────────────────────── */

const APP = generated.color;

/** Every colour role the app defines. */
type AppRole = keyof typeof generated.color.light;

/**
 * THE MAP. Website token → app role, and the only place the two vocabularies
 * meet.
 *
 * ── Three entries carry the brand change ────────────────────────────────────
 * `primary`, `primary-bright` and `secondary` all resolve to the SAME amber
 * accent. That is deliberate, and it is the point of the exercise rather than a
 * collision to resolve:
 *
 *   • indigo `#6265F0` and cyan `#22D3EE` appear in no Help24 asset. The brand
 *     mark contains ink, amber and warm paper, and the app now uses those.
 *   • `primary-bright` existed ONLY because indigo measured 4.37:1 on dark and
 *     needed a lighter twin. A theme-resolved accent removes the reason for it,
 *     so the name survives as an alias rather than as a concept. Fifty-eight
 *     call sites keep working and mean something slightly better than before.
 *   • `secondary` was a second competing accent. Help24 has one. It cost 13
 *     call sites to collapse.
 *
 * ── Why `action` is not `primary` ───────────────────────────────────────────
 * This is the one place the web vocabulary was genuinely missing a word. The
 * accent cannot also be the button, and that is measured, not stylistic:
 *
 *     white on `accentText`, dark theme ........ 2.16:1   ✗
 *     `contentOnAction` on `actionFill` ........ 17.18:1  ✓
 *
 * `primary` was doing three jobs — the accent text, the `/10` tint behind a
 * badge, and the solid button fill. The first two are what `accentText` is for;
 * the third is what `action` is for. The app hit this same wall, which is why
 * `actionFill` and `accentText` are separate roles there.
 */
const ROLE = {
  /* Surfaces */
  page: "page",
  /** Compatibility alias for `page`, kept because class names spell it. */
  "bg-dark": "page",
  /** The quieter band: footer, inset panels. */
  surface: "surfaceSunken",
  card: "surface",
  "card-hover": "surfaceRaised",
  border: "borderHairline",
  /** The boundary meant to be SEEN — a secondary button's outline. 3:1. */
  "border-strong": "borderStrong",

  /* The one action. See the note above. */
  action: "actionFill",
  "on-action": "contentOnAction",

  /* The accent, as a FILL and as a tint — for marks that carry no text. */
  accent: "accentFill",
  "accent-subtle": "accentSubtle",
  "on-accent": "contentOnAccent",

  /* The accent, as TEXT. Legible in both themes, which is the whole job. */
  primary: "accentText",
  "primary-bright": "accentText",
  secondary: "accentText",

  /* Semantic roles. Text-safe values: these names are set in LETTERS far more
     often than they are used as fills, and the app's `*Text` variants are the
     ones measured for that. `*Fill` is reached through `accent`-style tokens
     when a solid is genuinely wanted. */
  money: "positiveText",
  success: "positiveText",
  warning: "cautionText",
  error: "criticalText",
  info: "infoText",

  /* Content */
  "text-primary": "contentPrimary",
  "text-secondary": "contentSecondary",
  "text-tertiary": "contentTertiary",

  /* Controls */
  "pill-inactive": "neutralSubtle",
  "pill-inactive-border": "borderHairline",
} as const satisfies Record<string, AppRole>;

type WebToken = keyof typeof ROLE;

/** One theme, resolved through [ROLE]. */
function themePalette(theme: "light" | "dark"): Record<WebToken, string> & {
  white: string;
} {
  const src = APP[theme];
  const out = {} as Record<WebToken, string>;
  for (const key of Object.keys(ROLE) as WebToken[]) {
    out[key] = src[ROLE[key]];
  }
  // Not a token: an absolute. White on a known dark fill is a legitimate
  // choice that must not follow the theme.
  return { ...out, white: "#FFFFFF" };
}

/**
 * The palettes. Both are COMPLETE — neither is a diff over the other.
 *
 * Light used to be a partial override map on top of a dark base, which made
 * dark the file's implicit default while the site rendered light. Whatever
 * `tokensCss()` emits first is the theme a reader assumes is primary, and the
 * two should not disagree.
 */
export const LIGHT = themePalette("light");
export const DARK = themePalette("dark");

export type PaletteKey = keyof typeof LIGHT;

/**
 * DARK, under its historical name.
 *
 * Retained for the one surface that renders outside a browser and therefore
 * cannot resolve a CSS custom property: the OG image (satori), which is
 * dark-only. Everything that runs in a browser should read a Tailwind class or
 * a custom property instead, so that it follows the theme.
 */
export const PALETTE = DARK;

/* ────────────────────────────────────────────────────────────────────────────
 * SHAPE + TYPE
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Radius scale, in px. The NAMES are the website's (183 `rounded-*` classes
 * spell them); the VALUES come from the app's scale.
 *
 * The app converged on five rungs — 8 / 12 / 16 / 24 / 999 — after finding 19
 * distinct radii across 291 call sites, most of which were not really different
 * radii at all but one intention ("half my own height") written many ways. The
 * eight names below therefore resolve onto five values, and two pairs are now
 * deliberately identical:
 *
 *   tag + badge   → 8    small chips and tags are one thing
 *   thumb + button → 12  controls and thumbnails are one thing
 *   chip + pill + full → 999  a capsule is a capsule
 *
 * Duplicates are kept rather than collapsed because collapsing them means
 * editing call sites to no visible end — the same reason the colour token
 * names did not change. See `docs/design/web-token-sync.md`.
 */
export const RADIUS = {
  tag: 8, // AppRadius.sm
  badge: 8, // AppRadius.sm
  thumb: 12, // AppRadius.md
  button: 12, // AppRadius.md
  card: 16, // AppRadius.lg
  sheet: 24, // AppRadius.sheet — the top of a modal surface
  chip: 999, // AppRadius.pill
  pill: 999, // AppRadius.pill
  full: 999, // AppRadius.pill
} as const;

/*
 * There is deliberately no LOGO_CORNER_RATIO here any more.
 *
 * It existed because the previous mark was a plain square and the site rounded
 * it in CSS at 20.5%, measured off the app's launch badge. The current artwork
 * arrives with its boundary already drawn — a superellipse, not a rounded
 * rectangle — and ships with transparent corners, so the shape travels with the
 * file. A CSS radius on top of it would cut a second, disagreeing curve across
 * the artwork's own edge, which is why every call site lost it rather than
 * having the number retuned. See scripts/generate-logo.mjs.
 */

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
 * Typography.
 *
 * ── The face comes from the app ─────────────────────────────────────────────
 * The website was on Poppins because the app was. The app bundles **Inter** now
 * — Poppins is a geometric display face and Inter a neo-grotesque UI face, and
 * at body sizes on a dense marketplace listing they are not interchangeable.
 * `next/font/google` already downloads at build time and self-hosts, so only
 * the face changes and nothing about the hosting does.
 *
 * ── The SIZES are deliberately NOT the app's ────────────────────────────────
 * `AppTypeScale` tops out at 28px because it is designed for a phone. A 1440px
 * marketing page is a different problem, and forcing the phone's ramp onto it
 * would be a redesign wearing a synchronisation's clothes. The website keeps
 * its own scale (see `fontSize` in tailwind.config.ts); what it shares with the
 * app is the typeface, the weights and the restraint about them.
 *
 * Weights match what is actually bundled for the app: 400 / 500 / 600 / 700.
 */
export const TYPE = {
  family: generated.type.family,
  weights: [400, 500, 600, 700] as const,
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
/*
 * The `urgency-*` tokens these used to point at are gone.
 *
 * They were half of a block this file called STATUS_COLOR_CONFLICT: six values
 * that existed ONLY to faithfully reproduce duplicate palettes the app was
 * carrying, where a card could show a `Soon` tag in `#FF9800` beside a
 * `Payment Protected` tag in `#F59E0B` — two ambers, two pixels apart. The app
 * deleted those duplicates. Reproducing a conflict that no longer exists is
 * not fidelity.
 *
 * Urgency now reads through the SEMANTIC roles, exactly as the app's `AppChip`
 * does: urgent is critical, soon is caution, flexible is positive.
 */
export const URGENCY = [
  { key: "urgent", label: "Urgent", token: "error" },
  { key: "soon", label: "Soon", token: "warning" },
  { key: "flexible", label: "Flexible", token: "success" },
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
/*
 * POST TYPE IS NOT COLOUR-CODED ANY MORE.
 *
 * `type-request` / `type-offer` / `type-job` were Material 2014 blue, green and
 * purple — three hues that told a reader nothing they could not read in the
 * word itself, and that competed with the semantic roles for attention. The app
 * now renders the type typographically: `REQUEST · Plumbing`, small, tertiary,
 * with the category glyph. The website follows.
 *
 * The token is `text-tertiary` for all three because the LABEL is the signal.
 */
export const POST_TYPES = [
  { key: "request", label: "Request", token: "text-tertiary" },
  { key: "offer", label: "Offer", token: "text-tertiary" },
  { key: "job", label: "Job", token: "text-tertiary" },
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
  const radii = Object.entries(RADIUS)
    .map(([name, px]) => `--radius-${name}:${px}px`)
    .join(";");

  // Both palettes are complete, so neither is spread over the other. Light
  // used to be `{...PALETTE, ...LIGHT}` — a diff over a dark base — which meant
  // a token missing from the override map silently shipped its dark value on a
  // light page. There is nothing to forget now.
  const lightBlock = themeBlock(LIGHT, SHADOWS.light);
  const darkBlock = themeBlock(DARK, SHADOWS.dark);

  return [
    `:root{color-scheme:light;${lightBlock};${radii}}`,
    `@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;${darkBlock}}}`,
    `:root[data-theme="dark"]{color-scheme:dark;${darkBlock}}`,
  ].join("");
}
