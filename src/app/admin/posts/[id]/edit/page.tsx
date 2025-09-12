'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Post } from '@/lib/frontend/types/form';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import PostForm from '@/lib/frontend/admin/components/posts/PostForm';
import styles from '@/styles/admin.module.css';
import GoBackButton from '@/lib/frontend/common/GoBackButton';
import NoData from '@/lib/frontend/common/NoData';
import { getPost, updatePost } from '@/lib/frontend/api/services';
import { useToast } from '@/lib/frontend/common/ToastProvider';

export default function EditPostPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const { form, setForm } = useAdminForm();
  const { showToast } = useToast();

  const postId = params?.id as string;
  const [postData, setPostData] = useState<Post | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const localPost = form.posts?.posts?.find((p) => (p.postId ?? p.id) === postId);
        if (localPost) {
          if (mounted) setPostData(localPost);
          setIsLoading(false);
          return;
        }
        const res = await getPost(postId);
        if (!res || !res.success) throw new Error(res?.message || 'Failed to fetch post');
        const fetched = res.data?.post ?? null;
        if (!fetched) {
          if (mounted) {
            setPostData(null);
            setFetchError('Post not found');
            showToast('Post not found', 'error');
          }
        } else {
          const normalized: Post = {
            id: fetched.postId ?? fetched.id ?? postId,
            postId: fetched.postId ?? fetched.id ?? postId,
            title: fetched.title ?? '',
            slug: fetched.slug ?? '',
            description: fetched.description ?? '',
            content: fetched.content ?? '',
            thumbnail: fetched.thumbnail ?? '',
            thumbnailPublicId: fetched.thumbnailPublicId ?? '',
            seoTitle: fetched.seoTitle ?? '',
            seoDescription: fetched.seoDescription ?? '',
            tags: fetched.tags ?? [],
            published: Boolean(fetched.published),
          };
          if (mounted) setPostData(normalized);
        }
      } catch (err: any) {
        console.error('fetch post error', err);
        if (mounted) {
          const msg = err?.message ?? 'Failed to load post';
          setFetchError(msg);
          showToast(msg, 'error');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [form.posts?.posts, postId, showToast]);

  const validatePost = (): boolean => {
    if (!postData) return false;
    const newErrors: Record<string, string> = {};
    if (!postData.title?.trim()) newErrors.title = 'Title is required';
    if (!postData.description?.trim()) newErrors.description = 'Description is required';
    if (!postData.content?.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    setShowErrors(Object.keys(newErrors).length > 0);
    if (Object.keys(newErrors).length > 0) {
      showToast('Please fix validation errors', 'error');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!postData) return;
    if (!validatePost()) return;
    setIsSaving(true);
    showToast('Saving post...', 'info');
    try {
      const res = await updatePost(postData.postId ?? postData.id, postData);
      if (!res || !res.success) throw new Error(res?.message || 'Failed to update');
      const updated = res.data?.post ?? postData;
      setForm((prev) => {
        const posts = prev.posts?.posts ?? [];
        const idx = posts.findIndex((p) => (p.postId ?? p.id) === postId);
        const normalizedUpdated: Post = {
          id: updated.postId ?? updated.id ?? postId,
          postId: updated.postId ?? updated.id ?? postId,
          title: updated.title ?? '',
          slug: updated.slug ?? '',
          description: updated.description ?? '',
          content: updated.content ?? '',
          thumbnail: updated.thumbnail ?? '',
          thumbnailPublicId: updated.thumbnailPublicId ?? '',
          seoTitle: updated.seoTitle ?? '',
          seoDescription: updated.seoDescription ?? '',
          tags: updated.tags ?? [],
          published: Boolean(updated.published),
        };
        let newPosts;
        if (idx === -1) {
          newPosts = [...posts, normalizedUpdated];
        } else {
          newPosts = posts.map((p) => ((p.postId ?? p.id) === postId ? normalizedUpdated : p));
        }
        return { ...prev, posts: { ...prev.posts, posts: newPosts } };
      });
      showToast('Post updated successfully!', 'success');
      router.push('/admin?tab=Posts');
    } catch (err: any) {
      console.error('update post error', err);
      const msg = err?.message ?? 'Failed to save post';
      setShowErrors(true);
      setErrors((prev) => ({ ...prev, _global: msg }));
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-4 text-gray-500">Loading post...</div>;
  if (!postData) {
    return (
      <NoData
        showGoBackButton={true}
        title="Post Not Found"
        description={fetchError ?? 'We couldn’t locate this post.'}
      />
    );
  }

  return (
    <div className={styles.addEditFormContainer}>
      <GoBackButton />
      <h2 className="section-title">Edit Your Post</h2>
      <div className={styles.sectionMain}>
        <PostForm
          postData={postData}
          setPostData={setPostData as React.Dispatch<React.SetStateAction<Post>>}
          isEditing={true}
          showErrors={showErrors}
          errors={errors}
          disableFields={isSaving}
          onSave={handleUpdate}
          slugManuallyEdited={slugManuallyEdited}
          setSlugManuallyEdited={setSlugManuallyEdited}
          allPosts={form?.posts?.posts ?? []}
        />
      </div>
    </div>
  );
}
