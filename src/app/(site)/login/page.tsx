'use client';

import { useState } from 'react';
import styles from '@/styles/main.module.css';
import LoginForm from '@/lib/frontend/main/auth/LoginForm';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    otp: '',
    showPass: false,
    useOtp: false,
    loginWith: 'email' as 'email' | 'mobile',
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async () => {
    const { email, mobile, password, otp, useOtp, loginWith } = formData;
    const identifier = loginWith === 'email' ? email.trim() : mobile.trim();

    if (!identifier) return alert(`Please enter your ${loginWith}.`);
    if (!useOtp && !password.trim()) return alert('Please enter password.');
    if (useOtp && !otp.trim()) return alert('Please enter OTP.');

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [loginWith]: identifier,
          ...(useOtp ? { otp } : { password }),
        }),
      });

      const result = await res.json();
      if (result?.success) {
        alert('Login successful!');
        // window.location.href = '/admin';
      } else {
        alert(result?.message || 'Login failed');
      }
    } catch (e) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const idVal = formData.loginWith === 'email' ? formData.email.trim() : formData.mobile.trim();
    if (!idVal) return alert(`Enter your ${formData.loginWith} first.`);
    setFormData((p) => ({ ...p, useOtp: true }));
    setOtpSent(true);
  };

  return (
    <main className={`${styles.authPage} section`} aria-labelledby="login-title">
      <div className="container flex justify-center items-center">
        <LoginForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleLogin}
          onSendOtp={handleSendOtp}
          loading={loading}
          otpSent={otpSent}
        />
      </div>
    </main>
  );
}
