import React from 'react';

const InfoPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 840, margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <img src="/ic_receipt_splitter_logo-playstore.png" alt="Receipt Splitter" width={120} height={120} style={{ borderRadius: 24 }} />
        <h1 style={{ margin: '8px 0 0 0' }}>Receipt Splitter</h1>

        <div style={{ fontSize: 16, lineHeight: 1.6, textAlign: 'left', maxWidth: 720 }}>
          <p>📸 Turn boring paper receipts into smart digital ones — in seconds!</p>
          <p>
            Snap a photo of your receipt or pick one from your gallery 📂. Made a mistake?
            No problem — just tap to edit and fix it ✏️.
          </p>
          <p>
            🧩 Split it your way: choose exactly how you want to share the final report as Text or PDF file —
            for everyone, just one person, or a custom group.
          </p>
          <p>
            📁 Stay organized: create folders for trips ✈️, dinners 🍕, parties 🎉 — anything that matters to you.
            Combine multiple receipts into a single report to keep all your spending in one place.
          </p>

          <div style={{ marginTop: 12 }}>
            <strong>Perfect for:</strong>
            <ul style={{ margin: '8px 0 0 20px' }}>
              <li>dinners with friends 🍽️</li>
              <li>group trips 🌍</li>
              <li>parties and celebrations 🎊</li>
              <li>work expense tracking 💼</li>
              <li>decluttering your wallet 🧹</li>
            </ul>
          </div>

          <div style={{ marginTop: 12 }}>
            <strong>Why you'll love it:</strong>
            <ul style={{ margin: '8px 0 0 20px' }}>
              <li>snap receipts and bills in seconds</li>
              <li>easy, intuitive editing</li>
              <li>flexible splitting and sharing</li>
              <li>neat folder organization</li>
              <li>merge multiple receipts into one report</li>
            </ul>
          </div>

          <p style={{ marginTop: 12 }}>
            ✨ No more crumpled paper, awkward bill talks, or lost receipts. Just snap, split, and share — it’s that simple.
          </p>
          <p>📲 Download now and make working with receipts tidy, fast, and stress‑free!</p>
        </div>

        <a
          href="https://play.google.com/store/apps/details?id=com.iliatokarev.receipt_splitter_kmp"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: 12,
            padding: '10px 16px',
            background: '#1a73e8',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600
          }}
        >
          Get it on Google Play
        </a>
      </div>
    </div>
  );
};

export default InfoPage;


