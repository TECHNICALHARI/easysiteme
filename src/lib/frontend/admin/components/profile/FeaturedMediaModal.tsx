'use client';

import { useEffect, useState } from 'react';
import Modal from '../../../common/Modal';
import styles from '@/styles/admin.module.css';

export default function FeaturedMediaModal({
  onClose,
  onSave,
  initialData,
}: {
  onClose: () => void;
  onSave: (data: {
    id?: string;
    title: string;
    url: string;
    description?: string;
    ctaLabel?: string;
    ctaLink?: string;
  }) => void;
  initialData?: {
    id?: string;
    title: string;
    url: string;
    description?: string;
    ctaLabel?: string;
    ctaLink?: string;
  };
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [ctaLabel, setCtaLabel] = useState(initialData?.ctaLabel || '');
  const [ctaLink, setCtaLink] = useState(initialData?.ctaLink || '');
  const [errors, setErrors] = useState<{ title?: string; url?: string; ctaLink?: string }>({});
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

    if (ctaLink.trim()) {
      try {
        const parsed = new URL(ctaLink.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.ctaLink = 'CTA link must start with http:// or https://';
        }
      } catch {
        newErrors.ctaLink = 'Enter a valid CTA URL or leave blank.';
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [title, url, ctaLink]);

  const handleSave = () => {
    if (!isValid) return;
    const data = {
      id: initialData?.id || `featured-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      ctaLabel: ctaLabel.trim() || undefined,
      ctaLink: ctaLink.trim() || undefined,
    };
    onSave(data);
  };

  return (
    <Modal title={initialData ? 'Edit Featured Media' : 'Add Featured Media'} onClose={onClose} width="500px">
      <div className="flex flex-col gap-4">
        <div>
          <input
            className="input"
            placeholder="Media Title (e.g. My YouTube video)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="errorText">{errors.title}</p>}
        </div>

        <div>
          <input
            className="input"
            placeholder="Media URL (https://youtube.com/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {errors.url && <p className="errorText">{errors.url}</p>}
        </div>

        <textarea
          className="input"
          rows={3}
          placeholder="Optional: Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="input"
          placeholder="Optional: CTA Button Label (e.g. Watch Now)"
          value={ctaLabel}
          onChange={(e) => setCtaLabel(e.target.value)}
        />

        <input
          className="input"
          placeholder="Optional: CTA Button Link (https://...)"
          value={ctaLink}
          onChange={(e) => setCtaLink(e.target.value)}
        />
        {errors.ctaLink && <p className="errorText">{errors.ctaLink}</p>}

        <div className={styles.saveButtonMain}>
          <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!isValid}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
