"use client";

import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import type { FormData, Link as LinkType } from "@/lib/frontend/types/form";

import PreviewContainer from "./layout/PreviewContainer";
import HeaderSection from "./components/HeaderSection";
import SocialSection from "./components/SocialSection";
import LinkSection from "./components/LinkSection";
import FeaturedSection from "./components/FeaturedSection";
import EmbedSection from "./components/EmbedSection";
import ServiceSection from "./components/ServiceSection";
import TestimonialSection from "./components/TestimonialSection";
import PostsSection from "./components/PostsSection";
import MapSection from "./components/MapSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import SubscribeSection from "./components/SubscribeSection";

function sortLinks(links: LinkType[] = []) {
  return [...links].sort((a, b) => Number(b.highlighted) - Number(a.highlighted));
}
function hasAnySocial(socials: Record<string, any> = {}) {
  return Object.values(socials).some(v => {
    if (typeof v === "string") return v.trim().length > 0;
    return Boolean(v);
  });
}

export default function WebsiteLayout({ form }: { form: FormData }) {
  const profile = form.profile ?? {};
  const posts = form.posts ?? { posts: [] };
  const socials = profile.socials ?? {};
  const themeClass = form.design.theme || "brand";
  const hasLinks = Array.isArray(profile.links) && profile.links.length > 0;
  const hasSocials = hasAnySocial(socials);
  const hasFeatured = Array.isArray(profile.featured) && profile.featured.length > 0;
  const hasEmbeds = Array.isArray(profile.embeds) && profile.embeds.length > 0;
  const hasServices = Array.isArray(profile.services) && profile.services.length > 0;
  const hasTestimonials = Array.isArray(profile.testimonials) && profile.testimonials.length > 0;
  const hasPosts = Array.isArray(posts.posts) && posts.posts.length > 0;
  const hasFaqs = Array.isArray(profile.faqs) && profile.faqs.length > 0;
  const hasMap = Boolean((profile.latitude && profile.longitude) || profile.fullAddress);
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

        {hasSocials && <SocialSection socials={socials} />}
        {hasLinks && <LinkSection links={sortedLinks} />}
        {hasFeatured && <FeaturedSection featured={profile.featured} />}
        {hasEmbeds && <EmbedSection embeds={profile.embeds} />}
        {hasServices && <ServiceSection services={profile.services} />}
        {hasTestimonials && <TestimonialSection testimonials={profile.testimonials} />}
        {hasPosts && <PostsSection posts={posts.posts} />}
        {hasMap && <MapSection profile={profile} />}
        {hasFaqs && <FAQSection faqs={profile.faqs} />}
        <ContactSection profile={profile} />
      </PreviewContainer>

      {hasSubscribe && <SubscribeSection form={form} />}
    </>
  );
}
