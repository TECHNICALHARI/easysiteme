'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Globe, MessageSquare, MapPin } from 'lucide-react';
import styles from '@/styles/preview.module.css';
import type { ProfileTabData } from '@/lib/frontend/types/form';

export default function ContactSection({ profile }: { profile: ProfileTabData }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const showInfo =
        !!profile.fullAddress ||
        !!profile.email ||
        !!profile.phone ||
        !!profile.website ||
        !!profile.whatsapp;

    const showForm = !!profile.showContactForm;

    if (!showInfo && !showForm) return null;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
    };
    return (
        <section id="contact" className={styles.contactSectionCard}>
            <div className={styles.contactGrad} />
            <motion.div
                className={styles.contactInner}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
            >
                <h2 className={styles.sectionTitle}>Get in Touch</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {showInfo && (
                        <div className={styles.contactCard}>
                            <h3 className={styles.contactTitle}>Contact Information</h3>
                            <ul className={styles.contactList}>
                                {profile.fullAddress && (
                                    <li className={styles.contactItem}>
                                        <MapPin size={18} className={styles.contactIcon} />
                                        <span>{profile.fullAddress}</span>
                                    </li>
                                )}
                                {profile.phone && (
                                    <li className={styles.contactItem}>
                                        <Phone size={18} className={styles.contactIcon} />
                                        <a href={`tel:${profile.phone}`} className={styles.contactLink}>
                                            {profile.phone}
                                        </a>
                                    </li>
                                )}
                                {profile.email && (
                                    <li className={styles.contactItem}>
                                        <Mail size={18} className={styles.contactIcon} />
                                        <a href={`mailto:${profile.email}`} className={styles.contactLink}>
                                            {profile.email}
                                        </a>
                                    </li>
                                )}
                                {profile.website && (
                                    <li className={styles.contactItem}>
                                        <Globe size={18} className={styles.contactIcon} />
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.contactLink}
                                        >
                                            {profile.website}
                                        </a>
                                    </li>
                                )}
                                {profile.whatsapp && (
                                    <li className={styles.contactItem}>
                                        <MessageSquare size={18} className={styles.contactIcon} />
                                        <a
                                            href={`https://wa.me/${profile.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.contactLink}
                                        >
                                            WhatsApp: {profile.whatsapp}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {showForm && (
                        <div className={styles.contactCard}>
                            <h3 className={styles.contactTitle}>Send a Message</h3>

                            {!submitted ? (
                                <form onSubmit={onSubmit} className={styles.contactForm}>
                                    <input
                                        className={styles.contactInput}
                                        type="text"
                                        placeholder="Your name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <input
                                        className={styles.contactInput}
                                        type="email"
                                        placeholder="Your email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <textarea
                                        className={`${styles.contactInput} ${styles.contactTextarea}`}
                                        placeholder="Write your message..."
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                    <button type="submit" className={styles.contactSubmit}>
                                        Send Message
                                    </button>
                                </form>
                            ) : (
                                <p className={styles.contactThanks}>
                                    🎉 Thanks for reaching out! I’ll get back to you soon.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
