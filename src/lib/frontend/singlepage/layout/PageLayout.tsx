import { FormData } from '@/lib/frontend/types/form';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';

interface PageLayoutProps {
  children: React.ReactNode;
  form: FormData;
}

export default function PageLayout({ children, form }: PageLayoutProps) {
  const hasHeaderOrFooterSections =
    form.profile?.featured?.length ||
    form.profile?.services?.length ||
    form.posts?.posts?.length ||
    form.profile?.faqs?.length ||
    form.profile?.testimonials?.length;

  const sections = {
    featured: !!form.profile?.featured?.length,
    posts: !!form.posts?.posts?.length,
    services: !!form.profile?.services?.length,
    faqs: !!form.profile?.faqs?.length,
    testimonials: !!form.profile?.testimonials?.length,
  };

  return (
    <>
      {hasHeaderOrFooterSections && <PageHeader showNav={true} sections={sections} />}
      {children}
      {hasHeaderOrFooterSections && <PageFooter />}
    </>
  );
}
