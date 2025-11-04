"use client";
import { motion } from "framer-motion";
import styles from "@/styles/preview.module.css";
import clsx from "clsx";

export default function PostsSection({ posts }: { posts?: any[] }) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  const visiblePosts = posts.slice(0, 4);
  const isSingle = visiblePosts.length === 1;

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

      <div className={clsx(styles.mediaGrid, isSingle && styles.mediaGridSingle)}>
        {visiblePosts.map((post, i) => (
          <motion.a
            key={post.id ?? i}
            href={`/blog/${post.slug ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(styles.postCard, isSingle && styles.singleCardWide)}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            viewport={{ once: true }}
          >
            {post.thumbnail ? (
              <img
                src={post.thumbnail}
                alt={post.title || "Post image"}
                className={styles.postThumbnail}
              />
            ) : (
              <div className={styles.postThumbnail} />
            )}

            <div className={styles.postContent}>
              <h3 className={styles.postTitle}>{post.title || "Untitled"}</h3>
              {post.description ? (
                <p className={styles.postExcerpt}>{post.description}</p>
              ) : null}
              <span className={styles.learnMoreBtn}>Learn More →</span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}
