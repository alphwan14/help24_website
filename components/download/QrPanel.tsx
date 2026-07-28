import Image from "next/image";
import { QR_TARGET_URL } from "@/lib/release";

/**
 * "Scan to open this page on your phone."
 *
 * Shown on desktop, hidden on Android by CSS (see `.only-desktop` in
 * globals.css) — a person already holding the phone does not need a QR code
 * for the page they are looking at.
 *
 * The code is a build-time SVG (`scripts/generate-qr.mjs`), so this costs one
 * cached 1.6 KB image and no JavaScript. It is rendered on a WHITE plate on
 * purpose: an inverted QR on a dark background fails to scan on a meaningful
 * share of older Android cameras, and this page exists to be used on exactly
 * those devices.
 */
export function QrPanel() {
  return (
    <div className="only-desktop flex flex-col items-center gap-4 rounded-card border border-border bg-card p-6 text-center shadow-card">
      <div className="rounded-badge bg-white p-3">
        <Image
          src="/download-qr.svg"
          alt={`QR code that opens ${QR_TARGET_URL}`}
          width={148}
          height={148}
          className="h-[148px] w-[148px]"
          unoptimized
          priority
        />
      </div>
      <div>
        <p className="text-body font-semibold text-text-primary">
          Scan to open on your phone
        </p>
        <p className="mt-1 text-body-sm text-text-secondary">
          Point your camera here, then tap the link.
        </p>
      </div>
    </div>
  );
}
