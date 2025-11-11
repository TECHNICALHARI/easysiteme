'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from '@/styles/main.module.css';
import { PlanData } from '@/lib/frontend/utils/data/plans';
import { useUser } from '@/lib/frontend/context/UserContext';
import { createOrderServiceAPI, verifyPaymentServiceAPI } from '@/lib/frontend/api/services';
import Loader from '@/lib/frontend/common/Loader';

export default function AdminUpgradePage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const router = useRouter();
  const userCtx = useUser();
  const user = userCtx?.user ?? null;

  useEffect(() => {
    if (!user) return;
    if (typeof user.plan === 'string' && user.plan) setCurrentPlanId(user.plan);
  }, [user]);

  const loadRazorpayScript = () =>
    new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('No window'));
      if ((window as any).Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.body.appendChild(script);
    });

  const handleBuy = async (planId: string, amount?: number) => {
    setError(null);
    setLoadingPlan(planId);
    try {
      if (!amount || amount <= 0) throw new Error('Invalid plan amount');
      await loadRazorpayScript();
      const orderData = await createOrderServiceAPI({ planId, amount });
      if (orderData?.success) {
        const { order, key_id } = orderData?.data ?? {};
        if (!order || !order.id) throw new Error('Invalid order received');

        const options = {
          key: key_id || (process?.env?.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ''),
          amount: order.amount,
          currency: order.currency,
          name: 'MyEasyPage',
          description: `${order.notes?.planName ?? planId.toUpperCase()} Plan Subscription`,
          order_id: order.id,
          handler: async function (response: any) {
            try {
              const verify = await verifyPaymentServiceAPI({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              });
              if (verify?.success) {
                router.push('/admin/plan/success');
              } else {
                setError(verify?.message || 'Verification failed. Please contact support.');
              }
            } catch (e: any) {
              setError(e?.message || 'Payment verification failed');
            } finally {
              setLoadingPlan(null);
            }
          },
          modal: {
            ondismiss: function () {
              setLoadingPlan(null);
            },
          },
          prefill: {
            subdomain: user?.subdomain || '',
            email: user?.email || '',
          },
          theme: { color: '#5b21b6' },
        };

        const rz = new (window as any).Razorpay(options);
        rz.open();

      }
    } catch (err: any) {
      setError(err?.message || 'Payment failed');
      setLoadingPlan(null);
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <main className="py-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <div className={styles.blockHead}>
            <h1 className="section-title">Upgrade Your Plan</h1>
            <p className="section-subtitle text-gray-600">
              Unlock premium layouts, custom domains, and pro-level tools to make your page stand out.
            </p>
          </div>
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-block px-6 py-3 rounded-lg bg-white shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500">Start</div>
              <div className="mt-1 text-lg font-semibold">₹299 / ₹599 officially</div>
              <div className="mt-1 text-indigo-600 font-bold">Offer ₹199 / ₹499 early-bird discount</div>
            </div>
          </div>
          <div className="mt-4 mb-10 text-center">
            <button
              onClick={() => router.push('/admin')}
              className="inline-flex items-center cursor-pointer gap-1 px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Skip for now — use Free Plan
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <p className="text-xs text-gray-400 mt-1">
              You can upgrade anytime from your dashboard.
            </p>
          </div>



          <div className="mb-6">
            <div className="text-sm text-gray-600">Current plan</div>
            <div className="mt-1 text-lg font-semibold">{currentPlanId ? currentPlanId.toUpperCase() : 'FREE'}</div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list" aria-label="Upgrade plans">
            {PlanData.map((plan, i) => (
              <motion.li
                key={plan.id}
                className={clsx(plan.highlight && 'ring-2 ring-indigo-400')}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100 relative h-full">
                  {plan.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {plan.tag}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-left">
                      <div className="text-sm font-medium text-indigo-600">{plan.name}</div>
                      <div className="mt-1 text-2xl font-extrabold">{plan.price}</div>
                      {(plan.official || plan.offer) && (
                        <div className="text-sm text-gray-500 mt-1">
                          {plan.official ? <span className="line-through mr-2">{plan.official}</span> : null}
                          {plan.offer ? <span className="text-indigo-600 font-semibold">{plan.offer}</span> : null}
                        </div>
                      )}
                    </div>

                    <button
                      className={clsx(
                        'px-4 py-2 rounded-md text-sm font-semibold transition',
                        plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-800 text-white hover:bg-gray-900'
                      )}
                      onClick={() => handleBuy(plan.id, (plan as any).amount as number)}
                      disabled={!!loadingPlan || currentPlanId === plan.id}
                      aria-label={`Buy ${plan.name}`}
                    >
                      {currentPlanId === plan.id ? 'Current Plan' : loadingPlan === plan.id ? 'Processing…' : plan.cta}
                    </button>
                  </div>

                  <ul className="space-y-3 text-left">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden
                          className={plan.highlight ? 'text-indigo-600' : 'text-gray-500'}
                        >
                          <path d="M7.5 13.5L4 10l1.2-1.2L7.5 11.1 14.8 3.8 16 5l-8.5 8.5z" fill="currentColor" />
                        </svg>
                        <span className="text-sm text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ul>

          {error && <div className="mt-8 text-red-600 text-sm text-center">{error}</div>}
        </div>
      </main>
    </Suspense>
  );
}
