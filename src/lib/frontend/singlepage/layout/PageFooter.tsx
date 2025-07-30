import styles from '@/styles/preview.module.css';

const PageFooter = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p>&copy; {new Date().getFullYear()} OnePage. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default PageFooter;
