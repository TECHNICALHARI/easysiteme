'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { FormData, Link as LinkType } from '@/lib/frontend/types/form';

import HeaderSection from './components/HeaderSection';
import SocialSection from './components/SocialSection';
import LinkSection from './components/LinkSection';
import FeaturedSection from './components/FeaturedSection';
import EmbedSection from './components/EmbedSection';
import ServiceSection from './components/ServiceSection';
import TestimonialSection from './components/TestimonialSection';
import FAQSection from './components/FAQSection';
import PostsSection from './components/PostsSection';
import MapSection from './components/MapSection';
import PageFooter from './layout/PageFooter';
import ContactSection from './components/ContactSection';
import SubscribeSection from './components/SubscribeSection';
import PreviewContainer from './layout/PreviewContainer';
import StickyActionBar from './components/StickyActionBar';

function sortLinksForBio(links: LinkType[] = []) {
  return [...links].sort((a, b) => Number(b.highlighted) - Number(a.highlighted));
}

export default function BioLayout({ form }: { form: FormData }) {
  const linksSorted = useMemo(
    () => sortLinksForBio(form.profile?.links ?? []),
    [form.profile?.links]
  );

  const hasLinks = (linksSorted?.length ?? 0) > 0;
  const hasFeatured = (form.profile?.featured?.length ?? 0) > 0;
  const hasEmbeds = (form.profile?.embeds?.length ?? 0) > 0;
  const hasServices = (form.profile?.services?.length ?? 0) > 0;
  const hasTestimonials = (form.profile?.testimonials?.length ?? 0) > 0;
  const hasFaqs = (form.profile?.faqs?.length ?? 0) > 0;
  const hasPosts = (form.posts?.posts?.length ?? 0) > 0;

  const hasMap =
    (typeof form.profile?.latitude === 'number' &&
      typeof form.profile?.longitude === 'number') ||
    Boolean(form.profile?.fullAddress);

  const hasSubscribe =
    !(form.subscriberSettings?.subscriberSettings?.hideSubscribeButton ?? false);

  const socials = form.profile?.socials ?? {};

  return (
    <>
      <PreviewContainer>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <HeaderSection profile={form.profile} />
        </motion.div>

        <SocialSection socials={socials} />

        {hasLinks && <LinkSection links={linksSorted} />}
        {hasFeatured && <FeaturedSection featured={form.profile!.featured!} />}
        {hasEmbeds && <EmbedSection embeds={form.profile!.embeds!} />}
        {hasServices && <ServiceSection services={form.profile!.services!} />}
        {hasTestimonials && (
          <TestimonialSection testimonials={form.profile!.testimonials!} />
        )}
        {hasFaqs && <FAQSection faqs={form.profile!.faqs!} />}
        {hasPosts && <PostsSection posts={form.posts!.posts!} />}
        {hasMap && <MapSection profile={form.profile!} />}
      </PreviewContainer>

      <ContactSection profile={form.profile} />
      {hasSubscribe && <SubscribeSection form={form} />}
      {!form?.previewMode && <StickyActionBar form={form} />}
      <PageFooter form={form} />
    </>
  );
}
