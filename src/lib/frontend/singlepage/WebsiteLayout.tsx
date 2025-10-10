'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { FormData, Link as LinkType } from '@/lib/frontend/types/form';

import HeaderSection from './components/HeaderSection';
import LinkSection from './components/LinkSection';
import SocialSection from './components/SocialSection';
import FeaturedSection from './components/FeaturedSection';
import EmbedSection from './components/EmbedSection';
import ServiceSection from './components/ServiceSection';
import TestimonialSection from './components/TestimonialSection';
import FAQSection from './components/FAQSection';
import PostsSection from './components/PostsSection';
import MapSection from './components/MapSection';
import PreviewContainer from './layout/PreviewContainer';
import ContactSection from './components/ContactSection';
import SubscribeSection from './components/SubscribeSection';

function sortLinks(links: LinkType[] = []) {
  return [...links].sort((a, b) => Number(b.highlighted) - Number(a.highlighted));
}

export default function WebsiteLayout({ form }: { form: FormData }) {
  const themeClass = form.design.theme || 'brand';
  const profile = form.profile || ({} as any);
  const posts = form.posts;
  const socials = profile?.socials || {};
  const hasLinks = Boolean(profile?.links?.length);
  const hasSocials = Boolean(socials && Object.keys(socials).length > 0);
  const hasFeatured = Boolean(profile?.featured?.length);
  const hasEmbeds = Boolean(profile?.embeds?.length);
  const hasServices = Boolean(profile?.services?.length);
  const hasTestimonials = Boolean(profile?.testimonials?.length);
  const hasFaqs = Boolean(profile?.faqs?.length);
  const hasPosts = Boolean(posts?.posts?.length);
  const hasMap = Boolean((profile?.latitude && profile?.longitude) || profile?.fullAddress);
  const hasSubscribe = !form.subscriberSettings?.subscriberSettings?.hideSubscribeButton;

  const sortedLinks = hasLinks ? sortLinks(profile.links) : [];

  return (
    <>
      <PreviewContainer>
        <motion.div
          className={`${styles.bioLayoutContainer} ${styles[themeClass]}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderSection profile={profile} />
        </motion.div>
        {hasLinks && <LinkSection links={sortedLinks} />}
        {hasSocials && <SocialSection socials={socials} />}
        {hasFeatured && <FeaturedSection featured={profile.featured} />}
        {hasEmbeds && <EmbedSection embeds={profile.embeds} />}
        {hasServices && <ServiceSection services={profile.services} />}
        {hasTestimonials && <TestimonialSection testimonials={profile.testimonials} />}
        {hasFaqs && <FAQSection faqs={profile.faqs} />}
        {hasPosts && <PostsSection posts={posts.posts} />}
        {hasMap && <MapSection profile={profile} />}
      </PreviewContainer>
      <ContactSection profile={form.profile} />
      {hasSubscribe && <SubscribeSection form={form} />}
    </>
  );
}
