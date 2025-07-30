// sections/FeaturedSection.tsx
import styles from '@/styles/preview.module.css';
import { FeaturedMedia } from '@/lib/frontend/types/form';

export default function FeaturedSection({ featured }: { featured: FeaturedMedia[] }) {
  if (!featured?.length) return null;

  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-10">
      <h2 className={styles.sectionTitle}>Featured</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {featured.map((item) => (
          <div key={item.id} className={styles.featuredCard}>
            <iframe
              src={item.url}
              title={item.title}
              className={styles.featuredIframe}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <div className={styles.featuredContent}>
              <h3 className={styles.featuredTitle}>{item.title}</h3>
              {item.description && <p className={styles.featuredDescription}>{item.description}</p>}
              {item.ctaLink && item.ctaLabel && (
                <a
                  href={item.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaButton}
                >
                  {item.ctaLabel}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
