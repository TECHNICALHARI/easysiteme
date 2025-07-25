'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from '@/styles/common.module.css';

interface GoBackButtonProps {
  label?: string;
  className?: string;
}

export default function GoBackButton({
  label = 'Go Back',
  className = '',
}: GoBackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`${styles.goBackButton} ${className}`}
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </button>
  );
}
