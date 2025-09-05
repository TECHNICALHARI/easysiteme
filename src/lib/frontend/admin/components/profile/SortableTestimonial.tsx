'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';

export default function SortableTestimonial({
  id,
  testimonial,
  onEdit,
  onDelete,
}: {
  id: string;
  testimonial: { id: string; name: string; message: string; avatar?: string };
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sortableCard} flex justify-between items-start gap-4`}
    >
      <div className="flex items-start gap-4 flex-1">
        <button
          {...listeners}
          {...attributes}
          className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab flex-shrink-0"
        >
          <GripVertical size={18} />
        </button>

        {testimonial.avatar && (
          <div className="w-12 h-12 flex-shrink-0">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <p className="font-semibold text-base leading-snug">{testimonial.name}</p>
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-line leading-relaxed">
            {testimonial.message}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0 mt-1">
        <button
          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-brand transition"
          onClick={onEdit}
        >
          <Pencil size={16} />
        </button>
        <button
          className="p-1 rounded hover:bg-red-50 text-red-500 transition"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
