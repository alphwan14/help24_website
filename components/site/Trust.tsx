/**
 * Nearby · Agree first · Protected.
 *
 * Three ideas, three product states, no paragraphs.
 *
 * THE RULE THIS SECTION IS TESTING. If a concept can be communicated by an
 * interface instead of a sentence, use the interface. So "we find people close
 * to you" is a map with three pins on it; "providers quote and you choose" is
 * three prices with one of them picked; "your money is held" is a lock with an
 * amount behind it. Each panel then gets one line of caption — not to explain
 * the picture, but to name it.
 *
 * WHY IT IS NOT AN ICON GRID. An icon grid is three glyphs that could belong to
 * any product on earth sitting above three sentences doing all the work. These
 * three visuals could not belong to anything but Help24: they are drawn from
 * the real national boundary, the real quoted prices in the sample data, and
 * the real escrow amount used everywhere else on the site.
 */
import Link from "next/link";
import { kes } from "@/lib/tokens";
import { CITY_PINS } from "@/lib/demo/seed";
import { KENYA_PATH, KENYA_VIEWBOX, projectKE } from "@/lib/kenya";
import { Glyph } from "@/components/ds/glyphs";

const PINS = CITY_PINS.map((p) => ({ ...p, ...projectKE(p.lon, p.lat) }));

/** The three quotes on the sample plumbing request, in the order they arrived. */
const QUOTES = [
  { name: "Joseph", price: 1100, picked: true },
  { name: "Salim", price: 1350, picked: false },
  { name: "Peter", price: 900, picked: false },
];

const HELD = 1500;

export function Trust() {
  return (
    <section id="trust" className="scroll-mt-20 border-t border-border py-section sm:scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-2xl text-[clamp(1.6rem,4.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary">
          Nearby. Agreed. Protected.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <Panel title="Nearby" caption="Relevant people around you.">
            <NearbyMap />
          </Panel>
          <Panel title="Agree first" caption="Providers make offers. You choose.">
            <Quotes />
          </Panel>
          <Panel
            title="Protected"
            caption="Payment is secured through Help24."
            /* The one panel with somewhere further to go: escrow is the thing
               people actually want the detail on before they trust a payment
               screen, and the detail lives on /safety. */
            href="/safety"
            linkLabel="How payment protection works"
          >
            <Held />
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({
  title,
  caption,
  href,
  linkLabel,
  children,
}: {
  title: string;
  caption: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-card">
      {/* Fixed height so three panels of different content still line up, and
          `bg-surface` so the visual sits in its own well rather than floating
          on the card. */}
      <div className="relative h-[168px] overflow-hidden border-b border-border bg-surface">
        {children}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-h5 font-bold tracking-[-0.01em] text-text-primary">{title}</h3>
        <p className="mt-1.5 text-body text-text-secondary">{caption}</p>
        {href && linkLabel ? (
          <Link
            href={href}
            className="mt-4 inline-flex items-center gap-1.5 text-body font-semibold text-primary-bright underline-offset-4 hover:underline"
          >
            {linkLabel}
            <Glyph name="arrowRight" size={14} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Kenya, with the three launch cities on it.
 *
 * The outline is the national boundary from OpenStreetMap data (lib/kenya.ts)
 * and the pins are projected from real coordinates — nothing here is positioned
 * by eye. It is a small thing, but a hand-drawn approximation of your own
 * country is the sort of detail a Kenyan visitor notices immediately.
 */
function NearbyMap() {
  return (
    <div className="flex h-full items-center justify-center gap-5 px-5">
      <div
        className="relative h-[132px] shrink-0"
        style={{ aspectRatio: `${KENYA_VIEWBOX.width} / ${KENYA_VIEWBOX.height}` }}
      >
        <svg
          viewBox={`0 0 ${KENYA_VIEWBOX.width} ${KENYA_VIEWBOX.height}`}
          className="h-full w-full"
          role="img"
          aria-label="Kenya, with Kisumu, Nairobi and Mombasa marked"
        >
          <path
            d={KENYA_PATH}
            /* Heavier than the old homepage map used. That version was tuned
               against near-black, where a 12% fill is clearly visible; on warm
               paper the same value all but disappeared. */
            fill="rgb(var(--primary-rgb) / 0.16)"
            stroke="rgb(var(--primary-rgb) / 0.65)"
            strokeWidth={0.7}
            strokeLinejoin="round"
          />
          {PINS.map((p) => (
            <circle key={p.city} cx={p.x} cy={p.y} r={2.2} fill="var(--primary-bright)" />
          ))}
        </svg>
        {/* The locate pulse, on Mombasa — the launch market. Opacity and
            transform only, and `.motion-only` so a reduced-motion visitor gets
            a plain dot rather than a frozen ring. */}
        <span
          className="motion-only absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary"
          style={{
            left: `${(PINS[2].x / KENYA_VIEWBOX.width) * 100}%`,
            top: `${(PINS[2].y / KENYA_VIEWBOX.height) * 100}%`,
          }}
          aria-hidden
        />
      </div>

      <ul className="min-w-0 space-y-1.5">
        {PINS.map((p, i) => (
          <li key={p.city} className="flex items-center gap-2">
            <Glyph
              name="pin"
              size={13}
              className={i === 2 ? "text-primary-bright" : "text-text-tertiary"}
            />
            <span
              className={`truncate text-body-sm ${
                i === 2 ? "font-semibold text-text-primary" : "text-text-secondary"
              }`}
            >
              {p.city}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Three quotes on one job, one of them taken. */
function Quotes() {
  return (
    <ul className="flex h-full flex-col justify-center gap-2 px-5">
      {QUOTES.map((q) => (
        <li
          key={q.name}
          className={`flex items-center gap-3 rounded-button border px-3 py-2 transition-colors ${
            q.picked
              ? "border-primary bg-card shadow-[0_0_0_1px_var(--primary)]"
              : "border-border bg-card opacity-60"
          }`}
        >
          <span className="min-w-0 flex-1 truncate text-body-sm font-medium text-text-primary">
            {q.name}
          </span>
          <span className="shrink-0 text-card-title font-bold text-money">{kes(q.price)}</span>
          {q.picked ? (
            <Glyph name="check" size={15} className="shrink-0 text-primary-bright" />
          ) : (
            <span className="w-[15px] shrink-0" aria-hidden />
          )}
        </li>
      ))}
      {/* The point of the panel, stated where the eye lands last. Note that the
          picked quote is not the cheapest — a rating and a distance are part of
          the decision, and a demo that always picks the lowest number teaches
          the wrong thing. */}
      <li className="pt-1 text-label-md font-medium text-text-secondary">
        You picked Joseph — not the cheapest.
      </li>
    </ul>
  );
}

/** The held amount, behind a lock. */
function Held() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="relative">
        <span
          className="motion-only absolute inset-0 animate-ping rounded-full bg-warning"
          aria-hidden
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-warning/40 bg-warning/10">
          <Glyph name="lock" size={22} className="text-warning" />
        </span>
      </div>
      <p className="text-h4 font-bold text-text-primary">{kes(HELD)}</p>
      <p className="rounded-tag bg-warning/10 px-2.5 py-1 text-label-md font-semibold text-warning">
        Held until the job is done
      </p>
    </div>
  );
}
