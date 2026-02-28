/**
 * Help24 design system card:
 * Background: card (#1C1C1E), border 1px, radius 16px,
 * padding 16px, shadow subtle + soft glow (dark ~20%)
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "hover" | "gradient";
  onClick?: () => void;
}

const variants = {
  default: "border border-border bg-card shadow-card",
  hover: "border border-border bg-card shadow-card hover:shadow-card-glow hover:border-border/80 transition-all duration-300 cursor-pointer",
  gradient: "border border-border bg-card shadow-card relative overflow-hidden",
};

export function Card({
  children,
  className = "",
  variant = "default",
  onClick,
}: CardProps) {
  return (
    <div
      className={`rounded-card p-4 ${variants[variant]} ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {variant === "gradient" && (
        <div className="pointer-events-none absolute inset-0 rounded-card bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
