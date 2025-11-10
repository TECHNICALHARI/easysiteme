'use client';

import { useState } from 'react';
import styles from '@/styles/main.module.css';
import OTPInput from 'react-otp-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import { formatPhoneToE164 } from '@/lib/frontend/utils/common';
import { useRouter } from 'next/navigation';
import { forgotPasswordApi, resetPasswordApi } from '@/lib/frontend/api/services';

export default function ForgotPasswordPage() {
    const { showToast } = useToast();
    const router = useRouter();

    const [mode, setMode] = useState<'email' | 'mobile'>('email');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [countryCode, setCountryCode] = useState('+91');

    const [step, setStep] = useState<'request' | 'confirm'>('request');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [masked, setMasked] = useState<string | null>(null);

    const identifierDisplay = () => {
        if (mode === 'email') return email;
        return mobile;
    };

    const requestReset = async () => {
        setLoading(true);
        try {
            const payload: any = {};
            if (mode === 'email') {
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    showToast('Enter a valid email', 'error');
                    setLoading(false);
                    return;
                }
                payload.email = email.trim();
            } else {
                if (!mobile) {
                    showToast('Enter a valid mobile', 'error');
                    setLoading(false);
                    return;
                }
                payload.mobile = formatPhoneToE164(mobile);
            }

            const res = await forgotPasswordApi(payload);
            if (res?.success) {
                showToast(res.message ?? 'OTP sent', 'success');
                setMasked(res?.data?.masked ?? null);
                setStep('confirm');
            } else {
                showToast(res?.message || 'Failed to send reset OTP', 'error');
            }
        } catch (err: any) {
            showToast(err?.message || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    const confirmReset = async () => {
        if (!otp || otp.length < 4) {
            showToast('Enter the OTP', 'error');
            return;
        }
        if (!newPassword || newPassword.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        setLoading(true);
        try {
            const payload: any = {
                code: otp,
                newPassword,
            };
            payload.identifier = mode === 'email' ? email.trim() : formatPhoneToE164(mobile);

            const res = await resetPasswordApi(payload);
            if (res?.success) {
                showToast(res.message ?? 'Password changed. You can sign in now.', 'success');
                router.push('/login');
            } else {
                showToast(res?.message || 'Failed to reset password', 'error');
            }
        } catch (err: any) {
            showToast(err?.message || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={`${styles.authPage} section`}>
            <div className="container flex justify-center items-center">
                <div className={styles.authBox} style={{ minWidth: 360 }}>
                    <h2 className={styles.authTitle}>Reset password</h2>
                    <p className={styles.authSubtitle}>
                        Receive a one-time code to reset your password.
                    </p>

                    {/* <div className="flex gap-2 mb-4">
                        <button
                            type="button"
                            className={`flex-1 cursor-pointer py-2 rounded-lg border text-sm font-medium transition ${mode === 'email' ? 'border-brand text-brand bg-brand/5' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            onClick={() => setMode('email')}
                        >
                            Use Email
                        </button>
                        <button
                            type="button"
                            className={`flex-1 cursor-pointer py-2 rounded-lg border text-sm font-medium transition ${mode === 'mobile' ? 'border-brand text-brand bg-brand/5' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            onClick={() => setMode('mobile')}
                        >
                            Use Mobile
                        </button>
                    </div> */}

                    {step === 'request' && (
                        <>
                            {mode === 'email' && (
                                <div className="inputGroup relative mb-3">
                                    <input
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input w-full"
                                        type="email"
                                    />
                                </div>
                            )}

                            {mode === 'mobile' && (
                                <div className="mb-3">
                                    <PhoneInput
                                        country="in"
                                        value={mobile}
                                        onChange={(val: string, data: any) => {
                                            const dial = data?.dialCode ? `+${data.dialCode}` : countryCode || '+91';
                                            setCountryCode(dial);
                                            setMobile(val);
                                        }}
                                        inputProps={{ name: 'mobile', required: false }}
                                        containerClass="w-full"
                                        inputClass="input w-full"
                                        specialLabel=""
                                    />
                                </div>
                            )}

                            <button className="btn-primary w-full mt-3" onClick={requestReset} disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Send reset OTP'}
                            </button>
                        </>
                    )}

                    {step === 'confirm' && (
                        <>
                            <p className="text-sm mb-2">
                                Enter the code sent to <span className="font-medium">{masked ?? identifierDisplay()}</span>
                            </p>

                            <div className="my-2">
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={6}
                                    inputType="tel"
                                    containerStyle={{ gap: '0.6rem', justifyContent: 'center' }}
                                    renderInput={(props) => <input {...props} className="input otpInput" />}
                                />
                            </div>

                            <div className="inputGroup relative mt-3">
                                <input
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="input w-full"
                                    type="password"
                                />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="btn-secondary flex-1" onClick={() => setStep('request')} disabled={loading}>
                                    Back
                                </button>
                                <button className="btn-primary flex-1" onClick={confirmReset} disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset password'}
                                </button>
                            </div>
                        </>
                    )}

                    <p className={styles.authBottomText + ' mt-4'}>
                        Remembered your password?{' '}
                        <a href="/login" className="text-brand font-medium">Sign in</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
