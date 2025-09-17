import styles from '@/styles/preview.module.css';
import type { FormData } from '@/lib/frontend/types/form';

const PageFooter = ({ form }: { form: FormData }) => {
    
  const showBranding = form.plan === 'free' || !form.design?.brandingOff;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {showBranding ? (
          <p>
            Made with <a href="https://myeasypage.site" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] font-semibold">myeasypage</a>
          </p>
        ) : (
          <p>&copy; {new Date().getFullYear()} {form.profile?.fullName || 'Your Name'}</p>
        )}
      </div>
    </footer>
  );
};

export default PageFooter;
