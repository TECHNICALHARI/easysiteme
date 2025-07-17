'use client';

import styles from '@/styles/main.module.css';
import OTPInput from 'react-otp-input';

export default function VerifySignupOtpForm({
    formData,
    setFormData,
    verifying,
    onVerify,
    onBack,
}: any) {
    return (
        <div className={styles.authBox}>
            <h2 className={styles.authTitle}>Verify OTP</h2>
            <p className={styles.authSubtitle}>
                We've sent an OTP to your {formData.email ? 'email' : 'mobile'}
            </p>
            <OTPInput
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
            <button
                className="btn-primary w-full mt-3"
                onClick={onVerify}
                disabled={verifying}
            >
                {verifying ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <p className={styles.authBottomText}>
                Didn’t receive OTP?{' '}
                <button onClick={onBack} className="text-brand font-medium cursor-pointer">
                    Edit Info
                </button>
            </p>
        </div>
    );
}
