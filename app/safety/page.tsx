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
import { EscrowScrubber } from "@/components/home/EscrowScrubber";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Safety & Escrow",
  description:
    "How Help24 protects you — payment protection with escrow, verified reputations, in-app records and a responsive safety team.",
  path: "/safety",
});

/**
 * The escrow scrubber lives here now.
 *
 * It used to be on the homepage, where it was the fifth interactive module
 * above the fold. The homepage kept the argument — money moves, money stops,
 * money is released — as a thirty-second animation; this page keeps the
 * version you can drag through stage by stage, next to the thing it is really
 * for, which is somebody deciding whether to trust us with a payment.
 *
 * What follows the scrubber is what no demo covers: what happens when a job
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

      {/* Drag through the four stages. The homepage's `#escrow` section is the
          same story told in one pass; this is the one you operate. */}
      <EscrowScrubber />

      <ContentSection
        eyebrow="Payment protection"
        title="If something goes wrong"
        className="bg-surface"
        intro="Your money is only released when you say the work is done. This is what happens when you can't say that."
      >
        <Steps steps={disputeSteps} />

      </ContentSection>

      <ContentSection title="What keeps you safe">
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
