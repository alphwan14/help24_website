import { Icon } from "@/components/Icon";
import { OFFICIAL_SOURCES } from "@/lib/release";

/**
 * The only two places Help24 may be downloaded from.
 *
 * WHY THIS IS PROMINENT RATHER THAN FINE PRINT
 * --------------------------------------------
 * Distributing outside the Play Store teaches users that installing an APK
 * from a link is normal. That habit is the attack: a marketplace app that
 * handles M-Pesa payments and personal contact details is exactly the kind of
 * thing that gets repackaged with malware and reposted to APK-mirror sites,
 * forums and WhatsApp groups. Someone who has read this has a way to tell the
 * real thing from a copy — and naming the sources is the only way to give them
 * that, since a fake page can say "official" just as easily as a real one.
 *
 * Rendered as a `<section>` with its own heading so screen readers and
 * skim-readers both meet it as a distinct statement rather than as decoration.
 */
export function OfficialDownloadNotice() {
  return (
    <section
      aria-labelledby="official-download"
      className="rounded-card border border-primary/30 bg-primary/5 p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-badge bg-primary/15 text-primary-bright">
          <Icon name="shield" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2
            id="official-download"
            className="text-body-lg font-semibold text-text-primary"
          >
            Official download only
          </h2>
          <p className="mt-2 text-body leading-relaxed text-text-secondary">
            Help24 is published from two places and nowhere else. If you were
            sent an APK from any other site, mirror or chat forward,{" "}
            <strong className="font-semibold text-text-primary">
              do not install it
            </strong>{" "}
            — download it here instead.
          </p>

          <ul className="mt-4 flex flex-col gap-2">
            {OFFICIAL_SOURCES.map((source) => (
              <li key={source.href} className="flex items-start gap-2.5">
                <Icon
                  name="check"
                  className="mt-1 h-4 w-4 shrink-0 text-success"
                />
                <span className="min-w-0 text-body">
                  <a
                    href={source.href}
                    className="break-all font-medium text-primary-bright underline-offset-4 hover:underline"
                  >
                    {source.label}
                  </a>
                  <span className="ml-2 text-text-secondary">
                    — {source.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
