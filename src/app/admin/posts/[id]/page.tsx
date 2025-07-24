'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '@/styles/post.module.css';

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
}

const dummyPosts: Post[] = [
  {
    id: '1',
    title: 'How I Designed My Portfolio',
    description: 'A behind-the-scenes on the design process.',
    content: `<p>This is a full-length blog post content written with <strong>rich text</strong> formatting.</p>
              <ul><li>Concept Sketches</li><li>Wireframes</li><li>Prototyping</li></ul>`,
    thumbnail: 'https://source.unsplash.com/800x400/?design,portfolio',
  },
  // Add more for testing...
];

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const selected = dummyPosts.find((p) => p.id === id);
    setPost(selected || null);
  }, [id]);

  if (!post) return <div className={styles.loading}>Loading post...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img src={post.thumbnail} alt={post.title} />
      </div>
      <div className={styles.contentBox}>
        <h1>{post.title}</h1>
        <p className={styles.description}>{post.description}</p>
        <article dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}
