'use client';

import styles from '@/styles/preview.module.css';
import { Post } from '@/lib/frontend/types/form';
import clsx from 'clsx';

export default function PostsSection({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  const visiblePosts = posts.slice(0, 4);
  const isCentered = visiblePosts.length < 4;

  return (
    <section className="px-4 mt-10" id='posts'>
      <h2 className={styles.sectionTitle}>Featured Articles & Blogs</h2>

      {posts.length > 4 && (
        <div className={styles.sectionLinkWrapper}>
          <a href="/blog" className={styles.sectionLink}>
            See All →
          </a>
        </div>
      )}

      <div
        className={clsx(
          styles.postSliderWrapper,
          isCentered && styles.centeredPosts
        )}
      >
        {visiblePosts.map((post) => (
          <div key={post.id} className={clsx(styles.postCard, styles.postSlide)}>
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                alt={post.title}
                className={styles.postThumbnail}
              />
            )}
            <div className={styles.postContent}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postExcerpt}>{post.description}</p>
              <a
                href={`/blog/${post.slug}`}
                className={styles.learnMoreBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
