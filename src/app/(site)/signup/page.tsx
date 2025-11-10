'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/main.module.css';
import SignupForm from '@/lib/frontend/main/auth/SignupForm';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import { formatPhoneToE164 } from '@/lib/frontend/utils/common';
import { signupApi, checkSubdomainApi } from '@/lib/frontend/api/services';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<AuthSignupData>({
    subdomain: '',
    email: '',
    mobile: '',
    countryCode: '+91',
    password: '',
    showPass: false,
    emailVerified: false,
    mobileVerified: false,
    emailOtp: '',
    mobileOtp: '',
  });

  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const defaultSub = searchParams.get('u');
    if (defaultSub) {
      setFormData((prev) => ({ ...prev, subdomain: defaultSub.toLowerCase() }));
      checkSubdomain(defaultSub.toLowerCase());
    }
  }, [searchParams]);

  const checkSubdomain = async (name: string) => {
    if (!name) return setSubdomainAvailable(null);
    setCheckingSubdomain(true);
    try {
      const res = await checkSubdomainApi(name);
      if (res?.success && typeof res.data?.available !== 'undefined') {
        setSubdomainAvailable(Boolean(res.data.available));
      } else {
        setSubdomainAvailable(null);
      }
    } catch {
      setSubdomainAvailable(null);
    } finally {
      setCheckingSubdomain(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const mobileE164 = formatPhoneToE164(formData.mobile);
      const payload: any = {
        subdomain: formData.subdomain,
        password: formData.password,
      };
      if (formData.email) payload.email = formData.email;
      if (mobileE164) {
        payload.mobile = mobileE164;
        payload.countryCode = formData.countryCode;
      }
      const res = await signupApi(payload);
      if (res?.success) {
        showToast('Signup successful! Redirecting...', 'success');
        setTimeout(() => {
          router.push('/admin/plan');
        }, 500);
      } else {
        showToast(res?.message || 'Signup failed', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Something went wrong. Try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${styles.authPage} section`}>
      <div className="container flex justify-center items-center">
        <SignupForm
          formData={formData}
          setFormData={setFormData}
          checking={checkingSubdomain}
          subdomainAvailable={subdomainAvailable}
          checkSubdomain={checkSubdomain}
          onNext={handleSubmit}
          loading={loading}
        />
      </div>
    </main>
  );
}
