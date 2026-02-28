import { Section, SectionLabel } from "./Section";

const trustItems = [
  {
    title: "Escrow payments",
    description: "Your money is held securely until the job is complete. No pay-first, no runaround.",
  },
  {
    title: "Verified users",
    description: "Identity checks and verified profiles so you know who you&apos;re dealing with.",
  },
  {
    title: "Transparent pricing",
    description: "See quotes upfront. No surprise fees. Agree on the price before work starts.",
  },
];

export function Trust() {
  return (
    <Section className="bg-surface">
      <div className="mx-auto max-w-prose text-center">
        <SectionLabel>Trust built in</SectionLabel>
        <h2 className="text-h2 font-semibold text-text-primary">Safe for everyone</h2>
        <p className="mt-4 text-body-lg text-text-secondary">
          We built Help24 so that both sides of the marketplace can rely on clear rules and secure tools.
        </p>
      </div>
      <div className="mt-16 grid gap-card-gap md:grid-cols-3">
        {trustItems.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-card border border-border bg-card p-4 shadow-card"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-badge bg-success/20 text-success">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-card-title font-medium text-text-primary">{item.title}</h3>
              <p className="mt-1 text-body-sm text-text-secondary">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
