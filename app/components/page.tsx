import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Gallery } from "@/components/gallery/Gallery";

/**
 * /components — the design-system parity route.
 *
 * Deliberately not in the sitemap and not indexable: it exists so the web
 * components can be checked against the phone, not so anyone finds it.
 */
/**
 * Noindex AND self-canonical.
 *
 * The noindex was already here. The canonical was not, so this page inherited
 * the root layout's `alternates: { canonical: "/" }` and shipped declaring
 * itself a duplicate of the homepage — a page that is simultaneously "do not
 * index me" and "I am the homepage". Neither directive is dangerous alone;
 * together they are the kind of contradiction that makes a crawler's treatment
 * of a site unpredictable. pageMetadata sets both from one call.
 */
export const metadata: Metadata = pageMetadata({
  title: "Component parity",
  description:
    "Internal design-system parity gallery. Not part of the public site.",
  path: "/components",
  robots: "noindex",
});

export default function ComponentsPage() {
  return <Gallery />;
}
