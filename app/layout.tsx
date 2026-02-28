import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./design-system.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Help24 — Get anything done, anytime, anywhere",
  description:
    "From urgent help to everyday tasks — connect with trusted service providers instantly.",
  metadataBase: new URL("https://help24.com"),
  openGraph: {
    title: "Help24 — Get anything done, anytime, anywhere",
    description:
      "From urgent help to everyday tasks — connect with trusted service providers instantly.",
  },
  verification: {
    google: "D9h8qRAfBDA-dhJpE62MgpcCPE4_zqwb3daEgi5VQB0",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans text-text-primary bg-bg-dark">{children}</body>
    </html>
  );
}
