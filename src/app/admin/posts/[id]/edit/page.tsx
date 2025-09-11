'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { Post } from '@/lib/frontend/types/form';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import PostForm from '@/lib/frontend/admin/components/posts/PostForm';
import styles from '@/styles/admin.module.css';
import GoBackButton from '@/lib/frontend/common/GoBackButton';
import NoData from '@/lib/frontend/common/NoData';
import { getPost, updatePost } from '@/lib/frontend/api/services';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { form, setForm } = useAdminForm();

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
        const localPost = form.posts?.posts?.find((p) => p.id === postId);
        if (localPost) {
          if (mounted) setPostData(localPost);
          setIsLoading(false);
          return;
        }

        const res = await getPost(postId);
        if (!res || !res.success) {
          throw new Error(res?.message || 'Failed to fetch post');
        }
        const fetched = res.data?.post ?? null;
        if (!fetched) {
          if (mounted) {
            setPostData(null);
            setFetchError('Post not found');
          }
        } else {
          const normalized: Post = {
            id: fetched.postId ?? fetched.id ?? postId,
            title: fetched.title ?? '',
            slug: fetched.slug ?? '',
            description: fetched.description ?? '',
            content: fetched.content ?? '',
            thumbnail: fetched.thumbnail ?? '',
            seoTitle: fetched.seoTitle ?? '',
            seoDescription: fetched.seoDescription ?? '',
            tags: fetched.tags ?? [],
            published: Boolean(fetched.published),
          };
          if (mounted) setPostData(normalized);
        }
      } catch (err: any) {
        console.error('fetch post error', err);
        if (mounted) setFetchError(err?.message ?? 'Failed to load post');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [form.posts?.posts, postId]);

  const validatePost = (): boolean => {
    if (!postData) return false;

    const newErrors: Record<string, string> = {};
    if (!postData.title?.trim()) newErrors.title = 'Title is required';
    if (!postData.description?.trim()) newErrors.description = 'Description is required';
    if (!postData.content?.trim()) newErrors.content = 'Content is required';

    setErrors(newErrors);
    setShowErrors(Object.keys(newErrors).length > 0);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!postData) return;
    if (!validatePost()) return;

    setIsSaving(true);
    try {
      const payload = {
        postId: postData.id,
        title: postData.title,
        slug: postData.slug,
        description: postData.description,
        content: postData.content,
        thumbnail: postData.thumbnail || '',
        seoTitle: postData.seoTitle || '',
        seoDescription: postData.seoDescription || '',
        tags: postData.tags || [],
        published: Boolean(postData.published),
      };

      const res = await updatePost(postData.id, payload);
      if (!res || !res.success) throw new Error(res?.message || 'Failed to update');

      const updated = res.data?.post ?? payload;

      // Update local admin form (replace or append)
      setForm((prev) => {
        const posts = prev.posts?.posts ?? [];
        const idx = posts.findIndex((p) => p.id === postId);
        const normalizedUpdated: Post = {
          id: updated.postId ?? updated.id ?? postId,
          title: updated.title ?? '',
          slug: updated.slug ?? '',
          description: updated.description ?? '',
          content: updated.content ?? '',
          thumbnail: updated.thumbnail ?? '',
          seoTitle: updated.seoTitle ?? '',
          seoDescription: updated.seoDescription ?? '',
          tags: updated.tags ?? [],
          published: Boolean(updated.published),
        };
        let newPosts;
        if (idx === -1) {
          newPosts = [...posts, normalizedUpdated];
        } else {
          newPosts = posts.map((p) => (p.id === postId ? normalizedUpdated : p));
        }
        return { ...prev, posts: { ...prev.posts, posts: newPosts } };
      });

      router.push('/admin?tab=Posts');
    } catch (err: any) {
      console.error('update post error', err);
      setShowErrors(true);
      setErrors((prev) => ({ ...prev, _global: err?.message || 'Failed to save post' }));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading post...</div>;
  }

  if (!postData) {
    return <NoData showGoBackButton={true} title="Post Not Found" description={fetchError ?? "We couldn’t locate this post."} />;
  }

  return (
    <div className={styles.addEditFormContainer}>
      <GoBackButton />
      <h2 className={"section-title"}>Edit Your Post</h2>
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
