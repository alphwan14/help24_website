import { APP_STORES } from "@/lib/site";
import { Icon } from "./Icon";

type Store = (typeof APP_STORES)[keyof typeof APP_STORES];

function StoreButton({
  store,
  icon,
  topLine,
}: {
  store: Store;
  icon: string;
  topLine: string;
}) {
  const inner = (
    <>
      <Icon name={icon} className="h-7 w-7 shrink-0" />
      <span className="flex flex-col items-start leading-none">
        <span className="text-label-sm uppercase tracking-wide opacity-80">
          {topLine}
        </span>
        <span className="mt-1 text-body-lg font-semibold">{store.label}</span>
      </span>
    </>
  );

  // Live listing — real link. Publishing later is just setting url + available.
  if (store.available && store.url) {
    return (
      <a
        href={store.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-[190px] items-center gap-3 rounded-button bg-text-primary px-5 py-3 text-bg-dark transition-opacity hover:opacity-90"
      >
        {inner}
      </a>
    );
  }

  // Not yet published — elegant disabled state.
  return (
    <div
      aria-disabled="true"
      className="relative flex min-w-[190px] cursor-not-allowed items-center gap-3 rounded-button border border-border bg-card px-5 py-3 text-text-tertiary"
    >
      <span className="absolute -right-2 -top-2 rounded-badge bg-primary px-2 py-0.5 text-label-sm font-semibold text-white">
        Soon
      </span>
      {inner}
    </div>
  );
}

export function StoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <StoreButton store={APP_STORES.googlePlay} icon="play" topLine="Get it on" />
      <StoreButton store={APP_STORES.appStore} icon="apple" topLine="Download on the" />
    </div>
  );
}
