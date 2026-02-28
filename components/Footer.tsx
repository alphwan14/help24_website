import Link from "next/link";

const links = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "For providers", href: "#providers" },
    { label: "Early access", href: "#early-access" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

const socials = [
  { label: "Twitter", href: "#", icon: "X" },
  { label: "LinkedIn", href: "#", icon: "in" },
  { label: "Instagram", href: "#", icon: "ig" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-16">
          <div className="max-w-xs">
            <Link href="/" className="text-h5 font-semibold text-text-primary">
              Help<span className="text-primary">24</span>
            </Link>
            <p className="mt-3 text-body-sm text-text-tertiary">
              Get anything done, anytime, anywhere.
            </p>
            <div className="mt-5 flex gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-body-sm text-text-tertiary transition-colors hover:text-text-secondary"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-12 md:gap-16">
            {Object.entries(links).map(([group, items]) => (
              <div key={group}>
                <h3 className="text-section-title font-semibold uppercase tracking-wider text-text-tertiary">
                  {group}
                </h3>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-body-sm text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 border-t border-border pt-8 text-center text-body-sm text-text-tertiary">
          © {new Date().getFullYear()} Help24. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
