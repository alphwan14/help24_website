/**
 * First-party event collection — what /api/e accepts, and how it is passed on.
 *
 * The tracker in lib/analytics.ts beacons each event here. This module turns
 * the beacon into the arguments of `record_site_event()` (migration 137 in the
 * app repository), which keeps it in Help24's own database. No cookie, no IP
 * address and no device identifier is collected or forwarded: the event, the
 * channel, a coarse platform/browser bucket, the APK version on offer, the
 * country Vercel resolves, the pathname, and — for provider-card events — the
 * member whose card it was (already in the URL; it never leaves Help24).
 *
 * The database validates everything again; this is the first filter, so junk
 * never costs a round trip.
 */

export const SITE_EVENTS = [
  "provider_card_open",
  "provider_card_open_app",
  "qr_scan",
  "download_click",
  "checksum_copy",
  "agent_open_app",
] as const;
export type SiteEvent = (typeof SITE_EVENTS)[number];

export interface RecordSiteEventArgs {
  p_event: SiteEvent;
  p_provider_id: string | null;
  p_source: "qr" | "link" | null;
  p_platform: "android" | "ios" | "desktop" | null;
  p_browser: "chrome" | "safari" | "firefox" | "edge" | "opera" | "other" | null;
  p_app_version: string | null;
  p_country: string | null;
  p_path: string | null;
}

const PLATFORMS = ["android", "ios", "desktop"] as const;
const BROWSERS = ["chrome", "safari", "firefox", "edge", "opera", "other"] as const;

function pick<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/** The beacon body → record_site_event arguments, or null to drop it. */
export function parseBeacon(body: unknown, country: string | null): RecordSiteEventArgs | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const event = pick(b.e, SITE_EVENTS);
  if (!event) return null;

  const isCard = event === "provider_card_open" || event === "provider_card_open_app";
  const provider = typeof b.p === "string" && /^[A-Za-z0-9]{20,128}$/.test(b.p) ? b.p : null;
  if (isCard && !provider) return null;

  const version = typeof b.v === "string" && /^\d+\.\d+\.\d+([+.-][A-Za-z0-9.]+)?$/.test(b.v) ? b.v.slice(0, 32) : null;
  const path = typeof b.path === "string" && /^\/[A-Za-z0-9/_.-]{0,200}$/.test(b.path) ? b.path : null;
  const cc = country && /^[A-Z]{2}$/.test(country) ? country : null;

  return {
    p_event: event,
    p_provider_id: isCard ? provider : null,
    p_source: pick(b.s, ["qr", "link"] as const),
    p_platform: pick(b.pl, PLATFORMS),
    p_browser: pick(b.b, BROWSERS),
    p_app_version: version,
    p_country: cc,
    p_path: path,
  };
}
