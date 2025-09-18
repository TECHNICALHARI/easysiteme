'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import styles from '@/styles/main.module.css';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import { ChangePasswordApi } from '@/lib/frontend/api/services';
import GoBackButton from '@/lib/frontend/common/GoBackButton';

export default function ChangePasswordPage() {
    const { showToast } = useToast();
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrent: false,
        showNew: false,
        showConfirm: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // clear error on typing
    };

    const toggle = (key: 'showCurrent' | 'showNew' | 'showConfirm') => {
        setForm((prev) => ({ ...prev, [key]: !prev[key] }));
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

    const strength = checkPasswordStrength(form.newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!form.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!form.newPassword) newErrors.newPassword = 'New password is required';
        else if (form.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your new password';
        else if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);
            const res = await ChangePasswordApi({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });

            if (!res?.success) {
                throw new Error(res?.message || 'Failed to update password');
            }

            showToast(res?.message || 'Password updated successfully', 'success');
            setForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                showCurrent: false,
                showNew: false,
                showConfirm: false,
            });
        } catch (err: any) {
            showToast(err?.message || 'Failed to update password', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={`${styles.authPage} ${styles.changePasswordAdmin} section`}>
            <div className="container flex justify-center items-center flex-col">
                <div className='w-full'>
                    <GoBackButton />
                </div>
                <div className={styles.authBox} style={{ maxWidth: 680, width: '100%' }}>
                    <h2 className={styles.authTitle}>Change Password</h2>
                    <p className={styles.authSubtitle}>
                        Update your account password to keep your account secure.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
                        {/* Current Password */}
                        <div className="custumGroupInput">
                            <label htmlFor="currentPassword" className="labelText">
                                Current Password
                            </label>
                            <div className="inputGroup relative">
                                <Lock className="input-icon" size={18} />
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={form.showCurrent ? 'text' : 'password'}
                                    className="input inputWithIcon pr-10"
                                    placeholder="Enter current password"
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => toggle('showCurrent')}
                                >
                                    {form.showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="custumGroupInput">
                            <label htmlFor="newPassword" className="labelText">
                                New Password
                            </label>
                            <div className="inputGroup relative">
                                <Lock className="input-icon" size={18} />
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={form.showNew ? 'text' : 'password'}
                                    className="input inputWithIcon pr-10"
                                    placeholder="Enter new password"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => toggle('showNew')}
                                >
                                    {form.showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                            )}
                            {form.newPassword && (
                                <div className="mt-2">
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${strength.score === 0
                                                ? 'w-1/5 bg-red-500'
                                                : strength.score === 1
                                                    ? 'w-2/5 bg-orange-500'
                                                    : strength.score === 2
                                                        ? 'w-3/5 bg-yellow-500'
                                                        : 'w-full bg-green-600'
                                                }`}
                                        ></div>
                                    </div>
                                    <p className={`mt-1 text-sm font-medium ${strength.color}`}>
                                        {strength.label} password
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="custumGroupInput">
                            <label htmlFor="confirmPassword" className="labelText">
                                Confirm New Password
                            </label>
                            <div className="inputGroup relative">
                                <Lock className="input-icon" size={18} />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={form.showConfirm ? 'text' : 'password'}
                                    className="input inputWithIcon pr-10"
                                    placeholder="Confirm new password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => toggle('showConfirm')}
                                >
                                    {form.showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div>
                            <button type="submit" className="btn-primary w-full" disabled={loading}>
                                {loading ? 'Updating…' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
