'use client';
import { motion } from 'framer-motion';
import {
  User,
  Paintbrush,
  Camera,
  Building,
  GraduationCap,
  Megaphone,
  Dumbbell,
  AppWindow,
  ShoppingBag,
} from 'lucide-react';
import styles from '@/styles/main.module.css';

const useCases = [
  { icon: <User size={22} />, title: 'Freelancers', desc: 'Showcase your services, portfolio, contact info and land more gigs.' },
  { icon: <Paintbrush size={22} />, title: 'Creators & Artists', desc: 'Link to your Instagram, YouTube, gallery, or store — all in one place.' },
  { icon: <Camera size={22} />, title: 'Photographers', desc: 'Display your best shots, add testimonials, and allow inquiries via form.' },
  { icon: <Building size={22} />, title: 'Small Businesses', desc: 'Promote your offerings, location, and contact info with professional flair.' },
  { icon: <GraduationCap size={22} />, title: 'Students & Grads', desc: 'Build your resume site with projects, LinkedIn, and GitHub in under a minute.' },
  { icon: <Megaphone size={22} />, title: 'Influencers', desc: 'Control your bio link. Add YouTube, TikTok, WhatsApp, and promotions.' },
  { icon: <Dumbbell size={22} />, title: 'Coaches & Trainers', desc: 'Showcase programs, testimonials, pricing, and booking details.' },
  { icon: <AppWindow size={22} />, title: 'App Developers', desc: 'Share your product, features, contact, and store links — beautifully.' },
  { icon: <ShoppingBag size={22} />, title: 'Sellers & Vendors', desc: 'Link your catalog, location, social DMs, and WhatsApp with zero code.' },
];

export default function UseCasesSection() {
  return (
    <section className="section" id="usecases">
      <div className="container text-center">
        <h2 className="section-title">Perfect For</h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          OnePage is made for anyone who wants to create a professional presence — fast.
        </p>

        <div className={styles.useCasesGrid}>
          {useCases.map(({ icon, title, desc }, i) => (
            <motion.div
              key={i}
              className={styles.useCaseCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.useCaseIcon}>{icon}</div>
              <h4 className={styles.useCaseTitle}>{title}</h4>
              <p className={styles.useCaseText}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
