'use client';

import { useState, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Modal from '../../../common/Modal';
import UploadModal, { staticIconMap } from '../../../common/UploadModal';
import styles from '@/styles/admin.module.css';
import { isValidHttpUrl, normalizeHttpUrl } from '@/lib/frontend/utils/url';
import type { Link as LinkType } from '@/lib/frontend/types/form';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type LinkFormModalProps = {
  onSave: (data: LinkType) => void;
  onClose: () => void;
  initialData?: LinkType;
};

type FieldErrors = {
  title?: string;
  url?: string;
};

export default function LinkFormModal({ onSave, onClose, initialData }: LinkFormModalProps) {
  const { showToast } = useToast();

  const [title, setTitle] = useState<string>(initialData?.title ?? '');
  const [url, setUrl] = useState<string>(initialData?.url ?? '');
  const [highlighted, setHighlighted] = useState<boolean>(initialData?.highlighted ?? false);
  const [image, setImage] = useState<File | null>((initialData?.image as File | null) ?? null);
  const [iconName, setIconName] = useState<keyof typeof staticIconMap | null>(
    (initialData?.icon as keyof typeof staticIconMap | null) ?? null
  );

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => setPreviewSrc(reader.result as string);
      reader.readAsDataURL(image);
    } else {
      setPreviewSrc(null);
    }
  }, [image]);

  useEffect(() => {
    const next: FieldErrors = {};

    const t = title.trim();
    if (!t) next.title = 'Title is required.';

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

    const data: LinkType = {
      id: initialData?.id ?? `link-${Date.now()}`,
      title: title.trim(),
      url: normalizeHttpUrl(url),
      highlighted,
      image: image ?? null,
      icon: iconName ?? null,
    };

    onSave(data);
    showToast(initialData ? 'Link updated' : 'Link added', 'success');

    if (!initialData) {
      setTitle('');
      setUrl('');
      setHighlighted(false);
      setImage(null);
      setIconName(null);
      setPreviewSrc(null);
    }
  };

  return (
    <Modal title={initialData ? 'Edit Link' : 'Add Link'} onClose={onClose} width="600px">
      <div className={styles.linkFormInputImg}>
        <div className="flex flex-col gap-3">
          <div>
            <input
              className="input"
              type="text"
              placeholder="Link title (e.g., Portfolio, Store, Contact)"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={(e) => setTitle(e.target.value.trim())}
            />
            {errors.title && <span className="errorText">{errors.title}</span>}
          </div>

          <div>
            <input
              className="input"
              type="url"
              name="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={(e) => setUrl(e.target.value.trim())}
            />
            {errors.url && <span className="errorText">{errors.url}</span>}
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={highlighted}
              name="highlighted"
              onChange={() => setHighlighted((v) => !v)}
            />
            <span>Highlight this link</span>
          </label>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={styles.previewCircle}
            onClick={() => setShowUploadModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setShowUploadModal(true);
            }}
          >
            {(previewSrc || iconName) && (
              <button
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                  setIconName(null);
                  setPreviewSrc(null);
                }}
                aria-label="Remove thumbnail or icon"
              >
                <X size={14} />
              </button>
            )}

            {previewSrc ? (
              <img src={previewSrc} alt="Preview" className={styles.previewImage} />
            ) : iconName ? (
              (() => {
                const Icon = staticIconMap[iconName];
                return Icon ? <Icon size={36} /> : <div className="text-xs">{String(iconName)}</div>;
              })()
            ) : (
              <div className={styles.previewPlaceholder}>
                <ImagePlus className="text-gray-400" size={24} />
                <span className="text-xs text-gray-500 mt-1">Upload Thumbnail</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.saveButtonMain}>
        <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!isValid}>
          Save
        </button>
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSelectImage={(val) => {
            if (typeof val === 'string') {
              setImage(null);
              setIconName(val as keyof typeof staticIconMap);
              setPreviewSrc(null);
            } else {
              setImage(val);
              setIconName(null);
            }
            setShowUploadModal(false);
          }}
          showTabs
          type="image"
        />
      )}
    </Modal>
  );
}
