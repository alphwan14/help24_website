"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ButtonLink } from "./Button";
import { HEADER_NAV } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-bg-dark/95 backdrop-blur-xl"
          : "bg-bg-dark/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-section-title font-semibold text-text-primary"
          aria-label="Help24 home"
        >
          Help<span className="text-primary">24</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {HEADER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body text-text-secondary hover:text-text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <ButtonLink variant="ghost" href="/become-a-provider">
            Become a Provider
          </ButtonLink>
          <ButtonLink href="/download">Download</ButtonLink>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button border border-border bg-card text-text-primary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`border-b border-border bg-surface md:hidden ${open ? "block" : "hidden"}`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-0 px-4 py-4">
          {HEADER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-body text-text-secondary hover:text-text-primary"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/support"
            className="py-3 text-body text-text-secondary hover:text-text-primary"
            onClick={() => setOpen(false)}
          >
            Contact Support
          </Link>
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
            <ButtonLink
              variant="ghost"
              className="w-full justify-center"
              href="/become-a-provider"
              onClick={() => setOpen(false)}
            >
              Become a Provider
            </ButtonLink>
            <ButtonLink
              className="w-full justify-center"
              href="/download"
              onClick={() => setOpen(false)}
            >
              Download
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
