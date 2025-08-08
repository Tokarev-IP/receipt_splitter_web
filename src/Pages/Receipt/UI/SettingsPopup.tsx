import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, deleteAccount } from '../../../Firebase/FirebaseAuth';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      console.log('User signed out successfully');
      onClose(); // Close the popup after sign out
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await signOut();
      console.log('Account deleted and signed out successfully');
      onClose(); // Close the popup after account deletion and sign out
      navigate('/', { state: { popupMessage: 'Your account has been deleted successfully.' } }); // Redirect to home page with success message
    } catch (error) {
      console.error('Error deleting account:', error);
      // On error, sign out and redirect with popup message
      try {
        await signOut();
      } catch (signOutError) {
        console.error('Error signing out after delete failure:', signOutError);
      }
      navigate('/', { state: { popupMessage: 'You have to sign in again to delete your account' } });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="responsive-modal" onClick={onClose}>
      <div className="responsive-modal-content" onClick={(e) => e.stopPropagation()}>
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            fontWeight: '300'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
            e.currentTarget.style.color = '#333';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
            e.currentTarget.style.color = '#666';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ 
            margin: '0 0 8px 0', 
            color: '#1a1a1a', 
            fontSize: '28px', 
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Settings
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: 2, 
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Manage your account and preferences
          </p>
        </div>
        
        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Sign Out Button */}
          <button 
            onClick={() => setShowSignOutConfirmation(true)}
            disabled={isSigningOut}
            style={{
              backgroundColor: '#f8fafc',
              color: '#374151',
              border: '2px solid #e5e7eb',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: isSigningOut ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              opacity: isSigningOut ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!isSigningOut) {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#d1d5db';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <span style={{ fontSize: '18px' }}>🔐</span>
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </button>

          {/* Delete Account Button */}
          <button 
            onClick={() => setShowDeleteConfirmation(true)}
            disabled={isDeleting}
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '2px solid #fecaca',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              opacity: isDeleting ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = '#fee2e2';
                e.currentTarget.style.borderColor = '#fca5a5';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            <span style={{ fontSize: '18px' }}>🗑️</span>
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>

        {/* Developed by IT's Apps */}
        <div style={{ 
          marginTop: '32px', 
          paddingTop: '20px', 
          borderTop: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '14px', 
            margin: 2,
            fontWeight: '500'
          }}>
            Developed by IT's Apps
          </p>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              background: 'rgba(0,0,0,0.7)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 2000,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowDeleteConfirmation(false)}
          >
            <div 
              style={{ 
                background: '#fff', 
                borderRadius: '20px', 
                padding: '32px', 
                minWidth: '420px', 
                maxWidth: '480px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1)',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: '32px'
                }}>
                  ⚠️
                </div>
                <h2 style={{ 
                  color: '#dc2626', 
                  margin: '0 0 8px 0', 
                  fontSize: '24px',
                  fontWeight: '700',
                  letterSpacing: '-0.5px'
                }}>
                  Delete Account
                </h2>
                <p style={{ 
                  color: '#6b7280', 
                  margin: 2, 
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <button 
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={isDeleting}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#ffffff',
                    color: '#374151',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    flex: 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#dc2626',
                    color: 'white',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    flex: 1,
                    opacity: isDeleting ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out Confirmation Modal */}
        {showSignOutConfirmation && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              background: 'rgba(0,0,0,0.7)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 2000,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowSignOutConfirmation(false)}
          >
            <div 
              style={{ 
                background: '#fff', 
                borderRadius: '20px', 
                padding: '32px', 
                minWidth: '420px', 
                maxWidth: '480px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1)',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f9ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: '32px'
                }}>
                  🔐
                </div>
                <h2 style={{ 
                  color: '#374151', 
                  margin: '0 0 8px 0', 
                  fontSize: '24px',
                  fontWeight: '700',
                  letterSpacing: '-0.5px'
                }}>
                  Sign Out
                </h2>
                <p style={{ 
                  color: '#6b7280', 
                  margin: 2, 
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  Are you sure you want to sign out? You will need to sign in again to access your account.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <button 
                  onClick={() => setShowSignOutConfirmation(false)}
                  disabled={isSigningOut}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#ffffff',
                    color: '#374151',
                    cursor: isSigningOut ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    flex: 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isSigningOut) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#374151',
                    color: 'white',
                    cursor: isSigningOut ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    flex: 1,
                    opacity: isSigningOut ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isSigningOut) {
                      e.currentTarget.style.backgroundColor = '#1f2937';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#374151';
                  }}
                >
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPopup; 