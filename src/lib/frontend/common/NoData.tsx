'use client';

import React from 'react';
import { FileQuestion } from 'lucide-react';
import styles from '@/styles/common.module.css';
import GoBackButton from './GoBackButton';

interface NoDataProps {
  title?: string;
  description?: string;
  iconSize?: number;
  showGoBackButton?: boolean;
}

const NoData: React.FC<NoDataProps> = ({
  title = 'No Data Found',
  description = 'We couldn’t find any matching content.',
  iconSize = 48,
  showGoBackButton = false,
}) => {
  return (
    <div className={styles.noDataWrapper}>
      <div className={styles.noDataIcon}>
        <FileQuestion size={iconSize} />
      </div>
      <h2 className={styles.noDataTitle}>{title}</h2>
      <p className={styles.noDataSubtitle}>{description}</p>

      {showGoBackButton && <GoBackButton className='mt-2' />}
    </div>
  );
};

export default NoData;
