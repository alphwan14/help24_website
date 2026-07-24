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

const escrowSteps = [
  {
    title: "You pay into escrow",
    body: "When you pay through Help24, your money is held securely instead of going straight to the provider.",
  },
  {
    title: "The work gets done",
    body: "The provider completes the job, or agreed milestones, while the funds stay protected.",
  },
  {
    title: "Funds are released",
    body: "You release payment when you're satisfied. If something goes wrong, funds can be paused while it's resolved.",
  },
];

const safeguards = [
  {
    icon: "shield",
    title: "Payment protection",
    body: "Escrow keeps your money safe until the work is complete — no pay-first, no runaround.",
  },
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
        title="How escrow works"
        intro="Your money is only released when the work is done."
      >
        <Steps steps={escrowSteps} />
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
