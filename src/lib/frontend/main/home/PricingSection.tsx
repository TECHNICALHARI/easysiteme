"use client";
import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';
import PlanCard from '@/lib/frontend/main/home/PlanCard';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    cta: 'Start Free',
    features: [
      'Website + Bio link',
      'Basic blog (up to 5 posts)',
      '2 links & 1 header',
      'Fixed theme',
      'myeasypage subdomain',
      'Branding visible',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹199/year',
    cta: 'Go Pro',
    features: [
      'Everything in Free',
      'Custom domain',
      'Rich About & Gallery',
      'Contact form & Map',
      'Up to 3 services',
      'Embeds (YouTube, Calendly)',
      'Remove branding',
      'Up to 20 posts',
    ],
    highlight: true,
  },
  {
    name: 'Premium',
    price: '₹499/year',
    cta: 'Upgrade',
    features: [
      'Everything in Pro',
      'Advanced themes',
      'Testimonials & FAQs',
      'Featured media',
      'Up to 10 services',
      'Email subscribe section',
      'Up to 50 posts',
      'Priority support',
    ],
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="plans" className="section" aria-labelledby="pricing-title">
      <div className="container">
        <div className={styles.blockHead}>
          <h2 id="pricing-title" className="section-title">
            Plans made for everyone
          </h2>
          <p className="section-subtitle">
            Start free with a subdomain. Upgrade anytime for custom domains, premium layouts and pro features — all at simple, flat prices.
          </p>
        </div>

        <ul className={styles.planGrid} role="list" aria-label="Pricing plans">
          {plans.map((plan, i) => (
            <motion.li
              key={plan.name}
              className={styles.planWrapper}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              viewport={{ once: true }}
              aria-label={`${plan.name} plan at ${plan.price}`}
            >
              <h3 className="sr-only">{plan.name} Plan</h3>
              <PlanCard plan={plan} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
