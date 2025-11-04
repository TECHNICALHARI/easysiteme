"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { FeaturedMedia } from "@/lib/frontend/types/form";

function toEmbedSrc(url?: string) {
  if (!url) return "";
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, "");
    if (h === "youtube.com" || h === "m.youtube.com") {
      if (u.pathname === "/watch") return `https://www.youtube.com/embed/${u.searchParams.get("v") || ""}`;
      if (u.pathname.startsWith("/shorts/")) return `https://www.youtube.com/embed/${u.pathname.split("/")[2] || ""}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (h === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (h === "vimeo.com") return `https://player.vimeo.com/video/${u.pathname.replace("/", "")}`;
    if (h === "loom.com" && u.pathname.startsWith("/share/")) return `https://www.loom.com/embed/${u.pathname.split("/")[2] || ""}`;
    return url;
  } catch {
    return url;
  }
}

export default function FeaturedSection({ featured }: { featured?: FeaturedMedia[] | any }) {
  if (!Array.isArray(featured) || featured.length === 0) return null;
  const isSingle = featured.length === 1;

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

      <div className={`${styles.mediaGrid} ${isSingle ? styles.mediaGridSingle : ""}`}>
        {featured.map((item: any, i: number) => {
          const mediaUrl = item?.url ? toEmbedSrc(item.url) : "";
          return (
            <motion.div
              key={item.id ?? i}
              className={`${styles.featuredCard} ${isSingle ? styles.featuredCardSingle : ""}`}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.36 }}
              viewport={{ once: true }}
            >
              {mediaUrl ? (
                <iframe
                  src={mediaUrl}
                  title={item.title || "Featured"}
                  className={styles.featuredIframe}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title || "Featured"}
                  className={styles.featuredImage}
                />
              ) : (
                <div className={styles.featuredPlaceholder}>No media</div>
              )}

              <div className={styles.featuredContent}>
                <h3 className={styles.featuredTitle}>{item.title || "Untitled"}</h3>
                {item.description ? (
                  <p className={styles.featuredDescription}>{item.description}</p>
                ) : null}
                {item.ctaLink && item.ctaLabel ? (
                  <a
                    href={item.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaButton}
                  >
                    {item.ctaLabel}
                  </a>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
