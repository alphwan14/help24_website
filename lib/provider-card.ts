/**
 * A provider's Help24 card on the web: `help24.co.ke/p/<id>`.
 *
 * The Help24 app makes the card (Profile → Business → My Help24 card) and
 * shares it as an image with this link, or prints it as a QR code to the same
 * link with `?src=qr`. With the app installed, Android opens the link in the
 * app. This page is for everyone else: the customer a provider met at an
 * independent gig, who has never heard of Help24.
 *
 * Read on the SERVER only, from the same two public sources the app's
 * provider profile reads: the `public_profiles` view (name, photo, profession,
 * member since) and the backend's public reputation route. Nothing here needs
 * an account, and nothing here is more than the app already shows a guest.
 *
 * It says nothing about payment protection. That claim waits until a real
 * customer can pay into Help24's hold — see docs/provider-card.md in the app
 * repository.
 */

export const DATA_URL = "https://taohzhnvaitrpxcyjflq.supabase.co/rest/v1";
// The publishable key the app ships with — public by design, used here only
// server-side so the page itself carries no vendor address.
export const DATA_KEY = "sb_publishable_WQYHVfGzH-VKqkM2WLT-8A_NjQ6WeZD";
const API_URL = "https://api.help24.co.ke";

/** Refresh at most every 5 minutes: a renamed provider shows the new name soon. */
const REVALIDATE_SECONDS = 300;

export interface ProviderCard {
  id: string;
  name: string;
  profession: string;
  photoUrl: string | null;
  bio: string | null;
  memberSinceYear: string | null;
  /** "★ 4.8 (12) · 9 jobs done on Help24", "New on Help24", or null if unknown. */
  record: string | null;
}

export interface Reputation {
  average_rating?: number;
  total_reviews?: number;
  completed_jobs?: number;
}

/** A Firebase UID — the only shape of id a card link carries. */
export function isMemberId(id: string): boolean {
  return /^[A-Za-z0-9]{20,128}$/.test(id);
}

/** The record line, word for word what the app's card says. */
export function recordLine(rep: Reputation | null): string | null {
  if (!rep) return null;
  const reviews = rep.total_reviews ?? 0;
  const jobs = rep.completed_jobs ?? 0;
  const parts: string[] = [];
  if (reviews > 0) parts.push(`★ ${(rep.average_rating ?? 0).toFixed(1)} (${reviews})`);
  if (jobs > 0) parts.push(`${jobs} ${jobs === 1 ? "job" : "jobs"} done on Help24`);
  return parts.length ? parts.join(" · ") : "New on Help24";
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

async function data<T>(path: string): Promise<T[] | null> {
  try {
    const res = await fetch(`${DATA_URL}/${path}`, {
      headers: { apikey: DATA_KEY, Authorization: `Bearer ${DATA_KEY}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return res.ok ? ((await res.json()) as T[]) : null;
  } catch {
    return null;
  }
}

async function reputation(id: string): Promise<Reputation | null> {
  try {
    const res = await fetch(`${API_URL}/reputation/${encodeURIComponent(id)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return res.ok ? ((await res.json()) as Reputation) : null;
  } catch {
    return null;
  }
}

type ProfileRow = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  profession: string | null;
  bio: string | null;
  created_at: string | null;
};

/**
 * The card for `id`, or null when there is no card to show.
 *
 * A card exists only where the app would have made one: a name and a
 * profession from the Help24 list (not legacy free text). Any other member's
 * id — a customer's — gets a 404, not a page about them.
 *
 * The phone is NOT checked here, deliberately: the app counts the sign-in
 * phone as "on file" (ProviderReadiness's fallback), which `has_phone` cannot
 * see, so checking it would 404 cards the app has already handed out.
 */
export async function loadProviderCard(id: string): Promise<ProviderCard | null> {
  if (!isMemberId(id)) return null;
  const [rows, rep] = await Promise.all([
    data<ProfileRow>(
      `public_profiles?id=eq.${encodeURIComponent(id)}&select=id,name,avatar_url,profession,bio,created_at`,
    ),
    reputation(id),
  ]);
  const row = rows?.[0];
  const name = row?.name?.trim();
  const slug = row?.profession?.trim();
  if (!row || !name || !slug) return null;

  const professions = await data<{ name: string }>(
    `professions?id=eq.${encodeURIComponent(slug.toLowerCase())}&select=name`,
  );
  const profession = professions?.[0]?.name;
  if (!profession) return null;

  const year = row.created_at ? new Date(row.created_at).getUTCFullYear() : NaN;
  return {
    id,
    name,
    profession,
    photoUrl: row.avatar_url?.trim() || null,
    bio: row.bio?.trim() || null,
    memberSinceYear: Number.isFinite(year) ? String(year) : null,
    record: recordLine(rep),
  };
}
