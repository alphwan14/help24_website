/**
 * The honesty marker.
 *
 * Help24 has no provider supply yet. Every module on this site that renders
 * seed data carries one of these, so a visitor can tell at a glance that they
 * are trying a sandbox rather than looking at a live marketplace. It is
 * deliberately legible rather than decorative — a 10px whisper in the corner
 * would be a disclaimer, not a label.
 *
 * If you are adding a module that shows posts, applicants, quotes or prices,
 * it needs one of these.
 */
interface Props {
  /** Overrides the tooltip/description for modules that need to be specific. */
  title?: string;
  className?: string;
}

export function DemoChip({
  title = "Sample data, so you can try the marketplace before launch. These are not real posts or real people.",
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-tag border border-border bg-surface px-2 py-1 text-label-sm font-semibold uppercase tracking-wider text-text-secondary ${className}`}
      title={title}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary" aria-hidden />
      Demo
      <span className="sr-only">— {title}</span>
    </span>
  );
}
