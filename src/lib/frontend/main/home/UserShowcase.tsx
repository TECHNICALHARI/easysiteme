'use client';

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
        const mapped = (rows || []).map((r) => ({
          username: r.subdomain,
          fullName: r.fullName || "",
          title: (r.headline as string) || "",
          avatar: r.avatar || "",
          bannerImage: r.bannerImage || "",
          layoutType: (r.layoutType as LayoutType) || "bio",
        })) as FeaturedUser[];

        const seen = new Set<string>();
        const deduped: FeaturedUser[] = [];
        for (const m of mapped) {
          const key = (m.username || "").toLowerCase();
          if (!key) continue;
          if (seen.has(key)) continue;
          seen.add(key);
          deduped.push(m);
        }
        setItems(deduped);
      })
      .catch(() => setItems([]));
    return () => c.abort();
  }, []);

  const shouldScroll = useMemo(() => {
    if (!items) return false;
    return items.length > 4 && !reduceMotion;
  }, [items, reduceMotion]);

  const displayItems = useMemo(() => {
    if (!items) return [];
    return shouldScroll ? [...items, ...items] : items;
  }, [items, shouldScroll]);

  if (!items || items.length === 0) return null;

  return (
    <section id="examples" className={`section ${styles.userShowcaseSection}`}>
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
            className={`${styles.userTrack} ${
              !shouldScroll ? styles.centeredTrack : ""
            }`}
            animate={shouldScroll ? { x: ["0%", "-50%"] } : undefined}
            transition={
              shouldScroll
                ? { ease: "linear", duration: 28, repeat: Infinity }
                : undefined
            }
          >
            {displayItems.map((u, i) => {
              const href = publicUrl({ subdomain: u.username });
              const bg = u.bannerImage || u.avatar || "";
              const key = `${u.username}-${i}`;

              return (
                <Link
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.userCardFull}
                  aria-label={`Open ${u.fullName || u.username} site`}
                >
                  {bg ? (
                    <Image
                      src={bg}
                      alt={u.fullName || u.username}
                      fill
                      sizes="(max-width: 600px) 260px, 320px"
                      className={styles.userBgImg}
                      priority={i < 4}
                    />
                  ) : (
                    <div className={styles.userBgFallback} />
                  )}
                  <div className={styles.userOverlay} />
                  <div className={styles.userBottom}>
                    <div className={styles.userLeft}>
                      {u.avatar ? (
                        <div className={styles.userAvatarWrap}>
                          <Image
                            src={u.avatar}
                            alt={u.fullName || u.username}
                            width={52}
                            height={52}
                            className={styles.userAvatar}
                          />
                        </div>
                      ) : (
                        <div className={styles.userAvatarWrap}>
                          <div className={styles.avatarFallback}>
                            {u.fullName?.[0] || u.username?.[0] || "?"}
                          </div>
                        </div>
                      )}
                      <div className={styles.userCardText}>
                        <div className={styles.userName}>
                          {u.fullName || u.username}
                        </div>
                        <div className={styles.userSubtitle}>
                          {smallLine({ title: u.title, subdomain: u.username })}
                        </div>
                      </div>
                    </div>
                    <div className={styles.userPill}>
                      {pillText(u.layoutType)}
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
