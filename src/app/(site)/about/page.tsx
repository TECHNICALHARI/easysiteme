// app/about/page.tsx

import SeoSchemas from "@/lib/frontend/common/SeoSchemas";
import styles from "@/styles/main.module.css";
import {
  Sparkles,
  ShieldCheck,
  Rocket,
  Globe2,
  Zap,
  PenLine,
  LayoutTemplate,
} from "lucide-react";

export default function AboutPage() {
  const plans = [
    { name: "Free", priceValue: 0, price: "₹0" },
    { name: "Pro", priceValue: 199, price: "₹199/year" },
    { name: "Premium", priceValue: 499, price: "₹499/year" },
  ];

  const values = [
    {
      title: "Simplicity",
      desc:
        "No-code setup. Start free, upgrade anytime. A clean builder designed for speed and ease.",
      Icon: Sparkles,
    },
    {
      title: "Speed & Trust",
      desc:
        "Edge hosting, sensible defaults and protection-first practices — your site always performs.",
      Icon: ShieldCheck,
    },
    {
      title: "Growth",
      desc:
        "Switch layouts anytime, add blogs, services and more as your brand or project grows.",
      Icon: Rocket,
    },
  ];

  const howWeBuild = [
    { title: "Fast by default", desc: "Optimized assets, caching and edge delivery.", Icon: Zap },
    { title: "Content-first editor", desc: "Write posts, add sections, publish in minutes.", Icon: PenLine },
    { title: "Flexible layouts", desc: "Bio link or full website — change anytime.", Icon: LayoutTemplate },
    { title: "Global footprint", desc: "Reliable delivery across regions as you grow.", Icon: Globe2 },
  ];

  const stats = [
    { k: "Instant", v: "Publishing", Icon: Zap },
    { k: "Global", v: "Delivery", Icon: Globe2 },
    { k: "Simple", v: "Editor", Icon: PenLine },
  ];

  return (
    <main id="main">
      <SeoSchemas page="about" plans={plans} />

      <section className="section bg-muted" aria-labelledby="about-title">
        <div className="container">
          <div className={styles.blockHead}>
            <h1 id="about-title" className="section-title">About myeasypage</h1>
            <p className="section-subtitle max-w-2xl mx-auto">
              myeasypage helps creators, freelancers and small businesses launch fast, professional websites,
              blogs and bio links — without writing a single line of code.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {stats.map(({ k, v, Icon }) => (
              <div key={k} className={styles.trustCard} aria-label={`${k} ${v}`}>
                <div className={styles.trustIconWrapper} aria-hidden="true">
                  <Icon size={20} />
                </div>
                <div className="text-sm uppercase tracking-wider opacity-70">{k}</div>
                <div className="text-base font-bold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="mission-title">
        <div className="container">
          <div className={styles.blockHead}>
            <h2 id="mission-title" className="section-title">Our Mission</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              We believe everyone deserves a polished online presence. Whether you are a freelancer showcasing work,
              a local business reaching customers, or a student building a portfolio — myeasypage gives you the tools
              to get online instantly and grow at your pace.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-muted" aria-labelledby="values-title">
        <div className="container">
          <div className={styles.blockHead}>
            <h2 id="values-title" className="section-title">What we stand for</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Clear principles guide our product decisions so you can build faster with fewer choices to worry about.
            </p>
          </div>

          <ul className={styles.featureGrid} role="list" aria-label="Our values">
            {values.map(({ title, desc, Icon }) => (
              <li key={title} className={styles.featureCard}>
                <div className={styles.featureIconWrapper} aria-hidden="true">
                  <Icon size={24} className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureText}>{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className={styles.blockHead}>
            <h2 id="how-title" className="section-title">How we build</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Opinionated defaults, modern hosting and a content-first editor — so your site loads fast and looks great everywhere.
            </p>
          </div>

          <ul className={styles.featureGrid} role="list" aria-label="How we build">
            {howWeBuild.map(({ title, desc, Icon }) => (
              <li key={title} className={styles.featureCard}>
                <div className={styles.featureIconWrapper} aria-hidden="true">
                  <Icon size={22} className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureText}>{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="cta-about">
        <div className="container text-center relative z-10">
          <h2 id="cta-about" className={styles.ctaTitle}>
            Ready to launch your site?
          </h2>
          <p className={styles.ctaSubtitle}>
            Create a beautiful website, blog or bio link in minutes. Start free on a subdomain
            and upgrade anytime for a custom domain and premium layouts.
          </p>
          <div className={styles.ctaActions}>
            <a href="/create" className="btn-primary">Create your page</a>
            <a href="/#plans" className="btn-white">See pricing</a>
          </div>
          <p className={styles.ctaNote}>
            No credit card required · Instant publishing · Switch layouts anytime
          </p>
        </div>
      </section>
    </main>
  );
}
