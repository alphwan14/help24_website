"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { parseActionRequest, type Mode } from "./request";
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
  passwordStrength,
  MIN_PASSWORD_LENGTH,
  STRENGTH_LABELS,
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
 *
 * WHAT THE PRESENTATION IS FOR
 * ----------------------------
 * A person reaches this page by clicking a link in an email, which is the most
 * impersonated action there is, and is then asked to type a credential for an
 * account that holds escrow money. Every presentation decision below answers
 * one question: does this look like the real Help24, and is it obvious what to
 * do? Hence the reduced chrome, one heading per state, the account being acted
 * on shown as a labelled row rather than buried in a sentence, and no
 * decoration that a template could have supplied.
 */

type Phase =
  /** Checking the code, or applying an action that needs no input. */
  | { kind: "working" }
  /** Password reset only: the code is good, waiting for a new password. */
  | { kind: "form"; email: string }
  /** Password reset only: the new password is being saved. */
  | { kind: "saving"; email: string }
  | { kind: "done"; mode: Mode; email: string | null }
  | { kind: "failed"; failure: ActionFailure };

/**
 * Success copy, one entry per action this handler completes.
 *
 * Three fields, three different jobs, and no two of them may say the same
 * thing: `title` is what happened, `body` is the consequence the user cannot
 * infer, `next` is the single action left. The eyebrow labels that used to sit
 * above each title ("PASSWORD UPDATED" over "Your new password is ready") were
 * the heading twice in two typefaces, which is decoration wearing the costume
 * of information.
 */
const SUCCESS: Record<Mode, { title: string; body: string; next: string }> = {
  resetPassword: {
    title: "Your password has been changed",
    body: "The old password no longer works, on this or any other device.",
    next: "Open Help24 and sign in with your new password.",
  },
  verifyEmail: {
    title: "Your email address is confirmed",
    body: "This is now the address we use to get you back into your account if you are ever locked out.",
    next: "Open Help24 and carry on where you left off.",
  },
  recoverEmail: {
    title: "Your email address has been restored",
    body: "The change to your account email has been reversed.",
    next: "If you did not ask for that change, reset your password now — someone else may have had access.",
  },
  verifyAndChangeEmail: {
    title: "Your email address has been updated",
    body: "Help24 will use this address for signing in and for account recovery.",
    next: "Open Help24 and sign in with your new address.",
  },
};

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

    const search = window.location.search;

    // Synchronously, before any network call. See the note at the top.
    window.history.replaceState(null, "", window.location.pathname);

    // Pure, and tested without a browser — see ./request.ts. `signIn`
    // (email-link sign-in) classifies as `unsupported`: Help24 does not use it,
    // and guessing at an action we do not support would be worse than saying so
    // plainly.
    const request = parseActionRequest(search);
    if (request.kind !== "run") {
      setPhase({
        kind: "failed",
        failure: request.kind === "malformed" ? MALFORMED : UNSUPPORTED,
      });
      return;
    }

    codeRef.current = request.oobCode;
    void run(request.mode, request.oobCode);

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
      <Card outcome="failed">
        <StatusMark tone="attention" icon="alert" />
        <Heading>{phase.failure.title}</Heading>
        <Body>{phase.failure.message}</Body>
        <NextStep>{phase.failure.next}</NextStep>
        {/*
          No primary button here, deliberately. The action that resolves an
          expired link happens in the app, not on this page, so promoting a
          help link to primary would dress a detour up as the solution. Both
          routes out are offered at equal, quieter weight.
        */}
        <Actions
          secondary={{ label: "Help Centre", href: "/help" }}
          tertiary={{ label: "Contact support", href: "/support" }}
        />
      </Card>
    );
  }

  if (phase.kind === "done") {
    const copy = SUCCESS[phase.mode];
    return (
      <Card outcome={phase.mode}>
        <StatusMark tone="done" icon="check" />
        <Heading>{copy.title}</Heading>
        <Body>{copy.body}</Body>
        {phase.email ? <AccountRow email={phase.email} /> : null}
        <NextStep>{copy.next}</NextStep>
        {/*
          THE FLOW ENDS HERE, AND THAT IS THE CHANGE.
          --------------------------------------------
          This used to offer "Continue" → /auth/continue, which reported the
          same event a second time: "Your password has been changed" followed
          by "Your new password is ready". One action, two screens, no new
          information — and the second one reads as though the first had not
          taken effect.

          /auth/continue still exists and still carries its own full copy,
          because it is the address in `ActionCodeSettings.url` and is reached
          directly whenever the provider's own hosted page handled the action
          instead of this one. It is a landing page for that path, not a step
          in this one.

          Note also what is NOT here: the inbound `continueUrl` parameter. The
          provider restricts it to authorized domains, but a redirect target
          taken from a URL a stranger can craft is an open redirect waiting to
          happen, so it is ignored outright rather than validated.
        */}
        <Actions secondary={{ label: "Back to Help24", href: "/" }} />
      </Card>
    );
  }

  // phase.kind === "form" | "saving"
  const saving = phase.kind === "saving";
  return (
    <Card outcome="resetPassword-form">
      <StatusMark tone="neutral" icon="lock" />
      <Heading>Set a new password</Heading>
      <Body>Choose a password you have not used on Help24 before.</Body>
      <AccountRow email={phase.email} />

      <form onSubmit={onSubmit} className="mt-6" noValidate>
        {/*
          Invisible to a person, essential to a password manager. Without a
          username in the form, browsers save the new password against no
          account — or offer to update the wrong one. `hidden` rather than
          CSS-hidden so it is never focusable or read aloud.
        */}
        <input
          type="email"
          name="email"
          value={phase.email}
          autoComplete="username"
          readOnly
          hidden
        />

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
        <StrengthMeter password={password} />
        <p id="password-rule" className="mt-2 text-body-sm text-text-tertiary">
          At least {MIN_PASSWORD_LENGTH} characters, with letters as well as numbers.
        </p>

        <div className="mt-5">
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
            className="mt-4 flex items-start gap-2.5 rounded-card border border-error/40 bg-error/10 p-3 text-body-sm text-text-primary"
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

        <p className="mt-4 text-center text-body-sm text-text-tertiary">
          You will stay signed out on other devices until you sign in again.
        </p>
      </form>
    </Card>
  );
}

// ── Presentation ───────────────────────────────────────────────────────────
// Deliberately local. These are the shapes this one flow needs; promoting them
// into components/ would invite unrelated pages to depend on them and make this
// page harder to change.

function Working() {
  return (
    <div
      className="w-full rounded-card border border-border bg-card p-6 shadow-card sm:p-8"
      role="status"
      aria-live="polite"
      data-outcome="working"
    >
      <span className="sr-only">Checking your link…</span>
      <div className="animate-pulse" aria-hidden>
        <div className="h-10 w-10 rounded-badge bg-border/60" />
        <div className="mt-6 h-6 w-2/3 rounded bg-border/60" />
        <div className="mt-4 h-4 w-full rounded bg-border/40" />
        <div className="mt-2 h-4 w-5/6 rounded bg-border/40" />
      </div>
    </div>
  );
}

function Card({
  outcome,
  children,
}: {
  outcome: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full rounded-card border border-border bg-card p-6 shadow-card sm:p-8"
      data-outcome={outcome}
    >
      {children}
    </div>
  );
}

/**
 * A small, quiet state marker.
 *
 * Its predecessor was a 56px glyph inside an 8px coloured ring — the halo that
 * every generated confirmation page in the world opens with. At this size it
 * labels the state without competing with the heading for the first look,
 * which is the job a status marker actually has.
 */
function StatusMark({
  tone,
  icon,
}: {
  tone: "done" | "attention" | "neutral";
  icon: string;
}) {
  const styles =
    tone === "done"
      ? "bg-money/10 text-money"
      : tone === "attention"
        ? "bg-warning/10 text-warning"
        : "bg-primary/10 text-primary-bright";
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-badge ${styles}`}
      aria-hidden
    >
      <Icon name={icon} className="h-5 w-5" />
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mt-5 text-h3 font-semibold tracking-tight text-text-primary sm:text-h2">
      {children}
    </h1>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-body-lg text-text-secondary">{children}</p>;
}

/**
 * The account being acted on, as a labelled row rather than a phrase inside a
 * paragraph.
 *
 * Someone who follows a reset link needs to check one thing before typing: is
 * this my account? A bolded address halfway through a sentence makes that a
 * reading task. This makes it a glance, and it is the same shape the mobile
 * app uses on its own email steps, so the two surfaces agree.
 */
function AccountRow({ email }: { email: string }) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-button border border-border bg-page/60 px-4 py-3">
      <span className="shrink-0 text-text-tertiary" aria-hidden>
        <Icon name="mail" className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-label-md text-text-tertiary">Account</span>
        <span className="block truncate text-body font-medium text-text-primary">
          {email}
        </span>
      </span>
    </div>
  );
}

function NextStep({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-button border border-border bg-page/60 p-4">
      <span className="mt-0.5 shrink-0 text-primary-bright" aria-hidden>
        <Icon name="phone" className="h-4 w-4" />
      </span>
      <p className="text-body text-text-secondary">{children}</p>
    </div>
  );
}

function Actions({
  primary,
  secondary,
  tertiary,
}: {
  primary?: { label: string; href: string };
  secondary: { label: string; href: string };
  tertiary?: { label: string; href: string };
}) {
  const outline =
    "inline-flex items-center justify-center gap-2 rounded-button border border-border-strong bg-transparent px-5 py-3 text-body font-semibold text-text-primary transition-colors hover:bg-page/60";
  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      {primary && (
        <Link
          href={primary.href}
          className="inline-flex items-center justify-center gap-2 rounded-button bg-primary px-5 py-3 text-body font-semibold text-white transition-opacity hover:opacity-95"
        >
          {primary.label}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      )}
      <Link href={secondary.href} className={outline}>
        {secondary.label}
      </Link>
      {tertiary && (
        <Link href={tertiary.href} className={outline}>
          {tertiary.label}
        </Link>
      )}
    </div>
  );
}

/**
 * Length-first strength feedback, identical in bands and wording to the meter
 * on the app's create-account step.
 *
 * It appears only once there is something to judge. A meter sitting at zero
 * under an empty field is a scold before the user has done anything, and the
 * rule underneath already says what is required.
 */
function StrengthMeter({ password }: { password: string }) {
  if (password.length === 0) return null;
  const score = passwordStrength(password);
  const fill = [
    "bg-error",
    "bg-warning",
    "bg-secondary",
    "bg-money",
  ][score];
  const text = ["text-error", "text-warning", "text-secondary", "text-money"][
    score
  ];
  return (
    <div className="mt-3 flex items-center gap-3" aria-hidden>
      <div className="flex flex-1 gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < score ? fill : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className={`w-16 text-right text-body-sm font-medium ${text}`}>
        {STRENGTH_LABELS[score]}
      </span>
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
      <div className="relative flex items-center rounded-button border border-border bg-page/60 transition-[border-color,box-shadow] focus-within:border-primary focus-within:shadow-[0_0_0_1px_var(--primary)]">
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
          // 44px square: the minimum comfortable touch target, and the reason
          // this control is usable one-handed on a phone.
          className="absolute right-1 flex h-11 w-11 items-center justify-center rounded-button text-text-tertiary transition-colors hover:text-text-primary"
        >
          <Icon name={reveal ? "eye-off" : "eye"} className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * The line under the card.
 *
 * It does NOT point at a mailbox. `support@help24.co.ke` has no inbound mail
 * route on this domain today — the apex carries no MX record, so a sender
 * falls back to the web host's address and the message times out. Handing
 * someone who suspects their account is being attacked an address that bounces
 * is worse than handing them nothing, so this routes to the support page,
 * which works.
 */
export function Assurance() {
  return (
    <p className="mt-5 px-2 text-center text-body-sm text-text-tertiary">
      Did not ask for this? Nothing on your account has changed.{" "}
      <Link href="/support" className="font-medium text-primary-bright hover:underline">
        Tell us
      </Link>{" "}
      and we will secure it.
    </p>
  );
}
