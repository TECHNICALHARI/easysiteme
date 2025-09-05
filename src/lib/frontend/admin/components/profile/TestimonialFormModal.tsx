'use client';

import { useEffect, useState } from 'react';
import UploadModal from '../../../common/UploadModal';
import styles from '@/styles/admin.module.css';
import { ImagePlus, X } from 'lucide-react';
import Modal from '../../../common/Modal';
import type { Testimonial } from '@/lib/frontend/types/form';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type Props = {
  onSave: (data: Testimonial) => void;
  onClose: () => void;
  initialData?: Testimonial;
};

export function TestimonialFormModal({ onSave, onClose, initialData }: Props) {
  const { showToast } = useToast();

  const [name, setName] = useState<string>(initialData?.name ?? '');
  const [message, setMessage] = useState<string>(initialData?.message ?? '');
  const [avatar, setAvatar] = useState<string>(initialData?.avatar ?? '');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    const next: { name?: string; message?: string } = {};
    const n = name.trim();
    const m = message.trim();

    if (!n) next.name = 'Name is required.';
    else if (n.length < 2) next.name = 'Name must be at least 2 characters.';
    else if (n.length > 80) next.name = 'Name must be 80 characters or less.';

    if (!m) next.message = 'Message is required.';
    else if (m.length < 8) next.message = 'Message must be at least 8 characters.';
    else if (m.length > 500) next.message = 'Message must be 500 characters or less.';

    setErrors(next);
    setIsValid(Object.keys(next).length === 0);
  }, [name, message]);

  const handleSave = () => {
    if (!isValid) {
      showToast('Please fix the errors before saving.', 'error');
      return;
    }
    const data: Testimonial = {
      id: initialData?.id ?? `testimonial-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      avatar: avatar || undefined,
    };
    onSave(data);
    showToast(initialData ? 'Testimonial updated' : 'Testimonial added', 'success');
  };

  return (
    <>
      <Modal title={initialData ? 'Edit Testimonial' : 'Add Testimonial'} onClose={onClose} width="500px">
        <div className="flex flex-col gap-4">
          <div>
            <input
              className="input"
              placeholder="Name"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => setName(e.target.value.trim())}
              maxLength={80}
            />
            {errors.name && <span className="errorText">{errors.name}</span>}
          </div>

          <div>
            <textarea
              className="input"
              name="message"
              rows={4}
              placeholder="Testimonial message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onBlur={(e) => setMessage(e.target.value.trim())}
              maxLength={500}
            />
            {errors.message && <span className="errorText">{errors.message}</span>}
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
              {avatar ? (
                <>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAvatar('');
                      showToast('Avatar removed.', 'success');
                    }}
                    aria-label="Remove avatar"
                  >
                    <X size={14} />
                  </button>
                  <img src={avatar} alt="Avatar" className={styles.previewImage} />
                </>
              ) : (
                <div className={styles.previewPlaceholder}>
                  <ImagePlus className="text-gray-400" size={24} />
                  <span className="text-xs text-gray-500 mt-1">Upload Avatar</span>
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
              setAvatar(val);
              showToast('Icon selected as avatar.', 'success');
            } else {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  setAvatar(reader.result);
                  showToast('Avatar uploaded.', 'success');
                }
              };
              reader.readAsDataURL(val);
            }
            setShowUploadModal(false);
          }}
          showTabs={false}
          type="image"
        />
      )}
    </>
  );
}
