"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import clsx from "clsx";

export default function TestimonialSection({ testimonials }: { testimonials?: any[] }) {
  if (!Array.isArray(testimonials) || testimonials.length === 0) return null;

  const isCentered = testimonials.length <= 3;

  return (
    <motion.section
      id="testimonials"
      className="px-4 mt-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>Testimonials</h2>
      <div className={styles.testimonialSliderWrapper}>
        <motion.div
          className={clsx(styles.testimonialSlider, { [styles.centeredSlider]: isCentered })}
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
        >
          {testimonials.map((t: any, i: number) => (
            <motion.div
              key={t.id ?? i}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.32 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {t.avatar ? (
                <img src={t.avatar} alt={t.name || "testimonial"} className={styles.testimonialAvatar} />
              ) : (
                <div className={styles.testimonialAvatarFallback}>
                  {(t.name || "User").split(" ").map((s: string) => s[0]?.toUpperCase()).join("").slice(0,2)}
                </div>
              )}
              <p className={styles.testimonialMessage}>“{t.message || "—" }”</p>
              <p className={styles.testimonialName}>— {t.name || "Anonymous"}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
