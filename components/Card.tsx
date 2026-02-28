/**
 * Help24 design system card:
 * Background: card (#1C1C1E), border 1px, radius 16px,
 * padding 16px, shadow subtle + soft glow (dark ~20%)
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-card p-4 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
