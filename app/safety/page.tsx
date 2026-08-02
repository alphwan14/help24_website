import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import {
  ContentSection,
  Steps,
  FeatureGrid,
  CheckList,
  CtaBand,
} from "@/components/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Safety & Escrow",
  description:
    "How Help24 protects you — payment protection with escrow, verified reputations, in-app records and a responsive safety team.",
  path: "/safety",
});

/**
 * The three-step escrow explainer that used to sit here is gone.
 *
 * The homepage now has a scrubber a visitor drags through all four stages, and
 * a static prose copy of the same thing on a second page is exactly the
 * repetition this rebuild set out to remove. What is kept is what the homepage
 * module does NOT cover, because it is not a demo — what happens when a job
 * goes wrong.
 */
const disputeSteps = [
  {
    title: "Raise it before you release",
    body: "If the work is not what you agreed, do not release the payment. Open a dispute from the job and the money stays where it is.",
  },
  {
    title: "Both sides are heard",
    body: "You and the provider each explain, in the same thread, with the messages and photos already attached to the job.",
  },
  {
    title: "The money moves once, and only once",
    body: "The held amount is either released to the provider or refunded to you. It is never split without both sides agreeing.",
  },
];

const safeguards = [
  {
    icon: "badge",
    title: "Trusted reputations",
    body: "Ratings, reviews and completed-job history make it easy to choose the right person.",
  },
  {
    icon: "chat",
    title: "A record of everything",
    body: "Messages and agreements stay in the app, so there's always a clear history.",
  },
  {
    icon: "safety",
    title: "Report in a tap",
    body: "Flag a suspicious post or user instantly. Our team reviews reports and acts fast.",
  },
];

const tips = [
  "Keep conversations, agreements and payments inside the app.",
  "Never send money outside Help24 for a job arranged here.",
  "Be cautious of anyone asking for advance payment or to move to another platform.",
  "Check profiles, ratings and reviews before you commit.",
  "Only share your location when you're comfortable and it's needed.",
];

export default function SafetyPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Safety & Escrow"
        title="Trust, built into every job"
        description="Help24 is designed so both sides can rely on clear rules and secure tools. Here's how we keep you protected."
      />

      <ContentSection
        eyebrow="Payment protection"
        title="If something goes wrong"
        intro="Your money is only released when you say the work is done. This is what happens when you can't say that."
      >
        <Steps steps={disputeSteps} />
        <p className="mx-auto mt-8 max-w-prose text-body-lg text-text-secondary">
          For the ordinary path — agreed, held, worked, released —{" "}
          <Link href="/#escrow" className="text-primary-bright hover:underline">
            drag through it on the homepage
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection title="What keeps you safe" className="bg-surface">
        <FeatureGrid items={safeguards} columns={2} />
      </ContentSection>

      <ContentSection
        title="Stay safe on Help24"
        intro="A few simple habits keep every job secure."
      >
        <div className="mx-auto max-w-prose">
          <CheckList items={tips} />
          <p className="mt-8 text-body text-text-secondary">
            For more, read our{" "}
            <Link href="/community-guidelines" className="text-primary hover:underline">
              Community Guidelines
            </Link>{" "}
            or the{" "}
            <Link href="/help#safety" className="text-primary hover:underline">
              Safety &amp; Trust
            </Link>{" "}
            section of the Help Centre.
          </p>
        </div>
      </ContentSection>

      <CtaBand
        title="Have a safety concern?"
        description="Report it in the app or reach our team directly — we prioritise safety."
        primary={{ href: "/support", label: "Contact Support" }}
        secondary={{ href: "/help#safety", label: "Safety help articles" }}
      />
    </SitePage>
  );
}
