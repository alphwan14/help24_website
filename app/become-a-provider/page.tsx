import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { StoreButtons } from "@/components/StoreButtons";
import { ContentSection, Steps, FeatureGrid, CheckList, CtaBand } from "@/components/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Become a Provider",
  description:
    "Start earning on Help24. Create your profile, find work near you and get paid securely with M-Pesa. Free to join.",
  path: "/become-a-provider",
});

const steps = [
  {
    title: "Download & sign up",
    body: "Get the app and create your account with your phone number in seconds.",
  },
  {
    title: "Build your profile",
    body: "Add your profession, skills, photos and a bio. Set your M-Pesa payout number.",
  },
  {
    title: "Start earning",
    body: "Apply to jobs and post offers. Get paid securely when the work is done.",
  },
];

const reasons = [
  {
    icon: "search",
    title: "Customers, ready now",
    body: "Reach people actively looking for your service across Kenya.",
  },
  {
    icon: "wallet",
    title: "Secure, reliable payouts",
    body: "Get paid to your M-Pesa number, protected by escrow until the job is done.",
  },
  {
    icon: "badge",
    title: "A reputation that grows",
    body: "Every completed job builds ratings and reviews that win you more work.",
  },
];

const requirements = [
  "18 or older with a valid phone number",
  "An M-Pesa number to receive payouts",
  "The skills and tools to deliver your service",
  "A commitment to honest listings and great service",
];

export default function BecomeAProviderPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Become a provider"
        title="Turn your skills into a growing business"
        description="Set up your provider profile before Help24 opens, so your listing is live from day one. Free to join — you only succeed when your customers do."
      >
        <div className="flex flex-col items-center gap-3">
          <StoreButtons className="justify-center" />
          <p className="text-body-sm text-text-tertiary">
            Launching soon on Google Play and the App Store.
          </p>
        </div>
      </PageHero>

      <ContentSection title="Why build your business here">
        <FeatureGrid items={reasons} />
      </ContentSection>

      <ContentSection
        eyebrow="Getting started"
        title="Up and running in three steps"
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
        title="Start earning on Help24"
        description="Download the app and create your provider profile today."
        primary={{ href: "/download", label: "Download the app" }}
        secondary={{ href: "/for-providers", label: "Learn more" }}
      />
    </SitePage>
  );
}
