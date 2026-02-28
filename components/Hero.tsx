import { ButtonLink } from "./Button";

export function Hero() {
  return (
    <section className="relative flex min-h-[100vh] flex-col justify-center overflow-hidden pt-28 pb-24 md:pt-32 md:pb-32">
      <div className="absolute inset-0 bg-grid bg-bg-dark" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-h1 font-bold text-text-primary">
            Get anything done,{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              anytime, anywhere.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-body-lg text-text-secondary">
            From urgent help to everyday tasks — connect with trusted service
            providers instantly.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#early-access">Get Early Access</ButtonLink>
            <ButtonLink variant="secondary" href="#providers">
              Become a Provider
            </ButtonLink>
          </div>
        </div>

        <div className="mt-20 flex justify-center lg:mt-28 lg:justify-end">
          <div className="w-full max-w-[400px]">
            <div className="rounded-card border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-badge bg-primary/20">
                  <span className="text-card-title font-semibold text-primary">H24</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-card-title font-medium text-text-primary">Plumbing fix</div>
                  <div className="text-body-sm text-text-tertiary">Nairobi · 2 providers nearby</div>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-tertiary">Estimated</span>
                  <span className="font-medium text-success">KES 1,500</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-tertiary">Response</span>
                  <span className="font-medium text-primary">~5 min</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-badge border border-border bg-surface py-2.5 text-body-sm text-text-tertiary">
                <span>Post task</span>
                <span className="opacity-60">→</span>
                <span>Get matched</span>
                <span className="opacity-60">→</span>
                <span>Done</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
