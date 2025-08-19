'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Share2, Mail, Copy, Check } from 'lucide-react';
import styles from '@/styles/preview.module.css';
import ThemeTogglePreview from './ThemeTogglePreview';
import type { FormData } from '@/lib/frontend/types/form';
import ShareModal from '../components/ShareModal';


function useProfileUrl(username?: string, customDomain?: string) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://onepage.app';
  if (customDomain) return `https://${customDomain}`;
  if (username) return `${origin}/${username}`;
  return origin;
}

interface HeaderProps {
  showNav: boolean;
  sections: {
    featured?: boolean;
    posts?: boolean;
    services?: boolean;
    faqs?: boolean;
    testimonials?: boolean;
  };
  form: FormData;
}

const PageHeader = ({ showNav, sections, form }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const url = useProfileUrl(form.profile?.username, form.settings?.customDomain);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!showNav) return null;

  const navLinks = [
    sections.featured && { label: 'Featured', href: '#featured' },
    sections.posts && { label: 'Posts', href: '#posts' },
    sections.services && { label: 'Services', href: '#services' },
    sections.testimonials && { label: 'Testimonials', href: '#testimonials' },
    sections.faqs && { label: 'FAQ', href: '#faq' },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            one<span className="highlight">page</span>
          </Link>

          <nav className={styles.desktopNav}>
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            ))}

            <button className="btn-white ml-2" onClick={() => setOpenShare(true)}>
              <span className="inline-flex items-center gap-2">
                <Share2 size={16} />
                Share
              </span>
            </button>

            <ThemeTogglePreview />
          </nav>

          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {menuOpen && (
            <div className={styles.mobileMenu}>
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="flex flex-col gap-2 pt-2">
                <button className="btn-white" onClick={() => setOpenShare(true)}>
                  <span className="inline-flex items-center gap-2">
                    <Share2 size={16} />
                    Share
                  </span>
                </button>
                <div className="pt-1">
                  <ThemeTogglePreview />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <ShareModal open={openShare} onClose={() => setOpenShare(false)} url={url} />
    </>
  );
};

export default PageHeader;
