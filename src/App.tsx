import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import SignInPage from './Pages/SignInPage';
import PrivacyPolicyPage from './Pages/Info/PrivacyPolicyPage';
import DeleteAccountPage from './Pages/Info/DeleteAccountPage';
import InfoPage from './Pages/Info/InfoPage';
import ReceiptPage from './Pages/Receipt/ReceiptPage';
import ReceiptExamplePage from './Pages/Info/ReceiptExamplePage';
import ReceiptSplitterPrivacyPolicyPage from './Pages/Info/ReceiptSplitterPrivacyPolicyPage';

function Header() {
  const navigate = useNavigate();
  return (
    <header className="app-header-bar">
      <span
        className="app-header-title"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        Receipt Splitter App
      </span>
    </header>
  );
}

function App() {
  return (
    <div>
      <Router>
        <Header />
        <div className="responsive-container">
          <Routes>
            <Route path="/" element={<InfoPage />} />
            <Route path="/receipt" element={<ReceiptPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
            <Route path="/receipt-example" element={<ReceiptExamplePage />} />
            <Route path="/receipt-splitter-privacy-policy" element={<ReceiptSplitterPrivacyPolicyPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
