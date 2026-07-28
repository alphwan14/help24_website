import { Icon } from "@/components/Icon";
import { TRUST_POINTS } from "@/lib/release";

/**
 * Why this download is safe to accept.
 *
 * Installing an APK outside the Play Store means dismissing a warning that
 * exists for good reason, so the page has to earn that dismissal rather than
 * talk past it. Four short, checkable claims — no badges, no seals, nothing
 * that looks like a trust signal without being one.
 */
export function TrustPoints() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {TRUST_POINTS.map((point) => (
        <li key={point.title} className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-badge bg-success/10 text-success">
            <Icon name={point.icon} className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="text-body font-semibold text-text-primary">
              {point.title}
            </h3>
            <p className="mt-1 text-body leading-relaxed text-text-secondary">
              {point.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
