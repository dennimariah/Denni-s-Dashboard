'use client';

import Icon from '@/components/ui/Icon';
import { useState, useMemo, useEffect } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────────

const ACCENT = '#d68d84';
const SOFT_BG = '#fdf6f4';

const CAT_COLORS = { Personal: '#e8527a', Family: '#3dba7a', Business: '#b8860b', Health: '#5b8df5', Relationships: '#b39bd8', Other: '#888', Identity: '#d68d84', Faith: '#f4a261' };

const PRAYER_CATS = ['Personal', 'Family', 'Business', 'Health', 'Relationships', 'Other'];
const AFFIRM_CATS = ['Identity', 'Business', 'Health', 'Faith', 'Relationships'];

const BIBLE_BOOKS = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'];
const OT_COUNT = 39;

const INN = { fontSize: 13, padding: '9px 11px', border: '1px solid var(--line)', borderRadius: 9, background: 'var(--card)', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };

const SUB_TABS = [{ id: 'today', label: 'Today' }, { id: 'prayer', label: 'Prayer' }, { id: 'affirmations', label: 'Affirmations' }, { id: 'reading', label: 'Reading Plan' }];

// ── Helpers ──────────────────────────────────────────────────────────────────

function todayStr() { return new Date().toISOString().slice(0, 10); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function shiftDate(d, days) { const dt = new Date(d + 'T00:00:00'); dt.setDate(dt.getDate() + days); return dt.toISOString().slice(0, 10); }
function fmtDate(d) { if (!d) return ''; const dt = new Date(d + 'T00:00:00'); return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtShort(d) { const dt = new Date(d + 'T00:00:00'); return dt.toLocaleDateString('en-US', { weekday: 'short' }); }
function fmtDay(d) { const dt = new Date(d + 'T00:00:00'); return dt.getDate(); }
function fmtLong(d) { const dt = new Date(d + 'T00:00:00'); return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }

function seededIndex(seedStr, len) {
  if (!len) return 0;
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) { h = (h * 31 + seedStr.charCodeAt(i)) >>> 0; }
  return h % len;
}

function streakFrom(entries) {
  let n = 0, d = todayStr();
  while (entries[d]) { n++; d = shiftDate(d, -1); }
  return n;
}

function CatPill({ cat, small }) {
  const c = CAT_COLORS[cat] || '#888';
  return <span style={{ fontSize: small ? 10 : 11, fontWeight: 600, color: c, background: c + '1c', padding: small ? '2px 7px' : '3px 9px', borderRadius: 20, letterSpacing: '0.02em' }}>{cat}</span>;
}

function blankEntry(date) {
  return { date, scripture: '', scriptureText: '', reflection: '', application: '', grateful1: '', grateful2: '', grateful3: '', prayerFocus: '' };
}

// ── TODAY TAB ──────────────────────────────────────────────────────────────────

function Field({ label }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5 }}>{label}</div>;
}

function EntryForm({ initial, onSave, onCancel }) {
  const [d, setD] = useState(initial);
  const set = (k, v) => setD(s => ({ ...s, [k]: v }));
  return (
    <div className="col gap-md">
      <div>
        <Field label="Scripture reference" />
        <input style={INN} value={d.scripture} onChange={e => set('scripture', e.target.value)} placeholder="Philippians 4:13" />
      </div>
      <div>
        <Field label="Scripture text" />
        <textarea style={{ ...INN, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15 }} rows={2} value={d.scriptureText} onChange={e => set('scriptureText', e.target.value)} placeholder="What does it say?" />
      </div>
      <div>
        <Field label="Reflection" />
        <textarea style={INN} rows={3} value={d.reflection} onChange={e => set('reflection', e.target.value)} placeholder="What is this saying to me today?" />
      </div>
      <div>
        <Field label="Application" />
        <textarea style={INN} rows={2} value={d.application} onChange={e => set('application', e.target.value)} placeholder="How will I carry this into today?" />
      </div>
      <div>
        <Field label="I'm grateful for…" />
        <div className="row gap-sm" style={{ alignItems: 'stretch' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: ACCENT }}>{n}</span>
              <input style={{ ...INN, paddingLeft: 24 }} value={d['grateful' + n]} onChange={e => set('grateful' + n, e.target.value)} placeholder="Grateful for…" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Field label="Prayer focus" />
        <input style={INN} value={d.prayerFocus} onChange={e => set('prayerFocus', e.target.value)} placeholder="Today I'm bringing to God…" />
      </div>
      <div className="row gap-sm">
        <button className="btn btn--pink" style={{ background: ACCENT, borderColor: ACCENT }} onClick={() => onSave(d)}><Icon name="check" size={15} /> Save</button>
        {onCancel && <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

function EntryRead({ entry, onEdit, compact }) {
  const grats = [entry.grateful1, entry.grateful2, entry.grateful3].filter(Boolean);
  return (
    <div className="col gap-md">
      {(entry.scripture || entry.scriptureText) && (
        <div>
          {entry.scripture && <div className="text-mono fs-xs" style={{ color: ACCENT, letterSpacing: '0.08em', marginBottom: 6 }}>{entry.scripture}</div>}
          {entry.scriptureText && <div style={{ fontFamily: 'var(--font-serif)', fontSize: compact ? 16 : 18, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.5 }}>"{entry.scriptureText}"</div>}
        </div>
      )}
      {entry.reflection && <div><div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em', marginBottom: 3 }}>REFLECTION</div><div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{entry.reflection}</div></div>}
      {entry.application && <div><div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em', marginBottom: 3 }}>APPLICATION</div><div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{entry.application}</div></div>}
      {grats.length > 0 && (
        <div>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em', marginBottom: 5 }}>GRATEFUL</div>
          <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
            {grats.map((g, i) => <span key={i} style={{ fontSize: 12, background: SOFT_BG, color: ACCENT, padding: '4px 11px', borderRadius: 20, border: `1px solid ${ACCENT}33` }}>{g}</span>)}
          </div>
        </div>
      )}
      {entry.prayerFocus && <div><div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em', marginBottom: 3 }}>PRAYER FOCUS</div><div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{entry.prayerFocus}</div></div>}
      {onEdit && <div><button className="btn btn--ghost" onClick={onEdit}><Icon name="edit" size={14} /> Edit</button></div>}
    </div>
  );
}

function TodayTab({ state, setState }) {
  const entries = state.devotionEntries || {};
  const today = todayStr();
  const [editing, setEditing] = useState(false);
  const [viewDay, setViewDay] = useState(null);
  const streak = streakFrom(entries);

  const saveEntry = (d) => {
    setState(s => ({ ...s, devotionEntries: { ...(s.devotionEntries || {}), [d.date]: { ...d } } }));
    setEditing(false);
  };

  const hasToday = !!entries[today];
  const days = useMemo(() => { const out = []; for (let i = 6; i >= 0; i--) out.push(shiftDate(today, -i)); return out; }, [today]);

  return (
    <div className="col gap-md">
      <div className="card" style={{ padding: '18px 22px', background: SOFT_BG, borderColor: ACCENT + '33' }}>
        <div className="row row--between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="text-mono fs-xs" style={{ color: ACCENT, letterSpacing: '0.1em' }}>{fmtLong(today)}</div>
            <div className="text-serif" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 2 }}>Today's devotion</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {streak > 0
              ? <div className="text-serif" style={{ fontSize: 18, color: ACCENT }}>{streak}-day streak 🔥</div>
              : <div style={{ fontSize: 13, color: 'var(--muted)' }}>Start your streak today</div>}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        {(!hasToday || editing)
          ? <EntryForm initial={entries[today] || blankEntry(today)} onSave={saveEntry} onCancel={editing ? () => setEditing(false) : null} />
          : <EntryRead entry={entries[today]} onEdit={() => setEditing(true)} />}
      </div>

      {/* Recent strip */}
      <div className="card" style={{ padding: '16px 22px' }}>
        <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 12 }}>LAST 7 DAYS</div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          {days.map(d => {
            const isToday = d === today;
            const has = !!entries[d];
            const active = viewDay === d;
            return (
              <button key={d} onClick={() => has ? setViewDay(active ? null : d) : null}
                style={{ background: 'none', border: 'none', cursor: has ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: 0, opacity: has || isToday ? 1 : 0.55 }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{fmtShort(d)}</div>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, transition: 'all .15s',
                  background: isToday ? ACCENT : 'transparent',
                  color: isToday ? '#fff' : has ? ACCENT : 'var(--muted)',
                  border: isToday ? 'none' : has ? `1.5px solid ${ACCENT}` : '1.5px solid var(--line)',
                  outline: active ? `2px solid ${ACCENT}66` : 'none', outlineOffset: 2,
                }}>{fmtDay(d)}</div>
                {has && !isToday && <div style={{ width: 4, height: 4, borderRadius: '50%', background: ACCENT }} />}
                {(!has || isToday) && <div style={{ width: 4, height: 4 }} />}
              </button>
            );
          })}
        </div>
        {viewDay && entries[viewDay] && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <div className="text-mono fs-xs" style={{ color: ACCENT, letterSpacing: '0.08em', marginBottom: 10 }}>{fmtDate(viewDay)}</div>
            <EntryRead entry={entries[viewDay]} compact />
          </div>
        )}
      </div>
    </div>
  );
}

// ── PRAYER TAB ──────────────────────────────────────────────────────────────────

function AddPrayer({ onAdd }) {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('Personal');
  const [notes, setNotes] = useState('');
  const submit = () => {
    if (!title.trim()) return;
    onAdd({ id: uid(), title: title.trim(), dateAdded: todayStr(), category: cat, notes: notes.trim(), status: 'Active', answeredOn: '', answeredNote: '' });
    setTitle(''); setNotes(''); setCat('Personal');
  };
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 10 }}>ADD A PRAYER REQUEST</div>
      <div className="col gap-sm">
        <div className="row gap-sm">
          <input style={{ ...INN, flex: 2 }} value={title} onChange={e => setTitle(e.target.value)} placeholder="What are you praying for?" onKeyDown={e => e.key === 'Enter' && submit()} />
          <select style={{ ...INN, flex: 1, cursor: 'pointer' }} value={cat} onChange={e => setCat(e.target.value)}>
            {PRAYER_CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <textarea style={INN} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" />
        <div><button className="btn btn--pink" style={{ background: ACCENT, borderColor: ACCENT }} onClick={submit}><Icon name="plus" size={15} /> Add prayer</button></div>
      </div>
    </div>
  );
}

function ActivePrayerCard({ p, onAnswer, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [on, setOn] = useState(todayStr());
  const [note, setNote] = useState('');
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="row row--between" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{p.title}</div>
          <div className="row gap-sm" style={{ marginTop: 6, alignItems: 'center' }}>
            <span className="text-mono fs-xs text-muted">{fmtDate(p.dateAdded)}</span>
            <CatPill cat={p.category} small />
          </div>
        </div>
        <button className="btn btn--icon" style={{ color: 'var(--muted)' }} onClick={() => onDelete(p.id)} title="Delete"><Icon name="trash" size={15} /></button>
      </div>
      {p.notes && (
        <div style={{ marginTop: 10 }}>
          <div onClick={() => setExpanded(e => !e)} style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55, cursor: 'pointer', ...(expanded ? {} : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }) }}>{p.notes}</div>
          {p.notes.length > 80 && <button onClick={() => setExpanded(e => !e)} style={{ fontSize: 11, color: ACCENT, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 0', fontFamily: 'inherit' }}>{expanded ? 'Less' : 'More'}</button>}
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        {!answering
          ? <button className="btn btn--ghost" style={{ color: ACCENT, borderColor: ACCENT + '55' }} onClick={() => setAnswering(true)}><Icon name="check" size={14} /> Mark answered</button>
          : (
            <div className="col gap-sm" style={{ background: SOFT_BG, padding: 12, borderRadius: 10, border: `1px solid ${ACCENT}33` }}>
              <div className="row gap-sm" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>Answered on</span>
                <input type="date" style={{ ...INN, width: 'auto', flex: 1 }} value={on} onChange={e => setOn(e.target.value)} />
              </div>
              <textarea style={INN} rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="How did God answer this?" />
              <div className="row gap-sm">
                <button className="btn btn--pink" style={{ background: ACCENT, borderColor: ACCENT }} onClick={() => onAnswer(p.id, on, note.trim())}><Icon name="check" size={14} /> Confirm</button>
                <button className="btn btn--ghost" onClick={() => setAnswering(false)}>Cancel</button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function AnsweredPrayerCard({ p }) {
  return (
    <div className="card" style={{ padding: 16, background: SOFT_BG, borderColor: ACCENT + '33' }}>
      <div className="row row--between" style={{ alignItems: 'flex-start' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{p.title}</div>
        <CatPill cat={p.category} small />
      </div>
      <div className="text-mono fs-xs" style={{ color: ACCENT, marginTop: 5 }}>Answered {fmtDate(p.answeredOn)}</div>
      {p.answeredNote && <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink)', lineHeight: 1.5, marginTop: 10 }}>"{p.answeredNote}"</div>}
      <div className="text-mono fs-xs text-muted" style={{ marginTop: 10 }}>Prayed since {fmtDate(p.dateAdded)}</div>
    </div>
  );
}

function PrayerTab({ state, setState }) {
  const prayers = state.devotionPrayerRequests || [];
  const active = prayers.filter(p => p.status === 'Active');
  const answered = prayers.filter(p => p.status === 'Answered');
  const [showAnswered, setShowAnswered] = useState(false);

  const add = (pr) => setState(s => ({ ...s, devotionPrayerRequests: [pr, ...(s.devotionPrayerRequests || [])] }));
  const answer = (id, on, note) => setState(s => ({ ...s, devotionPrayerRequests: (s.devotionPrayerRequests || []).map(p => p.id === id ? { ...p, status: 'Answered', answeredOn: on, answeredNote: note } : p) }));
  const del = (id) => setState(s => ({ ...s, devotionPrayerRequests: (s.devotionPrayerRequests || []).filter(p => p.id !== id) }));

  return (
    <div className="col gap-md">
      <div className="row gap-sm" style={{ alignItems: 'baseline' }}>
        <span className="text-serif" style={{ fontSize: 20, color: ACCENT }}>{active.length}</span><span className="fs-xs text-muted">active</span>
        <span style={{ color: 'var(--line)' }}>·</span>
        <span className="text-serif" style={{ fontSize: 20, color: 'var(--ink-soft)' }}>{answered.length}</span><span className="fs-xs text-muted">answered</span>
      </div>

      <AddPrayer onAdd={add} />

      {active.length === 0
        ? <div className="empty">No active prayers yet. Bring something to God above.</div>
        : <div className="col gap-sm">{active.map(p => <ActivePrayerCard key={p.id} p={p} onAnswer={answer} onDelete={del} />)}</div>}

      {answered.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <button onClick={() => setShowAnswered(s => !s)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '16px 18px', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-serif" style={{ fontSize: 16, color: 'var(--ink)' }}>Answered prayers ({answered.length})</span>
            <span style={{ color: ACCENT, transform: showAnswered ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><Icon name="arrow-r" size={16} stroke={2} /></span>
          </button>
          {showAnswered && (
            <div className="col gap-sm" style={{ padding: '0 18px 18px' }}>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em', marginBottom: 2 }}>✨ A WALL OF TESTIMONY ✨</div>
              {answered.map(p => <AnsweredPrayerCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── AFFIRMATIONS TAB ──────────────────────────────────────────────────────────

function AffirmationsTab({ state, setState }) {
  const affirmations = state.devotionAffirmations || [];
  const [reseed, setReseed] = useState(0);
  const [text, setText] = useState('');
  const [cat, setCat] = useState('Identity');

  const featured = useMemo(() => {
    if (!affirmations.length) return null;
    if (reseed > 0) return affirmations[Math.floor(Math.random() * affirmations.length)];
    return affirmations[seededIndex(todayStr(), affirmations.length)];
  }, [affirmations, reseed]);

  const sorted = useMemo(() => [...affirmations].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)), [affirmations]);

  const add = () => {
    if (!text.trim()) return;
    setState(s => ({ ...s, devotionAffirmations: [...(s.devotionAffirmations || []), { id: uid(), text: text.trim(), category: cat, pinned: false }] }));
    setText(''); setCat('Identity');
  };
  const togglePin = (id) => setState(s => ({ ...s, devotionAffirmations: (s.devotionAffirmations || []).map(a => a.id === id ? { ...a, pinned: !a.pinned } : a) }));
  const del = (id) => setState(s => ({ ...s, devotionAffirmations: (s.devotionAffirmations || []).filter(a => a.id !== id) }));

  return (
    <div className="col gap-md">
      <div className="card" style={{ position: 'relative', background: SOFT_BG, borderColor: ACCENT + '33', padding: 40, textAlign: 'center', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {featured
          ? <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, lineHeight: 1.35, color: 'var(--ink)', maxWidth: 640 }}>{featured.text}</div>
          : <div className="text-muted" style={{ fontSize: 15 }}>Add an affirmation to see it featured here.</div>}
        {featured && (
          <button onClick={() => setReseed(r => r + 1)} style={{ position: 'absolute', bottom: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: ACCENT, display: 'flex', alignItems: 'center', gap: 4 }}>↻ New one</button>
        )}
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 10 }}>ADD AN AFFIRMATION</div>
        <div className="col gap-sm">
          <textarea style={INN} rows={2} value={text} onChange={e => setText(e.target.value)} placeholder="I am…" />
          <div className="row gap-sm">
            <select style={{ ...INN, flex: 1, cursor: 'pointer' }} value={cat} onChange={e => setCat(e.target.value)}>
              {AFFIRM_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn btn--pink" style={{ background: ACCENT, borderColor: ACCENT }} onClick={add}><Icon name="plus" size={15} /> Add</button>
          </div>
        </div>
      </div>

      {sorted.length === 0
        ? <div className="empty">No affirmations yet.</div>
        : (
          <div className="card" style={{ padding: '6px 0' }}>
            {sorted.map((a, i) => (
              <div key={a.id} className="row row--between" style={{ padding: '12px 18px', borderTop: i ? '1px solid var(--line)' : 'none', alignItems: 'center', gap: 12 }}>
                <div className="row gap-sm" style={{ alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <span style={{ width: 16, textAlign: 'center', color: a.pinned ? '#f7c548' : 'var(--line)', fontSize: a.pinned ? 12 : 16 }}>{a.pinned ? '📌' : '·'}</span>
                  <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>{a.text}</span>
                </div>
                <div className="row gap-sm" style={{ alignItems: 'center' }}>
                  <CatPill cat={a.category} small />
                  <button className="btn btn--icon" style={{ color: a.pinned ? '#f7c548' : 'var(--muted)' }} onClick={() => togglePin(a.id)} title={a.pinned ? 'Unpin' : 'Pin'}><Icon name="star" size={15} /></button>
                  <button className="btn btn--icon" style={{ color: 'var(--muted)' }} onClick={() => del(a.id)} title="Delete"><Icon name="trash" size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

// ── READING PLAN TAB ──────────────────────────────────────────────────────────

function ReadingTab({ state, setState }) {
  const plan = state.devotionBiblePlan || { goal: [], completedBooks: [], readingLog: [] };
  const completed = plan.completedBooks || [];
  const log = plan.readingLog || [];

  const [date, setDate] = useState(todayStr());
  const [book, setBook] = useState('');
  const [chapters, setChapters] = useState('');
  const [notes, setNotes] = useState('');

  const year = new Date().getFullYear();
  const thisYearLogs = log.filter(l => (l.date || '').slice(0, 4) === String(year));

  const readingStreak = useMemo(() => {
    const dates = new Set(log.map(l => l.date));
    let n = 0, d = todayStr();
    while (dates.has(d)) { n++; d = shiftDate(d, -1); }
    return n;
  }, [log]);

  const update = (fn) => setState(s => { const cur = s.devotionBiblePlan || { goal: [], completedBooks: [], readingLog: [] }; return { ...s, devotionBiblePlan: fn(cur) }; });

  const addLog = () => {
    if (!book.trim()) return;
    const entry = { id: uid(), date, book: book.trim(), chapters: chapters.trim(), notes: notes.trim() };
    update(p => ({ ...p, readingLog: [entry, ...(p.readingLog || [])] }));
    setBook(''); setChapters(''); setNotes(''); setDate(todayStr());
  };
  const delLog = (id) => update(p => ({ ...p, readingLog: (p.readingLog || []).filter(l => l.id !== id) }));
  const toggleBook = (b) => update(p => { const set = new Set(p.completedBooks || []); set.has(b) ? set.delete(b) : set.add(b); return { ...p, completedBooks: [...set] }; });

  const recent = log.slice(0, 10);

  const renderGroup = (label, books) => (
    <div>
      <div className="text-mono fs-xs" style={{ color: ACCENT, letterSpacing: '0.1em', margin: '14px 0 8px' }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 4 }}>
        {books.map(b => {
          const done = completed.includes(b);
          return (
            <button key={b} onClick={() => toggleBook(b)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', borderRadius: 7 }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, border: done ? 'none' : '1.5px solid var(--line)', background: done ? '#b8860b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>{done && <Icon name="check" size={11} stroke={2.5} />}</span>
              <span style={{ fontSize: 12, color: done ? '#b8860b' : 'var(--ink-soft)', textDecoration: done ? 'line-through' : 'none' }}>{b}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="col gap-md">
      <div className="card" style={{ padding: '14px 20px', background: SOFT_BG, borderColor: ACCENT + '33' }}>
        <div className="row gap-md" style={{ flexWrap: 'wrap', alignItems: 'baseline' }}>
          <span><span className="text-serif" style={{ fontSize: 20, color: ACCENT }}>{completed.length}</span> <span className="fs-xs text-muted">of 66 books complete</span></span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span><span className="text-serif" style={{ fontSize: 20, color: 'var(--ink)' }}>{thisYearLogs.length}</span> <span className="fs-xs text-muted">reading entries this year</span></span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span><span className="text-serif" style={{ fontSize: 20, color: ACCENT }}>{readingStreak}</span> <span className="fs-xs text-muted">-day streak</span></span>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 10 }}>LOG A READING</div>
        <datalist id="bible-books">{BIBLE_BOOKS.map(b => <option key={b} value={b} />)}</datalist>
        <div className="col gap-sm">
          <div className="row gap-sm">
            <input type="date" style={{ ...INN, flex: 1 }} value={date} onChange={e => setDate(e.target.value)} />
            <input list="bible-books" style={{ ...INN, flex: 2 }} value={book} onChange={e => setBook(e.target.value)} placeholder="Book" />
            <input style={{ ...INN, flex: 1 }} value={chapters} onChange={e => setChapters(e.target.value)} placeholder="Chapters" />
          </div>
          <textarea style={INN} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes / takeaways (optional)" />
          <div><button className="btn btn--pink" style={{ background: ACCENT, borderColor: ACCENT }} onClick={addLog}><Icon name="plus" size={15} /> Add entry</button></div>
        </div>
      </div>

      <div className="card" style={{ padding: '6px 0' }}>
        <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', padding: '12px 18px 6px' }}>RECENT READING</div>
        {recent.length === 0
          ? <div className="empty" style={{ margin: '0 18px 14px' }}>No readings logged yet.</div>
          : recent.map((l, i) => (
            <div key={l.id} className="row row--between" style={{ padding: '11px 18px', borderTop: '1px solid var(--line)', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row gap-sm" style={{ alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{l.book}{l.chapters ? ` ${l.chapters}` : ''}</span>
                  <span className="text-mono fs-xs text-muted">{fmtDate(l.date)}</span>
                </div>
                {l.notes && <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.notes}</div>}
              </div>
              <button className="btn btn--icon" style={{ color: 'var(--muted)' }} onClick={() => delLog(l.id)} title="Delete"><Icon name="trash" size={15} /></button>
            </div>
          ))}
      </div>

      <div className="card" style={{ padding: '6px 18px 18px' }}>
        <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', paddingTop: 12 }}>66 BOOKS</div>
        {renderGroup('Old Testament', BIBLE_BOOKS.slice(0, OT_COUNT))}
        {renderGroup('New Testament', BIBLE_BOOKS.slice(OT_COUNT))}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function DevotionView({ state, setState }) {
  const [tab, setTab] = useState('today');
  const morningStreak = useMemo(() => {
    const log = (state.habitLogs && state.habitLogs.hm1) || [];
    let n = 0;
    for (let i = log.length - 1; i >= 0; i--) { if (log[i]) n++; else break; }
    return n;
  }, [state.habitLogs]);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Faith &amp; Reflection</div>
          <h1 className="page-head__title">Devotion</h1>
        </div>
        {morningStreak > 0 && (
          <div className="card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'baseline', gap: 8, background: SOFT_BG, borderColor: ACCENT + '33' }}>
            <span className="text-serif" style={{ fontSize: 24, color: ACCENT }}>{morningStreak}</span>
            <span className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em' }}>morning devotion 🕊️</span>
          </div>
        )}
      </div>

      <div className="row" style={{ gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {SUB_TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 18px', borderRadius: 22, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
              border: `1px solid ${active ? ACCENT : 'var(--line)'}`,
              background: active ? ACCENT : 'var(--card)',
              color: active ? '#fff' : 'var(--ink-soft)',
            }}>{t.label}</button>
          );
        })}
      </div>

      {tab === 'today' && <TodayTab state={state} setState={setState} />}
      {tab === 'prayer' && <PrayerTab state={state} setState={setState} />}
      {tab === 'affirmations' && <AffirmationsTab state={state} setState={setState} />}
      {tab === 'reading' && <ReadingTab state={state} setState={setState} />}
    </>
  );
}
