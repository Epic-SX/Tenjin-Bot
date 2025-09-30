import React from 'react';

export const Pin: React.FC<{ filled?: boolean; className?: string }> = ({ filled, className }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className}>
    <path
      d="M14 3l7 7-4 1-3 6-2-2-6 3 3-6-2-2 7-7z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const CaretDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

export const Dots: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className}>
    <circle cx="5" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="19" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const ArrowCollapse: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className}>
    <path d="M9 6l-4 4 4 4M15 6l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

export const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" />
    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);