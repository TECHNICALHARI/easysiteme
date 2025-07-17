'use client';

import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export default function CustomModal({
  children,
  onClose,
  width = '720px',
}: {
  children: ReactNode;
  onClose: () => void;
  width?: string;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={"modalOverlay"}>
      <div className={"customModal"} style={{ maxWidth: width }}>
        <button className={"modalCloseBtn"} onClick={onClose}>
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
