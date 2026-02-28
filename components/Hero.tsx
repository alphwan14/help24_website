import { ButtonLink } from "./Button";

export function Hero() {
  return (
    <section className="relative flex min-h-[100vh] flex-col justify-center overflow-hidden pt-16 sm:pt-20">
      <div className="absolute inset-0 bg-grid bg-bg-dark" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-badge border border-primary/20 bg-primary/10 px-3 py-1.5 text-badge-tag font-semibold text-primary mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Early access — join as we grow
            </div>

            <h1 className="text-3xl font-bold leading-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Get anything done,{" "}
<span className="h24-hero-gradient">
              anytime, anywhere.
            </span>
            </h1>

            <p className="mt-4 max-w-xl text-body-lg text-text-secondary sm:mt-6">
              From urgent help to everyday tasks — connect with trusted service providers when you need them. We&apos;re building the platform with early users like you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              <ButtonLink href="#early-access">Get Early Access</ButtonLink>
              <ButtonLink variant="secondary" href="#providers">
                Become a Provider
              </ButtonLink>
            </div>
          </div>

          <div className="relative mt-12 min-w-0 lg:mt-0">
            <div className="rounded-card border border-border bg-card p-4 shadow-card sm:p-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-badge bg-primary/20 text-card-title font-semibold text-primary">
                  H24
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-card-title font-medium text-text-primary">Sample task</div>
                  <div className="text-body-sm text-text-tertiary">How it could look for you</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
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
                <span aria-hidden>→</span>
                <span>Get matched</span>
                <span aria-hidden>→</span>
                <span>Done</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
