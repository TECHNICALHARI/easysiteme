'use client';
import React from 'react';
import styles from '@/styles/skeleton.module.css';

export default function PreviewSkeleton() {
    return (
        <div className={styles.skelPage}>
            <header className={styles.skelHeader}>
                <div className={styles.skelLogo} />
                <div className={styles.skelNav}>
                    <span className={styles.skelPill} />
                    <span className={styles.skelPill} />
                    <span className={styles.skelPill} />
                </div>
            </header>

            <main className={styles.skelMain}>
                <div className={styles.skelBanner} />
                <section className={styles.skelProfileCard}>
                    <div className={styles.skelAvatar} />
                    <div className={styles.skelLines}>
                        <span className={styles.skelLineLg} />
                        <span className={styles.skelLineMd} />
                        <span className={styles.skelLineSm} />
                    </div>
                    <div className={styles.skelTags}>
                        <span className={styles.skelTag} />
                        <span className={styles.skelTag} />
                        <span className={styles.skelTag} />
                    </div>
                    <div className={styles.skelButtons}>
                        <span className={styles.skelBtn} />
                        <span className={styles.skelBtn} />
                    </div>
                </section>

                <section className={styles.skelGrid}>
                    <div className={styles.skelCard}>
                        <div className={styles.skelMedia} />
                        <div className={styles.skelCardBody}>
                            <span className={styles.skelLineMd} />
                            <span className={styles.skelLineSm} />
                        </div>
                    </div>
                    <div className={styles.skelCard}>
                        <div className={styles.skelMedia} />
                        <div className={styles.skelCardBody}>
                            <span className={styles.skelLineMd} />
                            <span className={styles.skelLineSm} />
                        </div>
                    </div>
                    <div className={styles.skelCard}>
                        <div className={styles.skelMedia} />
                        <div className={styles.skelCardBody}>
                            <span className={styles.skelLineMd} />
                            <span className={styles.skelLineSm} />
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.skelFooter}>
                <span className={styles.skelLineSm} />
            </footer>
        </div>
    );
}
