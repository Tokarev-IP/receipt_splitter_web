import React from 'react';
import { ReactComponent as SettingsIcon } from '../../../logo.svg';

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    title="Settings"
    style={{
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      border: '1px solid rgba(25, 118, 210, 0.2)',
      borderRadius: '50%',
      width: 'clamp(36px, 6vw, 48px)',
      height: 'clamp(36px, 6vw, 48px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.25)';
      e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.4)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.borderColor = 'rgba(25, 118, 210, 0.2)';
    }}
  >
    <SettingsIcon style={{ 
      width: 'clamp(16px, 3vw, 22px)', 
      height: 'clamp(16px, 3vw, 22px)', 
      fill: '#1976d2' 
    }} />
  </button>
);

export default SettingsButton; 