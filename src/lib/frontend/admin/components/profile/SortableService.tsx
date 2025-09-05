'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import { Service } from '@/lib/frontend/types/form';

export default function SortableService({
  id,
  service,
  onEdit,
  onDelete,
}: {
  id: string;
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const displayPrice = service.amount
    ? `${service.currencySymbol || ''}${service.amount}`
    : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sortableCard} flex justify-between items-start gap-4`}
    >
      <div className="flex items-start gap-4 flex-1">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab flex-shrink-0"
        >
          <GripVertical size={18} />
        </button>

        {service.image && (
          <div className="w-12 h-12 flex-shrink-0">
            <img
              src={service.image}
              alt={service.title}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="font-semibold text-base leading-snug">{service.title}</div>
          <div className="text-sm text-gray-500 whitespace-pre-wrap leading-relaxed mt-1">
            {service.description}
          </div>

          {displayPrice && (
            <div className="text-sm text-green-600 font-medium mt-1">{displayPrice}</div>
          )}

          {service.ctaLink && (
            <a
              href={service.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline mt-1 inline-block"
            >
              {service.ctaLabel || 'Learn more'}
            </a>
          )}
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
