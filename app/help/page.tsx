import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { HelpCentre } from "@/components/HelpCentre";
import { pageMetadata } from "@/lib/seo";
import { ALL_FAQS } from "@/lib/faq";

export const metadata = pageMetadata({
  title: "Help Centre",
  description:
    "Answers to common questions about Help24 — payments, escrow, jobs, accounts, safety and more. Search or browse by topic.",
  path: "/help",
});

export default function HelpPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <SitePage>
      <PageHero
        eyebrow="Help Centre"
        title="How can we help?"
        description="Search our guides or browse by topic. Still stuck? Our team is one message away."
      />
      <HelpCentre />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </SitePage>
  );
}
