import { Icon } from "@/components/Icon";
import { ANDROID_RELEASE, formatReleaseDate } from "@/lib/release";

/**
 * "What's new", collapsed.
 *
 * A native `<details>` rather than a React disclosure: it opens without
 * JavaScript, it is keyboard- and screen-reader-accessible for free, and
 * browser find-in-page can reach the content inside it. The only JS-adjacent
 * touch is a CSS rotation on the chevron, which degrades to a static icon.
 *
 * Closed by default — someone who came here to install the app is not looking
 * for a changelog, and the five lines that are here are the ones a user can
 * actually feel.
 */
export function ReleaseNotes() {
  return (
    <details className="disclosure group rounded-card border border-border bg-card shadow-card">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 text-body-lg font-semibold text-text-primary transition-colors hover:bg-card/60">
        <span>
          What&apos;s new in v{ANDROID_RELEASE.version}
          <span className="ml-2 text-body font-normal text-text-secondary">
            {formatReleaseDate(ANDROID_RELEASE.releaseDate)}
          </span>
        </span>
        <Icon
          name="chevron"
          className="disclosure-chevron h-5 w-5 shrink-0 text-text-secondary transition-transform duration-200"
        />
      </summary>
      <ul className="flex flex-col gap-3 border-t border-border px-5 py-4">
        {ANDROID_RELEASE.releaseNotes.map((note) => (
          <li key={note} className="flex items-start gap-3">
            <Icon
              name="check"
              className="mt-1 h-4 w-4 shrink-0 text-success"
            />
            <span className="text-body leading-relaxed text-text-secondary">
              {note}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
