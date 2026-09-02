"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * The identity client used by the action handler, and nothing else on this site.
 *
 * WHY THESE VALUES ARE IN SOURCE
 * ------------------------------
 * A web API key is not a secret. It identifies the project to the identity
 * service; it authorises nothing on its own, which is why the same value ships
 * inside every copy of the Android app and inside every Firebase web app ever
 * deployed. What actually protects the project is the authorized-domains list
 * and the security rules, neither of which this key can bypass.
 *
 * It is hard-coded rather than read from an environment variable ON PURPOSE.
 * An env var that is present in Vercel but missing from a preview, or renamed
 * during a migration, would not fail the build — it would fail at run time, on
 * the one page a locked-out user reaches, and only for them. A literal cannot
 * drift from the deployment.
 *
 * WHY THE INIT IS LAZY
 * --------------------
 * Nothing else on this site touches identity. Constructing the app at module
 * scope would run identity code for anyone who so much as navigates near this
 * route; `client()` means it happens once, on the page that needs it, after
 * the user has actually followed a link from their email.
 */
const CONFIG = {
  apiKey: "AIzaSyACUqU_xmKi1fmxfmu2IkokFvlLGOaZ8u0",
  projectId: "help24-24410",
  /**
   * Only ever consulted for OAuth popup/redirect hand-offs, which this page
   * does not perform — every call it makes (`verifyPasswordResetCode`,
   * `confirmPasswordReset`, `checkActionCode`, `applyActionCode`) goes straight
   * to the identity REST endpoint. It is set to the Help24 domain regardless,
   * because a stray value here would be the one place a vendor hostname could
   * still reach a network panel. Verified serving `/__/auth/handler`.
   */
  authDomain: "auth.help24.co.ke",
} as const;

const APP_NAME = "help24-auth-action";

/** The Auth instance for this page. Constructed at most once per browser tab. */
export function client(): Auth {
  const existing = getApps().find((a) => a.name === APP_NAME);
  const app: FirebaseApp = existing ?? initializeApp(CONFIG, APP_NAME);
  return getAuth(app);
}

/** Re-exported so the handler imports its whole identity surface from here. */
export {
  verifyPasswordResetCode,
  confirmPasswordReset,
  checkActionCode,
  applyActionCode,
} from "firebase/auth";
