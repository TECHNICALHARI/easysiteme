'use client';

import { JSX, useEffect, useMemo } from 'react';
import styles from '@/styles/post.module.css';
import { Trash2 } from 'lucide-react';
import RichTextEditor from '@/lib/frontend/common/RichTextEditor';
import ImageUpload from './ImageUpload';
import { slugify } from '@/lib/frontend/utils/slugify';
import type { Post } from '@/lib/frontend/types/form';
import Accordion from '@/lib/frontend/common/Accordion';
import { useToast } from '@/lib/frontend/common/ToastProvider';

interface Props {
  postData: Post;
  setPostData: React.Dispatch<React.SetStateAction<Post>>;
  showErrors: boolean;
  errors: Record<string, string>;
  isEditing: boolean;
  disableFields: boolean;
  onSave: () => void;
  slugManuallyEdited: boolean;
  setSlugManuallyEdited: React.Dispatch<React.SetStateAction<boolean>>;
  allPosts: Post[];
}

const MAX_TAGS = 10;
const MAX_SEO_TITLE = 60;
const MAX_SEO_DESCRIPTION = 160;

export default function PostForm({
  postData,
  setPostData,
  showErrors,
  errors,
  isEditing,
  disableFields,
  onSave,
  slugManuallyEdited,
  setSlugManuallyEdited,
  allPosts,
}: Props): JSX.Element {
  const { showToast } = useToast();

  useEffect(() => {
    if (!slugManuallyEdited) {
      if (postData.title.trim()) {
        setPostData((prev) => ({ ...prev, slug: slugify(postData.title) }));
      } else {
        setPostData((prev) => ({ ...prev, slug: '' }));
      }
    }
  }, [postData.title, slugManuallyEdited, setPostData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'seoTitle') newValue = value.slice(0, MAX_SEO_TITLE);
    if (name === 'seoDescription') newValue = value.slice(0, MAX_SEO_DESCRIPTION);
    setPostData((prev) => ({ ...prev, [name]: newValue } as Post));
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
    setPostData((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const isValid = useMemo(() => {
    return postData.title.trim() && postData.description.trim() && postData.content.trim();
  }, [postData]);

  const suggestedTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).filter((tag) => !postData.tags.includes(tag));
  }, [allPosts, postData.tags]);

  const handleThumbnailSelect = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('existingPublicId', postData.thumbnailPublicId ?? '');
      const res = await fetch('/api/uploads/image', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Thumbnail upload failed');
      const json = await res.json();
      const url = json?.data?.url ?? json?.url ?? '';
      const publicId = json?.data?.public_id ?? '';
      if (!url) throw new Error('No URL returned');
      setPostData((prev) => ({
        ...prev,
        thumbnail: url,
        thumbnailPublicId: publicId,
      }));
      showToast('Thumbnail uploaded', 'success');
    } catch (err: any) {
      console.error('thumbnail upload error', err);
      showToast(err?.message || 'Failed to upload thumbnail', 'error');
    }
  };

  return (
    <form>
      <div className="grid gap-4 mb-6">
        {/* Title */}
        <div>
          <h3 className={styles.labelText}>
            Title <span className="text-red-500">*</span>
          </h3>
          <input
            type="text"
            name="title"
            className="input"
            placeholder="Enter post title"
            value={postData.title}
            onChange={handleInputChange}
            disabled={disableFields}
          />
          {showErrors && errors.title && <p className="errorText">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <h3 className={styles.labelText}>Slug</h3>
          <input
            type="text"
            name="slug"
            className="input"
            placeholder="Auto-generated from title"
            value={postData.slug}
            onChange={(e) => {
              const newSlug = e.target.value;
              setPostData((prev) => ({ ...prev, slug: newSlug }));
              setSlugManuallyEdited(newSlug.trim() !== '');
            }}
            disabled={disableFields}
          />
        </div>

        {/* Description */}
        <div>
          <h3 className={styles.labelText}>
            Description <span className="text-red-500">*</span>
          </h3>
          <textarea
            name="description"
            className="input"
            placeholder="Short summary of your post"
            rows={4}
            value={postData.description}
            onChange={handleInputChange}
            disabled={disableFields}
          />
          {showErrors && errors.description && <p className="errorText">{errors.description}</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <h3 className={styles.labelText}>Thumbnail</h3>
          {postData.thumbnail ? (
            <div className={styles.thumbPreview}>
              <img src={postData.thumbnail} alt="Thumbnail" className={styles.thumbImage} />
              <button
                onClick={() =>
                  setPostData((prev) => ({
                    ...prev,
                    thumbnail: '',
                    thumbnailPublicId: '',
                  }))
                }
                className={styles.removeBtn}
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <ImageUpload
              onSelect={handleThumbnailSelect}
              disabled={disableFields}
            />
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className={styles.labelText}>
            Content <span className="text-red-500">*</span>
          </h3>
          <RichTextEditor
            value={postData.content}
            onChange={(val) => setPostData((prev) => ({ ...prev, content: val }))}
            placeholder="Write your blog content here..."
            disable={disableFields}
          />
          {showErrors && errors.content && <p className="errorText">{errors.content}</p>}
        </div>

        {/* Draft Toggle */}
        <h3 className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            disabled={disableFields}
            checked={!postData.published}
            onChange={() => setPostData((prev) => ({ ...prev, published: !prev.published }))}
          />
          <span className="text-sm">Save as Draft</span>
        </h3>

        {/* SEO + Tags */}
        <Accordion title="SEO & Tags" defaultOpen={false}>
          <div className="grid gap-3">
            <div>
              <h3 className={styles.labelText}>SEO Title</h3>
              <input
                type="text"
                name="seoTitle"
                className="input"
                placeholder={`Max ${MAX_SEO_TITLE} characters`}
                value={postData.seoTitle}
                onChange={handleInputChange}
                disabled={disableFields}
              />
              <div className="text-right text-xs text-gray-400">
                {postData.seoTitle.length}/{MAX_SEO_TITLE}
              </div>
            </div>

            <div>
              <h3 className={styles.labelText}>SEO Description</h3>
              <textarea
                name="seoDescription"
                className="input"
                placeholder={`Max ${MAX_SEO_DESCRIPTION} characters`}
                rows={3}
                value={postData.seoDescription}
                onChange={handleInputChange}
                disabled={disableFields}
              />
              <div className="text-right text-xs text-gray-400">
                {postData.seoDescription.length}/{MAX_SEO_DESCRIPTION}
              </div>
            </div>

            <div>
              <h3 className={styles.labelText}>Tags</h3>
              <input
                type="text"
                className="input"
                placeholder="Press Enter to add tag"
                onKeyDown={handleAddTag}
                disabled={disableFields || postData.tags.length >= MAX_TAGS}
              />
              {postData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {postData.tags.map((tag, i) => (
                    <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(i)}
                        className="ml-2 hover:text-red-600"
                        type="button"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {suggestedTags.length > 0 && (
                <div className="mt-4">
                  <h3 className={styles.labelText}>Suggested Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {suggestedTags.map((tag, i) => (
                      <button
                        type="button"
                        key={i}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm"
                        onClick={() =>
                          setPostData((prev) => ({
                            ...prev,
                            tags: [...prev.tags, tag],
                          }))
                        }
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Accordion>

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <button
            className="btn-primary"
            onClick={onSave}
            disabled={!isValid || disableFields}
            type="button"
          >
            {isEditing ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </div>
    </form>
  );
}
