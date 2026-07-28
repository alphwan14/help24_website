import { Icon } from "@/components/Icon";
import { compatibility } from "@/lib/release";

/**
 * "Will this run on my phone?" — answered next to the button, not in a table
 * further down.
 *
 * Three facts, no prose: minimum Android, processor support, download size.
 * These are the questions that make someone hesitate at the moment of tapping,
 * and an answer two screens away is an answer nobody reads.
 *
 * Values come from `compatibility()`, which derives from the same release
 * config as the version card — the two cannot disagree.
 */
export function CompatibilityRow({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-start ${className}`}
    >
      {compatibility().map((item) => (
        <li
          key={item.label}
          className="inline-flex items-center gap-2 rounded-badge border border-border bg-card px-3 py-2"
        >
          <Icon
            name={item.icon}
            className="h-4 w-4 shrink-0 text-primary-bright"
          />
          <span className="text-body-sm text-text-secondary">
            {item.label}
          </span>
          <span className="text-body-sm font-semibold text-text-primary">
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
