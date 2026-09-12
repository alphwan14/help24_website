import Link from "next/link";
import { CategoryIcon } from "@/components/ds/CategoryIcon";
import { SERVICES, serviceBySlug, withArticle } from "@/lib/services";
import { CITY_PAGES } from "@/lib/places";

/**
 * The homepage's one navigational section.
 *
 * WHY IT EXISTS. Everything above it on the homepage is the story — the hero,
 * the situations, the trust triad, the app. All of it converges on a single
 * action, "get the app", and until now the only routes deeper into the site
 * were the header bar and the footer. That is fine for a five-page brochure and
 * wrong for a site with ninety pages: a crawler arriving at the homepage found
 * almost nothing to follow, and so did a visitor who wanted to check whether
 * Help24 covers their trade or their town before downloading anything.
 *
 * WHY THESE TWELVE SERVICES. The ones with genuine local search intent — the
 * come-to-my-house trades — in catalogue order, which is the app's order. Not a
 * ranking, and not a claim that these are the busiest; there is no data that
 * would support either. The full list is one link away.
 *
 * THE ANCHOR TEXT IS THE SERVICE NAME IN A REAL LINK, not a keyword block. Six
 * cities, twelve services and two hubs is a section; sixty of each is the link
 * farm that Google's spam policies describe, and it would look like one too.
 */

const FEATURED = [
  "plumbing",
  "electrical",
  "house-cleaning",
  "carpentry",
  "painting",
  "appliance-repair",
  "ac-repair",
  "mechanic",
  "moving-services",
  "masonry",
  "welding",
  "gardening",
].map((slug) => serviceBySlug(slug)!);

export function Explore() {
  return (
    <section className="border-t border-border py-section">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-2xl text-[clamp(1.9rem,5.2vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-text-primary">
          What do you need done?
        </h2>
        <p className="mt-4 max-w-prose text-body-lg leading-relaxed text-text-secondary">
          Each of these has a page explaining what the job involves, what to put in your request,
          and what moves the price — before you download anything.
        </p>

        <ul className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="flex items-center gap-3 rounded-card border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-tag bg-primary/10 text-primary">
                  <CategoryIcon name={s.icon} size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-body font-semibold text-text-primary">
                    {s.category}
                  </span>
                  <span className="block truncate text-body-sm text-text-secondary">
                    Find {withArticle(s.worker)} near you
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-8 border-t border-border pt-10 sm:grid-cols-2">
          <div>
            <h3 className="text-body-lg font-semibold text-text-primary">Where Help24 works</h3>
            <p className="mt-2 text-body leading-relaxed text-text-secondary">
              Every Kenyan city and all 47 county headquarters are in the app.{" "}
              {CITY_PAGES.length} have a page of their own:{" "}
              {CITY_PAGES.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && (i === CITY_PAGES.length - 1 ? " and " : ", ")}
                  <Link
                    href={`/areas/${c.id}`}
                    className="text-primary-bright hover:underline"
                  >
                    {c.name}
                  </Link>
                </span>
              ))}
              .
            </p>
          </div>
          <div>
            <h3 className="text-body-lg font-semibold text-text-primary">
              Everything else, and how to hire well
            </h3>
            <p className="mt-2 text-body leading-relaxed text-text-secondary">
              See{" "}
              <Link href="/services" className="text-primary-bright hover:underline">
                all {SERVICES.length} services
              </Link>
              , or read the{" "}
              <Link href="/guides" className="text-primary-bright hover:underline">
                guides on hiring in Kenya
              </Link>{" "}
              — writing a request that gets good offers, checking a fundi&apos;s credentials,
              and what to agree before work starts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
