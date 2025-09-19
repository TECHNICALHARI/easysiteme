'use client';

import { useState } from 'react';
import styles from '@/styles/main.module.css';
import LoginForm from '@/lib/frontend/main/auth/LoginForm';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import { formatPhoneToE164 } from '@/lib/frontend/utils/common';
import { loginApi, sendOtpApi } from '@/lib/frontend/api/services';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    mobile: '',
    countryCode: '+91',
    password: '',
    otp: '',
    showPass: false,
    useOtp: false,
    otpSent: false,
    loginWith: 'email',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; mobile?: string; password?: string; otp?: string }>({});
  const router = useRouter();

  const handleLogin = async () => {
    setErrors({});
    const { email, mobile, password, otp, useOtp, otpSent, loginWith, countryCode } = formData;
    const identifierRaw = loginWith === 'email' ? email.trim() : mobile.trim();
    const newErrors: typeof errors = {};

    if (!identifierRaw) newErrors[loginWith] = `Please enter your ${loginWith}.`;
    if (!useOtp && !otpSent && !password.trim()) newErrors.password = 'Please enter password.';
    if ((useOtp || otpSent) && !otp.trim()) newErrors.otp = 'Please enter OTP.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload: any = {};
      if (loginWith === 'email') payload.email = identifierRaw;
      else {
        const mobileE164 = formatPhoneToE164(mobile);
        payload.mobile = mobileE164;
        payload.countryCode = countryCode;
      }

      if (useOtp || otpSent) payload.otp = otp;
      else payload.password = password;

      const result = await loginApi(payload);
      if (result?.success) {
        showToast('Login successful! Redirecting...', 'success');

        const roles: string[] = (result?.data?.user?.roles as string[]) || [];

        const destination = roles.includes('admin') ? '/admin' : '/superadmin';

        setTimeout(() => {
          router.push(destination);
        }, 500);
      } else {
        showToast(result?.message || 'Login failed', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setErrors({});
    const identifierRaw = formData.loginWith === 'email' ? formData.email.trim() : formData.mobile.trim();
    if (!identifierRaw) {
      setErrors({ [formData.loginWith]: `Enter your ${formData.loginWith} first.` });
      return;
    }

    setLoading(true);
    try {
      const payload: any = {};
      if (formData.loginWith === 'email') {
        payload.target = identifierRaw;
        payload.purpose = 'signup_email';
      } else {
        payload.target = formatPhoneToE164(formData.mobile);
        payload.purpose = 'signup_phone';
      }

      const json = await sendOtpApi(payload);
      if (json?.success) {
        showToast('OTP sent successfully.', 'success');
        setFormData((p) => ({ ...p, useOtp: true, otpSent: true }));
      } else {
        showToast(json?.message || 'Failed to send OTP.', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
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
