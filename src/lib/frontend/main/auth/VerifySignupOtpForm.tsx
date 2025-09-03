'use client';

import styles from '@/styles/main.module.css';
import OTPInput from 'react-otp-input';
import { useState } from 'react';

type Props = {
  formData: any;
  setFormData: (v: any) => void;
  verifying: boolean;
  onVerify: () => void;
  onBack: () => void;
};

export default function VerifySignupOtpForm({
  formData,
  setFormData,
  verifying,
  onVerify,
  onBack,
}: Props) {
  const [errors, setErrors] = useState<{ emailOtp?: string; mobileOtp?: string }>({});

  const handleVerify = () => {
    const newErrors: { emailOtp?: string; mobileOtp?: string } = {};

    if (formData.email && (!formData.emailOtp || formData.emailOtp.length < 6)) {
      newErrors.emailOtp = 'Enter the 6-digit OTP sent to your email';
    }
    if (formData.mobile && (!formData.mobileOtp || formData.mobileOtp.length < 6)) {
      newErrors.mobileOtp = 'Enter the 6-digit OTP sent to your mobile';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onVerify();
    }
  };

  return (
    <div className={styles.authBox}>
      <h2 className={styles.authTitle}>Verify OTP</h2>
      <p className={styles.authSubtitle}>
        We&apos;ve sent OTPs to the contact details you provided.  
        Please verify to secure your account.
      </p>

      {formData.email && (
        <div className="mb-4">
          <p className="text-sm mb-2">
            OTP sent to <span className="font-medium text-brand">{formData.email}</span>
          </p>
          <OTPInput
            value={String(formData.emailOtp || '')}
            onChange={(val) => setFormData({ ...formData, emailOtp: val })}
            numInputs={6}
            inputType="tel"
            containerStyle={{ gap: '0.5rem' }}
            renderInput={(props) => (
              <input
                {...props}
                name="emailOtp"
                className="input otpInput"
                aria-label="Email OTP"
              />
            )}
          />
          {errors.emailOtp && (
            <p className="text-red-500 text-sm mt-1">{errors.emailOtp}</p>
          )}
        </div>
      )}

      {formData.mobile && (
        <div className="mb-4">
          <p className="text-sm mb-2">
            OTP sent to <span className="font-medium text-brand">{formData.mobile}</span>
          </p>
          <OTPInput
            value={String(formData.mobileOtp || '')}
            onChange={(val) => setFormData({ ...formData, mobileOtp: val })}
            numInputs={6}
            inputType="tel"
            containerStyle={{ gap: '0.5rem' }}
            renderInput={(props) => (
              <input
                {...props}
                name="mobileOtp"
                className="input otpInput"
                aria-label="Mobile OTP"
              />
            )}
          />
          {errors.mobileOtp && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileOtp}</p>
          )}
        </div>
      )}

      <button
        type="button"
        className="btn-primary w-full mt-3"
        onClick={handleVerify}
        disabled={verifying}
      >
        {verifying ? 'Verifying...' : 'Verify & Create Account'}
      </button>

      <p className={styles.authBottomText}>
        Didn’t receive OTP?{' '}
        <button
          onClick={onBack}
          className="text-brand font-medium cursor-pointer"
        >
          Edit info
        </button>
      </p>
    </div>
  );
}
