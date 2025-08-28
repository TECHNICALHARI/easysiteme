"use client";
import { Check, X, Minus } from 'lucide-react';
import styles from '@/styles/main.module.css';

type Cell = 'yes' | 'no' | 'limited' | 'addon' | 'global' | 'shared' | 'higher' | 'none' | string;

const rows: { feature: string; me: Cell; altA: Cell; altB: Cell }[] = [
    { feature: 'One-page websites, blogs & bio links', me: 'yes', altA: 'limited', altB: 'yes' },
    { feature: 'Drag & drop no-code builder', me: 'yes', altA: 'no', altB: 'limited' },
    { feature: 'Blog posts with SEO fields', me: 'yes', altA: 'no', altB: 'addon' },
    { feature: 'Custom domain (Pro+)', me: 'yes', altA: 'addon', altB: 'yes' },
    { feature: 'Embeds (YouTube, Maps, Calendly)', me: 'yes', altA: 'limited', altB: 'limited' },
    { feature: 'Secure login', me: 'yes', altA: 'none', altB: 'none' },
    { feature: 'Global edge hosting', me: 'global', altA: 'shared', altB: 'shared' },
    { feature: 'Simple, transparent pricing', me: '₹0 / ₹199 / ₹499', altA: 'higher', altB: 'higher' },
];

function Badge({ children, tone }: { children: React.ReactNode; tone: 'ok' | 'warn' | 'muted' | 'brand' }) {
    const base = 'inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold';
    const map = {
        ok: 'bg-[rgba(16,185,129,.10)] text-[rgb(16,185,129)]',
        warn: 'bg-[rgba(234,179,8,.12)] text-[rgb(202,138,4)]',
        muted: 'bg-[rgba(0,0,0,.06)] text-[rgba(17,24,39,.7)] dark:bg-[rgba(255,255,255,.08)] dark:text-[rgba(255,255,255,.75)]',
        brand: 'bg-[color-mix(in_srgb,var(--color-brand)_12%,transparent)] text-[color:var(--color-brand)]'
    } as const;
    return <span className={`${base} ${map[tone]}`}>{children}</span>;
}

function renderCell(value: Cell) {
    switch (value) {
        case 'yes':
            return <Badge tone="ok"><Check size={14} />Yes</Badge>;
        case 'no':
            return <Badge tone="muted"><X size={14} />No</Badge>;
        case 'limited':
            return <Badge tone="warn"><Minus size={14} />Limited</Badge>;
        case 'addon':
            return <Badge tone="warn">Add-on</Badge>;
        case 'global':
            return <Badge tone="brand">Global</Badge>;
        case 'shared':
            return <Badge tone="muted">Shared</Badge>;
        case 'higher':
            return <Badge tone="muted">Higher</Badge>;
        case 'none':
            return <span className="text-[rgba(0,0,0,.35)] dark:text-[rgba(255,255,255,.35)]">—</span>;
        default:
            return <span className="text-sm font-semibold text-[color:var(--color-text)]">{value}</span>;
    }
}

export default function ComparisonSection() {
    return (
        <section id="comparison" className="section bg-muted" aria-labelledby="compare-title">
            <div className="container">
                <div className={styles.blockHead}>
                    <h2 id="compare-title" className="section-title">All-in-one vs the rest</h2>
                    <p className="section-subtitle">
                        myeasypage combines a website, blog, and bio link in a single, speedy builder—no juggling tools.
                    </p>
                </div>

                <div className={styles.compareWrap}>
                    <table className={styles.compareTable} role="table">
                        <colgroup>
                            <col style={{ width: '44%' }} />
                            <col style={{ width: '18.66%' }} />
                            <col style={{ width: '18.66%' }} />
                            <col style={{ width: '18.66%' }} />
                        </colgroup>
                        <caption className="sr-only">
                            Feature comparison: myeasypage vs link-in-bio tools and DIY website builders
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">Feature</th>
                                <th scope="col" className="[color:var(--color-brand)]">myeasypage</th>
                                <th scope="col">Link-in-bio tools</th>
                                <th scope="col">DIY website builders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.feature}>
                                    <th scope="row">{r.feature}</th>
                                    <td>{renderCell(r.me)}</td>
                                    <td>{renderCell(r.altA)}</td>
                                    <td>{renderCell(r.altB)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
