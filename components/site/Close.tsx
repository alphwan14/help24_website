/**
 * The last word: one ask, and the fork.
 *
 * WHY THIS IS ONE SECTION AND NOT TWO. The page used to end with a dual CTA —
 * two bordered panels, "Need something done?" and "Have a skill?" — and then a
 * second closing section immediately below it. Both were asking for the same
 * click from the same person at the same moment. Two closing sections do not
 * double the conversion; they make the page look unsure what it is asking for.
 *
 * So there is one ask — get the app — and the fork sits underneath it as two
 * lines of type rather than two cards. Both audiences are addressed, and both
 * links are here.
 *
 * Until launch the ask was a waitlist ("one email on launch day"). Help24 is
 * out, so the ask is the download, and the waitlist is gone with the date it
 * was counting toward.
 */
import Link from "next/link";
import { Glyph } from "@/components/ds/glyphs";

export function Close() {
  return (
    <section id="get-the-app" className="scroll-mt-24 py-section">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-label-md font-semibold uppercase tracking-[0.22em] text-text-tertiary">
            Free on Android
          </p>
          <h2 className="mt-6 text-[clamp(1.9rem,5.2vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-text-primary">
            Get Help24 on your phone.
          </h2>
          <p className="mt-4 max-w-md text-body-lg leading-relaxed text-text-secondary">
            Post what you need, or offer what you do. It takes a minute to set up.
          </p>
          <Link
            href="/download"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-button bg-action px-7 py-4 text-body-lg font-semibold text-on-action shadow-card transition-transform duration-200 ease-spring hover:-translate-y-0.5 active:translate-y-0"
          >
            Download Help24
            <Glyph name="arrowRight" size={17} />
          </Link>
        </div>

        {/* ── The fork ───────────────────────────────────────────────────── */}
        <div className="mt-16 grid gap-8 border-t border-border pt-10 sm:mt-20 sm:grid-cols-2 sm:gap-12">
          <Path
            eyebrow="Customers"
            title="Need something done?"
            line="Post it in a minute. Offers come to you."
            href="/download"
            cta="Get Help"
          />
          <Path
            eyebrow="Providers"
            title="Have a skill?"
            line="Your work sits on the same board. No lead fees, no paying to be seen."
            href="/for-providers"
            cta="Earn with Help24"
          />
        </div>
      </div>
    </section>
  );
}

/** One side of the fork. Type and a link — no panel, no border, no fill. */
function Path({
  eyebrow,
  title,
  line,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  line: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-label-md font-semibold uppercase tracking-[0.18em] text-text-tertiary">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-[clamp(1.35rem,3vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.025em] text-text-primary">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-body-lg text-text-secondary">{line}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 text-body-lg font-semibold text-primary-bright underline-offset-4 hover:underline"
      >
        {cta}
        <Glyph name="arrowRight" size={16} />
      </Link>
    </div>
  );
}
