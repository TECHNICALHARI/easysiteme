'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';
import { Sparkles, Rocket, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'Fully Customizable',
    desc: 'Add sections like About, Gallery, Testimonials, Contact & more using our no-code editor.',
    icon: <Sparkles size={28} className={styles.featureIcon} />,
  },
  {
    title: 'Share & Convert',
    desc: 'Optimized for social and mobile. Built for creators, freelancers, and teams to engage better.',
    icon: <Rocket size={28} className={styles.featureIcon} />,
  },
  {
    title: 'Secure & Scalable',
    desc: 'Hosted on Vercel with secure Magic Link login. Fast, private, and built to scale with you.',
    icon: <ShieldCheck size={28} className={styles.featureIcon} />,
  },
];

export default function WhySection() {
  return (
    <section id="why" className="section">
      <div className="container text-center">
        <h2 className="section-title">Why OnePage?</h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          Unlike generic link tools, OnePage helps you build trust and convert visitors with rich content and features under your personal subdomain.
        </p>

        <div className={styles.featureGrid}>
          {features.map((item, i) => (
            <motion.div
              key={i}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.featureIconWrapper}>{item.icon}</div>
              <h4 className={styles.featureTitle}>{item.title}</h4>
              <p className={styles.featureText}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
