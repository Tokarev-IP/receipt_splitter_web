import React from 'react';

const ReceiptExamplePage: React.FC = () => {
  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(60,72,88,0.12)', padding: '2.5rem 2rem', maxWidth: 420, width: '100%', margin: '2rem auto 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img
            src={process.env.PUBLIC_URL + '/receipt_example.jpg'}
            alt="Example receipt"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: 12, border: '1.5px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', transition: 'transform 0.2s', cursor: 'pointer' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptExamplePage;
