'use client';

import { useRouter } from 'next/navigation';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PostForm from '@/lib/frontend/admin/components/posts/PostForm';
import { Post } from '@/lib/frontend/types/form';
import styles from "@/styles/admin.module.css"
export default function AddPostPage() {
    const router = useRouter();
    const { form, setForm } = useAdminForm();

    const [postData, setPostData] = useState<Post>({
        id: uuidv4(),
        title: '',
        slug: '',
        description: '',
        content: '',
        thumbnail: '',
        seoTitle: '',
        seoDescription: '',
        tags: [],
        published: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showErrors, setShowErrors] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!postData.title.trim()) errs.title = 'Title is required';
        if (!postData.description.trim()) errs.description = 'Description is required';
        if (!postData.thumbnail.trim()) errs.thumbnail = 'Thumbnail is required';
        if (!postData.content.trim()) errs.content = 'Content is required';
        return errs;
    };

    const handleSave = () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            setShowErrors(true);
            return;
        }

        setForm(prev => ({
            ...prev,
            posts: {
                ...prev.posts,
                posts: [...prev.posts.posts, postData],
            },
        }));

        router.push('/admin'); // back to admin panel
    };

    return (
        <div className={styles.addEditFormContainer}>
            <div className={styles.sectionMain}>
                <h1 className="section-title mb-6">Add New Post</h1>
                <PostForm
                    postData={postData}
                    setPostData={setPostData}
                    isEditing={false}
                    showErrors={showErrors}
                    errors={errors}
                    disableFields={false}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}
