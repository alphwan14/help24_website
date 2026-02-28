import Link from "next/link";
import { type ButtonHTMLAttributes } from "react";

/**
 * Help24 design system:
 * Primary: bg primary, text white, radius 12px, padding 24×14px, 14px semibold
 * Secondary: border 1px surface border, text primary, same radius & padding
 */
type Variant = "primary" | "secondary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white border-0 hover:opacity-95 active:opacity-90",
  secondary:
    "border border-border bg-transparent text-text-primary hover:bg-card/50 active:bg-card/70",
  outline:
    "border border-border bg-transparent text-text-primary hover:bg-card/50 active:bg-card/70",
  ghost:
    "border border-transparent bg-transparent text-text-secondary hover:text-text-primary hover:bg-card/50",
};

const base =
  "inline-flex items-center justify-center rounded-button px-6 py-3.5 text-body font-semibold transition-all duration-200 disabled:opacity-50";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
}

export function ButtonLink({
  variant = "primary",
  children,
  className = "",
  href,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
