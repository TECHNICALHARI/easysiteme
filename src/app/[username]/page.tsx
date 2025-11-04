"use client";
import clsx from "clsx";
import BioLayout from "@/lib/frontend/singlepage/BioLayout";
import WebsiteLayout from "@/lib/frontend/singlepage/WebsiteLayout";
import PageLayout from "@/lib/frontend/singlepage/layout/PageLayout";
import { useUserPage } from "@/lib/frontend/singlepage/context/UserPageProvider";
import themeStyles from "@/styles/theme.module.css";
import styles from "@/styles/preview.module.css";
import { usePublicPage } from "@/lib/frontend/singlepage/context/usePublicPageClient";

const THEME_FALLBACK = "brand" as const;

export default function PreviewPage() {
  const { data: initialData, etag: initialEtag } = useUserPage();
  const username = (initialData?.settings?.subdomain) ?? "";
  const { data: freshData, posts } = usePublicPage(username || "", initialEtag ?? null);
  const effective = freshData ?? initialData;
  if (!effective) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">This page is not available.</p>
      </div>
    );
  }
  const layoutType = effective.design?.layoutType ?? "bio";
  const theme = effective.design?.theme ?? THEME_FALLBACK;
  const ThemeClass = (themeStyles as Record<string, string>)[theme] ?? themeStyles[THEME_FALLBACK];

  return (
    <div className={clsx(styles.previewWrapper, ThemeClass)} data-theme={theme}>
      {layoutType === "website" ? (
        <PageLayout form={{ ...effective, posts: posts ? { posts } : effective.posts }}>
          <WebsiteLayout form={{ ...effective, posts: posts ? { posts } : effective.posts }} />
        </PageLayout>
      ) : (
        <BioLayout form={{ ...effective, posts: posts ? { posts } : effective.posts }}  />
      )}
    </div>
  );
}