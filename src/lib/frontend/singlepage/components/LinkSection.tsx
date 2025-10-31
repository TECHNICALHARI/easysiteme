"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { Link } from "@/lib/frontend/types/form";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import { staticIconMap } from "../../common/UploadModal";

export default function LinkSection({ links }: { links: Link[] | any }) {
  if (!Array.isArray(links) || links.length === 0) return null;

  return (
    <motion.section
      className={styles.linkSection}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={styles.linkGrid}>
        {links.map((link: any, i: number) => {
          const IconFromStatic = link.icon ? (staticIconMap as any)[link.icon] : null;
          const IconFallback = link.icon ? (LucideIcons as any)[link.icon] : null;
          const Icon = IconFromStatic ?? IconFallback ?? null;

          return (
            <motion.a
              key={link.id ?? i}
              href={link.url || "#"}
              target={link.url ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`${styles.linkButton} ${link.highlighted ? styles.highlighted : ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 240, damping: 14 }}
            >
              <div className={styles.linkIconWrapper}>
                {link.image ? (
                  <div className={styles.linkImageWrap}>
                    <Image
                      src={link.image}
                      alt={link.title || "Link"}
                      width={22}
                      height={22}
                      className={styles.linkImageIcon}
                    />
                  </div>
                ) : Icon ? (
                  <Icon size={20} className={styles.linkLucideIcon} />
                ) : (
                  <div className={styles.linkIconPlaceholder}>•</div>
                )}
              </div>
              <span className={styles.linkText}>{link.title || "Untitled"}</span>
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}
