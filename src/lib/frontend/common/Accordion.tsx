'use client';

import { useState } from 'react';
import styles from '@/styles/accordion.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.accordion}>
      <button
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-expanded={isOpen}
      >
        <span className={styles.accordionTitle}>{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && <div className={styles.accordionBody}>{children}</div>}
    </div>
  );
}
