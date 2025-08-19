'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { Instagram, Youtube, Calendar, Twitter, Linkedin, Globe } from 'lucide-react';
import { Socials } from '@/lib/frontend/types/form';

interface Props {
  socials: Socials;
}

export default function SocialSection({ socials }: Props) {
  const socialData = [
    { id: 'instagram', icon: <Instagram size={18} />, url: socials.instagram },
    { id: 'youtube', icon: <Youtube size={18} />, url: socials.youtube },
    { id: 'calendly', icon: <Calendar size={18} />, url: socials.calendly },
    { id: 'twitter', icon: <Twitter size={18} />, url: (socials as any).twitter },
    { id: 'linkedin', icon: <Linkedin size={18} />, url: (socials as any).linkedin },
    { id: 'website', icon: <Globe size={18} />, url: (socials as any).website },
  ].filter((s) => s.url);

  if (socialData.length === 0) return null;

  return (
    <motion.div
      className={styles.socialIcons}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {socialData.map((s, i) => (
        <motion.a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          viewport={{ once: true }}
        >
          {s.icon}
        </motion.a>
      ))}
    </motion.div>
  );
}
