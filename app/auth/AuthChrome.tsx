import Link from "next/link";
import { BrandLockup } from "@/components/Brand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SITE } from "@/lib/site";

/**
 * The frame around every page reached from a Help24 identity email.
 *
 * WHY THESE PAGES DO NOT USE `SitePage`
 * ------------------------------------
 * The site header carries four marketing links, "Become a Provider" and a
 * filled "Get Help" button. On a page whose entire job is "type a new password
 * for this account", every one of those is an invitation to abandon the task —
 * and the loudest control on screen would belong to something other than the
 * reason the person is here. Serious products give password and confirmation
 * pages their own reduced chrome for exactly this reason.
 *
 * WHAT IS KEPT, AND WHY EACH ONE EARNS ITS PLACE
 * ----------------------------------------------
 *   * The lockup. The visitor arrived by clicking a link in an email, which is
 *     the single most-phished action on the internet. The first thing they
 *     must be able to do is recognise the brand. It is shown, not asserted —
 *     a mark is evidence in a way that the sentence "this is the official
 *     site" is not, because a forgery can print that sentence too.
 *   * The theme control. The visitor's theme is a setting they already made;
 *     dropping it here would make these pages the only ones that ignore it.
 *   * The domain and the legal links. The domain is the one thing a user can
 *     actually check, so it is set in the footer where the eye lands after a
 *     form, not buried in body copy.
 *
 * There is no navigation out of the task other than the mark itself.
 */
export function AuthChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center" title="Help24 home">
            <BrandLockup className="h-8 w-auto" priority />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/*
        `justify-center` only from `sm:` up. On a phone with the keyboard open
        the viewport collapses to a few hundred pixels, and a vertically
        centred form jumps as the keyboard animates; anchoring it to the top
        there keeps the first field where the user left it.
      */}
      <main
        id="main"
        className="flex flex-1 flex-col px-4 py-10 sm:justify-center sm:px-6 sm:py-16"
      >
        <div className="mx-auto w-full max-w-lg">{children}</div>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 px-4 py-6 text-center sm:flex-row sm:justify-between sm:gap-4 sm:px-6 sm:text-left">
          <p className="text-body-sm text-text-tertiary">
            {SITE.domain} · Help24 Kenya
          </p>
          <nav className="flex items-center gap-4" aria-label="Legal">
            <Link
              href="/privacy"
              className="text-body-sm text-text-tertiary transition-colors hover:text-text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-body-sm text-text-tertiary transition-colors hover:text-text-primary"
            >
              Terms
            </Link>
            <Link
              href="/help"
              className="text-body-sm text-text-tertiary transition-colors hover:text-text-primary"
            >
              Help Centre
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
