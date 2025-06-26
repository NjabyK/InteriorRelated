import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (token: string) => void;
  onClose?: () => void;
}

export function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/shopify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (result.customerAccessToken) {
        onLogin(result.customerAccessToken.accessToken);
        onClose?.();
      } else {
        setError(result.userErrors?.[0]?.message || 'Login failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#222', padding: 32, borderRadius: 8, minWidth: 320, color: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
        <h2 style={{ marginBottom: 16 }}>Sign in to your account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }}
        />
        {error && <div style={{ color: 'salmon', marginBottom: 12 }}>{error}</div>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: 10, borderRadius: 4, background: '#fff', color: '#222', fontWeight: 600, border: 'none', marginBottom: 8 }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        {onClose && (
          <button onClick={onClose} style={{ width: '100%', padding: 8, borderRadius: 4, background: 'transparent', color: '#fff', border: '1px solid #444' }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
} 