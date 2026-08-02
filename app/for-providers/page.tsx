import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import {
  ContentSection,
  FeatureGrid,
  Steps,
  CheckList,
  CtaBand,
} from "@/components/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "For Providers",
  description:
    "Grow your business on Help24. Reach customers who need you, build a trusted reputation and get paid securely with M-Pesa.",
  path: "/for-providers",
});

/**
 * "Get paid securely" was here too, saying what the homepage escrow scrubber
 * now does — a visitor can drag the money through all four stages themselves.
 * Repeating it as a tile added a claim and removed nothing, so it is gone and
 * the section below links to the working version instead.
 */
const benefits = [
  {
    icon: "search",
    title: "Customers come to you",
    body: "People post what they need and you answer with your price. No cold calls, no chasing referrals, no paying for leads.",
  },
  {
    icon: "badge",
    title: "Build your reputation",
    body: "Every completed, paid job adds to your rating. It is tied to real work, which is what makes it worth something.",
  },
  {
    icon: "sparkle",
    title: "Promote your services",
    body: "Feature a listing with Promote Business to put it in front of more customers.",
  },
];

const steps = [
  {
    title: "Set up your profile",
    body: "Add your profession, skills, photos and a clear bio.",
  },
  {
    title: "Apply to jobs",
    body: "Browse requests near you and apply with your price.",
  },
  {
    title: "Deliver and earn",
    body: "Do great work and get paid to your M-Pesa number.",
  },
];

const requirements = [
  "Be 18 or older with a valid phone number",
  "An M-Pesa number for payouts",
  "The skills and tools to deliver your service well",
  "A commitment to honest listings and great service",
];

export default function ForProvidersPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="For providers"
        title="Grow your business on Help24"
        description="List what you do, answer the jobs that suit you, and get paid to M-Pesa when the work is done — all from your phone."
      />

      <ContentSection title="Why work through Help24">
        <FeatureGrid items={benefits} columns={2} />
        <p className="mx-auto mt-8 max-w-prose text-body-lg text-text-secondary">
          Payment is held by Help24 from the moment the customer accepts your price, so you know the
          money exists before you travel.{" "}
          <Link href="/#escrow" className="text-primary-bright hover:underline">
            See what happens to it
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection
        eyebrow="Getting started"
        title="Start earning in three steps"
        className="bg-surface"
      >
        <Steps steps={steps} />
      </ContentSection>

      <ContentSection title="What you'll need">
        <div className="mx-auto max-w-prose">
          <CheckList items={requirements} />
        </div>
      </ContentSection>

      <CtaBand
        title="Ready to grow?"
        description="Create your provider profile and start receiving work today."
        primary={{ href: "/become-a-provider", label: "Become a provider" }}
        secondary={{ href: "/download", label: "Download the app" }}
      />
    </SitePage>
  );
}
