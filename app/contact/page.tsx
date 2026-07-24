import Link from "next/link";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Help24 — support, provider questions, partnerships and press. We aim to reply within 24 hours.",
  path: "/contact",
});

const channels = [
  {
    icon: "book",
    title: "Help Centre",
    body: "The fastest answers to common questions.",
    action: { label: "Browse the Help Centre", href: "/help" },
  },
  {
    icon: "phone",
    title: "Support",
    body: "Trouble with an account, payment or job? Our team can help.",
    action: { label: "Contact Support", href: "/support" },
  },
  {
    icon: "badge",
    title: "Providers",
    body: "Questions about offering your services on Help24?",
    action: { label: "Become a provider", href: "/become-a-provider" },
  },
];

export default function ContactPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="We'd love to hear from you. Pick the option that fits, or email us directly — we read every message."
      />

      <Section>
        {/* Direct email */}
        <div className="relative overflow-hidden rounded-card border border-border bg-card p-8 text-center shadow-card sm:p-10">
          <div className="bg-radial-glow pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-badge bg-primary/10 text-primary">
              <Icon name="mail" />
            </div>
            <h2 className="mt-4 text-h4 font-semibold text-text-primary">Email us</h2>
            <p className="mx-auto mt-2 max-w-md text-body text-text-secondary">
              For support, partnerships or press, reach us at:
            </p>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="mt-3 inline-block text-body-lg font-medium text-primary hover:underline"
            >
              {SITE.supportEmail}
            </a>
            <p className="mt-4 flex items-center justify-center gap-2 text-body-sm text-text-tertiary">
              <Icon name="clock" className="h-4 w-4" />
              We aim to reply within {SITE.supportResponseHours} hours.
            </p>
          </div>
        </div>

        {/* Channels */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {channels.map((c) => (
            <div
              key={c.title}
              className="flex flex-col rounded-card border border-border bg-card p-6 shadow-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-badge bg-primary/10 text-primary">
                <Icon name={c.icon} />
              </div>
              <h3 className="mt-4 text-body-lg font-semibold text-text-primary">
                {c.title}
              </h3>
              <p className="mt-2 flex-1 text-body text-text-secondary">{c.body}</p>
              <Link
                href={c.action.href}
                className="mt-4 inline-flex items-center gap-1.5 text-body font-medium text-primary hover:underline"
              >
                {c.action.label}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </SitePage>
  );
}
