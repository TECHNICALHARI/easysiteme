'use client';

import { motion } from 'framer-motion';
import { PencilLine, LayoutTemplate, Globe2, Rocket } from 'lucide-react';
import styles from '@/styles/main.module.css';

const steps = [
    {
        title: 'Claim your subdomain',
        desc: 'Pick something memorable like yourname.myeasypage.com. No credit card needed.',
        icon: <Globe2 size={22} />,
    },
    {
        title: 'Choose layout & theme',
        desc: 'Bio link or full website, light or dark, swap themes anytime.',
        icon: <LayoutTemplate size={22} />,
    },
    {
        title: 'Add content & posts',
        desc: 'Drag-drop sections for About, Services, Gallery, FAQs and write blog posts with SEO fields.',
        icon: <PencilLine size={22} />,
    },
    {
        title: 'Publish in seconds',
        desc: 'Your page goes live instantly with global edge delivery and clean links.',
        icon: <Rocket size={22} />,
    },
];

export default function StepsSection() {
    return (
        <section id="how-it-works" className="section bg-muted" aria-labelledby="steps-title">
            <div className="container">
                <div className={styles.blockHead}>
                    <h2 id="steps-title" className="section-title">Launch in four simple steps</h2>
                    <p className="section-subtitle">From idea to live site — no code, no friction.</p>
                </div>

                <div className={styles.featureGrid}>
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.title}
                            className={styles.featureCard}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.35 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.featureIconWrapper}>
                                <span className={styles.featureIcon}>{s.icon}</span>
                            </div>
                            <h4 className={styles.featureTitle}>{i + 1}. {s.title}</h4>
                            <p className={styles.featureText}>{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
