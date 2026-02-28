import { Section, SectionLabel } from "./Section";

const pains = [
  {
    title: "Hard to find reliable help",
    description:
      "Word of mouth and random numbers — no way to know who will show up or do a good job.",
  },
  {
    title: "No pricing transparency",
    description:
      "Quotes that change on the spot, hidden fees, and the awkward back-and-forth before anyone commits.",
  },
  {
    title: "Delays and unreliability",
    description:
      "No-shows, last-minute cancellations, and rescheduling that leaves you stuck when you needed help most.",
  },
  {
    title: "No accountability",
    description:
      "When things go wrong, there&apos;s no record, no reviews, and no way to get things made right.",
  },
];

export function Problem() {
  return (
    <Section id="problem" className="bg-surface">
      <div className="mx-auto max-w-prose text-center">
        <SectionLabel>The problem</SectionLabel>
        <h2 className="text-h2 font-semibold text-text-primary">Sound familiar?</h2>
        <p className="mt-4 text-body-lg text-text-secondary">
          Getting everyday tasks done shouldn&apos;t be this hard. Yet for most of us, it is.
        </p>
      </div>
      <div className="mt-16 grid gap-card-gap sm:grid-cols-2 lg:grid-cols-4">
        {pains.map((item, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-card p-4 shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-badge bg-error/15 text-error">
              <span className="text-badge-tag">!</span>
            </div>
            <h3 className="mt-4 text-card-title font-medium text-text-primary">{item.title}</h3>
            <p className="mt-2 text-body-sm text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
