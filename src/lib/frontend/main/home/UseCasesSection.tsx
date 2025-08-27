'use client';

import { motion } from 'framer-motion';
import { User, Paintbrush, Camera, Building, GraduationCap, Megaphone, Dumbbell, AppWindow, ShoppingBag, Briefcase, Music, HeartHandshake, Newspaper } from 'lucide-react';
import styles from '@/styles/main.module.css';

const useCases = [
  { icon: <User size={20} />, title: 'Freelancers', desc: 'Pitch services, portfolio, pricing and WhatsApp in one link.' },
  { icon: <Paintbrush size={20} />, title: 'Creators', desc: 'Reels, YouTube, storefront and sponsor offers on a clean page.' },
  { icon: <Camera size={20} />, title: 'Photographers', desc: 'Show packages, testimonials and a fast gallery that sells.' },
  { icon: <Building size={20} />, title: 'Local Businesses', desc: 'Menu/services, map, hours and contact form.' },
  { icon: <GraduationCap size={20} />, title: 'Students', desc: 'Resume site with projects and posts.' },
  { icon: <Megaphone size={20} />, title: 'Influencers', desc: 'Own your bio link with campaigns and promos.' },
  { icon: <Dumbbell size={20} />, title: 'Coaches', desc: 'Programs, results, pricing and booking CTA.' },
  { icon: <AppWindow size={20} />, title: 'App Makers', desc: 'Feature list, changelog blog and download links.' },
  { icon: <ShoppingBag size={20} />, title: 'Sellers', desc: 'Catalog highlights, DM/WhatsApp and store links.' },
  { icon: <Briefcase size={20} />, title: 'Consultants', desc: 'Case studies, services and calendar embed.' },
  { icon: <Music size={20} />, title: 'Musicians', desc: 'Release embeds, EPK and contact.' },
  { icon: <HeartHandshake size={20} />, title: 'Non-profits', desc: 'Mission, impact stats and donation link.' },
  { icon: <Newspaper size={20} />, title: 'Bloggers', desc: 'Write posts with covers, SEO and fast load times.' },
];

export default function UseCasesSection() {
  return (
    <section id="usecases" className="section" aria-labelledby="usecases-title">
      <div className="container">
        <div className={styles.blockHead}>
          <h2 id="usecases-title" className="section-title">Perfect for websites, blogs and bio links</h2>
          <p className="section-subtitle">Start simple with a bio link or go bigger with a mini-site and blog. Switch layouts anytime.</p>
        </div>

        <div className={styles.useCasesGrid}>
          {useCases.map((u, i) => (
            <motion.div
              key={u.title}
              className={styles.useCaseCard}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.035, duration: 0.3 }}
              viewport={{ once: true }}
            >
              <div className={styles.useCaseIcon}>{u.icon}</div>
              <h4 className={styles.useCaseTitle}>{u.title}</h4>
              <p className={styles.useCaseText}>{u.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
