'use client';

import { X } from 'lucide-react';
import styles from '@/styles/admin.module.css';

export default function ProfileTagsSection({
    form,
    setForm,
    limit = 20,
}: {
    form: any;
    setForm: (f: any) => void;
    limit?: number;
}) {
    const tags = form.tags || [];

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = (e.currentTarget.value || '').trim();
            if (val && !tags.includes(val) && tags.length < limit) {
                setForm({ ...form, tags: [...tags, val] });
                e.currentTarget.value = '';
            }
        }
    };

    const handleRemoveTag = (index: number) => {
        const updated = tags.filter((_tag: string, i: number) => i !== index);
        setForm({ ...form, tags: updated });
    };

    return (
        <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
                <h4>Tags / Skills / Interests  {tags.length >= limit && <span className="badge-pro">Pro</span>}</h4>
            </div>

            <input
                type="text"
                className="input"
                placeholder="Type and press Enter (e.g. JavaScript, Public Speaking)"
                onKeyDown={handleAddTag}
                disabled={tags.length >= limit}
            />

            {tags.length >= limit && (
                <p className="text-sm text-red-500 mt-1">You’ve reached the tag limit for your plan.</p>
            )}

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag: string, index: number) => (
                        <div
                            key={index}
                            className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-full flex items-center"
                        >
                            {tag}
                            <button
                                type="button"
                                className="ml-2 hover:text-red-600"
                                onClick={() => handleRemoveTag(index)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
