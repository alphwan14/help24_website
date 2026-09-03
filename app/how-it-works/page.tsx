import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { ContentSection, Steps, CtaBand } from "@/components/content";
import { MarketplaceProvider } from "@/components/home/MarketplaceContext";
import { TaskComposer } from "@/components/home/TaskComposer";
import { TwoSided } from "@/components/home/TwoSided";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How Help24 Works",
  description:
    "Write a job, see what it looks like to a provider, and follow it from posted to paid. The full Help24 flow, with a sandbox you can use.",
  path: "/how-it-works",
});

/**
 * The page that is allowed to take its time.
 *
 * The homepage answers "what is this" in fifteen seconds and hands off. This is
 * where somebody who wants to actually understand the mechanics ends up, so the
 * three heaviest interactive modules on the site now live here rather than
 * competing with the hero:
 *
 *   TaskComposer — write a real job in three steps and watch it become a card
 *   TwoSided     — the same board, from the customer's side and the provider's
 *   BeforeAfter  — one leaking sink, solved the old way and the Help24 way
 *
 * They were built for the homepage and were good there; there were simply four
 * demonstrations above the fold and no page can carry that. Nothing was
 * rewritten in the move — the composer still lands its card on the board below
 * it, which is why `MarketplaceProvider` wraps both.
 *
 * WHAT IS NOT HERE, AND WHY. `providerSteps` — "Create your profile / Find work
 * near you / Deliver and get paid" — was a near-verbatim copy of the three
 * steps on /for-providers. One page owns that argument; this one links to it.
 */
const customerSteps = [
  {
    title: "Post what you need",
    body: "Describe the task, add photos and set your location. It takes less than a minute.",
  },
  {
    title: "Compare and choose",
    body: "Providers near you respond with their own price and a message. Compare the offers, look at each profile, and pick one — nobody is assigned to you.",
  },
  {
    title: "Pay securely, get it done",
    body: "Pay through the app with M-Pesa. Your money is held until you confirm the work is complete.",
  },
];

export default function HowItWorksPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="How it works"
        title="Simple, from post to paid"
        description="Three steps for a customer, one board for both sides, and a price agreed before anyone starts."
      />

      <ContentSection eyebrow="For customers" title="Get help in three steps">
        <Steps steps={customerSteps} />
      </ContentSection>

      {/* One marketplace state for both modules: what the composer produces
          lands on the board the toggle controls, which is the whole reason
          they sit next to each other. */}
      <MarketplaceProvider>
        <TaskComposer />
        <TwoSided />
      </MarketplaceProvider>

      <BeforeAfter />

      <ContentSection title="The rest of it" className="bg-surface">
        <div className="mx-auto max-w-prose space-y-4 text-body-lg text-text-secondary">
          <p>
            Offering a service instead?{" "}
            <Link href="/for-providers" className="text-primary-bright hover:underline">
              For providers
            </Link>{" "}
            covers how listings, offers and payouts work from that side.
          </p>
          <p>
            Want to see what happens to the money?{" "}
            <Link href="/#escrow" className="text-primary-bright hover:underline">
              Watch it move
            </Link>{" "}
            on the homepage, or read the detail — including disputes and refunds — on{" "}
            <Link href="/safety" className="text-primary-bright hover:underline">
              Safety &amp; Escrow
            </Link>
            .
          </p>
        </div>
      </ContentSection>

      <CtaBand
        title="Ready to get started?"
        description="Download the app to post a task or offer your services today."
        primary={{ href: "/download", label: "Download the app" }}
        secondary={{ href: "/safety", label: "How we keep you safe" }}
      />
    </SitePage>
  );
}
