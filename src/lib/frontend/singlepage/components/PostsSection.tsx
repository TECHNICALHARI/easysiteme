'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/preview.module.css';
import { Post } from '@/lib/frontend/types/form';
import clsx from 'clsx';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PostsSection({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  const visiblePosts = posts.slice(0, 4);
  const isCentered = visiblePosts.length < 4;

  return (
    <motion.section
      id="posts"
      className="px-4 mt-10"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>Featured Articles & Blogs</h2>
      {posts.length > 4 && (
        <div className={styles.sectionLinkWrapper}>
          <a href="/blog" className={styles.sectionLink}>See All →</a>
        </div>
      )}
      <div className={clsx(styles.postSliderWrapper, isCentered && styles.centeredPosts)}>
        {visiblePosts.map((post, i) => (
          <motion.div
            key={post.id}
            className={clsx(styles.postCard, styles.postSlide)}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            {post.thumbnail && <img src={post.thumbnail} alt={post.title} className={styles.postThumbnail} />}
            <div className={styles.postContent}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postExcerpt}>{post.description}</p>
              <a href={`/blog/${post.slug}`} className={styles.learnMoreBtn} target="_blank" rel="noopener noreferrer">
                Learn More →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
