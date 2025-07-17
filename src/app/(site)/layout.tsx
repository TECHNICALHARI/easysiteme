import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/lib/frontend/main/layout/Header";
import Footer from "@/lib/frontend/main/layout/Footer";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-base",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OnePage | SaaS Builder",
  description: "Create beautiful personal and business websites in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
