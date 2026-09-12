import Link from "next/link";
import type { Crumb } from "@/lib/jsonld";

/**
 * The visible breadcrumb trail.
 *
 * Takes the SAME array that `breadcrumbLd()` marks up, because structured data
 * that describes a trail the page does not display is exactly the mismatch
 * Google's structured data policies call out. One array, two consumers, no way
 * for them to drift.
 *
 * The last crumb is the current page and is not a link — `aria-current="page"`
 * carries that for assistive technology. Separators are decorative and hidden,
 * so a screen reader hears "Services, Plumbing, Mombasa" rather than a string
 * of slashes.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-body-sm text-text-secondary">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-x-1.5">
              {i > 0 && (
                <span aria-hidden className="text-text-secondary/50">
                  /
                </span>
              )}
              {last ? (
                <span aria-current="page" className="font-medium text-text-primary">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="transition-colors hover:text-text-primary hover:underline"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
