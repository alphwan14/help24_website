"use client";

import { useEffect, useState } from "react";

export interface LegalSection {
  id: string;
  heading: string;
  body: React.ReactNode;
}

/**
 * Two-column legal/prose body: a readable article column plus a sticky
 * table-of-contents that highlights the section currently in view. On small
 * screens the TOC collapses into a native <details> disclosure so it never
 * pushes the content down.
 */
export function LegalBody({
  sections,
  lastUpdated,
}: {
  sections: LegalSection[];
  lastUpdated: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the topmost intersecting section for a stable highlight.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-12">
        {/* Article */}
        <article className="max-w-prose">
          <p className="mb-10 text-body-sm text-text-tertiary">
            Last updated {lastUpdated}
          </p>

          {/* Mobile TOC */}
          <details className="mb-10 rounded-card border border-border bg-card p-4 lg:hidden">
            <summary className="cursor-pointer text-section-title font-semibold text-text-primary">
              On this page
            </summary>
            <nav className="mt-3 flex flex-col gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-body-sm text-text-secondary hover:text-text-primary"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </details>

          <div className="flex flex-col gap-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-h4 font-semibold text-text-primary">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-body leading-relaxed text-text-secondary [&_a]:text-primary [&_a:hover]:underline [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-text-primary">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </article>

        {/* Sticky desktop TOC */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24" aria-label="On this page">
            <p className="mb-3 text-label-md font-medium uppercase tracking-wider text-text-tertiary">
              On this page
            </p>
            <ul className="space-y-1 border-l border-border">
              {sections.map((s) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`-ml-px block border-l-2 py-1.5 pl-4 text-body-sm transition-colors ${
                        isActive
                          ? "border-primary font-medium text-text-primary"
                          : "border-transparent text-text-tertiary hover:border-border hover:text-text-secondary"
                      }`}
                    >
                      {s.heading}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
