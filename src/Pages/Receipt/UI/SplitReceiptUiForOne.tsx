import React, { useState } from 'react';
import { ReceiptWithOrdersData, OrderDataSplitForOne } from '../../../Receipt/ReceiptData';
import { convertOrderDataListToOrderSplitForOneList } from '../../../UseCases/CreateReceiptUseCase';
import { buildOrderReportForOne } from '../../../UseCases/CreateReportUseCase';

interface SplitReceiptUiForOneProps {
  receiptWithOrders: ReceiptWithOrdersData;
  orderSplitList: OrderDataSplitForOne[];
  setOrderSplitList: React.Dispatch<React.SetStateAction<OrderDataSplitForOne[]>>;
}

const SplitReceiptUiForOne: React.FC<SplitReceiptUiForOneProps> = ({ receiptWithOrders, orderSplitList, setOrderSplitList }) => {
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportText, setReportText] = useState<string>('');

  // Remove local orderSplitList state and use the prop instead
  // Remove useEffect for initializing orderSplitList

  const handleQuantityChange = (orderIndex: number, newSelectedQuantity: number) => {
    setOrderSplitList(prev => prev.map((order, idx) =>
      idx === orderIndex ? { ...order, selectedQuantity: newSelectedQuantity } : order
    ));
  };

  // Placeholder for report generation for one person
  const handleSplitReceipt = () => {
    // Use the shared report generation function
    const selectedOrders = orderSplitList.filter(order => order.selectedQuantity > 0);
    if (selectedOrders.length === 0) {
      alert('Please select at least one item.');
      return;
    }
    const report = buildOrderReportForOne(receiptWithOrders.receipt, selectedOrders);
    setReportText(report || 'Error generating report.');
    setShowReportPopup(true);
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      alert('Report copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard. Please select and copy the text manually.');
    }
  };

  const handleCloseReportPopup = () => {
    setShowReportPopup(false);
    setReportText('');
  };

  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '18px 0 8px 0', color: '#1976d2', letterSpacing: 0.5 }}>Split Orders</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {orderSplitList.map((order, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              padding: '10px 12px 8px 12px',
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 1px 4px rgba(25, 118, 210, 0.07)',
              border: '1px solid #e3eaf5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minHeight: 60,
              transition: 'box-shadow 0.2s',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 1, wordBreak: 'break-word', paddingRight: 8 }}>
              {order.name} {order.translatedName && <span style={{ fontWeight: 400, color: '#888' }}>({order.translatedName})</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 2, width: '100%' }}>
              <div style={{ fontWeight: 500, color: '#1976d2', fontSize: 14 }}>
                {order.price.toFixed(2)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  id={`quantity-${idx}`}
                  type="number"
                  min={0}
                  max={order.quantity}
                  value={order.selectedQuantity}
                  onChange={e => handleQuantityChange(idx, Math.max(0, Math.min(order.quantity, Number(e.target.value))))}
                  style={{
                    width: 38,
                    padding: '2px 6px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    fontWeight: 500,
                    background: '#f7fafd',
                    color: '#222',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(60,72,100,0.04)',
                    transition: 'border 0.2s',
                    textAlign: 'center',
                  }}
                  onFocus={e => (e.currentTarget.style.border = '1.5px solid #1976d2')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid #d1d5db')}
                />
                <span style={{ color: '#aaa', fontSize: '1em', fontWeight: 400 }}>/ {order.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Split Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48, marginBottom: 32 }}>
        <button
          onClick={handleSplitReceipt}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 50,
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>
            👤 Split Receipt
          </span>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            transition: 'left 0.3s ease',
            zIndex: 0
          }} />
        </button>
      </div>
      {/* Report Popup Modal */}
      {showReportPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 400, maxWidth: 600, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 2 }}>Your Split Summary</h2>
              <button 
                onClick={handleCloseReportPopup}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 20 }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div style={{ 
              background: '#f8f9fa', 
              border: '1px solid #e9ecef', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 24,
              maxHeight: '50vh',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {reportText}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                onClick={handleCopyReport}
                style={{ 
                  padding: '12px 32px', 
                  borderRadius: 8, 
                  border: 'none', 
                  background: '#28a745', 
                  color: '#fff', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#218838'}
                onMouseLeave={e => e.currentTarget.style.background = '#28a745'}
              >
                📋 Copy Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SplitReceiptUiForOne; 