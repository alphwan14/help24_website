import { Section, SectionLabel } from "./Section";
import { ButtonLink } from "./Button";

const benefits = [
  {
    title: "Get more jobs",
    description: "Reach customers who are actively looking. No more waiting for referrals or cold calls.",
  },
  {
    title: "Build your reputation",
    description: "Collect ratings and reviews that follow your profile and help you win more work.",
  },
  {
    title: "Secure payments",
    description: "Get paid through escrow — no chasing payments or risky cash handoffs.",
  },
];

export function Providers() {
  return (
    <Section id="providers">
      <div className="mx-auto max-w-prose text-center">
        <SectionLabel>For providers</SectionLabel>
        <h2 className="text-h2 font-semibold text-text-primary">Grow your business on Help24</h2>
        <p className="mt-4 text-body-lg text-text-secondary">
          Whether you&apos;re a fundi, cleaner, mover, or offer any other service — get more jobs, build your reputation, and get paid securely.
        </p>
      </div>
      <div className="mt-16 grid gap-card-gap md:grid-cols-3">
        {benefits.map((item, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-card p-4 shadow-card"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-badge bg-secondary/20 text-secondary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-card-title font-medium text-text-primary">{item.title}</h3>
            <p className="mt-2 text-body-sm text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <ButtonLink href="#early-access" variant="secondary">
          Join as a provider
        </ButtonLink>
      </div>
    </Section>
  );
}
