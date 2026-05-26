'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cls, MOOD_OPTIONS } from '@/lib/helpers';
import { THEMES, applyTheme } from '@/lib/themes';
import { NavItem, Pill } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

import TodayView from '@/components/views/TodayView';
import WeekView from '@/components/views/WeekView';
import HabitsView from '@/components/views/HabitsView';
import QuarterView from '@/components/views/QuarterView';
import FinanceView from '@/components/views/FinanceView';
import JournalView from '@/components/views/JournalView';
import RecipesView from '@/components/views/RecipesView';
import ContentView from '@/components/views/ContentView';
import HairView from '@/components/views/HairView';

const VIEWS = { today: TodayView, week: WeekView, habits: HabitsView, quarter: QuarterView, finance: FinanceView, journal: JournalView, recipes: RecipesView, content: ContentView, hair: HairView };

const NAV = [
  { id: 'today', label: 'Today', icon: 'spark' },
  { id: 'week', label: 'This week', icon: 'week' },
  { id: 'habits', label: 'Habits', icon: 'habit' },
  { id: 'quarter', label: 'Quarter', icon: 'quarter' },
  { id: 'finance', label: 'Finance', icon: 'money' },
  { id: 'journal', label: 'Journal', icon: 'book' },
  { id: 'recipes', label: 'Kitchen', icon: 'chef' },
  { id: 'content', label: 'Content', icon: 'sparkle' },
  { id: 'hair', label: 'Hair', icon: 'leaf' },
];

export default function Dashboard({ initialData }) {
  const [state, setState] = useState(initialData);
  const [theme, setTheme] = useState('strawberry');
  const [tweakOpen, setTweakOpen] = useState(false);
  const [shortcut, setShortcut] = useState(null);
  const [briefingSending, setBriefingSending] = useState(false);
  const [briefingStatus, setBriefingStatus] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const persistState = useCallback((s) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
      } catch (e) {}
    }, 800);
  }, []);

  const setStateAndPersist = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persistState(next);
      return next;
    });
  }, [persistState]);

  const setPage = (id) => setStateAndPersist(s => ({ ...s, page: id }));
  const ActiveView = VIEWS[state.page] || TodayView;

  const openTasks = state.tasks.filter(t => !t.done).length;
  const badges = { today: openTasks, week: openTasks };
  const visibleNav = NAV.filter(n => state.show[n.id] !== false);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark">D</div>
          <div>
            <div className="sidebar__brand-name">Dennika</div>
            <div className="sidebar__brand-sub">Personal OS · v2</div>
          </div>
        </div>

        <div className="sidebar__section-label">Workspace</div>
        {visibleNav.map(n => (
          <NavItem key={n.id} id={n.id} label={n.label} icon={n.icon} active={state.page === n.id} badge={badges[n.id]} onClick={setPage} />
        ))}

        <div className="sidebar__section-label">Shortcuts</div>
        <button className="sidebar__item" onClick={() => setShortcut('mood')}>
          <span className="sidebar__item-icon"><Icon name="heart" /></span>
          <span>Mood check-in</span>
        </button>
        <button className="sidebar__item" onClick={() => setTweakOpen(o => !o)}>
          <span className="sidebar__item-icon"><Icon name="settings" /></span>
          <span>Themes & settings</span>
        </button>

        <div className="sidebar__footer">
          <div className="sidebar__avatar">D</div>
          <div>
            <div className="sidebar__user">Dennika</div>
            <div className="sidebar__streak">14-day streak 🔥</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <ActiveView state={state} setState={setStateAndPersist} />
      </main>

      {tweakOpen && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 50, width: 280, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', border: '1px solid var(--line)', borderRadius: 18, boxShadow: 'var(--shadow-lg)', padding: 20 }}>
          <div className="row row--between" style={{ marginBottom: 16 }}>
            <div className="text-mono fs-xs" style={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink)' }}>Tweaks</div>
            <button className="btn btn--icon" onClick={() => setTweakOpen(false)}><Icon name="x" size={13}/></button>
          </div>

          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Color theme</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
            {Object.entries(THEMES).map(([key, t]) => (
              <button key={key} onClick={() => setTheme(key)}
                style={{ border: theme === key ? '2px solid var(--primary)' : '1px solid var(--line)', borderRadius: 12, padding: 10, background: t.vars['--card'], cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                  {t.swatches.slice(0, 4).map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c }}/>)}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: t.vars['--ink'] }}>{t.label}</div>
              </button>
            ))}
          </div>

          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Morning briefing</div>
          <button
            className="btn btn--pink"
            style={{ width: '100%', marginBottom: 18, fontSize: 12, justifyContent: 'center' }}
            disabled={briefingSending}
            onClick={async () => {
              setBriefingSending(true);
              setBriefingStatus(null);
              try {
                const r = await fetch('/api/briefing/send', { method: 'POST' });
                const j = await r.json();
                setBriefingStatus(j.ok ? 'sent' : 'error');
              } catch {
                setBriefingStatus('error');
              }
              setBriefingSending(false);
              setTimeout(() => setBriefingStatus(null), 4000);
            }}
          >
            {briefingSending ? 'Sending…' : briefingStatus === 'sent' ? '✓ Sent to your phone!' : briefingStatus === 'error' ? '✗ Error — check Vercel logs' : '📱 Send test briefing now'}
          </button>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Show views</div>
          <div className="col gap-sm">
            {NAV.map(n => (
              <label key={n.id} className="row row--between" style={{ cursor: 'pointer' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{n.label}</span>
                <div onClick={() => setStateAndPersist(s => ({ ...s, show: { ...s.show, [n.id]: !s.show[n.id] } }))}
                  style={{ width: 38, height: 22, borderRadius: 999, background: state.show[n.id] !== false ? 'var(--primary)' : 'var(--line)', display: 'flex', alignItems: 'center', padding: '0 3px', transition: 'background 0.2s', cursor: 'pointer' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', transform: state.show[n.id] !== false ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 0.2s' }}/>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {shortcut === 'mood' && (
        <MoodModal state={state} setState={setStateAndPersist} onClose={() => setShortcut(null)} />
      )}
    </div>
  );
}

function MoodModal({ state, setState, onClose }) {
  const [chosen, setChosen] = useState(null);

  const now = new Date();
  const TODAY_IDX = (now.getDay() + 6) % 7;

  const save = () => {
    if (!chosen) return;
    setState(s => ({
      ...s,
      moodWeek: s.moodWeek.map((m, i) => i === TODAY_IDX ? { ...m, emoji: chosen, mood: 4 } : m),
    }));
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(58,29,40,0.42)', zIndex: 60, display: 'grid', placeItems: 'center', padding: 24, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 460, width: '100%', padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 6, background: 'var(--primary)' }}/>
        <div style={{ padding: 22 }}>
          <div className="row row--between" style={{ alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>Mood check-in</div>
              <h3 className="text-serif" style={{ fontSize: 30, margin: '4px 0 0', lineHeight: 1.1 }}>How are you, really?</h3>
            </div>
            <button className="btn btn--icon" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>
          <div className="mood-grid" style={{ gap: 10 }}>
            {MOOD_OPTIONS.map(opt => (
              <button key={opt.id} className="mood-pick" onClick={() => setChosen(opt.emoji)}>
                <span className={cls('mood-emoji', chosen === opt.emoji && 'mood-emoji--active')} style={{ width: 48, height: 48, fontSize: 24 }}>{opt.emoji}</span>
                <span className="mood-label">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="row row--between mt-lg">
            <div className="text-mono fs-xs text-muted">Logs to your mood tracker</div>
            <div className="row gap-sm">
              <button className="btn btn--ghost" onClick={onClose}>Skip</button>
              <button className="btn btn--pink" onClick={save}><Icon name="check" size={14}/> Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
