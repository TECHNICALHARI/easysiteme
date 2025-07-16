'use client';

import styles from '@/styles/main.module.css';

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
            <input
                className="input mb-4"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
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
                <button onClick={onBack} className="text-brand font-medium">
                    Edit Info
                </button>
            </p>
        </div>
    );
}
