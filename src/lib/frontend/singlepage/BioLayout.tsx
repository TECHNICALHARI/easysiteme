// BioLayout.tsx
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

  return (
    <motion.div
      className={`${styles.bioLayoutContainer} ${styles[themeClass]}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderSection profile={form.profile} />
      <LinkSection links={form.profile.links} />
      <SocialSection socials={form.socials} />
      <FeaturedSection featured={form.profile.featured} />
      <EmbedSection embeds={form.profile.embeds} />
      <ServiceSection services={form.profile.services} />
      <TestimonialSection testimonials={form.profile.testimonials} />
      <FAQSection faqs={form.profile.faqs} />
      <PostsSection posts={form.posts.posts} />
    </motion.div>
  );
}
