import SeoSchemas from "@/lib/frontend/common/SeoSchemas";
import styles from "@/styles/main.module.css";

export default function TermsPage() {
  const plans = [
    { name: "Free", priceValue: 0, price: "₹0" },
    { name: "Pro", priceValue: 199, price: "₹199/year" },
    { name: "Premium", priceValue: 499, price: "₹499/year" },
  ];

  return (
    <main id="main">
      <SeoSchemas page="terms" plans={plans} />

      <section className={`section ${styles.legalSection}`} aria-labelledby="terms-title">
        <div className="container">
          <div className={styles.blockHead}>
            <h1 id="terms-title" className="section-title">Terms of Service</h1>
            <p className="section-subtitle max-w-3xl mx-auto">
              Please read these terms carefully before using myeasypage.
              By accessing or using our services, you agree to these terms.
            </p>
          </div>

          <div className={styles.legalWrap}>
            <article className={styles.legalCard}>
              <div className={styles.legalProse}>
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By creating an account or using myeasypage, you agree to comply
                  with these Terms of Service and all applicable laws.
                </p>

                <h2>2. Service Description</h2>
                <p>
                  myeasypage allows users to build websites, blogs and bio links on
                  a subdomain or custom domain. Features may vary based on your plan.
                </p>

                <h2>3. User Responsibilities</h2>
                <ul>
                  <li>Provide accurate information during sign-up.</li>
                  <li>Do not use myeasypage for unlawful or harmful purposes.</li>
                  <li>You are responsible for all content published on your page.</li>
                </ul>

                <h2>4. Payment & Plans</h2>
                <p>
                  Free and paid plans are available. Upgrades are billed annually in INR.
                  Refunds are subject to our refund policy.
                </p>

                <h2>5. Termination</h2>
                <p>
                  We reserve the right to suspend or terminate accounts violating our policies.
                </p>

                <h2>6. Changes</h2>
                <p>
                  These terms may be updated from time to time. Continued use of myeasypage
                  means you accept the revised terms.
                </p>
              </div>
            </article>

            <p className={styles.legalMeta}>Last updated: August 2025</p>
          </div>
        </div>
      </section>
    </main>
  );
}
