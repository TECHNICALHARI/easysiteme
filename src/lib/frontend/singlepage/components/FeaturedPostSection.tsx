'use client';
import styles from '@/styles/preview.module.css';
import { Post } from '@/lib/frontend/types/form';

export default function FeaturedPostSection({ posts }: { posts: Post[] }) {
  return (
    <div className={styles.featuredPostGrid}>
      {posts.map((post) => (
        <a key={post.id} href={`/post/${post.slug}`} className={styles.featuredPostCard}>
          <img src={post.thumbnail} alt={post.title} className={styles.postThumbnail} />
          <div className={styles.postContent}>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postDescription}>{post.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
