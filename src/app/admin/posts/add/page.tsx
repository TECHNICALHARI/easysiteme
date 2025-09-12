'use client';

import { useRouter } from 'next/navigation';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { JSX, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PostForm from '@/lib/frontend/admin/components/posts/PostForm';
import LockedOverlay from '@/lib/frontend/admin/layout/LockedOverlay';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import styles from '@/styles/admin.module.css';
import GoBackButton from '@/lib/frontend/common/GoBackButton';
import { createPost } from '@/lib/frontend/api/services';
import type { Post } from '@/lib/frontend/types/form';
import { useToast } from '@/lib/frontend/common/ToastProvider';

function normalizePost(raw: any): Post {
    const postId = raw?.postId ?? raw?.id ?? uuidv4();
    return {
        id: postId,
        postId,
        title: raw?.title ?? '',
        slug: raw?.slug ?? '',
        description: raw?.description ?? '',
        content: raw?.content ?? '',
        thumbnail: raw?.thumbnail ?? '',
        thumbnailPublicId: raw?.thumbnailPublicId ?? '',
        seoTitle: raw?.seoTitle ?? '',
        seoDescription: raw?.seoDescription ?? '',
        tags: Array.isArray(raw?.tags) ? raw.tags : [],
        published: Boolean(raw?.published),
    };
}

export default function AddPostPage(): JSX.Element {
    const router = useRouter();
    const { form, setForm, plan } = useAdminForm();
    const { showToast } = useToast();

    const [postData, setPostData] = useState<Post>({
        id: uuidv4(),
        postId: uuidv4(),
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

    const limits = PLAN_FEATURES[plan];
    const postsLimitReached = (form?.posts?.posts?.length || 0) >= limits.posts;
    const isPostsEnabled = limits.posts > 0;

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!postData.title?.trim()) errs.title = 'Title is required';
        if (!postData.description?.trim()) errs.description = 'Description is required';
        if (!postData.content?.trim()) errs.content = 'Content is required';
        return errs;
    };

    const handleSave = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            setShowErrors(true);
            showToast('Please fill all required fields.', 'error');
            return;
        }
        try {
            const res = await createPost(postData);
            const returned = res?.data?.post ?? res?.data ?? null;
            const created = returned ? normalizePost(returned) : normalizePost(postData);
            setForm((prev) => ({
                ...prev,
                posts: {
                    ...(prev.posts || { posts: [] }),
                    posts: [...((prev.posts && prev.posts.posts) || []), created],
                },
            }));
            showToast('Post created successfully!', 'success');
            router.push('/admin?tab=Posts');
        } catch (err: any) {
            showToast(err?.message || 'Failed to create post. Try again.', 'error');
            setShowErrors(true);
        }
    };

    return (
        <div className={styles.addEditFormContainer}>
            <GoBackButton />
            <h2 className="section-title">Create a New Post</h2>
            <div className={styles.sectionMain}>
                <LockedOverlay
                    enabled={isPostsEnabled && !postsLimitReached}
                    limitReached={postsLimitReached}
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
                        slugManuallyEdited={false}
                        setSlugManuallyEdited={() => { }}
                        allPosts={form?.posts?.posts || []}
                    />
                </LockedOverlay>
            </div>
        </div>
    );
}
