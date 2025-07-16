'use client';

import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import styles from '@/styles/main.module.css';
import OtpInput from 'react-otp-input';
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
          <label className="block text-sm text-gray-600 mb-1" htmlFor="otp">
            Enter the OTP sent to your {formData.loginWith}
          </label>
          <OtpInput
            value={formData.otp}
            onChange={(val) => setFormData({ ...formData, otp: val })}
            numInputs={6}
            inputType="tel"
            shouldAutoFocus
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              padding: '0.75rem',
              width: '2.75rem',
              height: '2.75rem',
              fontSize: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--color-muted)',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
              fontWeight: '500',
              textAlign: 'center',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            containerStyle="flex justify-center gap-2 mt-3"
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
        <p className="text-center text-sm mt-4">
          OR{' '}
          <button
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
        <a href="/signup">
          Sign Up
        </a>
      </p>
    </div>
  );
}
