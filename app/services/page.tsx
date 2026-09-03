import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/content";
import { Coverage } from "@/components/home/Coverage";
import { CategoryChip } from "@/components/ds/CategoryChip";
import { CATEGORIES } from "@/lib/tokens";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services on Help24",
  description:
    "Every category Help24 covers, from plumbing and electrical to tutoring, moving and phone repair — grouped as the app groups them, across Mombasa, Nairobi and Kisumu.",
  path: "/services",
});

/**
 * The full catalogue — and the reason the homepage does not have to be one.
 *
 * The homepage names six categories and a count. That is the right amount for
 * somebody deciding whether Help24 is for them. This page is for the other
 * question — "do you do X?" — which deserves a real answer rather than a
 * marketing subset, and which is also the query somebody types into a search
 * engine.
 *
 * THE LIST IS THE APP'S OWN. `Category.all` from post_model.dart, in the app's
 * order and the app's grouping, read through lib/tokens.ts. It is not curated
 * for the web and it is not sorted alphabetically: if the app adds a category,
 * this page gains it with no edit here.
 *
 * The coverage map moved here from the homepage for the same reason — "where"
 * is a question somebody asks after "what", not before it.
 */

/** The app's own grouping, in first-appearance order. */
const GROUPS = CATEGORIES.reduce<{ name: string; items: string[] }[]>((acc, c) => {
  const group = acc.find((g) => g.name === c.group);
  if (group) group.items.push(c.name);
  else acc.push({ name: c.group, items: [c.name] });
  return acc;
}, []);

export default function ServicesPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Services"
        title={`${CATEGORIES.length} categories, one board`}
        description="If it is work somebody nearby can do, it belongs on Help24. These are the categories the app itself carries."
      />

      <section className="py-section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {GROUPS.map((g) => (
              <div key={g.name}>
                <h2 className="text-section-title font-semibold text-text-primary">{g.name}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((name) => (
                    <li key={name}>
                      <CategoryChip name={name} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-prose text-body-lg text-text-secondary">
            Nothing quite right? Post it under{" "}
            <span className="font-medium text-text-primary">Other</span> and describe it in your own
            words — providers see the description, not just the label.{" "}
            <Link href="/how-it-works" className="text-primary-bright hover:underline">
              See how posting works
            </Link>
            .
          </p>
        </div>
      </section>

      <Coverage />

      <CtaBand
        title="Post it and see who answers"
        description="Free to post. You agree the price before anyone starts."
        primary={{ href: "/download", label: "Get the app" }}
        secondary={{ href: "/for-providers", label: "Offer a service" }}
      />
    </SitePage>
  );
}
