import React from 'react';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '2rem 1rem',
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: '2.5rem 2rem',
  maxWidth: 700,
  width: '100%',
  margin: '2rem auto',
};

const headingStyle: React.CSSProperties = {
  color: '#22223b',
  marginBottom: '1rem',
  fontWeight: 700,
};

const subHeadingStyle: React.CSSProperties = {
  color: '#3a3a40',
  marginTop: '2rem',
  marginBottom: '0.75rem',
  fontWeight: 600,
  fontSize: '1.15rem',
};

const linkStyle: React.CSSProperties = {
  color: '#007BFF',
  textDecoration: 'underline',
  wordBreak: 'break-all',
};

const dividerStyle: React.CSSProperties = {
  border: 0,
  borderTop: '1px solid #e0e0e0',
  margin: '2rem 0',
};

const listStyle: React.CSSProperties = {
  paddingLeft: '1.25rem',
  marginBottom: 0,
};

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> 02/07/2025</p>
        <p><strong>App Name:</strong> Receipt Splitter</p>
        <hr style={dividerStyle} />
        <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our mobile application ("App"). We are committed to ensuring your privacy and complying with applicable data protection regulations and Google Play's User Data Policy.</p>

        <h2 style={subHeadingStyle}>1. Information We Collect</h2>
        <p>We collect the following information when you use our App:</p>
        <ul style={listStyle}>
          <li><strong>Email Address:</strong> Required for account creation and login via Firebase Authentication.</li>
          <li><strong>User-Generated Data:</strong> Receipt data (e.g., shared receipts, amounts) stored in Firebase Firestore and associated with your user ID.</li>
          <li><strong>Gemini API:</strong> Receipt content may be sent to the Gemini API to provide AI-enhanced features such as parsing and suggestions.</li>
        </ul>
        <p>We do <strong>not</strong> collect financial or sensitive personal data.</p>

        <hr style={dividerStyle} />
        <h2 style={subHeadingStyle}>2. How We Use Your Information</h2>
        <p>Your data is used to:</p>
        <ul style={listStyle}>
          <li>Authenticate you using Firebase Authentication.</li>
          <li>Store and retrieve your data in Firebase Firestore.</li>
          <li>Enable features like receipt splitting and sharing with friends.</li>
          <li>Enhance experience via Gemini AI features.</li>
        </ul>

        <hr style={dividerStyle} />
        <h2 style={subHeadingStyle}>3. Sharing of Information</h2>
        <p>We do <strong>not</strong> sell or rent your personal information. Data may be shared only with third-party services that are essential to app functionality:</p>
        <ul style={listStyle}>
          <li>Firebase (Authentication & Firestore)</li>
          <li>Gemini API (Google AI)</li>
        </ul>

        <hr style={dividerStyle} />
        <h2 style={subHeadingStyle}>4. Data Retention and Deletion</h2>
        <p>Users can delete their account and all associated data at any time directly from the app. Once deleted, your information is permanently removed from Firebase Authentication and Firestore.</p>

        <hr style={dividerStyle} />
        <h2 style={subHeadingStyle}>5. Security</h2>
        <p>We implement standard security measures including HTTPS and Firebase's built-in access control. However, no method of transmission or storage is 100% secure.</p>

        <hr style={dividerStyle} />
        <h2 style={subHeadingStyle}>6. Children's Privacy</h2>
        <p>This app is not intended for children under 13. We do not knowingly collect personal data from children under 13 years of age.</p>

        <hr style={dividerStyle} />
        <h2 style={subHeadingStyle}>7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted within the app or on this page with a new effective date.</p>

        <hr style={dividerStyle} />
        <h2 style={subHeadingStyle}>8. Contact Us</h2>
        <p>If you have any questions or concerns, please contact us:</p>
        <p>Email: <a href="mailto:ilptokardeveloper@gmail.com" style={linkStyle}>ilptokardeveloper@gmail.com</a></p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
