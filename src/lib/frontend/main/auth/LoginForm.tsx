'use client';

import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import styles from '@/styles/main.module.css';
import OtpInput from 'react-otp-input';
import Link from 'next/link';
export default function LoginForm({
  formData,
  setFormData,
  onSubmit,
  onSendOtp,
  loading,
  otpSent,
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onSendOtp: () => void;
  loading: boolean;
  otpSent: boolean;
}) {
  const { loginWith, useOtp, showPass } = formData;

  return (
    <div className={styles.authBox}>
      <h2 className={styles.authTitle}>Welcome Back</h2>
      <p className={styles.authSubtitle}>Log in to your easysiteme account</p>

      <div className="text-sm text-center mb-4">
        {loginWith === 'email' ? (
          <>
            Prefer mobile?{' '}
            <button
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
              className="text-brand font-semibold cursor-pointer"
              onClick={() => setFormData({ ...formData, loginWith: 'email' })}
            >
              Use email
            </button>
          </>
        )}
      </div>

      <div className={`inputGroup`}>
        {loginWith === 'email' ? (
          <Mail className="input-icon" size={18} />
        ) : (
          <Phone className="input-icon" size={18} />
        )}
        <input
          className="input"
          placeholder={loginWith === 'email' ? 'Email Address' : 'Mobile Number'}
          value={formData[loginWith]}
          onChange={(e) =>
            setFormData({ ...formData, [loginWith]: e.target.value })
          }
        />
      </div>

      {useOtp ? (
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Enter the OTP sent to your {formData.loginWith}
          </label>
          <OtpInput
            value={String(formData.otp || '')}
            onChange={(val) => setFormData({ ...formData, otp: val })}
            numInputs={6}
            inputType="tel"
            containerStyle={{ gap: "0.5rem" }}
            renderInput={(props) => (
              <input
                {...props}
                name="otp"
                className="input otpInput"
              />
            )}

          />

        </div>
      ) : (
        <div className={`inputGroup`}>
          {showPass ? (
            <EyeOff
              className="input-icon cursor-pointer"
              size={18}
              onClick={() => setFormData({ ...formData, showPass: false })}
            />
          ) : (
            <Eye
              className="input-icon cursor-pointer"
              size={18}
              onClick={() => setFormData({ ...formData, showPass: true })}
            />
          )}
          <input
            type={showPass ? 'text' : 'password'}
            className="input"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
      )}

      <button
        onClick={onSubmit}
        className="btn-primary w-full mt-3"
        disabled={loading}
      >
        {useOtp ? 'Verify OTP & Login' : 'Login'}
      </button>

      {!useOtp && (
        <p className={`text-center text-sm mt-4 ${styles.OrText}`}>
          OR  <button
            className="text-brand font-medium cursor-pointer"
            onClick={onSendOtp}
            disabled={otpSent}
          >
            Send OTP instead
          </button>

        </p>
      )}

      <p className={styles.authBottomText}>
        Don’t have an account?{' '}
        <Link href="/signup">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
