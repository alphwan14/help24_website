import type { Metadata } from "next";
import { SitePage } from "@/components/SitePage";
import { ActionHandler, Assurance } from "./ActionHandler";
import { SITE } from "@/lib/site";

/**
 * Help24's own handler for identity email links.
 *
 * This route is what the provider's "Custom action URL" points at, replacing
 * its generic hosted page. The work happens in ./ActionHandler.tsx; this file
 * is deliberately the thinnest possible shell.
 *
 * THE ONE RULE THIS FILE EXISTS TO KEEP
 * -------------------------------------
 * It takes NO `searchParams` prop, calls no dynamic API, and is statically
 * prerendered. That is the whole security posture in one sentence: the server
 * never receives the one-time code, so it cannot render it, log it, cache it,
 * or ship it inside a streamed payload.
 *
 * `/auth/continue` learned this the expensive way. It read `searchParams` on
 * the server, and a request carrying `oobCode` and `apiKey` came back HTTP 200
 * with both values sitting in the HTML — displayed nowhere, present anyway.
 * Adding a prop here, or a `useSearchParams()` in the component tree, would
 * make this route dynamic and reintroduce exactly that. Do not.
 */

export const metadata: Metadata = {
  title: "Confirm your request",
  description: "Complete a Help24 password reset or email confirmation.",
  // Reached only from a link in someone's inbox. Indexing it would put a bare
  // "set a new password" form in search results for "Help24 password".
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE.url}/auth/action` },
};

export default function AuthActionPage() {
  return (
    <SitePage>
      <section className="relative overflow-hidden">
        <div className="bg-radial-glow pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="bg-grid pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-4 py-20 sm:px-6">
          <ActionHandler />
          <Assurance />
        </div>
      </section>
    </SitePage>
  );
}
