import React from 'react';

const cardStyle: React.CSSProperties = {
  maxWidth: '500px',
  margin: '16px auto', // Reduced top margin
  padding: '12px 32px 32px 32px', // Reduced top padding
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  background: '#fff',
  fontFamily: 'Segoe UI, Arial, sans-serif',
};

const headingStyle: React.CSSProperties = {
  marginBottom: '16px',
  fontSize: '2rem',
  fontWeight: 700,
  color: '#2d3748',
};

const subheadingStyle: React.CSSProperties = {
  marginTop: '12px',
  marginBottom: '8px',
  fontSize: '1.2rem',
  color: '#4a5568',
};

const listStyle: React.CSSProperties = {
  paddingLeft: '24px',
  marginBottom: '16px',
};

const emailButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '8px',
  padding: '8px 18px',
  background: '#3182ce',
  color: '#fff',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  transition: 'background 0.2s',
};

const appNameStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '1.1rem',
  color: '#3182ce',
  fontWeight: 600,
  marginBottom: '18px',
  letterSpacing: '0.5px',
};

const developerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '18px',
  color: '#a0aec0',
  fontSize: '0.98rem',
  fontStyle: 'italic',
};

const DeleteAccountPage: React.FC = () => {
  return (
    <section style={cardStyle}>
      <h2 style={headingStyle}>Delete Your Account</h2>
      <p style={{ marginBottom: 24 }}>
        We respect your privacy and give you full control over your data. You can delete your account at any time using one of the methods below:
      </p>

      <h3 style={subheadingStyle}>1. In the Mobile App</h3>
      <ul style={listStyle}>
        <li>📱 Log in to your account</li>
        <li>⚙️ Open the <strong>Settings</strong> section</li>
        <li>🗑️ Tap on <strong>Delete Account</strong></li>
        <li>✅ Confirm the deletion</li>
      </ul>
      <p style={{ color: '#718096', marginBottom: 24 }}>
        Your account and all related data will be <strong>permanently deleted</strong>.
      </p>

      <h3 style={subheadingStyle}>2. On the Website</h3>
      <ul style={listStyle}>
        <li>💻 <a href="/signIn" style={{ color: '#3182ce', textDecoration: 'underline' }}>Sign in</a> to your account</li>
        <li>⚙️ Go to the <strong>Settings</strong> section</li>
        <li>🗑️ Click on <strong>Delete Account</strong></li>
        <li>✅ Confirm the deletion</li>
      </ul>
      <p style={{ color: '#718096', marginBottom: 24 }}>
        This will <strong>permanently delete</strong> your account and all associated data.
      </p>

      <h3 style={subheadingStyle}>3. Request via Email</h3>
      <p>If you're unable to access the app or website, send a request from your account's email to:</p>
      <a
        href="mailto:ilptokardeveloper@gmail.com?subject=Delete%20Account%20Request"
        style={emailButtonStyle}
      >
        📧 Email: ilptokardeveloper@gmail.com
      </a>
      <p style={{ marginTop: 6, color: '#718096' }}>
        <strong>Subject line:</strong> Delete Account Request
      </p>
      <p style={{ marginTop: 8, color: '#4a5568', fontSize: '0.97rem' }}>
        We will handle your request and delete the account as quickly as possible.
      </p>
      <div style={developerStyle}>Developed by IT's Apps</div>
    </section>
  );
};

export default DeleteAccountPage;
