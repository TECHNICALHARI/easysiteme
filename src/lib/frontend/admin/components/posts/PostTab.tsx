'use client';

import { useRouter } from 'next/navigation';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import LockedOverlay from '../../layout/LockedOverlay';
import SortablePost from './SortablePost';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import styles from "@/styles/admin.module.css"
const PostTab = () => {
    const router = useRouter();
    const { form, setForm } = useAdminForm();

    const posts = form.posts.posts || [];
    const plan = 'pro';
    const limits = PLAN_FEATURES[plan];
    const postsLimitReached = posts.length >= limits.posts;
    const isPostsEnabled = limits.posts > 0;
    const showPostLimitNotice = isPostsEnabled && postsLimitReached;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active?.id || !over?.id || active.id === over.id) return;

        const oldIndex = posts.findIndex((p) => p.id === active.id);
        const newIndex = posts.findIndex((p) => p.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = arrayMove(posts, oldIndex, newIndex);
            setForm((prev) => ({
                ...prev,
                posts: { ...prev.posts, posts: reordered },
            }));
        }
    };

    const handleDelete = (index: number) => {
        const updated = posts.filter((_, i) => i !== index);
        setForm((prev) => ({
            ...prev,
            posts: { ...prev.posts, posts: updated },
        }));
    };

    const handleTogglePublish = (index: number) => {
        const updatedPosts = [...posts];
        updatedPosts[index].published = !updatedPosts[index].published;
        setForm(prev => ({
            ...prev,
            posts: { ...prev.posts, posts: updatedPosts },
        }));
    };


    return (
        <div className={styles.TabPageMain}>
            <div className={styles.SecHeadAndBtn}>
                <h4 className={styles.sectionLabel}>Posts <span className="badge-pro">Pro</span></h4>
                <button
                    className="btn-primary"
                    disabled={postsLimitReached}
                    onClick={() => router.push('/admin/posts/add')}
                >
                    + Add Post
                </button>
            </div>

            <LockedOverlay
                enabled={isPostsEnabled && !postsLimitReached}
                limitReached={showPostLimitNotice}
                mode="notice"
            >
                {posts.length > 0 && (
                    <>
                        <h4 className="text-lg font-semibold mb-3">Your Posts</h4>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={posts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                                <div className="grid gap-3">
                                    {posts.map((post, index) => (
                                        <SortablePost
                                            key={post.id}
                                            id={post.id}
                                            post={post}
                                            onEdit={() => router.push(`/posts/${post.id}/edit`)}
                                            onDelete={() => handleDelete(index)}
                                            onTogglePublish={() => handleTogglePublish(index)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </>
                )}
            </LockedOverlay>
        </div>
    );
};

export default PostTab;
