import { createContext, useContext } from 'react';
import type { FormData } from '@/lib/frontend/types/form';
import { PlanType } from '@/config/PLAN_FEATURES';

export const AdminFormContext = createContext<{
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  plan: PlanType;
  isLoading: boolean;
  bootstrapped: boolean;
}>({
  form: {} as FormData,
  setForm: () => {},
  plan: 'free',
  isLoading: true,
  bootstrapped: false,
});

export const useAdminForm = () => useContext(AdminFormContext);
