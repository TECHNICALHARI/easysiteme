"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import styles from "@/styles/preview.module.css";
import type { FormData } from "@/lib/frontend/types/form";

export default function PageFooter({ form }: { form: FormData }) {
  const showBranding = !(form?.design?.brandingOff ?? false);
  const fullName = form?.profile?.fullName?.trim() || "Your Name";
  const currentYear = new Date().getFullYear();

  const [showScrollTop, setShowScrollTop] = useState(false);

  const hasHeaderOrFooterSections =
    (form?.profile?.featured?.length ?? 0) > 0 ||
    (form?.profile?.services?.length ?? 0) > 0 ||
    (form?.posts?.posts?.length ?? 0) > 0 ||
    (form?.profile?.faqs?.length ?? 0) > 0 ||
    (form?.profile?.testimonials?.length ?? 0) > 0;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {showBranding ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            Made with{" "}
            <a
              href="https://myeasypage.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] font-semibold hover:underline transition-all duration-150"
            >
              myeasypage
            </a>
          </p>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            © {currentYear} {fullName}
          </p>
        )}
      </div>

      {(showScrollTop && hasHeaderOrFooterSections) && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-2 md:right-6 p-2 rounded-full shadow-lg bg-[var(--color-bg)] text-[var(--color-text)] transition-all cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}
