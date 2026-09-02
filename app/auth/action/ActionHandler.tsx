"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SITE } from "@/lib/site";
import { OUTCOME_PARAM } from "../continue/outcome";
import {
  client,
  verifyPasswordResetCode,
  confirmPasswordReset,
  checkActionCode,
  applyActionCode,
} from "./firebase";
import {
  toFailure,
  isFixableOnForm,
  validatePassword,
  MIN_PASSWORD_LENGTH,
  MALFORMED,
  UNSUPPORTED,
  type ActionFailure,
} from "./errors";

/**
 * The Help24 identity action handler.
 *
 * WHAT THIS PAGE IS
 * -----------------
 * The destination for the button in a Help24 password-reset or
 * email-confirmation message. It receives a single-use code, performs the
 * action against the identity service, and reports the result — in Help24's
 * words, on Help24's domain. It replaces the provider's own hosted page, which
 * is unbranded and says nothing a Help24 user recognises.
 *
 * WHY EVERY PARAMETER IS READ IN THE BROWSER
 * ------------------------------------------
 * An unconsumed reset code is a live credential: whoever holds it can set that
 * account's password. This component therefore reads the query string from
 * `window.location` inside an effect, and the page that renders it is a STATIC
 * shell that never receives `searchParams`.
 *
 * That is not stylistic. A server-rendered page ships its props inside the
 * streamed payload, so a value which is never *displayed* is still *sent* — I
 * measured exactly that on `/auth/continue` before it was fixed: a request
 * carrying `oobCode` and `apiKey` returned HTTP 200 with both of them sitting
 * in the HTML. Reading in the browser means the server never holds the code at
 * all, and there is nothing in the document to leak.
 *
 * WHY THE URL IS REWRITTEN BEFORE ANY AWAIT
 * -----------------------------------------
 * `history.replaceState` runs synchronously, before the first network call. If
 * it waited for the identity round-trip, a slow connection would leave the code
 * in the address bar — and so in browser history, in the `Referer` of every
 * link on this page, and on the screen of anyone glancing over the user's
 * shoulder. Stripping first makes that window zero.
 */

type Mode =
  | "resetPassword"
  | "verifyEmail"
  | "recoverEmail"
  | "verifyAndChangeEmail";

type Phase =
  /** Checking the code, or applying an action that needs no input. */
  | { kind: "working" }
  /** Password reset only: the code is good, waiting for a new password. */
  | { kind: "form"; email: string }
  /** Password reset only: the new password is being saved. */
  | { kind: "saving"; email: string }
  | { kind: "done"; mode: Mode; email: string | null }
  | { kind: "failed"; failure: ActionFailure };

/** Success copy, one entry per action this handler completes. */
const SUCCESS: Record<
  Mode,
  { eyebrow: string; title: string; body: string; next: string }
> = {
  resetPassword: {
    eyebrow: "Password updated",
    title: "Your new password is ready",
    body: "Your Help24 password has been changed. The old one no longer works, on any device.",
    next: "Open Help24 on your phone and sign in with your new password.",
  },
  verifyEmail: {
    eyebrow: "Email confirmed",
    title: "Your email address is confirmed",
    body: "Thanks — we know this mailbox is yours. It is now the address we use to help you back into your account.",
    next: "Open Help24 on your phone and carry on where you left off.",
  },
  recoverEmail: {
    eyebrow: "Email restored",
    title: "Your email address has been restored",
    body: "The change to your account email has been reversed.",
    next: "If you did not ask for that change, reset your password now — someone else may have had access.",
  },
  verifyAndChangeEmail: {
    eyebrow: "Email updated",
    title: "Your email address has been updated",
    body: "Your Help24 account now uses this address for sign-in and account recovery.",
    next: "Open Help24 on your phone and sign in with your new address.",
  },
};

function isMode(value: string): value is Mode {
  return (
    value === "resetPassword" ||
    value === "verifyEmail" ||
    value === "recoverEmail" ||
    value === "verifyAndChangeEmail"
  );
}

export function ActionHandler() {
  const [phase, setPhase] = useState<Phase>({ kind: "working" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [reveal, setReveal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * The single-use code, held only in memory.
   *
   * A ref rather than state: it must not participate in rendering, and it must
   * survive the double effect invocation React performs in development without
   * being re-read from a URL that no longer carries it.
   */
  const codeRef = useRef<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    // Guards that development double-invoke. Without it an action that
    // CONSUMES its code (verifyEmail) would run twice: the first call spends
    // the code, the second fails, and the user is told a link that worked did
    // not — the most confusing failure this page could produce.
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const code = params.get("oobCode");

    // Synchronously, before any network call. See the note at the top.
    window.history.replaceState(null, "", window.location.pathname);

    if (!code || !mode) {
      setPhase({ kind: "failed", failure: MALFORMED });
      return;
    }
    if (!isMode(mode)) {
      // `signIn` (email-link sign-in) lands here too. Help24 does not use it,
      // and guessing at an action we do not support would be worse than saying
      // so plainly.
      setPhase({ kind: "failed", failure: UNSUPPORTED });
      return;
    }

    codeRef.current = code;
    void run(mode, code);

    async function run(m: Mode, oobCode: string) {
      const auth = client();
      try {
        if (m === "resetPassword") {
          // Checks the code WITHOUT spending it, and returns the address it
          // belongs to. The code is consumed only when the user submits a new
          // password, which is what makes an abandoned form harmless.
          const email = await verifyPasswordResetCode(auth, oobCode);
          setPhase({ kind: "form", email });
          return;
        }

        if (m === "verifyEmail") {
          await applyActionCode(auth, oobCode);
          codeRef.current = null;
          setPhase({ kind: "done", mode: m, email: null });
          return;
        }

        // recoverEmail / verifyAndChangeEmail — read the address first so the
        // confirmation can name it. `checkActionCode` does not consume.
        const info = await checkActionCode(auth, oobCode);
        await applyActionCode(auth, oobCode);
        codeRef.current = null;
        setPhase({ kind: "done", mode: m, email: info.data.email ?? null });
      } catch (error) {
        // Mapped, never echoed, never logged: the provider's own text names
        // systems the reader has never heard of, and the code itself must not
        // reach a console where an extension or a log drain could collect it.
        setPhase({ kind: "failed", failure: toFailure(error) });
      }
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase.kind !== "form") return;

    const invalid = validatePassword(password);
    if (invalid) {
      setFormError(invalid);
      return;
    }
    if (password !== confirm) {
      setFormError("Those two passwords do not match.");
      return;
    }

    const oobCode = codeRef.current;
    if (!oobCode) {
      setPhase({ kind: "failed", failure: MALFORMED });
      return;
    }

    const { email } = phase;
    setFormError(null);
    setPhase({ kind: "saving", email });

    try {
      await confirmPasswordReset(client(), oobCode, password);
      codeRef.current = null;
      setPassword("");
      setConfirm("");
      setPhase({ kind: "done", mode: "resetPassword", email });
    } catch (error) {
      if (isFixableOnForm(error)) {
        // The code is still good — keep them on the form so one weak password
        // does not cost them the whole link.
        setFormError(toFailure(error).next);
        setPhase({ kind: "form", email });
        return;
      }
      setPhase({ kind: "failed", failure: toFailure(error) });
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (phase.kind === "working") return <Working />;

  if (phase.kind === "failed") {
    return (
      <Shell tone="attention" icon="alert" eyebrow="We could not do that" outcome="failed">
        <Heading>{phase.failure.title}</Heading>
        <Body>{phase.failure.message}</Body>
        <NextStep>{phase.failure.next}</NextStep>
        <Actions
          primary={{ label: "Visit Help Centre", href: "/help" }}
          secondary={{ label: "Contact support", href: "/support" }}
        />
      </Shell>
    );
  }

  if (phase.kind === "done") {
    const copy = SUCCESS[phase.mode];
    return (
      <Shell tone="done" icon="check" eyebrow={copy.eyebrow} outcome={phase.mode}>
        <Heading>{copy.title}</Heading>
        <Body>
          {copy.body}
          {phase.email ? (
            <>
              {" "}
              The address on your account is{" "}
              <span className="font-medium text-text-primary">{phase.email}</span>.
            </>
          ) : null}
        </Body>
        <NextStep>{copy.next}</NextStep>
        <Actions
          // Hard-coded, internal, and never derived from the inbound
          // `continueUrl`. The provider restricts that value to authorized
          // domains, but a redirect target taken from a URL a stranger can
          // craft is an open redirect waiting to happen, so it is ignored
          // outright rather than validated.
          primary={{
            label: "Continue",
            href: `/auth/continue?${OUTCOME_PARAM}=${phase.mode}`,
          }}
          secondary={{ label: "Back to Help24", href: "/" }}
        />
      </Shell>
    );
  }

  // phase.kind === "form" | "saving"
  const saving = phase.kind === "saving";
  return (
    <Shell
      tone="neutral"
      icon="lock"
      eyebrow="Choose a new password"
      outcome="resetPassword-form"
    >
      <Heading>Set a new password</Heading>
      <Body>
        You are resetting the password for{" "}
        <span className="font-medium text-text-primary">{phase.email}</span>.
      </Body>

      <form onSubmit={onSubmit} className="mt-6" noValidate>
        <PasswordField
          id="new-password"
          label="New password"
          value={password}
          onChange={setPassword}
          reveal={reveal}
          onToggleReveal={() => setReveal((r) => !r)}
          autoComplete="new-password"
          autoFocus
          disabled={saving}
          describedBy="password-rule"
          invalid={formError !== null}
        />
        <p id="password-rule" className="mt-2 text-body-sm text-text-tertiary">
          At least {MIN_PASSWORD_LENGTH} characters, with letters as well as numbers.
        </p>

        <div className="mt-4">
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            reveal={reveal}
            onToggleReveal={() => setReveal((r) => !r)}
            autoComplete="new-password"
            disabled={saving}
            invalid={formError !== null}
          />
        </div>

        {formError && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-card border border-error/40 bg-error/10 p-3 text-body-sm text-text-primary"
          >
            <span className="mt-0.5 shrink-0 text-error" aria-hidden>
              <Icon name="alert" className="h-4 w-4" />
            </span>
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-button bg-primary px-5 py-3.5 text-body font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save new password"}
        </button>
      </form>
    </Shell>
  );
}

// ── Presentation ───────────────────────────────────────────────────────────
// Deliberately local. These are the shapes this one flow needs; promoting them
// into components/ would invite unrelated pages to depend on them and make this
// page harder to change.

function Working() {
  return (
    <div
      className="w-full rounded-card border border-border bg-card p-6 shadow-card sm:p-10"
      role="status"
      aria-live="polite"
      data-outcome="working"
    >
      <span className="sr-only">Checking your link…</span>
      <div className="animate-pulse" aria-hidden>
        <div className="h-14 w-14 rounded-badge bg-border/60" />
        <div className="mt-6 h-3 w-24 rounded bg-border/60" />
        <div className="mt-4 h-8 w-3/4 rounded bg-border/60" />
        <div className="mt-5 h-4 w-full rounded bg-border/40" />
        <div className="mt-2 h-4 w-5/6 rounded bg-border/40" />
      </div>
    </div>
  );
}

function Shell({
  tone,
  icon,
  eyebrow,
  outcome,
  children,
}: {
  tone: "done" | "attention" | "neutral";
  icon: string;
  eyebrow: string;
  outcome: string;
  children: React.ReactNode;
}) {
  const accent =
    tone === "done"
      ? "text-money"
      : tone === "attention"
        ? "text-warning"
        : "text-primary-bright";
  const accentBg =
    tone === "done"
      ? "bg-money/10"
      : tone === "attention"
        ? "bg-warning/10"
        : "bg-primary/10";
  const accentRing =
    tone === "done"
      ? "ring-money/20"
      : tone === "attention"
        ? "ring-warning/20"
        : "ring-primary/20";

  return (
    <div
      className="w-full rounded-card border border-border bg-card p-6 shadow-card sm:p-10"
      data-outcome={outcome}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-badge ring-8 ${accentBg} ${accentRing} ${accent}`}
      >
        <Icon name={icon} className="h-7 w-7" />
      </div>
      <p className={`mt-6 text-label-md font-medium uppercase tracking-wider ${accent}`}>
        {eyebrow}
      </p>
      {children}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
      {children}
    </h1>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">{children}</p>
  );
}

function NextStep({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-card border border-border bg-bg-dark/40 p-4">
      <span className="mt-0.5 shrink-0 text-primary-bright" aria-hidden>
        <Icon name="phone" className="h-5 w-5" />
      </span>
      <p className="text-body text-text-secondary">{children}</p>
    </div>
  );
}

function Actions({
  primary,
  secondary,
}: {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        href={primary.href}
        className="inline-flex items-center justify-center gap-2 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95"
      >
        {primary.label}
        <Icon name="arrow" className="h-4 w-4" />
      </Link>
      <Link
        href={secondary.href}
        className="inline-flex items-center justify-center gap-2 rounded-button border border-border bg-transparent px-5 py-3 text-body font-semibold text-text-primary transition-colors hover:bg-card/50"
      >
        {secondary.label}
      </Link>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  reveal,
  onToggleReveal,
  autoComplete,
  autoFocus,
  disabled,
  describedBy,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  reveal: boolean;
  onToggleReveal: () => void;
  autoComplete: string;
  autoFocus?: boolean;
  disabled?: boolean;
  describedBy?: string;
  invalid?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-body-sm font-medium text-text-secondary"
      >
        {label}
      </label>
      <div className="relative flex items-center rounded-button border border-border bg-bg-dark/40 transition-[border-color,box-shadow] focus-within:border-primary focus-within:shadow-[0_0_0_1px_var(--primary)]">
        <input
          id={id}
          name={id}
          type={reveal ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          className="w-full bg-transparent px-4 py-3 pr-12 text-body text-text-primary outline-none placeholder:text-text-tertiary disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onToggleReveal}
          aria-label={reveal ? "Hide password" : "Show password"}
          aria-pressed={reveal}
          className="absolute right-2 rounded-button p-2 text-text-tertiary transition-colors hover:text-text-primary"
        >
          <Icon name={reveal ? "lock" : "user"} className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/** Reassurance strip under the card. The only address on the page. */
export function Assurance() {
  return (
    <p className="mt-6 px-2 text-center text-body-sm text-text-tertiary">
      You are on {SITE.domain}, the official Help24 site. Did not request this?{" "}
      <a
        href={`mailto:${SITE.supportEmail}`}
        className="font-medium text-primary-bright hover:underline"
      >
        Tell us
      </a>{" "}
      and we will secure your account.
    </p>
  );
}
