import React, { useRef, useState, useEffect } from 'react';
import { generateReceipt, generateReceiptTranslated } from "../../UseCases/CreateReceiptUseCase";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { ReceiptWithOrdersData } from "../../Receipt/ReceiptData";
import CreateReceiptUI from './CreateReceiptUI';
import EditReceiptUI from './EditReceiptUI';
import SplitReceiptUI from './SplitReceiptUI';
import { convertOrderDataListToOrderSplitDataList, convertOrderDataListToOrderSplitForOneList } from '../../UseCases/CreateReceiptUseCase';
import { OrderDataSplitForAll, OrderDataSplitForOne } from '../../Receipt/ReceiptData';
import { signInAnonymously } from '../../Firebase/FirebaseAuth';

const ReceiptPage: React.FC = () => {
  const [receiptWithOrders, setReceiptWithOrders] = useState<ReceiptWithOrdersData | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [step, setStep] = useState<'create' | 'edit' | 'split'>('create');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const prevOrdersRef = useRef<any[]>([]);
  const [orderSplitListForAll, setOrderSplitListForAll] = useState<OrderDataSplitForAll[]>([]);
  const [orderSplitListForOne, setOrderSplitListForOne] = useState<OrderDataSplitForOne[]>([]);

  const handleSignInAnonymously = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInAnonymously();
    } catch (error: any) {
      setAuthError(error?.message || 'Failed to sign in anonymously. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setAuthError(null);
      } else {
        await handleSignInAnonymously();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!receiptWithOrders) return;
    const orders = receiptWithOrders.orders;
    const currentOrders = orders.map(o => ({ name: o.name, quantity: o.quantity, price: o.price, translatedName: o.translatedName }));
    const changed = prevOrdersRef.current.length !== currentOrders.length ||
      prevOrdersRef.current.some((o, i) =>
        o.name !== currentOrders[i].name ||
        o.quantity !== currentOrders[i].quantity ||
        o.price !== currentOrders[i].price ||
        o.translatedName !== currentOrders[i].translatedName
      );
    if (changed) {
      prevOrdersRef.current = currentOrders;
      setOrderSplitListForAll(convertOrderDataListToOrderSplitDataList(orders));
      setOrderSplitListForOne(convertOrderDataListToOrderSplitForOneList(orders));
    }
  }, [receiptWithOrders ? receiptWithOrders.orders : undefined]);

  const processImage = async (image: File, language?: string): Promise<ReceiptWithOrdersData & { attemptsLeft: number }> => {
    let data;
    if (language && language !== 'English') {
      data = await generateReceiptTranslated(image, language, user?.uid || 'anonymous');
    } else {
      data = await generateReceipt(image, user?.uid || 'anonymous');
    }
    return data;
  };

  const handleChooseImage = () => {
    setStep('create');
    setReceiptWithOrders(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setShowImageModal(true);
    }
  };

  const handleCancelModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const handleContinueModal = async (language?: string) => {
    if (!selectedImage) return;
    setShowImageModal(false);
    setLoading(true);
    setErrorMessage(null);
    try {
        const data = await processImage(selectedImage, language);
        setReceiptWithOrders(data);
        setStep('edit');
    } catch (err: any) {
        if (err && err.message && err.attemptsLeft !== undefined && err.waitTimeMs !== undefined) {
            const waitSeconds = Math.ceil(err.waitTimeMs / 1000);
            if (err.message === "You have exceeded the maximum number of attempts") {
                setErrorMessage(`You have exceeded the maximum number of attempts. No attempts left. Please try again in ${waitSeconds} seconds.`);
            }
        } else {
            setErrorMessage(err?.message || 'An error occurred.');
        }
    } finally {
        setLoading(false);
    }
  };

  const handleEditSave = (newReceiptWithOrders: ReceiptWithOrdersData) => {
    setReceiptWithOrders(newReceiptWithOrders);
  };

  const handleAddName = (name: string) => {
    if (name.trim()) {
      setNames(prev => [...prev, name.trim()]);
    }
  };

  const handleRemoveName = (nameToRemove: string) => {
    setNames(prev => prev.filter(name => name !== nameToRemove));
  };



  // Show authentication error UI if there's an auth error
  if (authError) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 32,
          minWidth: 320,
          maxWidth: '90vw',
          boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 18,
            marginBottom: 24,
            color: '#d32f2f',
            fontWeight: 500
          }}>
            Authentication Error
          </div>
          <div style={{
            fontSize: 16,
            marginBottom: 32,
            color: '#374151',
            lineHeight: 1.5
          }}>
            {authError}
          </div>
          <button
            onClick={handleSignInAnonymously}
            disabled={authLoading}
            style={{
              padding: '12px 32px',
              borderRadius: 8,
              border: 'none',
              background: authLoading ? '#ccc' : '#1976d2',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              cursor: authLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              minWidth: 120
            }}
          >
            {authLoading ? 'Signing in...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-container" style={{ position: 'relative' }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 12, 
        marginTop: 2, 
        position: 'relative',
        background: '#fff',
        borderRadius: 16,
        padding: '8px 16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(25, 118, 210, 0.12)',
        backdropFilter: 'blur(10px)',
        maxWidth: 'min(90vw, 600px)',
        minWidth: '320px',
        margin: '2px auto 12px auto',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div
            style={{ 
              background: step === 'create' ? 'linear-gradient(135deg, #1976d2, #1565c0)' : 'transparent', 
              color: step === 'create' ? '#fff' : '#1976d2', 
              fontWeight: step === 'create' ? 600 : 500, 
              border: step === 'create' ? 'none' : '1px solid rgba(25, 118, 210, 0.3)', 
              cursor: step === 'create' ? 'default' : 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
              borderRadius: 12,
              fontSize: 'clamp(12px, 2vw, 16px)',
              minWidth: 'clamp(60px, 15vw, 100px)',
              flex: '1 1 auto',
              textAlign: 'center',
              boxShadow: step === 'create' ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none',
              transform: step === 'create' ? 'translateY(-1px)' : 'none'
            }}
            onClick={() => { setStep('create'); }}
          >
            Create
          </div>
          <div
            style={{ 
              background: step === 'edit' ? 'linear-gradient(135deg, #1976d2, #1565c0)' : 'transparent', 
              color: receiptWithOrders ? (step === 'edit' ? '#fff' : '#1976d2') : '#b0b0b0', 
              fontWeight: step === 'edit' ? 600 : 500, 
              border: step === 'edit' ? 'none' : '1px solid rgba(25, 118, 210, 0.3)', 
              cursor: receiptWithOrders ? (step === 'edit' ? 'default' : 'pointer') : 'not-allowed', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
              borderRadius: 12,
              fontSize: 'clamp(12px, 2vw, 16px)',
              minWidth: 'clamp(60px, 15vw, 100px)',
              flex: '1 1 auto',
              textAlign: 'center',
              boxShadow: step === 'edit' ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none',
              transform: step === 'edit' ? 'translateY(-1px)' : 'none',
              opacity: receiptWithOrders ? 1 : 0.5
            }}
            onClick={() => { if (receiptWithOrders) setStep('edit'); }}
          >
            Edit
          </div>
          <div
            style={{ 
              background: step === 'split' ? 'linear-gradient(135deg, #1976d2, #1565c0)' : 'transparent', 
              color: receiptWithOrders ? (step === 'split' ? '#fff' : '#1976d2') : '#b0b0b0', 
              fontWeight: step === 'split' ? 600 : 500, 
              border: step === 'split' ? 'none' : '1px solid rgba(25, 118, 210, 0.3)', 
              cursor: receiptWithOrders ? (step === 'split' ? 'default' : 'pointer') : 'not-allowed', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
              borderRadius: 12,
              fontSize: 'clamp(12px, 2vw, 16px)',
              minWidth: 'clamp(60px, 15vw, 100px)',
              flex: '1 1 auto',
              textAlign: 'center',
              boxShadow: step === 'split' ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none',
              transform: step === 'split' ? 'translateY(-1px)' : 'none',
              opacity: receiptWithOrders ? 1 : 0.5
            }}
            onClick={() => { if (receiptWithOrders) setStep('split'); }}
          >
            Split
          </div>
        </div>
      </nav>

      {step === 'create' && !loading && (
        <CreateReceiptUI
          onChooseImage={handleChooseImage}
          onFileChange={handleFileChange}
          fileInputRef={fileInputRef}
          showImageModal={showImageModal}
          selectedImage={selectedImage}
          onCancelModal={handleCancelModal}
          onContinueModal={handleContinueModal}
        />
      )}

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <p style={{ fontSize: 20, marginBottom: 24 }}>Processing your receipt...</p>
          <div className="loader" style={{ margin: '0 auto', width: 48, height: 48, border: '6px solid #eee', borderTop: '6px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {errorMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            minWidth: 320,
            boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 18,
              marginBottom: 24,
              color: errorMessage.match(/^You have \d+ attempt\(s\) left\.$/) ? '#374151' : '#d32f2f'
            }}>{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              style={{
                padding: '8px 32px',
                borderRadius: 6,
                border: 'none',
                background: '#1976d2',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {step === 'edit' && receiptWithOrders && !loading && (
        <EditReceiptUI
          receiptWithOrders={receiptWithOrders}
          onEditSave={handleEditSave}
          onEditCancel={() => {}}
        />
      )}

      {step === 'split' && receiptWithOrders && !loading && (
        <SplitReceiptUI
          receiptWithOrders={receiptWithOrders}
          names={names}
          onAddName={handleAddName}
          onRemoveName={handleRemoveName}
          orderSplitListForAll={orderSplitListForAll}
          setOrderSplitListForAll={setOrderSplitListForAll}
          orderSplitListForOne={orderSplitListForOne}
          setOrderSplitListForOne={setOrderSplitListForOne}
        />
      )}
    </div>
  );
};

export default ReceiptPage; 