"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { FAQ_CATEGORIES, type Accent } from "@/lib/faq";

// Only guaranteed (safelisted / design-system) opacity utilities — see
// tailwind.config safelist + design-system.css.
const ACCENT: Record<Accent, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  success: "bg-success/20 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/15 text-error",
};

export function HelpCentre() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const q = query.trim().toLowerCase();

  const categories = useMemo(() => {
    if (!q) return FAQ_CATEGORIES;
    return FAQ_CATEGORIES.map((c) => ({
      ...c,
      items: c.items.filter((it) =>
        `${it.q} ${it.a}`.toLowerCase().includes(q)
      ),
    })).filter((c) => c.items.length > 0);
  }, [q]);

  const total = categories.reduce((n, c) => n + c.items.length, 0);

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Search */}
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for answers…"
          aria-label="Search the Help Centre"
          className="w-full rounded-button border border-border bg-card py-4 pl-12 pr-4 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Category quick-nav (hidden while searching) */}
      {!q && (
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Help categories">
          {FAQ_CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="inline-flex items-center gap-2 rounded-badge border border-border bg-card px-3 py-2 text-body-sm text-text-secondary transition-colors hover:border-primary/50 hover:text-text-primary"
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-tag ${ACCENT[c.accent]}`}>
                <Icon name={c.icon} className="h-3.5 w-3.5" />
              </span>
              {c.title}
            </a>
          ))}
        </nav>
      )}

      {q && (
        <p className="mt-6 text-body-sm text-text-tertiary" role="status">
          {total === 0
            ? "No results"
            : `${total} result${total === 1 ? "" : "s"} for “${query.trim()}”`}
        </p>
      )}

      {/* Empty state */}
      {total === 0 && (
        <div className="mt-8 rounded-card border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-badge bg-primary/10 text-primary">
            <Icon name="search" />
          </div>
          <h2 className="mt-4 text-h5 font-semibold text-text-primary">
            We couldn&apos;t find an answer
          </h2>
          <p className="mx-auto mt-2 max-w-md text-body text-text-secondary">
            Try a different search, or reach our team and we&apos;ll help you directly.
          </p>
          <Link
            href="/support"
            className="mt-6 inline-flex items-center gap-2 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95"
          >
            Contact Support
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Categories */}
      <div className="mt-10 flex flex-col gap-12">
        {categories.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-24">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-badge ${ACCENT[c.accent]}`}>
                <Icon name={c.icon} />
              </span>
              <div>
                <h2 className="text-h5 font-semibold text-text-primary">{c.title}</h2>
                <p className="text-body-sm text-text-tertiary">{c.blurb}</p>
              </div>
            </div>

            <div className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
              {c.items.map((it, i) => {
                const key = `${c.id}-${i}`;
                const isOpen = open.has(key) || q.length > 0;
                return (
                  <div key={key}>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-bg-dark/80"
                    >
                      <span className="text-body-lg font-medium text-text-primary">
                        {it.q}
                      </span>
                      <Icon
                        name="chevron"
                        className={`h-5 w-5 shrink-0 text-text-tertiary transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-body leading-relaxed text-text-secondary">
                        {it.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
