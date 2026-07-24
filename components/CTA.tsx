import { Section } from "./Section";
import { ButtonLink } from "./Button";

export function CTA() {
  return (
    <Section id="get-started" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="relative rounded-card border border-border bg-card p-8 text-center shadow-card sm:p-10 md:p-14">
        <h2 className="text-h2 font-semibold text-text-primary md:text-h1 md:font-bold">
          Get started with Help24
        </h2>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-text-secondary sm:mt-5">
          Post a task and get matched with trusted providers, or offer your
          services and grow your business — all from your phone.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10">
          <ButtonLink href="/download">Download the app</ButtonLink>
          <ButtonLink variant="secondary" href="/become-a-provider">
            Become a Provider
          </ButtonLink>
        </div>
        <p className="mt-6 text-body-sm text-text-tertiary">
          Free to join. Pay securely with M-Pesa.
        </p>
      </div>
    </Section>
  );
}
