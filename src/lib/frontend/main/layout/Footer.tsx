'use client';

import styles from '@/styles/main.module.css';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.footerBrandBlock}>
            <h3 className={styles.footerBrand}>OnePage</h3>
            <p className={styles.footerDesc}>
              Instantly create beautiful personal & business websites.
              <br />
              No code. Fully customizable. Launch in 60 seconds.
            </p>
          </div>

          <div className={styles.footerGrid}>
            <div>
              <h4>Product</h4>
              <ul>
                <li><Link href="#plans">Pricing</Link></li>
                <li><Link href="#faq">FAQ</Link></li>
                <li><Link href="/create">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h4>Legal</h4>
              <ul>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4>Follow Us</h4>
              <div className={styles.socialIcons}>
                <Link href="#"><Facebook size={20} className={styles.footerIcon} /></Link>
                <Link href="#"><Twitter size={20} className={styles.footerIcon} /></Link>
                <Link href="#"><Instagram size={20} className={styles.footerIcon} /></Link>
                <Link href="#"><Linkedin size={20} className={styles.footerIcon} /></Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} OnePage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
