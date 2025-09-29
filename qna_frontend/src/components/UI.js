import React from 'react';

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="card" style={{ maxWidth: 320, textAlign: 'center' }}>
      <div style={{ fontSize: 24 }}>⏳</div>
      <div style={{ marginTop: 8 }}>{text}</div>
    </div>
  );
}

export function Empty({ title = 'No items', description }) {
  return (
    <div className="card" style={{ maxWidth: 420, textAlign: 'center' }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>✨</div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {description && <p className="muted">{description}</p>}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="card" style={{ borderColor: 'rgba(239,68,68,0.35)' }}>
      <div style={{ color: '#EF4444' }}>⚠️ {message}</div>
    </div>
  );
}
