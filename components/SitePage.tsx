import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Standard chrome for every content page: fixed Header, a `<main>` with top
 * padding that clears the fixed header, then the shared Footer. The homepage
 * keeps its own full-bleed structure and does not use this.
 */
export function SitePage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
