'use client';

import { useState } from 'react';
import CustomModal from '../../common/CustomModal';
import UploadModal from '../../common/UploadModal';
import styles from '@/styles/admin.module.css';
import { ImagePlus, X } from 'lucide-react';

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

  const handleSave = () => {
    onSave({ title, description, image, price, link });
  };

  return (
    <>
      <CustomModal onClose={onClose} width="500px">
        <h2 className={styles.modalHeader}>{initialData ? 'Edit Service' : 'Add Service'}</h2>
        <div className="flex flex-col gap-4">
          <input
            className="input"
            placeholder="Service Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input"
            rows={3}
            placeholder="Service Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="input"
            placeholder="Price (optional)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            className="input"
            placeholder="Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

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

          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-outline-white" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={!title || !description}>
              Save
            </button>
          </div>
        </div>
      </CustomModal>

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
