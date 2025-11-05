"use client"
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, Globe, Palette } from 'lucide-react';
import styles from '@/styles/main.module.css';

export default function Hero() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const safe = useMemo(
    () => (username || '').replace(/[^a-z0-9-]/gi, '').toLowerCase(),
    [username]
  );

  const create = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    const q = safe ? `?u=${encodeURIComponent(safe)}` : '';
    router.push(`/signup${q}`);
  };

  const vh: React.CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroBackdrop} />
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.left}>
            <motion.h1
              id="hero-title"
              className={styles.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              Build your <span className={styles.gradientText}>website, blog &amp; bio</span> in minutes.
            </motion.h1>

            <motion.p
              className={styles.subHeading}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Launch on your own subdomain — publish instantly.
            </motion.p>

            <motion.form
              onSubmit={create}
              className={styles.domainForm}
              aria-labelledby="hero-title"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.groupCompact}>
                <div className={styles.composeWrap}>
                  <label htmlFor="username" style={vh}>
                    Choose a username
                  </label>

                  <div className={styles.composedValue} aria-hidden="true">
                    <span className={styles.userText}>{safe || 'username'}</span>
                    <span className={styles.dot}>.</span>
                    <span className={styles.hostText}>myeasypage.com</span>
                  </div>

                  <input
                    ref={inputRef}
                    id="username"
                    name="username"
                    className={styles.composeInput}
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="Pick a username"
                    aria-label="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.primaryBtnGroup} aria-label="Create your page">
                  Create
                </button>
              </div>
            </motion.form>

            <motion.div
              className={styles.benefitsStrip}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <span className={styles.benefit}>
                <Rocket size={16} className={styles.benefitIcon} />
                No code required
              </span>
              <span className={styles.benefit}>
                <Globe size={16} className={styles.benefitIcon} />
                Free subdomain
              </span>
              <span className={styles.benefit}>
                <Palette size={16} className={styles.benefitIcon} />
                Switch layouts anytime
              </span>
            </motion.div>
          </div>

          <motion.div
            className={styles.right}
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            aria-hidden="true"
          >
            <div className={styles.visualWrap}>
              <div className={styles.blob} />
              <div className={styles.cardBack} />
              <div className={styles.cardMain}>
                <div className={styles.cardHeader} />
                <div className={styles.cardLineWide} />
                <div className={styles.cardLine} />
                <div className={styles.cardButtons}>
                  <i />
                  <i />
                </div>
                <div className={styles.dropShadow} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
