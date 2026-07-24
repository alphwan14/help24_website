import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { LegalBody, type LegalSection } from "@/components/LegalBody";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Help24 collects, uses, shares and protects your personal data, and the rights you have over it.",
  path: "/privacy",
});

const LAST_UPDATED = "25 July 2026";

const mail = (
  <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
);

const sections: LegalSection[] = [
  {
    id: "data-we-collect",
    heading: "1. Data We Collect",
    body: (
      <>
        <p>
          We collect the information you provide when you sign up and use Help24,
          and a limited amount of technical information needed to run the service
          safely:
        </p>
        <ul>
          <li>
            <strong>Account details</strong> — your name, email or phone number,
            and profile photo.
          </li>
          <li>
            <strong>Content you post</strong> — requests, offers, jobs, messages
            and any images you upload.
          </li>
          <li>
            <strong>Payment information</strong> — the mobile-money number you use
            for payments and payouts (handled securely).
          </li>
          <li>
            <strong>Device &amp; usage data</strong> — information about your
            device and how you use the app, to improve it and prevent abuse.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    heading: "2. How We Use Your Data",
    body: (
      <>
        <p>We use your data to run the platform and keep it safe:</p>
        <ul>
          <li>To show your profile and posts to other users.</li>
          <li>To enable messaging, payments and payment protection.</li>
          <li>To send notifications you have agreed to receive.</li>
          <li>To improve our services, fix bugs and keep the app secure.</li>
        </ul>
      </>
    ),
  },
  {
    id: "data-sharing",
    heading: "3. Data Sharing",
    body: (
      <p>
        <strong>We do not sell your personal data.</strong> We may share data with
        service providers that help us operate the app (for example, hosting and
        analytics) under strict confidentiality obligations. We may also share
        information when required by law or to protect the safety of our users.
      </p>
    ),
  },
  {
    id: "security",
    heading: "4. Security",
    body: (
      <p>
        We use industry-standard measures to protect your data, including
        encryption and secure storage. You are responsible for keeping your
        account credentials safe. If you suspect unauthorised access, please
        contact us and change your password immediately.
      </p>
    ),
  },
  {
    id: "your-rights",
    heading: "5. Your Rights",
    body: (
      <p>
        You can access and update your profile at any time in the app. You can
        request a copy of your data, or ask us to delete your account, by
        contacting {mail}. Please note that deleting your account may not remove
        all content already shared with others (for example, messages in a chat).
      </p>
    ),
  },
  {
    id: "changes",
    heading: "6. Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. We will notify you of
        significant changes in the app or by email. Continued use of Help24 after
        a change means you accept the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "7. Contact",
    body: (
      <p>
        For privacy questions or requests, contact us at {mail} or through the
        app.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Your trust matters. Here's exactly what we collect, why, and the control you have over your data."
        align="left"
      />
      <LegalBody sections={sections} lastUpdated={LAST_UPDATED} />
    </SitePage>
  );
}
