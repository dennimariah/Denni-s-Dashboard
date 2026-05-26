'use client';

import Icon from './Icon';
import { cls } from '@/lib/helpers';

export function NavItem({ id, label, icon, active, badge, onClick }) {
  return (
    <button
      className={cls('sidebar__item', active && 'sidebar__item--active')}
      onClick={() => onClick(id)}
    >
      <span className="sidebar__item-icon"><Icon name={icon} /></span>
      <span>{label}</span>
      {badge != null && badge > 0 && (
        <span className="sidebar__item-badge">{badge}</span>
      )}
    </button>
  );
}

export function Editable({ value, onChange, placeholder = '', style = {}, multiline = false }) {
  if (multiline) {
    return (
      <textarea
        className="editable"
        value={value}
        placeholder={placeholder}
        rows={Math.max(2, (value || '').split('\n').length)}
        style={{ resize: 'none', ...style }}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      className="editable"
      value={value}
      placeholder={placeholder}
      style={style}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function burstConfetti(x, y) {
  if (typeof document === 'undefined') return;
  const colors = ['#e8527a', '#f4a261', '#88b896', '#b39bd8', '#f7c548'];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.background = colors[i % colors.length];
    const angle = (i / 16) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--ty', Math.sin(angle) * dist + 100 + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {}
}

export function CardHead({ title, sub, right }) {
  return (
    <div className="card__head">
      <div>
        <h3 className="card__title">{title}</h3>
        {sub && <div className="card__sub mt-sm">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function Bar({ value, max = 100, color }) {
  return (
    <div className="bar">
      <div
        className="bar__fill"
        style={{
          width: Math.min(100, (value / max) * 100) + '%',
          ...(color ? { background: color } : {}),
        }}
      />
    </div>
  );
}

export function Pill({ tone = 'pink', mono = false, children }) {
  return (
    <span className={cls('pill', `pill--${tone}`, mono && 'pill--mono')}>
      {children}
    </span>
  );
}
