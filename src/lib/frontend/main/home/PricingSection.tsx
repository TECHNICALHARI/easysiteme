'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';
import PlanCard from '@/lib/frontend/main/home/PlanCard';
import { PlanData } from '../../utils/data/plans';

export default function PricingSection() {
  return (
    <section id="plans" className="section" aria-labelledby="pricing-title">
      <div className="container">
        <div className={styles.blockHead}>
          <h2 id="pricing-title" className="section-title">
            Plans made for everyone
          </h2>
          <p className="section-subtitle">
            Upgrade anytime for custom domains, premium layouts and pro features — all at simple, flat prices.
          </p>
        </div>

        <ul className={styles.planGrid} role="list" aria-label="Pricing plans">
          {PlanData.map((plan, i) => (
            <motion.li
              key={plan.id || plan.name}
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
