import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { LegalBody, type LegalSection } from "@/components/LegalBody";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Community Guidelines",
  description:
    "The standards that keep Help24 safe, fair and trustworthy for everyone — customers and providers alike.",
  path: "/community-guidelines",
});

const LAST_UPDATED = "25 July 2026";

const sections: LegalSection[] = [
  {
    id: "respect",
    heading: "1. Treat everyone with respect",
    body: (
      <p>
        Help24 is for everyone. Communicate politely and professionally.
        Harassment, threats, hate speech, discrimination and abusive behaviour of
        any kind are not tolerated and can result in removal from the platform.
      </p>
    ),
  },
  {
    id: "honest",
    heading: "2. Be honest and accurate",
    body: (
      <>
        <p>Trust depends on honesty. That means:</p>
        <ul>
          <li>Describe your services, requests and prices accurately.</li>
          <li>Use real photos and truthful information on your profile.</li>
          <li>Don&apos;t impersonate other people or businesses.</li>
          <li>Only leave reviews based on genuine experiences.</li>
        </ul>
      </>
    ),
  },
  {
    id: "legal-safe",
    heading: "3. Keep it legal and safe",
    body: (
      <p>
        Only post and offer services that are legal in Kenya. Do not use Help24 to
        arrange anything dangerous, fraudulent or illegal. You must be at least 18
        years old to use the platform.
      </p>
    ),
  },
  {
    id: "payments",
    heading: "4. Keep payments in Help24",
    body: (
      <p>
        Paying through the app protects both sides with payment protection and
        keeps a clear record. Never move payments off-platform for a job arranged
        on Help24 — doing so removes your protection and may indicate a scam.
      </p>
    ),
  },
  {
    id: "prohibited",
    heading: "5. What's not allowed",
    body: (
      <>
        <p>The following will lead to action on your account:</p>
        <ul>
          <li>Fraud, scams or money laundering.</li>
          <li>Posting false, misleading or illegal content.</li>
          <li>Harassing, threatening or endangering others.</li>
          <li>Circumventing our safety or payment systems.</li>
          <li>Creating multiple accounts to abuse the platform.</li>
        </ul>
      </>
    ),
  },
  {
    id: "reporting",
    heading: "6. Reporting and enforcement",
    body: (
      <p>
        If you see something that breaks these guidelines, use the{" "}
        <strong>Report</strong> option in the app or email{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>. We review
        reports and may remove content, issue warnings, or suspend or terminate
        accounts. We prioritise reports that affect safety.
      </p>
    ),
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Community"
        title="Community Guidelines"
        description="A few simple standards keep Help24 safe, fair and trustworthy for everyone."
        align="left"
      />
      <LegalBody sections={sections} lastUpdated={LAST_UPDATED} />
    </SitePage>
  );
}
