'use client';

import { useRef, useState } from 'react';
import {
  Globe,
  Mail,
  Phone,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ShoppingBag,
  Music,
  FileText,
  Bookmark,
  Link as LinkIcon,
  MessageCircle,
  MapPin,
  Star,
  Camera,
  Rss,
  User,
  Video,
  ImagePlus,
  Github,
  Gitlab,
  Twitch,
  Pocket,
  Codepen,
  Trello,
  Figma,
  Slack,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import Modal from './Modal';
import styles from '@/styles/admin.module.css';
import { useToast } from './ToastProvider';

interface UploadModalProps {
  onClose: () => void;
  onSelectImage: (fileOrIcon: File | keyof typeof staticIconMap) => void;
  showTabs?: boolean;
  type?: 'image' | 'pdf';
  maxBytes?: number; 
}

export const staticIconMap = {
  Website: Globe,
  Email: Mail,
  Phone: Phone,
  YouTube: Youtube,
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Shop: ShoppingBag,
  Music: Music,
  Blog: FileText,
  Bookmark: Bookmark,
  Link: LinkIcon,
  Message: MessageCircle,
  Location: MapPin,
  Starred: Star,
  Camera: Camera,
  RSS: Rss,
  User: User,
  Video: Video,
  GitHub: Github,
  GitLab: Gitlab,
  Twitch: Twitch,
  Pocket: Pocket,
  Codepen: Codepen,
  Trello: Trello,
  Figma: Figma,
  Slack: Slack,
} satisfies Record<string, LucideIcon>;

const staticIcons = Object.entries(staticIconMap).map(([name, icon]) => ({ name, icon }));

export default function UploadModal({
  onClose,
  onSelectImage,
  showTabs = true,
  type = 'image',
  maxBytes = 5 * 1024 * 1024,
}: UploadModalProps) {
  const { showToast } = useToast();
  const [tab, setTab] = useState<'icon' | 'upload'>(showTabs ? 'icon' : 'upload');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const accept = type === 'image' ? 'image/*' : 'application/pdf';
  const typeLabel = type === 'image' ? 'image' : 'PDF';

  const validateFile = (file: File) => {
    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are allowed.', 'error');
        return false;
      }
    } else {
      if (file.type !== 'application/pdf') {
        showToast('Only PDF files are allowed.', 'error');
        return false;
      }
    }
    if (file.size > maxBytes) {
      const mb = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
      showToast(`${typeLabel} must be less than ${mb}MB.`, 'error');
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      onSelectImage(file);
      showToast(`${typeLabel} selected.`, 'success');
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onSelectImage(file);
      showToast(`${typeLabel} selected.`, 'success');
      onClose();
    }
    // reset input so selecting the same file again triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Modal
      title={showTabs ? 'Select an Icon or Upload a File' : `Upload a ${typeLabel}`}
      onClose={onClose}
      width="500px"
      noPadding
    >
      <div className={styles.tabsWrapper}>
        {showTabs && (
          <nav className={styles.tabNav} role="tablist" aria-label="Upload options">
            {(['Icon', 'Upload'] as const).map((label) => {
              const key = label.toLowerCase() as 'icon' | 'upload';
              const active = tab === key;
              return (
                <button
                  key={label}
                  role="tab"
                  aria-selected={active}
                  className={`${styles.tabItem} ${active ? styles.activeTab : ''}`}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        )}

        <div className={styles.tabContent}>
          {!showTabs || tab === 'upload' ? (
            <div
              className="border-2 border-dashed border-brand rounded-xl p-6 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/40"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
              />
              <ImagePlus size={32} className="mx-auto text-brand mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">
                Only {type === 'image' ? 'images' : 'PDFs'} under {Math.round((maxBytes / (1024 * 1024)) * 10) / 10}
                MB
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4 max-h-[300px] overflow-y-auto p-2">
              {staticIcons.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => {
                    onSelectImage(name as keyof typeof staticIconMap);
                    showToast('Icon selected.', 'success');
                    onClose();
                  }}
                  title={name}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <Icon size={24} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
