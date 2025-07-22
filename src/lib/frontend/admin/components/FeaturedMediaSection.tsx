'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';

export default function SortableFeaturedMediaItem({
    id,
    media,
    onEdit,
    onDelete,
}: {
    id: string;
    media: {
        title: string;
        url: string;
        description?: string;
        ctaLabel?: string;
        ctaLink?: string;
    };
    onEdit: () => void;
    onDelete: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.linkCard}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className='w-7'>
                        <GripVertical
                            className="cursor-move text-muted mt-1"
                            size={18}
                            {...listeners}
                            {...attributes}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="font-medium">{media.title}</div>
                        <a
                            className="text-sm text-blue-600 underline break-all"
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {media.url}
                        </a>

                        {media.description && (
                            <div className="text-sm text-gray-500 mt-1">{media.description}</div>
                        )}

                        {media.ctaLink && media.ctaLabel && (
                            <a
                                href={media.ctaLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary mt-2 w-fit"
                            >
                                {media.ctaLabel}
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className={styles.iconBtn} onClick={onEdit}>
                        <Pencil size={16} />
                    </button>
                    <button className={styles.iconBtn} onClick={onDelete}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
