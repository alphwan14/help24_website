"use client";

import { useState } from "react";
import Link from "next/link";

const links = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "For providers", href: "#providers" },
    { label: "Early access", href: "#early-access" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

const socials = [
  { label: "Twitter", href: "#", icon: "X" },
  { label: "LinkedIn", href: "#", icon: "in" },
  { label: "Instagram", href: "#", icon: "ig" },
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

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <Link href="/" className="text-h5 font-semibold text-text-primary">
              Help<span className="text-primary">24</span>
            </Link>
            <p className="mt-3 text-body-sm text-text-tertiary max-w-xs">
              Get anything done, anytime, anywhere. Connect with trusted service providers as we grow.
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex h-9 w-9 items-center justify-center rounded-badge border border-border bg-card text-body-sm text-text-tertiary transition-colors hover:border-primary/50 hover:text-primary"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3">
            {Object.entries(links).map(([group, items]) => (
              <div key={group}>
                <h3 className="text-section-title font-semibold uppercase tracking-wider text-text-tertiary">
                  {group}
                </h3>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
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
          <h3 className="text-section-title font-semibold text-text-primary">Stay updated</h3>
          <p className="mt-2 text-body-sm text-text-tertiary">
            Get early access updates. No spam.
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
              © {new Date().getFullYear()} Help24. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-body-sm text-text-tertiary hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-body-sm text-text-tertiary hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
