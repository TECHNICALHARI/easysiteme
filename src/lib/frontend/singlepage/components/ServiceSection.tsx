'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { Service } from '@/lib/frontend/types/form';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ServiceSection({ services }: { services: Service[] }) {
  if (!services?.length) return null;

  const isSingle = services.length === 1;

  return (
    <motion.section
      id="services"
      className="px-4 mt-10"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>Services</h2>
      <div className={`grid gap-6 ${isSingle ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            className={styles.serviceCard}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceDescription}>{service.description}</p>
            {service.price && <p className={styles.servicePrice}>₹{parseInt(service.price).toLocaleString()}</p>}
            {service.ctaLink && (
              <a href={service.ctaLink} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
                {service.ctaLabel || 'Learn More'}
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
