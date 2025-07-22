'use client';

import { useState, useEffect } from 'react';
import UploadModal from '../../common/UploadModal';
import styles from '@/styles/admin.module.css';
import { ImagePlus, X } from 'lucide-react';
import Modal from '../../common/Modal';

export function TestimonialFormModal({
    onSave,
    onClose,
    initialData,
}: {
    onSave: (data: any) => void;
    onClose: () => void;
    initialData?: {
        name: string;
        message: string;
        avatar?: string;
    };
}) {
    const [name, setName] = useState(initialData?.name || '');
    const [message, setMessage] = useState(initialData?.message || '');
    const [avatar, setAvatar] = useState(initialData?.avatar || '');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = 'Name is required.';
        if (!message.trim()) newErrors.message = 'Message is required.';
        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    }, [name, message]);

    const handleSave = () => {
        if (!isValid) return;
        onSave({ name: name.trim(), message: message.trim(), avatar });
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
                            name='name'
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <span className="errorText">{errors.name}</span>}
                    </div>

                    <div>
                        <textarea
                            className="input"
                            name='message'
                            rows={3}
                            placeholder="Testimonial message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        {errors.message && <span className="errorText">{errors.message}</span>}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className={styles.previewCircle} onClick={() => setShowUploadModal(true)}>
                            {avatar ? (
                                <>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAvatar('');
                                        }}
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
                        <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!isValid}>Save</button>
                    </div>
                </div>
            </Modal>

            {showUploadModal && (
                <UploadModal
                    onClose={() => setShowUploadModal(false)}
                    onSelectImage={(val) => {
                        if (typeof val === 'string') {
                            setAvatar(val);
                        } else {
                            const reader = new FileReader();
                            reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                    setAvatar(reader.result);
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