"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { FormData, Link as LinkType } from "@/lib/frontend/types/form";

import HeaderSection from "./components/HeaderSection";
import SocialSection from "./components/SocialSection";
import LinkSection from "./components/LinkSection";
import FeaturedSection from "./components/FeaturedSection";
import EmbedSection from "./components/EmbedSection";
import ServiceSection from "./components/ServiceSection";
import TestimonialSection from "./components/TestimonialSection";
import FAQSection from "./components/FAQSection";
import PostsSection from "./components/PostsSection";
import MapSection from "./components/MapSection";
import PageFooter from "./layout/PageFooter";
import ContactSection from "./components/ContactSection";
import SubscribeSection from "./components/SubscribeSection";
import PreviewContainer from "./layout/PreviewContainer";
import StickyActionBar from "./components/StickyActionBar";

function sortLinksForBio(links: LinkType[] = []) {
  return [...links].sort((a, b) => Number(Boolean(b.highlighted)) - Number(Boolean(a.highlighted)));
}

export default function BioLayout({ form }: { form: FormData | any }) {
  const profile = form?.profile ?? {};
  const posts = form?.posts ?? { posts: [] };

  const linksSorted = useMemo(() => sortLinksForBio(Array.isArray(profile?.links) ? profile.links : []), [profile?.links]);

  const hasLinks = (linksSorted?.length ?? 0) > 0;
  const hasFeatured = (Array.isArray(profile?.featured) && profile.featured.length > 0);
  const hasEmbeds = (Array.isArray(profile?.embeds) && profile.embeds.length > 0);
  const hasServices = (Array.isArray(profile?.services) && profile.services.length > 0);
  const hasTestimonials = (Array.isArray(profile?.testimonials) && profile.testimonials.length > 0);
  const hasFaqs = (Array.isArray(profile?.faqs) && profile.faqs.length > 0);
  const hasPosts = (Array.isArray(posts?.posts) && posts.posts.length > 0);

  const lat = profile?.latitude;
  const lng = profile?.longitude;
  const hasCoords = (lat !== undefined && lat !== null && String(lat).trim() !== "") && (lng !== undefined && lng !== null && String(lng).trim() !== "");
  const hasMap = hasCoords || Boolean(profile?.fullAddress && String(profile.fullAddress).trim().length > 0);

  const hasSubscribe = !(form?.subscriberSettings?.subscriberSettings?.hideSubscribeButton ?? false);

  const socials = profile?.socials ?? {};

  return (
    <>
      <PreviewContainer>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <HeaderSection profile={profile} />
        </motion.div>

        <SocialSection socials={socials} />

        {hasLinks && <LinkSection links={linksSorted} />}
        {hasFeatured && <FeaturedSection featured={profile.featured ?? []} />}
        {hasEmbeds && <EmbedSection embeds={profile.embeds ?? []} />}
        {hasServices && <ServiceSection services={profile.services ?? []} />}
        {hasTestimonials && <TestimonialSection testimonials={profile.testimonials ?? []} />}
        {hasFaqs && <FAQSection faqs={profile.faqs ?? []} />}
        {hasPosts && <PostsSection posts={posts.posts ?? []} />}
        {hasMap && <MapSection profile={profile} />}
      </PreviewContainer>

      <ContactSection profile={profile} />
      {hasSubscribe && <SubscribeSection form={form} />}
      {!form?.previewMode && <StickyActionBar form={form} />}
      <PageFooter form={form} />
    </>
  );
}
