'use client';
import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { FormData } from '@/lib/frontend/types/form';

import HeaderSection from './components/HeaderSection';
import LinkSection from './components/LinkSection';
import SocialSection from './components/SocialSection';
import FeaturedSection from './components/FeaturedSection';
import EmbedSection from './components/EmbedSection';
import ServiceSection from './components/ServiceSection';
import TestimonialSection from './components/TestimonialSection';
import FAQSection from './components/FAQSection';
import PostsSection from './components/PostsSection';

export default function BioLayout({ form }: { form: FormData }) {
  const themeClass = form.design.theme || 'brand';
  const { profile, socials, posts } = form;

  return (
    <motion.div
      className={`${styles.bioLayoutContainer} ${styles[themeClass]}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderSection profile={profile} />

      {!!profile.links?.length && <LinkSection links={profile.links} />}
      {!!socials && <SocialSection socials={socials} />}
      {!!profile.featured?.length && <FeaturedSection featured={profile.featured} />}
      {!!profile.embeds?.length && <EmbedSection embeds={profile.embeds} />}
      {!!profile.services?.length && <ServiceSection services={profile.services} />}
      {!!profile.testimonials?.length && <TestimonialSection testimonials={profile.testimonials} />}
      {!!profile.faqs?.length && <FAQSection faqs={profile.faqs} />}
      {!!posts?.posts?.length && <PostsSection posts={posts.posts} />}
    </motion.div>
  );
}
