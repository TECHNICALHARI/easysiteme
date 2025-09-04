'use client';

import { useState } from 'react';
import styles from '@/styles/main.module.css';
import SignupForm from '@/lib/frontend/main/auth/SignupForm';
import { useToast } from '@/lib/frontend/common/ToastProvider';

export default function SignupPage() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<AuthSignupData>({
    subdomain: '',
    email: '',
    mobile: '',
    password: '',
    showPass: false,
    emailVerified: false,
    mobileVerified: false,
    emailOtp: '',
    mobileOtp: '',
  });

  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);

  const checkSubdomain = async (name: string) => {
    if (!name) return setSubdomainAvailable(null);
    setCheckingSubdomain(true);
    try {
      // 🔗 Replace with your real API
      // const res = await fetch(`/api/check-subdomain?subdomain=${encodeURIComponent(name)}`);
      // const data = await res.json();
      // setSubdomainAvailable(data.available);

      setSubdomainAvailable(true); // demo
    } catch {
      setSubdomainAvailable(null);
    } finally {
      setCheckingSubdomain(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Signup successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      } else {
        showToast(data.message || 'Signup failed', 'error');
      }
    } catch {
      showToast('Something went wrong. Try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${styles.authPage} section`}>
      <div className="container flex justify-center items-center">
        <SignupForm
          formData={formData}
          setFormData={setFormData}
          checking={checkingSubdomain}
          subdomainAvailable={subdomainAvailable}
          checkSubdomain={checkSubdomain}
          onNext={handleSubmit}
          loading={loading}
        />
      </div>
    </main>
  );
}
