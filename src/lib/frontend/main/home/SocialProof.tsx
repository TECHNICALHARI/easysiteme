'use client';

import { motion } from 'framer-motion';
import {
    Star,
    Rocket,
    Timer,
    Globe2,
    Camera,
    Play,
    Bird,
    Search,
    CalendarRange,
} from 'lucide-react';
import styles from '@/styles/main.module.css';

const stats = [
    { k: '4.8/5', label: 'Average rating', Icon: Star },
    { k: '10k+', label: 'Sites launched', Icon: Rocket },
    { k: '120ms', label: 'Median TTFB', Icon: Timer },
    { k: '150+', label: 'Countries served', Icon: Globe2 },
];

const brands = [
    { name: 'Instagram', Icon: Camera },
    { name: 'YouTube', Icon: Play },
    { name: 'X', Icon: Bird },
    { name: 'Google', Icon: Search },
    { name: 'Calendly', Icon: CalendarRange },
];

export default function SocialProof() {
    return (
        <section aria-labelledby="proof-title" className="section bg-muted">
            <div className="container">
                <div className={styles.blockHead}>
                    <h2 id="proof-title" className="section-title">
                        Trusted, fast, ready to grow
                    </h2>
                    <p className="section-subtitle">
                        Creators, freelancers and small businesses choose myeasypage for speed and simplicity.
                    </p>
                </div>

                <div className={styles.trustGrid}>
                    {stats.map(({ k, label, Icon }, i) => (
                        <motion.div
                            key={k}
                            className={styles.trustCard}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.35 }}
                            viewport={{ once: true }}
                        >
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: 'color-mix(in srgb, var(--color-brand) 12%, var(--color-bg))',
                                    border: '1px solid color-mix(in srgb, var(--color-brand) 28%, transparent)',
                                    marginBottom: 8,
                                }}
                                aria-hidden
                            >
                                <Icon size={18} style={{ color: 'var(--color-brand)' }} />
                            </div>

                            <div className="text-3xl font-extrabold [color:var(--color-brand)]">{k}</div>
                            <div className={styles.trustText}>{label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 flex items-center justify-center flex-wrap gap-8 opacity-90">
                    {brands.map(({ name, Icon }, i) => (
                        <motion.span
                            key={name}
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.35 }}
                            viewport={{ once: true }}
                            title={name}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 12px',
                                borderRadius: 9999,
                                background: 'color-mix(in srgb, var(--color-bg) 92%, transparent)',
                                border: '1px solid rgba(0,0,0,.06)',
                            }}
                        >
                            <Icon size={18} style={{ color: 'var(--color-text)' }} />
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: 700, fontSize: '.95rem' }}>
                                {name}
                            </span>
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
}
