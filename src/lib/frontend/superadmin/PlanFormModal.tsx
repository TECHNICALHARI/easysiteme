'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/superadmin.module.css';
import CustomModal from '@/lib/frontend/common/CustomModal';

export default function PlanFormModal({
  onClose,
  onSave,
  initialData,
}: {
  onClose: () => void;
  onSave: (plan: any) => void;
  initialData?: any;
}) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    features: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        price: initialData.price || '',
        features: initialData.features || '',
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <CustomModal onClose={onClose} width="500px">
      <h2 className="text-lg font-bold text-brand mb-4">
        {initialData ? 'Edit Plan' : 'Add New Plan'}
      </h2>

      <div className="grid gap-4">
        <input
          className={styles.input}
          placeholder="Plan Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Price (e.g., ₹199/year)"
          value={form.price}
          onChange={(e) => handleChange('price', e.target.value)}
        />
        <textarea
          className={styles.input}
          placeholder="Comma-separated features"
          rows={3}
          value={form.features}
          onChange={(e) => handleChange('features', e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <button className="text-sm text-muted" onClick={onClose}>
          Cancel
        </button>
        <button
          className={styles.btnPrimary}
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          {initialData ? 'Update' : 'Save'}
        </button>
      </div>
    </CustomModal>
  );
}
