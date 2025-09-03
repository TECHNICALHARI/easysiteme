import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import type { FormData } from "@/lib/frontend/types/form";
import { getUserPageService } from "@/lib/frontend/api/services";
import { UserPageProvider } from "@/lib/frontend/singlepage/context/UserPageProvider";
import { notFound } from "next/navigation";
import dummyFormData from "@/lib/frontend/utils/dummyForm";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-base",
  display: "swap",
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
};

async function fetchUserPage(username: string): Promise<FormData | null> {
  try {
    const res = await getUserPageService(username, {
      next: { revalidate: 60 },
    });
    return res.success ? (res.data as FormData) : null;
  } catch {
    // return null;
    return dummyFormData;
  }
}

export async function generateMetadata(props: LayoutProps): Promise<Metadata> {
  const { username } = await props.params;
  const data = await fetchUserPage(username);

  if (!data) {
    return {
      title: "User Not Found | myeasypage",
      description: "This page could not be found.",
      robots: { index: false, follow: false },
    };
  }


  const seo = data.seo ?? {};
  const profile = data.profile ?? {};

  return {
    title: seo.metaTitle || `${profile.fullName || username} | myeasypage`,
    description:
      seo.metaDescription ||
      `Check out ${profile.fullName || username}’s myeasypage profile.`,
    keywords: seo.metaKeywords || [],
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || profile.fullName || username,
      description: seo.ogDescription || seo.metaDescription,
      images: seo.ogImage
        ? [seo.ogImage]
        : profile.avatar
          ? [profile.avatar]
          : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.metaTitle,
      description: seo.twitterDescription || seo.metaDescription,
      images: seo.twitterImage ? [seo.twitterImage] : [],
    },
    robots: {
      index: seo.noIndex ? false : true,
      follow: seo.noFollow ? false : true,
    },
  };
}

export default async function UserLayout(props: LayoutProps) {
  const { username } = await props.params;
  const data = await fetchUserPage(username);

  if (!data) {
    notFound();
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <UserPageProvider data={data}>{props.children}</UserPageProvider>
      </body>
    </html>
  );
}
