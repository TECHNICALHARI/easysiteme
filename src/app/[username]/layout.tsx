import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import dummyFormData from '@/lib/frontend/utils/dummyForm';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-base',
  display: 'swap',
});

export const metadata: Metadata = {
  title: dummyFormData.seo.metaTitle || `${dummyFormData.profile.fullName} | OnePage`,
  description:
    dummyFormData.seo.metaDescription ||
    `Check out ${dummyFormData.profile.fullName}’s OnePage profile.`,
  openGraph: {
    title: dummyFormData.seo.metaTitle,
    description: dummyFormData.seo.metaDescription,
    images: dummyFormData.profile.avatar
      ? [dummyFormData.profile.avatar]
      : [],
  },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
