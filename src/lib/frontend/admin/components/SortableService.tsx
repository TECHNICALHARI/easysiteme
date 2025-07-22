'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';

export default function SortableService({
  id,
  service,
  onEdit,
  onDelete,
}: {
  id: string;
  service: {
    id: string;
    title: string;
    description: string;
    image?: string;
    price?: string;
    link?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.sortableCard}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3">
          <button {...attributes} {...listeners} className="cursor-grab text-gray-400">
            <GripVertical size={18} />
          </button>
          {service.image && (
            <img
              src={service.image}
              alt={service.title}
              className="w-16 h-16 rounded-md object-cover"
            />
          )}
          <div>
            <div className="font-semibold text-base mb-1">{service.title}</div>
            <div className="text-sm text-gray-500 whitespace-pre-wrap">{service.description}</div>
            {service.price && (
              <div className="text-sm text-green-600 mt-1 font-medium">{service.price}</div>
            )}
            {service.link && (
              <a
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline mt-1 inline-block"
              >
                Learn more
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button className={styles.iconBtn} onClick={onEdit}>
            <Pencil size={14} />
          </button>
          <button className={styles.iconBtn} onClick={onDelete}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
