'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/superadmin.module.css';

const navLinks = [
  { href: '/superadmin', label: 'Dashboard' },
  { href: '/superadmin/users', label: 'Users' },
  { href: '/superadmin/plans', label: 'Plans' },
  { href: '/superadmin/payments', label: 'Payments' },
  { href: '/superadmin/reports', label: 'Reports' },
  { href: '/superadmin/settings', label: 'Settings' },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.logo}>OnePage Admin</h1>
      <nav className={styles.nav}>
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
