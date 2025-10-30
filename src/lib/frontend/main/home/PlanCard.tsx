'use client';

import styles from '@/styles/main.module.css';
import Link from 'next/link';
import clsx from 'clsx';
import { PlanDataType } from '../../utils/data/plans';

export default function PlanCard({ plan }: { plan: PlanDataType }) {
  return (
    <div className={clsx(styles.planCard, plan.highlight ? styles.planCardHighlight : '')}>
      {plan.tag ? <div className={styles.planTag}>{plan.tag}</div> : null}
      <div className={styles.planBadge}>{plan.name}</div>
      <div className={styles.planPriceRow}>
        <div className={styles.planPrice}>{plan.price}</div>
        {plan.official || plan.offer ? (
          <div className="text-sm text-gray-500 mt-1 mb-2 flex items-center gap-2">
            {plan.official ? <div className="line-through">{plan.official}</div> : null}
            {plan.offer ? <div className="text-indigo-600 font-semibold">{plan.offer}</div> : null}
          </div>
        ) : null}
      </div>

      <ul className={styles.planList}>
        {plan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <div className={styles.planBtnWrapper}>
        <Link href="/signup" className={clsx('btn-primary', styles.planBtn)}>
          {plan.cta ? plan.cta : `Choose ${plan.name}`}
        </Link>
      </div>
    </div>
  );
}
