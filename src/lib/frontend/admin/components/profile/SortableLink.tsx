'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import { staticIconMap } from '../../../common/UploadModal';

export default function SortableLink({ id, link, onDelete, onEdit }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const Icon = link.icon ? staticIconMap[link.icon as keyof typeof staticIconMap] : null;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.linkItem} ${link.highlighted ? 'bg-violet-50 border-brand' : 'bg-white'}`}
    >
      <div className="flex items-start gap-4 flex-1">
        <GripVertical size={18} className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab flex-shrink-0" {...listeners} {...attributes} />
        <div>
          <p className="font-semibold text-base pr-2">{link.title}</p>
          <a href={link.url} target="_blank" className="text-sm text-brand hover:underline break-all">
            {link.url}
          </a>
          {link.highlighted && (
            <span className="text-xs text-green-600 font-medium ml-1">Highlighted</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {link.image && (
          <img
            src={URL.createObjectURL(link.image)}
            alt="preview"
            className={styles.linkThumbnail}
          />
        )}
        {!link.image && Icon && (
          <div className={styles.linkThumbnail}>
            <Icon size={24} />
          </div>
        )}
        <button onClick={onEdit} title="Edit">
          <Pencil size={16} className="text-brand cursor-pointer" />
        </button>
        <button onClick={onDelete} title="Delete">
          <Trash2 size={16} className="text-red-500 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
