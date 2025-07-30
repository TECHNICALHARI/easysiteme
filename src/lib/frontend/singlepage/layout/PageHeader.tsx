'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from '@/styles/preview.module.css';
import ThemeTogglePreview from './ThemeTogglePreview';

interface HeaderProps {
  showNav: boolean;
  sections: {
    featured?: boolean;
    posts?: boolean;
    services?: boolean;
    faqs?: boolean;
    testimonials?: boolean;
  };
}

const PageHeader = ({ showNav, sections }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
            <div className="pt-2">
              <ThemeTogglePreview />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
