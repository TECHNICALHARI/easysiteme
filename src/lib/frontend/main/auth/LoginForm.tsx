'use client';

import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import styles from '@/styles/main.module.css';
import OtpInput from 'react-otp-input';
import Link from 'next/link';

type FormShape = {
  email: string;
  mobile: string;
  password: string;
  otp: string;
  showPass: boolean;
  useOtp: boolean;
  loginWith: 'email' | 'mobile';
};

export default function LoginForm({
  formData,
  setFormData,
  onSubmit,
  onSendOtp,
  loading,
  otpSent,
}: {
  formData: FormShape;
  setFormData: (data: FormShape | ((p: FormShape) => FormShape)) => void;
  onSubmit: () => void;
  onSendOtp: () => void;
  loading: boolean;
  otpSent: boolean;
}) {
  const { loginWith, useOtp, showPass } = formData;

  return (
    <div className={styles.authBox} role="form" aria-describedby="login-sub">
      <h1 id="login-title" className={styles.authTitle}>Sign in to myeasypage</h1>
      <p id="login-sub" className={styles.authSubtitle}>Access your dashboard to manage your website, blog and bio link</p>

      <div className="text-sm text-center mb-4">
        {loginWith === 'email' ? (
          <>
            Prefer mobile?{' '}
            <button
              type="button"
              className="text-brand font-semibold cursor-pointer"
              onClick={() => setFormData({ ...formData, loginWith: 'mobile' })}
            >
              Use mobile
            </button>
          </>
        ) : (
          <>
            Prefer email?{' '}
            <button
              type="button"
              className="text-brand font-semibold cursor-pointer"
              onClick={() => setFormData({ ...formData, loginWith: 'email' })}
            >
              Use email
            </button>
          </>
        )}
      </div>

      <div className="inputGroup">
        {loginWith === 'email' ? (
          <Mail className="input-icon" size={18} aria-hidden />
        ) : (
          <Phone className="input-icon" size={18} aria-hidden />
        )}
        <input
          id="login-identifier"
          className="input"
          autoComplete={loginWith === 'email' ? 'email' : 'tel'}
          placeholder={loginWith === 'email' ? 'Email address' : 'Mobile number'}
          value={formData[loginWith]}
          onChange={(e) => setFormData({ ...formData, [loginWith]: e.target.value })}
          aria-label={loginWith === 'email' ? 'Email address' : 'Mobile number'}
        />
      </div>

      {useOtp ? (
        <div>
          <label htmlFor="otp" className="block text-sm text-gray-600 mb-2">
            Enter the OTP sent to your {formData.loginWith}
          </label>
          <OtpInput
            value={String(formData.otp || '')}
            onChange={(val) => setFormData({ ...formData, otp: val })}
            numInputs={6}
            inputType="tel"
            containerStyle={{ gap: '0.5rem' }}
            renderInput={(props) => (
              <input
                {...props}
                name="otp"
                inputMode="numeric"
                className="input otpInput"
                aria-label="One-time password"
              />
            )}
          />
        </div>
      ) : (
        <div className="inputGroup">
          {showPass ? (
            <EyeOff
              className="input-icon cursor-pointer"
              size={18}
              onClick={() => setFormData({ ...formData, showPass: false })}
              aria-label="Hide password"
              role="button"
            />
          ) : (
            <Eye
              className="input-icon cursor-pointer"
              size={18}
              onClick={() => setFormData({ ...formData, showPass: true })}
              aria-label="Show password"
              role="button"
            />
          )}
          <input
            id="login-password"
            type={showPass ? 'text' : 'password'}
            className="input"
            placeholder="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            aria-label="Password"
          />
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        className="btn-primary w-full mt-3"
        disabled={loading}
        aria-busy={loading}
      >
        {useOtp ? 'Verify & Sign in' : 'Sign in'}
      </button>

      {!useOtp && (
        <p className={`text-center text-sm mt-4 ${styles.OrText}`}>
          OR{' '}
          <button
            type="button"
            className="text-brand font-medium cursor-pointer"
            onClick={onSendOtp}
            disabled={otpSent}
          >
            Sign in with OTP
          </button>
        </p>
      )}

      <p className={styles.authBottomText}>
        New to myeasypage?{' '}
        <Link href="/signup" className="text-brand font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}
