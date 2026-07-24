"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE, FOOTER_GROUPS } from "@/lib/site";

const socials = [
  { label: "Twitter", href: "https://twitter.com/help24", icon: "X" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/help24", icon: "in" },
  { label: "Instagram", href: "https://www.instagram.com/help24", icon: "ig" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <Link href="/" className="text-h5 font-semibold text-text-primary">
              Help<span className="text-primary">24</span>
            </Link>
            <p className="mt-3 max-w-xs text-body-sm text-text-tertiary">
              {SITE.tagline}. Agree a price, pay securely, get it done.
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-badge border border-border bg-card text-body-sm text-text-tertiary transition-colors hover:border-primary/50 hover:text-primary"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-section-title font-semibold uppercase tracking-wider text-text-tertiary">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-body-sm text-text-secondary transition-colors hover:text-text-primary"
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
          <h3 className="text-section-title font-semibold text-text-primary">Stay in the loop</h3>
          <p className="mt-2 text-body-sm text-text-tertiary">
            Product news and new features. No spam.
          </p>
          <form className="mt-4 flex max-w-sm flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="min-w-0 flex-1 rounded-button border border-border bg-card px-4 py-3 text-body text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
              aria-label="Email for updates"
            />
            <button
              type="submit"
              className="shrink-0 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
              disabled={submitted}
            >
              {submitted ? "Thanks!" : "Subscribe"}
            </button>
          </form>
        </div>

        <div className="mt-10 border-t border-border pt-8 sm:mt-12">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-body-sm text-text-tertiary">
              © {year} {SITE.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-body-sm text-text-tertiary transition-colors hover:text-primary">
                Privacy
              </Link>
              <Link href="/terms" className="text-body-sm text-text-tertiary transition-colors hover:text-primary">
                Terms
              </Link>
              <Link href="/help" className="text-body-sm text-text-tertiary transition-colors hover:text-primary">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
