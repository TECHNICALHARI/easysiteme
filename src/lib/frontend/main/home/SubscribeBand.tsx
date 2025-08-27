'use client';

import styles from '@/styles/main.module.css';

export default function SubscribeBand() {
    return (
        <section className={styles.subscribeBand} aria-label="Subscribe">
            <div className="container">
                <div className={styles.subscribeInner}>
                    <div>
                        <span className={styles.subscribeKicker}>Newsletter</span>
                        <h3 className={styles.subscribeTitle}>Get updates, tips & launch perks.</h3>
                    </div>
                    <form className={styles.subscribeForm} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.subscribePill}>
                            <input className={styles.subscribeInput} type="email" placeholder="you@example.com" />
                            <button className={styles.subscribeBtn} type="submit">Subscribe</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

    );
}
