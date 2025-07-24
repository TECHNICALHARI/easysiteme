'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/admin.module.css';
import postStyles from '@/styles/post.module.css';
import { Trash2, X } from 'lucide-react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import { FormData } from '@/lib/frontend/types/form';
import LockedOverlay from '../../layout/LockedOverlay';
import RichTextEditor from '@/lib/frontend/common/RichTextEditor';
import SortablePost from './SortablePost';
import ImageUpload from './ImageUpload';
import { slugify } from '@/lib/frontend/utils/slugify';

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const MAX_TAGS = 10;
const SEO_DESCRIPTION_LIMIT = 160;
const SEO_TITLE_LIMIT = 160;

const PostsTab = ({ form, setForm }: Props) => {
  const plan = 'pro';
  const limits = PLAN_FEATURES[plan];
  const posts = form.posts.posts || [];

  const postsLimitReached = posts.length >= limits.posts;
  const isPostsEnabled = limits.posts > 0;
  const showPostLimitNotice = isPostsEnabled && postsLimitReached;

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [postData, setPostData] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    content: '',
    thumbnail: '',
    seoTitle: '',
    seoDescription: '',
    tags: [] as string[],
  });
  const [showErrors, setShowErrors] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!postData.title) {
      setPostData((prev) => ({ ...prev, slug: '' }));
      return;
    }

    const generatedSlug = slugify(postData.title);
    const isUnique = !posts.some((p, i) => i !== editIndex && p.slug === generatedSlug);

    setPostData((prev) => ({
      ...prev,
      slug: isUnique ? generatedSlug : `${generatedSlug}-${Date.now()}`
    }));
  }, [postData.title]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id || active.id === over.id) return;
    const oldIndex = posts.findIndex((p) => p.id === active.id);
    const newIndex = posts.findIndex((p) => p.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(posts, oldIndex, newIndex);
      setForm((prev) => ({
        ...prev,
        posts: { ...prev.posts, posts: reordered }
      }));
    }
  };

  const validate = () => ({
    title: postData.title.trim() ? '' : 'Title is required.',
    description: postData.description.trim() ? '' : 'Description is required.',
    thumbnail: postData.thumbnail ? '' : 'Thumbnail is required.',
    seoDescription: postData.seoDescription.length > SEO_DESCRIPTION_LIMIT
      ? `Max ${SEO_DESCRIPTION_LIMIT} characters.` : '',
    seoTitle: postData.seoTitle.length > SEO_TITLE_LIMIT
      ? `Max ${SEO_TITLE_LIMIT} characters.` : '',
  });

  const errors = validate();
  const isValid = !Object.values(errors).some(Boolean);

  const handleSavePost = () => {
    setShowErrors(true);
    if (!isValid) return;

    const updated = [...posts];
    const newPost = {
      ...postData,
      id: postData.id || `post-${Date.now()}`,
      title: postData.title.trim(),
      description: postData.description.trim(),
      content: postData.content.trim(),
      slug: postData.slug.trim(),
      seoTitle: postData.seoTitle.trim(),
      seoDescription: postData.seoDescription.trim(),
      tags: postData.tags,
    };

    if (editIndex !== null) {
      updated[editIndex] = newPost;
    } else {
      updated.push(newPost);
    }

    setForm((prev) => ({
      ...prev,
      posts: { ...prev.posts, posts: updated }
    }));

    setEditIndex(null);
    setPostData({
      id: '',
      title: '',
      slug: '',
      description: '',
      content: '',
      thumbnail: '',
      seoTitle: '',
      seoDescription: '',
      tags: [],
    });
    setShowErrors(false);
  };

  const handleDelete = (index: number) => {
    const updated = posts.filter((_, i) => i !== index);
    setForm({ ...form, posts: { ...form.posts, posts: updated } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !postData.tags.includes(val) && postData.tags.length < MAX_TAGS) {
        setPostData((prev) => ({ ...prev, tags: [...prev.tags, val] }));
        e.currentTarget.value = '';
      }
    }
  };

  const handleRemoveTag = (index: number) => {
    setPostData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const disableFields = !isPostsEnabled;

  return (
    <div className={styles.sectionMain}>
      <div className={styles.SecHeadAndBtn}>
        <h4>Posts <span className="badge-pro">Pro</span></h4>
      </div>

      <LockedOverlay
        enabled={isPostsEnabled && !postsLimitReached}
        limitReached={showPostLimitNotice}
        mode="notice"
      >
        <div className="grid gap-4 mb-6">
          <input
            type="text"
            name="title"
            className="input"
            placeholder="Post Title"
            value={postData.title}
            onChange={handleInputChange}
            disabled={disableFields}
          />
          {showErrors && errors.title && <p className="errorText">{errors.title}</p>}

          <input
            type="text"
            name="slug"
            className="input"
            placeholder="Slug"
            value={postData.slug}
            onChange={handleInputChange}
            disabled={disableFields}
          />

          <textarea
            name="description"
            className="input"
            placeholder="Short Description"
            rows={2}
            value={postData.description}
            onChange={handleInputChange}
            disabled={disableFields}
          />
          {showErrors && errors.description && <p className="errorText">{errors.description}</p>}

          <label className="font-medium block">Thumbnail</label>
          {postData.thumbnail ? (
            <div className={postStyles.thumbPreview}>
              <img src={postData.thumbnail} alt="Thumb" className={postStyles.thumbImage} />
              <button onClick={() => setPostData({ ...postData, thumbnail: '' })} className={postStyles.removeBtn}>
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <ImageUpload
              onSelect={(file) => {
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    setPostData((prev) => ({ ...prev, thumbnail: reader.result as string }));
                  }
                };
                reader.readAsDataURL(file);
              }}
              disabled={disableFields}
            />
          )}
          {showErrors && errors.thumbnail && <p className="errorText">{errors.thumbnail}</p>}

          <label className="font-medium block">Content</label>
          <RichTextEditor
            value={postData.content}
            onChange={(val) => setPostData((prev) => ({ ...prev, content: val }))}
            placeholder="Write your blog post..."
            disable={disableFields}
          />

          <input
            type="text"
            name="seoTitle"
            className="input"
            placeholder="SEO Title"
            value={postData.seoTitle}
            onChange={handleInputChange}
            disabled={disableFields}
            maxLength={SEO_TITLE_LIMIT}
          />
          <small className="text-sm text-gray-500">{postData.seoTitle.length}/{SEO_TITLE_LIMIT}</small>

          <textarea
            name="seoDescription"
            className="input"
            placeholder={`SEO Description (max ${SEO_DESCRIPTION_LIMIT} chars)`}
            value={postData.seoDescription}
            onChange={handleInputChange}
            disabled={disableFields}
            rows={2}
            maxLength={SEO_DESCRIPTION_LIMIT}
          />
          <small className="text-sm text-gray-500">{postData.seoDescription.length}/{SEO_DESCRIPTION_LIMIT}</small>
          {showErrors && errors.seoDescription && <p className="errorText">{errors.seoDescription}</p>}

          {/* TAGS */}
          <input
            type="text"
            className="input"
            placeholder="Add tags and press Enter (max 10)"
            onKeyDown={handleAddTag}
            disabled={disableFields || postData.tags.length >= MAX_TAGS}
          />
          {postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {postData.tags.map((tag, i) => (
                <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button onClick={() => handleRemoveTag(i)} className="ml-2 hover:text-red-600">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-2">
            <button className="btn-primary" onClick={handleSavePost} disabled={!isValid || disableFields}>
              {editIndex !== null ? 'Update' : 'Publish'} Post
            </button>
          </div>
        </div>
      </LockedOverlay>

      {/* POSTS LIST */}
      {posts.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Your Posts</h4>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={posts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-3">
                {posts.map((post, i) => (
                  <SortablePost
                    key={post.id}
                    id={post.id}
                    post={post}
                    onEdit={() => {
                      setEditIndex(i);
                      setPostData(post);
                      setShowErrors(false);
                    }}
                    onDelete={() => handleDelete(i)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default PostsTab;
