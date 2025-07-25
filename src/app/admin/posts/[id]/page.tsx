'use client';

import React, { JSX, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BadgeCheck, EyeOff, Tag, FileText, Pencil } from 'lucide-react';

import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { Post } from '@/lib/frontend/types/form';
import RichTextRenderer from '@/lib/frontend/common/RichTextRenderer';
import styles from '@/styles/postdetails.module.css';
import NoData from '@/lib/frontend/common/NoData';
import GoBackButton from '@/lib/frontend/common/GoBackButton';

export default function ViewPostPage(): JSX.Element {
  const { form } = useAdminForm();
  const router = useRouter();
  const params = useParams();

  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const selected = form.posts.posts.find((p) => p.id === id);
    if (selected) setPost(selected);
  }, [form.posts.posts, id]);

  if (!post) {
    return <NoData showGoBackButton={true} title="Post Not Found" description="We couldn’t locate this post." />;
  }

  return (
    <>
      <GoBackButton className='mt-4' />
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
              <img src={post.thumbnail} alt="Post Thumbnail" className={styles.thumbnail} />
            </div>
          )}

          <div className={styles.meta}>
            <span className={`${styles.status} ${post.published ? styles.published : styles.draft}`}>
              {post.published ? <><BadgeCheck size={16} /> Published</> : <><EyeOff size={16} /> Draft</>}
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
            <h3><FileText size={18} /> Description</h3>
            <p className={styles.description}>{post.description}</p>
          </section>

          <section className={styles.section}>
            <h3><FileText size={18} /> Content</h3>
            <div className={styles.content}>
              <RichTextRenderer html={post.content} />
            </div>
          </section>

          {(post.seoTitle || post.seoDescription) && (
            <section className={styles.section}>
              <h3>SEO Preview</h3>
              {post.seoTitle && <p><strong>SEO Title:</strong> {post.seoTitle}</p>}
              {post.seoDescription && <p><strong>SEO Description:</strong> {post.seoDescription}</p>}
            </section>
          )}
        </div>
      </section>
    </>
  );
}
