"use client";
import { FormData } from "@/lib/frontend/types/form";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";

interface PageLayoutProps {
  children: React.ReactNode;
  form: FormData;
}

export default function PageLayout({ children, form }: PageLayoutProps) {
  const hasHeaderOrFooterSections =
    (form?.profile?.featured?.length ?? 0) > 0 ||
    (form?.profile?.services?.length ?? 0) > 0 ||
    (form?.posts?.posts?.length ?? 0) > 0 ||
    (form?.profile?.faqs?.length ?? 0) > 0 ||
    (form?.profile?.testimonials?.length ?? 0) > 0;

  const sections = {
    featured: (form?.profile?.featured?.length ?? 0) > 0,
    posts: (form?.posts?.posts?.length ?? 0) > 0,
    services: (form?.profile?.services?.length ?? 0) > 0,
    faqs: (form?.profile?.faqs?.length ?? 0) > 0,
    testimonials: (form?.profile?.testimonials?.length ?? 0) > 0,
  };
  return (
    <>
      {hasHeaderOrFooterSections && <PageHeader showNav sections={sections} form={form} />}
      <main>{children}</main>
      {hasHeaderOrFooterSections && <PageFooter form={form} />}
    </>
  );
}
