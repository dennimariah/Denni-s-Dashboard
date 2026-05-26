'use client';

import { useState } from 'react';
import { pct, cls } from '@/lib/helpers';
import { Pill, burstConfetti } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS = {
  not_started: { label: 'Not started', color: '#9b9b9b', bg: '#f0f0f0' },
  in_progress:  { label: 'In progress', color: '#7aaee5', bg: '#dceaf7' },
  on_track:     { label: 'On track',    color: '#6db88a', bg: '#c8e8d4' },
  at_risk:      { label: 'At risk',     color: '#d4843a', bg: '#f9e5cf' },
  complete:     { label: 'Complete',    color: '#3d6b4f', bg: '#b5ddc4' },
};

const CATEGORIES = [
  { id: 'health',   label: 'Health',   icon: '🌿', color: '#e8527a', bg: '#fbd7e1' },
  { id: 'finance',  label: 'Finance',  icon: '💰', color: '#6db88a', bg: '#c8e8d4' },
  { id: 'business', label: 'Business', icon: '👑', color: '#9b7cc8', bg: '#e0d4f5' },
  { id: 'personal', label: 'Personal', icon: '🌸', color: '#f4a261', bg: '#fde3cf' },
];
const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseQuarter(q) {
  const [qPart, year] = q.split('-');
  return { qNum: parseInt(qPart.slice(1)), year: parseInt(year) };
}

function formatQuarter(qNum, year) {
  return `Q${qNum}-${year}`;
}

function getQuarterDates(q) {
  const { qNum, year } = parseQuarter(q);
  const startMonth = (qNum - 1) * 3;
  return {
    start: new Date(year, startMonth, 1),
    end: new Date(year, startMonth + 3, 0),
  };
}

function getCurrentQuarter() {
  const now = new Date();
  return formatQuarter(Math.ceil((now.getMonth() + 1) / 3), now.getFullYear());
}

function shiftQuarter(q, delta) {
  let { qNum, year } = parseQuarter(q);
  qNum += delta;
  if (qNum > 4) { qNum = 1; year++; }
  if (qNum < 1) { qNum = 4; year--; }
  return formatQuarter(qNum, year);
}

function getDaysRemaining(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr + 'T12:00:00') - new Date();
  return Math.ceil(diff / 86400000);
}

function isCurrentOrPast(q) {
  const cur = getCurrentQuarter();
  const { qNum: cq, year: cy } = parseQuarter(cur);
  const { qNum, year } = parseQuarter(q);
  return year < cy || (year === cy && qNum <= cq);
}

// ── Donut ring ────────────────────────────────────────────────────────────────

function DonutRing({ value, color, size = 52 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
    </svg>
  );
}

// ── Add / Edit Goal Modal ─────────────────────────────────────────────────────

function GoalModal({ goal, categoryId, quarter, onSave, onClose }) {
  const editing = !!goal;
  const blank = {
    title: '', category: categoryId || 'health', status: 'not_started',
    progress: 0, targetDate: '', notes: '', subtasks: [], carriedOver: false, quarter,
  };
  const [form, setForm] = useState(editing ? { ...goal } : blank);
  const [newSubtask, setNewSubtask] = useState('');

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setF('subtasks', [...form.subtasks, { id: 'st-' + Date.now(), text: newSubtask.trim(), done: false }]);
    setNewSubtask('');
  };

  const removeSubtask = (id) => setF('subtasks', form.subtasks.filter(s => s.id !== id));

  const save = () => {
    if (!form.title.trim()) return;
    onSave({ ...form, id: goal?.id || 'g' + Date.now() });
    onClose();
  };

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' };
  const labelStyle = { fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }} onClick={onClose}>
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 14 }}>
          {editing ? 'Edit goal' : 'Add goal'} · {quarter}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input value={form.title} onChange={e => setF('title', e.target.value)} placeholder="What do you want to accomplish?" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setF('category', e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Target date</label>
              <input type="date" value={form.targetDate} onChange={e => setF('targetDate', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Object.entries(STATUS).map(([key, s]) => (
                <button key={key} onClick={() => setF('status', key)} style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: form.status === key ? 700 : 400,
                  border: `1.5px solid ${form.status === key ? s.color : 'var(--line)'}`,
                  background: form.status === key ? s.bg : 'var(--bg)', color: form.status === key ? s.color : 'var(--muted)',
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Progress — {form.progress}%</label>
            <input type="range" min={0} max={100} step={5} value={form.progress} onChange={e => setF('progress', +e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={2} placeholder="Any context or details..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>Subtasks</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {form.subtasks.map(s => (
                <div key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--line)' }}>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--ink-soft)' }}>{s.text}</span>
                  <button onClick={() => removeSubtask(s.id)} style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSubtask()} placeholder="Add a subtask..." style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addSubtask} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Add</button>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, border: `1.5px solid ${form.carriedOver ? 'var(--accent-3)' : 'var(--line)'}` }}>
            <div onClick={() => setF('carriedOver', !form.carriedOver)} style={{ width: 36, height: 20, borderRadius: 999, background: form.carriedOver ? 'var(--accent-3)' : 'var(--line)', display: 'flex', alignItems: 'center', padding: '0 2px', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', transform: form.carriedOver ? 'translateX(16px)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>Carried over from prior quarter</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>This goal rolled forward from a previous quarter</div>
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Cancel</button>
          <button onClick={save} style={{ flex: 2, padding: '10px', borderRadius: 12, border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>
            {editing ? 'Save changes' : 'Add goal'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Goal card ─────────────────────────────────────────────────────────────────

function GoalCard({ goal, onUpdate, onDelete, readOnly }) {
  const [showNotes, setShowNotes] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [editing, setEditing] = useState(null); // null | goal object for modal

  const daysLeft = getDaysRemaining(goal.targetDate);
  const status = STATUS[goal.status] || STATUS.not_started;
  const cat = CAT_MAP[goal.category];

  const dateColor = daysLeft === null ? 'var(--muted)'
    : daysLeft < 7 ? '#c0392b'
    : daysLeft < 30 ? '#d4843a'
    : 'var(--muted)';

  const doneSubtasks = (goal.subtasks || []).filter(s => s.done).length;

  const toggleSubtask = (id) => {
    const subtasks = goal.subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s);
    onUpdate({ ...goal, subtasks });
  };

  const setStatus = (s, e) => {
    if (s === 'complete' && goal.status !== 'complete') {
      const r = e?.currentTarget?.getBoundingClientRect();
      if (r) burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    onUpdate({ ...goal, status: s, progress: s === 'complete' ? 100 : goal.progress });
  };

  const setProgress = (v) => onUpdate({ ...goal, progress: v });

  return (
    <>
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '16px 18px', borderLeft: `3px solid ${status.color}` }}>
        {/* Carried over badge */}
        {goal.carriedOver && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, background: '#fef3cd', color: '#8b6914', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>
            ↩ CARRIED OVER
          </div>
        )}

        {/* Title */}
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 10 }}>{goal.title}</div>

        {/* Status + date row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ padding: '3px 10px', borderRadius: 8, background: status.bg, color: status.color, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{status.label}</span>
          {goal.targetDate && (
            <span style={{ fontSize: 11, color: dateColor, fontFamily: 'var(--font-mono)' }}>
              {new Date(goal.targetDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {daysLeft !== null && ` · ${daysLeft > 0 ? daysLeft + 'd left' : daysLeft === 0 ? 'today' : 'overdue'}`}
            </span>
          )}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: cat?.color || 'var(--primary)' }}>{goal.progress}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--line)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: goal.progress + '%', background: cat?.color || 'var(--primary)', borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
          {!readOnly && (
            <input type="range" min={0} max={100} step={5} value={goal.progress} onChange={e => setProgress(+e.target.value)}
              style={{ width: '100%', accentColor: cat?.color || 'var(--primary)', height: 3 }} />
          )}
        </div>

        {/* Expandable notes */}
        {(goal.notes || !readOnly) && (
          <button onClick={() => setShowNotes(!showNotes)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 12, fontFamily: 'inherit', padding: '2px 0', marginBottom: 4, width: '100%', textAlign: 'left' }}>
            <span style={{ fontSize: 10 }}>{showNotes ? '▾' : '▸'}</span>
            <span>Notes {goal.notes ? '·' + goal.notes.slice(0, 30) + (goal.notes.length > 30 ? '...' : '') : '(empty)'}</span>
          </button>
        )}
        {showNotes && (
          <div style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 8, whiteSpace: 'pre-wrap' }}>
            {goal.notes || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No notes yet. Edit to add.</span>}
          </div>
        )}

        {/* Expandable subtasks */}
        {(goal.subtasks?.length > 0) && (
          <>
            <button onClick={() => setShowSubtasks(!showSubtasks)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 12, fontFamily: 'inherit', padding: '2px 0', marginBottom: 4, width: '100%', textAlign: 'left' }}>
              <span style={{ fontSize: 10 }}>{showSubtasks ? '▾' : '▸'}</span>
              <span>Subtasks · {doneSubtasks}/{goal.subtasks.length} complete</span>
            </button>
            {showSubtasks && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8, paddingLeft: 12 }}>
                {goal.subtasks.map(s => (
                  <label key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: readOnly ? 'default' : 'pointer' }}>
                    <input type="checkbox" checked={s.done} onChange={() => !readOnly && toggleSubtask(s.id)} style={{ accentColor: cat?.color || 'var(--primary)' }} />
                    <span style={{ fontSize: 13, color: s.done ? 'var(--muted)' : 'var(--ink-soft)', textDecoration: s.done ? 'line-through' : 'none' }}>{s.text}</span>
                  </label>
                ))}
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {!readOnly && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            {Object.entries(STATUS).map(([key, s]) => (
              <button key={key} onClick={(e) => setStatus(key, e)} style={{
                padding: '3px 8px', borderRadius: 6, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${goal.status === key ? s.color : 'var(--line)'}`,
                background: goal.status === key ? s.bg : 'transparent',
                color: goal.status === key ? s.color : 'var(--muted)', fontWeight: goal.status === key ? 700 : 400,
              }}>{s.label}</button>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={() => setEditing(goal)} style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
            <button onClick={() => onDelete(goal.id)} style={{ fontSize: 11, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
          </div>
        )}
      </div>

      {editing && (
        <GoalModal goal={editing} quarter={goal.quarter} onSave={g => { onUpdate(g); setEditing(null); }} onClose={() => setEditing(null)} />
      )}
    </>
  );
}

// ── Category section ──────────────────────────────────────────────────────────

function CategorySection({ category, goals, quarter, onAdd, onUpdate, onDelete, readOnly }) {
  const completed = goals.filter(g => g.status === 'complete').length;
  const total = goals.length;
  const catPct = total ? pct(completed, total) : 0;

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DonutRing value={catPct} color={category.color} size={48} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{category.icon}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: category.color }}>{category.label}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{completed}/{total} complete · {catPct}%</div>
          </div>
        </div>
        <div style={{ flex: 1, height: 1, background: category.color + '25' }} />
        {!readOnly && (
          <button onClick={() => onAdd(category.id)} style={{ padding: '6px 14px', borderRadius: 10, border: `1px solid ${category.color}`, background: 'transparent', color: category.color, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            + Add
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
          {readOnly ? 'No goals this quarter' : 'No goals yet — add one above'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {goals.map(g => (
            <GoalCard key={g.id} goal={g} onUpdate={onUpdate} onDelete={onDelete} readOnly={readOnly} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main QuarterView ──────────────────────────────────────────────────────────

export default function QuarterView({ state, setState }) {
  const goals = state.quarterGoals || [];
  const currentQ = getCurrentQuarter();
  const [activeQ, setActiveQ] = useState(state.activeQuarter || currentQ);
  const [showArchive, setShowArchive] = useState(false);
  const [addModal, setAddModal] = useState(null); // { categoryId } | null
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const setActiveQuarter = (q) => {
    setActiveQ(q);
    setState(s => ({ ...s, activeQuarter: q }));
  };

  const qGoals = goals.filter(g => g.quarter === activeQ);
  const pastQuarters = [...new Set(goals.map(g => g.quarter))].filter(q => q !== activeQ && isCurrentOrPast(q)).sort();
  const { end } = getQuarterDates(activeQ);
  const daysToEnd = Math.ceil((end - new Date()) / 86400000);
  const showReflection = !bannerDismissed && daysToEnd >= 0 && daysToEnd <= 14 && activeQ === currentQ;

  // Quarter summary stats
  const totalGoals = qGoals.length;
  const completeGoals = qGoals.filter(g => g.status === 'complete').length;
  const inProgressGoals = qGoals.filter(g => g.status === 'in_progress' || g.status === 'on_track').length;
  const overallPct = totalGoals ? pct(completeGoals, totalGoals) : 0;

  // Avg progress across non-complete goals
  const avgProgress = totalGoals
    ? Math.round(qGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / totalGoals)
    : 0;

  const addGoal = (g) => setState(s => ({ ...s, quarterGoals: [...s.quarterGoals, g] }));
  const updateGoal = (g) => setState(s => ({ ...s, quarterGoals: s.quarterGoals.map(x => x.id === g.id ? g : x) }));
  const deleteGoal = (id) => setState(s => ({ ...s, quarterGoals: s.quarterGoals.filter(g => g.id !== id) }));

  const { qNum, year } = parseQuarter(activeQ);
  const isCurrentQuarter = activeQ === currentQ;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Quarterly Goals · {year}</div>
          <h1 className="page-head__title">The bigger picture</h1>
          <div className="page-head__date mt-sm">
            {isCurrentQuarter ? `${daysToEnd} days remaining in ${activeQ}` : `Viewing ${activeQ}`}
          </div>
        </div>
        <div className="row gap-md" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ padding: '8px 16px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--primary)' }}>{completeGoals}/{totalGoals}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>complete</span>
          </div>
          <button onClick={() => setShowArchive(!showArchive)} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--line)', background: showArchive ? 'var(--primary)' : 'var(--card)', color: showArchive ? 'white' : 'var(--muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            {showArchive ? '← Active view' : '🗂 Past quarters'}
          </button>
        </div>
      </div>

      {/* Quarter selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setActiveQuarter(shiftQuarter(activeQ, -1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--card)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>‹</button>
        {[1, 2, 3, 4].map(q => {
          const qStr = formatQuarter(q, year);
          const active = activeQ === qStr;
          const hasCurrent = qStr === currentQ;
          return (
            <button key={q} onClick={() => setActiveQuarter(qStr)} style={{
              padding: '8px 20px', borderRadius: 10, fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: active ? 600 : 400, cursor: 'pointer',
              border: `1.5px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
              background: active ? 'var(--primary)' : 'var(--card)',
              color: active ? 'white' : hasCurrent ? 'var(--primary)' : 'var(--muted)',
              position: 'relative',
            }}>
              Q{q}
              {hasCurrent && !active && <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
            </button>
          );
        })}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button onClick={() => { const { qNum, year } = parseQuarter(activeQ); setActiveQuarter(formatQuarter(qNum, year - 1)); }} style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', cursor: 'pointer', fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
          <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--ink)', minWidth: 36, textAlign: 'center' }}>{year}</span>
          <button onClick={() => { const { qNum, year } = parseQuarter(activeQ); setActiveQuarter(formatQuarter(qNum, year + 1)); }} style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', cursor: 'pointer', fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        </div>
        <button onClick={() => setActiveQuarter(shiftQuarter(activeQ, 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--card)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>›</button>
      </div>

      {/* Reflection banner */}
      {showReflection && (
        <div style={{ background: 'linear-gradient(135deg, #fbd7e1, #fde3cf)', border: '1px solid #f4a261', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🌅</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>The quarter is wrapping up.</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>What moved? What didn't? What carries forward? Take a moment to reflect before Q{qNum + 1 > 4 ? 1 : qNum + 1} begins — {daysToEnd} days left.</div>
          </div>
          <button onClick={() => setBannerDismissed(true)} style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, flexShrink: 0, padding: 2 }}>×</button>
        </div>
      )}

      {/* Quarter health summary */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginBottom: 16 }}>
          {[
            { label: 'Goals complete',  val: `${completeGoals} of ${totalGoals}`, color: '#6db88a' },
            { label: 'In progress',      val: inProgressGoals,                    color: '#7aaee5' },
            { label: 'Avg progress',     val: `${avgProgress}%`,                  color: 'var(--primary)' },
            { label: 'Days remaining',   val: daysToEnd >= 0 ? daysToEnd : '—',   color: daysToEnd < 14 ? '#d4843a' : 'var(--muted)' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, height: 8, background: 'var(--line)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: overallPct + '%', background: 'linear-gradient(to right, var(--primary), var(--accent-1))', borderRadius: 4, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)', minWidth: 40 }}>{overallPct}%</span>
        </div>
      </div>

      {/* Archive view */}
      {showArchive ? (
        <div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>Past quarters — read only</div>
          {pastQuarters.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>No past quarters recorded yet</div>
          ) : (
            pastQuarters.map(q => {
              const qg = goals.filter(g => g.quarter === q);
              const done = qg.filter(g => g.status === 'complete').length;
              return (
                <div key={q} style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500, color: 'var(--ink)' }}>{q}</div>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{done}/{qg.length} complete</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                  </div>
                  {CATEGORIES.map(cat => {
                    const catGoals = qg.filter(g => g.category === cat.id);
                    if (catGoals.length === 0) return null;
                    return (
                      <CategorySection key={cat.id} category={cat} goals={catGoals} quarter={q} onAdd={() => {}} onUpdate={() => {}} onDelete={() => {}} readOnly />
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Active quarter view */
        <div>
          {CATEGORIES.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              goals={qGoals.filter(g => g.category === cat.id)}
              quarter={activeQ}
              onAdd={(catId) => setAddModal({ categoryId: catId })}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
              readOnly={false}
            />
          ))}

          {/* Parking lot */}
          <div style={{ marginTop: 8, padding: 20, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>Parking lot</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Ideas to revisit next quarter</div>
              </div>
              <button onClick={() => setState(s => ({ ...s, parking: ['', ...(s.parking || [])] }))} style={{ padding: '5px 12px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>+ Idea</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
              {(state.parking || []).map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--accent-3)', fontSize: 12, marginTop: 2, flexShrink: 0 }}>◆</span>
                  <input value={p} onChange={e => setState(s => ({ ...s, parking: s.parking.map((x, j) => j === i ? e.target.value : x) }))}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, background: 'transparent', color: 'var(--ink)', fontFamily: 'inherit' }} />
                  <button onClick={() => setState(s => ({ ...s, parking: s.parking.filter((_, j) => j !== i) }))} style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>×</button>
                </div>
              ))}
              {(state.parking || []).length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', gridColumn: 'span 3' }}>Nothing parked yet</div>}
            </div>
          </div>
        </div>
      )}

      {addModal && (
        <GoalModal
          goal={null}
          categoryId={addModal.categoryId}
          quarter={activeQ}
          onSave={addGoal}
          onClose={() => setAddModal(null)}
        />
      )}
    </>
  );
}
