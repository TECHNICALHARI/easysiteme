'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/admin.module.css';
import Modal from '../../../common/Modal';
import type { Embed } from '@/lib/frontend/types/form';
import { isValidHttpUrl, normalizeHttpUrl } from '@/lib/frontend/utils/url';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type Props = {
  onSave: (data: Embed) => void;
  onClose: () => void;
  initialData?: Embed;
};

type FieldErrors = {
  title?: string;
  url?: string;
};

export default function EmbedFormModal({ onSave, onClose, initialData }: Props) {
  const { showToast } = useToast();

  const [title, setTitle] = useState<string>(initialData?.title ?? '');
  const [url, setUrl] = useState<string>(initialData?.url ?? '');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    const next: FieldErrors = {};
    const t = title.trim();

    if (!t) next.title = 'Title is required.';
    else if (t.length < 2) next.title = 'Title must be at least 2 characters.';
    else if (t.length > 120) next.title = 'Title must be 120 characters or less.';

    const u = url.trim();
    if (!u) next.url = 'URL is required.';
    else if (!isValidHttpUrl(normalizeHttpUrl(u))) next.url = 'Enter a valid URL starting with http:// or https://';

    setErrors(next);
    setIsValid(Object.keys(next).length === 0);
  }, [title, url]);

  const handleSave = () => {
    if (!isValid) {
      showToast('Please fix the errors before saving.', 'error');
      return;
    }
    const data: Embed = {
      id: initialData?.id ?? `embed-${Date.now()}`,
      title: title.trim(),
      url: normalizeHttpUrl(url),
    };
    onSave(data);
    showToast(initialData ? 'Embed updated' : 'Embed added', 'success');
  };

  return (
    <Modal title={initialData ? 'Edit Embed' : 'Add Embed'} onClose={onClose} width="500px">
      <div className="flex flex-col gap-4">
        <div>
          <input
            className="input"
            placeholder="Embed Title (e.g. My Video or Calendar)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => setTitle(e.target.value.trim())}
            maxLength={120}
          />
          {errors.title && <span className="errorText">{errors.title}</span>}
        </div>
        <div>
          <input
            className="input"
            placeholder="Embed URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={(e) => setUrl(e.target.value.trim())}
          />
          {errors.url && <span className="errorText">{errors.url}</span>}
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
