'use client';

import { useState, useEffect } from 'react';
import UploadModal from '../../common/UploadModal';
import styles from '@/styles/admin.module.css';
import { ImagePlus, X } from 'lucide-react';
import Modal from '../../common/Modal';

export default function ServiceFormModal({
  onSave,
  onClose,
  initialData,
}: {
  onSave: (data: any) => void;
  onClose: () => void;
  initialData?: {
    title: string;
    description: string;
    image?: string;
    price?: string;
    link?: string;
  };
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [link, setLink] = useState(initialData?.link || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string; link?: string }>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';

    if (link.trim()) {
      try {
        const parsed = new URL(link.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.link = 'Link must start with http:// or https://';
        }
      } catch {
        newErrors.link = 'Please enter a valid URL.';
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [title, description, link]);

  const handleSave = () => {
    if (!isValid) return;
    onSave({ title: title.trim(), description: description.trim(), image, price: price.trim(), link: link.trim() });
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
              placeholder="Link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            {errors.link && <span className="errorText">{errors.link}</span>}
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
