/**
 * The one translation layer between the identity provider and the person
 * holding a broken link.
 *
 * THE RULE THIS FILE ENFORCES
 * ---------------------------
 * A provider error is written for whoever integrated the SDK. It names systems
 * the reader has never heard of and offers no next step. So no branch here
 * returns provider text: codes are mapped explicitly, anything unrecognised
 * falls back to Help24 copy, and the raw error is never rendered, never logged
 * and never attached to anything that leaves the page.
 *
 * This mirrors the contract the mobile app enforces in
 * `lib/utils/auth_error_mapper.dart`. The two surfaces must agree, because a
 * user who fails on the web and then retries in the app has to be told the
 * same thing both times.
 *
 * ONE DISTINCTION THE PROVIDER CANNOT MAKE, AND NEITHER CAN WE
 * ------------------------------------------------------------
 * `auth/invalid-action-code` is returned for a code that was mistyped, a code
 * that was already used, AND a code that was superseded by a newer link. The
 * provider deliberately does not distinguish them — telling an attacker which
 * of the three it was is a small oracle. The copy therefore covers all three
 * honestly rather than guessing at one.
 */

export interface ActionFailure {
  /** Headline. Short, human, never a code. */
  readonly title: string;
  /** One sentence on what happened. */
  readonly message: string;
  /** One sentence on what to do now. Always present — no dead ends. */
  readonly next: string;
}

const GENERIC: ActionFailure = {
  title: "Something went wrong",
  message: "We couldn't complete that just now.",
  next: "Please try the link again, or ask for a new one from the Help24 app.",
};

const LINK_SPENT: ActionFailure = {
  title: "This link is no longer valid",
  message:
    "It may already have been used, or replaced by a newer one. Nothing on " +
    "your account has changed.",
  next: "Ask for a fresh link from the Help24 app and open it straight from your email.",
};

const BY_CODE: Record<string, ActionFailure> = {
  // Invalid, already-used, or superseded — see the note above.
  "auth/invalid-action-code": LINK_SPENT,
  "auth/expired-action-code": {
    title: "This link has expired",
    message:
      "Links are short-lived for your security, and this one has passed its " +
      "window. Nothing on your account has changed.",
    next: "Ask for a new link from the Help24 app — it only takes a moment.",
  },
  "auth/user-disabled": {
    title: "Account unavailable",
    message: "This account has been suspended, so it can't be changed right now.",
    next: "Contact Help24 support and we'll look into it with you.",
  },
  "auth/user-not-found": {
    title: "Account not found",
    message: "The account this link belongs to no longer exists.",
    next: "If you think this is wrong, contact Help24 support.",
  },
  "auth/weak-password": {
    title: "Choose a stronger password",
    message: "That password is too easy to guess.",
    next: "Use at least 8 characters, mixing letters and numbers.",
  },
  "auth/missing-password": {
    title: "Enter a password",
    message: "We need a new password before we can update your account.",
    next: "Type your new password and try again.",
  },
  "auth/network-request-failed": {
    title: "No internet connection",
    message: "We couldn't reach Help24 to finish that.",
    next: "Check your connection and try again.",
  },
  "auth/too-many-requests": {
    title: "Too many attempts",
    message: "For your security we've paused this for a short while.",
    next: "Please wait a few minutes and try again.",
  },
  "auth/internal-error": GENERIC,
};

/** Narrow an unknown throw to the provider's code, without trusting its text. */
function codeOf(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: unknown }).code;
    if (typeof code === "string") return code;
  }
  return null;
}

/**
 * Map any thrown value to Help24 copy.
 *
 * Total by construction: every input, including `undefined` and a plain string,
 * produces one of the objects written above. There is no path that returns
 * something derived from the error's own message.
 */
export function toFailure(error: unknown): ActionFailure {
  const code = codeOf(error);
  if (code !== null && Object.prototype.hasOwnProperty.call(BY_CODE, code)) {
    return BY_CODE[code];
  }
  return GENERIC;
}

/** The link arrived without the parameters an action needs. */
export const MALFORMED: ActionFailure = {
  title: "This link is incomplete",
  message:
    "Some of the link is missing, so we can't tell what it was for. That " +
    "usually happens when a link is copied by hand or broken across two lines " +
    "by an email app.",
  next: "Open the link directly from your email, or ask for a new one in the Help24 app.",
};

/** A mode the provider supports but Help24 does not use. */
export const UNSUPPORTED: ActionFailure = {
  title: "This link isn't one we can open here",
  message:
    "We couldn't tell what this link was for, so nothing on your account has changed.",
  next: "Open the most recent Help24 email and use the link there, or start again from the app.",
};

/**
 * Password rules, matching `AuthService.validatePassword` in the mobile app
 * exactly. Returns null when the password is acceptable.
 *
 * Kept in step with the app on purpose: a password the app would accept but
 * this page rejects (or the reverse) is a contradiction the user experiences as
 * the product being broken.
 */
export const MIN_PASSWORD_LENGTH = 8;

export function validatePassword(password: string): string | null {
  if (password.length === 0) return "Enter a password.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (/^\d+$/.test(password)) return "Add letters as well as numbers.";
  return null;
}

/**
 * True when a failed submission should keep the user on the password form
 * rather than throwing them out to an error page.
 *
 * The distinction matters: a weak password is something the user can fix in
 * place with the code still valid, whereas a dead code means the form itself is
 * pointless and leaving them typing into it would be a lie.
 */
export function isFixableOnForm(error: unknown): boolean {
  const code = codeOf(error);
  return code === "auth/weak-password" || code === "auth/missing-password";
}
