'use client';

import styles from '@/styles/main.module.css';

type Plan = {
  name: string;
  price: string;
  features: string[];
};

export default function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className={styles.planCard}>
      <div className={styles.planBadge}>{plan.name}</div>
      <div className={styles.planPrice}>{plan.price}</div>

      <ul className={styles.planList}>
        {plan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <div className={styles.planBtnWrapper}>
        <a href="/create" className="btn-primary">
          Choose {plan.name}
        </a>
      </div>
    </div>
  );
}
