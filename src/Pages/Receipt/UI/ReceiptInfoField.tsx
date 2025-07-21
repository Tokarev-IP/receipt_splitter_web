import React from 'react';
import { ReceiptData } from '../../../Receipt/ReceiptData';

interface ReceiptInfoFieldProps {
  receipt: ReceiptData;
  onEdit?: () => void;
}

const ReceiptInfoField: React.FC<ReceiptInfoFieldProps> = ({ receipt, onEdit }) => {
  return (
    <section
      style={{
        marginBottom: 24,
        padding: 20,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid rgba(25, 118, 210, 0.12)',
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
        minWidth: 0,
        flexWrap: 'wrap',
      }}
      aria-label="Receipt Info"
    >
      <div style={{ flex: 1, minWidth: 180 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 2, color: '#1976d2' }}>Receipt Info</h2>
        <div style={{ marginTop: 8, fontSize: 16, color: '#333', lineHeight: 1.7 }}>
          <div><b>Name:</b> {receipt.receiptName}{receipt.translatedReceiptName && (
            <span style={{ fontWeight: 400, color: '#888' }}> ({receipt.translatedReceiptName})</span>
          )}
          </div>
          <div><b>Date:</b> {receipt.date}</div>
          <div><b>Total:</b> {receipt.total.toFixed(2)}</div>
        </div>
      </div>
      <div style={{ minWidth: 120, textAlign: 'left', alignSelf: 'flex-end', fontSize: 15, color: '#444' }}>
        <div><b>Tax, % =</b> {(receipt.tax ?? 0).toFixed(2)}</div>
        <div><b>Discount, % =</b> {(receipt.discount ?? 0).toFixed(2)}</div>
        <div><b>Tip, % =</b> {(receipt.tip ?? 0).toFixed(2)}</div>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          style={{
            marginLeft: 24,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            alignSelf: 'flex-start',
            position: 'absolute',
            top: 20,
            right: 20,
            borderRadius: 6,
            transition: 'background 0.2s',
          }}
          aria-label="Edit Receipt Info"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        </button>
      )}
    </section>
  );
};

export default ReceiptInfoField; 