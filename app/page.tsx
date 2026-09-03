import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/site/Hero";
import { Situations } from "@/components/site/Situations";
import { Trust } from "@/components/site/Trust";
import { AppShowcase } from "@/components/site/AppShowcase";
import { Close } from "@/components/site/Close";

/**
 * The homepage.
 *
 * THREE STORYTELLING MOMENTS AND TWO THINGS THAT SUPPORT THEM. Not eight
 * sections; not one section per fact.
 *
 *   Hero         Watch Help24 work.      need → nearby → offers → choose → paid
 *   Situations   Is it for me?           six lines from your own week, each
 *                                        playing a miniature of the same loop
 *   Trust        Why is it safe?         nearby · agreed · protected, as three
 *                                        full-width acts, the last one being
 *                                        the money itself moving
 *   AppShowcase  What do I actually get? one phone, four real screens
 *   Close        What can I do today?    a date, one field, and the fork
 *
 * WHAT WAS CONSOLIDATED, AND WHY. The previous version ran eight sections that
 * between them told the marketplace loop five times: the hero played it, a
 * living board showed cards from it, situations named jobs in it, a trust triad
 * asserted it and a payment section animated the end of it. Each was good on its
 * own; together they were the same argument, restated, and a visitor who had
 * understood it by the second telling spent three more scrolls being told again.
 *
 *   Marketplace (the drifting board)  → its job was breadth, which the six
 *                                       situations do better; its category line
 *                                       and /services link moved into Situations
 *   MoneyFlow (the payment section)   → became the third act of Trust, which is
 *                                       where the promise was always heading.
 *                                       Keeps the `#escrow` anchor
 *   DualCta                           → merged into Close; it was repeating the
 *                                       hero's two buttons a screen later
 *
 * Nothing was deleted. The page stopped saying things twice.
 *
 * FIRST PAINT. The hero renders its markup on the server; every timed module is
 * inert until it scrolls into view, and none of them run at all under
 * `prefers-reduced-motion`, which gets a complete static build of each.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Situations />
        <Trust />
        <AppShowcase />
        <Close />
      </main>
      <Footer />
    </>
  );
}
