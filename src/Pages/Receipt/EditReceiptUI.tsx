import React, { useState, useEffect } from 'react';
import { ReceiptWithOrdersData, ReceiptData, OrderData } from '../../Receipt/ReceiptData';
import ReceiptInfoField from './UI/ReceiptInfoField';

interface EditReceiptUIProps {
  receiptWithOrders: ReceiptWithOrdersData;
  onEditSave: (newReceipt: ReceiptWithOrdersData) => void;
  onEditCancel: () => void;
}

// Helper type for editing
interface OrderEditFormData extends Omit<OrderData, 'price' | 'quantity'> {
  price: string;
  quantity: string;
}

const EditReceiptUI: React.FC<EditReceiptUIProps> = ({ receiptWithOrders, onEditSave, onEditCancel }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ReceiptData>({ ...receiptWithOrders.receipt });
  const [orders, setOrders] = useState(receiptWithOrders.orders.map(order => ({ ...order })));
  const [error, setError] = useState<string | null>(null);
  const [editingOrderIdx, setEditingOrderIdx] = useState<number | null>(null);
  const [orderEditForm, setOrderEditForm] = useState<OrderEditFormData | null>(null);
  const [orderEditError, setOrderEditError] = useState<string | null>(null);

  const handleEditClick = () => {
    setForm({ ...receiptWithOrders.receipt });
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue = value;
    // Special logic for 'total' to remove initial 0 when typing or pasting
    if (type === 'number' && name === 'total') {
      // Remove all leading zeros unless the value is exactly '0'
      if (newValue.length > 1) {
        newValue = newValue.replace(/^0+/, '');
        if (newValue === '') newValue = '0';
      }
    } else if (type === 'number' && newValue.length > 1) {
      newValue = newValue.replace(/^0+/, '');
      if (newValue === '') newValue = '0';
    }
    // If the value is '0' and the user types a digit, replace '0' with the digit
    if (type === 'number' && name === 'total' && form.total === 0 && newValue.length === 2 && newValue[0] === '0') {
      newValue = newValue[1];
    }
    // If empty, show 0
    if (type === 'number' && newValue === '') newValue = '0';
    // Enforce max for tax, discount, tip
    if ((name === 'tax' || name === 'discount' || name === 'tip') && Number(newValue) > 100) {
      newValue = '100';
    }
    // Enforce max for total
    if (name === 'total' && Number(newValue) > 99999999) {
      newValue = '99999999';
    }
    setForm((prev) => ({
      ...prev,
      [name]: name === 'total' || name === 'tax' || name === 'discount' || name === 'tip' ? Number(newValue) : newValue,
    }));
    if (name === 'receiptName' || name === 'date') {
      setError(null);
    }
  };

  const handleTranslatedNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      translatedReceiptName: value === '' ? undefined : value,
    }));
  };

  const handleCancel = () => {
    setShowModal(false);
    onEditCancel();
  };

  // Add handler for Save button in Edit Receipt Info modal
  const handleSave = () => {
    setShowModal(false);
    onEditSave({ receipt: { ...form }, orders: orders.map(o => ({ ...o })) });
  };

  // Add increment/decrement handlers for tax, discount, tip
  const handleIncrement = (field: 'tax' | 'discount' | 'tip') => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.min((prev[field] ?? 0) + 1, 100),
    }));
  };
  const handleDecrement = (field: 'tax' | 'discount' | 'tip') => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.max((prev[field] ?? 0) - 1, 0),
    }));
  };

  const handleOrderEditClick = (idx: number) => {
    setEditingOrderIdx(idx);
    // Store price and quantity as strings for editing
    setOrderEditForm({
      ...orders[idx],
      price: String(orders[idx].price),
      quantity: String(orders[idx].quantity),
    });
    setOrderEditError(null);
  };

  const handleOrderEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    // Remove leading zeros for quantity and price fields
    if (name === 'quantity') {
      // Only allow integer values
      newValue = newValue.replace(/[^\d]/g, '');
      newValue = newValue.replace(/^0+(\d)/, '$1');
      if (newValue === '') newValue = '0';
    }
    if (name === 'price') {
      // Only strip leading zeros if not immediately followed by a decimal point
      newValue = newValue.replace(/^0+(?!\.)/, '');
      if (newValue === '') newValue = '0';
    }
    // Enforce min/max for price and quantity
    if (name === 'price') {
      let num = Number(newValue);
      if (num > 9999999) newValue = '9999999';
      if (num < -9999999) newValue = '-9999999';
    }
    if (name === 'quantity') {
      let num = parseInt(newValue, 10);
      if (num > 99) newValue = '99';
      if (num < 0) newValue = '0';
    }
    setOrderEditForm((prev: any) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleOrderEditSave = () => {
    if (!orderEditForm?.name) {
      setOrderEditError('Name cannot be empty.');
      return;
    }
    // Convert quantity and price to numbers for validation and saving
    const quantity = parseInt(orderEditForm.quantity, 10);
    const price = Number(orderEditForm.price);
    if (quantity < 1 || quantity > 99) {
      setOrderEditError('Amount must be between 0 and 99.');
      return;
    }
    if (price < -9999999 || price > 9999999) {
      setOrderEditError('Price must be between -9,999,999 and 9,999,999.');
      return;
    }
    const newOrders = orders.map((order, idx) => idx === editingOrderIdx ? { ...orderEditForm, quantity, price } : order);
    setOrders(newOrders);
    setEditingOrderIdx(null);
    setOrderEditForm(null);
    setOrderEditError(null);
    // Save order edits to parent immediately
    onEditSave({ receipt: { ...form }, orders: newOrders.map(o => ({ ...o })) });
  };

  const handleOrderEditCancel = () => {
    setEditingOrderIdx(null);
    setOrderEditForm(null);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ marginTop: 4, marginBottom: 24 }}>
        <ReceiptInfoField receipt={receiptWithOrders.receipt} onEdit={handleEditClick} />
      </div>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '18px 0 8px 0', color: '#1976d2', letterSpacing: 0.5 }}>Orders</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}>
          {orders.map((order, idx) => (
            <div
              key={order.name + idx}
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
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              tabIndex={0}
              aria-label={`Edit order ${order.name}`}
              onClick={() => handleOrderEditClick(idx)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOrderEditClick(idx); }}
            >
              <button
                onClick={e => { e.stopPropagation(); handleOrderEditClick(idx); }}
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
                aria-label={`Edit order ${order.name}`}
                tabIndex={-1}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
              </button>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 1, wordBreak: 'break-word', paddingRight: 22 }}>
                {order.name} {order.translatedName && <span style={{ fontWeight: 400, color: '#888' }}>({order.translatedName})</span>}
              </div>
              <div style={{ fontWeight: 500, color: '#1976d2', fontSize: 14, marginBottom: 2 }}>{order.quantity} x {order.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Edit Modal */}
      {showModal && (
        <>
          <style>{`
            .edit-modal-overlay {
              position: fixed;
              top: 0; left: 0; width: 100vw; height: 100vh;
              background: rgba(0,0,0,0.25);
              display: flex; align-items: center; justify-content: center;
              z-index: 1000;
              padding: 16px;
            }
            .edit-modal {
              background: #fff;
              border-radius: 12px;
              padding: 32px;
              min-width: 320px;
              max-width: 95vw;
              width: 420px;
              box-shadow: 0 2px 16px rgba(0,0,0,0.15);
              max-height: 90vh;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
            }
            @media (max-width: 600px) {
              .edit-modal-overlay {
                padding: 8px;
              }
              .edit-modal {
                width: 100%;
                min-width: unset;
                padding: 20px 16px;
                font-size: 15px;
                border-radius: 8px;
                max-height: 95vh;
              }
              .edit-modal h2 {
                font-size: 1.2em;
                margin-bottom: 16px;
              }
              .edit-modal input {
                font-size: 16px !important;
              }
            }
            @media (max-width: 480px) {
              .edit-modal {
                padding: 16px 12px;
              }
            }
          `}</style>
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h2>Edit Receipt Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                <label>
                  Name:
                  <input name="receiptName" maxLength={70} value={form.receiptName} onChange={handleChange} style={{ width: '100%', marginTop: 4, height: 36 }} />
                </label>
                <label>
                  Translated Name:
                  <input name="translatedReceiptName" maxLength={70} value={form.translatedReceiptName ?? ''} onChange={handleTranslatedNameChange} style={{ width: '100%', marginTop: 4, height: 36 }} />
                </label>
                <label>
                  Date:
                  <input name="date" maxLength={70} value={form.date} onChange={handleChange} style={{ width: '100%', marginTop: 4, height: 36 }} />
                </label>
                <label>
                  Total:
                  <input
                    name="total"
                    type="number"
                    min={0}
                    max={99999999}
                    value={form.total === 0 ? '0' : String(form.total).replace(/^0+(\d)/, '$1')}
                    onChange={handleChange}
                    style={{ width: '100%', marginTop: 4, height: 36 }}
                  />
                </label>
                {/* Modern increment/decrement controls for tax, discount, tip */}
                <div style={{ 
                  display: 'flex', 
                  gap: 16, 
                  marginTop: 8, 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}>
                  {(['tax', 'discount', 'tip'] as const).map((field) => (
                    <div key={field} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      flex: '1 1 auto',
                      minWidth: '120px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ 
                        fontWeight: 500, 
                        marginBottom: 4, 
                        textTransform: 'capitalize',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}>{field.charAt(0).toUpperCase() + field.slice(1)} (%)</span>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: '#f5f5f5', 
                        borderRadius: 8, 
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', 
                        padding: '4px 8px',
                        minWidth: '100px',
                        justifyContent: 'center'
                      }}>
                        <button
                          type="button"
                          onClick={() => handleDecrement(field)}
                          style={{
                            border: 'none',
                            background: '#e0e7ef',
                            color: '#1976d2',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            fontSize: 18,
                            fontWeight: 700,
                            cursor: 'pointer',
                            marginRight: 6,
                            transition: 'background 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >-</button>
                        <span style={{ 
                          minWidth: 28, 
                          textAlign: 'center', 
                          fontSize: 16, 
                          fontWeight: 600 
                        }}>{form[field] ?? 0}</span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(field)}
                          style={{
                            border: 'none',
                            background: '#e0e7ef',
                            color: '#1976d2',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            fontSize: 18,
                            fontWeight: 700,
                            cursor: 'pointer',
                            marginLeft: 6,
                            transition: 'background 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
              <div style={{ 
                display: 'flex', 
                gap: 12, 
                marginTop: 32, 
                justifyContent: 'flex-end',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={handleCancel} 
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: 6, 
                    border: '1px solid #bbb', 
                    background: '#f5f5f5', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    minWidth: '80px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: 6, 
                    border: 'none', 
                    background: '#1976d2', 
                    color: '#fff', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    fontSize: '14px',
                    minWidth: '80px'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Order Edit Modal */}
      {editingOrderIdx !== null && orderEditForm && (
        <>
          <style>{`
            .order-edit-modal-overlay {
              position: fixed;
              top: 0; left: 0; width: 100vw; height: 100vh;
              background: rgba(0,0,0,0.25);
              display: flex; align-items: center; justify-content: center;
              z-index: 1100;
            }
            .order-edit-modal {
              background: #fff;
              border-radius: 12px;
              padding: 32px;
              min-width: 320px;
              max-width: 95vw;
              width: 420px;
              box-shadow: 0 2px 16px rgba(0,0,0,0.15);
              max-height: 90vh;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
            }
            @media (max-width: 600px) {
              .order-edit-modal {
                width: 98vw;
                min-width: unset;
                padding: 16px 6px;
                font-size: 15px;
                border-radius: 8px;
              }
              .order-edit-modal h2 {
                font-size: 1.2em;
              }
            }
          `}</style>
          <div className="order-edit-modal-overlay">
            <div className="order-edit-modal">
              <h2>Edit Order</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                <label>
                  Name:
                  <input name="name" maxLength={70} value={orderEditForm.name} onChange={handleOrderEditChange} style={{ width: '100%', marginTop: 4, height: 36 }} />
                </label>
                <label>
                  Translated Name:
                  <input name="translatedName" maxLength={70} value={orderEditForm.translatedName ?? ''} onChange={handleOrderEditChange} style={{ width: '100%', marginTop: 4, height: 36 }} />
                </label>
                <label>
                  Amount:
                  <input name="quantity" type="number" min={0} max={99} step={1} value={String(orderEditForm.quantity)} onChange={handleOrderEditChange} 
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault(); }}
                    style={{ width: '100%', marginTop: 4, height: 36 }} />
                </label>
                <label>
                  Price:
                  <input name="price" type="number" min={-9999999} max={9999999} step="0.01" value={String(orderEditForm.price)} onChange={handleOrderEditChange} style={{ width: '100%', marginTop: 4, height: 36 }} />
                </label>
                {orderEditError && <div style={{ color: 'red', marginTop: 8 }}>{orderEditError}</div>}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 32, justifyContent: 'flex-end' }}>
                <button onClick={handleOrderEditCancel} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #bbb', background: '#f5f5f5', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleOrderEditSave} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditReceiptUI; 