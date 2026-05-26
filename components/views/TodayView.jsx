'use client';

import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/Icon';
import { DEVOTIONALS } from '@/lib/devotionals';

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCENT = '#d68d84';
const SOFT_BG = '#fdf6f4';
const SAGE = '#5a8a6a';
const GOLD = '#b8860b';

const MOOD_LABELS  = { 1: 'heavy',    2: 'low',     3: 'even',   4: 'bright',  5: 'soaring'  };
const ENERGY_LABELS = { 1: 'depleted', 2: 'tired',   3: 'steady', 4: 'lit',     5: 'buzzing'  };
const CAT_COLORS   = { body: '#5b8df5', hair: '#6db88a', business: '#b8860b', mind: '#d68d84' };
const CAT_LABELS   = { body: 'Body',   hair: 'Hair',  business: 'Business', mind: 'Mind & Recovery' };

const JOURNAL_PROMPTS = [
  'What is one thing I want to remember about today?',
  'What am I most proud of this week?',
  'What would make today feel complete?',
  'What is God putting on my heart right now?',
  'Where am I growing that I haven\'t acknowledged yet?',
  'What does rest look like for me this season?',
  'What am I building, and why does it matter?',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr() { return new Date().toISOString().slice(0, 10); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function todayIdx() { return (new Date().getDay() + 6) % 7; }

function daysUntil(dateStr) {
  const t = new Date(todayStr() + 'T00:00:00');
  const d = new Date(dateStr + 'T00:00:00');
  return Math.ceil((d - t) / 86400000);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h <= 11) return 'Good morning, Dennika.';
  if (h >= 12 && h <= 16) return 'Good afternoon, Dennika.';
  if (h >= 17 && h <= 20) return 'Good evening, Dennika.';
  return 'Good night, Dennika.';
}

function isoWeekKey() {
  const d = new Date();
  const thu = new Date(d); thu.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(thu.getFullYear(), 0, 1);
  const w = Math.ceil(((thu - yearStart) / 86400000 + 1) / 7);
  return `${thu.getFullYear()}-W${String(w).padStart(2, '0')}`;
}

function dayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function GroupHeader({ label }) {
  return (
    <div style={{
      fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 21,
      color: 'var(--ink)', borderBottom: '1px solid var(--line)',
      paddingBottom: 8, marginBottom: 10, marginTop: 6,
    }}>{label}</div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
      {children}
    </div>
  );
}

function LinkBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: ACCENT, fontWeight: 600, padding: 0 }}>
      {children}
    </button>
  );
}

function StatChip({ icon, label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: '6px 13px', fontSize: 12, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
      <span>{icon}</span>
      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{label}</span>
      {sub && <span style={{ color: 'var(--muted)' }}>{sub}</span>}
    </div>
  );
}

// ── ZONE 1: SCRIPTURE BANNER ──────────────────────────────────────────────────

function ScriptureBanner({ onNavigate }) {
  const d = DEVOTIONALS[new Date().getDay()];
  return (
    <div style={{
      borderLeft: `3px solid ${ACCENT}`, background: '#f0e9e4',
      borderRadius: 14, padding: '14px 18px 14px 20px',
      display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.13em', textTransform: 'uppercase', color: ACCENT, marginBottom: 5 }}>
          {d.scripture}
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink)', lineHeight: 1.55 }}>
          &ldquo;{d.scriptureText}&rdquo;
        </div>
      </div>
      <LinkBtn onClick={() => onNavigate('devotion')}>Open devotional →</LinkBtn>
    </div>
  );
}

// ── ZONE 2: GREETING + STATS ──────────────────────────────────────────────────

function GreetingStats({ state }) {
  const now = new Date();
  const fullDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const idx = todayIdx();

  const habitStreak = useMemo(() => {
    const habits = state.habits || [];
    const logs = state.habitLogs || {};
    if (!habits.length) return 0;
    let streak = 0;
    for (let i = idx; i >= 0; i--) {
      const done = habits.filter(h => logs[h.id]?.[i]).length;
      if (done / habits.length >= 0.7) streak++; else break;
    }
    return streak;
  }, [state.habits, state.habitLogs, idx]);

  const journalStreak = useMemo(() => {
    const dates = new Set((state.journal || []).map(e => e.date));
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 90; i++) {
      if (dates.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  }, [state.journal]);

  const tripStat = useMemo(() => {
    const today = new Date(todayStr() + 'T00:00:00');
    const upcoming = (state.travelTrips || [])
      .filter(t => t.status !== 'Complete' && new Date(t.departure + 'T00:00:00') > today)
      .sort((a, b) => new Date(a.departure) - new Date(b.departure));
    if (upcoming[0]) {
      const days = daysUntil(upcoming[0].departure);
      return { type: 'trip', days, destination: upcoming[0].destination };
    }
    const onTrack = (state.quarterGoals || []).filter(g => g.status === 'on_track' || g.status === 'complete').length;
    return { type: 'goals', count: onTrack };
  }, [state.travelTrips, state.quarterGoals]);

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 38, color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.1 }}>
        {getGreeting()}
      </h1>
      <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{fullDate}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        <StatChip icon="🔥" label={habitStreak > 0 ? `${habitStreak}-day streak` : 'Start your streak today'} />
        <StatChip icon="✍️" label={journalStreak > 0 ? `${journalStreak} days` : '0 days'} sub="journaling" />
        {tripStat.type === 'trip'
          ? <StatChip icon="✈️" label={`${tripStat.days} days`} sub={`to ${tripStat.destination}`} />
          : <StatChip icon="🎯" label={`${tripStat.count} goals`} sub="on track" />}
      </div>
    </div>
  );
}

// ── ZONE 3: AFFIRMATION ───────────────────────────────────────────────────────

function AffirmationCard({ state }) {
  const affirmations = state.devotionAffirmations || [];
  const aff = affirmations.length ? affirmations[dayOfYear() % affirmations.length] : null;
  return (
    <div style={{ background: SOFT_BG, borderRadius: 16, padding: '32px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ fontSize: 18, color: ACCENT }}>✦</div>
      {aff
        ? <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: 'var(--ink)', lineHeight: 1.4, maxWidth: 600 }}>{aff.text}</div>
        : <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic', color: 'var(--muted)' }}>Add affirmations in the Devotion tab.</div>}
    </div>
  );
}

// ── ZONE 4: SLEEP CHECK-IN ────────────────────────────────────────────────────

function SleepCheckIn({ state, setState }) {
  const today = todayStr();
  const saved = (state.todaySleepLog || {})[today];
  const [editing, setEditing] = useState(!saved);
  const [quality, setQuality] = useState(saved?.quality || 3);
  const [hours, setHours] = useState(saved?.hours || 7);

  const save = () => {
    setState(s => ({ ...s, todaySleepLog: { ...(s.todaySleepLog || {}), [today]: { date: today, quality, hours } } }));
    setEditing(false);
  };

  return (
    <div className="card" style={{ padding: '14px 18px' }}>
      <SectionLabel>How did you sleep?</SectionLabel>
      {!editing && saved ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--ink)' }}>Last night: <strong>{saved.quality}/5</strong> · <strong>{saved.hours} hours</strong></span>
          <LinkBtn onClick={() => setEditing(true)}>Edit</LinkBtn>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Quality</div>
            <div style={{ display: 'flex', gap: 5 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setQuality(n)} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: `1.5px solid ${quality >= n ? ACCENT : 'var(--line)'}`,
                  background: quality >= n ? ACCENT : 'transparent',
                  color: quality >= n ? '#fff' : 'var(--muted)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s',
                }}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Hours</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setHours(h => Math.max(3, Math.round((h - 0.5) * 2) / 2))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--line)', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', minWidth: 36, textAlign: 'center' }}>{hours}</span>
              <button onClick={() => setHours(h => Math.min(12, Math.round((h + 0.5) * 2) / 2))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--line)', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>
          <button onClick={save} style={{ background: ACCENT, border: 'none', borderRadius: 10, padding: '8px 16px', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={14} /> Log sleep
          </button>
        </div>
      )}
    </div>
  );
}

// ── GROUP 1 — TODAY'S FOCUS ───────────────────────────────────────────────────

function HabitsToday({ state, setState }) {
  const idx = todayIdx();
  const habits = state.habits || [];
  const logs = state.habitLogs || {};
  const done = habits.filter(h => logs[h.id]?.[idx]).length;
  const allDone = done === habits.length && habits.length > 0;

  const toggle = (id) => setState(s => {
    const cur = [...(s.habitLogs[id] || Array(7).fill(false))];
    cur[idx] = !cur[idx];
    return { ...s, habitLogs: { ...s.habitLogs, [id]: cur } };
  });

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Habits Today</SectionLabel>
      {allDone ? (
        <div style={{ fontSize: 13, color: SAGE, fontWeight: 600, marginBottom: 10 }}>All done today. ✦</div>
      ) : (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{done}/{habits.length} done today</span>
          </div>
          <div style={{ height: 3, background: 'var(--line)', borderRadius: 2 }}>
            <div style={{ height: '100%', background: ACCENT, borderRadius: 2, width: habits.length ? `${(done / habits.length) * 100}%` : '0%', transition: 'width .3s' }} />
          </div>
        </div>
      )}
      {habits.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>No habits set up yet.</div>}
      {habits.map(h => {
        const checked = !!logs[h.id]?.[idx];
        const color = CAT_COLORS[h.section] || '#888';
        return (
          <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: '1px solid var(--line)' }}>
            <button onClick={() => toggle(h.id)} style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              border: `1.5px solid ${checked ? (h.color || color) : 'var(--line)'}`,
              background: checked ? (h.color || color) : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all .15s',
            }}>
              {checked && <Icon name="check" size={12} stroke={2.5} />}
            </button>
            <span style={{ fontSize: 13, flex: 1, color: checked ? 'var(--muted)' : 'var(--ink)', textDecoration: checked ? 'line-through' : 'none' }}>
              {h.icon} {h.label}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color, background: color + '1a', padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap' }}>
              {CAT_LABELS[h.section] || h.section}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TodaysAgenda({ calendar }) {
  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Today's Agenda</SectionLabel>
      {calendar.connected === null && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Loading…</div>}
      {calendar.connected === false && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Add a calendar in Themes &amp; settings →</div>}
      {calendar.connected === true && calendar.events.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Your schedule is clear today.</div>}
      {(calendar.events || []).map(ev => (
        <div key={ev.id} style={{ display: 'flex', gap: 10, padding: '6px 0', borderTop: '1px solid var(--line)', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', minWidth: 46, paddingTop: 2 }}>{ev.time}</div>
          <div style={{ width: 3, borderRadius: 2, background: ev.color || ACCENT, flexShrink: 0, alignSelf: 'stretch', minHeight: 18 }} />
          <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>{ev.title}</div>
        </div>
      ))}
    </div>
  );
}

function ContentDueToday({ state, onNavigate }) {
  const today = todayStr();
  const items = (state.content || []).filter(c => c.date === today || c.scheduledDate === today || c.dueDate === today);
  const PLAT = { IG: '#e8527a', TikTok: '#010101', Both: '#b39bd8' };
  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Content Due Today</SectionLabel>
      {items.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Nothing on the content calendar today.</span>
          <LinkBtn onClick={() => onNavigate('content')}>+ Add something</LinkBtn>
        </div>
      ) : items.map(c => (
        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderTop: '1px solid var(--line)' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: PLAT[c.platform] || ACCENT, background: (PLAT[c.platform] || ACCENT) + '1a', padding: '2px 8px', borderRadius: 10, flexShrink: 0 }}>
            {c.platform || 'Post'}
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink)' }}>{c.title || c.caption || c.type}</span>
        </div>
      ))}
    </div>
  );
}

// ── GROUP 2 — ON YOUR RADAR ───────────────────────────────────────────────────

function GoalsDueThisWeek({ state }) {
  const today = new Date(todayStr() + 'T00:00:00');
  const in7 = new Date(today); in7.setDate(today.getDate() + 7);
  const CAT = { health: '#5b8df5', finance: '#b8860b', business: '#88b896', personal: '#b39bd8' };

  const due = (state.quarterGoals || [])
    .filter(g => { if (!g.targetDate || g.status === 'complete') return false; const d = new Date(g.targetDate + 'T00:00:00'); return d >= today && d <= in7; })
    .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Goals Due Within 7 Days</SectionLabel>
      {due.length === 0
        ? <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Nothing coming due this week — you're clear.</div>
        : due.map(g => {
          const days = daysUntil(g.targetDate);
          const isToday = days === 0;
          const c = CAT[g.category] || '#888';
          return (
            <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: '1px solid var(--line)', borderLeft: isToday ? `3px solid #f7c548` : 'none', paddingLeft: isToday ? 10 : 0 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--ink)' }}>{g.title}</div>
                {isToday && <div style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>Due today</div>}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: c, background: c + '1a', padding: '2px 7px', borderRadius: 10 }}>{g.category}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: isToday ? GOLD : 'var(--ink)', minWidth: 32, textAlign: 'right' }}>{isToday ? 'Today' : `${days}d`}</span>
            </div>
          );
        })}
    </div>
  );
}

function SilkWeeklyFocus({ state, setState }) {
  const weekKey = isoWeekKey();
  const raw = state.scWeeklyTodos || {};
  const todos = Array.isArray(raw) ? raw : (raw[weekKey] || []);
  const top3 = todos.filter(t => !t.done).slice(0, 3);
  const active = (state.scCampaigns || []).find(c => c.status === 'Active');

  const toggle = (id) => setState(s => {
    const wt = s.scWeeklyTodos || {};
    const list = Array.isArray(wt) ? wt : (wt[weekKey] || []);
    const upd = list.map(t => t.id === id ? { ...t, done: !t.done } : t);
    return { ...s, scWeeklyTodos: Array.isArray(wt) ? upd : { ...wt, [weekKey]: upd } };
  });

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Silk Collective: This Week</SectionLabel>
      {top3.length === 0
        ? <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>No tasks set for this week yet.</div>
        : top3.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderTop: '1px solid var(--line)' }}>
            <button onClick={() => toggle(t.id)} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${GOLD}`, background: 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            <span style={{ fontSize: 13, color: 'var(--ink)' }}>{t.text || t.title}</span>
          </div>
        ))}
      {active && <div style={{ marginTop: 8, fontSize: 12, color: GOLD, fontFamily: 'var(--font-mono)' }}>Campaign active: {active.name}</div>}
    </div>
  );
}

function UpcomingTrip({ state }) {
  const today = new Date(todayStr() + 'T00:00:00');
  const trip = (state.travelTrips || [])
    .filter(t => t.status !== 'Complete' && new Date(t.departure + 'T00:00:00') > today)
    .sort((a, b) => new Date(a.departure) - new Date(b.departure))[0];
  if (!trip) return null;

  const days = daysUntil(trip.departure);
  const within14 = days <= 14;
  const packItems = Object.values(trip.packingItems || {});
  const packDone = packItems.filter(Boolean).length;

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Upcoming Trip</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--ink)' }}>{trip.destination}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
            {new Date(trip.departure + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, color: ACCENT, lineHeight: 1 }}>{days}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>days away</div>
        </div>
      </div>
      {within14 && packItems.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-soft)' }}>Packing: {packDone}/{packItems.length} items checked</div>
      )}
    </div>
  );
}

// ── GROUP 3 — BODY & WELLNESS ─────────────────────────────────────────────────

function MoodEnergyCheckIn({ state, setState }) {
  const today = todayStr();
  const entry = (state.journal || []).find(e => e.date === today);
  const [mood, setMood] = useState(entry?.mood || 0);
  const [energy, setEnergy] = useState(entry?.energy || 0);
  const [saved, setSaved] = useState(!!(entry?.mood));
  const [editing, setEditing] = useState(false);

  const save = () => {
    setState(s => {
      const list = s.journal || [];
      const i = list.findIndex(e => e.date === today);
      const updated = i >= 0
        ? list.map((e, idx) => idx === i ? { ...e, mood, energy } : e)
        : [{ id: uid(), date: today, title: '', body: '', mood, energy }, ...list];
      return { ...s, journal: updated };
    });
    setSaved(true); setEditing(false);
  };

  const TapRow = ({ val, onChange, labels }) => (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange(n)} style={{
          padding: '4px 9px', borderRadius: 8, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .12s',
          border: `1px solid ${val === n ? ACCENT : 'var(--line)'}`,
          background: val === n ? ACCENT : 'var(--card)',
          color: val === n ? '#fff' : 'var(--muted)',
        }}>{labels[n]}</button>
      ))}
    </div>
  );

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Mood & Energy</SectionLabel>
      {saved && !editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--ink)' }}>
            Mood: <strong>{MOOD_LABELS[mood]}</strong> · Energy: <strong>{ENERGY_LABELS[energy]}</strong>
          </span>
          <LinkBtn onClick={() => setEditing(true)}>Edit</LinkBtn>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>Mood</div>
            <TapRow val={mood} onChange={setMood} labels={MOOD_LABELS} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>Energy</div>
            <TapRow val={energy} onChange={setEnergy} labels={ENERGY_LABELS} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={save} style={{ background: ACCENT, border: 'none', borderRadius: 9, padding: '7px 14px', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="check" size={13} /> Save
            </button>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Saved to your journal.</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FitnessThisWeek({ state }) {
  const idx = todayIdx();
  const habits = state.habits || [];
  const logs = state.habitLogs || {};
  const workoutH = habits.find(h => h.id === 'hb2' || h.label?.toLowerCase().includes('workout'));
  const proteinH  = habits.find(h => h.id === 'hb1' || h.label?.toLowerCase().includes('protein'));
  const wLog = workoutH ? (logs[workoutH.id] || Array(7).fill(false)) : Array(7).fill(false);
  const workoutsThisWeek = wLog.filter(Boolean).length;
  const proteinToday = !!(proteinH && logs[proteinH.id]?.[idx]);
  const DAYS = ['M','T','W','T','F','S','S'];

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Fitness This Week</SectionLabel>
      <div style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 10 }}>
        <strong>{workoutsThisWeek}</strong> workouts this week <span style={{ color: 'var(--muted)' }}>· goal 3–4</span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {DAYS.map((d, i) => {
          const done = wLog[i]; const isToday = i === idx;
          return (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700,
              background: done ? '#5b8df5' : 'transparent',
              border: `1.5px solid ${isToday ? '#5b8df5' : done ? '#5b8df5' : 'var(--line)'}`,
              color: done ? '#fff' : isToday ? '#5b8df5' : 'var(--muted)',
              boxShadow: isToday ? '0 0 0 2px rgba(91,141,245,0.2)' : 'none',
            }}>{d}</div>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: proteinToday ? SAGE : 'var(--muted)' }}>
        {proteinToday ? '✓ Protein goal hit today' : 'Protein goal not yet logged today'}
      </div>
    </div>
  );
}

function HairRegimenStatus({ state }) {
  const regimenStart = new Date('2026-05-14T00:00:00');
  const now = new Date(todayStr() + 'T00:00:00');
  const weekNum = Math.max(1, Math.min(8, Math.floor((now - regimenStart) / (7 * 86400000)) + 1));
  const nextTrim = new Date('2026-07-23T00:00:00');
  const daysToTrim = Math.max(0, Math.ceil((nextTrim - now) / 86400000));

  const habits = state.habits || [];
  const logs = state.habitLogs || {};
  const scalpH = habits.find(h => h.id === 'hh2' || h.label?.toLowerCase().includes('scalp'));
  const washDoneThisWeek = scalpH ? (logs[scalpH.id] || Array(7).fill(false)).some(Boolean) : true;

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Hair Regimen</SectionLabel>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--ink)' }}>Week <strong>{weekNum}</strong> of 8</span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Next trim in <strong style={{ color: 'var(--ink)' }}>{daysToTrim}</strong> days</span>
      </div>
      <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, marginBottom: 8 }}>
        <div style={{ height: '100%', background: '#6db88a', borderRadius: 2, width: `${(weekNum / 8) * 100}%`, transition: 'width .3s' }} />
      </div>
      {!washDoneThisWeek && (
        <div style={{ fontSize: 12, color: GOLD, background: '#fef3cd', padding: '5px 10px', borderRadius: 8, marginTop: 4 }}>Wash day not logged yet this week</div>
      )}
    </div>
  );
}

function KitchenCheckIn({ state, setState }) {
  const today = todayStr();
  const saved = (state.todayKitchenCheck || {})[today];
  const [meals, setMeals] = useState(saved?.mealsPlanned || false);
  const [prep, setPrep] = useState(saved?.prepDone || false);
  const [editing, setEditing] = useState(!saved);

  const save = () => {
    setState(s => ({ ...s, todayKitchenCheck: { ...(s.todayKitchenCheck || {}), [today]: { date: today, mealsPlanned: meals, prepDone: prep } } }));
    setEditing(false);
  };

  const Toggle = ({ label, val, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--ink)' }}>{label}</span>
      <button onClick={() => onChange(!val)} style={{
        padding: '4px 12px', borderRadius: 14, fontSize: 12, fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
        border: `1px solid ${val ? '#6db88a' : 'var(--line)'}`,
        background: val ? '#6db88a' : 'var(--card)',
        color: val ? '#fff' : 'var(--muted)',
      }}>{val ? 'Yes ✓' : 'No'}</button>
    </div>
  );

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Kitchen Check-in</SectionLabel>
      {!editing && saved ? (
        <div>
          <div style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 4 }}>
            Meals planned: <strong>{saved.mealsPlanned ? 'Yes' : 'No'}</strong> · Prep done: <strong>{saved.prepDone ? 'Yes' : 'No'}</strong>
          </div>
          {saved.mealsPlanned && saved.prepDone && <div style={{ fontSize: 13, color: SAGE, marginBottom: 4 }}>You're set. ✦</div>}
          <LinkBtn onClick={() => setEditing(true)}>Edit</LinkBtn>
        </div>
      ) : (
        <div>
          <Toggle label="Meals planned for today?" val={meals} onChange={setMeals} />
          <Toggle label="Meal prep done this week?" val={prep} onChange={setPrep} />
          <div style={{ fontSize: 12, color: 'var(--muted)', margin: '6px 0 10px' }}>Protein goal is 130g daily.</div>
          <button onClick={save} style={{ background: 'none', border: '1px solid var(--line)', borderRadius: 9, padding: '6px 14px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="check" size={13} /> Save
          </button>
        </div>
      )}
    </div>
  );
}

// ── GROUP 4 — DAILY ANCHORS ───────────────────────────────────────────────────

function DevotionToday({ state, onNavigate }) {
  const today = todayStr();
  const entry = (state.devotionEntries || {})[today];
  const dev = DEVOTIONALS[new Date().getDay()];
  const habits = state.habits || [];
  const logs = state.habitLogs || {};
  const idx = todayIdx();
  const devH = habits.find(h => h.id === 'hm1' || h.label?.toLowerCase().includes('devotion'));
  const habitLogged = devH ? !!(logs[devH.id]?.[idx]) : false;

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Devotion Today</SectionLabel>
      {entry ? (
        <div style={{ fontSize: 13, color: SAGE, fontWeight: 600 }}>
          Devotion complete ✓
          {entry.scripture && <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontWeight: 400, marginTop: 2 }}>{entry.scripture}</div>}
        </div>
      ) : (
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink)', lineHeight: 1.45, marginBottom: 8 }}>
            {dev.title} — {dev.scripture}
          </div>
          <LinkBtn onClick={() => onNavigate('devotion')}>Read now →</LinkBtn>
        </div>
      )}
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
        Morning devotion habit: {habitLogged ? <span style={{ color: SAGE }}>✓ logged</span> : 'not yet logged'}
      </div>
    </div>
  );
}

function JournalToday({ state, onNavigate }) {
  const today = todayStr();
  const entry = (state.journal || []).find(e => e.date === today);
  const wordCount = entry?.body ? entry.body.trim().split(/\s+/).filter(Boolean).length : 0;
  const prompt = JOURNAL_PROMPTS[dayOfYear() % JOURNAL_PROMPTS.length];

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Journal Today</SectionLabel>
      {entry?.body ? (
        <div>
          <div style={{ fontSize: 13, color: SAGE, fontWeight: 600 }}>Entry written ✓</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'} · {MOOD_LABELS[entry.mood] || 'mood not set'}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink)', lineHeight: 1.55, marginBottom: 8 }}>{prompt}</div>
          <LinkBtn onClick={() => onNavigate('journal')}>Write now →</LinkBtn>
        </div>
      )}
    </div>
  );
}

function QuickWinCapture({ state, setState }) {
  const today = todayStr();
  const wins = (state.journalWins || []).filter(w => w.date === today);
  const [text, setText] = useState('');

  const add = () => {
    if (!text.trim()) return;
    setState(s => ({ ...s, journalWins: [{ id: uid(), text: text.trim(), date: today }, ...(s.journalWins || [])] }));
    setText('');
  };
  const del = (id) => setState(s => ({ ...s, journalWins: (s.journalWins || []).filter(w => w.id !== id) }));

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <SectionLabel>Quick Win</SectionLabel>
      <div style={{ display: 'flex', gap: 8, marginBottom: wins.length ? 10 : 0 }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="What went right today?"
          style={{ flex: 1, fontSize: 13, padding: '7px 10px', border: '1px solid var(--line)', borderRadius: 9, background: 'var(--card)', outline: 'none', fontFamily: 'inherit' }}
        />
        <button onClick={add} style={{ background: ACCENT, border: 'none', borderRadius: 9, width: 36, color: '#fff', cursor: 'pointer', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
      {wins.map(w => (
        <div key={w.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderTop: '1px solid var(--line)' }}>
          <span style={{ color: ACCENT, flexShrink: 0 }}>✦</span>
          <span style={{ fontSize: 13, color: 'var(--ink)', flex: 1, lineHeight: 1.45 }}>{w.text}</span>
          <button onClick={() => del(w.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
        </div>
      ))}
    </div>
  );
}

function MonthlyReviewPrompt({ state, onNavigate }) {
  const now = new Date();
  const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
  if (daysLeft > 10) return null;

  const monthName = now.toLocaleDateString('en-US', { month: 'long' });
  const prefix = now.toISOString().slice(0, 7);
  const entries = (state.journal || []).filter(e => (e.date || '').startsWith(prefix));
  const habits = state.habits || [];
  const logs = state.habitLogs || {};
  const totalChecks = habits.reduce((a, h) => a + (logs[h.id] || []).filter(Boolean).length, 0);
  const habitPct = habits.length ? Math.round((totalChecks / (habits.length * 7)) * 100) : 0;

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10, background: SOFT_BG, borderColor: ACCENT + '44' }}>
      <SectionLabel>Month Wrapping Up</SectionLabel>
      <div style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>The month is wrapping up. How was <strong>{monthName}</strong>?</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
        {entries.length} journal {entries.length === 1 ? 'entry' : 'entries'} · {habitPct}% habit average this week
      </div>
      <button onClick={() => onNavigate('review')} style={{ background: ACCENT, border: 'none', borderRadius: 10, padding: '8px 16px', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
        Start your monthly review →
      </button>
    </div>
  );
}

// ── ZONE 6: BRAIN DUMP ────────────────────────────────────────────────────────

function BrainDump({ state, setState }) {
  const items = state.todayBrainDump || [];
  const [text, setText] = useState('');

  const add = () => {
    if (!text.trim()) return;
    setState(s => ({ ...s, todayBrainDump: [...(s.todayBrainDump || []), { id: uid(), text: text.trim(), done: false }] }));
    setText('');
  };
  const toggle = (id) => setState(s => ({ ...s, todayBrainDump: (s.todayBrainDump || []).map(i => i.id === id ? { ...i, done: !i.done } : i) }));
  const del = (id) => setState(s => ({ ...s, todayBrainDump: (s.todayBrainDump || []).filter(i => i.id !== id) }));

  const active = items.filter(i => !i.done);
  const done = items.filter(i => i.done);

  const renderItem = (item, isDone) => (
    <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderTop: '1px solid var(--line)', opacity: isDone ? 0.5 : 1 }}>
      <button onClick={() => toggle(item.id)} style={{
        width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${isDone ? 'var(--muted)' : 'var(--line)'}`,
        background: isDone ? 'var(--muted)' : 'transparent', cursor: 'pointer', flexShrink: 0, marginTop: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isDone && <Icon name="check" size={11} stroke={2.2} />}
      </button>
      <span style={{ fontSize: 13, color: isDone ? 'var(--muted)' : 'var(--ink)', flex: 1, lineHeight: 1.5, textDecoration: isDone ? 'line-through' : 'none' }}>{item.text}</span>
      <button onClick={() => del(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
    </div>
  );

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink)', marginBottom: 10 }}>Brain Dump</div>
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: items.length ? 4 : 0 }}>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Drop anything here. It doesn't have to make sense yet."
            style={{ flex: 1, fontSize: 13, padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)', outline: 'none', fontFamily: 'inherit' }}
          />
          <button onClick={add} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, padding: '0 16px', color: 'var(--ink)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>Add</button>
        </div>
        {items.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', paddingTop: 8 }}>Drop anything here. It doesn't have to make sense yet.</div>}
        {active.map(i => renderItem(i, false))}
        {done.map(i => renderItem(i, true))}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────

export default function TodayView({ state, setState }) {
  const [calendar, setCalendar] = useState({ connected: null, events: [] });

  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(setCalendar)
      .catch(() => setCalendar({ connected: false, events: [] }));
  }, []);

  const navigate = (page) => setState(s => ({ ...s, page }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ScriptureBanner onNavigate={navigate} />

      <GreetingStats state={state} />

      <AffirmationCard state={state} />

      <SleepCheckIn state={state} setState={setState} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
        <div>
          <GroupHeader label="Today's Focus" />
          <HabitsToday state={state} setState={setState} />
          <TodaysAgenda calendar={calendar} />
          <ContentDueToday state={state} onNavigate={navigate} />

          <GroupHeader label="On Your Radar" />
          <GoalsDueThisWeek state={state} />
          <SilkWeeklyFocus state={state} setState={setState} />
          <UpcomingTrip state={state} />
        </div>

        <div>
          <GroupHeader label="Body & Wellness" />
          <MoodEnergyCheckIn state={state} setState={setState} />
          <FitnessThisWeek state={state} />
          <HairRegimenStatus state={state} />
          <KitchenCheckIn state={state} setState={setState} />

          <GroupHeader label="Daily Anchors" />
          <DevotionToday state={state} onNavigate={navigate} />
          <JournalToday state={state} onNavigate={navigate} />
          <QuickWinCapture state={state} setState={setState} />
          <MonthlyReviewPrompt state={state} onNavigate={navigate} />
        </div>
      </div>

      <BrainDump state={state} setState={setState} />
    </div>
  );
}
