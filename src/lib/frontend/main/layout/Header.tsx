'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import styles from '@/styles/main.module.css';
import ThemeToggle from '@/lib/frontend/main/home/ThemeToggle';
import Logo from '@/lib/frontend/common/Logo';

const navItems = [
  { label: 'Why', href: '/#why' },
  { label: 'Plans', href: '/#plans' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={`container ${styles.headerInner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logoLink} aria-label="myeasypage home">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className={`${styles.nav} hidden md:flex`} aria-label="Primary">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <Link href="/login" className={styles.navGhost}>
              Sign In
            </Link>
            <Link href="/signup" className={styles.navPrimary}>
              Create Page
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden ${styles.menuBtn}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`${styles.mobileScrim} ${menuOpen ? styles.showScrim : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Dropdown */}
      <div
        className={`${styles.mobileDropdown} ${menuOpen ? styles.mobileOpen : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className={styles.mobileHeader}>
          <Link href="/" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>
          <button
            aria-label="Close menu"
            className={styles.menuBtn}
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <ul className={styles.mobileList}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.mobileActions}>
          <Link href="/login" className={styles.navGhost} onClick={() => setMenuOpen(false)}>
            Sign In
          </Link>
          <Link href="/signup" className={styles.navPrimary} onClick={() => setMenuOpen(false)}>
            Create Page
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
