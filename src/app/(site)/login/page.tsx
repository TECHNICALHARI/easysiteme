'use client';

import { useState } from 'react';
import styles from '@/styles/main.module.css';
import LoginForm from '@/lib/frontend/main/auth/LoginForm';
import { useToast } from '@/lib/frontend/common/ToastProvider';

export default function LoginPage() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<AuthFormData>({
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

  const handleLogin = async () => {
    setErrors({});
    const { email, mobile, password, otp, useOtp, otpSent, loginWith } = formData;
    const identifier = loginWith === 'email' ? email.trim() : mobile.trim();
    const newErrors: typeof errors = {};

    if (!identifier) newErrors[loginWith] = `Please enter your ${loginWith}.`;
    if (!useOtp && !otpSent && !password.trim()) newErrors.password = 'Please enter password.';
    if ((useOtp || otpSent) && !otp.trim()) newErrors.otp = 'Please enter OTP.';

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
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      } else {
        showToast(result?.message || 'Login failed', 'error');
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setErrors({});
    const identifier = formData.loginWith === 'email' ? formData.email.trim() : formData.mobile.trim();
    if (!identifier) {
      setErrors({ [formData.loginWith]: `Enter your ${formData.loginWith} first.` });
      return;
    }

    // setLoading(true);
    setFormData((p) => ({ ...p, useOtp: true, otpSent: true })); // remove it later
    // try {
    //   const res = await fetch('/api/send-otp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ [formData.loginWith]: identifier }),
    //   });

    //   const result = await res.json();
    //   if (result?.success) {
    //     showToast('OTP sent successfully.', 'success');
    //     setFormData((p) => ({ ...p, useOtp: true, otpSent: true }));
    //   } else {
    //     showToast(result?.message || 'Failed to send OTP.', 'error');
    //   }
    // } catch {
    //   showToast('Something went wrong. Please try again.', 'error');
    // } finally {
    //   setLoading(false);
    // }
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
          errors={errors}
        />
      </div>
    </main>
  );
}
