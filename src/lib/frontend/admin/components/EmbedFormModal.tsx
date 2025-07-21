import { useState, useEffect } from 'react';
import CustomModal from '../../common/CustomModal';
import styles from '@/styles/admin.module.css';

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
    <CustomModal onClose={onClose} width="500px">
      <div className="flex flex-col gap-4">
        <h2 className={styles.modalHeader}>
          {initialData ? 'Edit Embed' : 'Add Embed'}
        </h2>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Embed Title</label>
          <input
            className="input"
            placeholder="e.g. My Calendly"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <span className="text-xs text-red-500">{errors.title}</span>
          )}
        </div>

        {/* URL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Embed URL</label>
          <textarea
            className="input"
            placeholder="https://..."
            rows={3}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {errors.url && (
            <span className="text-xs text-red-500">{errors.url}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className={`btn-outline-white ${styles.cancelBtn}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`btn-primary ${styles.saveButton}`}
            onClick={handleSave}
            disabled={!isValid}
          >
            Save
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
