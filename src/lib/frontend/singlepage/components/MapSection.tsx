'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { MapPin } from 'lucide-react';
import type { ProfileTabData } from '@/lib/frontend/types/form';

interface Props {
  profile: Pick<ProfileTabData, 'fullAddress' | 'latitude' | 'longitude'>;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MapSection({ profile }: Props) {
  const { fullAddress, latitude, longitude } = profile || {};
  const hasCoords = Boolean(latitude && longitude);
  const hasAddress = Boolean(fullAddress && fullAddress.trim().length > 0);

  if (!hasCoords && !hasAddress) return null;

  const mapSrc = hasCoords
    ? `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(fullAddress!)}&output=embed`;

  const directionsHref = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress!)}`;

  return (
    <motion.section
      id="location"
      className="px-4 mt-10"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>Find Me</h2>
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          className="rounded-2xl overflow-hidden border border-[var(--color-muted)] shadow-sm"
          variants={fadeInUp}
        >
          <iframe
            className="w-full h-[340px] md:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
            title="Location Map"
          />
        </motion.div>
        <motion.div
          className="flex flex-col items-start justify-between bg-[var(--color-bg)] border border-[var(--color-muted)] rounded-2xl p-4 md:p-6 gap-3"
          variants={fadeInUp}
        >
          <div>
            <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
              <MapPin size={18} />
              <span>Address / Coordinates</span>
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] break-words">
              {hasCoords && <>Lat: <span className="font-medium">{latitude}</span>, Lng: <span className="font-medium">{longitude}</span></>}
              {hasCoords && hasAddress && <><br /></>}
              {hasAddress && <span>{fullAddress}</span>}
            </p>
          </div>
          <a href={directionsHref} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
            Get Directions →
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
