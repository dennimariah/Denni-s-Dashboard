'use client';

import { useState, useMemo } from 'react';
import Icon from '@/components/ui/Icon';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LILAC = '#9b7cc8';

const INN = { fontSize: 14, padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
const TA = { ...INN, resize: 'vertical', lineHeight: 1.7 };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MOOD_LABELS = ['Heavy', 'Steady', 'Mixed', 'Good', 'Full'];
const SLEEP_LABELS = ['Poor', 'Fair', 'Mixed', 'Good', 'Great'];
const MOOD_EMOJI = ['😔', '😐', '🙂', '😊', '✨'];
const TRACK_OPTS = [['yes', 'Yes'], ['mostly', 'Mostly'], ['not_really', 'Not really']];

// ---------- helpers ----------
function monthLabel(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}
function shiftMonth(ym, delta) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function currentYM() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function getMonthRevenue(fin, ym) {
  const rev = fin?.revenue || [];
  return rev.filter(r => (r.date || '').slice(0, 7) === ym).reduce((s, r) => s + (Number(r.amount) || 0), 0);
}
function getHabitRate(habitLogs) {
  const logs = Object.values(habitLogs || {});
  if (!logs.length) return null;
  let total = 0, done = 0;
  logs.forEach(arr => { (arr || []).forEach(v => { total++; if (v) done++; }); });
  if (!total) return null;
  return Math.round((done / total) * 100);
}
function getJournalCount(journal, ym) {
  return (journal || []).filter(j => ((j.createdAt || j.date || '') + '').slice(0, 7) === ym).length;
}

function blankReview(ym) {
  return {
    month: ym,
    moodRating: 3, inAWord: '', drainedBy: '', energizedBy: '',
    biggestWin: '', mostProud: '', consistent: '',
    didntHappen: '', gotInWay: '', differently: '',
    showedUp: '', youShowedUp: '', investMore: '',
    bodyFeel: '', sleepQuality: 3, fitnessOnTrack: 'mostly', hairConsistent: 'mostly',
    spirituallyConnected: '', scriptureQuote: '', gratefulFor: '',
    nextMonthIntention: '', letGoOf: '', protect: '',
    monthScore: 7, privateNote: '',
    snapshot: { habitRate: null, journalCount: null, goals: [], revenue: null, capturedAt: null },
  };
}

function liveSnapshot(state, ym) {
  const goals = (state.quarterGoals || []).map(g => ({ title: g.title, status: g.status }));
  return {
    habitRate: getHabitRate(state.habitLogs),
    journalCount: getJournalCount(state.journal, ym),
    goals,
    revenue: getMonthRevenue(state.scFinances, ym),
    capturedAt: new Date().toISOString(),
  };
}

// ---------- small ui ----------
function SectionHead({ children }) {
  return <div className="text-mono fs-xs" style={{ color: LILAC, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>{children}</div>;
}
function Label({ children }) {
  return <div className="fs-xs text-muted" style={{ marginBottom: 6 }}>{children}</div>;
}
function Field({ label, children }) {
  return <div className="col gap-sm">{label && <Label>{label}</Label>}{children}</div>;
}

function Slider({ value, onChange, labels }) {
  const max = labels.length;
  return (
    <div className="col gap-sm">
      <input type="range" min={1} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: LILAC }} />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        {labels.map((l, i) => (
          <span key={l} className="fs-xs" style={{ color: i + 1 === value ? LILAC : 'var(--muted)', fontWeight: i + 1 === value ? 700 : 400 }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Toggle3({ value, onChange, opts = TRACK_OPTS }) {
  return (
    <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
      {opts.map(([k, lbl]) => (
        <button key={k} onClick={() => onChange(k)} style={{
          padding: '6px 14px', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          fontWeight: value === k ? 700 : 400,
          border: `1.5px solid ${value === k ? LILAC : 'var(--line)'}`,
          background: value === k ? `${LILAC}18` : 'transparent',
          color: value === k ? LILAC : 'var(--muted)',
        }}>{lbl}</button>
      ))}
    </div>
  );
}

// ---------- snapshot panel ----------
function SnapshotPanel({ snap, live }) {
  if (!snap) return null;
  return (
    <div style={{ background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px' }}>
      <div className="row row--between" style={{ marginBottom: 12 }}>
        <div className="text-mono fs-xs text-muted" style={{ letterSpacing: 1, textTransform: 'uppercase' }}>Captured snapshot</div>
        {live && <span className="fs-xs text-muted" style={{ fontStyle: 'italic' }}>(live preview — saved when you write this review)</span>}
      </div>
      <div className="col gap-md">
        <div className="row" style={{ gap: 28, flexWrap: 'wrap' }}>
          <div className="col"><span className="fs-xs text-muted">Habit completion</span><span className="text-serif" style={{ fontSize: 20 }}>{snap.habitRate == null ? '—' : `${snap.habitRate}%`}</span></div>
          <div className="col"><span className="fs-xs text-muted">Journal entries</span><span className="text-serif" style={{ fontSize: 20 }}>{snap.journalCount ?? 0}</span></div>
          <div className="col"><span className="fs-xs text-muted">Revenue</span><span className="text-serif" style={{ fontSize: 20 }}>${(snap.revenue ?? 0).toLocaleString()}</span></div>
        </div>
        {(snap.goals && snap.goals.length > 0) && (
          <div className="col gap-sm">
            <span className="fs-xs text-muted">Quarterly goals</span>
            <div className="col" style={{ gap: 4 }}>
              {snap.goals.map((g, i) => (
                <div key={i} className="row" style={{ gap: 8 }}>
                  <span className="fs-xs" style={{ color: 'var(--ink-soft)' }}>{g.title || 'Untitled'}</span>
                  <span className="text-mono fs-xs text-muted">· {(g.status || '').replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- read mode ----------
function ReadRow({ label, value, italic }) {
  if (!value && value !== 0) return null;
  return (
    <div className="col gap-sm">
      <Label>{label}</Label>
      <div className={italic ? 'text-serif' : ''} style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.7, fontStyle: italic ? 'italic' : 'normal' }}>{value}</div>
    </div>
  );
}
function ReadCard({ title, children }) {
  const kids = (Array.isArray(children) ? children : [children])
    .filter(c => c && c.props && (c.props.value || c.props.value === 0));
  if (!kids.length) return null;
  return <div className="card col gap-md"><SectionHead>{title}</SectionHead>{children}</div>;
}

function ReadMode({ review, onEdit }) {
  const r = review;
  return (
    <div className="col gap-md">
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn--ghost" onClick={onEdit}><Icon name="edit" size={15} /> Edit</button>
      </div>
      <SnapshotPanel snap={r.snapshot && r.snapshot.capturedAt ? r.snapshot : null} live={false} />

      <ReadCard title="How this month felt">
        <ReadRow label="Mood" value={MOOD_LABELS[r.moodRating - 1]} />
        <ReadRow label="In a word" value={r.inAWord} />
        <ReadRow label="What drained you" value={r.drainedBy} />
        <ReadRow label="What gave you energy" value={r.energizedBy} />
      </ReadCard>
      <ReadCard title="What moved">
        <ReadRow label="Biggest win" value={r.biggestWin} />
        <ReadRow label="Most proud of" value={r.mostProud} />
        <ReadRow label="Consistent with" value={r.consistent} />
      </ReadCard>
      <ReadCard title="What didn't">
        <ReadRow label="Didn't happen" value={r.didntHappen} />
        <ReadRow label="What got in the way" value={r.gotInWay} />
        <ReadRow label="Do differently" value={r.differently} />
      </ReadCard>
      <ReadCard title="People & relationships">
        <ReadRow label="Who showed up for you" value={r.showedUp} />
        <ReadRow label="Who you showed up for" value={r.youShowedUp} />
        <ReadRow label="Invest more in" value={r.investMore} />
      </ReadCard>
      <ReadCard title="Body & wellness">
        <ReadRow label="How your body felt" value={r.bodyFeel} />
        <ReadRow label="Sleep" value={SLEEP_LABELS[r.sleepQuality - 1]} />
        <ReadRow label="Fitness on track" value={(TRACK_OPTS.find(o => o[0] === r.fitnessOnTrack) || [])[1]} />
        <ReadRow label="Hair regimen" value={(TRACK_OPTS.find(o => o[0] === r.hairConsistent) || [])[1]} />
      </ReadCard>
      <ReadCard title="Faith & inner life">
        <ReadRow label="Spiritually connected" value={r.spirituallyConnected} />
        <ReadRow label="A scripture or quote" value={r.scriptureQuote} italic />
        <ReadRow label="Grateful for" value={r.gratefulFor} />
      </ReadCard>
      <ReadCard title="Looking ahead">
        <ReadRow label="Intention for next month" value={r.nextMonthIntention} />
        <ReadRow label="Letting go of" value={r.letGoOf} />
        <ReadRow label="To protect" value={r.protect} />
      </ReadCard>
      <div className="card col gap-md">
        <SectionHead>Monthly score</SectionHead>
        <div className="row" style={{ gap: 10, alignItems: 'baseline' }}>
          <span className="text-serif" style={{ fontSize: 32, color: LILAC }}>{r.monthScore}</span>
          <span className="text-muted">/ 10</span>
        </div>
        <ReadRow label="What would make next month a 10" value={r.privateNote} />
      </div>
    </div>
  );
}

// ---------- edit form ----------
function EditForm({ draft, set, snap, onSave, onCancel }) {
  return (
    <div className="col gap-md">
      <div className="row row--between">
        <div className="text-muted fs-xs">Take your time. Nothing here is graded.</div>
        <div className="row gap-sm">
          <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn--pink" onClick={onSave}>Save reflection</button>
        </div>
      </div>

      <SnapshotPanel snap={snap} live={!(draft.snapshot && draft.snapshot.capturedAt)} />

      <div className="card col gap-md">
        <SectionHead>How this month felt</SectionHead>
        <Field label="Mood"><Slider value={draft.moodRating} onChange={v => set('moodRating', v)} labels={MOOD_LABELS} /></Field>
        <Field label="In a word or two, this month was…"><input style={INN} value={draft.inAWord} onChange={e => set('inAWord', e.target.value)} /></Field>
        <Field label="What drained you most"><textarea rows={2} style={TA} value={draft.drainedBy} onChange={e => set('drainedBy', e.target.value)} /></Field>
        <Field label="What gave you the most energy"><textarea rows={2} style={TA} value={draft.energizedBy} onChange={e => set('energizedBy', e.target.value)} /></Field>
      </div>

      <div className="card col gap-md">
        <SectionHead>What moved</SectionHead>
        <Field label="Biggest win this month"><input style={INN} value={draft.biggestWin} onChange={e => set('biggestWin', e.target.value)} /></Field>
        <Field label="What you're most proud of"><textarea rows={3} style={TA} value={draft.mostProud} onChange={e => set('mostProud', e.target.value)} /></Field>
        <Field label="A goal or habit you were consistent with"><input style={INN} value={draft.consistent} onChange={e => set('consistent', e.target.value)} /></Field>
      </div>

      <div className="card col gap-md">
        <SectionHead>What didn't</SectionHead>
        <Field label="What you intended to do that didn't happen"><textarea rows={3} style={TA} value={draft.didntHappen} onChange={e => set('didntHappen', e.target.value)} /></Field>
        <Field label="What got in the way"><textarea rows={3} style={TA} value={draft.gotInWay} onChange={e => set('gotInWay', e.target.value)} /></Field>
        <Field label="What you want to do differently"><textarea rows={3} style={TA} value={draft.differently} onChange={e => set('differently', e.target.value)} /></Field>
      </div>

      <div className="card col gap-md">
        <SectionHead>People & relationships</SectionHead>
        <Field label="Who showed up for you"><input style={INN} value={draft.showedUp} onChange={e => set('showedUp', e.target.value)} /></Field>
        <Field label="Who did you show up for"><input style={INN} value={draft.youShowedUp} onChange={e => set('youShowedUp', e.target.value)} /></Field>
        <Field label="A relationship to invest more in next month"><input style={INN} value={draft.investMore} onChange={e => set('investMore', e.target.value)} /></Field>
      </div>

      <div className="card col gap-md">
        <SectionHead>Body & wellness</SectionHead>
        <Field label="How did your body feel"><textarea rows={3} style={TA} value={draft.bodyFeel} onChange={e => set('bodyFeel', e.target.value)} /></Field>
        <Field label="Sleep quality"><Slider value={draft.sleepQuality} onChange={v => set('sleepQuality', v)} labels={SLEEP_LABELS} /></Field>
        <Field label="Fitness on track"><Toggle3 value={draft.fitnessOnTrack} onChange={v => set('fitnessOnTrack', v)} /></Field>
        <Field label="Hair regimen consistent"><Toggle3 value={draft.hairConsistent} onChange={v => set('hairConsistent', v)} /></Field>
      </div>

      <div className="card col gap-md">
        <SectionHead>Faith & inner life</SectionHead>
        <Field label="How connected did you feel spiritually"><textarea rows={3} style={TA} value={draft.spirituallyConnected} onChange={e => set('spirituallyConnected', e.target.value)} /></Field>
        <Field label="A scripture or quote that stayed with you"><input style={{ ...INN, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }} value={draft.scriptureQuote} onChange={e => set('scriptureQuote', e.target.value)} /></Field>
        <Field label="One thing you're grateful for that you almost forgot to count"><input style={INN} value={draft.gratefulFor} onChange={e => set('gratefulFor', e.target.value)} /></Field>
      </div>

      <div className="card col gap-md">
        <SectionHead>Looking ahead</SectionHead>
        <Field label="One intention for next month"><input style={INN} value={draft.nextMonthIntention} onChange={e => set('nextMonthIntention', e.target.value)} /></Field>
        <Field label="One thing to let go of"><input style={INN} value={draft.letGoOf} onChange={e => set('letGoOf', e.target.value)} /></Field>
        <Field label="One thing to protect"><input style={INN} value={draft.protect} onChange={e => set('protect', e.target.value)} /></Field>
      </div>

      <div className="card col gap-md">
        <SectionHead>Monthly score</SectionHead>
        <Field label="How would you rate this month?">
          <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => set('monthScore', n)} style={{
                width: 38, height: 38, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
                fontWeight: draft.monthScore === n ? 700 : 400,
                border: `1.5px solid ${draft.monthScore === n ? LILAC : 'var(--line)'}`,
                background: draft.monthScore === n ? `${LILAC}18` : 'transparent',
                color: draft.monthScore === n ? LILAC : 'var(--muted)',
              }}>{n}</button>
            ))}
          </div>
        </Field>
        <Field label="What would make next month a 10? (private note)"><textarea rows={3} style={TA} value={draft.privateNote} onChange={e => set('privateNote', e.target.value)} /></Field>
      </div>

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn--pink" onClick={onSave}>Save reflection</button>
      </div>
    </div>
  );
}

// ---------- archive ----------
function Archive({ reviews, onOpen }) {
  const sorted = Object.values(reviews).sort((a, b) => a.month.localeCompare(b.month));
  const chartData = sorted.map(r => ({ month: monthLabel(r.month).split(' ')[0].slice(0, 3), score: r.monthScore }));
  return (
    <div className="col gap-md">
      {sorted.length >= 2 && (
        <div className="card">
          <SectionHead>Score over time</SectionHead>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)' }} />
              <Line type="monotone" dataKey="score" stroke={LILAC} strokeWidth={1.5} dot={{ r: 2.5, fill: LILAC }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {sorted.length === 0 ? (
        <div className="empty">No reflections yet. They'll gather here as the months pass.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {sorted.slice().reverse().map(r => (
            <button key={r.month} onClick={() => onOpen(r.month)} className="card col gap-sm" style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--line)' }}>
              <div className="row row--between">
                <span className="text-serif" style={{ fontSize: 15 }}>{monthLabel(r.month)}</span>
                <span style={{ fontSize: 18 }}>{MOOD_EMOJI[(r.moodRating || 3) - 1]}</span>
              </div>
              <div className="text-mono fs-xs" style={{ color: LILAC }}>{r.monthScore}/10</div>
              {r.biggestWin && <div className="fs-xs text-muted" style={{ lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{r.biggestWin}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- main ----------
export default function MonthlyReviewView({ state, setState }) {
  const reviews = state.monthlyReviews || {};
  const [ym, setYm] = useState(currentYM());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [showArchive, setShowArchive] = useState(false);

  const review = reviews[ym];
  const snap = useMemo(() => liveSnapshot(state, ym), [state, ym]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const startReflection = () => { setDraft(blankReview(ym)); setEditing(true); };
  const startEdit = () => { setDraft({ ...review }); setEditing(true); };

  const save = () => {
    const captured = (draft.snapshot && draft.snapshot.capturedAt) ? draft.snapshot : liveSnapshot(state, ym);
    const toSave = { ...draft, month: ym, snapshot: captured };
    setState(s => ({ ...s, monthlyReviews: { ...(s.monthlyReviews || {}), [ym]: toSave } }));
    setEditing(false);
    setDraft(null);
  };

  const navMonth = (delta) => { setYm(m => shiftMonth(m, delta)); setEditing(false); setDraft(null); };
  const openMonth = (m) => { setYm(m); setShowArchive(false); setEditing(false); setDraft(null); };

  return (
    <div className="col gap-md" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Reflection</div>
          <h1 className="page-head__title">Monthly Review</h1>
        </div>
        <button className="btn btn--ghost" onClick={() => setShowArchive(a => !a)}>
          <Icon name={showArchive ? 'arrow-l' : 'book'} size={15} /> {showArchive ? 'Back' : 'Archive'}
        </button>
      </div>

      {showArchive ? (
        <Archive reviews={reviews} onOpen={openMonth} />
      ) : (
        <>
          <div className="row row--between" style={{ alignItems: 'center' }}>
            <button className="btn btn--ghost" onClick={() => navMonth(-1)} aria-label="Previous month"><Icon name="arrow-l" size={16} /></button>
            <div className="text-serif" style={{ fontSize: 22, color: 'var(--ink)' }}>{monthLabel(ym)}</div>
            <button className="btn btn--ghost" onClick={() => navMonth(1)} aria-label="Next month"><Icon name="arrow-r" size={16} /></button>
          </div>

          {editing ? (
            <EditForm draft={draft} set={set} snap={(draft.snapshot && draft.snapshot.capturedAt) ? draft.snapshot : snap} onSave={save} onCancel={() => { setEditing(false); setDraft(null); }} />
          ) : review ? (
            <ReadMode review={review} onEdit={startEdit} />
          ) : (
            <div className="card col gap-md" style={{ alignItems: 'center', textAlign: 'center', padding: '48px 24px' }}>
              <Icon name="spark" size={28} stroke={1.2} />
              <div className="text-serif" style={{ fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                A quiet moment to look back on {monthLabel(ym)}.
              </div>
              <button className="btn btn--pink" onClick={startReflection}>Start your {monthLabel(ym).split(' ')[0]} reflection →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
