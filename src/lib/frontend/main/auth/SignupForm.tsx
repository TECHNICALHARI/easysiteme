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
} from 'lucide-react';
import styles from '@/styles/main.module.css';
import Link from 'next/link';
import { useState } from 'react';
import {
    debounceCheckDomain,
    validateSubdomain,
} from '../../utils/checkdomain';

type Props = {
    formData: any;
    setFormData: (v: any) => void;
    checking: boolean;
    subdomainAvailable: boolean | null;
    checkSubdomain: (v: string) => void;
    onNext: () => void;
};

const validateForm = (
    formData: any,
    subdomainError: string | null
) => {
    const errors: Record<string, string> = {};

    if (!formData.subdomain) {
        errors.subdomain = 'Subdomain is required';
    } else if (subdomainError) {
        errors.subdomain = subdomainError;
    }

    const password = formData.password || '';
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
        errors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
        errors.password =
            'Password must be 8+ chars, include uppercase, lowercase, number & special symbol';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{8,15}$/;

    const hasEmail = formData.email && emailRegex.test(formData.email);
    const hasMobile =
        formData.mobile && mobileRegex.test(formData.mobile);

    if (!hasEmail && !hasMobile) {
        errors.contact =
            'Either a valid email or a valid mobile number is required';
    }

    return errors;
};

export default function SignupForm({
    formData,
    setFormData,
    checking,
    subdomainAvailable,
    checkSubdomain,
    onNext,
}: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [subdomainError, setSubdomainError] = useState<string | null>(
        null
    );

    const togglePassword = () =>
        setFormData({ ...formData, showPass: !formData.showPass });

    const handleSubdomainChange = (val: string) => {
        const cleanVal = val
            .replace(/[^a-z0-9-]/gi, '')
            .toLowerCase();
        setFormData({ ...formData, subdomain: cleanVal });

        const error = validateSubdomain(cleanVal);
        setSubdomainError(error);

        if (!error) {
            debounceCheckDomain(cleanVal, checkSubdomain, 500);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(formData, subdomainError);
        setErrors(validationErrors);

        if (
            Object.keys(validationErrors).length === 0 &&
            subdomainAvailable
        ) {
            onNext();
        }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{8,15}$/;
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    const emailValid =
        formData.email && emailRegex.test(formData.email);
    const mobileValid =
        formData.mobile && mobileRegex.test(formData.mobile);
    const passwordValid =
        formData.password && passwordRegex.test(formData.password);

    return (
        <form onSubmit={handleSubmit} className={styles.authBox} noValidate>
            <h2 className={styles.authTitle}>Create your account</h2>
            <p className={styles.authSubtitle}>
                Claim a subdomain and launch your website, blog & bio link
            </p>

            <div className="inputGroup relative">
                <User className="input-icon" size={18} />
                <input
                    name="subdomain"
                    className="input inputWithIcon pr-8"
                    placeholder="Choose your subdomain"
                    value={formData.subdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    aria-label="Choose your subdomain"
                />
                {formData.subdomain &&
                    (subdomainError ? (
                        <X
                            size={18}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
                        />
                    ) : subdomainAvailable ? (
                        <Check
                            size={18}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600"
                        />
                    ) : subdomainAvailable === false ? (
                        <X
                            size={18}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
                        />
                    ) : null)}
            </div>
            {errors.subdomain && (
                <p className="text-red-500 text-sm mb-2">
                    {errors.subdomain}
                </p>
            )}

            {formData.subdomain && !subdomainError && (
                <div className={styles.previewBox} aria-live="polite">
                    <span
                        className={`${styles.previewUrl} ${subdomainAvailable
                            ? 'text-green-600'
                            : subdomainAvailable === false
                                ? 'text-red-500'
                                : ''
                            }`}
                    >
                        🔗 https://{formData.subdomain}.myeasypage.com
                    </span>
                    <span className={styles.previewNote}>
                        {checking
                            ? 'Checking availability...'
                            : subdomainAvailable === null
                                ? 'Enter a unique name using letters, numbers or hyphens'
                                : subdomainAvailable
                                    ? 'Subdomain is available ✅'
                                    : 'Subdomain is taken ❌'}
                    </span>
                </div>
            )}

            <div className="inputGroup relative">
                <Mail className="input-icon" size={18} />
                <input
                    name="email"
                    className="input inputWithIcon pr-8"
                    placeholder="Email address (optional)"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    aria-label="Email address"
                />
                {formData.email &&
                    (emailValid ? (
                        <Check
                            size={18}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600"
                        />
                    ) : (
                        <X
                            size={18}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
                        />
                    ))}
            </div>

            <div className="inputGroup relative">
                <Phone className="input-icon" size={18} />
                <input
                    name="mobile"
                    className="input inputWithIcon pr-8"
                    placeholder="Mobile number (optional)"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            mobile: e.target.value.replace(/[^0-9]/g, ''),
                        })
                    }
                    aria-label="Mobile number"
                />
                {formData.mobile &&
                    (mobileValid ? (
                        <Check
                            size={18}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600"
                        />
                    ) : (
                        <X
                            size={18}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
                        />
                    ))}
            </div>
            {errors.contact && (
                <p className="text-red-500 text-sm mb-2">{errors.contact}</p>
            )}

            <div className="inputGroup relative">
                <Lock className="input-icon" size={18} />
                <input
                    name="password"
                    className="input inputWithIcon pr-10"
                    type={formData.showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    aria-label="Password"
                />

                {formData.showPass ? (
                    <EyeOff
                        className="input-action-icon"
                        size={18}
                        onClick={togglePassword}
                        aria-label="Hide password"
                    />
                ) : (
                    <Eye
                        className="input-action-icon"
                        size={18}
                        onClick={togglePassword}
                        aria-label="Show password"
                    />
                )}

                {formData.password &&
                    (passwordValid ? (
                        <Check
                            size={18}
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-green-600"
                        />
                    ) : (
                        <X
                            size={18}
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500"
                        />
                    ))}
            </div>
            {errors.password && (
                <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}

            <button type="submit" className="btn-primary w-full mt-3">
                Continue
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
