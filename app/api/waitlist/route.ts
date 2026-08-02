/**
 * The waitlist endpoint.
 *
 * The old footer "newsletter" form called `setSubmitted(true)` and threw the
 * address away — it said "Thanks!" to people whose email went nowhere. This
 * route is what makes the form real.
 *
 * IT NEEDS ONE ENVIRONMENT VARIABLE TO WORK. There was no existing endpoint to
 * point at, so rather than invent a datastore inside the marketing site, the
 * route forwards to whatever sink you configure:
 *
 *   WAITLIST_WEBHOOK_URL   POST target. Receives {email, source, receivedAt}
 *                          as JSON. A Supabase Edge Function, a Help24 backend
 *                          route, Formspree, Zapier — anything that accepts a
 *                          POST.
 *   WAITLIST_WEBHOOK_TOKEN Optional. Sent as `Authorization: Bearer …`.
 *   WAITLIST_COUNT_URL     Optional. GET target returning {count: number}.
 *
 * Until WAITLIST_WEBHOOK_URL is set, POST answers 503 and the form tells the
 * visitor to email support instead. That is deliberate: a form that silently
 * succeeds while discarding the address is worse than one that admits it is
 * not connected yet.
 *
 * THE COUNT IS NEVER INVENTED. With no WAITLIST_COUNT_URL the API returns
 * null and the section renders no number at all, rather than seeding one.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Deliberately permissive — rejecting valid addresses costs more than a bounce. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function POST(request: Request) {
  let payload: { email?: unknown; company?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Send JSON." }, 400);
  }

  // Honeypot. A real person never fills this in because they never see it;
  // a bot fills in everything. Answer 200 so it learns nothing.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return json({ ok: true });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return json({ ok: false, error: "That does not look like an email address." }, 400);
  }

  const target = process.env.WAITLIST_WEBHOOK_URL;
  if (!target) {
    return json(
      {
        ok: false,
        reason: "unconfigured",
        error: "The waitlist is not connected yet.",
      },
      503,
    );
  }

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.WAITLIST_WEBHOOK_TOKEN
          ? { authorization: `Bearer ${process.env.WAITLIST_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        email,
        source: "help24.co.ke/waitlist",
        receivedAt: new Date().toISOString(),
      }),
      // The visitor is waiting on this. A sink that has not answered in five
      // seconds is not going to.
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return json({ ok: false, error: "We could not save that just now." }, 502);
    }
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "We could not save that just now." }, 502);
  }
}

/**
 * The signup count, or null.
 *
 * Null is a real answer here and the UI is built to render it — no number
 * appears until there is a number worth showing.
 */
export async function GET() {
  const source = process.env.WAITLIST_COUNT_URL;
  if (!source) return json({ count: null });

  try {
    const res = await fetch(source, {
      headers: process.env.WAITLIST_WEBHOOK_TOKEN
        ? { authorization: `Bearer ${process.env.WAITLIST_WEBHOOK_TOKEN}` }
        : {},
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    if (!res.ok) return json({ count: null });
    const body = (await res.json()) as { count?: unknown };
    return json({ count: typeof body.count === "number" ? body.count : null });
  } catch {
    return json({ count: null });
  }
}
