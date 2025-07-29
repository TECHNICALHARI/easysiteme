'use client';

import { useEffect, useState } from 'react';
import Modal from '../../../common/Modal';
import RichTextEditor from '../../../common/RichTextEditor';

interface ManageSubscribersModalProps {
    onClose: () => void;
    onSave: (data: { subject: string; thankYouMessage: string; hideSubscribeButton: boolean }) => void;
    initialData?: {
        subject: string;
        thankYouMessage: string;
        hideSubscribeButton: boolean;
    };
}

const ManageSubscribersModal: React.FC<ManageSubscribersModalProps> = ({ onClose, onSave, initialData }) => {
    const [subject, setSubject] = useState<string>(initialData?.subject || '');
    const [thankYouMessage, setThankYouMessage] = useState<string>(initialData?.thankYouMessage || '');
    const [hideSubscribeButton, setHideSubscribeButton] = useState<boolean>(initialData?.hideSubscribeButton || false);
    const [isValid, setIsValid] = useState<boolean>(false);

    useEffect(() => {
        setIsValid(subject.trim() !== '');
    }, [subject]);

    const handleSave = () => {
        if (isValid) {
            onSave({ subject, thankYouMessage, hideSubscribeButton });
            onClose();
        }
    };

    return (
        <Modal title="Manage Subscriber Settings" onClose={onClose} width="500px">
            <div className="flex flex-col gap-4">
                <div>
                    <input
                        className="input"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                <div>
                    <RichTextEditor
                        value={thankYouMessage}
                        onChange={setThankYouMessage}
                        placeholder="Thank You Message"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={hideSubscribeButton}
                        onChange={() => setHideSubscribeButton(!hideSubscribeButton)}
                    />
                    <label className="ml-2">Hide Subscribe Button from Page</label>
                </div>
                <div className="flex justify-end">
                    <button className="btn-primary" onClick={handleSave} disabled={!isValid}>
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ManageSubscribersModal;
