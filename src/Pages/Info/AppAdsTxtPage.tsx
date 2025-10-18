import React, { useEffect, useState } from 'react';

const AppAdsTxtPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAdsTxt = async () => {
      try {
        const response = await fetch('/app-ads.txt', { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: unknown) {
        setError('Download Error: app-ads.txt');
      }
    };
    fetchAdsTxt();
  }, []);

  return (
    <div style={{ maxWidth: 840, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ margin: '0 0 16px 0' }}>app-ads.txt</h1>
      {error ? (
        <div style={{ color: '#b00020' }}>{error}</div>
      ) : (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#f6f8fa',
            padding: 16,
            borderRadius: 8,
            border: '1px solid #e1e4e8',
          }}
        >{content}</pre>
      )}
    </div>
  );
};

export default AppAdsTxtPage;


