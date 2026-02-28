import { Section } from "./Section";
import { ButtonLink } from "./Button";

export function CTA() {
  return (
    <Section id="early-access" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="relative rounded-card border border-border bg-card p-8 text-center shadow-card sm:p-10 md:p-14">
        <h2 className="text-h2 font-semibold text-text-primary md:text-h1 md:font-bold">
          Join Help24 Early
        </h2>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-text-secondary sm:mt-5">
          Be among the first to post tasks or offer your services. Early users get priority support and a say in how we build.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10">
          <ButtonLink href="#early-access">Get Early Access</ButtonLink>
          <ButtonLink variant="secondary" href="#early-access">
            Become a Provider
          </ButtonLink>
        </div>
        <p className="mt-6 text-body-sm text-text-tertiary">
          Spots are limited. We&apos;re growing the community on demand.
        </p>
      </div>
    </Section>
  );
}
