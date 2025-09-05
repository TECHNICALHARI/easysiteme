'use client';

import { useEffect, useMemo, useState } from 'react';
import UploadModal from '../../../common/UploadModal';
import styles from '@/styles/admin.module.css';
import { ImagePlus, X } from 'lucide-react';
import Modal from '../../../common/Modal';
import type { Service } from '@/lib/frontend/types/form';
import { isValidHttpUrl, normalizeHttpUrl } from '@/lib/frontend/utils/url';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type FieldErrors = {
  title?: string;
  description?: string;
  ctaLink?: string;
  amount?: string;
  customSymbol?: string;
};

type KnownCode = 'INR' | 'USD' | 'EUR' | 'GBP';
type CurrencyCode = KnownCode | 'NONE' | 'OTHER';

type CurrencyOption = { code: CurrencyCode; label: string; symbol: string };

const CURRENCIES: CurrencyOption[] = [
  { code: 'INR', label: 'INR (₹)', symbol: '₹' },
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  { code: 'NONE', label: 'None', symbol: '' },
  { code: 'OTHER', label: 'Other…', symbol: '' },
];

function clampAmount(value: string): string {
  let v = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
  const parts = v.split('.');
  if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
  const [intPart, decPart] = v.split('.');
  const clampedInt = (intPart || '').slice(0, 9);
  if (decPart === undefined) return clampedInt;
  if (decPart === '') return `${clampedInt}.`;
  return `${clampedInt}.${decPart.slice(0, 2)}`;
}

export default function ServiceFormModal({
  onSave,
  onClose,
  initialData,
}: {
  onSave: (data: Service) => void;
  onClose: () => void;
  initialData?: Service;
}) {
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(
    (initialData?.currencyCode as CurrencyCode) ?? 'INR'
  );
  const [customSymbol, setCustomSymbol] = useState(initialData?.customSymbol ?? '');
  const [amount, setAmount] = useState(initialData?.amount ?? '');
  const [image, setImage] = useState(initialData?.image ?? '');
  const [ctaLabel, setCtaLabel] = useState(initialData?.ctaLabel ?? '');
  const [ctaLink, setCtaLink] = useState(initialData?.ctaLink ?? '');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isValid, setIsValid] = useState(false);

  const currentSymbol = useMemo(() => {
    if (currencyCode === 'OTHER') return customSymbol.trim();
    return CURRENCIES.find(c => c.code === currencyCode)?.symbol ?? '';
  }, [currencyCode, customSymbol]);

  useEffect(() => {
    const next: FieldErrors = {};

    if (!title.trim()) next.title = 'Title is required.';
    if (!description.trim()) next.description = 'Description is required.';

    if (amount && !/^\d{1,9}(\.\d{0,2})?$/.test(amount)) {
      next.amount = 'Amount must be like 99 or 99.99';
    }

    if (currencyCode === 'OTHER') {
      if (!customSymbol.trim()) next.customSymbol = 'Enter a custom currency symbol.';
      else if (customSymbol.trim().length > 3)
        next.customSymbol = 'Symbol should be 1–3 characters.';
    }

    if (ctaLink.trim() && !isValidHttpUrl(normalizeHttpUrl(ctaLink))) {
      next.ctaLink = 'Enter a valid URL starting with http:// or https://';
    }

    setErrors(next);
    setIsValid(Object.keys(next).length === 0);
  }, [title, description, amount, ctaLink, currencyCode, customSymbol]);

  const handleSave = () => {
    const finalAmount = amount.endsWith('.') ? amount.slice(0, -1) : amount;
    if (finalAmount && !/^\d{1,9}(\.\d{1,2})?$/.test(finalAmount)) {
      setErrors(e => ({ ...e, amount: 'Amount must be like 99 or 99.99' }));
      showToast('Please fix the errors before saving.', 'error');
      return;
    }
    if (!isValid) {
      showToast('Please fix the errors before saving.', 'error');
      return;
    }

    const data: Service = {
      id: initialData?.id ?? `service-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      image: image || undefined,
      amount: finalAmount || undefined,
      currencyCode,
      currencySymbol: currentSymbol || undefined,
      customSymbol: currencyCode === 'OTHER' ? customSymbol.trim() : undefined,
      ctaLabel: ctaLabel.trim() || undefined,
      ctaLink: ctaLink.trim() ? normalizeHttpUrl(ctaLink) : undefined,
    };

    onSave(data);
    showToast(initialData ? 'Service updated' : 'Service added', 'success');
  };

  return (
    <Modal title={initialData ? 'Edit Service' : 'Add Service'} onClose={onClose} width="520px">
      <div className="flex flex-col gap-4">
        <input
          className="input"
          placeholder="Service Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={120}
        />
        {errors.title && <span className="errorText">{errors.title}</span>}

        <textarea
          className="input"
          rows={4}
          placeholder="Service Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={800}
        />
        {errors.description && <span className="errorText">{errors.description}</span>}

        <div className="grid grid-cols-[160px_1fr] gap-2">
          <select
            className="input"
            value={currencyCode}
            onChange={e => setCurrencyCode(e.target.value as CurrencyCode)}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder={currentSymbol ? `${currentSymbol} Amount` : 'Amount'}
            value={amount}
            onChange={e => setAmount(clampAmount(e.target.value))}
            onBlur={() => {
              if (amount.endsWith('.')) setAmount(amount.slice(0, -1));
            }}
            inputMode="decimal"
          />
        </div>
        {errors.amount && <span className="errorText">{errors.amount}</span>}

        {currencyCode === 'OTHER' && (
          <div>
            <input
              className="input"
              placeholder="Custom currency symbol"
              value={customSymbol}
              onChange={e => setCustomSymbol(e.target.value)}
              maxLength={3}
            />
            {errors.customSymbol && <span className="errorText">{errors.customSymbol}</span>}
          </div>
        )}

        <input
          className="input"
          placeholder='CTA Button Label (e.g., "Book Now", "Buy Service")'
          value={ctaLabel}
          onChange={e => setCtaLabel(e.target.value)}
          maxLength={40}
        />

        <input
          className="input"
          placeholder='CTA Button Link (e.g., "https://wa.me/91XXXXXXXXXX" or "https://example.com")'
          value={ctaLink}
          onChange={e => setCtaLink(e.target.value)}
        />
        {errors.ctaLink && <span className="errorText">{errors.ctaLink}</span>}

        <div className="flex flex-col items-center justify-center gap-2">
          <div className={styles.previewCircle} onClick={() => setShowUploadModal(true)}>
            {image ? (
              <>
                <button
                  className={styles.removeBtn}
                  onClick={e => {
                    e.stopPropagation();
                    setImage('');
                  }}
                >
                  <X size={14} />
                </button>
                <img src={image} alt="Service Image" className={styles.previewImage} />
              </>
            ) : (
              <div className={styles.previewPlaceholder}>
                <ImagePlus className="text-gray-400" size={24} />
                <span className="text-xs text-gray-500 mt-1">Upload Image</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.saveButtonMain}>
          <button
            className={`btn-primary ${styles.saveButton}`}
            onClick={handleSave}
            disabled={!isValid}
          >
            Save
          </button>
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSelectImage={val => {
            if (typeof val === 'string') setImage(val);
            else {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') setImage(reader.result);
              };
              reader.readAsDataURL(val);
            }
            setShowUploadModal(false);
          }}
          showTabs={false}
          type="image"
        />
      )}
    </Modal>
  );
}
