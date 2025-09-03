import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/lib/frontend/main/layout/Header";
import Footer from "@/lib/frontend/main/layout/Footer";
import { ToastProvider } from "@/lib/frontend/common/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-base",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://myeasypage.com"),
  applicationName: "myeasypage",
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "myeasypage — Build your personal site in 60 seconds",
    description:
      "Create a beautiful personal or business page in under a minute. Custom sections, your own subdomain, and instant publishing — no code.",
    url: "https://myeasypage.com/",
    siteName: "myeasypage",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "myeasypage preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "myeasypage — Build your personal site in 60 seconds",
    description:
      "Create a beautiful personal or business page in under a minute. Custom sections, your own subdomain, and instant publishing — no code.",
    images: ["/og-default.jpg"],
    // site: "@your_handle",
    // creator: "@your_handle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, telephone: false, address: false },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#4f46e5" }],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "myeasypage",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2">
          Skip to content
        </a>
        <ToastProvider>
          <Header />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
