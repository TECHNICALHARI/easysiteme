"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, X, Share2, Mail } from "lucide-react";
import styles from "@/styles/preview.module.css";
import ThemeTogglePreview from "./ThemeTogglePreview";
import type { FormData } from "@/lib/frontend/types/form";
import ShareModal from "../components/ShareModal";
import Logo from "@/lib/frontend/common/Logo";

function useProfileUrl(subdomain?: string, customDomain?: string) {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://myeasypage.app";
  if (customDomain) return `https://${customDomain}`;
  if (subdomain) return `${origin.replace(/\/$/, "")}/${subdomain}`;
  return origin;
}

interface HeaderProps {
  showNav: boolean;
  sections: {
    featured?: boolean;
    posts?: boolean;
    services?: boolean;
    faqs?: boolean;
    testimonials?: boolean;
  };
  form: FormData;
  showLogo?: boolean;
}

export default function PageHeader({
  showNav,
  sections,
  form,
  showLogo = false,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const url = useProfileUrl(form?.settings?.subdomain, form?.settings?.customDomain);
  const canSubscribe = !(form?.subscriberSettings?.subscriberSettings?.hideSubscribeButton ?? false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://myeasypage.app";
    return window.location.href;
  }, []);

  const handleShare = useCallback(async () => {
    try {
      const navAny = typeof navigator !== "undefined" ? (navigator as any) : undefined;
      if (navAny?.share) {
        await navAny.share({ title: "Check my profile", url: pageUrl });
        return; 
      }
    } catch (err: any) {
      const name = err?.name || "";
      if (name !== "AbortError") {
        setOpenShare(true);
        return;
      }
      return;
    }

    setOpenShare(true);
  }, [pageUrl]);

  const scrollToSubscribe = useCallback(() => {
    const el = document.getElementById("subscribe");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setMenuOpen(false);
  }, []);

  if (!showNav) return null;

  const navLinks = [
    sections.featured && { label: "Featured", href: "#featured" },
    sections.posts && { label: "Posts", href: "#posts" },
    sections.services && { label: "Services", href: "#services" },
    sections.testimonials && { label: "Testimonials", href: "#testimonials" },
    sections.faqs && { label: "FAQ", href: "#faq" },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logoLink} aria-label="myeasypage home">
            {showLogo ? <Logo /> : null}
          </Link>

          <nav className={`${styles.nav} hidden md:flex`} aria-label="Primary">
            <ul className={styles.navList}>
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.navActions}>
              {canSubscribe && (
                <button className={styles.navPrimary} onClick={scrollToSubscribe}>
                  <span className="inline-flex items-center gap-2">
                    <Mail size={16} />
                    Subscribe
                  </span>
                </button>
              )}

              <button className={styles.navGhost} onClick={handleShare}>
                <span className="inline-flex items-center gap-2">
                  <Share2 size={16} />
                  Share
                </span>
              </button>

              <ThemeTogglePreview />
            </div>
          </nav>

          <button
            className={`md:hidden ${styles.menuBtn} cursor-pointer`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((s) => !s)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div
          className={`${styles.mobileScrim} ${menuOpen ? styles.showScrim : ""}`}
          onClick={() => setMenuOpen(false)}
        />

        <div
          className={`${styles.mobileDropdown} ${menuOpen ? styles.mobileOpen : ""}`}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className={styles.mobileHeader}>
            <Link href="/" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
              {showLogo ? <Logo /> : null}
            </Link>
            <button
              aria-label="Close menu"
              className={styles.menuBtn}
              onClick={() => setMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <ul className={styles.mobileList}>
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.mobileActions}>
            {canSubscribe && (
              <button className={styles.navPrimary} onClick={scrollToSubscribe}>
                <span className="inline-flex items-center gap-2">
                  <Mail size={16} />
                  Subscribe
                </span>
              </button>
            )}
            <button className={styles.navGhost} onClick={handleShare}>
              <span className="inline-flex items-center gap-2">
                <Share2 size={16} />
                Share
              </span>
            </button>
            <ThemeTogglePreview />
          </div>
        </div>
      </header>

      <ShareModal open={openShare} onClose={() => setOpenShare(false)} url={url || pageUrl} />
    </>
  );
}
