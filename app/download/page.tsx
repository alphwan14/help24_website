import Image from "next/image";
import { SitePage } from "@/components/SitePage";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { StoreButtons } from "@/components/StoreButtons";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Download the App",
  description:
    "Get the Help24 app and connect with trusted local service providers across Kenya. Coming soon to Google Play and the App Store.",
  path: "/download",
});

const highlights = [
  {
    icon: "search",
    title: "Find help fast",
    body: "Post what you need or browse offers from trusted providers near you.",
  },
  {
    icon: "shield",
    title: "Pay with protection",
    body: "Pay securely with M-Pesa. Funds are held until the job is done.",
  },
  {
    icon: "chat",
    title: "Stay in sync",
    body: "Message, agree details and track everything in one place.",
  },
];

export default function DownloadPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Download"
        title="Help24, in your pocket"
        description={`${SITE.tagline}. Post a task, hire a trusted provider and pay securely — all from your phone.`}
      >
        <div className="flex flex-col items-center gap-4">
          <StoreButtons className="justify-center" />
          <p className="text-body-sm text-text-tertiary">
            Launching soon — we&apos;ll flip these live the moment the app is
            published.
          </p>
        </div>
      </PageHero>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Brand mark */}
          <div className="order-2 flex justify-center lg:order-1">
            <div className="relative flex h-64 w-64 items-center justify-center rounded-card border border-border bg-card shadow-card-glow">
              <div className="bg-radial-glow pointer-events-none absolute inset-0 rounded-card" aria-hidden />
              <Image
                src="/help24-icon.png"
                alt="Help24 app icon"
                width={128}
                height={128}
                className="relative rounded-card"
                priority
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="order-1 lg:order-2">
            <h2 className="text-h3 font-semibold text-text-primary">
              Everything you need to get it done
            </h2>
            <ul className="mt-6 flex flex-col gap-5">
              {highlights.map((h) => (
                <li key={h.title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-badge bg-primary/10 text-primary">
                    <Icon name={h.icon} />
                  </span>
                  <div>
                    <h3 className="text-body-lg font-semibold text-text-primary">
                      {h.title}
                    </h3>
                    <p className="mt-1 text-body text-text-secondary">{h.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <StoreButtons />
            </div>
          </div>
        </div>
      </Section>
    </SitePage>
  );
}
