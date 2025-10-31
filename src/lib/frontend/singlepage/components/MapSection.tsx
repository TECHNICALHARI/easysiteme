"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { MapPin } from "lucide-react";

export default function MapSection({ profile }: { profile?: any }) {
  const fullAddress = profile?.fullAddress ?? "";
  const latitude = profile?.latitude;
  const longitude = profile?.longitude;
  const hasCoords = latitude !== undefined && longitude !== undefined && latitude !== "" && longitude !== "";
  const hasAddress = fullAddress && String(fullAddress).trim().length > 0;
  if (!hasCoords && !hasAddress) return null;

  const mapSrc = hasCoords
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  const directionsHref = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  return (
    <motion.section
      id="location"
      className="px-4 mt-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>Find Me</h2>
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <motion.div className="rounded-2xl overflow-hidden border border-[var(--color-muted)] shadow-sm">
          <iframe
            className="w-full h-[340px] md:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
            title="Location Map"
          />
        </motion.div>
        <motion.div className="flex flex-col items-start justify-between bg-[var(--color-bg)] border border-[var(--color-muted)] rounded-2xl p-4 md:p-6 gap-3">
          <div>
            <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
              <MapPin size={18} />
              <span>Address / Coordinates</span>
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] break-words">
              {hasCoords && (
                <>
                  Lat: <span className="font-medium">{latitude}</span>, Lng: <span className="font-medium">{longitude}</span>
                </>
              )}
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
