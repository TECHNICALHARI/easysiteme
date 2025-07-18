'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import styles from '@/styles/main.module.css';
import ThemeToggle from '../home/ThemeToggle';
import Logo from '../../common/Logo';

const navItems = [
  { label: 'Why OnePage', href: '#why' },
  { label: 'Plans', href: '#plans' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className="container flex items-center justify-between relative z-50">
        <Link href="/" className={styles.logoGlow}><Logo /></Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
          <Link href="/login" className={styles.navBtn}>Sign In</Link>
          <Link href="/signup" className="btn-primary shadow-md">Create Page</Link>
          <ThemeToggle />
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="z-50"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className={styles.mobileDropdown}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className={styles.navBtn} onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/signup" className="btn-primary mt-2" onClick={() => setMenuOpen(false)}>Create Page</Link>
            <div className="pt-2"><ThemeToggle /></div>
          </div>
        )}
      </div>
    </header>
  );
}
