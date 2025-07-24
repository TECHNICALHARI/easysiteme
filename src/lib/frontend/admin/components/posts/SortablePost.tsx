'use client';

import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/post.module.css';

interface Post {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface Props {
  id: string;
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}

const SortablePost: FC<Props> = ({ id, post, onEdit, onDelete }) => {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const shortDesc =
    post.description.length > 120
      ? `${post.description.slice(0, 120)}...`
      : post.description;

  return (
    <div ref={setNodeRef} style={style} className={styles.sortablePost_card}>
      <div className={styles.sortablePost_inner}>
        <div className={styles.sortablePost_thumb}>
          <button {...attributes} {...listeners} className={styles.sortablePost_grip}>
            <GripVertical size={18} />
          </button>
          <img
            src={post.thumbnail}
            alt={post.title}
            className={styles.sortablePost_image}
          />
        </div>

        <div className={styles.sortablePost_content}>
          <p className={styles.sortablePost_title}>{post.title}</p>
          <p className={styles.sortablePost_description}>
            {shortDesc}
            {post.description.length > 120 && (
              <button
                onClick={() => router.push(`/admin/posts/${post.id}`)}
                className={styles.sortablePost_readMore}
              >
                Read more
              </button>
            )}
          </p>
        </div>

        <div className={styles.sortablePost_actions}>
          <button
            onClick={() => router.push(`/admin/posts/${post.id}`)}
            className="btn-secondary"
            title="View Post Details"
          >
            <ExternalLink size={14} className="inline-block mr-1" />
            View
          </button>
          <button
            onClick={onEdit}
            className="btn-secondary"
            title="Edit Post"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="btn-destructive"
            title="Delete Post"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortablePost;
