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
  const fadeInUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className={styles.profileSection}>
      {profile?.bannerImage ? (
        <motion.div
          key={profile.bannerImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          className={styles.bannerWrapper}
        >
          <img src={profile.bannerImage} alt="Banner" className={styles.bannerImage} />
        </motion.div>
      ) : (
        <div className={styles.bannerFallback} />
      )}

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className={`${styles.profileInfo} ${profile?.bannerImage ? "" : styles.noMarginTop}`}
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
            className={styles.avatarFallback}
          >
            {initials}
          </motion.div>
        )}

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          className={styles.avatarName}
        >
          {name || profile?.settings?.subdomain || "Anonymous"}
        </motion.h1>

        {profile?.title ? (
          <motion.p variants={fadeInUp} className={styles.tagline}>
            {profile.title}
          </motion.p>
        ) : null}

        {profile?.bio ? (
          <motion.p variants={fadeInUp} className={styles.bio}>
            {profile.bio}
          </motion.p>
        ) : null}

        {Array.isArray(profile?.tags) && profile.tags.length > 0 && (
          <motion.div variants={fadeInUp} className={styles.tagsWrapper}>
            {profile.tags.slice(0, 6).map((tag: string, idx: number) => (
              <span key={`${tag}-${idx}`} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {Array.isArray(profile?.headers) && profile.headers.length > 0 && (
          <motion.div variants={fadeInUp} className={styles.headersWrapper}>
            {profile.headers.map((h: any) => (
              <h2 key={h.id} className={styles.profileSubheader}>
                {h.title}
              </h2>
            ))}
          </motion.div>
        )}

        {profile?.about ? (
          <motion.div
            variants={fadeInUp}
            className={styles.about}
            dangerouslySetInnerHTML={{ __html: profile.about }}
          />
        ) : null}
      </motion.div>
    </section>
  );
}
