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
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-3xl" : ""} ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p className={`mb-4 text-label-md font-medium uppercase tracking-wider text-primary ${className}`}>
      {children}
    </p>
  );
}
