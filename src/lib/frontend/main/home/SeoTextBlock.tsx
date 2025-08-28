"use client";
import { CheckCircle2, Sparkles, Layers } from 'lucide-react';
import styles from '@/styles/main.module.css';

export default function SeoTextBlock() {
  return (
    <section aria-labelledby="seo-block-title" className={`${styles.seo} section`}>
      <div className="container">
        <div className={styles.seoHead}>
          <h2 id="seo-block-title" className="section-title">
            What is myeasypage?
          </h2>
          <p className="section-subtitle">
            myeasypage is a fast, no-code builder for websites, blogs and link-in-bio pages on your own subdomain.
            Create a professional online presence, publish posts, embed content and collect leads — all in minutes.
          </p>
        </div>

        <div className={styles.seoGrid}>
          <article className={styles.seoCard}>
            <div className={styles.seoCardIcon} aria-hidden="true">
              <Sparkles size={18} />
            </div>
            <h3 className={styles.seoH3}>Who is it for?</h3>
            <p className={styles.seoP}>
              Creators, freelancers, students, local businesses, coaches and small product teams who want a polished
              online presence without hiring a developer. Start with a simple bio link and grow into a mini-site with a blog.
            </p>
          </article>

          <article className={styles.seoCard}>
            <div className={styles.seoCardIcon} aria-hidden="true">
              <Layers size={18} />
            </div>
            <h3 className={styles.seoH3}>Key features</h3>
            <ul className={styles.seoList} role="list">
              <li>Website & bio layouts with premium themes</li>
              <li>Built-in blog: titles, descriptions, cover images and clean URLs</li>
              <li>Drag-drop sections: About, Services, Gallery, FAQs, Testimonials</li>
              <li>Embeds: YouTube, Google Maps, Calendly and more</li>
              <li>Custom domain support on Pro & Premium</li>
              <li>Secure, fast and SEO-friendly by default</li>
            </ul>
          </article>

          <article className={styles.seoCard}>
            <div className={styles.seoCardIcon} aria-hidden="true">
              <CheckCircle2 size={18} />
            </div>
            <h3 className={styles.seoH3}>Why choose myeasypage?</h3>
            <p className={styles.seoP}>
              Instead of juggling separate tools for your bio link, website and blog, you can launch everything in one place.
              Perfect for landing pages, portfolios, service pages, product promos and quick micro-sites.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
