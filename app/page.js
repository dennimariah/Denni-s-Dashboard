'use client';

import { useState, useEffect } from 'react';
import { getDefaultState } from '@/lib/defaultData';
import PinGate from '@/components/PinGate';
import Dashboard from '@/components/Dashboard';

export default function Page() {
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(data => {
        setInitialData({ ...getDefaultState(), ...data });
        setLoading(false);
      })
      .catch(() => {
        setInitialData(getDefaultState());
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
      }}>
        Loading…
      </div>
    );
  }

  return (
    <PinGate>
      <Dashboard initialData={initialData} />
    </PinGate>
  );
}
