import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { ContentSection, FeatureGrid, CtaBand } from "@/components/content";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Help24",
  description:
    "Help24 is building Kenya's trusted marketplace for local services — connecting people who need help with skilled providers, safely and simply.",
  path: "/about",
});

const values = [
  {
    icon: "shield",
    title: "Trust first",
    body: "Payment protection, verified reputations and clear rules make every interaction safer.",
  },
  {
    icon: "sparkle",
    title: "Simple by design",
    body: "Finding help — or finding work — should take minutes, not days.",
  },
  {
    icon: "badge",
    title: "Opportunity for all",
    body: "We help skilled people across Kenya turn their trade into a growing business.",
  },
  {
    icon: "check-circle",
    title: "Reliability",
    body: "A dependable platform people can count on, whether it's an emergency or an everyday task.",
  },
];

export default function AboutPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="About us"
        title="Building Kenya's trusted service marketplace"
        description={SITE.description}
        align="left"
      />

      <ContentSection>
        <div className="mx-auto max-w-prose space-y-5 text-body-lg leading-relaxed text-text-secondary">
          <p>
            Millions of skilled people across Kenya do excellent work — fundis,
            cleaners, movers, tutors and more. Yet finding the right one, agreeing
            a fair price, and paying safely has always been harder than it should
            be.
          </p>
          <p>
            <strong className="text-text-primary">Help24 exists to fix that.</strong>{" "}
            We connect people who need a service with trusted local providers, and
            we hold payments securely until the job is done — so both sides can
            transact with confidence.
          </p>
          <p>
            We started in Kenya, and we&apos;re building for Kenya first: mobile,
            M-Pesa-native and designed for how people here actually work. Our
            vision is to become the most trusted way to get things done — across
            Kenya, and in time, across Africa.
          </p>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="What we stand for"
        title="Our values"
        className="bg-surface"
      >
        <FeatureGrid items={values} columns={2} />
      </ContentSection>

      <CtaBand
        title="Join the Help24 community"
        description="Whether you need a hand or you're building your business, there's a place for you."
        primary={{ href: "/download", label: "Download the app" }}
        secondary={{ href: "/become-a-provider", label: "Become a provider" }}
      />
    </SitePage>
  );
}
