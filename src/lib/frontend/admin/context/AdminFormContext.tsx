'use client';
import { createContext, useContext } from 'react';
import { FormData } from '@/lib/frontend/types/form';

export const AdminFormContext = createContext<{
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}>({
  form: {} as FormData,
  setForm: () => {},
});

export const useAdminForm = () => useContext(AdminFormContext);
