import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { ContentSection, FeatureGrid, Steps, CtaBand } from "@/components/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "For Customers",
  description:
    "Find trusted local service providers on Help24. Compare offers, agree a price and pay securely with M-Pesa — protected until the job is done.",
  path: "/for-customers",
});

const reasons = [
  {
    icon: "search",
    title: "The right help, fast",
    body: "Post a task and receive offers from providers near you — often within minutes.",
  },
  {
    icon: "badge",
    title: "Choose with confidence",
    body: "Ratings, reviews and completed-job history help you pick the right person every time.",
  },
  {
    icon: "shield",
    title: "Your money is protected",
    body: "Pay in-app with M-Pesa. Funds are held securely and only released when you're satisfied.",
  },
  {
    icon: "wallet",
    title: "Clear, upfront pricing",
    body: "Agree the price before work starts. No surprises, no awkward cash handoffs.",
  },
  {
    icon: "chat",
    title: "Everything in one place",
    body: "Message, share photos and track the job without leaving the app.",
  },
  {
    icon: "safety",
    title: "Help when you need it",
    body: "Report a problem in a tap and reach a real support team.",
  },
];

const steps = [
  {
    title: "Post your task",
    body: "Say what you need, add a photo and your location.",
  },
  {
    title: "Pick your provider",
    body: "Compare offers and profiles, then choose your match.",
  },
  {
    title: "Pay when it's done",
    body: "Release payment securely once the work is complete.",
  },
];

export default function ForCustomersPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="For customers"
        title="Get anything done, without the hassle"
        description="From a leaking tap to a big move, Help24 connects you with trusted local providers — and keeps your money safe until the job is done."
      />

      <ContentSection title="Why customers choose Help24">
        <FeatureGrid items={reasons} />
      </ContentSection>

      <ContentSection
        eyebrow="How it works"
        title="Three steps to done"
        className="bg-surface"
      >
        <Steps steps={steps} />
      </ContentSection>

      <CtaBand
        title="Find your provider today"
        description="Download Help24 and post your first task in under a minute."
        primary={{ href: "/download", label: "Download the app" }}
        secondary={{ href: "/how-it-works", label: "See how it works" }}
      />
    </SitePage>
  );
}
