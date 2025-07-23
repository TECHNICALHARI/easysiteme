// components/LockedFeature.tsx
import React from 'react';
import { Lock } from 'lucide-react';
import { PLAN_FEATURES, PlanType } from '@/config/PLAN_FEATURES';

interface LockedFeatureProps {
  featureKey: keyof typeof PLAN_FEATURES['free'];
  children: React.ReactNode;
}

const LockedFeature: React.FC<LockedFeatureProps> = ({ featureKey, children }) => {
  const userPlan: PlanType = 'free'; // example: 'free', 'pro', or 'premium'
  const featureEnabled = PLAN_FEATURES[userPlan][featureKey];

  if (featureEnabled || typeof featureEnabled === 'number' && featureEnabled > 0) {
    return <>{children}</>;
  }

  return (
    <div className="relative bg-muted p-4 rounded border border-dashed border-gray-300 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Lock className="text-gray-400" size={20} />
        <p className="text-gray-600 text-sm">
          This is a <strong>Premium</strong> feature.
        </p>
        <button className="btn-secondary" onClick={() => window.location.href = '/pricing'}>
          Upgrade Now
        </button>
      </div>
      <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm rounded"></div>
    </div>
  );
};

export default LockedFeature;
