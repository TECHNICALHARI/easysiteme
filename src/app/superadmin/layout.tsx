import SuperAdminSidebar from '@/lib/frontend/superadmin/SuperAdminSidebar';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/styles/superadmin.module.css';
import '@/styles/globals.css';
import { ToastProvider } from '@/lib/frontend/common/ToastProvider';


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
        <div className="flex h-screen overflow-hidden">
          <SuperAdminSidebar />
          <main className="flex-1 overflow-y-auto p-6 bg-muted">
            <ToastProvider>
              {children}
            </ToastProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
