'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Mail, Plus, X } from 'lucide-react';
import ShareModal from '@/lib/frontend/singlepage/components/ShareModal';
import type { FormData, Link as LinkType } from '@/lib/frontend/types/form';
import ThemeTogglePreview from '../layout/ThemeTogglePreview';

function useProfileUrl(username?: string, customDomain?: string) {
    if (typeof window === 'undefined') return 'https://onepage.app';
    const origin = window.location.origin;
    if (customDomain) return `https://${customDomain}`;
    if (username) return `${origin}/${username}`;
    return origin;
}

function pickPrimaryCTA(form: FormData) {
    const { socials, profile } = form;
    if (socials?.calendly) return { label: 'Book a Call', href: socials.calendly };
    const primary = profile?.links?.find((l) => l.highlighted);
    if (primary) return { label: primary.title, href: primary.url };
    const site = profile?.links?.find((l) => /http(s)?:\/\//.test(l.url));
    if (site) return { label: site.title || 'Visit Website', href: site.url };
    return null;
}

export default function StickyActionBar({ form }: { form: FormData }) {
    const url = useProfileUrl(form.profile?.username, form.settings?.customDomain);
    const cta = useMemo(() => pickPrimaryCTA(form), [form]);
    const [openShare, setOpenShare] = useState(false);
    const [hideBar, setHideBar] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const canSubscribe = !(form.subscriberSettings?.subscriberSettings?.hideSubscribeButton ?? false);
    const subscribeLabel = form.subscriberSettings?.subscriberSettings?.subject || 'Subscribe';

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                ([entry]) => setHideBar(entry.isIntersecting),
                { threshold: 0.1 }
            );
            observer.observe(footer);
            return () => observer.disconnect();
        }
    }, []);

    const scrollToSubscribe = useCallback(() => {
        const el = document.getElementById('subscribe');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Check out my OnePage',
                    text: 'Here is my OnePage link:',
                    url,
                });
            } else {
                setOpenShare(true);
            }
        } catch { }
    };

    if (!cta && !canSubscribe) return null;

    return (
        <>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: hideBar ? 80 : 0, opacity: hideBar ? 0 : 1 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={`
          fixed left-1/2 -translate-x-1/2 bottom-4 z-[90] 
          w-[95%] max-w-md sm:max-w-xl
          ${isOpen ? 'block' : 'hidden sm:block'}
        `}
            >
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 rounded-2xl border border-[var(--color-muted)] bg-[var(--color-bg)] px-3 py-2 shadow-lg">
                    {cta && (
                        <a
                            href={cta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                        >
                            <span>{cta.label}</span>
                        </a>
                    )}

                    {canSubscribe && (
                        <button
                            className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                            onClick={scrollToSubscribe}
                        >
                            <Mail size={16} />
                            <span>{subscribeLabel}</span>
                        </button>
                    )}

                    <button
                        className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                        onClick={handleShare}
                    >
                        <Share2 size={16} /> <span>Share</span>
                    </button>

                    <ThemeTogglePreview />
                </div>
            </motion.div>

            {!hideBar && (
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="sm:hidden fixed bottom-4 right-4 z-[95] rounded-full bg-[var(--color-brand)] text-white p-3 shadow-lg"
                    aria-label="Toggle Action Bar"
                    title='Toggle Action Bar'
                >
                    {isOpen ? <X size={20} /> : <Plus size={20} />}
                </button>
            )}

            <ShareModal open={openShare} onClose={() => setOpenShare(false)} url={url} />
        </>
    );
}
