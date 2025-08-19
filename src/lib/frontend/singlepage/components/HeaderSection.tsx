'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { ProfileTabData } from '@/lib/frontend/types/form';

export default function HeaderSection({ profile }: { profile: ProfileTabData }) {
  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className={styles.profileSection}>
      {profile.bannerImage && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className={styles.bannerWrapper}
        >
          <img src={profile.bannerImage} alt="Banner" className={styles.bannerImage} />
        </motion.div>
      )}

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        viewport={{ once: true }}
        className={`${styles.profileInfo} ${profile.bannerImage ? '' : styles.noMarginTop}`}
      >
        {profile.avatar ? (
          <motion.img
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            src={profile.avatar}
            alt="Avatar"
            className={styles.avatarImage}
          />
        ) : (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className={styles.avatarFallback}
          >
            {initials}
          </motion.div>
        )}

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className={styles.avatarName}
        >
          {profile.fullName}
        </motion.h1>

        {profile.title && (
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className={styles.tagline}
          >
            {profile.title}
          </motion.p>
        )}

        {profile.bio && (
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className={styles.bio}
          >
            {profile.bio}
          </motion.p>
        )}

        {profile.tags && profile.tags?.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.35 }}
            viewport={{ once: true }}
            className={styles.tagsWrapper}
          >
            {profile.tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {profile.headers?.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className={styles.headersWrapper}
          >
            {profile.headers.map((h) => (
              <h2 key={h.id} className={styles.profileSubheader}>
                {h.title}
              </h2>
            ))}
          </motion.div>
        )}

        {profile.about && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.45 }}
            viewport={{ once: true }}
            className={styles.about}
            dangerouslySetInnerHTML={{ __html: profile.about }}
          />
        )}
      </motion.div>
    </section>
  );
}
