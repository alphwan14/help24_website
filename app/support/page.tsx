import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Support",
  description:
    "Get help from the Help24 team. Email support, response times, common issue categories and emergency guidance.",
  path: "/support",
});

const issueCategories = [
  { icon: "wallet", title: "Payments & payouts", href: "/help#payments" },
  { icon: "shield", title: "Escrow & refunds", href: "/help#escrow" },
  { icon: "briefcase", title: "Jobs & applications", href: "/help#jobs" },
  { icon: "user", title: "Account & profile", href: "/help#accounts" },
  { icon: "safety", title: "Safety & reports", href: "/help#safety" },
  { icon: "wrench", title: "Technical issues", href: "/help#technical" },
];

export default function SupportPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Support"
        title="We're here to help"
        description="Check the Help Centre for instant answers, or reach our team directly. We read every message."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${SITE.supportEmail}`}
            className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95"
          >
            <Icon name="mail" className="h-4 w-4" />
            Email support
          </a>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 rounded-button border border-border bg-transparent px-5 py-3 text-body font-semibold text-text-primary transition-colors hover:bg-card/50"
          >
            <Icon name="book" className="h-4 w-4" />
            Browse Help Centre
          </Link>
        </div>
      </PageHero>

      <Section>
        {/* Contact + response expectations */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-card border border-border bg-card p-6 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-badge bg-primary/10 text-primary">
              <Icon name="mail" />
            </div>
            <h2 className="mt-4 text-h5 font-semibold text-text-primary">Email us</h2>
            <p className="mt-2 text-body text-text-secondary">
              Send us the details and any screenshots. The more we know, the faster
              we can help.
            </p>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="mt-4 inline-block text-body-lg font-medium text-primary hover:underline"
            >
              {SITE.supportEmail}
            </a>
            <p className="mt-4 flex items-center gap-2 text-body-sm text-text-tertiary">
              <Icon name="clock" className="h-4 w-4" />
              We aim to reply within {SITE.supportResponseHours} hours.
            </p>
          </div>

          {/* Live chat placeholder */}
          <div className="relative rounded-card border border-border bg-card p-6 shadow-card">
            <span className="absolute right-4 top-4 rounded-badge bg-secondary/20 px-2.5 py-1 text-label-sm font-semibold uppercase tracking-wide text-secondary">
              Coming soon
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-badge bg-secondary/20 text-secondary">
              <Icon name="chat" />
            </div>
            <h2 className="mt-4 text-h5 font-semibold text-text-primary">Live chat</h2>
            <p className="mt-2 text-body text-text-secondary">
              Real-time chat with our support team is on the way. For now, email is
              the fastest way to reach us.
            </p>
            <span
              aria-disabled="true"
              className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-button border border-border bg-transparent px-4 py-2.5 text-body font-semibold text-text-tertiary"
            >
              Start a chat
            </span>
          </div>
        </div>

        {/* Issue categories */}
        <div className="mt-14">
          <h2 className="text-h4 font-semibold text-text-primary">
            What do you need help with?
          </h2>
          <p className="mt-2 text-body text-text-secondary">
            Jump straight to answers for the most common topics.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {issueCategories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-center gap-3 rounded-card border border-border bg-card p-4 shadow-card transition-colors hover:border-primary/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-badge bg-primary/10 text-primary">
                  <Icon name={c.icon} />
                </span>
                <span className="flex-1 text-body-lg font-medium text-text-primary">
                  {c.title}
                </span>
                <Icon
                  name="arrow"
                  className="h-4 w-4 text-text-tertiary transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Emergency guidance */}
        <div className="mt-14 rounded-card border border-warning/15 bg-warning/15 p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-badge bg-warning/15 text-warning">
              <Icon name="alert" />
            </span>
            <div>
              <h2 className="text-h5 font-semibold text-text-primary">
                In an emergency
              </h2>
              <p className="mt-2 text-body text-text-secondary">
                If you are in immediate danger or a crime is in progress, contact
                your local emergency services first. For urgent safety concerns on
                Help24 — such as threats, fraud or harassment — use the{" "}
                <strong className="text-text-primary">Report</strong> option in the
                app and email us at{" "}
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="text-primary hover:underline"
                >
                  {SITE.supportEmail}
                </a>{" "}
                with the details. We prioritise safety reports.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </SitePage>
  );
}
