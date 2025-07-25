'use client';

import { useRouter } from 'next/navigation';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PostForm from '@/lib/frontend/admin/components/posts/PostForm';
import { Post } from '@/lib/frontend/types/form';
import LockedOverlay from '@/lib/frontend/admin/layout/LockedOverlay';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import styles from '@/styles/admin.module.css';
import GoBackButton from '@/lib/frontend/common/GoBackButton';

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
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const plan = 'free';
    const limits = PLAN_FEATURES[plan];
    const postsLimitReached = form.posts.posts.length >= limits.posts;
    const isPostsEnabled = limits.posts > 0;
    const showPostLimitNotice = isPostsEnabled && postsLimitReached;

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!postData.title.trim()) errs.title = 'Title is required';
        if (!postData.description.trim()) errs.description = 'Description is required';
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
        router.push('/admin?tab=Posts');
    };

    return (
        <div className={styles.addEditFormContainer}>
            <GoBackButton />
            <h2 className={"section-title"}>Create a New Post</h2>
            <div className={styles.sectionMain}>
                <LockedOverlay
                    enabled={isPostsEnabled && !postsLimitReached}
                    limitReached={showPostLimitNotice}
                    mode="notice"
                >
                    <PostForm
                        postData={postData}
                        setPostData={setPostData}
                        isEditing={false}
                        showErrors={showErrors}
                        errors={errors}
                        disableFields={!isPostsEnabled || postsLimitReached}
                        onSave={handleSave}
                        slugManuallyEdited={slugManuallyEdited}
                        setSlugManuallyEdited={setSlugManuallyEdited}
                        allPosts={form?.posts?.posts}
                    />
                </LockedOverlay>
            </div>
        </div>
    );
}
