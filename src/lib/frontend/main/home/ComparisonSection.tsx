'use client';

import { Check, X, Minus } from 'lucide-react';
import styles from '@/styles/main.module.css';

const rows = [
    { feature: 'Website + Blog + Bio-link', me: 'yes', altA: 'limited', altB: 'yes' },
    { feature: 'Drag-drop sections', me: 'yes', altA: 'no', altB: 'limited' },
    { feature: 'Built-in posts with SEO', me: 'yes', altA: 'no', altB: 'addon' },
    { feature: 'Custom domain (Pro+)', me: 'yes', altA: 'addon', altB: 'yes' },
    { feature: 'Embeds (YouTube, Maps, Calendly)', me: 'yes', altA: 'limited', altB: 'limited' },
    { feature: 'Passwordless login', me: 'yes', altA: 'none', altB: 'none' },
    { feature: 'Edge hosting performance', me: 'global', altA: 'shared', altB: 'shared' },
    { feature: 'Transparent pricing', me: '₹0 / ₹199 / ₹499', altA: 'higher', altB: 'higher' },
];

function renderCell(value: string) {
    switch (value) {
        case 'yes':
            return <Check size={18} className="text-green-600 dark:text-green-400" />;
        case 'no':
            return <X size={18} className="text-red-500 dark:text-red-400" />;
        case 'limited':
            return <Minus size={18} className="text-yellow-500 dark:text-yellow-400" />;
        case 'addon':
            return <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Add-on</span>;
        case 'global':
            return <span className="text-sm font-semibold text-[color:var(--color-brand)]">Global</span>;
        case 'shared':
            return <span className="text-sm text-gray-500 dark:text-gray-400">Shared</span>;
        case 'higher':
            return <span className="text-sm text-gray-500 dark:text-gray-400">Higher</span>;
        case 'none':
            return <span className="text-gray-400">—</span>;
        default:
            return <span className="text-sm">{value}</span>;
    }
}

export default function ComparisonSection() {
    return (
        <section id="comparison" className="section bg-muted" aria-labelledby="compare-title">
            <div className="container">
                <div className={styles.blockHead}>
                    <h2 id="compare-title" className="section-title">See how we stack up</h2>
                    <p className="section-subtitle">
                        Compare myeasypage with link-in-bio apps and DIY website builders — all your needs covered in one place.
                    </p>
                </div>

                <div className="overflow-x-auto mt-6">
                    <table className="min-w-[720px] w-full rounded-xl border border-[rgba(0,0,0,.06)] [background:var(--color-bg)] shadow-md">
                        <thead>
                            <tr className="text-left bg-[color-mix(in_srgb,var(--color-brand)_8%,var(--color-bg))]">
                                <th className="p-3 text-sm font-semibold">Feature</th>
                                <th className="p-3 text-sm font-semibold [color:var(--color-brand)]">myeasypage</th>
                                <th className="p-3 text-sm font-semibold">Link-in-bio tools</th>
                                <th className="p-3 text-sm font-semibold">DIY website builders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.feature} className="border-t border-[rgba(0,0,0,.06)]">
                                    <td className="p-3 text-sm">{r.feature}</td>
                                    <td className="p-3 text-center">{renderCell(r.me)}</td>
                                    <td className="p-3 text-center">{renderCell(r.altA)}</td>
                                    <td className="p-3 text-center">{renderCell(r.altB)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
