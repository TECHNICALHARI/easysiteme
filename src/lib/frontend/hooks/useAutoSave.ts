import { useEffect, useRef } from 'react';

export function useAutoSave(form: any) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestForm = useRef(form);

  useEffect(() => {
    latestForm.current = form;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      saveData(latestForm.current);
    }, 1000); // ⏱ debounce: 1 second
  }, [form]);

  const saveData = async (data: any) => {
    try {
      await fetch('/api/dashboard/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      // Optionally: show "Saved!" toast
    } catch (error) {
      console.error('Auto-save error:', error);
      // Optionally: show error toast
    }
  };
}
