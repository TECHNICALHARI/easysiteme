'use client';

import styles from '@/styles/main.module.css';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

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
                <li><a href="#plans">Pricing</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="/create">Get Started</a></li>
              </ul>
            </div>

            <div>
              <h4>Legal</h4>
              <ul>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4>Follow Us</h4>
              <div className={styles.socialIcons}>
                <a href="#"><Facebook size={20} className={styles.footerIcon} /></a>
                <a href="#"><Twitter size={20} className={styles.footerIcon} /></a>
                <a href="#"><Instagram size={20} className={styles.footerIcon} /></a>
                <a href="#"><Linkedin size={20} className={styles.footerIcon} /></a>
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
