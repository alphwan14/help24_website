import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { HelpCentre } from "@/components/HelpCentre";
import { pageMetadata } from "@/lib/seo";


export const metadata = pageMetadata({
  title: "Help Centre",
  description:
    "Answers to common questions about Help24 — payments, escrow, jobs, accounts, safety and more. Search or browse by topic.",
  path: "/help",
});

/*
 * THE FAQPage BLOCK THAT USED TO BE HERE IS GONE.
 *
 * Google deprecated FAQ rich results. As of May 2026 the documentation is
 * withdrawn and the feature is shown only for well-known government and health
 * sites — which this is not. The markup therefore produced no result, no
 * enhancement and no reporting, and cost every visitor the bytes of every
 * question and answer serialised a second time into the page.
 *
 * The FAQ content itself is untouched. It is real, it is useful, and as ordinary
 * headed prose it is exactly what both readers and the AI surfaces consume —
 * neither of which needed the markup to find it. See lib/jsonld.ts for the full
 * rule on which schema types this site emits.
 */
export default function HelpPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Help Centre"
        title="How can we help?"
        description="Search our guides or browse by topic. Still stuck? Our team is one message away."
      />
      <HelpCentre />
    </SitePage>
  );
}
