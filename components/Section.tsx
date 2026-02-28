interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  narrow?: boolean;
}

export function Section({
  id,
  children,
  className = "",
  containerClassName = "",
  narrow = false,
}: SectionProps) {
  return (
    <section id={id} className={`py-section ${className}`}>
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-3xl" : "max-w-6xl"} ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

/** Section label above titles — 12px / 500 (label medium), primary color */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-label-md font-medium uppercase tracking-wider text-primary">
      {children}
    </p>
  );
}
