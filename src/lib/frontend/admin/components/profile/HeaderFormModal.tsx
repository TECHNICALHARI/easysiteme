import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css"
import Modal from "../../../common/Modal";
export function HeaderFormModal({
    onSave,
    onClose,
    initialData,
}: {
    onSave: (data: any) => void;
    onClose: () => void;
    initialData?: { title: string };
}) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const trimmed = title.trim();
        if (!trimmed) {
            setError('Header title is required.');
            setIsValid(false);
        } else {
            setError(null);
            setIsValid(true);
        }
    }, [title]);

    const handleSave = () => {
        if (!isValid) return;
        onSave({ title: title.trim() });
    };

    return (
        <Modal title={initialData ? 'Edit Header' : 'Add Header'} onClose={onClose} width="400px">
            <div className="flex flex-col gap-4">
                <div>
                    <input
                        className="input"
                        placeholder="Header Title"
                        value={title}
                        name="title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {error && <span className="errorText">{error}</span>}
                </div>

                <div className={styles.saveButtonMain}>
                    <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!isValid}>Save</button>
                </div>
            </div>
        </Modal>
    );
}
