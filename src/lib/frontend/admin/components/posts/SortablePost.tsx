'use client';

import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Globe,
  EyeOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/post.module.css';

interface Post {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  published: boolean;
}

interface Props {
  id: string;
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}

const SortablePost: FC<Props> = ({ id, post, onEdit, onDelete, onTogglePublish }) => {
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
        <div className={"flex items-start gap-3"}>
          <GripVertical size={18} className="cursor-move text-muted" {...listeners} {...attributes} />
          {
            post.thumbnail &&
            <img
              src={post.thumbnail}
              alt={post.title}
              className={styles.sortablePost_image}
            />
          }
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
          <div className={styles.sortablePost_status}>
            <span
              className={
                post.published
                  ? styles.sortablePost_statusPublished
                  : styles.sortablePost_statusDraft
              }
            >
              {post.published ? 'Published' : 'Draft'}
            </span>
          </div>

          <div className={styles.sortablePost_actions}>
            <button onClick={() => router.push(`/admin/posts/${post.id}`)} className={styles.sortablePost_btn}>
              <ExternalLink size={14} />
              View
            </button>
            <button onClick={onEdit} className={styles.sortablePost_btn}>
              <Pencil size={14} />
              Edit
            </button>
            <button onClick={onTogglePublish} className={styles.sortablePost_btn}>
              {post.published ? (
                <>
                  <EyeOff size={14} />
                  Unpublish
                </>
              ) : (
                <>
                  <Globe size={14} />
                  Publish
                </>
              )}
            </button>
            <button onClick={onDelete} className={styles.sortablePost_deleteBtn}>
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortablePost;
