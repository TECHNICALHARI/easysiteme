import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import AdminLayout from "@/lib/frontend/admin/layout/AdminLayout";
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
  themeColor: "#111827",
};

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | myeasypage",
    template: "%s | Admin | myeasypage",
  },
  description: "Admin panel for myeasypage SaaS platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ToastProvider>
          <AdminLayout>
            {children}
          </AdminLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
