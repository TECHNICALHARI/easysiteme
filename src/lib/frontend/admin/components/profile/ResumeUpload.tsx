'use client';

import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export interface ResumeUploadProps {
  onSelectFile: (file: File) => void;
}

export interface ResumeUploadRef {
  reset: () => void;
}

const ResumeUpload = forwardRef<ResumeUploadRef, ResumeUploadProps>(({ onSelectFile }, ref) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  useImperativeHandle(ref, () => ({
    reset() {
      setUploadedFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }));

  const validateFile = (file: File) => {
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isValidSize = file.size <= 5 * 1024 * 1024;
    if (!isPDF) {
      alert('Only PDF files are allowed.');
      return false;
    }
    if (!isValidSize) {
      alert('File must be less than 5MB.');
      return false;
    }
    return true;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFileName(file.name);
      onSelectFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFileName(file.name);
      onSelectFile(file);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-brand rounded-xl p-6 text-center cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      {uploadedFileName ? (
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 size={20} className="text-green-600" />
          <p className="text-sm text-gray-700">Uploaded: {uploadedFileName}</p>
        </div>
      ) : (
        <>
          <FileText size={32} className="mx-auto text-brand mb-2" />
          <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">Only PDF files under 5MB</p>
        </>
      )}
    </div>
  );
});

ResumeUpload.displayName = 'ResumeUpload';

export default ResumeUpload;
