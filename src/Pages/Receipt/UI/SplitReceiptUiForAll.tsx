import React, { useState } from 'react';
import { ReceiptWithOrdersData, OrderDataSplitForAll } from '../../../Receipt/ReceiptData';
import { buildOrderReportForAll } from '../../../UseCases/CreateReportUseCase';

interface SplitReceiptUiForAllProps {
  receiptWithOrders: ReceiptWithOrdersData;
  names: string[];
  onAddName: (name: string) => void;
  onRemoveName: (nameToRemove: string) => void;
  orderSplitList: OrderDataSplitForAll[];
  setOrderSplitList: React.Dispatch<React.SetStateAction<OrderDataSplitForAll[]>>;
}

const SplitReceiptUiForAll: React.FC<SplitReceiptUiForAllProps> = ({ receiptWithOrders, names, onAddName, onRemoveName, orderSplitList, setOrderSplitList }) => {
  const [editingOrderIndex, setEditingOrderIndex] = useState<number | null>(null);
  const [selectedConsumers, setSelectedConsumers] = useState<string[]>([]);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportText, setReportText] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const [showAddNameModal, setShowAddNameModal] = useState(false);

  const handleEditConsumers = (orderIndex: number) => {
    const order = orderSplitList[orderIndex];
    if (order) {
      setEditingOrderIndex(orderIndex);
      setSelectedConsumers([...order.consumerNamesList]);
    }
  };

  const handleSaveConsumers = () => {
    if (editingOrderIndex !== null) {
      setOrderSplitList(prev => prev.map((order, index) => 
        index === editingOrderIndex 
          ? { ...order, consumerNamesList: selectedConsumers }
          : order
      ));
      setEditingOrderIndex(null);
      setSelectedConsumers([]);
    }
  };

  const handleCancelEdit = () => {
    setEditingOrderIndex(null);
    setSelectedConsumers([]);
  };

  const handleToggleConsumer = (name: string) => {
    setSelectedConsumers(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const handleRemoveConsumerFromOrder = (orderIndex: number, consumerName: string) => {
    setOrderSplitList(prev => prev.map((order, index) => 
      index === orderIndex 
        ? { ...order, consumerNamesList: order.consumerNamesList.filter(name => name !== consumerName) }
        : order
    ));
  };

  const handleSplitReceipt = () => {
    const report = buildOrderReportForAll(receiptWithOrders.receipt, orderSplitList);
    if (report) {
      setReportText(report);
      setShowReportPopup(true);
    } else {
      alert('Unable to generate report. Please make sure orders are assigned to consumers.');
    }
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

  const handleAddName = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const exists = names.some(n => n.trim().toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setNameError('This name already exists.');
      return;
    }
    setNameError('');
    setNewName('');
    onAddName(trimmed);
    setShowAddNameModal(false);
  };

  const handleOpenAddNameModal = () => {
    setShowAddNameModal(true);
    setNewName('');
    setNameError('');
  };

  const handleCloseAddNameModal = () => {
    setShowAddNameModal(false);
    setNewName('');
    setNameError('');
  };

  return (
    <>
      {/* Names Section Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.10), 0 2px 8px rgba(102, 126, 234, 0.06)',
        padding: '8px 20px 16px 20px',
        marginBottom: 32,
        maxWidth: 900,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <h2 style={{ color: '#1976d2', fontWeight: 700, fontSize: 26, marginTop: 0, marginBottom: 4 }}>Names</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          padding: '8px 0 0 0',
          alignItems: 'center',
          overflowX: 'visible',
        }}>
          {names.map((name, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f4f6fa',
                border: '1px solid #e0e3ea',
                borderRadius: 24,
                padding: '8px 16px 8px 16px',
                fontSize: 16,
                fontWeight: 500,
                color: '#222',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.07)',
                position: 'relative',
                transition: 'box-shadow 0.2s',
              }}
              tabIndex={0}
              aria-label={`Name: ${name}`}
            >
              <span style={{ marginRight: 8 }}>{name}</span>
              <button
                onClick={() => onRemoveName(name)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  backgroundColor: '#e57373',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginLeft: 2,
                  boxShadow: '0 1px 4px rgba(229, 115, 115, 0.15)',
                  transition: 'background 0.2s',
                }}
                aria-label={`Remove ${name}`}
                onMouseEnter={e => (e.currentTarget.style.background = '#d32f2f')}
                onMouseLeave={e => (e.currentTarget.style.background = '#e57373')}
              >
                ×
              </button>
            </div>
          ))}
          {/* Floating Add Name Button */}
          <button
            onClick={handleOpenAddNameModal}
            style={{
              minWidth: 48,
              minHeight: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
              marginLeft: 8,
              cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s',
              outline: 'none',
            }}
            aria-label="Add New Name"
            onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}
          >
            +
          </button>
        </div>
      </div>
      {/* Add Name Modal */}
      {showAddNameModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <h2 style={{ marginTop: 0 }}>Add New Name</h2>
            <input
              type="text"
              value={newName}
              onChange={e => { setNewName(e.target.value); setNameError(''); }}
              placeholder="Enter name"
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 24,
                border: '1px solid #ccc',
                fontSize: 16,
                outline: nameError ? '2px solid #e57373' : 'none',
                marginBottom: 8,
                boxSizing: 'border-box',
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleAddName(); if (e.key === 'Escape') handleCloseAddNameModal(); }}
              aria-label="Enter new name"
              autoFocus
              maxLength={50}
            />
            {nameError && (
              <div style={{ color: '#e57373', fontSize: 14, marginBottom: 8, fontWeight: 500 }}>{nameError}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              <button onClick={handleCloseAddNameModal} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #bbb', background: '#f5f5f5', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAddName} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 600, cursor: 'pointer' }} disabled={!newName.trim()}>Add</button>
            </div>
          </div>
        </div>
      )}
      {/* Order Grid For All - Modernized */}
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '18px 0 8px 0', color: '#1976d2', letterSpacing: 0.5 }}>Split Orders</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
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
            tabIndex={0}
            aria-label={`Assign consumers for ${order.name}`}
          >
            {/* Edit icon top right */}
            <button
              onClick={() => handleEditConsumers(idx)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
                borderRadius: 5,
                transition: 'background 0.2s',
                outline: 'none',
              }}
              aria-label="Assign Consumers"
              onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" stroke="#1976d2" strokeWidth="2" fill="white"/>
                <circle cx="12" cy="10" r="3"/>
                <path d="M7 17c0-2.5 3.5-4 5-4s5 1.5 5 4"/>
              </svg>
            </button>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 1, wordBreak: 'break-word', paddingRight: 22 }}>
              {order.name} {order.translatedName && <span style={{ fontWeight: 400, color: '#888' }}>({order.translatedName})</span>}
            </div>
            <div style={{ fontWeight: 500, color: '#1976d2', fontSize: 14, marginBottom: 2 }}>{order.price.toFixed(2)}</div>
            {order.consumerNamesList.length > 0 && (
              <div style={{ marginTop: 4 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {order.consumerNamesList.map((consumer, consumerIdx) => (
                    <div key={consumerIdx} style={{ position: 'relative', display: 'inline-block' }}>
                      <span style={{ fontSize: '0.8em', background: '#e3f2fd', padding: '2px 6px', borderRadius: 4, color: '#1976d2', paddingRight: '20px' }}>
                        {consumer}
                      </span>
                      <button
                        onClick={() => handleRemoveConsumerFromOrder(idx, consumer)}
                        style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          background: '#6c757d',
                          border: 'none',
                          borderRadius: '50%',
                          width: 16,
                          height: 16,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          color: '#fff',
                          fontWeight: 'bold',
                          lineHeight: 1,
                        }}
                        aria-label={`Remove ${consumer} from ${order.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Edit Consumers Modal */}
      {editingOrderIndex !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 500, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <h2>Select Consumers</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              {names.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center' }}>No names added yet. Add some names first!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {names.map((name) => (
                    <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 6, cursor: 'pointer', background: selectedConsumers.includes(name) ? '#e3f2fd' : 'transparent' }}>
                      <input
                        type="checkbox"
                        checked={selectedConsumers.includes(name)}
                        onChange={() => handleToggleConsumer(name)}
                        style={{ width: 16, height: 16 }}
                      />
                      <span style={{ fontWeight: selectedConsumers.includes(name) ? 600 : 400, color: selectedConsumers.includes(name) ? '#1976d2' : '#333' }}>
                        {name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 16 }}>
                <button onClick={handleCancelEdit} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #bbb', background: '#f5f5f5', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSaveConsumers} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Report Popup Modal */}
      {showReportPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 400, maxWidth: 600, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 2 }}>Receipt Split Report</h2>
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
                onMouseEnter={(e) => e.currentTarget.style.background = '#218838'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#28a745'}
              >
                📋 Copy Report
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Split Button - Show for both modes */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: 48, 
        marginBottom: 32 
      }}>
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
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>
            🧮 Split Receipt
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
    </>
  );
};

export default SplitReceiptUiForAll; 