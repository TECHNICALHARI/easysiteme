"use client";
import { motion } from 'framer-motion';
import {
  User, Paintbrush, Camera, Building, GraduationCap, Megaphone,
  Dumbbell, AppWindow, ShoppingBag, Briefcase, Music, HeartHandshake, Newspaper
} from 'lucide-react';
import styles from '@/styles/main.module.css';
import { JSX } from 'react';

type UseCase = { icon: JSX.Element; title: string; desc: string };

const useCases: UseCase[] = [
  { icon: <User size={20} />, title: 'Freelancers', desc: 'Pitch services, showcase work and add a quick contact CTA.' },
  { icon: <Paintbrush size={20} />, title: 'Creators', desc: 'Bring reels, YouTube, storefront and sponsors together.' },
  { icon: <Camera size={20} />, title: 'Photographers', desc: 'Display packages, testimonials and a fast gallery.' },
  { icon: <Building size={20} />, title: 'Local Businesses', desc: 'Menu/services, map, hours and an enquiry form.' },
  { icon: <GraduationCap size={20} />, title: 'Students', desc: 'Portfolio with projects, resume and blog posts.' },
  { icon: <Megaphone size={20} />, title: 'Influencers', desc: 'Own your bio link with campaigns and promos.' },
  { icon: <Dumbbell size={20} />, title: 'Coaches', desc: 'Programs, client results, pricing and booking link.' },
  { icon: <AppWindow size={20} />, title: 'App Makers', desc: 'Feature list, changelog and download links.' },
  { icon: <ShoppingBag size={20} />, title: 'Sellers', desc: 'Catalog highlights with DM/WhatsApp and store links.' },
  { icon: <Briefcase size={20} />, title: 'Consultants', desc: 'Case studies, services and calendar embed.' },
  { icon: <Music size={20} />, title: 'Musicians', desc: 'Release embeds, EPK and booking contact.' },
  { icon: <HeartHandshake size={20} />, title: 'Non-profits', desc: 'Mission, impact stats and donation link.' },
];


export default function UseCasesSection() {
  return (
    <section id="usecases" className="section" aria-labelledby="usecases-title">
      <div className="container">
        <div className={styles.blockHead}>
          <h2 id="usecases-title" className="section-title">
            Who is myeasypage for?
          </h2>
          <p className="section-subtitle">
            From simple bio links to mini-sites and blogs — pick a layout now and switch anytime.
          </p>
        </div>

        <ul className={styles.useCasesGrid} role="list" aria-label="Popular use cases">
          {useCases.map((u, i) => (
            <motion.li
              key={u.title}
              className={styles.useCaseCard}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.035, duration: 0.3 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className={styles.useCaseIcon} aria-hidden="true">{u.icon}</div>
              <h3 className={styles.useCaseTitle}>{u.title}</h3>
              <p className={styles.useCaseText}>{u.desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
