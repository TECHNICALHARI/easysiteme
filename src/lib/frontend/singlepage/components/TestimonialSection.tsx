'use client';
import { motion } from 'framer-motion';
import { Testimonial } from '@/lib/frontend/types/form';
import styles from '@/styles/preview.module.css';
import clsx from 'clsx';

export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials?.length) return null;

  const isCentered = testimonials.length <= 3;

  return (
    <section className="px-4 mt-10" id='testimonials'>
      <h2 className={styles.sectionTitle}>Testimonials</h2>
      <div className={styles.testimonialSliderWrapper}>
        <motion.div
          className={clsx(styles.testimonialSlider, {
            [styles.centeredSlider]: isCentered,
          })}
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              className={styles.testimonialCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.avatar && (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className={styles.testimonialAvatar}
                />
              )}
              <p className={styles.testimonialMessage}>“{t.message}”</p>
              <p className={styles.testimonialName}>— {t.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
