"use client";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import styles from "@/styles/preview.module.css";
import type { ProfileTabData } from "@/lib/frontend/types/form";
import { handleDownloadResume, handleViewResume } from "../../utils/common";

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
  const hasBio = Boolean(profile?.bio);
  const hasTags = Array.isArray(profile?.tags) && profile.tags.length > 0;
  const hasHeaders = Array.isArray(profile?.headers) && profile.headers.length > 0;
  const hasAbout = Boolean(profile?.about);
  const hasAnyMeta = hasBio || hasTags || hasHeaders || hasAbout;

  const resumeUrl: string | null =
    typeof profile?.resumeUrl === "string" && profile.resumeUrl
      ? profile.resumeUrl
      : typeof profile?.resume?.resumeUrl === "string" && profile.resume?.resumeUrl
        ? profile.resume.resumeUrl
        : null;

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
          <img src={profile.bannerImage} alt="Banner" className={styles.bannerImage} />
          <div className={styles.bannerOverlay} />
        </motion.div>
      )}

      <motion.div
        key={name + String(hasBanner)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
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

        <motion.h1 initial={false} animate={{ opacity: 1 }} className={styles.avatarName}>
          {name || profile?.settings?.subdomain || "Anonymous"}
        </motion.h1>

        {hasBio && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.bio}
          >
            {profile.bio}
          </motion.p>
        )}

        {hasTags && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.tagsWrapper}
          >
            {profile.tags.slice(0, 6).map((tag: string, idx: number) => (
              <span key={`${tag}-${idx}`} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </motion.div>
        )}
        {resumeUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.headerActions}
          >
            <button
              type="button"
              onClick={() => handleViewResume(resumeUrl)}
              className={styles.headerAction}
              aria-label="View Resume"
              title="View Resume"
            >
              <FileText size={16} className={styles.headerActionIcon} />
              <span>View Resume</span>
            </button>
            <button
              type="button"
              className={styles.headerActionSecondary}
              aria-label="Download Resume"
              title="Download Resume"
              onClick={() => handleDownloadResume(resumeUrl)}
            >
              <Download size={16} className={styles.headerActionIcon} />
              <span>Download</span>
            </button>
          </motion.div>
        )}

        {hasHeaders && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.headersWrapper}
          >
            {profile.headers.map((h: any) => (
              <h2 key={h.id} className={styles.profileSubheader}>
                {h.title}
              </h2>
            ))}
          </motion.div>
        )}

        {hasAbout && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.about}
            dangerouslySetInnerHTML={{ __html: profile.about }}
          />
        )}

        {!hasAnyMeta && <div className={styles.metaSpacer} />}
      </motion.div>
    </section>
  );
}
