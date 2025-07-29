'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      {label && <label className="select-label">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={clsx('input custom-select-button', {
          placeholder: !selectedOption,
        })}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown className="custom-select-icon" size={18} />
      </button>

      {open && (
        <div className="custom-select-dropdown">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={clsx('custom-select-option', {
                selected: opt.value === value,
              })}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
