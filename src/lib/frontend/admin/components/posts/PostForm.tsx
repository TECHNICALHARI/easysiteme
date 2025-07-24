'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import postStyles from '@/styles/post.module.css';
import ImageUpload from './ImageUpload';
import RichTextEditor from '@/lib/frontend/common/RichTextEditor';
import { slugify } from '@/lib/frontend/utils/slugify';

interface PostData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  published?: boolean;
}

interface Props {
  postData: PostData;
  setPostData: React.Dispatch<React.SetStateAction<PostData>>;
  onSave: () => void;
  showErrors: boolean;
  errors: Record<string, string>;
  isEditing: boolean;
  disabled: boolean;
}

const MAX_TAGS = 10;
const MAX_SEO_LENGTH = 160;

export default function PostForm({
  postData,
  setPostData,
  onSave,
  showErrors,
  errors,
  isEditing,
  disabled
}: Props) {
  useEffect(() => {
    if (postData.title && !isEditing) {
      const generated = slugify(postData.title);
      setPostData(prev => ({
        ...prev,
        slug: generated
      }));
    }

    if (!postData.title) {
      setPostData(prev => ({
        ...prev,
        slug: ''
      }));
    }
  }, [postData.title, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let limitedValue = value;

    if (name === 'seoTitle' || name === 'seoDescription') {
      limitedValue = value.slice(0, MAX_SEO_LENGTH);
    }

    setPostData(prev => ({
      ...prev,
      [name]: limitedValue
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !postData.tags.includes(val) && postData.tags.length < MAX_TAGS) {
        setPostData(prev => ({
          ...prev,
          tags: [...prev.tags, val]
        }));
        e.currentTarget.value = '';
      }
    }
  };

  const handleRemoveTag = (index: number) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="grid gap-4 mb-6">
      <div>
        <input
          type="text"
          name="title"
          className="input"
          placeholder="Post Title"
          value={postData.title}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {showErrors && errors.title && <p className="errorText">{errors.title}</p>}
      </div>

      <div>
        <input
          type="text"
          name="slug"
          className="input"
          placeholder="Slug"
          value={postData.slug}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      <div>
        <textarea
          name="description"
          className="input"
          placeholder="Short Description"
          rows={2}
          value={postData.description}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {showErrors && errors.description && <p className="errorText">{errors.description}</p>}
      </div>

      <div>
        <label className="font-medium mb-1 block">Thumbnail</label>
        {postData.thumbnail ? (
          <div className={postStyles.thumbPreview}>
            <img src={postData.thumbnail} alt="Thumb" className={postStyles.thumbImage} />
            <button
              onClick={() => setPostData(prev => ({ ...prev, thumbnail: '' }))}
              className={postStyles.removeBtn}
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <ImageUpload
            onSelect={(file: File) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  setPostData(prev => ({ ...prev, thumbnail: reader.result as string }));
                }
              };
              reader.readAsDataURL(file);
            }}
            disabled={disabled}
          />
        )}
        {showErrors && errors.thumbnail && <p className="errorText mt-1">{errors.thumbnail}</p>}
      </div>

      <div>
        <label className="font-medium mb-1 block">Post Content</label>
        <RichTextEditor
          value={postData.content}
          onChange={(val) => setPostData(prev => ({ ...prev, content: val }))}
          placeholder="Write your full blog post or article..."
          disable={disabled}
        />
      </div>

      {/* SEO TITLE */}
      <div>
        <input
          type="text"
          name="seoTitle"
          className="input"
          placeholder={`SEO Title (max ${MAX_SEO_LENGTH} chars)`}
          value={postData.seoTitle}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <div className={styles.textCounter}>
          {postData.seoTitle.length}/{MAX_SEO_LENGTH}
        </div>
      </div>

      {/* SEO DESCRIPTION */}
      <div>
        <textarea
          name="seoDescription"
          className="input"
          placeholder={`SEO Description (max ${MAX_SEO_LENGTH} chars)`}
          rows={2}
          value={postData.seoDescription}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <div className={styles.textCounter}>
          {postData.seoDescription.length}/{MAX_SEO_LENGTH}
        </div>
        {showErrors && errors.seoDescription && <p className="errorText">{errors.seoDescription}</p>}
      </div>

      {/* TAGS */}
      <div>
        <input
          type="text"
          className="input"
          placeholder="Add tags and press Enter (max 10)"
          onKeyDown={handleAddTag}
          disabled={disabled || postData.tags.length >= MAX_TAGS}
        />
        {postData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {postData.tags.map((tag, i) => (
              <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                {tag}
                <button
                  onClick={() => handleRemoveTag(i)}
                  className="ml-2 hover:text-red-600"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-2">
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={disabled}
        >
          {isEditing ? 'Update' : 'Publish'} Post
        </button>
      </div>
    </div>
  );
}
