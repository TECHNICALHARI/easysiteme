"use client";
import { motion } from 'framer-motion';
import { PencilLine, LayoutTemplate, Globe2, Rocket } from 'lucide-react';
import styles from '@/styles/main.module.css';
import { JSX } from 'react';

type Step = { title: string; desc: string; icon: JSX.Element };

const steps: Step[] = [
    {
        title: 'Claim your subdomain',
        desc: 'Pick something memorable like yourname.myeasypage.com. No credit card needed.',
        icon: <Globe2 size={22} />,
    },
    {
        title: 'Choose layout & theme',
        desc: 'Bio link or full website, light or dark — switch anytime.',
        icon: <LayoutTemplate size={22} />,
    },
    {
        title: 'Add content & posts',
        desc: 'Drag-drop About, Services, Gallery, FAQs, and write blog posts with SEO fields.',
        icon: <PencilLine size={22} />,
    },
    {
        title: 'Publish in seconds',
        desc: 'Go live instantly with global delivery and clean links.',
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

                <ol className={styles.featureGrid} aria-label="Setup steps">
                    {steps.map((s, i) => (
                        <motion.li
                            key={s.title}
                            className={styles.featureCard}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.35 }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <div className={styles.featureIconWrapper} aria-hidden="true">
                                <span className={styles.featureIcon}>{s.icon}</span>
                            </div>
                            <h3 className={styles.featureTitle}>
                                {i + 1}. {s.title}
                            </h3>
                            <p className={styles.featureText}>{s.desc}</p>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
