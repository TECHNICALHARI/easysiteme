// app/privacy/page.tsx

import SeoSchemas from "@/lib/frontend/common/SeoSchemas";
import styles from "@/styles/main.module.css";

export default function PrivacyPage() {
  const plans = [
    { name: "Free", priceValue: 0, price: "₹0" },
    { name: "Pro", priceValue: 199, price: "₹199/year" },
    { name: "Premium", priceValue: 499, price: "₹499/year" },
  ];

  return (
    <main id="main">
      <SeoSchemas page="privacy" plans={plans} />

      <section className={`section ${styles.legalSection}`} aria-labelledby="privacy-title">
        <div className="container">
          <div className={styles.blockHead}>
            <h1 id="privacy-title" className="section-title">
              Privacy Policy
            </h1>
            <p className="section-subtitle max-w-3xl mx-auto">
              We value your privacy. This policy explains how myeasypage
              collects, uses, and protects your information.
            </p>
          </div>

          <div className={styles.legalWrap}>
            <article className={styles.legalCard}>
              <div className={styles.legalProse}>
                <h2>1. Information We Collect</h2>
                <p>
                  We collect minimal information required to provide the service,
                  such as email address and usage data. We do not sell personal data.
                </p>

                <h2>2. How We Use Data</h2>
                <ul>
                  <li>To provide and improve our service.</li>
                  <li>To send account-related updates and support responses.</li>
                  <li>For security and fraud-prevention purposes.</li>
                </ul>

                <h2>3. Cookies & Analytics</h2>
                <p>
                  We use cookies and privacy-friendly analytics to understand usage.
                  No personal tracking is done for advertising.
                </p>

                <h2>4. Third-Party Services</h2>
                <p>
                  We may integrate with services like payment processors or embeds
                  (YouTube, Calendly, etc.). Their privacy policies apply.
                </p>

                <h2>5. Data Security</h2>
                <p>
                  All data is encrypted in transit and at rest. Accounts are
                  protected with secure login.
                </p>

                <h2>6. Your Rights</h2>
                <p>
                  You can request deletion of your account and data at any time by
                  contacting support.
                </p>

                <h2>7. Updates</h2>
                <p>
                  This Privacy Policy may change. Continued use means acceptance of
                  updates.
                </p>
              </div>
            </article>

            <p className={styles.legalMeta}>
              Last updated: August 2025
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
