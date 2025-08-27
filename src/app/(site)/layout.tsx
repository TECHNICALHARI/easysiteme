import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/lib/frontend/main/layout/Header";
import Footer from "@/lib/frontend/main/layout/Footer";


const inter = Inter({ subsets: ["latin"], variable: "--font-base", display: "swap" });


export const metadata: Metadata = {
  metadataBase: new URL("https://myeasypage.com"),
  title: {
    default: "myeasypage — Build your personal site in 60 seconds",
    template: "%s | myeasypage",
  },
  description:
    "Create a beautiful personal or business page in under a minute. Custom sections, your own subdomain, and instant publishing — no code.",
  keywords: [
    "bio link",
    "link in bio",
    "one page website",
    "portfolio builder",
    "personal website",
    "no-code website",
    "subdomain website",
    "myeasypage",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "myeasypage — Build your personal site in 60 seconds",
    description:
      "Create a beautiful personal or business page in under a minute. Custom sections, your own subdomain, and instant publishing — no code.",
    url: "https://myeasypage.com/",
    siteName: "myeasypage",
    images: [{ url: "/og/og-default.jpg", width: 1200, height: 630, alt: "myeasypage preview" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "myeasypage — Build your personal site in 60 seconds",
    description:
      "Create a beautiful personal or business page in under a minute. Custom sections, your own subdomain, and instant publishing — no code.",
    images: ["/og/og-default.jpg"],
  },
  robots: { index: true, follow: true },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}