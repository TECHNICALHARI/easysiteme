'use client';

import styles from '@/styles/preview.module.css';
import { Post } from '@/lib/frontend/types/form';

export default function PostsSection({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  const visiblePosts = posts.slice(0, 4);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-10">
      <h2 className={styles.sectionTitle}>Featured Articles & Blogs</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {visiblePosts.map((post) => (
          <div key={post.id} className={styles.postCard}>
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

      {posts.length > 4 && (
        <div className="text-center mt-8">
          <a href="/blog" className={styles.ctaButton}>
            See All Posts
          </a>
        </div>
      )}
    </section>
  );
}
