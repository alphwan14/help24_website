import type { Metadata } from "next";
import { AuthChrome } from "../AuthChrome";
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
 *
 * THE CHROME IS DELIBERATELY NOT THE SITE'S
 * -----------------------------------------
 * See ../AuthChrome. A page that asks for a password should not also be
 * advertising; the brand mark stays, the marketing navigation goes.
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
    <AuthChrome>
      <ActionHandler />
      <Assurance />
    </AuthChrome>
  );
}
