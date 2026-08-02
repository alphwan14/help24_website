import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./design-system.css";
import { SITE } from "@/lib/site";
import { PALETTE, tokensCss } from "@/lib/tokens";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_KE",
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/help24-icon.png", width: 1024, height: 1024, alt: SITE.name }],
  },
  twitter: {
    card: "summary",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/help24-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "D9h8qRAfBDA-dhJpE62MgpcCPE4_zqwb3daEgi5VQB0",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: PALETTE["bg-dark"],
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/help24-icon.png`,
  email: SITE.supportEmail,
  description: SITE.description,
  areaServed: "KE",
  sameAs: [
    "https://twitter.com/help24",
    "https://www.linkedin.com/company/help24",
    "https://www.instagram.com/help24",
  ],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/*
          The design tokens, as CSS custom properties, generated from
          lib/tokens.ts. Rendered on the server into <head> so the first paint
          already has them — a stylesheet cannot import a TypeScript module,
          and duplicating the palette into CSS is exactly the drift this
          project is trying to remove.
        */}
        <style dangerouslySetInnerHTML={{ __html: tokensCss() }} />
      </head>
      <body className="font-sans text-text-primary bg-bg-dark">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {children}
      </body>
    </html>
  );
}
