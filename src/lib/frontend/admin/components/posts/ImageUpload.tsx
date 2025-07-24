'use client';

import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ImagePlus, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export interface ImageUploadProps {
  onSelect: (file: File) => void;
  maxSizeMB?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export interface ImageUploadRef {
  reset: () => void;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ onSelect, maxSizeMB = 5, label = 'Drag & drop or click to upload image', className, disabled=false }, ref) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');

    useImperativeHandle(ref, () => ({
      reset() {
        setUploadedFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }));

    const validateFile = (file: File): boolean => {
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        setUploadedFileName(file.name);
        onSelect(file);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        setUploadedFileName(file.name);
        onSelect(file);
      }
    };

    return (
      <div
        className={clsx(
          'border-2 border-dashed border-brand rounded-xl p-6 text-center cursor-pointer transition hover:bg-gray-50',
          className
        )}
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
          disabled={disabled}
        />

        {uploadedFileName ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" />
            <p className="text-sm text-gray-700">Uploaded: {uploadedFileName}</p>
          </div>
        ) : (
          <>
            <ImagePlus size={32} className="mx-auto text-brand mb-2" />
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xs text-gray-400 mt-1">Only image files under {maxSizeMB}MB</p>
          </>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
