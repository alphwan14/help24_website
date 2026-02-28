"use client";

import { useState } from "react";
import Link from "next/link";
import { ButtonLink } from "./Button";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-dark/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="text-section-title font-semibold text-text-primary">
          Help<span className="text-primary">24</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="#problem"
            className="text-body text-text-secondary transition-colors hover:text-text-primary"
          >
            Problem
          </Link>
          <Link
            href="#solution"
            className="text-body text-text-secondary transition-colors hover:text-text-primary"
          >
            Solution
          </Link>
          <Link
            href="#how-it-works"
            className="text-body text-text-secondary transition-colors hover:text-text-primary"
          >
            How it works
          </Link>
          <Link
            href="#providers"
            className="text-body text-text-secondary transition-colors hover:text-text-primary"
          >
            For providers
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink variant="ghost" href="#early-access">
            Become a Provider
          </ButtonLink>
          <ButtonLink href="#early-access">Get Early Access</ButtonLink>
        </div>

        <button
          type="button"
          className="rounded-button p-2 text-text-primary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
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

      {open && (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link href="#problem" className="py-2.5 text-body text-text-secondary hover:text-text-primary" onClick={() => setOpen(false)}>Problem</Link>
            <Link href="#solution" className="py-2.5 text-body text-text-secondary hover:text-text-primary" onClick={() => setOpen(false)}>Solution</Link>
            <Link href="#how-it-works" className="py-2.5 text-body text-text-secondary hover:text-text-primary" onClick={() => setOpen(false)}>How it works</Link>
            <Link href="#providers" className="py-2.5 text-body text-text-secondary hover:text-text-primary" onClick={() => setOpen(false)}>For providers</Link>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <ButtonLink variant="ghost" className="w-full justify-center" href="#early-access" onClick={() => setOpen(false)}>Become a Provider</ButtonLink>
              <ButtonLink className="w-full justify-center" href="#early-access" onClick={() => setOpen(false)}>Get Early Access</ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
