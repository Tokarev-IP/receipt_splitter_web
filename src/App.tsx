import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import PrivacyPolicyPage from './Pages/Info/PrivacyPolicyPage';
import DeleteAccountPage from './Pages/Info/DeleteAccountPage';
import ReceiptPage from './Pages/Receipt/ReceiptPage';
import ReceiptExamplePage from './Pages/Info/ReceiptExamplePage';
import ReceiptSplitterPrivacyPolicyPage from './Pages/Info/ReceiptSplitterPrivacyPolicyPage';
import InfoPage from './Pages/InfoPage';

function Header() {
  return (
    <header className="app-header-bar">
      <span className="app-header-title">
        Receipt Splitter App
      </span>
    </header>
  );
}

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<><Header /><div className="responsive-container"><InfoPage /></div></>} />
          <Route path="/info" element={<><Header /><div className="responsive-container"><InfoPage /></div></>} />
          <Route path="/split-receipt" element={<><Header /><div className="responsive-container"><ReceiptPage /></div></>} />
          <Route path="/privacy-policy" element={<><Header /><div className="responsive-container"><PrivacyPolicyPage /></div></>} />
          <Route path="/delete-account" element={<><Header /><div className="responsive-container"><DeleteAccountPage /></div></>} />
          <Route path="/receipt-example" element={<><Header /><div className="responsive-container"><ReceiptExamplePage /></div></>} />
          <Route path="/receipt-splitter-privacy-policy" element={<><Header /><div className="responsive-container"><ReceiptSplitterPrivacyPolicyPage /></div></>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
