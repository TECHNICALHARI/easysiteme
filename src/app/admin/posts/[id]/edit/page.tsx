'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { Post } from '@/lib/frontend/types/form';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import PostForm from '@/lib/frontend/admin/components/posts/PostForm';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { form, setForm } = useAdminForm();

  const postId = params?.id as string;

  const existingPost = form.posts.posts.find((p) => p.id === postId);

  // Handle 404 or invalid ID
  if (!existingPost) {
    return <div className="p-4 text-red-500">Post not found.</div>;
  }

  const [postData, setPostData] = useState<Post>(existingPost);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePost = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!postData.title.trim()) newErrors.title = 'Title is required';
    if (!postData.description.trim()) newErrors.description = 'Description is required';
    if (!postData.content.trim()) newErrors.content = 'Content is required';

    setErrors(newErrors);
    setShowErrors(Object.keys(newErrors).length > 0);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validatePost()) return;

    const updatedPosts = form.posts.posts.map((p) =>
      p.id === postId ? postData : p
    );

    setForm((prev) => ({
      ...prev,
      posts: { ...prev.posts, posts: updatedPosts },
    }));

    router.push('/admin'); // Redirect to posts tab (or show a success message)
  };

  return (
    <div className="section">
      <h1 className="section-title mb-6">Edit Post</h1>
      <PostForm
        postData={postData}
        setPostData={setPostData}
        isEditing={true}
        showErrors={showErrors}
        errors={errors}
        disableFields={false}
        onSave={handleUpdate}
      />
    </div>
  );
}
