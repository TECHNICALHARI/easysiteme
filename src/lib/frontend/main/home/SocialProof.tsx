"use client";
import { motion } from 'framer-motion';
import {
    Rocket,
    ShieldCheck,
    Globe2,
    Zap,
    Camera,
    Play,
    Bird,
    Search,
    CalendarRange,
    Globe,
    LucideTwitter,
    Hash,
} from 'lucide-react';
import styles from '@/styles/main.module.css';

const trustPoints = [
    {
        k: 'Instant',
        label: 'Go live in seconds — no setup hassle',
        Icon: Rocket,
    },
    {
        k: 'Secure',
        label: 'Protected accounts and safe access',
        Icon: ShieldCheck,
    },
    {
        k: 'Global',
        label: 'Optimized delivery across regions',
        Icon: Globe2,
    },
    {
        k: 'Fast',
        label: 'Lightweight pages for snappy loads',
        Icon: Zap,
    },
];
export function XIcon({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 28 28"
            fill="currentColor"
        >
            <path d="M18.9 2H22L14.5 10.6L23 22H16.3L10.9 14.8L4.8 22H1.1L9.1 12.8L1 2H7L11.9 8.7L18.9 2Z" />
        </svg>
    );
}

const tools = [
    { name: 'Instagram', Icon: Camera },
    { name: 'YouTube', Icon: Play },
    { name: 'Twitter', Icon: XIcon },
    { name: 'Across the Web', Icon: Globe },
    { name: 'Calendly', Icon: CalendarRange },
];

export default function SocialProof() {
    return (
        <section aria-labelledby="proof-title" className="section bg-muted">
            <div className="container">
                <div className={styles.blockHead}>
                    <h2 id="proof-title" className="section-title">Built on trust and performance</h2>
                    <p className="section-subtitle">
                        myeasypage delivers instant publishing, secure access, and a global footprint for creators and businesses.
                    </p>
                </div>

                <ul className={styles.trustGrid} role="list" aria-label="Trust and performance benefits">
                    {trustPoints.map(({ k, label, Icon }, i) => (
                        <motion.li
                            key={k}
                            className={styles.trustCard}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.35 }}
                            viewport={{ once: true, amount: 0.2 }}
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
                                aria-hidden="true"
                            >
                                <Icon size={18} style={{ color: 'var(--color-brand)' }} />
                            </div>

                            <div className="text-2xl font-bold [color:var(--color-brand)]">{k}</div>
                            <div className={styles.trustText}>{label}</div>
                        </motion.li>
                    ))}
                </ul>

                <div className="mt-10">
                    <p className="text-center text-sm uppercase tracking-widest opacity-70 mb-4">
                        Works with your favorite tools
                    </p>
                    <div className="flex items-center justify-center flex-wrap gap-8 opacity-90">
                        {tools.map(({ name, Icon }, i) => (
                            <motion.span
                                key={name}
                                initial={{ opacity: 0, y: 6 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.05, duration: 0.35 }}
                                viewport={{ once: true, amount: 0.2 }}
                                title={name}
                                aria-label={`Integration: ${name}`}
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
                                <Icon size={18} style={{ color: 'var(--color-text)' }} aria-hidden="true" />
                                <span style={{ color: 'var(--color-text-muted)', fontWeight: 700, fontSize: '.95rem' }}>
                                    {name}
                                </span>
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
