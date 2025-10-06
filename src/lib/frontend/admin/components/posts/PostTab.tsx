'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
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
import { useToast } from '@/lib/frontend/common/ToastProvider';
import type { Post as PostType } from '@/lib/frontend/types/form';
import Loader from '@/lib/frontend/common/Loader';
import ConfirmModal from '@/lib/frontend/common/ConfirmModal';

function normalizePost(raw: any): PostType {
  const postId = (raw?.postId as string) ?? (raw?.id as string) ?? '';
  return {
    id: postId,
    postId: raw?.postId ?? raw?.id ?? undefined,
    title: String(raw?.title ?? ''),
    slug: String(raw?.slug ?? ''),
    description: String(raw?.description ?? ''),
    content: String(raw?.content ?? ''),
    thumbnail: String(raw?.thumbnail ?? ''),
    thumbnailPublicId: raw?.thumbnailPublicId ?? raw?.thumbnail_public_id ?? '',
    seoTitle: String(raw?.seoTitle ?? ''),
    seoDescription: String(raw?.seoDescription ?? ''),
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    published: Boolean(raw?.published),
  };
}

export default function PostTab(): JSX.Element {
  const router = useRouter();
  const { posts, setPosts, plan } = useAdminForm() as {
    posts: { posts: PostType[] };
    setPosts: (next: { posts: PostType[] } | ((p: { posts: PostType[] }) => { posts: PostType[] })) => void;
    plan: keyof typeof PLAN_FEATURES;
  };
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const mountedRef = useRef(true);

  const localPosts: PostType[] = posts?.posts ?? [];
  const limits = PLAN_FEATURES[plan];
  const isPostsEnabled = limits.posts > 0;
  const postsLimitReached = (localPosts?.length || 0) >= limits.posts;

  async function fetchPosts() {
    if (!mountedRef.current) return;
    try {
      setLoading(true);
      const res = await listPosts();
      const rawPosts = res?.data?.posts ?? res?.data ?? [];
      const normalized = Array.isArray(rawPosts) ? rawPosts.map(normalizePost) : [];
      if (!mountedRef.current) return;
      setPosts({ posts: normalized });
    } catch (err: any) {
      showToast(err?.message || 'Failed to load posts', 'error');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    fetchPosts();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id || active.id === over.id) return;
    const oldIndex = localPosts.findIndex((p) => (p.postId ?? p.id) === active.id);
    const newIndex = localPosts.findIndex((p) => (p.postId ?? p.id) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(localPosts, oldIndex, newIndex);
    setPosts({ posts: reordered });
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;
    const post = localPosts[deleteIndex];
    if (!post) return;
    const id = post.postId ?? post.id;
    try {
      setLoading(true);
      await deletePost(id);
      await fetchPosts();
      showToast('Post deleted', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete post', 'error');
    } finally {
      if (mountedRef.current) setLoading(false);
      setConfirmOpen(false);
      setDeleteIndex(null);
    }
  };

  const handleTogglePublish = async (index: number) => {
    const p = localPosts[index];
    if (!p) return;
    const id = p.postId ?? p.id;
    try {
      setLoading(true);
      await togglePublishPost(id, !p.published);
      await fetchPosts();
      showToast(!p.published ? 'Post published' : 'Post unpublished', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to change publish state', 'error');
    } finally {
      if (mountedRef.current) setLoading(false);
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

      <div className={styles.sectionMain}>
        <div className={styles.SecHeadAndBtn}>
          <h4 className={styles.sectionLabel}>Posts <span className="badge-pro">Pro</span></h4>
          <div>
            <button className="btn-primary" disabled={postsLimitReached} onClick={() => router.push('/admin/posts/add')}>
              + Add Post
            </button>
          </div>
        </div>

        <LockedOverlay enabled={isPostsEnabled && !postsLimitReached} limitReached={postsLimitReached} mode="notice">
          {loading ? (
            <Loader />
          ) : localPosts.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={localPosts.map((p) => p.postId ?? p.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {localPosts.map((post, index) => (
                    <SortablePost
                      key={post.postId ?? post.id}
                      id={post.postId ?? post.id}
                      post={post}
                      onEdit={() => router.push(`/admin/posts/${post.postId ?? post.id}/edit`)}
                      onDelete={() => { setConfirmOpen(true); setDeleteIndex(index); }}
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
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={loading}
      />
    </div>
  );
}
