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

const benefits = [
  {
    icon: "search",
    title: "Reach ready customers",
    body: "Connect with people actively looking for your service — no cold calls or chasing referrals.",
  },
  {
    icon: "badge",
    title: "Build your reputation",
    body: "Ratings and reviews follow your profile and help you win more work over time.",
  },
  {
    icon: "wallet",
    title: "Get paid securely",
    body: "Payments are protected in escrow and released to your M-Pesa when the job is done.",
  },
  {
    icon: "sparkle",
    title: "Promote your services",
    body: "Feature a listing with Promote Business to reach even more customers.",
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
        description="Put your skills in front of customers across Kenya, build a reputation that wins work, and get paid securely — all from your phone."
      />

      <ContentSection title="Why providers choose Help24">
        <FeatureGrid items={benefits} columns={2} />
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
