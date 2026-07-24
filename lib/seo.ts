import type { Metadata } from "next";
import { SITE } from "./site";

/**
 * Per-route metadata helper. Keeps canonical URL, Open Graph and Twitter tags
 * consistent across pages. The root layout owns `metadataBase` and the title
 * template (`%s · Help24`), so `title` here is just the page name.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path === "/" ? SITE.url : `${SITE.url}${path}`;
  const ogTitle = `${title} · ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
