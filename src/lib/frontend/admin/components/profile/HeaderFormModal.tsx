'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/admin.module.css';
import Modal from '../../../common/Modal';
import type { Header } from '@/lib/frontend/types/form';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type Props = {
  onSave: (data: Header) => void;
  onClose: () => void;
  initialData?: Header;
};

export function HeaderFormModal({ onSave, onClose, initialData }: Props) {
  const { showToast } = useToast();

  const [title, setTitle] = useState<string>(initialData?.title ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    const t = title.trim();
    if (!t) {
      setError('Header title is required.');
      setIsValid(false);
      return;
    }
    if (t.length < 2) {
      setError('Title must be at least 2 characters.');
      setIsValid(false);
      return;
    }
    if (t.length > 120) {
      setError('Title must be 120 characters or less.');
      setIsValid(false);
      return;
    }
    setError(null);
    setIsValid(true);
  }, [title]);

  const handleSave = () => {
    if (!isValid) {
      showToast('Please fix the errors before saving.', 'error');
      return;
    }
    const data: Header = {
      id: initialData?.id ?? `header-${Date.now()}`,
      title: title.trim(),
    };
    onSave(data);
    showToast(initialData ? 'Header updated' : 'Header added', 'success');
  };

  return (
    <Modal title={initialData ? 'Edit Header' : 'Add Header'} onClose={onClose} width="400px">
      <div className="flex flex-col gap-4">
        <div>
          <input
            className="input"
            placeholder="Header Title"
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => setTitle(e.target.value.trim())}
            maxLength={120}
          />
          {error && <span className="errorText">{error}</span>}
        </div>

        <div className={styles.saveButtonMain}>
          <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!isValid}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
