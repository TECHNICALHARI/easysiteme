import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import AdminHeader from "@/lib/frontend/admin/layout/Header";
import AdminLayout from "@/lib/frontend/admin/layout/AdminLayout";

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
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
