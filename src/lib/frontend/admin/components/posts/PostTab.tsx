'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useRouter } from 'next/navigation';
import styles from '@/styles/admin.module.css';
import LockedOverlay from '@/lib/frontend/admin/layout/LockedOverlay';
import SortablePost from './SortablePost';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { listPosts, deletePost, togglePublishPost } from '@/lib/frontend/api/services';

const Section = ({ title, sub, right, children }: {
  title?: React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className={styles.sectionMain}>
    {(title || right) && (
      <div className={styles.SecHeadAndBtn}>
        {title && <h4 className={styles.sectionLabel}>{title}</h4>}
        {right}
      </div>
    )}
    {sub && <p className="text-sm text-muted mb-2">{sub}</p>}
    {children}
  </div>
);

function normalizePost(raw: any) {
  const id = (raw?.postId as string) ?? (raw?.id as string) ?? '';
  return {
    id,
    title: raw.title ?? '',
    slug: raw.slug ?? '',
    description: raw.description ?? '',
    content: raw.content ?? '',
    thumbnail: raw.thumbnail ?? '',
    seoTitle: raw.seoTitle ?? '',
    seoDescription: raw.seoDescription ?? '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    published: Boolean(raw.published),
    ...raw,
  };
}

export default function PostTab() {
  const router = useRouter();
  const { form, setForm, plan } = useAdminForm();
  const [loading, setLoading] = useState(false);

  const posts = form?.posts?.posts || [];
  const limits = PLAN_FEATURES[plan];
  const isPostsEnabled = limits.posts > 0;
  const postsLimitReached = posts.length >= limits.posts;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await listPosts();
        if (!mounted) return;
        const rawPosts = res?.data?.posts ?? [];
        const normalized = rawPosts.map(normalizePost);
        setForm((prev) => ({ ...prev, posts: { posts: normalized } }));
      } catch {
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [setForm]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id || active.id === over.id) return;
    const oldIndex = posts.findIndex((p) => p.id === active.id);
    const newIndex = posts.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(posts, oldIndex, newIndex);
    setForm((prev) => ({ ...prev, posts: { ...prev.posts, posts: reordered } }));
  };

  const handleDelete = async (index: number) => {
    const post = posts[index];
    if (!post) return;
    try {
      await deletePost(post.id);
      const updated = posts.filter((_, i) => i !== index);
      setForm((prev) => ({ ...prev, posts: { ...prev.posts, posts: updated } }));
    } catch {}
  };

  const handleTogglePublish = async (index: number) => {
    const copy = [...posts];
    const p = copy[index];
    if (!p) return;
    try {
      const res = await togglePublishPost(p.id, !p.published);
      const returned = res?.data?.post;
      if (returned) {
        const normalized = normalizePost(returned);
        copy[index] = { ...copy[index], ...normalized };
      } else {
        copy[index] = { ...copy[index], published: !copy[index].published };
      }
      setForm((prev) => ({ ...prev, posts: { ...prev.posts, posts: copy } }));
    } catch {
      copy[index] = { ...copy[index], published: !copy[index].published };
      setForm((prev) => ({ ...prev, posts: { ...prev.posts, posts: copy } }));
    }
  };

  return (
    <div className={styles.TabPageMain}>
      <div className={styles.sectionHead}>
        <h3>Share Posts, Blogs & Updates</h3>
        <p>
          Write and manage content that showcases your voice — from articles and
          announcements to guides and stories. Add rich text, images, SEO, and more
          to publish directly to your site.
        </p>
      </div>

      <Section
        title={<>Posts <span className="badge-pro">Pro</span></>}
        right={
          <button
            className="btn-primary"
            disabled={postsLimitReached}
            onClick={() => router.push('/admin/posts/add')}
          >
            + Add Post
          </button>
        }
        sub="Create blog posts, updates, and long-form content that lives on your personal site."
      >
        <LockedOverlay enabled={isPostsEnabled && !postsLimitReached} limitReached={postsLimitReached} mode="notice">
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={posts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {posts.map((post, index) => (
                    <SortablePost
                      key={post.id}
                      id={post.id}
                      post={post}
                      onEdit={() => router.push(`/admin/posts/${post.id}/edit`)}
                      onDelete={() => handleDelete(index)}
                      onTogglePublish={() => handleTogglePublish(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-sm text-muted">No posts yet. Start by adding your first one!</p>
          )}
        </LockedOverlay>
      </Section>
    </div>
  );
}
