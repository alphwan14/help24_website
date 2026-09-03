/**
 * The fork.
 *
 * Everything above this point has been about one side of the marketplace —
 * somebody with a job. This is where the other side is offered the door, once,
 * clearly, and then the page moves on.
 *
 * The old site carried a whole provider pitch on the homepage: earnings, lead
 * fees, verification, a second board. It said the same things /for-providers
 * says at length, to an audience that had come looking for a plumber. Two
 * panels and two sentences is the right weight for it here.
 */
import Link from "next/link";
import { Glyph } from "@/components/ds/glyphs";

export function DualCta() {
  return (
    <section className="border-t border-border py-section">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Side
            eyebrow="Customers"
            title="Need something done?"
            line="Post it in a minute. Offers come to you."
            cta="Get Help"
            href="/download"
            primary
          />
          <Side
            eyebrow="Providers"
            title="Have a skill?"
            line="Your work sits on the same board. No lead fees, no paying to be seen."
            cta="Earn with Help24"
            href="/for-providers"
          />
        </div>
      </div>
    </section>
  );
}

function Side({
  eyebrow,
  title,
  line,
  cta,
  href,
  primary = false,
}: {
  eyebrow: string;
  title: string;
  line: string;
  cta: string;
  href: string;
  primary?: boolean;
}) {
  return (
    /*
     * The customer panel is filled and the provider panel is outlined. Two
     * identical panels side by side make a visitor choose before they know
     * which one they are; the weight says "this one, unless you are the other
     * one", which is the honest ratio of the audience.
     */
    <div
      className={`flex flex-col rounded-card border p-6 sm:p-8 ${
        primary
          ? "border-primary/30 bg-primary/[0.07]"
          : "border-border bg-card shadow-card"
      }`}
    >
      <p className="text-label-md font-semibold uppercase tracking-[0.14em] text-primary-bright">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[clamp(1.35rem,3.4vw,2rem)] font-bold leading-[1.12] tracking-[-0.025em] text-text-primary">
        {title}
      </h2>
      <p className="mt-2.5 max-w-sm text-body sm:text-body-lg text-text-secondary">{line}</p>
      <Link
        href={href}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-button px-6 py-3.5 text-body-lg font-semibold transition-transform duration-200 ease-spring hover:-translate-y-0.5 sm:w-auto sm:self-start ${
          primary
            ? "bg-primary text-white"
            : "border border-border-strong bg-card text-text-primary hover:bg-card-hover"
        }`}
      >
        {cta}
        <Glyph name="arrowRight" size={16} />
      </Link>
    </div>
  );
}
