"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import { Service } from "@/lib/frontend/types/form";

const fade = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };

export default function ServiceSection({ services }: { services?: Service[] | any }) {
  if (!Array.isArray(services) || services.length === 0) return null;

  const isSingle = services.length === 1;

  return (
    <motion.section
      id="services"
      className="px-4 mt-10"
      variants={fade}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>Services</h2>

      <div className={`${styles.mediaGrid} ${isSingle ? styles.mediaGridSingle : ""}`}>
        {services.map((service: any, i: number) => (
          <motion.div
            key={service.id ?? i}
            className={`${styles.serviceCard} ${isSingle ? styles.singleCardWide : ""}`}
            variants={fade}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: i * 0.04, duration: 0.32 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.serviceTitle}>{service.title || "Untitled Service"}</h3>

            {service.description ? (
              <p className={styles.serviceDescription}>{service.description}</p>
            ) : null}

            {(service.amount || service.currencySymbol || service.customSymbol) && (
              <p className={styles.servicePrice}>
                {(service.currencySymbol ?? service.customSymbol ?? "")}{" "}
                {service.amount ? service.amount : ""}
              </p>
            )}

            {service.ctaLink ? (
              <a
                href={service.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButton}
              >
                {service.ctaLabel || "Learn More"}
              </a>
            ) : null}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
