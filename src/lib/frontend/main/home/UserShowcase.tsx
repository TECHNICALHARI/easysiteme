'use client';

import { motion } from 'framer-motion';
import { Globe, UserCheck, Image } from 'lucide-react';
import styles from '@/styles/main.module.css';

const users = [
  {
    name: '@rajtech',
    link: 'https://raj.onepage.site',
    desc: 'Freelancer with GitHub, WhatsApp & services.',
    icon: <UserCheck size={22} />,
  },
  {
    name: '@artbyaisha',
    link: 'https://aisha.onepage.site',
    desc: 'Artist showing gallery, contact & store.',
    icon: <Image size={22} />,
  },
  {
    name: '@startupdeck',
    link: 'https://startupdeck.onepage.site',
    desc: 'Startup pitch deck with embedded video.',
    icon: <Globe size={22} />,
  },
];

export default function UserShowcase() {
  return (
    <section id="reviews" className="section bg-muted">
      <div className="container text-center">
        <h2 className="section-title">Pages Created with OnePage</h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          Explore real examples built by users like you. Live subdomains, real content, and custom layouts.
        </p>

        <div className={styles.userGrid}>
          {users.map((user, i) => (
            <motion.div
              key={i}
              className={styles.userCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.userIcon}>{user.icon}</div>
              <h4 className={styles.userHandle}>{user.name}</h4>
              <a href={user.link} target="_blank" rel="noopener noreferrer" className={styles.userLink}>
                {user.link}
              </a>
              <p className={styles.userDesc}>{user.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
