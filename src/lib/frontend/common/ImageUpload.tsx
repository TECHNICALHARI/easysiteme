'use client';

import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ImageIcon, CheckCircle2 } from 'lucide-react';

export interface ImageUploadProps {
  onSelect: (file: File) => void;
  maxSizeMB?: number;
  className?: string;
}

export interface ImageUploadRef {
  reset: () => void;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ onSelect, maxSizeMB = 3, className }, ref) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>('');

    useImperativeHandle(ref, () => ({
      reset() {
        setPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    }));

    const validateFile = (file: File) => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
      if (!isImage) {
        alert('Only image files are allowed.');
        return false;
      }
      if (!isValidSize) {
        alert(`Image must be less than ${maxSizeMB}MB.`);
        return false;
      }
      return true;
    };

    const handleFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      onSelect(file); 
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        handleFile(file);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        handleFile(file);
      }
    };

    return (
      <div
        className={`border-2 border-dashed border-brand rounded-xl p-6 text-center cursor-pointer ${className || ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="preview"
              className="rounded w-40 h-24 object-cover mb-2"
            />
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle2 size={16} className="mr-1" /> Uploaded
            </div>
          </div>
        ) : (
          <>
            <ImageIcon size={32} className="mx-auto text-brand mb-2" />
            <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">
              Only image files under {maxSizeMB}MB
            </p>
          </>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';
export default ImageUpload;
