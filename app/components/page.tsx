import type { Metadata } from "next";
import { Gallery } from "@/components/gallery/Gallery";

/**
 * /components — the design-system parity route.
 *
 * Deliberately not in the sitemap and not indexable: it exists so the web
 * components can be checked against the phone, not so anyone finds it.
 */
export const metadata: Metadata = {
  title: "Component parity",
  robots: { index: false, follow: false },
};

export default function ComponentsPage() {
  return <Gallery />;
}
