'use client';

import { useState, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';
import CustomModal from '../../common/CustomModal';
import UploadModal, { staticIconMap } from '../../common/UploadModal';
import styles from '@/styles/admin.module.css';
import Modal from '../../common/Modal';

interface LinkFormModalProps {
  onSave: (data: any) => void;
  onClose: () => void;
  initialData?: {
    title: string;
    url: string;
    highlighted: boolean;
    image?: File | null;
    icon?: string | null;
    id?: string;
  };
}

export default function LinkFormModal({ onSave, onClose, initialData }: LinkFormModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [highlighted, setHighlighted] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [iconName, setIconName] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setUrl(initialData.url || '');
      setHighlighted(initialData.highlighted || false);
      setImage(initialData.image || null);
      setIconName(initialData.icon || null);
    }
  }, [initialData]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(image);
    } else if (iconName) {
      setUploadPreview(iconName);
    } else {
      setUploadPreview(null);
    }
  }, [image, iconName]);

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';

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

    onSave({
      title: title.trim(),
      url: url.trim(),
      highlighted,
      image,
      icon: iconName,
      id: initialData?.id || Date.now().toString(),
    });

    if (!initialData) {
      setTitle('');
      setUrl('');
      setHighlighted(false);
      setImage(null);
      setIconName(null);
      setUploadPreview(null);
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
              placeholder="Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            />
            {errors.url && <span className="errorText">{errors.url}</span>}
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={highlighted}
              name="highlighted"
              onChange={() => setHighlighted(!highlighted)}
            />
            <span>Highlight this link</span>
          </label>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className={styles.previewCircle} onClick={() => setShowUploadModal(true)}>
            {(uploadPreview || image) && (
              <button
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                  setIconName(null);
                  setUploadPreview(null);
                }}
              >
                <X size={14} />
              </button>
            )}
            {uploadPreview ? (
              typeof uploadPreview === 'string' && !image ? (
                (() => {
                  const Icon = staticIconMap[uploadPreview as keyof typeof staticIconMap];
                  return Icon ? <Icon size={36} /> : <div className="text-xs">{uploadPreview}</div>;
                })()
              ) : (
                <img src={uploadPreview} alt="Preview" className={styles.previewImage} />
              )
            ) : (
              <div className={styles.previewPlaceholder}>
                <ImagePlus className="text-gray-400" size={24} />
                <span className="text-xs text-gray-500 mt-1">Upload Thumbnail</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className={styles.saveButtonMain}>
        <button
          className={`btn-primary ${styles.saveButton}`}
          onClick={handleSave}
          disabled={!isValid}
        >
          Save
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSelectImage={(val) => {
            if (typeof val === 'string') {
              setImage(null);
              setIconName(val);
              setUploadPreview(val);
            } else {
              setImage(val);
              setIconName(null);
            }
            setShowUploadModal(false);
          }}
        />
      )}
    </Modal>
  );
}
