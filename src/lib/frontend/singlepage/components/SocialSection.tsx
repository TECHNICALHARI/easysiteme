'use client';

import styles from '@/styles/preview.module.css';
import {
  Instagram,
  Youtube,
  Calendar,
  Twitter,
  Linkedin,
  Globe,
} from 'lucide-react';
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
    <div className={styles.socialIcons}>
      {socialData.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}
