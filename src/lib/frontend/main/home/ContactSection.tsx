'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';
import { ContactUsApi } from '@/lib/frontend/api/services';
import { useToast } from '../../common/ToastProvider';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setBusy(true);
    try {
      const res = await ContactUsApi(form);
      if (res?.success) {
        showToast(res?.message || 'Message received successfully', 'success');
        setForm({ name: '', email: '', message: '' });
      } else {
        showToast(res?.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container flex items-center justify-center">
        <motion.div
          className={styles.contactCard}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 id="contact-title" className={styles.contactTitle}>
            Let’s talk
          </h2>
          <p className={styles.contactSubtitle}>
            Have questions about websites, blogs or bio links on myeasypage?
            Send a message and we’ll help you get started.
          </p>

          <form onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className="sr-only">Your name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className="input"
                required
                aria-label="Your name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className="sr-only">Your email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                className="input"
                required
                aria-label="Your email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className="sr-only">Your message</label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we help?"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="input"
                required
                aria-label="Your message"
              />
            </div>

            <button
              type="submit"
              className="btn-primary mt-2"
              disabled={busy}
              aria-busy={busy}
            >
              {busy ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
