'use client';

import { useState } from 'react';
import styles from '@/styles/admin.module.css';
import { CheckCircle, Info, XCircle } from 'lucide-react';
import Modal from '@/lib/frontend/common/Modal';

interface DomainSetupModalProps {
  initialDomain?: string;
  onClose: () => void;
  onSave: (domain: string) => void;
}

export default function DomainSetupModal({
  initialDomain = '',
  onClose,
  onSave,
}: DomainSetupModalProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const isValidDomain = (val: string) => /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(val.trim());

  const handleSave = async () => {
    const trimmed = domain.trim().toLowerCase();

    if (!isValidDomain(trimmed)) {
      setError('Please enter a valid domain (e.g., yourdomain.com)');
      return;
    }

    setError(null);
    setIsSaving(true);
    setStatus('idle');

    try {
      // Send domain to backend for DNS verification or saving
      const res = await fetch('/api/setup-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      onSave(trimmed);
      onClose();
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Unable to save domain');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal title="Set Up Custom Domain" onClose={onClose} width="500px">
      <div className="flex flex-col gap-4">
        <div>
          <label className="labelText block mb-1">Your Custom Domain</label>
          <input
            className="input w-full"
            type="text"
            placeholder="yourdomain.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          {error && (
            <div className="text-sm text-red-500 mt-1 flex items-center gap-1">
              <XCircle size={16} /> {error}
            </div>
          )}
        </div>

        <div className="text-sm text-muted bg-gray-50 border rounded-md p-3 flex items-start gap-2">
          <Info size={20} className="mt-1" />
          <span>
            To connect your domain, add a <strong>CNAME</strong> record pointing to{' '}
            <code>cname.myeasypage.com</code>. Or use an <strong>A record</strong> pointing to your
            server IP. <br />
            DNS changes may take a few hours to propagate.
          </span>
        </div>

        <div className={styles.saveButtonMain}>
          <button
            className={`btn-primary ${styles.saveButton}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Domain'}
          </button>
        </div>

        {status === 'success' && (
          <div className="text-sm text-green-600 flex items-center gap-2 mt-1">
            <CheckCircle size={16} /> Domain saved successfully
          </div>
        )}
      </div>
    </Modal>
  );
}
