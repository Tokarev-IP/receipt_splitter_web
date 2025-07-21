import React from 'react';
import { useNavigate } from 'react-router-dom';

const InfoPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f7fafc' }}>
      <h1 style={{ marginBottom: '1rem', color: '#2d3748' }}>This is a receipt splitter app.</h1>
      <button
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1.1rem',
          background: '#3182ce',
          color: '#fff',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
        onMouseOut={e => (e.currentTarget.style.background = '#3182ce')}
        onClick={() => navigate('/signin')}
      >
        Start
      </button>
    </div>
  );
};

export default InfoPage; 