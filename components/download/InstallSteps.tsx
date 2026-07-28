import { INSTALL_STEPS } from "@/lib/release";

/**
 * Three steps, numbered by CSS counters so the markup stays a plain `<ol>`.
 *
 * The list is ordered semantically as well as visually: a screen reader
 * announces "list of 3 items" and the numbers are decoration, not content, so
 * they are never read out twice.
 */
export function InstallSteps() {
  return (
    <ol className="install-steps grid gap-4 sm:grid-cols-3">
      {INSTALL_STEPS.map((step) => (
        <li
          key={step.title}
          className="relative rounded-card border border-border bg-card p-5 shadow-card"
        >
          <span
            className="step-number mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-body font-semibold text-primary"
            aria-hidden
          />
          <h3 className="text-body-lg font-semibold text-text-primary">
            {step.title}
          </h3>
          <p className="mt-2 text-body leading-relaxed text-text-secondary">
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
