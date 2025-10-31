import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import type { FormData } from "@/lib/frontend/types/form";
import { UserPageProvider } from "@/lib/frontend/singlepage/context/UserPageProvider";
import { notFound } from "next/navigation";
import dummyFormData from "@/lib/frontend/utils/dummyForm";
import { fetchPublicPageServer } from "@/lib/frontend/api/publicPages";
import NotFoundPage from "@/lib/frontend/common/NotFoundPage";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-base",
  display: "swap",
});

type LayoutProps = {
  children: React.ReactNode;
  params: { username: string } | Promise<{ username: string }>;
};

async function fetchUserPage(username: string): Promise<{ data: FormData | null; etag: string | null }> {
  try {
    const res = await fetchPublicPageServer(username);
    return { data: (res?.data as FormData) ?? null, etag: res?.etag ?? null };
  } catch {
    return { data: null, etag: null };
  }
}

export async function generateMetadata(props: LayoutProps): Promise<Metadata> {
  const params = await (props as any).params;
  const username = params?.username ?? "";
  const { data } = await fetchUserPage(username);
  if (!data) {
    return {
      title: "User Not Found | myeasypage",
      description: "This page could not be found.",
      robots: { index: false, follow: false },
    };
  }
  const seo = (data as any).settings?.seo ?? (data as any).seo ?? {};
  const profile = data.profile ?? {};
  return {
    title: seo.metaTitle || `${profile.fullName || username} | myeasypage`,
    description: seo.metaDescription || `Check out ${profile.fullName || username}’s myeasypage profile.`,
    keywords: seo.metaKeywords || [],
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || profile.fullName || username,
      description: seo.ogDescription || seo.metaDescription,
      images: seo.ogImage ? [seo.ogImage] : profile.avatar ? [profile.avatar] : [],
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
  const params = await (props as any).params;
  const username = params?.username ?? "";
  const result = await fetchUserPage(username);
  const data = result.data ?? null;
  const etag = result.etag ?? null;

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {
          data ?
            <UserPageProvider initialData={data ?? dummyFormData} initialEtag={etag ?? null}>
              {props.children}
            </UserPageProvider>
            :
            <NotFoundPage
              subtitle="User Not Found"
              message="Sorry, we couldn’t find this username on myeasypage."
              backHref="/"
              backLabel="Go to Home"
            />
        }
      </body>
    </html>
  );
}
