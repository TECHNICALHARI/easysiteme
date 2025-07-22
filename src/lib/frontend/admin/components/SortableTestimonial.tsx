'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';

export default function SortableTestimonial({ id, testimonial, onEdit, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.linkItem}>
      <div className="flex gap-3 items-start">
        <GripVertical
          size={18}
          className="cursor-move text-muted mt-1"
          {...listeners}
          {...attributes}
        />
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{testimonial.message}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="text-gray-500 hover:text-brand" onClick={onEdit}>
          <Pencil size={16} />
        </button>
        <button className="text-red-500" onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
