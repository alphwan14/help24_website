import { Section, SectionLabel } from "./Section";

const pains = [
  {
    title: "Hard to find reliable help",
    description: "Word of mouth and random numbers — no way to know who will show up or do a good job.",
    icon: "!",
    accent: "error",
  },
  {
    title: "No pricing transparency",
    description: "Quotes that change on the spot, hidden fees, and awkward back-and-forth before anyone commits.",
    icon: "?",
    accent: "warning",
  },
  {
    title: "Delays and unreliability",
    description: "No-shows, last-minute cancellations, and rescheduling that leaves you stuck when you needed help most.",
    icon: "…",
    accent: "warning",
  },
  {
    title: "No accountability",
    description: "When things go wrong, there&apos;s no record, no reviews, and no way to get things made right.",
    icon: "!",
    accent: "error",
  },
];

const accentClasses: Record<string, string> = {
  error: "bg-error/15 text-error",
  warning: "bg-warning/15 text-warning",
};

export function Problem() {
  return (
    <Section id="problem" className="bg-surface">
      <div className="mx-auto max-w-prose text-center">
        <SectionLabel>The problem</SectionLabel>
        <h2 className="text-h2 font-semibold text-text-primary">Sound familiar?</h2>
        <p className="mt-4 text-body-lg text-text-secondary">
          Getting everyday tasks done shouldn&apos;t be this hard. Yet for many of us, it is.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-card-gap">
        {pains.map((item, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-card p-4 shadow-card"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-badge font-bold ${accentClasses[item.accent] ?? accentClasses.error}`}>
              {item.icon}
            </div>
            <h3 className="mt-4 text-card-title font-medium text-text-primary">{item.title}</h3>
            <p className="mt-2 text-body-sm text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
