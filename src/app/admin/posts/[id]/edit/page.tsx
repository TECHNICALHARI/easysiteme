'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Post } from '@/lib/frontend/types/form';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import PostForm from '@/lib/frontend/admin/components/posts/PostForm';
import styles from '@/styles/admin.module.css';
import GoBackButton from '@/lib/frontend/common/GoBackButton';
import NoData from '@/lib/frontend/common/NoData';
import { getPost, updatePost, uploadImageApi, deleteImageApi } from '@/lib/frontend/api/services';
import { useToast } from '@/lib/frontend/common/ToastProvider';

function normalizeFetchedPost(fetched: any, postId: string): Post {
  const id = fetched?.postId ?? fetched?.id ?? postId;
  const thumb = fetched?.thumbnail ?? fetched?.secure_url ?? fetched?.url ?? '';
  const publicId = fetched?.thumbnailPublicId ?? fetched?.thumbnail_public_id ?? fetched?.publicId ?? '';
  const thumbWithCb = thumb ? `${thumb}${thumb.includes('?') ? '&' : '?'}cb=${Date.now()}` : '';
  return {
    id,
    postId: id,
    title: fetched?.title ?? '',
    slug: fetched?.slug ?? '',
    description: fetched?.description ?? '',
    content: fetched?.content ?? '',
    thumbnail: thumbWithCb,
    thumbnailPublicId: publicId,
    seoTitle: fetched?.seoTitle ?? '',
    seoDescription: fetched?.seoDescription ?? '',
    tags: fetched?.tags ?? [],
    published: Boolean(fetched?.published),
  };
}

function extractPublicIdsFromContent(content: string): Set<string> {
  const set = new Set<string>();
  if (!content) return set;
  const regex = /https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?([^"')\s>]+)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const id = m[1].replace(/\.[a-zA-Z0-9]+$/, '');
    if (id) set.add(id);
  }
  return set;
}

export default function EditPostPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const { form, setForm } = useAdminForm();
  const { showToast } = useToast();

  const postId = (params?.id as string) ?? '';
  const pendingRef = useRef<any>({
    thumbnailFile: null,
    thumbnailRemoved: false,
    thumbnailPrevPublicId: '',
    editorFiles: new Map<string, File>(),
    originalContentImages: new Set<string>(),
  });

  const [postData, setPostData] = useState<Post | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const localPost = form.posts?.posts?.find((p) => (p.postId ?? p.id) === postId);
        if (localPost && !isDirty) {
          if (mounted) {
            pendingRef.current.thumbnailPrevPublicId = localPost.thumbnailPublicId ?? '';
            pendingRef.current.originalContentImages = extractPublicIdsFromContent(localPost.content ?? '');
            setPostData(localPost);
          }
          setIsLoading(false);
          return;
        }
        if (localPost && isDirty) {
          setIsLoading(false);
          return;
        }
        const res = await getPost(postId);
        if (!res || !res.success) throw new Error(res?.message || 'Failed to fetch post');
        const fetched = res.data?.post ?? res.data ?? null;
        if (!fetched) {
          if (mounted) {
            setPostData(null);
            setFetchError('Post not found');
            showToast('Post not found', 'error');
          }
        } else {
          const normalized = normalizeFetchedPost(fetched, postId);
          pendingRef.current.thumbnailPrevPublicId = normalized.thumbnailPublicId ?? '';
          pendingRef.current.originalContentImages = extractPublicIdsFromContent(normalized.content ?? '');
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
  }, [form.posts?.posts, postId, showToast, isDirty]);

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

  const processPendingBeforeUpdate = async () => {
    if (!postData) return;
    if (pendingRef.current.thumbnailFile) {
      const file: File = pendingRef.current.thumbnailFile;
      const res = await uploadImageApi(file, pendingRef.current.thumbnailPrevPublicId ?? '');
      postData.thumbnail = `${res.url}${res.url.includes('?') ? '&' : '?'}cb=${Date.now()}`;
      postData.thumbnailPublicId = res.publicId;
    } else if (pendingRef.current.thumbnailRemoved) {
      if (pendingRef.current.thumbnailPrevPublicId) {
        try {
          await deleteImageApi(pendingRef.current.thumbnailPrevPublicId);
        } catch { }
      }
      postData.thumbnail = '';
      postData.thumbnailPublicId = '';
    }
    if (pendingRef.current.editorFiles && pendingRef.current.editorFiles.size > 0) {
      let content = postData.content;
      for (const [tmpUrl, file] of pendingRef.current.editorFiles.entries()) {
        const res = await uploadImageApi(file);
        const finalUrl = `${res.url}${res.url.includes('?') ? '&' : '?'}cb=${Date.now()}`;
        content = content.split(tmpUrl).join(finalUrl);
      }
      postData.content = content;
    }
    const newContentPublicIds = (() => {
      const set = new Set<string>();
      const regex = /https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?([^"')\s>]+)/g;
      let m;
      while ((m = regex.exec(postData.content || '')) !== null) {
        const id = m[1].replace(/\.[a-zA-Z0-9]+$/, '');
        if (id) set.add(id);
      }
      return set;
    })();
    const toDelete: string[] = [];
    for (const id of pendingRef.current.originalContentImages || []) {
      if (!newContentPublicIds.has(id)) toDelete.push(id);
    }
    for (const id of toDelete) {
      try {
        await deleteImageApi(id);
      } catch { }
    }
  };

  const handleUpdate = async () => {
    if (!postData) return;
    if (!validatePost()) return;
    setIsSaving(true);
    showToast('Saving post...', 'info');
    try {
      await processPendingBeforeUpdate();
      const res = await updatePost(postData.postId ?? postData.id, postData);
      if (!res || !res.success) throw new Error(res?.message || 'Failed to update');
      const updated = res.data?.post ?? res.data ?? postData;
      const normalizedUpdated: Post = {
        id: updated.postId ?? updated.id ?? postId,
        postId: updated.postId ?? updated.id ?? postId,
        title: updated.title ?? '',
        slug: updated.slug ?? '',
        description: updated.description ?? '',
        content: updated.content ?? '',
        thumbnail: updated.thumbnail
          ? `${(updated.thumbnail ?? updated.secure_url ?? updated.url)}${(updated.thumbnail ?? updated.secure_url ?? updated.url).includes('?') ? '&' : '?'}cb=${Date.now()}`
          : '',
        thumbnailPublicId: updated.thumbnailPublicId ?? updated.thumbnail_public_id ?? updated.publicId ?? '',
        seoTitle: updated.seoTitle ?? '',
        seoDescription: updated.seoDescription ?? '',
        tags: updated.tags ?? [],
        published: Boolean(updated.published),
      };
      setForm((prev) => {
        const posts = prev.posts?.posts ?? [];
        const idx = posts.findIndex((p) => (p.postId ?? p.id) === postId);
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
      <NoData showGoBackButton={true} title="Post Not Found" description={fetchError ?? 'We couldn’t locate this post.'} />
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
          pendingRef={pendingRef}
          setIsDirty={setIsDirty}
        />
      </div>
    </div>
  );
}
