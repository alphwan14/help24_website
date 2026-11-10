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

// Keep in step with TermsAcceptance.currentVersion in the app: the app asks
// everyone to accept again when that version changes.
const LAST_UPDATED = "10 November 2026";

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
      <>
      <p>
        When you pay through Help24, we hold your money safely (in escrow) until
        you approve the work, and the provider receives the full agreed price. The
        customer pays a payment protection fee of 5% of the job, at least KES 30 and
        never more than KES 1,000. The fee and the total are always shown before
        you confirm. Payment protection only applies to payments made through the
        app; we cannot protect cash or M-Pesa sent directly to a provider.
      </p>
      <p className="mt-3">
        When a provider marks a job as done, the customer has 48 hours to approve
        it or open a dispute in the app. We send reminders during that time. If the
        customer does neither, the job is approved automatically and the payment is
        released to the provider. Opening a dispute before then stops the release
        while our team reviews the case.
      </p>
      <p className="mt-3">
        <strong>Refunds.</strong> If a dispute is decided in the customer&apos;s
        favour, the customer gets back everything Help24 holds for the job,
        including the payment protection fee. If part of the work was done, the
        held money may be split between the customer and the provider. Refunds are
        sent by M-Pesa.
      </p>
      <p className="mt-3">
        <strong>Materials Advance.</strong> On jobs of KES 10,000 or more with a
        verified provider, the customer may choose to let 40% of the job go to the
        provider early, for materials. Nothing is sent until the customer taps Send
        in the app, and the total is the same as paying normally. Money already
        sent for materials cannot be held back; if the job fails, the customer gets
        back everything Help24 still holds, fee included, and our team follows up
        with the provider.
      </p>
      </>
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
