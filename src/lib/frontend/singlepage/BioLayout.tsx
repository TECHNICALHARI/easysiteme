'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, CalendarClock, Mail, Globe, Link as LinkIcon, X } from 'lucide-react';

import type { FormData, Link as LinkType } from '@/lib/frontend/types/form';
import styles from '@/styles/preview.module.css';

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
import ThemeTogglePreview from './layout/ThemeTogglePreview';
import PageFooter from './layout/PageFooter';
import ShareModal from './components/ShareModal';
import ContactSection from './components/ContactSection';
import SubscribeSection from './components/SubscribeSection';
import PreviewContainer from './layout/PreviewContainer';

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

function useProfileUrl(username?: string, customDomain?: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://onepage.app';
  if (customDomain) return `https://${customDomain}`;
  if (username) return `${origin}/${username}`;
  return origin;
}

function sortLinksForBio(links: LinkType[] = []) {
  return [...links].sort((a, b) => Number(b.highlighted) - Number(a.highlighted));
}

function pickPrimaryCTA(form: FormData) {
  if (form.socials?.calendly) {
    return { label: 'Book a Call', href: form.socials.calendly, icon: <CalendarClock size={16} /> };
  }
  const primary = (form.profile?.links || []).find((l) => l.highlighted);
  if (primary) return { label: primary.title, href: primary.url, icon: <LinkIcon size={16} /> };
  const site = (form.profile?.links || []).find((l) => /http(s)?:\/\//.test(l.url));
  if (site) return { label: site.title || 'Visit Website', href: site.url, icon: <Globe size={16} /> };
  return null;
}

function StickyActionBar({ form }: { form: FormData }) {
  const url = useProfileUrl(form.profile?.username, form.settings?.customDomain);
  const cta = useMemo(() => pickPrimaryCTA(form), [form]);
  const [openShare, setOpenShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hideBar, setHideBar] = useState(false);

  const canSubscribe = !form.subscriberSettings?.subscriberSettings?.hideSubscribeButton;
  const subscribeLabel = form.subscriberSettings?.subscriberSettings?.subject || 'Subscribe';

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => setHideBar(entry.isIntersecting),
        { threshold: 0.1 }
      );
      observer.observe(footer);
      return () => observer.disconnect();
    } else {
      setHideBar(false);
    }
  }, []);


  const scrollToSubscribe = useCallback(() => {
    const el = document.getElementById('subscribe');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);
  if (!cta && !canSubscribe) return null;

  return (
    <>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: hideBar ? 80 : 0, opacity: hideBar ? 0 : 1 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[90]"
      >
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--color-muted)] bg-[var(--color-bg)] px-3 py-2 shadow-lg">
          <div className="flex items-center justify-between gap-2 w-full">
            {cta && (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                {cta.icon}
                <span>{cta.label}</span>
              </a>
            )}
            {canSubscribe && (
              <button className="btn-secondary flex items-center gap-2" onClick={scrollToSubscribe}>
                <Mail size={16} />
                <span>Subscribe Now</span>
              </button>
            )}
            <button className="btn-secondary flex items-center gap-2" onClick={() => setOpenShare(true)}>
              <Share2 size={16} /> Share
            </button>
            <ThemeTogglePreview />
          </div>
        </div>
      </motion.div>
      <ShareModal open={openShare} onClose={() => setOpenShare(false)} url={url} />
    </>
  );
}

export default function BioLayout({ form }: { form: FormData }) {
  const linksSorted = useMemo(() => sortLinksForBio(form.profile?.links), [form.profile?.links]);

  const hasLinks = Boolean(linksSorted?.length);
  const hasFeatured = Boolean(form.profile?.featured?.length);
  const hasEmbeds = Boolean(form.profile?.embeds?.length);
  const hasServices = Boolean(form.profile?.services?.length);
  const hasTestimonials = Boolean(form.profile?.testimonials?.length);
  const hasFaqs = Boolean(form.profile?.faqs?.length);
  const hasPosts = Boolean(form.posts?.posts?.length);
  const hasMap = Boolean((form.profile?.latitude && form.profile?.longitude) || form.profile?.fullAddress);
  const hasSubscribe = !form.subscriberSettings?.subscriberSettings?.hideSubscribeButton;
  return (
    <>
      <PreviewContainer>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <HeaderSection profile={form.profile} />
        </motion.div>

        <SocialSection socials={form.socials} />

        {hasLinks && <LinkSection links={linksSorted} />}

        {hasFeatured && <FeaturedSection featured={form.profile.featured} />}
        {hasEmbeds && <EmbedSection embeds={form.profile.embeds} />}
        {hasServices && <ServiceSection services={form.profile.services} />}

        {hasTestimonials && <TestimonialSection testimonials={form.profile.testimonials} />}
        {hasFaqs && <FAQSection faqs={form.profile.faqs} />}

        {hasPosts && <PostsSection posts={form.posts.posts} />}

        {hasMap && <MapSection profile={form.profile} />}
      </PreviewContainer>
      <ContactSection profile={form.profile} />
      {hasSubscribe && <SubscribeSection form={form} />}
      <StickyActionBar form={form} />
      <PageFooter form={form} />
    </>
  );
}
