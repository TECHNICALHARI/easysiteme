import { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.css';
import Modal from '../../common/Modal';

export default function EmbedFormModal({
  onSave,
  onClose,
  initialData,
}: {
  onSave: (data: { id?: string; title: string; url: string }) => void;
  onClose: () => void;
  initialData?: { id?: string; title: string; url: string };
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required.';
    } else {
      try {
        const parsed = new URL(url.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.url = 'URL must start with http:// or https://';
        }
      } catch {
        newErrors.url = 'Please enter a valid URL.';
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [title, url]);

  const handleSave = () => {
    if (!isValid) return;

    const newData = {
      id: initialData?.id || `embed-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
    };
    onSave(newData);
  };

  return (
    <Modal title={initialData ? 'Edit Embed' : 'Add Embed'} onClose={onClose} width="500px">
      <div className="flex flex-col gap-4">
        <div>
          <input
            className="input"
            placeholder="Embed Title (e.g. My Calendly)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <span className="errorText">{errors.title}</span>
          )}
        </div>
        <div>
          <textarea
            className="input"
           placeholder="Embed URL (https://...)"
            rows={3}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {errors.url && (
            <span className="errorText">{errors.url}</span>
          )}
        </div>
        <div className={styles.saveButtonMain}>
          <button
            className={`btn-primary ${styles.saveButton}`}
            onClick={handleSave}
            disabled={!isValid}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
