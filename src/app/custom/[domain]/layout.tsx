import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/styles/superadmin.module.css';
import '@/styles/globals.css';


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-base",
  display: "swap",
});

export const metadata: Metadata = {
  title: "myeasypage | SaaS Builder",
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
          <main className="flex-1 overflow-y-auto p-6 bg-muted">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
