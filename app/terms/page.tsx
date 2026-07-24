import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { LegalBody, type LegalSection } from "@/components/LegalBody";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your use of Help24 — your responsibilities, our role as a marketplace, payments and payment protection.",
  path: "/terms",
});

const LAST_UPDATED = "25 July 2026";

const mail = <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>;

const sections: LegalSection[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    body: (
      <p>
        By using Help24, you agree to these Terms of Service. If you do not agree,
        please do not use the app. We may update these terms from time to time;
        continued use after changes means you accept the updated terms.
      </p>
    ),
  },
  {
    id: "responsibilities",
    heading: "2. User Responsibilities",
    body: (
      <>
        <p>
          You are responsible for the accuracy of the information you post and for
          your conduct on the platform. In particular:
        </p>
        <ul>
          <li>You must be at least 18 years old to use Help24.</li>
          <li>
            You may not use the app for any illegal purpose or to harm others.
          </li>
          <li>
            You are responsible for keeping your account and credentials secure.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "platform-role",
    heading: "3. Platform Role",
    body: (
      <p>
        Help24 is an intermediary that connects people who need services with
        people who offer them. We do not employ service providers and we do not
        guarantee the quality of any work. Any agreement is strictly between you
        and the other user. We are not liable for disputes, the quality of a
        service, or payments made outside the app.
      </p>
    ),
  },
  {
    id: "payments",
    heading: "4. Payments & Payment Protection",
    body: (
      <p>
        When you pay through Help24, we may hold your money safely (in escrow)
        until the work is completed or released according to your agreement. Fees
        may apply as stated in the app and are always shown before you confirm.
        Refunds are subject to our refund policy and the specific circumstances of
        the transaction. Payment protection only applies to payments made through
        the app.
      </p>
    ),
  },
  {
    id: "prohibited",
    heading: "5. Prohibited Activities",
    body: (
      <>
        <p>You may not:</p>
        <ul>
          <li>Post false or misleading content.</li>
          <li>Harass, threaten or abuse other users.</li>
          <li>Use the app for fraud or money laundering.</li>
          <li>Post illegal services or content.</li>
          <li>Circumvent our safety or payment systems.</li>
          <li>Create multiple accounts to abuse the platform.</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these terms.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    heading: "6. Contact",
    body: (
      <p>
        For questions about these terms, contact us at {mail} or through the app.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="The ground rules that keep Help24 fair and safe for everyone — customers and providers alike."
        align="left"
      />
      <LegalBody sections={sections} lastUpdated={LAST_UPDATED} />
    </SitePage>
  );
}
