'use client';

import styles from '@/styles/main.module.css';
import OTPInput from 'react-otp-input';

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
    return (
        <div className={styles.authBox}>
            <h2 className={styles.authTitle}>Verify OTP</h2>
            <p className={styles.authSubtitle}>
                We&apos;ve sent an OTP to your {formData.email ? 'email' : 'mobile'}
            </p>

            <OTPInput
                value={String(formData.otp || '')}
                onChange={(val) => setFormData({ ...formData, otp: val })}
                numInputs={6}
                inputType="tel"
                containerStyle={{ gap: '0.5rem' }}
                renderInput={(props) => <input {...props} name="otp" className="input otpInput" aria-label="One-time password" />}
            />

            <button className="btn-primary w-full mt-3" onClick={onVerify} disabled={verifying}>
                {verifying ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <p className={styles.authBottomText}>
                Didn’t receive OTP?{' '}
                <button onClick={onBack} className="text-brand font-medium cursor-pointer">Edit info</button>
            </p>
        </div>
    );
}
