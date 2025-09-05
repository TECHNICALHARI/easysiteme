'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import type { FeaturedMedia } from '@/lib/frontend/types/form';

export default function SortableFeaturedMediaItem({
    id,
    media,
    onEdit,
    onDelete,
}: {
    id: string;
    media: FeaturedMedia;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={`${styles.sortableCard}`}>
            <div className="flex items-start gap-4 w-full">
                <div className="flex items-start gap-3 flex-1">
                    <button
                        {...attributes}
                        {...listeners}
                        className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab flex-shrink-0"
                        aria-label="Drag to reorder"
                    >
                        <GripVertical size={18} />
                    </button>

                    <div className="flex flex-col">
                        <div className="font-semibold text-base">{media.title}</div>
                        <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 underline break-all"
                        >
                            {media.url}
                        </a>

                        {media.description && (
                            <div className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">
                                {media.description}
                            </div>
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

                <div className="flex gap-2 flex-shrink-0 mt-1">
                    <button className={"p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-brand transition"} onClick={onEdit} aria-label="Edit featured media">
                        <Pencil size={14} />
                    </button>
                    <button className={"p-1 rounded hover:bg-red-50 text-red-500 transition"} onClick={onDelete} aria-label="Delete featured media">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
