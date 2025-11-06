"use client";

import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";

function isPdf(url?: string) {
    if (!url) return false;
    try {
        const u = new URL(url);
        return u.pathname.toLowerCase().endsWith(".pdf");
    } catch {
        return url.toLowerCase().includes(".pdf");
    }
}

export default function ResumeSection({ profile }: { profile?: any }) {
    const url =
        profile?.resumeUrl ??
        profile?.resume?.resumeUrl ??
        "";

    if (!url || typeof url !== "string") return null;

    const pdf = isPdf(url);

    console.log(url, "url")
    return (
        <motion.section
            id="resume"
            className="px-4 mt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
        >
            <h2 className={styles.sectionTitle}>Resume</h2>

            <div className={styles.mediaGrid}>
                <div className={styles.featuredCard}>
                    <div className="w-full">
                        {pdf ? (
                            <iframe
                                src={url}
                                title="Resume"
                                className={styles.featuredIframe}
                                style={{ background: "#fff" }}
                            />
                        ) : (
                            <img
                                src={url}
                                alt="Resume"
                                className={styles.featuredImage}
                            />
                        )}
                    </div>
                    <div className={styles.featuredContent}>
                        <div className="flex gap-8">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.ctaButton}
                            >
                                View
                            </a>
                            <a
                                href={url}
                                download
                                className={styles.ctaButton}
                                style={{ background: "var(--color-brand-dark)" }}
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
