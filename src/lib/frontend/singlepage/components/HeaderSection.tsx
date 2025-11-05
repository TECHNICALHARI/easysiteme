"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import type { ProfileTabData } from "@/lib/frontend/types/form";

export default function HeaderSection({ profile }: { profile: ProfileTabData | any }) {
  const name = profile?.fullName ?? "";
  const initials =
    (name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n: string) => n[0]?.toUpperCase() ?? "")
      .join("") || "•";

  const hasBanner = Boolean(profile?.bannerImage);
  const hasTitle = Boolean(profile?.title);
  const hasBio = Boolean(profile?.bio);
  const hasTags = Array.isArray(profile?.tags) && profile.tags.length > 0;
  const hasHeaders = Array.isArray(profile?.headers) && profile.headers.length > 0;
  const hasAbout = Boolean(profile?.about);
  const hasAnyMeta = hasTitle || hasBio || hasTags || hasHeaders || hasAbout;

  const fadeInUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className={styles.profileSection}>
      {hasBanner && (
        <motion.div
          key={profile.bannerImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          className={styles.bannerWrapper}
        >
          <img src={profile.bannerImage} alt="Banner"  className={styles.bannerImage} />
          <div className={styles.bannerOverlay} />
        </motion.div>
      )}

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className={hasBanner ? styles.profileInfoCard : styles.profileInfoFrameless}
      >
        {profile?.avatar ? (
          <motion.img
            key={profile.avatar}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28 }}
            src={profile.avatar}
            alt={name || "Avatar"}
            className={styles.avatarImage}
          />
        ) : (
          <motion.div
            key="avatar-fallback"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28 }}
            className={`${styles.avatarFallback} ${styles.avatarGradientRing}`}
          >
            {initials}
          </motion.div>
        )}

        <motion.h1 variants={fadeInUp} className={styles.avatarName}>
          {name || profile?.settings?.subdomain || "Anonymous"}
        </motion.h1>

        {hasTitle && (
          <motion.p variants={fadeInUp} className={styles.tagline}>
            {profile.title}
          </motion.p>
        )}

        {hasBio && (
          <motion.p variants={fadeInUp} className={styles.bio}>
            {profile.bio}
          </motion.p>
        )}

        {hasTags && (
          <motion.div variants={fadeInUp} className={styles.tagsWrapper}>
            {profile.tags.slice(0, 6).map((tag: string, idx: number) => (
              <span key={`${tag}-${idx}`} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {hasHeaders && (
          <motion.div variants={fadeInUp} className={styles.headersWrapper}>
            {profile.headers.map((h: any) => (
              <h2 key={h.id} className={styles.profileSubheader}>
                {h.title}
              </h2>
            ))}
          </motion.div>
        )}

        {hasAbout && (
          <motion.div
            variants={fadeInUp}
            className={styles.about}
            dangerouslySetInnerHTML={{ __html: profile.about }}
          />
        )}

        {!hasAnyMeta && <div className={styles.metaSpacer} />}
      </motion.div>
    </section>
  );
}
