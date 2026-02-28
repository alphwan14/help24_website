import { Section, SectionLabel } from "./Section";

const features = [
  {
    title: "Verified providers",
    description: "Background checks and verified profiles so you know who you&apos;re hiring.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Instant connections",
    description: "Post a task and get matched with available providers in minutes, not days.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Ratings & reviews",
    description: "See what others say. Build trust through real feedback from real jobs.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: "Secure payments",
    description: "Pay safely with escrow via M-Pesa. Funds released when the job is done.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export function Solution() {
  return (
    <Section id="solution">
      <div className="mx-auto max-w-prose text-center">
        <SectionLabel>The solution</SectionLabel>
        <h2 className="text-h2 font-semibold text-text-primary">Help24 fixes that</h2>
        <p className="mt-4 text-body-lg text-text-secondary">
          A marketplace built for speed, transparency, and trust — so you can get things done without the guesswork.
        </p>
      </div>
      <div className="mt-16 grid gap-card-gap sm:grid-cols-2 lg:grid-cols-4">
        {features.map((item, i) => (
          <div
            key={i}
            className="flex flex-col rounded-card border border-border bg-card p-4 shadow-card"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-badge bg-primary/20 text-primary">
              {item.icon}
            </div>
            <h3 className="mt-4 text-card-title font-medium text-text-primary">{item.title}</h3>
            <p className="mt-2 flex-1 text-body-sm text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
