"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { FeaturedMedia } from "@/lib/frontend/types/form";

export default function FeaturedSection({ featured }: { featured?: FeaturedMedia[] | any }) {
  if (!Array.isArray(featured) || featured.length === 0) return null;

  return (
    <motion.section
      className="px-4 mt-10"
      id="featured"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>Featured</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {featured.map((item: any, i: number) => (
          <motion.div
            key={item.id ?? i}
            className={styles.featuredCard}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.36 }}
            viewport={{ once: true }}
          >
            {item.url ? (
              <iframe
                src={item.url}
                title={item.title || "Featured"}
                className={styles.featuredIframe}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : item.thumbnail ? (
              <img src={item.thumbnail} alt={item.title || "Featured"} className={styles.featuredImage} />
            ) : (
              <div className={styles.featuredPlaceholder}>No media</div>
            )}
            <div className={styles.featuredContent}>
              <h3 className={styles.featuredTitle}>{item.title || "Untitled"}</h3>
              {item.description ? <p className={styles.featuredDescription}>{item.description}</p> : null}
              {item.ctaLink && item.ctaLabel ? (
                <a href={item.ctaLink} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
                  {item.ctaLabel}
                </a>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
