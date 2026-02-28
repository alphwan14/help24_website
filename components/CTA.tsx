import { Section } from "./Section";
import { ButtonLink } from "./Button";

export function CTA() {
  return (
    <Section id="early-access" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="relative rounded-card border border-border bg-card p-10 text-center shadow-card md:p-16">
        <h2 className="text-h2 font-semibold text-text-primary md:text-h1 md:font-bold">Join Help24 Early</h2>
        <p className="mx-auto mt-5 max-w-md text-body-lg text-text-secondary">
          Be among the first to post tasks or offer your services. Early users get priority support and a say in how we build.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="#early-access" className="min-w-[180px]">
            Get Early Access
          </ButtonLink>
          <ButtonLink variant="secondary" href="#early-access" className="min-w-[180px]">
            Become a Provider
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
