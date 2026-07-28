import { Icon } from "@/components/Icon";
import { TRACK_ATTR } from "@/lib/analytics";
import { SECONDARY_PLATFORMS } from "@/lib/release";

/**
 * Every distribution channel other than the primary one.
 *
 * Driven entirely by `SECONDARY_PLATFORMS` in lib/release.ts, so adding
 * Google Play, the App Store or Huawei AppGallery is one object in that array —
 * no change here, no change to the page. A channel with `url: null` renders as
 * an honest "Coming soon" rather than a dead link, which is the state both
 * store entries are in today.
 */
export function PlatformCards() {
  if (SECONDARY_PLATFORMS.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {SECONDARY_PLATFORMS.map((platform) => {
        const body = (
          <>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-badge ${
                platform.available
                  ? "bg-primary/10 text-primary"
                  : "bg-card text-text-tertiary"
              }`}
            >
              <Icon name={platform.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-body-lg font-semibold text-text-primary">
                {platform.name}
              </span>
              <span className="mt-0.5 block text-body text-text-secondary">
                {platform.tagline}
              </span>
            </span>
            {platform.available ? (
              <Icon
                name="arrow"
                className="ml-auto h-5 w-5 shrink-0 self-center text-text-tertiary"
              />
            ) : (
              <span className="ml-auto shrink-0 self-center rounded-tag border border-border px-2 py-1 text-label-sm font-medium uppercase tracking-wide text-text-secondary">
                Soon
              </span>
            )}
          </>
        );

        return (
          <li key={platform.id}>
            {platform.available && platform.url ? (
              <a
                href={platform.url}
                {...{ [TRACK_ATTR]: "download_click" }}
                {...{ [`${TRACK_ATTR}-platform`]: platform.trackId }}
                className="flex items-start gap-4 rounded-card border border-border bg-card p-4 shadow-card transition-all duration-200 hover:border-border/80 hover:shadow-card-glow"
              >
                {body}
              </a>
            ) : (
              <div className="flex items-start gap-4 rounded-card border border-border bg-card/50 p-4">
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
