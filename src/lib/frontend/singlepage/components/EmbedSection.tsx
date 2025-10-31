"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { Embed } from "@/lib/frontend/types/form";

export default function EmbedSection({ embeds }: { embeds?: Embed[] | any }) {
  if (!Array.isArray(embeds) || embeds.length === 0) return null;

  const isSingle = embeds.length === 1;

  return (
    <motion.section
      className="px-4 mt-10"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>Embeds</h2>
      <div className={`grid gap-6 ${isSingle ? "" : "sm:grid-cols-1 md:grid-cols-2"}`}>
        {embeds.map((embed: any, i: number) => (
          <motion.div
            key={embed.id ?? i}
            className={styles.embedCard}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.32 }}
            viewport={{ once: true }}
          >
            {embed.url ? (
              <iframe
                src={embed.url}
                title={embed.title || `embed-${i}`}
                className={styles.embedIframe}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className={styles.embedPlaceholder}>No embed url</div>
            )}
            <h3 className={styles.embedTitle}>{embed.title || "Untitled"}</h3>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
