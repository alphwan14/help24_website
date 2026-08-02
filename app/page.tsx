import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketplaceProvider } from "@/components/home/MarketplaceContext";
import { Hero } from "@/components/home/Hero";
import { TaskComposer } from "@/components/home/TaskComposer";
import { TwoSided } from "@/components/home/TwoSided";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { EscrowScrubber } from "@/components/home/EscrowScrubber";
import { Walkthrough } from "@/components/home/Walkthrough";
import { Coverage } from "@/components/home/Coverage";
import { Launch } from "@/components/home/Launch";

/**
 * The homepage is the marketplace, not a description of it.
 *
 * Order is an argument: here is the board (Hero) → here is you on it
 * (TaskComposer) → here is the other side of it (TwoSided) → here is why it
 * beats what you do today (BeforeAfter) → here is why the money is safe
 * (EscrowScrubber) → here is the app it finishes in (Walkthrough) → here is
 * where (Coverage) → here is when (Launch).
 *
 * WHAT WAS REMOVED, AND WHY. The old page ran Hero → Problem → Solution →
 * HowItWorks → Providers → Trust → CTA. Problem ("Sound familiar?") stated
 * four grievances behind `!` `?` `…` glyphs; BeforeAfter shows one of them
 * happening instead. Solution and Trust made the same four claims as each
 * other — verified, instant, rated, escrow — which the board and the escrow
 * scrubber now demonstrate rather than assert. Providers pitched the supply
 * side, which the two-sided toggle covers and /for-providers carries in full.
 * HowItWorks listed three steps; the walkthrough shows six real screens.
 *
 * Everything below the hero is client-side but none of it is needed for first
 * paint: the hero renders its own markup on the server, and the board is a
 * static list until hydration adds the drift.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* One state for the whole page: the hero's search, the composer's
            card and the two-sided toggle all read and write the same board. */}
        <MarketplaceProvider>
          <Hero />
          <TaskComposer />
          <TwoSided />
        </MarketplaceProvider>
        <BeforeAfter />
        <EscrowScrubber />
        <Walkthrough />
        <Coverage />
        <Launch />
      </main>
      <Footer />
    </>
  );
}
