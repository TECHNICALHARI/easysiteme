'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setBusy(true);
    try {
      // Plug your API route here
      await new Promise((r) => setTimeout(r, 500));
      alert('Thanks! We’ll get back to you shortly.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container flex items-center justify-center">
        <motion.div
          className={styles.contactCard}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className={styles.contactTitle}>Let’s talk</h2>
          <p className={styles.contactSubtitle}>
            Have questions about websites, blogs or bio links on myeasypage?
            Send a message and we’ll help you get started.
          </p>

          <form onSubmit={handleSubmit} className={styles.contactForm}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className="input"
              required
              aria-label="Your name"
            />

            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              className="input"
              required
              aria-label="Your email"
            />

            <textarea
              name="message"
              placeholder="How can we help?"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="input"
              required
              aria-label="Your message"
            />

            <button type="submit" className="btn-primary mt-2" disabled={busy} aria-busy={busy}>
              {busy ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
