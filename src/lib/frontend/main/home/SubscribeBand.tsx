"use client";
import styles from '@/styles/main.module.css';

export default function SubscribeBand() {
    return (
        <section className={styles.subscribeBand} aria-labelledby="subscribe-title">
            <div className="container">
                <div className={styles.subscribeInner}>
                    <div>
                        <span className={styles.subscribeKicker}>Newsletter</span>
                        <h3 id="subscribe-title" className={styles.subscribeTitle}>
                            Get updates, tips &amp; launch perks
                        </h3>
                    </div>

                    <form
                        className={styles.subscribeForm}
                        onSubmit={(e) => e.preventDefault()}
                        aria-label="Subscribe to our newsletter"
                    >
                        <div className={styles.subscribePill}>
                            <label htmlFor="subscribe-email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="subscribe-email"
                                className={styles.subscribeInput}
                                type="email"
                                placeholder="you@example.com"
                                required
                                aria-label="Your email address"
                            />
                            <button
                                className={styles.subscribeBtn}
                                type="submit"
                                aria-label="Subscribe to myeasypage newsletter"
                            >
                                Subscribe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
