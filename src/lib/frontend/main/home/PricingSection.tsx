'use client';

import { motion } from 'framer-motion';
import PlanCard from '@/lib/frontend/main/home/PlanCard';
import styles from '@/styles/main.module.css';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    features: [
      'Full Name',
      'Username',
      'Page Title',
      'Bio (Plain Text)',
      '2 Custom Links',
      'Fixed Theme',
      'Branding Visible',
    ],
  },
  {
    name: 'Pro',
    price: '₹199/year',
    features: [
      'All Free Features',
      'About Section (Rich Text)',
      'Profile Image',
      'WhatsApp Number',
      'Portfolio Link',
      '5 Custom Links',
      'Custom Colors',
      'Remove Branding',
    ],
  },
  {
    name: 'Premium',
    price: '₹499/year',
    features: [
      'All Pro Features',
      '10 Custom Links',
      'Testimonials',
      'FAQ Section',
      'Gallery Upload',
      'Contact Form',
      'YouTube Embed',
      'Google Map',
      'Custom Sections',
      'Custom Colors',
      'Remove Branding',
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="plans" className="section">
      <div className="container text-center">
        <h2 className="section-title">Choose Your Plan</h2>
        <p className="section-subtitle">
          Start for free, upgrade anytime to unlock advanced tools.
        </p>

        <div className={styles.planGrid}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={styles.planWrapper}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <PlanCard plan={plan} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
