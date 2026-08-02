/**
 * MarketplaceAvatar (widgets/marketplace_card_components.dart:114).
 *
 * Circle, `--border` fill, single uppercase initial in `--text-tertiary` at
 * 40% of the diameter, weight 600. The app never draws a spinner here and
 * never fades the image in, so neither does this.
 */
import { CARD_METRICS } from "@/lib/tokens";

interface Props {
  name: string;
  /** Optional photo. Omitted throughout the demo data — initials only. */
  src?: string;
  /** Diameter in px. The feed card uses 32 (FeedCardTokens.avatarSize). */
  size?: number;
  className?: string;
}

export function Avatar({ name, src, size = CARD_METRICS.avatar, className = "" }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-border font-semibold text-text-secondary ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- decorative, fixed size, no optimisation pipeline needed
        <img src={src} alt="" width={size} height={size} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
