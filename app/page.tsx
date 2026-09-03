import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/site/Hero";
import { Marketplace } from "@/components/site/Marketplace";
import { Situations } from "@/components/site/Situations";
import { Trust } from "@/components/site/Trust";
import { MoneyFlow } from "@/components/site/MoneyFlow";
import { AppShowcase } from "@/components/site/AppShowcase";
import { DualCta } from "@/components/site/DualCta";
import { Waitlist } from "@/components/site/Waitlist";

/**
 * The homepage.
 *
 * ITS ONLY JOB is to get somebody from "what is this" to "I'll use this" —
 * which needs four things and not one more: understand it, want it, trust it,
 * act. Every section below answers exactly one question, and any section that
 * needed a paragraph to make its point was the wrong section.
 *
 *   Hero          What is Help24?          → it plays the whole product
 *   Marketplace   What is on it?           → three cards that keep changing
 *   Situations    Is it for me?            → six sentences from your own week
 *   Trust         Why is it safe?          → nearby, agreed, protected
 *   MoneyFlow     Where does my money go?  → it travels, and it stops
 *   AppShowcase   What do I actually get?  → one phone, four real screens
 *   DualCta       Which one am I?          → customer or provider
 *   Waitlist      When?                    → a date and one field
 *
 * WHAT WAS REMOVED, AND WHERE IT WENT. The previous homepage ran eight
 * sections of demonstration — a searchable board, a three-step task composer,
 * a two-sided marketplace toggle, a before/after switch, an escrow scrubber, a
 * six-frame walkthrough and a coverage map. All of it was good; all of it was
 * too much for one page, and most of it was explaining things the hero now
 * simply does.
 *
 *   TaskComposer, TwoSided, BeforeAfter  → /how-it-works
 *   EscrowScrubber                       → /safety
 *   Coverage + the full category list    → /services
 *
 * Nothing was deleted. The homepage stopped being the manual.
 *
 * FIRST PAINT. The hero renders its markup on the server; every timed module
 * below it is inert until it scrolls into view, and none of them run at all
 * under `prefers-reduced-motion`.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Marketplace />
        <Situations />
        <Trust />
        <MoneyFlow />
        <AppShowcase />
        <DualCta />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
