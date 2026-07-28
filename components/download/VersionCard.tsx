import { Icon } from "@/components/Icon";
import { ANDROID_RELEASE, releaseSpecs } from "@/lib/release";

/**
 * What you are about to install, stated plainly.
 *
 * Every row comes from `releaseSpecs()`, which derives from the config object —
 * so the size shown here and the size in the download button are the same
 * number computed once, and neither can drift from the artifact.
 */
export function VersionCard() {
  const specs = releaseSpecs();

  return (
    <div className="rounded-card border border-border bg-card shadow-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-badge bg-primary/10 text-primary">
          <Icon name="android" className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-body-lg font-semibold text-text-primary">
            Help24 for Android
          </h3>
          <p className="text-body-sm text-text-secondary">
            Latest release · v{ANDROID_RELEASE.version}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-border">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 px-5 py-3"
          >
            <dt className="text-body text-text-secondary">{spec.label}</dt>
            <dd className="text-right text-body font-medium text-text-primary">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * The SHA-256, in full, with a copy button.
 *
 * Rendered as selectable text rather than hidden behind the button on purpose:
 * `navigator.clipboard` is unavailable on insecure origins and in some older
 * Android browsers, and the people who care about a checksum are exactly the
 * people who will be annoyed if the only way to get it is a button that
 * silently does nothing. The button is an accelerator, never the mechanism.
 */
export function ChecksumRow() {
  const { sha256 } = ANDROID_RELEASE;

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-label-md font-medium uppercase tracking-wider text-text-secondary">
          SHA-256 checksum
        </p>
        <button
          type="button"
          data-copy={sha256}
          aria-label="Copy checksum"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-badge border border-border px-2.5 py-1.5 text-body-sm font-medium text-text-secondary transition-colors hover:bg-card hover:text-text-primary"
        >
          <Icon name="copy" className="h-3.5 w-3.5" />
          <span>Copy</span>
          <span data-copy-done hidden className="text-success">
            ✓
          </span>
        </button>
      </div>
      <code className="mt-2 block break-all font-mono text-body-sm leading-relaxed text-text-secondary">
        {sha256}
      </code>
      <p className="mt-3 text-body-sm text-text-secondary">
        Optional. Run{" "}
        <code className="font-mono text-text-secondary">
          sha256sum app-release.apk
        </code>{" "}
        after downloading — if the value matches, the file arrived exactly as we
        published it.
      </p>
    </div>
  );
}
