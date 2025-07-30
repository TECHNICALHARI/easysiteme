'use client';

import styles from '@/styles/preview.module.css';
import { FormData } from '@/lib/frontend/types/form';

export default function StickyNavbar({ form }: { form: FormData }) {
  const { profile, posts } = form;

  const sections = [
    { id: 'featured', label: 'Featured', data: profile.featured },
    { id: 'embeds', label: 'Embeds', data: profile.embeds },
    { id: 'services', label: 'Services', data: profile.services },
    { id: 'testimonials', label: 'Testimonials', data: profile.testimonials },
    { id: 'faqs', label: 'FAQs', data: profile.faqs },
    { id: 'posts', label: 'Blog', data: posts.posts },
  ];

  const visibleSections = sections.filter((section) => section.data && section.data.length > 0);

  if (visibleSections.length === 0) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {visibleSections.map((section) => (
          <a key={section.id} href={`#${section.id}`} className={styles.navLink}>
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
