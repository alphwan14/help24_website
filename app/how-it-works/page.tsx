import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { ContentSection, Steps, CtaBand } from "@/components/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How Help24 Works",
  description:
    "From posting a task to paying securely — see how Help24 connects customers with trusted local providers in a few simple steps.",
  path: "/how-it-works",
});

/**
 * WHAT WAS CUT FROM THIS PAGE, AND WHERE IT WENT.
 *
 * `providerSteps` — "Create your profile / Find work near you / Deliver and
 * get paid" — was a near-verbatim copy of the three steps on /for-providers.
 * One page owns that argument now, and this one links to it.
 *
 * `pillars` — payment protection, ratings, messaging, reporting — repeated
 * claims the homepage now demonstrates rather than asserts: the escrow
 * scrubber operates the first, and the walkthrough shows the middle two on the
 * actual screens. Reporting lives on /safety, which is where someone with a
 * problem is already heading.
 *
 * What is left is the one thing this page is for: the customer's path,
 * described once.
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
        description="Help24 makes finding help — or finding work — fast, fair and secure. Here's how it fits together."
      />

      <ContentSection eyebrow="For customers" title="Get help in three steps">
        <Steps steps={customerSteps} />
      </ContentSection>

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
              Drag through the four stages
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
