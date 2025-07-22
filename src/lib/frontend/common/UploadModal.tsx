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

import CustomModal from './CustomModal';
import styles from '@/styles/admin.module.css';
import Modal from './Modal';

interface UploadModalProps {
    onClose: () => void;
    onSelectImage: (fileOrIcon: File | keyof typeof staticIconMap) => void;
    showTabs?: boolean;
    type?: 'image' | 'pdf';
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
};


const staticIcons = Object.entries(staticIconMap).map(([name, icon]) => ({ name, icon }));

export default function UploadModal({
    onClose,
    onSelectImage,
    showTabs = true,
    type = 'image',
}: UploadModalProps) {

    const [tab, setTab] = useState<'icon' | 'upload'>('icon');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            onSelectImage(file);
            onClose();
        }
    };

    const validateFile = (file: File) => {
        const isImage = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024;
        if (!isImage) {
            alert('Only image files are allowed');
            return false;
        }
        if (!isValidSize) {
            alert('Image must be less than 5MB');
            return false;
        }
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            onSelectImage(file);
            onClose();
        }
    };

    return (
        <Modal title={showTabs ? 'Select an Icon or Upload an Image' : 'Upload an Image'} onClose={onClose} width="500px" noPadding={true}>
            <div className={styles.tabsWrapper}>
                {showTabs && (
                    <nav className={styles.tabNav}>
                        {['Icon', 'Upload'].map((label) => (
                            <button
                                key={label}
                                className={`${styles.tabItem} ${tab === label.toLowerCase() ? styles.activeTab : ''}`}
                                onClick={() => setTab(label.toLowerCase() as 'icon' | 'upload')}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>
                )}
                <div className={styles.tabContent}>
                    {!showTabs || tab === 'upload' ? (
                        <div
                            className="border-2 border-dashed border-brand rounded-xl p-6 text-center cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept={type === 'image' ? 'image/*' : '.pdf'}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <ImagePlus size={32} className="mx-auto text-brand mb-2" />
                            <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
                            <p className="text-xs text-gray-400 mt-1">Only {type === 'image' ? 'images' : 'PDFs'} under 5MB</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-5 gap-4 max-h-[300px] overflow-y-auto p-2">
                            {staticIcons.map(({ name, icon: Icon }) => (
                                <button
                                    key={name}
                                    onClick={() => {
                                        onSelectImage(name as keyof typeof staticIconMap);
                                        onClose();
                                    }}
                                    title={name}
                                    className="p-2 rounded hover:bg-gray-100 transition flex items-center justify-center"
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
