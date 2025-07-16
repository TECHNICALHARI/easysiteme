'use client';

import { Mail, Phone, Eye, EyeOff, User } from 'lucide-react';
import styles from '@/styles/main.module.css';

export default function SignupForm({
    formData,
    setFormData,
    checking,
    subdomainAvailable,
    checkSubdomain,
    onNext,
}: any) {
    const togglePassword = () =>
        setFormData({ ...formData, showPass: !formData.showPass });

    return (
        <div className={styles.authBox}>
            <h2 className={styles.authTitle}>Create your account</h2>
            <p className={styles.authSubtitle}>Start building your one-page site</p>
            <div className="inputGroup">
                <User className="input-icon" size={18} />
                <input
                    className="input"
                    placeholder="Choose your subdomain"
                    value={formData.subdomain}
                    onChange={(e) => {
                        setFormData({ ...formData, subdomain: e.target.value });
                        checkSubdomain(e.target.value);
                    }}
                />
            </div>

            {formData.subdomain && (
                <div className={styles.previewBox}>
                    <span
                        className={`${styles.previewUrl} ${subdomainAvailable ? 'text-green-600' : 'text-red-500'
                            }`}
                    >
                        🔗 https://pagebanao.com/{formData.subdomain}
                    </span>
                    <span className={styles.previewNote}>
                        {checking
                            ? 'Checking availability...'
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
                />
            </div>

            <div className="inputGroup">
                {formData.showPass ? (
                    <EyeOff className="input-icon cursor-pointer" size={18} onClick={togglePassword} />
                ) : (
                    <Eye className="input-icon cursor-pointer" size={18} onClick={togglePassword} />
                )}
                <input
                    className="input"
                    type={formData.showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            <button
                className="btn-primary w-full mt-3"
                onClick={onNext}
                disabled={subdomainAvailable === false}
            >
                Continue
            </button>

            <p className={styles.authBottomText}>
                Already signed up?{' '}
                <a href="/login" className="text-brand font-medium">
                    Login
                </a>
            </p>
        </div>
    );
}
