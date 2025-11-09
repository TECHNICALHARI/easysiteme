"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/main.module.css";
import { getFeaturedMakersPublicApi } from "@/lib/frontend/api/services";

type LayoutType = "bio" | "website";

export type FeaturedUser = {
  username: string;
  fullName: string;
  title?: string;
  avatar?: string;
  bannerImage?: string;
  tags?: string[];
  layoutType?: LayoutType;
  customDomain?: string;
};

function publicUrl(u: { subdomain?: string }) {
  return `https://${u.subdomain}.myeasypage.com`;
}

function smallLine(u: { title?: string; subdomain?: string }) {
  return u.title?.trim() || `@${u.subdomain}`;
}

function pillText(layoutType?: LayoutType) {
  return layoutType === "website" ? "Website" : "Bio";
}

export default function UserShowcase() {
  const [items, setItems] = useState<FeaturedUser[] | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const c = new AbortController();
    getFeaturedMakersPublicApi({ limit: 12, signal: c.signal })
      .then((rows) => {
        const mapped: FeaturedUser[] = rows.map((r) => ({
          username: r.subdomain,
          fullName: r.fullName || "",
          avatar: r.avatar || "",
          bannerImage: r.bannerImage || "",
          layoutType: (r.layoutType as LayoutType) || "bio",
        }));
        setItems(mapped);
      })
      .catch(() => setItems([]));
    return () => c.abort();
  }, []);

  if (!items || items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <section id="examples" className="section" aria-labelledby="examples-title">
      <div className="container-fluid">
        <div className={styles.blockHead}>
          <h2 id="examples-title" className="section-title">Loved by makers</h2>
          <p className="section-subtitle">
            From bio links to full websites — freelancers, creators, startups, and small businesses
            use myeasypage to launch polished online profiles in minutes.
          </p>
        </div>

        <div className={styles.userCarousel} aria-label="User site examples">
          <motion.div
            className={styles.userTrack}
            animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
            transition={reduceMotion ? undefined : { ease: "linear", duration: 24, repeat: Infinity }}
          >
            {loop.map((u, i) => {
              const href = publicUrl({ subdomain: u.username });
              const bg = u.bannerImage || u.avatar || "";
              return (
                <Link
                  key={`${u.username}-${i}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.userCard} ${styles.userCardFull}`}
                  aria-label={`Open ${u.fullName} site`}
                >
                  {bg ? (
                    <Image
                      src={bg}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 260px, 320px"
                      className={styles.userBgImg}
                      priority={i < 4}
                    />
                  ) : (
                    <div className={styles.userBgFallback} aria-hidden="true" />
                  )}
                  <div className={styles.userOverlay} aria-hidden="true" />
                  <div className={styles.userBottom}>
                    <div className={styles.userName}>{u.fullName}</div>
                    <div className={styles.userSub}>
                      <span className={styles.userSubText}>{smallLine({ title: u.title, subdomain: u.username })}</span>
                      <span className={styles.userPill}>{pillText(u.layoutType)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
