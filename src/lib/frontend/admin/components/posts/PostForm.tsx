'use client';

import { useEffect, useMemo } from 'react';
import styles from '@/styles/post.module.css';
import adminStyles from "@/styles/admin.module.css"
import { Trash2 } from 'lucide-react';
import RichTextEditor from '@/lib/frontend/common/RichTextEditor';
import ImageUpload from './ImageUpload';
import { slugify } from '@/lib/frontend/utils/slugify';
import { Post } from '@/lib/frontend/types/form';
import Accordion from '@/lib/frontend/common/Accordion';
import Container from '../../layout/Container';

interface Props {
    postData: Post;
    setPostData: React.Dispatch<React.SetStateAction<Post>>;
    showErrors: boolean;
    errors: Record<string, string>;
    isEditing: boolean;
    disableFields: boolean;
    onSave: () => void;
}

const MAX_TAGS = 10;
const SEO_LIMIT = 160;

export default function PostForm({
    postData,
    setPostData,
    showErrors,
    errors,
    isEditing,
    disableFields,
    onSave
}: Props) {
    useEffect(() => {
        if (!isEditing) {
            if (postData.title) {
                setPostData(prev => ({ ...prev, slug: slugify(postData.title) }));
            } else {
                setPostData(prev => ({ ...prev, slug: '' }));
            }
        }
    }, [postData.title, isEditing, setPostData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'seoTitle' || name === 'seoDescription') {
            newValue = newValue.slice(0, SEO_LIMIT);
        }
        setPostData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val && !postData.tags.includes(val) && postData.tags.length < MAX_TAGS) {
                setPostData(prev => ({ ...prev, tags: [...prev.tags, val] }));
                e.currentTarget.value = '';
            }
        }
    };

    const handleRemoveTag = (index: number) => {
        setPostData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }));
    };

    const isValid = useMemo(() => {
        return postData.title.trim() && postData.description.trim() && postData.content.trim();
    }, [postData]);

    return (
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
                <div className={styles.thumbPreview}>
                    <img src={postData.thumbnail} alt="Thumb" className={styles.thumbImage} />
                    <button
                        onClick={() => setPostData(prev => ({ ...prev, thumbnail: '' }))}
                        className={styles.removeBtn}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ) : (
                <ImageUpload
                    onSelect={(file) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (typeof reader.result === 'string') {
                                setPostData(prev => ({ ...prev, thumbnail: reader.result as string }));
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
                onChange={(val) => setPostData(prev => ({ ...prev, content: val }))}
                placeholder="Write your blog post..."
                disable={disableFields}
            />

            {/* Draft toggle */}
            <label className="flex items-center gap-2 mt-2">
                <input
                    type="checkbox"
                    disabled={disableFields}
                    checked={!postData.published}
                    onChange={() => setPostData(prev => ({ ...prev, published: !prev.published }))}
                />
                <span className="text-sm">Save as Draft</span>
            </label>

            {/* Accordion Section */}
            <Accordion title="SEO & Tags" defaultOpen={true}>
                <div className="grid gap-3">
                    <input
                        type="text"
                        name="seoTitle"
                        className="input"
                        placeholder={`SEO Title (max ${SEO_LIMIT} chars)`}
                        value={postData.seoTitle}
                        onChange={handleInputChange}
                        disabled={disableFields}
                    />
                    <div className="text-right text-xs text-gray-400">{postData.seoTitle.length}/{SEO_LIMIT}</div>

                    <textarea
                        name="seoDescription"
                        className="input"
                        placeholder={`SEO Description (max ${SEO_LIMIT} chars)`}
                        rows={2}
                        value={postData.seoDescription}
                        onChange={handleInputChange}
                        disabled={disableFields}
                    />
                    <div className="text-right text-xs text-gray-400">{postData.seoDescription.length}/{SEO_LIMIT}</div>

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
            </Accordion>

            <div className="flex justify-end mt-4">
                <button
                    className="btn-primary"
                    onClick={onSave}
                    disabled={!isValid || disableFields}
                >
                    {isEditing ? 'Update Post' : 'Publish Post'}
                </button>
            </div>
        </div>
    );
}
