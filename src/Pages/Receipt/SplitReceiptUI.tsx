import React, { useState } from 'react';
import { ReceiptWithOrdersData, OrderDataSplitForAll, OrderDataSplitForOne } from '../../Receipt/ReceiptData';
import { buildOrderReportForAll } from '../../UseCases/CreateReportUseCase';
import SplitReceiptUiForAll from './UI/SplitReceiptUiForAll';
import SplitReceiptUiForOne from './UI/SplitReceiptUiForOne';
import ReceiptInfoField from './UI/ReceiptInfoField';
import SplitModeField, { SplitMode } from './UI/SplitModeField';

interface SplitReceiptUIProps {
  receiptWithOrders: ReceiptWithOrdersData;
  names: string[];
  onAddName: (name: string) => void;
  onRemoveName: (nameToRemove: string) => void;
  orderSplitListForAll: OrderDataSplitForAll[];
  setOrderSplitListForAll: React.Dispatch<React.SetStateAction<OrderDataSplitForAll[]>>;
  orderSplitListForOne: OrderDataSplitForOne[];
  setOrderSplitListForOne: React.Dispatch<React.SetStateAction<OrderDataSplitForOne[]>>;
}

const SplitReceiptUI: React.FC<SplitReceiptUIProps> = ({ 
  receiptWithOrders, 
  names, 
  onAddName, 
  onRemoveName,
  orderSplitListForAll,
  setOrderSplitListForAll,
  orderSplitListForOne,
  setOrderSplitListForOne
}) => {
  const [editingOrderIndex, setEditingOrderIndex] = useState<number | null>(null);
  const [selectedConsumers, setSelectedConsumers] = useState<string[]>([]);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportText, setReportText] = useState<string>('');
  const [splitMode, setSplitMode] = useState<SplitMode>('all');

  const handleEditConsumers = (orderIndex: number) => {
    const order = orderSplitListForAll[orderIndex];
    if (order) {
      setEditingOrderIndex(orderIndex);
      setSelectedConsumers([...order.consumerNamesList]);
    }
  };

  const handleSaveConsumers = () => {
    if (editingOrderIndex !== null) {
      setOrderSplitListForAll(prev => prev.map((order, index) => 
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
    setOrderSplitListForAll(prev => prev.map((order, index) => 
      index === orderIndex 
        ? { ...order, consumerNamesList: order.consumerNamesList.filter(name => name !== consumerName) }
        : order
    ));
  };

  const handleSplitReceipt = () => {
    const report = buildOrderReportForAll(receiptWithOrders.receipt, orderSplitListForAll);
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

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ marginTop: 4, marginBottom: 24 }}>
        <ReceiptInfoField receipt={receiptWithOrders.receipt} />
      </div>
      {/* Split Mode Modern Segmented Control */}
      <div style={{ marginBottom: 24 }}>
        <SplitModeField value={splitMode} onChange={setSplitMode} />
      </div>
      {/* Render the correct UI mode below */}
      {splitMode === 'all' ? (
        <SplitReceiptUiForAll
          receiptWithOrders={receiptWithOrders}
          names={names}
          onAddName={onAddName}
          onRemoveName={onRemoveName}
          orderSplitList={orderSplitListForAll}
          setOrderSplitList={setOrderSplitListForAll}
        />
      ) : (
        <SplitReceiptUiForOne
          receiptWithOrders={receiptWithOrders}
          orderSplitList={orderSplitListForOne}
          setOrderSplitList={setOrderSplitListForOne}
        />
      )}
    </div>
  );
};

export default SplitReceiptUI; 