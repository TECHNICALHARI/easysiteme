"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { Instagram, Youtube, Calendar, Twitter, Linkedin, Globe } from "lucide-react";
import { Socials } from "@/lib/frontend/types/form";

export default function SocialSection({ socials }: { socials?: Socials | any }) {
  const socialData = [
    { id: "instagram", icon: <Instagram size={18} />, url: socials?.instagram },
    { id: "youtube", icon: <Youtube size={18} />, url: socials?.youtube },
    { id: "calendly", icon: <Calendar size={18} />, url: socials?.calendly },
    { id: "twitter", icon: <Twitter size={18} />, url: (socials as any)?.twitter },
    { id: "linkedin", icon: <Linkedin size={18} />, url: (socials as any)?.linkedin ?? socials?.LinkedIn },
    { id: "website", icon: <Globe size={18} />, url: (socials as any)?.website },
  ].filter((s) => typeof s.url === "string" && s.url.trim().length > 0);

  if (socialData.length === 0) return null;

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
        >
          {s.icon}
        </motion.a>
      ))}
    </motion.div>
  );
}
