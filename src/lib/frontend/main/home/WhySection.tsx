"use client";
import { motion } from 'framer-motion';
import { Sparkles, Rocket, ShieldCheck, LayoutTemplate, PenLine, Link as LinkIcon } from 'lucide-react';
import styles from '@/styles/main.module.css';
import { JSX } from 'react';

type Feature = {
  title: string;
  desc: string;
  icon: JSX.Element;
};

const features: Feature[] = [
  {
    title: 'No-code page builder',
    desc: 'Drag-drop sections like About, Gallery, Testimonials, FAQs, Contact and more.',
    icon: <Sparkles size={26} className={styles.featureIcon} />,
  },
  {
    title: 'Blog built-in',
    desc: 'Write posts with titles, covers and SEO fields. Publish instantly.',
    icon: <PenLine size={26} className={styles.featureIcon} />,
  },
  {
    title: 'Bio link that converts',
    desc: 'Clean, fast link-in-bio layout with prominent CTAs to grow clicks.',
    icon: <LinkIcon size={26} className={styles.featureIcon} />,
  },
  {
    title: 'Premium themes',
    desc: 'Pick a polished theme. Switch between Bio or Website layouts anytime.',
    icon: <LayoutTemplate size={26} className={styles.featureIcon} />,
  },
  {
    title: 'Fast & secure',
    desc: 'Global edge hosting and passwordless login for peace of mind.',
    icon: <ShieldCheck size={26} className={styles.featureIcon} />,
  },
  {
    title: 'Made to convert',
    desc: 'Speed, SEO basics and UX best-practices to turn visits into action.',
    icon: <Rocket size={26} className={styles.featureIcon} />,
  },
];

export default function WhySection() {
  return (
    <section id="why" className="section" aria-labelledby="why-title">
      <div className="container">
        <div className={styles.blockHead}>
          <h2 id="why-title" className="section-title">Why myeasypage?</h2>
          <p className="section-subtitle">
            Launch a premium website, blog or bio link on your own subdomain — in minutes.
          </p>
        </div>

        <ul className={styles.featureGrid} role="list" aria-label="Key features">
          {features.map((f, i) => (
            <motion.li
              key={f.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className={styles.featureIconWrapper} aria-hidden="true">{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureText}>{f.desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
