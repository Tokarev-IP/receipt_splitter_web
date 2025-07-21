import React, { useRef, useState } from 'react';

interface CreateReceiptUIProps {
  onChooseImage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  showImageModal: boolean;
  selectedImage: File | null;
  onCancelModal: () => void;
  onContinueModal: (language?: string) => void;
}

const CreateReceiptUI: React.FC<CreateReceiptUIProps> = ({
  onChooseImage,
  onFileChange,
  fileInputRef,
  showImageModal,
  selectedImage,
  onCancelModal,
  onContinueModal,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [enableTranslation, setEnableTranslation] = useState<boolean>(false);

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Dutch',
    'Swedish',
    'Norwegian',
    'Danish',
    'Finnish',
    'Polish',
    'Turkish',
    'Greek'
  ];

  const handleContinueWithLanguage = () => {
    const language = enableTranslation && selectedLanguage !== 'English' ? selectedLanguage : undefined;
    onContinueModal(language);
  };

  // Modern styles
  const styles = {
    container: {
      textAlign: 'center' as const,
      marginTop: 32,
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      background: 'transparent',
      padding: 8,
    } as React.CSSProperties,
    card: {
      background: '#fff',
      padding: 32,
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      textAlign: 'center' as const,
      minWidth: 320,
      maxWidth: 360,
      width: '90vw',
      position: 'relative' as const,
      animation: 'fadeIn 0.3s',
    } as React.CSSProperties,
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      transition: 'background 0.2s',
    } as React.CSSProperties,
    title: {
      fontSize: 22,
      fontWeight: 700,
      marginBottom: 24,
      color: '#222',
      letterSpacing: 0.2,
    } as React.CSSProperties,
    button: {
      padding: '12px 28px',
      fontSize: 16,
      borderRadius: 8,
      border: 'none',
      background: '#1976d2',
      color: '#fff',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
      transition: 'background 0.2s, box-shadow 0.2s',
    } as React.CSSProperties,
    buttonSecondary: {
      padding: '12px 28px',
      fontSize: 16,
      borderRadius: 8,
      border: '1px solid #d1d5db',
      background: '#fff',
      color: '#1976d2',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background 0.2s, border 0.2s',
    } as React.CSSProperties,
    fileInputLabel: {
      display: 'inline-block',
      padding: '14px 32px',
      fontSize: 16,
      borderRadius: 8,
      background: '#1976d2',
      color: '#fff',
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: 16,
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
      transition: 'background 0.2s',
    } as React.CSSProperties,
    previewImg: {
      maxWidth: 280,
      maxHeight: 280,
      marginBottom: 24,
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e3e6ea',
    } as React.CSSProperties,
    closeBtn: {
      position: 'absolute' as const,
      top: 16,
      right: 16,
      background: 'none',
      border: 'none',
      fontSize: 22,
      color: '#888',
      cursor: 'pointer',
      fontWeight: 700,
      transition: 'color 0.2s',
    } as React.CSSProperties,
    switch: {
      position: 'relative' as const,
      display: 'inline-block',
      width: 44,
      height: 24,
      marginRight: 10,
      verticalAlign: 'middle',
    } as React.CSSProperties,
    switchSlider: {
      position: 'absolute' as const,
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: enableTranslation ? '#1976d2' : '#ccc',
      borderRadius: 24,
      transition: 'background-color 0.2s',
    } as React.CSSProperties,
    switchCircle: {
      position: 'absolute' as const,
      left: enableTranslation ? 22 : 2,
      top: 2,
      width: 20,
      height: 20,
      background: '#fff',
      borderRadius: '50%',
      boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
      transition: 'left 0.2s',
    } as React.CSSProperties,
    select: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: 6,
      border: '1px solid #d1d5db',
      fontSize: 15,
      backgroundColor: '#f7f9fb',
      marginBottom: 8,
      marginTop: 4,
      outline: 'none',
      fontWeight: 500,
      color: '#222',
      transition: 'border 0.2s',
    } as React.CSSProperties,
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      marginTop: 8,
    } as React.CSSProperties,
    label: {
      fontSize: 15,
      fontWeight: 500,
      marginBottom: 8,
      color: '#333',
      display: 'block',
      textAlign: 'left' as const,
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      <p style={styles.title}>Create a new receipt</p>
      <label htmlFor="file-upload" style={styles.fileInputLabel} tabIndex={0}>
        <span role="img" aria-label="camera" style={{ marginRight: 8 }}>📷</span>
        Choose Image
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={onFileChange}
      />
      {showImageModal && selectedImage && (
        <div style={styles.modalOverlay}>
          <div style={styles.card}>
            <button aria-label="Close" style={styles.closeBtn} onClick={onCancelModal}>&times;</button>
            <p style={{ ...styles.title, fontSize: 18, marginBottom: 16 }}>Preview your image</p>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected preview"
              style={styles.previewImg}
            />
            {/* Translation Toggle */}
            <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <label htmlFor="translation-switch" style={{ ...styles.label, marginBottom: 0, fontWeight: 500, fontSize: 15, color: '#444', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={styles.switch}>
                  <input
                    id="translation-switch"
                    type="checkbox"
                    checked={enableTranslation}
                    onChange={(e) => setEnableTranslation(e.target.checked)}
                    style={{ opacity: 0, width: 44, height: 24, margin: 2, position: 'absolute', left: 0, top: 0, cursor: 'pointer' }}
                  />
                  <span style={styles.switchSlider}></span>
                  <span style={styles.switchCircle}></span>
                </span>
                Enable translation
              </label>
            </div>
            {/* Language Selection - Only show if translation is enabled */}
            {enableTranslation && (
              <div style={{ marginBottom: 24 }}>
                <label htmlFor="language-select" style={styles.label}>
                  Select translation language:
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={styles.select}
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div style={styles.actions}>
              <button onClick={onCancelModal} style={styles.buttonSecondary}>Cancel</button>
              <button 
                onClick={handleContinueWithLanguage} 
                style={styles.button}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReceiptUI; 