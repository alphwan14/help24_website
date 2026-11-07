import { DATA_KEY, DATA_URL } from "@/lib/provider-card";
import { parseBeacon } from "@/lib/site-events";

/**
 * First-party event beacon: POST /api/e (lib/analytics.ts sends it).
 *
 * Always answers 204 and never anything else — a beacon has nobody to read a
 * response, and a different answer for a dropped event would only teach a
 * script what is kept. The event is written through `record_site_event()`
 * (migration 137) with the publishable key, server-side, so the page itself
 * names no vendor address.
 */
export const runtime = "edge";

const NO_CONTENT = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request): Promise<Response> {
  // Beacons are tiny; anything large is not ours.
  const raw = await req.text().catch(() => "");
  if (!raw || raw.length > 2048) return NO_CONTENT();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NO_CONTENT();
  }

  const args = parseBeacon(body, req.headers.get("x-vercel-ip-country"));
  if (!args) return NO_CONTENT();

  try {
    await fetch(`${DATA_URL}/rpc/record_site_event`, {
      method: "POST",
      headers: {
        apikey: DATA_KEY,
        Authorization: `Bearer ${DATA_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
  } catch {
    // Measurement must never break a page or be retried at a visitor's cost.
  }
  return NO_CONTENT();
}
