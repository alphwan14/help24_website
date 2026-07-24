import Link from "next/link";
import type { Metadata } from "next";
import { SitePage } from "@/components/SitePage";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const links = [
  { label: "Home", href: "/" },
  { label: "Help Centre", href: "/help" },
  { label: "Contact Support", href: "/support" },
];

export default function NotFound() {
  return (
    <SitePage>
      <section className="relative overflow-hidden">
        <div className="bg-radial-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <p className="text-label-md font-medium uppercase tracking-wider text-primary">
            Error 404
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            This page took a day off
          </h1>
          <p className="mt-4 text-body-lg text-text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
            Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95"
            >
              Back home
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 rounded-button border border-border bg-transparent px-5 py-3 text-body font-semibold text-text-primary transition-colors hover:bg-card/50"
            >
              Visit Help Centre
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-body-sm text-text-tertiary transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SitePage>
  );
}
