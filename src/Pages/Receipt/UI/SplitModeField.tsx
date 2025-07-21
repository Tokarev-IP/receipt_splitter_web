import React from 'react';

export type SplitMode = 'all' | 'one';

interface SplitModeFieldProps {
  value: SplitMode;
  onChange: (mode: SplitMode) => void;
}

const SplitModeField: React.FC<SplitModeFieldProps> = ({ value, onChange }) => {
  return (
    <div
      role="radiogroup"
      aria-label="Split Mode"
      style={{
        display: 'flex',
        background: '#f5f7fa',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: 4,
        gap: 4,
        width: 'fit-content',
        margin: '0 auto',
      }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === 'all'}
        tabIndex={value === 'all' ? 0 : -1}
        onClick={() => onChange('all')}
        style={{
          flex: 1,
          padding: '12px 28px',
          border: 'none',
          borderRadius: 8,
          background: value === 'all' ? '#1976d2' : 'transparent',
          color: value === 'all' ? '#fff' : '#1976d2',
          fontWeight: 600,
          fontSize: 15,
          outline: value === 'all' ? '2px solid #1976d2' : 'none',
          boxShadow: value === 'all' ? '0 2px 8px rgba(25,118,210,0.08)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 20 }}>🧮</span>
        <span>Split for All</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'one'}
        tabIndex={value === 'one' ? 0 : -1}
        onClick={() => onChange('one')}
        style={{
          flex: 1,
          padding: '12px 28px',
          border: 'none',
          borderRadius: 8,
          background: value === 'one' ? '#1976d2' : 'transparent',
          color: value === 'one' ? '#fff' : '#1976d2',
          fontWeight: 600,
          fontSize: 15,
          outline: value === 'one' ? '2px solid #1976d2' : 'none',
          boxShadow: value === 'one' ? '0 2px 8px rgba(25,118,210,0.08)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 20 }}>👤</span>
        <span>Split for One</span>
      </button>
    </div>
  );
};

export default SplitModeField; 