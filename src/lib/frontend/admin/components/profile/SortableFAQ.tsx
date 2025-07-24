'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';

export default function SortableFAQ({ id, faq, onEdit, onDelete }: {
  id: string;
  faq: { id: string; question: string; answer: string };
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
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2">
          <button {...attributes} {...listeners} className="cursor-grab text-gray-400">
            <GripVertical size={18} />
          </button>
          <div>
            <div className="font-medium text-base">{faq.question}</div>
            <div className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{faq.answer}</div>
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
