'use client';
import { createContext, useContext } from 'react';
import type { FormData } from '@/lib/frontend/types/form';

type Ctx = {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  isLoading: boolean;
  bootstrapped: boolean;
};

export const AdminFormContext = createContext<Ctx>({
  form: {} as FormData,
  setForm: () => { },
  isLoading: false,
  bootstrapped: false,
});

export const useAdminForm = () => useContext(AdminFormContext);
