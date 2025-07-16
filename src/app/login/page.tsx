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
    loginWith: 'email',
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async () => {
    const { email, mobile, password, otp, useOtp, loginWith } = formData;
    const identifier = loginWith === 'email' ? email : mobile;

    if (!identifier) return alert(`Please enter your ${loginWith}`);
    if (!useOtp && !password) return alert('Please enter password');
    if (useOtp && !otp) return alert('Please enter OTP');

    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [loginWith]: identifier,
        ...(useOtp ? { otp } : { password }),
      }),
    });

    const result = await res.json();
    if (result.success) {
      alert('Login successful!');
      // window.location.href = '/dashboard';
    } else {
      alert(result.message || 'Login failed');
    }

    setLoading(false);
  };

  const handleSendOtp = () => {
    setFormData({ ...formData, useOtp: true });
    setOtpSent(true);
  };

  return (
    <main className={`${styles.authPage} section`}>
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
