"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { Embed } from "@/lib/frontend/types/form";

function toEmbedUrl(raw: string) {
  if (!raw) return raw;

  try {
    const url = new URL(raw);

    // YouTube: watch?v= or youtu.be → nocookie embed
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      let id = "";
      if (url.hostname.includes("youtu.be")) {
        id = url.pathname.replace("/", "");
      } else if (url.searchParams.get("v")) {
        id = url.searchParams.get("v") as string;
      }
      if (id) {
        const params = new URLSearchParams();
        if (url.searchParams.get("list")) params.set("list", url.searchParams.get("list") as string);
        params.set("rel", "0");
        params.set("modestbranding", "1");
        return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
      }
    }

    // Vimeo
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return raw;
  } catch {
    return raw;
  }
}

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

      <div className={`${styles.mediaGrid} ${isSingle ? styles.mediaGridSingle : ""}`}>
        {embeds.map((embed: any, i: number) => (
          <motion.div
            key={embed.id ?? i}
            className={`${styles.featuredCard} ${isSingle ? styles.featuredCardSingle : ""}`}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.36 }}
            viewport={{ once: true }}
          >
            {embed.url ? (
              <iframe
                src={toEmbedUrl(embed.url)}
                title={embed.title || `embed-${i}`}
                className={styles.featuredIframe}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className={styles.featuredPlaceholder}>No embed url</div>
            )}

            <div className={styles.featuredContent}>
              <h3 className={styles.featuredTitle}>{embed.title || "Untitled"}</h3>
              {embed.description ? (
                <p className={styles.featuredDescription}>{embed.description}</p>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
