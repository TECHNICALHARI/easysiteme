'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/main.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="section flex items-center justify-center min-h-screen bg-muted">
      <motion.div
        className={styles.contactCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.contactTitle}>Let's Talk</h2>
        <p className={styles.contactSubtitle}>
          We’d love to hear from you. Reach out with questions, feedback, or ideas.
        </p>

        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="input"
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="input"
            required
          />

          <button type="submit" className="btn-primary mt-4 w-full">
            Send Message
          </button>
        </form>
      </motion.div>
    </section>
  );
}
