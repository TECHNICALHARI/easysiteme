'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { Post } from '@/lib/frontend/types/form';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import PostForm from '@/lib/frontend/admin/components/posts/PostForm';
import styles from '@/styles/admin.module.css';
import GoBackButton from '@/lib/frontend/common/GoBackButton';
import NoData from '@/lib/frontend/common/NoData';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { form, setForm } = useAdminForm();

  const postId = params?.id as string;

  const [postData, setPostData] = useState<Post | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const localPost = form.posts.posts.find((p) => p.id === postId);
      if (localPost) {
        setPostData(localPost);
      } else {
        setPostData(null);
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [form.posts.posts, postId]);

  const validatePost = (): boolean => {
    if (!postData) return false;

    const newErrors: Record<string, string> = {};
    if (!postData.title.trim()) newErrors.title = 'Title is required';
    if (!postData.description.trim()) newErrors.description = 'Description is required';
    if (!postData.content.trim()) newErrors.content = 'Content is required';

    setErrors(newErrors);
    setShowErrors(Object.keys(newErrors).length > 0);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!postData || !validatePost()) return;

    const updatedPosts = form.posts.posts.map((p) =>
      p.id === postId ? postData : p
    );

    setForm((prev) => ({
      ...prev,
      posts: {
        ...prev.posts,
        posts: updatedPosts,
      },
    }));

    router.push('/admin?tab=Posts');
  };

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading post...</div>;
  }

  if (!postData) {
    return <NoData showGoBackButton={true} title="Post Not Found" description="We couldn’t locate this post." />;
  }

  return (
    <div className={styles.addEditFormContainer}>
      <GoBackButton />
      <h2 className={"section-title"}>Edit Your Post</h2>
      <div className={styles.sectionMain}>
        <PostForm
          postData={postData}
          setPostData={setPostData as React.Dispatch<React.SetStateAction<Post>>}
          isEditing={true}
          showErrors={showErrors}
          errors={errors}
          disableFields={false}
          onSave={handleUpdate}
          slugManuallyEdited={slugManuallyEdited}
          setSlugManuallyEdited={setSlugManuallyEdited}
          allPosts={form?.posts?.posts}
        />
      </div>
    </div>
  );
}
