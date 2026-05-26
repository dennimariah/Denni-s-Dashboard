'use client';

import { useState, useEffect, useRef } from 'react';

const PIN_KEY = 'dennika-pin';
const AUTH_KEY = 'dennika-authed';

export default function PinGate({ children }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [mode, setMode] = useState('enter');
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [storedPin, setStoredPin] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(PIN_KEY);
    const sessionAuthed = sessionStorage.getItem(AUTH_KEY);
    setStoredPin(stored);
    setMode(stored ? 'enter' : 'create');
    if (sessionAuthed === '1') {
      setAuthed(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !authed) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [ready, authed]);

  if (!ready) return null;
  if (authed) return children;

  const doShake = () => {
    setShake(true);
    setPin('');
    setTimeout(() => setShake(false), 500);
  };

  const handleCreate = () => {
    if (pin.length < 4) return doShake();
    localStorage.setItem(PIN_KEY, pin);
    setStoredPin(pin);
    sessionStorage.setItem(AUTH_KEY, '1');
    setAuthed(true);
  };

  const handleEnter = () => {
    if (pin === storedPin) {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      doShake();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-sans)' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: 32, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, var(--primary), var(--accent-1))', display: 'grid', placeItems: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(232,82,122,0.3)' }}>
          <span style={{ color: 'white', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 32 }}>D</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 36, color: 'var(--ink)', margin: '0 0 6px' }}>Dennika's Dashboard</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 32 }}>
          {mode === 'create' ? 'Create your PIN' : 'Enter your PIN'}
        </p>

        <div style={{ animation: shake ? 'shake 0.4s ease' : 'none' }}>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') mode === 'create' ? handleCreate() : handleEnter(); }}
            placeholder="••••••"
            maxLength={20}
            style={{
              width: '100%', border: '2px solid var(--line)', borderRadius: 16, padding: '16px 20px',
              fontSize: 24, textAlign: 'center', letterSpacing: '0.4em', background: 'var(--card)',
              outline: 'none', color: 'var(--ink)', fontFamily: 'var(--font-mono)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--line)'}
          />
        </div>

        <button
          onClick={mode === 'create' ? handleCreate : handleEnter}
          style={{
            width: '100%', marginTop: 14, padding: '14px 20px', background: 'var(--primary)', color: 'white',
            border: 0, borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-sans)', letterSpacing: '0.02em',
            boxShadow: '0 4px 16px rgba(232,82,122,0.35)',
          }}
        >
          {mode === 'create' ? 'Set PIN & enter' : 'Unlock'}
        </button>

        {mode === 'enter' && (
          <button
            onClick={() => { if (confirm('Reset your PIN? You will need to create a new one.')) { localStorage.removeItem(PIN_KEY); setStoredPin(null); setMode('create'); setPin(''); } }}
            style={{ marginTop: 14, background: 'none', border: 0, color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Forgot PIN? Reset
          </button>
        )}

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
        `}</style>
      </div>
    </div>
  );
}
