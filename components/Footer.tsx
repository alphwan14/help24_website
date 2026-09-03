/**
 * The footer.
 *
 * WHAT CAME OUT OF IT. A second email-capture form, sitting a screen below the
 * first one, posting to the same endpoint. Two forms for one list is not twice
 * the signups — it is a page that looks unsure what it is asking for, and a
 * visitor who has already joined being asked again. The waitlist section owns
 * that job now; the footer's job is to be a map.
 *
 * It is a map with the launch date on it, because that is the one fact worth
 * repeating at the bottom of every page.
 */
import Link from "next/link";
import Image from "next/image";
import { SITE, FOOTER_GROUPS, LAUNCH } from "@/lib/site";
import { LOGO_CORNER_RATIO } from "@/lib/tokens";

const SOCIALS = [
  { label: "Twitter", href: "https://twitter.com/help24", mark: "X" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/help24", mark: "in" },
  { label: "Instagram", href: "https://www.instagram.com/help24", mark: "ig" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            {/* Same square and same 20.5% corners as the header and the app's
                launch badge — one brand mark, not a mark in one corner of the
                page and a wordmark in the other. */}
            <Link href="/" className="inline-flex items-center" title="Help24 home">
              <Image
                src="/help24-logo.png"
                alt="Help24"
                width={192}
                height={192}
                className="h-12 w-12 bg-white ring-1 ring-border"
                style={{ borderRadius: LOGO_CORNER_RATIO }}
              />
            </Link>
            <p className="mt-4 max-w-xs text-body text-text-secondary">
              Find someone nearby. Agree a price. Get it done.
            </p>
            <p className="mt-3 text-body-sm text-text-secondary">
              Launching{" "}
              <time dateTime={LAUNCH.iso} className="font-semibold text-text-primary">
                {LAUNCH.label}
              </time>
            </p>

            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-badge border border-border bg-card text-body-sm font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary-bright"
                >
                  {/*
                    The accessible name comes from the hidden full word, not
                    from an `aria-label` over the abbreviation. With aria-label
                    the visible "ig" and the announced "Instagram" disagree,
                    which breaks voice control — somebody says what they can see
                    and nothing happens.
                  */}
                  <span aria-hidden="true">{s.mark}</span>
                  <span className="sr-only">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="text-label-md font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  {group.title}
                </h2>
                {/* A 12px link is a 17px-tall target. Padding each one to 29px
                    keeps the visual rhythm and gives a thumb something to land
                    on. */}
                <ul className="mt-3 space-y-0.5">
                  {group.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="inline-block py-1.5 text-body-sm text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-body-sm text-text-secondary">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="-my-1.5 flex gap-6">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/support", label: "Support" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-block py-1.5 text-body-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
