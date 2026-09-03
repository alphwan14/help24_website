/**
 * Site navigation.
 *
 * NAVIGATION SHOULD NOT BE THE LOUDEST THING ON A PAGE. This bar carries a
 * mark, four quiet links, a theme control and one filled button — and at the
 * top of the page it has no background of its own at all, so the hero starts
 * at the top of the viewport rather than under a slab.
 *
 * THE PRIMARY ACTION IS NEVER BEHIND A MENU. On a phone "Get Help" sits in the
 * bar itself, at full size, next to the hamburger. The links can hide; the
 * errand cannot. That is the one rule this component exists to enforce.
 *
 * WHAT THE MENU DOES WHILE IT IS OPEN. It is a real dialog: Escape closes it,
 * the page behind it does not scroll, and the links are removed from the tab
 * order when it is shut. A menu that leaves twelve invisible tab stops behind
 * it is the most common accessibility defect in this pattern.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HEADER_NAV } from "@/lib/site";
import { LOGO_CORNER_RATIO } from "@/lib/tokens";
import { ThemeToggle } from "./theme/ThemeToggle";
import { Glyph } from "./ds/glyphs";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    // `passive` because this listener never calls preventDefault, and saying so
    // lets the browser keep scrolling on the compositor while it runs.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A navigation that leaves its own menu open is disorienting; closing on
  // route change is the behaviour people expect without noticing it.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Locking the body is what stops the page behind the sheet from scrolling
    // under a finger, which on iOS otherwise scrolls both.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-border bg-page/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/*
          The logo, not a wordmark — and the app's shape, not a crop of it.
          This is the square artwork with its corners rounded at
          LOGO_CORNER_RATIO, exactly what `splash_badge.png` puts on screen when
          the app launches. It stays white and opaque in both themes because the
          mark inside it is black; knocked out of a dark page it would simply
          not be there, and recolouring it would stop it being the logo.
        */}
        <Link href="/" className="flex shrink-0 items-center" title="Help24 home">
          <Image
            src="/help24-logo.png"
            alt="Help24"
            width={192}
            height={192}
            priority
            className="h-10 w-10 bg-white ring-1 ring-border"
            style={{ borderRadius: LOGO_CORNER_RATIO }}
          />
        </Link>

        <nav className="ml-2 hidden items-center gap-6 md:flex" aria-label="Main">
          {HEADER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`text-body transition-colors ${
                pathname === item.href
                  ? "font-medium text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />

          <Link
            href="/for-providers"
            className="hidden rounded-button px-3 py-2 text-body font-medium text-text-secondary transition-colors hover:text-text-primary lg:inline-flex"
          >
            Become a Provider
          </Link>

          {/* Always visible, every screen size. See the file header. */}
          <Link
            href="/download"
            className="inline-flex items-center gap-1.5 rounded-button bg-primary px-4 py-2.5 text-body font-semibold text-white transition-opacity hover:opacity-95"
          >
            Get Help
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button border border-border bg-card text-text-primary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            <Glyph name={open ? "close" : "menu"} size={18} />
          </button>
        </div>
      </div>

      {/* ── Mobile sheet ─────────────────────────────────────────────────── */}
      <div
        id="site-menu"
        className={`overflow-hidden border-b border-border bg-page md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6" aria-label="Site">
          <ul>
            {HEADER_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between border-b border-border py-3.5 text-body-lg font-medium text-text-primary"
                >
                  {item.label}
                  <Glyph name="arrowRight" size={15} className="text-text-tertiary" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/for-providers"
                className="flex items-center justify-between border-b border-border py-3.5 text-body-lg font-medium text-text-primary"
              >
                Become a Provider
                <Glyph name="arrowRight" size={15} className="text-text-tertiary" />
              </Link>
            </li>
          </ul>

          <div className="flex items-center justify-between gap-3 py-4">
            <span className="text-body-sm font-medium text-text-secondary">Theme</span>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
