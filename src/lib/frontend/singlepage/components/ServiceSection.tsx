'use client';

import styles from '@/styles/preview.module.css';
import { Service } from '@/lib/frontend/types/form';

export default function ServiceSection({ services }: { services: Service[] }) {
  if (!services?.length) return null;

  const isSingle = services.length === 1;

  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-10">
      <h2 className={styles.sectionTitle}>Services</h2>
      <div className={`grid gap-6 ${isSingle ? '' : 'sm:grid-cols-2'}`}>
        {services.map((service) => (
          <div key={service.id} className={styles.serviceCard}>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceDescription}>{service.description}</p>

            {service.price && (
              <p className={styles.servicePrice}>
                ₹{parseInt(service.price).toLocaleString()}
              </p>
            )}

            {service.ctaLink && (
              <a
                href={service.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButton}
              >
                {service.ctaLabel || 'Learn More'}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
