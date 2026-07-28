import { Icon } from "@/components/Icon";
import { TRACK_ATTR } from "@/lib/analytics";
import { formatBytes, type Platform } from "@/lib/release";

/**
 * The one obvious action on the page.
 *
 * A plain `<a>`, not a button with a handler: the browser's own download
 * machinery is more reliable than anything JavaScript can do here, it works
 * with middle-click, "Save link as", and right-click → copy address, and it
 * still works if the tracker script fails to run. Analytics is attached by
 * delegation (see lib/analytics.ts) precisely so it can never be load-bearing
 * for the download itself.
 *
 * `download` is deliberately NOT set: GitHub serves the asset from a different
 * origin, where the attribute is ignored for the filename anyway, and omitting
 * it lets Android's browser hand off to the package installer cleanly.
 */
export function DownloadButton({
  platform,
  sizeBytes,
  className = "",
}: {
  platform: Platform;
  sizeBytes?: number;
  className?: string;
}) {
  if (!platform.available || !platform.url) {
    return (
      <span
        className={`inline-flex items-center justify-center gap-2 rounded-button border border-border bg-card/60 px-6 py-4 text-body font-semibold text-text-tertiary ${className}`}
        aria-disabled="true"
      >
        <Icon name={platform.icon} className="h-5 w-5" />
        {platform.name} — coming soon
      </span>
    );
  }

  return (
    <a
      href={platform.url}
      {...{ [TRACK_ATTR]: "download_click" }}
      {...{ [`${TRACK_ATTR}-platform`]: platform.trackId }}
      className={`group inline-flex items-center justify-center gap-3 rounded-button bg-primary px-8 py-4 text-body-lg font-semibold text-white shadow-card transition-all duration-200 hover:opacity-95 hover:shadow-card-glow active:opacity-90 ${className}`}
    >
      <Icon name="download" className="h-5 w-5 shrink-0" />
      <span>{platform.ctaLabel}</span>
      {sizeBytes !== undefined && (
        // Solid white, not an opacity. At /70 this sat at 3.0:1 against the
        // indigo and at /90 it was 3.9:1 — both fail AA for 14px text. The
        // size is secondary information, not decoration, and dimming it was
        // buying a visual nicety with legibility. Separation now comes from
        // weight and size instead, which costs nothing.
        <span className="text-body font-normal text-white">
          {formatBytes(sizeBytes)}
        </span>
      )}
    </a>
  );
}
