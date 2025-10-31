"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import clsx from "clsx";

export default function PostsSection({ posts }: { posts?: any[] }) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  const visiblePosts = posts.slice(0, 4);
  const isCentered = visiblePosts.length < 4;

  return (
    <motion.section
      id="posts"
      className="px-4 mt-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
            key={post.id ?? i}
            className={clsx(styles.postCard, styles.postSlide)}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            viewport={{ once: true }}
          >
            {post.thumbnail ? <img src={post.thumbnail} alt={post.title} className={styles.postThumbnail} /> : <div className={styles.postThumbnailPlaceholder}>No image</div>}
            <div className={styles.postContent}>
              <h3 className={styles.postTitle}>{post.title || "Untitled"}</h3>
              <p className={styles.postExcerpt}>{post.description || ""}</p>
              <a href={`/blog/${post.slug ?? ""}`} className={styles.learnMoreBtn} target="_blank" rel="noopener noreferrer">
                Learn More →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
