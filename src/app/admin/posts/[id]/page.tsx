'use client';

import React, { JSX, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BadgeCheck, EyeOff, Tag, FileText, Pencil } from 'lucide-react';
import { getPost } from '@/lib/frontend/api/services';
import { Post } from '@/lib/frontend/types/form';
import RichTextRenderer from '@/lib/frontend/common/RichTextRenderer';
import styles from '@/styles/postdetails.module.css';
import NoData from '@/lib/frontend/common/NoData';
import GoBackButton from '@/lib/frontend/common/GoBackButton';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import Loader from '@/lib/frontend/common/Loader';

function normalizeFetchedPost(fetched: any, postId: string): Post {
  const id = fetched?.postId ?? fetched?.id ?? postId;
  const thumb = fetched?.thumbnail ?? fetched?.secure_url ?? fetched?.url ?? '';
  const publicId =
    fetched?.thumbnailPublicId ??
    fetched?.thumbnail_public_id ??
    fetched?.publicId ??
    '';
  const thumbWithCb = thumb
    ? `${thumb}${thumb.includes('?') ? '&' : '?'}cb=${Date.now()}`
    : '';
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

export default function ViewPostPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();

  const postId =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : '';

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const res = await getPost(postId);
        if (!res || !res.success) throw new Error(res?.message || 'Failed to fetch post');
        const fetched = res.data?.post ?? res.data ?? null;
        if (!fetched) {
          if (mounted) {
            setPost(null);
            setFetchError('Post not found');
            showToast('Post not found', 'error');
          }
        } else {
          const normalized = normalizeFetchedPost(fetched, postId);
          if (mounted) setPost(normalized);
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
  }, [postId, showToast]);

  if (isLoading) {
    return <Loader />;
  }

  if (!post) {
    return (
      <NoData
        showGoBackButton={true}
        title="Post Not Found"
        description={fetchError ?? 'We couldn’t locate this post.'}
      />
    );
  }

  return (
    <>
      <GoBackButton className="mt-4" />
      <section className={styles.postWrapper}>
        <div className={styles.postCard}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>{post.title}</h1>
              <p className={styles.slug}>/{post.slug}</p>
            </div>
            <button
              className={styles.editButton}
              onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
            >
              <Pencil size={16} /> Edit
            </button>
          </header>

          {post.thumbnail && (
            <div className={styles.thumbnailWrapper}>
              <img
                src={post.thumbnail}
                alt="Post Thumbnail"
                className={styles.thumbnail}
              />
            </div>
          )}

          <div className={styles.meta}>
            <span
              className={`${styles.status} ${
                post.published ? styles.published : styles.draft
              }`}
            >
              {post.published ? (
                <>
                  <BadgeCheck size={16} /> Published
                </>
              ) : (
                <>
                  <EyeOff size={16} /> Draft
                </>
              )}
            </span>

            {post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>
                    <Tag size={12} /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <section className={styles.section}>
            <h3>
              <FileText size={18} /> Description
            </h3>
            <p className={styles.description}>{post.description}</p>
          </section>

          <section className={styles.section}>
            <h3>
              <FileText size={18} /> Content
            </h3>
            <div className={styles.content}>
              <RichTextRenderer html={post.content} />
            </div>
          </section>

          {(post.seoTitle || post.seoDescription) && (
            <section className={styles.section}>
              <h3>SEO Preview</h3>
              {post.seoTitle && (
                <p>
                  <strong>SEO Title:</strong> {post.seoTitle}
                </p>
              )}
              {post.seoDescription && (
                <p>
                  <strong>SEO Description:</strong> {post.seoDescription}
                </p>
              )}
            </section>
          )}
        </div>
      </section>
    </>
  );
}
