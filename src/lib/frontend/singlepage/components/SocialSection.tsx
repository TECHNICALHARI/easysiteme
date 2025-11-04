"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { Instagram, Youtube, Calendar, Twitter, Linkedin, Globe, Share2 } from "lucide-react";
import { Socials } from "@/lib/frontend/types/form";
import ThemeTogglePreview from "../layout/ThemeTogglePreview";
import { useCallback, useMemo } from "react";

export default function SocialSection({ socials, showActions }: { socials?: Socials | any, showActions?: boolean }) {
  const socialData = [
    { id: "instagram", icon: <Instagram size={18} />, url: socials?.instagram },
    { id: "youtube", icon: <Youtube size={18} />, url: socials?.youtube },
    { id: "calendly", icon: <Calendar size={18} />, url: socials?.calendly },
    { id: "twitter", icon: <Twitter size={18} />, url: (socials as any)?.twitter },
    { id: "linkedin", icon: <Linkedin size={18} />, url: (socials as any)?.linkedin ?? socials?.LinkedIn },
    { id: "website", icon: <Globe size={18} />, url: (socials as any)?.website },
  ].filter((s) => typeof s.url === "string" && s.url.trim().length > 0);

  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://myeasypage.app";
    return window.location.href;
  }, []);

  const handleShare = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: "Check my profile", url: pageUrl });
        return;
      }
    } catch { }
    try {
      await navigator.clipboard.writeText(pageUrl);
      alert("Link copied!");
    } catch {
      window.open(pageUrl, "_blank", "noopener,noreferrer");
    }
  }, [pageUrl]);

  return (
    <motion.div
      className={styles.socialIcons}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36 }}
      viewport={{ once: true }}
    >
      {socialData.map((s, i) => (
        <motion.a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.28 }}
          viewport={{ once: true }}
          aria-label={s.id}
          title={s.id}
        >
          {s.icon}
        </motion.a>
      ))}
      {
        showActions && <>
          <motion.button
            type="button"
            onClick={handleShare}
            className={`${styles.socialIcon} ${styles.socialAction}`}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: socialData.length * 0.04, duration: 0.28 }}
            viewport={{ once: true }}
            aria-label="Share"
            title="Share"
          >
            <Share2 size={18} />
          </motion.button>

          <motion.div
            className={`${styles.socialIcon} ${styles.themeToggleInline}`}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: socialData.length * 0.04 + 0.04, duration: 0.28 }}
            viewport={{ once: true }}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <ThemeTogglePreview />
          </motion.div>
        </>
      }
    </motion.div>
  );
}
