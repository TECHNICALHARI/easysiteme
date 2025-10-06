'use client';

import { Dispatch, SetStateAction } from 'react';
import { X } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import LockedOverlay from '../../layout/LockedOverlay';
import type { ProfileTabData } from '@/lib/frontend/types/form';

export default function ProfileTagsSection({
  profile,
  setProfile,
  limit = 0,
}: {
  profile: ProfileTabData;
  setProfile: Dispatch<SetStateAction<ProfileTabData>>;
  limit?: number;
}) {
  const tags = profile.tags || [];

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = (e.currentTarget.value || '').trim();
      if (val && !tags.includes(val) && tags.length < limit) {
        setProfile((p) => ({ ...p, tags: [...(p.tags || []), val] }));
        e.currentTarget.value = '';
      }
    }
  };

  const handleRemoveTag = (index: number) => {
    setProfile((p) => {
      const updated = (p.tags || []).filter((_tag: string, i: number) => i !== index);
      return { ...p, tags: updated };
    });
  };

  const isTagsEnabled = limit > 0;
  const tagsLimitReached = (tags || []).length >= limit;
  const showTagsLimitNotice = isTagsEnabled && tagsLimitReached;

  return (
    <div className={styles.sectionMain}>
      <div className={styles.SecHeadAndBtn}>
        <h4>
          Tags / Skills / Interests{' '}
          {tagsLimitReached && <span className="badge-pro">Pro</span>}
        </h4>
      </div>

      <LockedOverlay
        enabled={isTagsEnabled && !tagsLimitReached}
        limitReached={showTagsLimitNotice}
        mode="notice"
      >
        <input
          type="text"
          className="input"
          placeholder="Type and press Enter (e.g. JavaScript, Public Speaking)"
          onKeyDown={handleAddTag}
          disabled={tagsLimitReached}
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag: string, index: number) => (
              <div
                key={index}
                className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-full flex items-center"
              >
                {tag}
                <button
                  type="button"
                  className="ml-2 hover:text-red-600"
                  onClick={() => handleRemoveTag(index)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </LockedOverlay>
    </div>
  );
}
