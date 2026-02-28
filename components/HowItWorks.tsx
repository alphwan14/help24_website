import { Section, SectionLabel } from "./Section";

const steps = [
  {
    number: "1",
    title: "Post a task",
    description: "Describe what you need — plumbing, cleaning, moving, or anything else. Set your budget and when you need it.",
  },
  {
    number: "2",
    title: "Get matched instantly",
    description: "Verified providers in your area see your task and respond. Compare profiles, ratings, and quotes in one place.",
  },
  {
    number: "3",
    title: "Get it done",
    description: "Choose your provider, pay securely via M-Pesa escrow, and release payment when the job is done.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-surface">
      <div className="mx-auto max-w-prose text-center">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="text-h2 font-semibold text-text-primary">Three steps to done</h2>
        <p className="mt-4 text-body-lg text-text-secondary">
          No complicated forms. Just a straightforward way to get help when you need it.
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:gap-10 md:grid-cols-3 lg:mt-16">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-card bg-primary text-body font-semibold text-white">
              {step.number}
            </div>
            <h3 className="mt-4 text-h5 font-semibold text-text-primary">{step.title}</h3>
            <p className="mt-2 text-body-sm text-text-secondary max-w-xs">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
