"use client";

import styles from "@/styles/preview.module.css";
import type { FormData } from "@/lib/frontend/types/form";

export default function PageFooter({ form }: { form: FormData }) {
  const showBranding = !(form?.design?.brandingOff ?? false);

  const fullName = form?.profile?.fullName?.trim() || "Your Name";
  const currentYear = new Date().getFullYear();

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
    </footer>
  );
}
