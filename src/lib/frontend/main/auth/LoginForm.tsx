'use client';

import {
  Mail,
  Phone,
  Eye,
  EyeOff,
  Lock,
  Check,
  X,
} from 'lucide-react';
import styles from '@/styles/main.module.css';
import Link from 'next/link';

type Props = {
  formData: any;
  setFormData: (v: any) => void;
  onSubmit: () => void;
  onSendOtp: () => void;
  loading: boolean;
  errors: Record<string, string>;
};

export default function LoginForm({
  formData,
  setFormData,
  onSubmit,
  onSendOtp,
  loading,
  errors,
}: Props) {
  const togglePassword = () =>
    setFormData({ ...formData, showPass: !formData.showPass });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{8,15}$/;

  const emailValid = formData.email && emailRegex.test(formData.email);
  const mobileValid = formData.mobile && mobileRegex.test(formData.mobile);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className={styles.authBox} noValidate>
      <h2 className={styles.authTitle}>Sign in to your account</h2>
      <p className={styles.authSubtitle}>
        Continue with {formData.loginWith === 'email' ? 'email' : 'mobile number'}
      </p>

      {!formData.useOtp && !formData.otpSent && (
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`flex-1 py-2 rounded-md border cursor-pointer ${formData.loginWith === 'email' ? 'border-brand text-brand font-medium' : 'border-gray-300'}`}
            onClick={() => setFormData({ ...formData, loginWith: 'email' })}
          >
            Use Email
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-md border cursor-pointer ${formData.loginWith === 'mobile' ? 'border-brand text-brand font-medium' : 'border-gray-300'}`}
            onClick={() => setFormData({ ...formData, loginWith: 'mobile' })}
          >
            Use Mobile
          </button>
        </div>
      )}

      {formData.loginWith === 'email' && (
        <>
          <div className="inputGroup relative">
            <Mail className="input-icon" size={18} />
            <input
              name="email"
              className="input inputWithIcon pr-8"
              placeholder="Email address"
              type="email"
              value={formData.email}
              disabled={formData.useOtp && formData.otpSent}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {formData.email &&
              (emailValid ? (
                <Check size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600" />
              ) : (
                <X size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" />
              ))}
          </div>
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
        </>
      )}

      {formData.loginWith === 'mobile' && (
        <>
          <div className="inputGroup relative">
            <Phone className="input-icon" size={18} />
            <input
              name="mobile"
              className="input inputWithIcon pr-8"
              placeholder="Mobile number"
              type="tel"
              value={formData.mobile}
              disabled={formData.useOtp && formData.otpSent}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value.replace(/[^0-9]/g, '') })
              }
            />
            {formData.mobile &&
              (mobileValid ? (
                <Check size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600" />
              ) : (
                <X size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" />
              ))}
          </div>
          {errors.mobile && <p className="text-red-500 text-sm mb-2">{errors.mobile}</p>}
        </>
      )}

      {!formData.useOtp && (
        <div className="inputGroup relative">
          <Lock className="input-icon" size={18} />
          <input
            name="password"
            className="input inputWithIcon pr-10"
            type={formData.showPass ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {formData.showPass ? (
            <EyeOff className="input-action-icon" size={18} onClick={togglePassword} />
          ) : (
            <Eye className="input-action-icon" size={18} onClick={togglePassword} />
          )}
        </div>
      )}
      {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

      {formData.useOtp && formData.otpSent && (
        <div className="inputGroup relative">
          <Lock className="input-icon" size={18} />
          <input
            name="otp"
            className="input inputWithIcon"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
          />
        </div>
      )}
      {errors.otp && <p className="text-red-500 text-sm mb-2">{errors.otp}</p>}

      {!formData.useOtp ? (
        <button
          type="button"
          className="btn-secondary w-full mt-2"
          onClick={onSendOtp}
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Sign in with OTP'}
        </button>
      ) : null}

      <button type="submit" className="btn-primary w-full mt-3" disabled={loading}>
        {loading ? 'Processing...' : 'Sign in'}
      </button>

      <p className={styles.authBottomText}>
        Don’t have an account?{' '}
        <Link href="/signup" className="text-brand font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}
