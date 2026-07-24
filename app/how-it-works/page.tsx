import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { ContentSection, Steps, FeatureGrid, CtaBand } from "@/components/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How Help24 Works",
  description:
    "From posting a task to paying securely — see how Help24 connects customers with trusted local providers in a few simple steps.",
  path: "/how-it-works",
});

const customerSteps = [
  {
    title: "Post what you need",
    body: "Describe the task, add photos and set your location. It takes less than a minute.",
  },
  {
    title: "Compare and choose",
    body: "Trusted providers respond with offers. Compare ratings, reviews and prices, then pick your match.",
  },
  {
    title: "Pay securely, get it done",
    body: "Pay through the app with M-Pesa. Your money is protected until the work is complete.",
  },
];

const providerSteps = [
  {
    title: "Create your profile",
    body: "Add your profession, skills and a clear bio. A complete profile earns trust and more work.",
  },
  {
    title: "Find work near you",
    body: "Browse open requests and jobs, and apply with a message and your price.",
  },
  {
    title: "Deliver and get paid",
    body: "Do great work and get paid to your M-Pesa number when the job is done.",
  },
];

const pillars = [
  {
    icon: "shield",
    title: "Payment protection",
    body: "Funds are held in escrow and released when the job is complete — safe for both sides.",
  },
  {
    icon: "badge",
    title: "Ratings & reviews",
    body: "Every job builds a reputation, so quality rises to the top.",
  },
  {
    icon: "chat",
    title: "In-app messaging",
    body: "Agree the details, share updates and keep a record — all in one place.",
  },
  {
    icon: "safety",
    title: "Reporting & support",
    body: "Report issues in a tap and reach a real team when you need help.",
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

      <ContentSection
        eyebrow="For providers"
        title="Turn skills into income"
        className="bg-surface"
      >
        <Steps steps={providerSteps} />
      </ContentSection>

      <ContentSection
        title="Built to be trusted"
        intro="Every job on Help24 runs on the same foundations."
      >
        <FeatureGrid items={pillars} />
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
