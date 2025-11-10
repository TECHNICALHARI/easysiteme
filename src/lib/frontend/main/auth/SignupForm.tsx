'use client';

import {
    Mail,
    Phone,
    Eye,
    EyeOff,
    User,
    Check,
    X,
    Lock,
    KeyRound,
} from 'lucide-react';
import styles from '@/styles/main.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import OTPInput from 'react-otp-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { debounceCheckDomain, validateSubdomain } from '../../utils/checkdomain';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import { formatPhoneToE164 } from '../../utils/common';
import { sendOtpApi, verifyOtpApi } from '@/lib/frontend/api/services';

type Props = {
    formData: AuthSignupData;
    setFormData: React.Dispatch<React.SetStateAction<AuthSignupData>>;
    checking: boolean;
    subdomainAvailable: boolean | null;
    checkSubdomain: (v: string) => void;
    onNext: () => void;
    loading: boolean;
};

const RESEND_COOLDOWN = 60;

export default function SignupForm({
    formData,
    setFormData,
    checking,
    subdomainAvailable,
    checkSubdomain,
    onNext,
    loading,
}: Props) {
    const { showToast } = useToast();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [subdomainError, setSubdomainError] = useState<string | null>(null);
    const [showEmailOtpBox, setShowEmailOtpBox] = useState(false);
    const [showMobileOtpBox, setShowMobileOtpBox] = useState(false);
    const [emailSending, setEmailSending] = useState(false);
    const [mobileSending, setMobileSending] = useState(false);
    const [emailVerifying, setEmailVerifying] = useState(false);
    const [mobileVerifying, setMobileVerifying] = useState(false);
    const [emailResendLeft, setEmailResendLeft] = useState(0);
    const [mobileResendLeft, setMobileResendLeft] = useState(0);

    useEffect(() => {
        if (emailResendLeft > 0) {
            const t = setTimeout(() => setEmailResendLeft((s) => Math.max(0, s - 1)), 1000);
            return () => clearTimeout(t);
        }
    }, [emailResendLeft]);

    useEffect(() => {
        if (mobileResendLeft > 0) {
            const t = setTimeout(() => setMobileResendLeft((s) => Math.max(0, s - 1)), 1000);
            return () => clearTimeout(t);
        }
    }, [mobileResendLeft]);

    const togglePassword = () =>
        setFormData({ ...formData, showPass: !formData.showPass });

    const handleSubdomainChange = (val: string) => {
        const cleanVal = val.replace(/[^a-z0-9-]/gi, '').toLowerCase();
        setFormData({ ...formData, subdomain: cleanVal });
        const error = validateSubdomain(cleanVal);
        setSubdomainError(error);
        if (!error && cleanVal) debounceCheckDomain(cleanVal, checkSubdomain, 500);
    };

    const handleEmailVerifyClick = async () => {
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showToast('Enter a valid email first', 'error');
            return;
        }
        setEmailSending(true);
        try {
            const r = await sendOtpApi({ target: formData.email.trim(), purpose: 'signup_email' });
            if (r?.success) {
                showToast('OTP sent to email', 'success');
                setShowEmailOtpBox(true);
                setEmailResendLeft(RESEND_COOLDOWN);
            } else {
                showToast(r?.message || 'Failed to send email OTP', 'error');
            }
        } catch (error: any) {
            showToast(error.message || 'Something went wrong. Try again later.', 'error');
        } finally {
            setEmailSending(false);
        }
    };

    const handleResendEmail = async () => {
        if (emailResendLeft > 0) return;
        setEmailSending(true);
        try {
            const r = await sendOtpApi({ target: formData.email.trim(), purpose: 'signup_email' });
            if (r?.success) {
                showToast('OTP resent to email', 'success');
                setEmailResendLeft(RESEND_COOLDOWN);
            } else {
                showToast(r?.message || 'Failed to resend', 'error');
            }
        } catch (error: any) {
            showToast(error.message || 'Something went wrong. Try again later.', 'error');
        } finally {
            setEmailSending(false);
        }
    };

    const handleConfirmEmailOtp = async () => {
        if (!formData.emailOtp) {
            showToast('Enter OTP', 'error');
            return;
        }
        setEmailVerifying(true);
        try {
            const r = await verifyOtpApi({ target: formData.email.trim(), code: formData.emailOtp, purpose: 'verify_email' });
            if (r?.success) {
                showToast('Email verified', 'success');
                setFormData({ ...formData, emailVerified: true });
                setShowEmailOtpBox(false);
            } else {
                showToast(r?.message || 'Invalid OTP', 'error');
            }
        } catch (error: any) {
            showToast(error.message || 'Something went wrong. Try again later.', 'error');
        } finally {
            setEmailVerifying(false);
        }
    };

    // const handleMobileVerifyClick = async () => {
    //     if (!formData.mobile) {
    //         showToast('Enter a valid mobile first', 'error');
    //         return;
    //     }
    //     setMobileSending(true);
    //     try {
    //         const identifier = formatPhoneToE164(formData.mobile);
    //         const r = await sendOtpApi({ target: identifier, purpose: 'signup_phone' });
    //         if (r?.success) {
    //             showToast('OTP sent to mobile', 'success');
    //             setShowMobileOtpBox(true);
    //             setMobileResendLeft(RESEND_COOLDOWN);
    //         } else {
    //             showToast(r?.message || 'Failed to send mobile OTP', 'error');
    //         }
    //     } catch (error: any) {
    //         showToast(error.message || 'Something went wrong. Try again later.', 'error');
    //     } finally {
    //         setMobileSending(false);
    //     }
    // };

    // const handleResendMobile = async () => {
    //     if (mobileResendLeft > 0) return;
    //     setMobileSending(true);
    //     try {
    //         const identifier = formatPhoneToE164(formData.mobile);
    //         const r = await sendOtpApi({ target: identifier, purpose: 'signup_phone' });
    //         if (r?.success) {
    //             showToast('OTP resent to mobile', 'success');
    //             setMobileResendLeft(RESEND_COOLDOWN);
    //         } else {
    //             showToast(r?.message || 'Failed to resend mobile OTP', 'error');
    //         }
    //     } catch (error: any) {
    //         showToast(error.message || 'Something went wrong. Try again later.', 'error');
    //     } finally {
    //         setMobileSending(false);
    //     }
    // };

    // const handleConfirmMobileOtp = async () => {
    //     if (!formData.mobileOtp) {
    //         showToast('Enter OTP', 'error');
    //         return;
    //     }
    //     setMobileVerifying(true);
    //     try {
    //         const identifier = formatPhoneToE164(formData.mobile);
    //         const r = await verifyOtpApi({ target: identifier, code: formData.mobileOtp, purpose: 'verify_phone' });
    //         if (r?.success) {
    //             showToast(r.message || 'Mobile verified', 'success');
    //             setFormData({ ...formData, mobileVerified: true });
    //             setShowMobileOtpBox(false);
    //         } else {
    //             showToast(r?.message || 'Invalid OTP', 'error');
    //         }
    //     } catch (error: any) {
    //         showToast(error.message || 'Something went wrong. Try again later.', 'error');
    //     } finally {
    //         setMobileVerifying(false);
    //     }
    // };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!formData.subdomain) newErrors.subdomain = 'Subdomain is required';
        else if (subdomainError) newErrors.subdomain = subdomainError;
        else if (subdomainAvailable === false) newErrors.subdomain = 'Subdomain is already taken';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        // if (!formData.emailVerified && !formData.mobileVerified) newErrors.contact = 'Verify at least email or mobile';
        if (!formData.emailVerified) newErrors.contact = 'Please verify your email before continuing';
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) onNext();
    };

    const checkPasswordStrength = (password: string) => {
        const conditions = [
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /\d/.test(password),
            /[@$!%*?&#^+=._-]/.test(password),
            password.length >= 8,
        ];
        const passed = conditions.filter(Boolean).length;
        if (passed === 0) return { score: 0, label: 'Too weak', color: 'text-red-500' };
        if (passed <= 2) return { score: 1, label: 'Weak', color: 'text-orange-500' };
        if (passed === 3 || passed === 4) return { score: 2, label: 'Good', color: 'text-yellow-500' };
        if (passed === 5) return { score: 3, label: 'Strong', color: 'text-green-600' };
        return { score: 0, label: 'Too weak', color: 'text-red-500' };
    };

    const strength = checkPasswordStrength(formData.password);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{6,15}$/;
    const emailValid = formData.email && emailRegex.test(formData.email);
    const mobileValid = formData.mobile && mobileRegex.test(String(formData.mobile).replace(/^\+/, '').replace(/\D/g, ''));

    return (
        <form onSubmit={handleSubmit} className={styles.authBox} noValidate>
            <h2 className={styles.authTitle}>Create your account</h2>
            <p className={styles.authSubtitle}>
                Pick a unique subdomain to launch your page instantly.
                <br />
                Verify your email or mobile to protect your account and enable quick, secure login.
            </p>

            <div className="inputGroup relative">
                <User className="input-icon" size={18} />
                <input
                    placeholder="Choose your subdomain"
                    value={formData.subdomain}
                    name="subdomain"
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    className="input inputWithIcon pr-8"
                />
                {formData.subdomain &&
                    (subdomainError ? (
                        <X size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" />
                    ) : subdomainAvailable ? (
                        <Check size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600" />
                    ) : subdomainAvailable === false ? (
                        <X size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" />
                    ) : checking ? (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Checking...</span>
                    ) : null)}
            </div>
            {errors.subdomain && <p className="text-red-500 text-sm mb-2">{errors.subdomain}</p>}

            {formData.subdomain && !subdomainError && (
                <div className={styles.previewBox}>
                    <span className={`${styles.previewUrl} ${subdomainAvailable ? 'text-green-600' : subdomainAvailable === false ? 'text-red-500' : ''}`}>
                        https://{formData.subdomain}.myeasypage.com
                    </span>
                    <span className={styles.previewNote}>
                        {checking ? 'Checking availability...' : subdomainAvailable === null ? 'Enter a unique name using letters, numbers or hyphens' : subdomainAvailable ? 'Subdomain is available' : 'Subdomain is taken'}
                    </span>
                </div>
            )}

            <div className="inputGroup relative flex gap-2 items-center">
                <div className="flex-1 relative">
                    <Mail className="input-icon" size={18} />
                    <input
                        name="email"
                        placeholder="Email address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value, emailVerified: false })}
                        className="input inputWithIcon pr-8"
                    />
                    {formData.email && (emailValid ? <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600" size={18} /> : <X className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={18} />)}
                </div>
                {emailValid && !formData.emailVerified && (
                    <div className="flex items-center gap-2">
                        <button type="button" className="px-4 cursor-pointer bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium h-[46px]" onClick={handleEmailVerifyClick} disabled={emailSending || emailResendLeft > 0}>
                            {emailSending ? 'Sending...' : emailResendLeft > 0 ? `Resend in ${emailResendLeft}s` : 'Verify'}
                        </button>
                    </div>
                )}
                {formData.emailVerified && <span className="text-green-600 text-sm">Verified</span>}
            </div>

            {showEmailOtpBox && !formData.emailVerified && (
                <div className="my-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center">
                        <KeyRound size={20} className="text-brand mb-2" />
                        <OTPInput
                            value={String(formData.emailOtp || '')}
                            onChange={(val) => setFormData({ ...formData, emailOtp: val })}
                            numInputs={6}
                            inputType="tel"
                            containerStyle={{ gap: '0.6rem', justifyContent: 'center' }}
                            renderInput={(props) => <input {...props} className="input otpInput" name="emailOtp" />}
                        />
                        <div className="w-full flex gap-2 mt-3">
                            <button type="button" className="btn-primary flex-1" onClick={handleConfirmEmailOtp} disabled={emailVerifying}>
                                {emailVerifying ? 'Verifying...' : 'Confirm Email OTP'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={handleResendEmail} disabled={emailResendLeft > 0 || emailSending}>
                                {emailResendLeft > 0 ? `Resend in ${emailResendLeft}s` : 'Resend'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {errors.contact && <p className="text-red-500 text-sm mb-2">{errors.contact}</p>}
            <div className="inputGroup relative flex gap-2 items-center">
                <div className="flex-1 relative">
                    <Phone className="input-icon" size={18} />
                    <PhoneInput
                        country="in"
                        value={formData.mobile}
                        onChange={(val: string, data: any) => {
                            const dial = data?.dialCode ? `+${data.dialCode}` : formData.countryCode || '+91';
                            setFormData({ ...formData, mobile: val, countryCode: dial, mobileVerified: false });
                        }}
                        inputProps={{ name: 'mobile', required: false }}
                        containerClass="w-full"
                        inputClass="input w-full"
                        specialLabel=""
                    />
                    {formData.mobile && (mobileValid ? <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600" size={18} /> : <X className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={18} />)}
                </div>
                {/* {mobileValid && !formData.mobileVerified && (
                    <div className="flex items-center gap-2">
                        <button type="button" className="px-4 cursor-pointer bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium h-[46px]" onClick={handleMobileVerifyClick} disabled={mobileSending || mobileResendLeft > 0}>
                            {mobileSending ? 'Sending...' : mobileResendLeft > 0 ? `Resend in ${mobileResendLeft}s` : 'Verify'}
                        </button>
                    </div>
                )}
                {formData.mobileVerified && <span className="text-green-600 text-sm">Verified</span>} */}
            </div>

            {/* {showMobileOtpBox && !formData.mobileVerified && (
                <div className="my-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <OTPInput
                        value={String(formData.mobileOtp || '')}
                        onChange={(val) => setFormData({ ...formData, mobileOtp: val })}
                        numInputs={6}
                        inputType="tel"
                        containerStyle={{ gap: '0.6rem', justifyContent: 'center' }}
                        renderInput={(props) => <input {...props} className="input otpInput" name="mobileOtp" />}
                    />
                    <div className="w-full flex gap-2 mt-3">
                        <button type="button" className="btn-primary flex-1" onClick={handleConfirmMobileOtp} disabled={mobileVerifying}>
                            {mobileVerifying ? 'Verifying...' : 'Confirm Mobile OTP'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={handleResendMobile} disabled={mobileResendLeft > 0 || mobileSending}>
                            {mobileResendLeft > 0 ? `Resend in ${mobileResendLeft}s` : 'Resend'}
                        </button>
                    </div>
                </div>
            )} */}


            <div className="inputGroup relative">
                <Lock className="input-icon" size={18} />
                <input
                    name="password"
                    placeholder="Password (min 8 chars, Aa1@)"
                    type={formData.showPass ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input inputWithIcon pr-10"
                />
                {formData.showPass ? <EyeOff className="input-action-icon" size={18} onClick={togglePassword} /> : <Eye className="input-action-icon" size={18} onClick={togglePassword} />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            {formData.password && (
                <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strength.score === 0 ? 'w-1/5 bg-red-500' : strength.score === 1 ? 'w-2/5 bg-orange-500' : strength.score === 2 ? 'w-3/5 bg-yellow-500' : 'w-full bg-green-600'}`}></div>
                    </div>
                    <p className={`mt-1 text-sm font-medium ${strength.color}`}>{strength.label} password</p>
                </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-5">
                {loading ? 'Creating your site...' : 'Create my website'}
            </button>

            <p className={styles.authBottomText}>
                Already have an account?{' '}
                <Link href="/login" className="text-brand font-medium">
                    Sign in
                </Link>
            </p>
        </form>
    );
}
