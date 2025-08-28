'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import styles from '@/styles/main.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.footerBrandBlock}>
            <h3 className={styles.footerBrand}>myeasypage</h3>
            <p className={styles.footerDesc}>
              Create beautiful websites, blogs &amp; bio links instantly — no code.
              Customizable themes. Instant publishing.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Product</h4>
            <ul className={styles.footerList}>
              <li><Link className={styles.footerLink} href="/#why">Why myeasypage</Link></li>
              <li><Link className={styles.footerLink} href="/#usecases">Use cases</Link></li>
              <li><Link className={styles.footerLink} href="/#how-it-works">Steps</Link></li>
              <li><Link className={styles.footerLink} href="/#examples">Examples</Link></li>
              <li><Link className={styles.footerLink} href="/#comparison">Compare</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>More</h4>
            <ul className={styles.footerList}>
              <li><Link className={styles.footerLink} href="/#plans">Pricing</Link></li>
              <li><Link className={styles.footerLink} href="/#trust">Trust</Link></li>
              <li><Link className={styles.footerLink} href="/#faq">FAQ</Link></li>
              <li><Link className={styles.footerLink} href="/#contact">Contact</Link></li>
              <li><Link className={styles.footerLink} href="/create">Get Started</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul className={styles.footerList}>
              <li><Link className={styles.footerLink} href="/about">About Us</Link></li>
              <li><Link className={styles.footerLink} href="/terms">Terms of Service</Link></li>
              <li><Link className={styles.footerLink} href="/privacy">Privacy Policy</Link></li>
            </ul>

            <h4 style={{ marginTop: '1rem' }}>Follow</h4>
            <div className={styles.socialIcons}>
              <Link href="#" aria-label="Facebook"><Facebook size={18} /></Link>
              <Link href="#" aria-label="Twitter / X"><Twitter size={18} /></Link>
              <Link href="#" aria-label="Instagram"><Instagram size={18} /></Link>
              <Link href="#" aria-label="LinkedIn"><Linkedin size={18} /></Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {year} myeasypage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
