'use client';

import { Mail, Phone, Eye, EyeOff, User } from 'lucide-react';
import styles from '@/styles/main.module.css';
import Link from 'next/link';

type Props = {
    formData: any;
    setFormData: (v: any) => void;
    checking: boolean;
    subdomainAvailable: boolean | null;
    checkSubdomain: (v: string) => void;
    onNext: () => void;
};

export default function SignupForm({
    formData,
    setFormData,
    checking,
    subdomainAvailable,
    checkSubdomain,
    onNext,
}: Props) {
    const togglePassword = () => setFormData({ ...formData, showPass: !formData.showPass });

    return (
        <div className={styles.authBox}>
            <h2 className={styles.authTitle}>Create your account</h2>
            <p className={styles.authSubtitle}>Claim a subdomain and launch your website, blog & bio link</p>

            <div className="inputGroup">
                <User className="input-icon" size={18} />
                <input
                    className="input"
                    placeholder="Choose your subdomain"
                    value={formData.subdomain}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase();
                        setFormData({ ...formData, subdomain: val });
                        checkSubdomain(val);
                    }}
                    aria-label="Choose your subdomain"
                />
            </div>

            {formData.subdomain && (
                <div className={styles.previewBox} aria-live="polite">
                    <span
                        className={`${styles.previewUrl} ${subdomainAvailable ? 'text-green-600' : subdomainAvailable === false ? 'text-red-500' : ''}`}
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

            <div className="inputGroup">
                <Mail className="input-icon" size={18} />
                <input
                    className="input"
                    placeholder="Email address (optional)"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    aria-label="Email address"
                />
            </div>

            <div className="inputGroup">
                <Phone className="input-icon" size={18} />
                <input
                    className="input"
                    placeholder="Mobile number (optional)"
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    aria-label="Mobile number"
                />
            </div>

            <div className="inputGroup">
                {formData.showPass ? (
                    <EyeOff className="input-icon cursor-pointer" size={18} onClick={togglePassword} aria-label="Hide password" />
                ) : (
                    <Eye className="input-icon cursor-pointer" size={18} onClick={togglePassword} aria-label="Show password" />
                )}
                <input
                    className="input"
                    type={formData.showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    aria-label="Password"
                />
            </div>

            <button
                className="btn-primary w-full mt-3"
                onClick={onNext}
                disabled={subdomainAvailable === false || !formData.subdomain || !formData.password}
            >
                Continue
            </button>

            <p className={styles.authBottomText}>
                Already have an account?{' '}
                <Link href="/login" className="text-brand font-medium">Sign in</Link>
            </p>
        </div>
    );
}
