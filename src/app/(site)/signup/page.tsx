'use client';

import { useState } from 'react';
import styles from '@/styles/main.module.css';
import SignupForm from '@/lib/frontend/main/auth/SignupForm';
import VerifySignupOtpForm from '@/lib/frontend/main/auth/VerifySignupOtpForm';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    subdomain: '',
    otp: '',
    showPass: false,
  });

  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<null | boolean>(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const checkSubdomain = async (name: string) => {
    setSubdomainAvailable(true); // Set subdomain as available initially
    if (!name) return setSubdomainAvailable(null);
    // setCheckingSubdomain(true);
    // try {
    //   const res = await fetch(`/api/check-subdomain?subdomain=${encodeURIComponent(name)}`);
    //   const data = await res.json();
    //   setSubdomainAvailable(data.available);
    // } catch {
    //   setSubdomainAvailable(null);
    // } finally {
    //   setCheckingSubdomain(false);
    // }
  };

  const handleNext = () => {
    if (!formData.subdomain) return alert('Choose a subdomain');
    if (subdomainAvailable === false) return alert('Subdomain is taken');
    if (!formData.password) return alert('Set a password');
    setStep(2);
  };

  const handleOtpVerify = async () => {
    setVerifyingOtp(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result.success) {
        window.location.href = '/admin';
      } else {
        alert(result.message || 'Invalid OTP');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <main className={`${styles.authPage} section`}>
      <div className="container flex justify-center items-center">
        {step === 1 ? (
          <SignupForm
            formData={formData}
            setFormData={setFormData}
            checking={checkingSubdomain}
            subdomainAvailable={subdomainAvailable}
            checkSubdomain={checkSubdomain}
            onNext={handleNext}
          />
        ) : (
          <VerifySignupOtpForm
            formData={formData}
            setFormData={setFormData}
            verifying={verifyingOtp}
            onVerify={handleOtpVerify}
            onBack={() => setStep(1)}
          />
        )}
      </div>
    </main>
  );
}
