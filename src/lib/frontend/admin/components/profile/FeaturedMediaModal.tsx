'use client';

import { useEffect, useState } from 'react';
import Modal from '../../../common/Modal';
import styles from '@/styles/admin.module.css';
import { FeaturedMedia } from '@/lib/frontend/types/form';
import { isValidHttpUrl, normalizeHttpUrl } from '@/lib/frontend/utils/url';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type Props = {
  onClose: () => void;
  onSave: (data: FeaturedMedia) => void;
  initialData?: FeaturedMedia;
};

type FieldErrors = {
  title?: string;
  url?: string;
  ctaLink?: string;
};

export default function FeaturedMediaModal({ onClose, onSave, initialData }: Props) {
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [ctaLabel, setCtaLabel] = useState(initialData?.ctaLabel || '');
  const [ctaLink, setCtaLink] = useState(initialData?.ctaLink || '');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const next: FieldErrors = {};

    const t = title.trim();
    if (!t) next.title = 'Title is required.';
    else if (t.length > 120) next.title = 'Title must be 120 characters or less.';

    const mediaUrl = url.trim();
    if (!mediaUrl) {
      next.url = 'URL is required.';
    } else if (!isValidHttpUrl(mediaUrl)) {
      next.url = 'Enter a valid URL starting with http:// or https://';
    }

    const cta = ctaLink.trim();
    if (cta && !isValidHttpUrl(cta)) {
      next.ctaLink = 'CTA link must start with http:// or https://';
    }

    setErrors(next);
    setIsValid(Object.keys(next).length === 0);
  }, [title, url, ctaLink]);

  const handleSave = () => {
    if (!isValid) {
      showToast('Please fix the errors before saving.', 'error');
      return;
    }

    const data: FeaturedMedia = {
      id: initialData?.id || `featured-${Date.now()}`,
      title: title.trim(),
      url: normalizeHttpUrl(url),
      description: description.trim() || undefined,
      ctaLabel: ctaLabel.trim() || undefined,
      ctaLink: ctaLink.trim() ? normalizeHttpUrl(ctaLink) : undefined,
    };

    onSave(data);
    showToast(initialData ? 'Featured media updated' : 'Featured media added', 'success');
  };

  return (
    <Modal
      title={initialData ? 'Edit Featured Media' : 'Add Featured Media'}
      onClose={onClose}
      width="500px"
    >
      <div className="flex flex-col gap-4">
        <div>
          <input
            className="input"
            placeholder="Media Title (e.g. Product teaser video)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => setTitle(e.target.value.trim())}
            maxLength={120}
          />
          {errors.title && <p className="errorText">{errors.title}</p>}
        </div>

        <div>
          <input
            className="input"
            placeholder="Media URL (https://youtube.com/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={(e) => setUrl(e.target.value.trim())}
          />
          {errors.url && <p className="errorText">{errors.url}</p>}
        </div>

        <textarea
          className="input"
          rows={3}
          placeholder="Optional: Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={800}
        />

        <input
          className="input"
          placeholder="Optional: CTA Button Label (e.g. Watch Now)"
          value={ctaLabel}
          onChange={(e) => setCtaLabel(e.target.value)}
          onBlur={(e) => setCtaLabel(e.target.value.trim())}
          maxLength={40}
        />

        <div>
          <input
            className="input"
            placeholder="Optional: CTA Button Link (https://...)"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            onBlur={(e) => setCtaLink(e.target.value.trim())}
          />
          {errors.ctaLink && <p className="errorText">{errors.ctaLink}</p>}
        </div>

        <div className={styles.saveButtonMain}>
          <button
            className={`btn-primary ${styles.saveButton}`}
            onClick={handleSave}
            disabled={!isValid}
            aria-label="Save featured media"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
