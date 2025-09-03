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
    otpSent: false,
    loginWith: 'email' as 'email' | 'mobile',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; mobile?: string; password?: string; otp?: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrors({});
    setSuccess(null);

    const { email, mobile, password, otp, useOtp, otpSent, loginWith } = formData;
    const identifier = loginWith === 'email' ? email.trim() : mobile.trim();
    const newErrors: typeof errors = {};

    if (!identifier) {
      newErrors[loginWith] = `Please enter your ${loginWith}.`;
    }
    if (!useOtp && !otpSent && !password.trim()) {
      newErrors.password = 'Please enter password.';
    }
    if ((useOtp || otpSent) && !otp.trim()) {
      newErrors.otp = 'Please enter OTP.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [loginWith]: identifier,
          ...(useOtp || otpSent ? { otp } : { password }),
        }),
      });

      const result = await res.json();
      if (result?.success) {
        setSuccess('Login successful! Redirecting...');
        setFormData({
          email: '',
          mobile: '',
          password: '',
          otp: '',
          showPass: false,
          useOtp: false,
          otpSent: false,
          loginWith: 'email',
        });
      } else {
        setErrors({ [loginWith]: result?.message || 'Login failed' });
      }
    } catch {
      setErrors({ [loginWith]: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setErrors({});
    setSuccess(null);

    const identifier = formData.loginWith === 'email' ? formData.email.trim() : formData.mobile.trim();
    if (!identifier) {
      setErrors({ [formData.loginWith]: `Enter your ${formData.loginWith} first.` });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [formData.loginWith]: identifier }),
      });

      const result = await res.json();
      if (result?.success) {
        setSuccess('OTP sent successfully.');
        setFormData((p) => ({ ...p, useOtp: true, otpSent: true }));
      } else {
        setErrors({ [formData.loginWith]: result?.message || 'Failed to send OTP.' });
      }
    } catch {
      setErrors({ [formData.loginWith]: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${styles.authPage} section`} aria-labelledby="login-title">
      <div className="container flex justify-center items-center">
        <div className="w-full max-w-md">
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          <LoginForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleLogin}
            onSendOtp={handleSendOtp}
            loading={loading}
            errors={errors}
          />
        </div>
      </div>
    </main>
  );
}
