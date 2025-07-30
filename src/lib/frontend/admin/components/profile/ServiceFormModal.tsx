'use client';

import { useState, useEffect } from 'react';
import UploadModal from '../../../common/UploadModal';
import styles from '@/styles/admin.module.css';
import { ImagePlus, X } from 'lucide-react';
import Modal from '../../../common/Modal';
import { Service } from '@/lib/frontend/types/form';

export default function ServiceFormModal({
  onSave,
  onClose,
  initialData,
}: {
  onSave: (data: Service) => void;
  onClose: () => void;
  initialData?: Service;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState<string>(initialData?.price || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [ctaLabel, setCtaLabel] = useState(initialData?.ctaLabel || '');
  const [ctaLink, setCtaLink] = useState(initialData?.ctaLink || '');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string; ctaLink?: string }>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';

    if (ctaLink.trim()) {
      try {
        const parsed = new URL(ctaLink.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.ctaLink = 'CTA Link must start with http:// or https://';
        }
      } catch {
        newErrors.ctaLink = 'Please enter a valid CTA URL.';
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [title, description, ctaLink]);

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      image,
      price,
      ctaLabel: ctaLabel.trim(),
      ctaLink: ctaLink.trim(),
    });
  };

  return (
    <>
      <Modal title={initialData ? 'Edit Service' : 'Add Service'} onClose={onClose} width="500px">
        <div className="flex flex-col gap-4">
          <div>
            <input
              className="input"
              placeholder="Service Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="errorText">{errors.title}</span>}
          </div>

          <div>
            <textarea
              className="input"
              rows={3}
              placeholder="Service Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <span className="errorText">{errors.description}</span>}
          </div>

          <input
            className="input"
            placeholder="Price (optional)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div>
            <input
              className="input"
              placeholder="CTA Button Label (optional)"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
            />
          </div>

          <div>
            <input
              className="input"
              placeholder="CTA Button Link (optional)"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
            />
            {errors.ctaLink && <span className="errorText">{errors.ctaLink}</span>}
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <div className={styles.previewCircle} onClick={() => setShowUploadModal(true)}>
              {image ? (
                <>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage('');
                    }}
                  >
                    <X size={14} />
                  </button>
                  <img src={image} alt="Service Image" className={styles.previewImage} />
                </>
              ) : (
                <div className={styles.previewPlaceholder}>
                  <ImagePlus className="text-gray-400" size={24} />
                  <span className="text-xs text-gray-500 mt-1">Upload Image</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.saveButtonMain}>
            <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!isValid}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSelectImage={(val) => {
            if (typeof val === 'string') {
              setImage(val);
            } else {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  setImage(reader.result);
                }
              };
              reader.readAsDataURL(val);
            }
            setShowUploadModal(false);
          }}
          showTabs={false}
        />
      )}
    </>
  );
}
