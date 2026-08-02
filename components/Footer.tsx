"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE, FOOTER_GROUPS, LAUNCH } from "@/lib/site";
import { LOGO_CORNER_RATIO } from "@/lib/tokens";

const socials = [
  { label: "Twitter", href: "https://twitter.com/help24", icon: "X" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/help24", icon: "in" },
  { label: "Instagram", href: "https://www.instagram.com/help24", icon: "ig" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  /**
   * This used to be a lie: it set `submitted` to true, said "Thanks!" and
   * dropped the address on the floor. It now posts to /api/waitlist — the same
   * endpoint the launch section uses — and says so only when the address has
   * actually been stored.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await res.json()) as { ok?: boolean };
      if (body.ok) {
        setState("done");
        setEmail("");
      } else {
        setState("failed");
      }
    } catch {
      setState("failed");
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            {/* Same square, same 20.5% corners as the header and the app's
                launch badge — one brand mark, not a mark in one corner of the
                page and a wordmark in the other. */}
            <Link href="/" className="inline-flex items-center" title="Help24 home">
              <Image
                src="/help24-logo.png"
                alt="Help24"
                width={192}
                height={192}
                className="h-14 w-14 bg-white"
                style={{ borderRadius: LOGO_CORNER_RATIO }}
              />
            </Link>
            <p className="mt-3 max-w-xs text-body-sm text-text-secondary">
              {SITE.tagline}. Agree a price, pay securely, get it done.
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-badge border border-border bg-card text-body-sm text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {/*
                    The accessible name comes from the hidden full word, not
                    from an `aria-label` over the abbreviation. With aria-label
                    the visible "ig" and the announced "Instagram" disagree,
                    which is a real problem for voice control — someone says
                    what they can see and nothing happens — and axe flags it.
                    This way the link answers to "Instagram" and reads as "ig".
                  */}
                  <span aria-hidden="true">{s.icon}</span>
                  <span className="sr-only">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-section-title font-semibold uppercase tracking-wider text-text-secondary">
                  {group.title}
                </h3>
                {/* A 12px link is a 17px-tall target. Padding each one to 29px
                    keeps the same visual rhythm (the gap shrinks by what the
                    padding adds) and gives a thumb something to land on. */}
                <ul className="mt-3 space-y-1">
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

        <div className="mt-10 sm:mt-12 lg:mt-16">
          <h3 className="text-section-title font-semibold text-text-primary">
            Get the launch link
          </h3>
          <p className="mt-2 text-body-sm text-text-secondary">
            One email on {LAUNCH.label} with the download link. Nothing before it.
          </p>
          <form className="mt-4 flex max-w-sm flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="min-w-0 flex-1 rounded-button border border-border bg-card px-4 py-3 text-body text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
              aria-label="Email for the launch link"
            />
            <button
              type="submit"
              className="shrink-0 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
              disabled={state === "sending" || state === "done"}
            >
              {state === "done" ? "You're on the list" : state === "sending" ? "Adding…" : "Join"}
            </button>
          </form>
          {state === "failed" ? (
            <p role="alert" className="mt-2 text-body-sm text-warning">
              That did not save. Email{" "}
              <a href={`mailto:${SITE.supportEmail}`} className="underline">
                {SITE.supportEmail}
              </a>{" "}
              and we will add you by hand.
            </p>
          ) : null}
        </div>

        <div className="mt-10 border-t border-border pt-8 sm:mt-12">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-body-sm text-text-secondary">
              © {year} {SITE.name}. All rights reserved.
            </p>
            <div className="-my-1.5 flex gap-6">
              {[
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "/help", label: "Help" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-block py-1.5 text-body-sm text-text-secondary transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
