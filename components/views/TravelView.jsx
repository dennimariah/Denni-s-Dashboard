'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { CardHead, burstConfetti } from '@/components/ui/primitives';

const INN = { fontSize: 13, padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--card)', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };

const ACCENT = '#c2703a';
const ACCENT_SOFT = '#fdf5ee';

const SUBTABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past Trips' },
  { id: 'packing', label: 'Packing' },
  { id: 'documents', label: 'Documents' },
];

const TRIP_SECTIONS = ['Overview', 'Itinerary', 'Budget', 'Packing', 'Visa', 'Content', 'Memories'];
const STATUSES = ['Planning', 'Confirmed', 'In Progress', 'Complete'];
const PURPOSES = ['Leisure', 'Business', 'Both'];
const BUDGET_KEYS = ['flights', 'accommodation', 'food', 'activities', 'shopping', 'misc'];
const BUDGET_LABELS = { flights: 'Flights', accommodation: 'Accommodation', food: 'Food', activities: 'Activities', shopping: 'Shopping', misc: 'Misc' };
const PACK_CATS = ['Clothing', 'Toiletries', 'Hair', 'Documents', 'Tech', 'Misc'];
const VISA_CHECKS = [
  { key: 'passport', label: 'Passport (valid 6+ months past return)' },
  { key: 'visa', label: 'Visa (if required)' },
  { key: 'insurance', label: 'Travel insurance' },
  { key: 'flights', label: 'Flight confirmation' },
  { key: 'hotel', label: 'Hotel confirmation' },
  { key: 'emergency', label: 'Emergency contacts saved offline' },
  { key: 'sim', label: 'Local SIM or data plan' },
  { key: 'vaccinations', label: 'Vaccination records (if required)' },
];

const STATUS_COLORS = { Planning: 'var(--muted)', Confirmed: '#5b8df5', 'In Progress': '#f5a623', Complete: '#88b896' };

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function daysAway(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

function monthsUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return null;
  return (d - new Date()) / (86400000 * 30.44);
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function StatusPill({ status }) {
  const color = STATUS_COLORS[status] || 'var(--muted)';
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: color + '22', color, fontFamily: 'var(--font-mono)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

function PillNav({ items, active, onPick, accent = ACCENT }) {
  return (
    <div className="row" style={{ gap: 6, overflowX: 'auto', paddingBottom: 4, flexWrap: 'nowrap' }}>
      {items.map((it) => {
        const id = it.id || it;
        const label = it.label || it;
        const on = active === id;
        return (
          <button key={id} onClick={() => onPick(id)} style={{
            fontSize: 12.5, fontWeight: on ? 600 : 500, padding: '6px 14px', borderRadius: 999,
            border: `1px solid ${on ? accent : 'var(--line)'}`, background: on ? accent + '18' : 'var(--card)',
            color: on ? accent : 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.12s',
          }}>{label}</button>
        );
      })}
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(58,29,40,0.42)', zIndex: 60, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: wide ? 640 : 460, boxShadow: 'var(--shadow-lg)' }} onClick={(e) => e.stopPropagation()}>
        <div className="row row--between" style={{ marginBottom: 16 }}>
          <h3 className="text-serif" style={{ fontSize: 20, margin: 0 }}>{title}</h3>
          <button className="btn btn--icon btn--ghost" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="col gap-sm" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span className="fs-xs text-mono text-muted" style={{ letterSpacing: '0.04em' }}>{label}</span>
      {children}
    </label>
  );
}

// ── Trip planner sections ──────────────────────────────────────────────────

function OverviewSection({ trip, update }) {
  const actual = BUDGET_KEYS.reduce((sum, k) => sum + (Number(trip.budgetActual?.[k]) || 0), 0);
  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 12 }}>
      <Field label="Purpose">
        <select style={INN} value={trip.purpose || 'Leisure'} onChange={(e) => update({ purpose: e.target.value })}>
          {PURPOSES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Travel companions">
        <input style={INN} value={trip.companions || ''} onChange={(e) => update({ companions: e.target.value })} placeholder="Who's coming along?" />
      </Field>
      <Field label="Accommodation">
        <input style={INN} value={trip.accommodation || ''} onChange={(e) => update({ accommodation: e.target.value })} placeholder="Hotel, Airbnb, etc." />
      </Field>
      <Field label="Total budget">
        <input style={INN} type="number" value={trip.budget || ''} onChange={(e) => update({ budget: e.target.value })} placeholder="0" />
      </Field>
      <Field label="Currency note">
        <input style={INN} value={trip.currencyNote || ''} onChange={(e) => update({ currencyNote: e.target.value })} placeholder="e.g. 1 USD ≈ 150 JPY" />
      </Field>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
        Actual spend so far: <strong style={{ color: ACCENT, fontFamily: 'var(--font-mono)' }}>${actual.toLocaleString()}</strong>
        {trip.budget ? <span className="text-muted"> of ${Number(trip.budget).toLocaleString()}</span> : null}
      </div>
    </div>
  );
}

function ItinerarySection({ trip, update }) {
  const itinerary = trip.itinerary || [];
  const addDay = () => update({ itinerary: [...itinerary, { id: uid(), date: '', title: '', notes: '' }] });
  const setDay = (id, patch) => update({ itinerary: itinerary.map((d) => d.id === id ? { ...d, ...patch } : d) });
  const delDay = (id) => update({ itinerary: itinerary.filter((d) => d.id !== id) });
  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 12 }}>
      <button className="btn btn--ghost" onClick={addDay} style={{ alignSelf: 'flex-start' }}><Icon name="plus" size={14} /> Add day</button>
      {itinerary.length === 0 && <div className="empty fs-xs text-muted">No days planned yet.</div>}
      {itinerary.map((d) => (
        <div key={d.id} className="col gap-sm" style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 12, background: 'var(--card-2)', display: 'grid', gap: 8 }}>
          <div className="row" style={{ gap: 8 }}>
            <input style={{ ...INN, width: 150 }} type="date" value={d.date || ''} onChange={(e) => setDay(d.id, { date: e.target.value })} />
            <input style={INN} value={d.title || ''} onChange={(e) => setDay(d.id, { title: e.target.value })} placeholder="Day title" />
            <button className="btn btn--icon btn--ghost" onClick={() => delDay(d.id)}><Icon name="trash" size={15} /></button>
          </div>
          <textarea style={{ ...INN, minHeight: 56, resize: 'vertical' }} value={d.notes || ''} onChange={(e) => setDay(d.id, { notes: e.target.value })} placeholder="Plans, reservations, notes..." />
        </div>
      ))}
    </div>
  );
}

function BudgetSection({ trip, update }) {
  const est = trip.budgetBreakdown || {};
  const act = trip.budgetActual || {};
  const setEst = (k, v) => update({ budgetBreakdown: { ...est, [k]: v } });
  const setAct = (k, v) => update({ budgetActual: { ...act, [k]: v } });
  const totalEst = BUDGET_KEYS.reduce((s, k) => s + (Number(est[k]) || 0), 0);
  const totalAct = BUDGET_KEYS.reduce((s, k) => s + (Number(act[k]) || 0), 0);
  const th = { textAlign: 'left', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontWeight: 600, padding: '4px 6px', letterSpacing: '0.03em' };
  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 10 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th style={th}>Category</th><th style={{ ...th, textAlign: 'right' }}>Estimated</th><th style={{ ...th, textAlign: 'right' }}>Actual</th></tr></thead>
        <tbody>
          {BUDGET_KEYS.map((k) => (
            <tr key={k} style={{ borderTop: '1px solid var(--line)' }}>
              <td style={{ fontSize: 13, padding: '6px 6px', color: 'var(--ink)' }}>{BUDGET_LABELS[k]}</td>
              <td style={{ padding: '6px 6px', width: 110 }}><input style={{ ...INN, textAlign: 'right' }} type="number" value={est[k] ?? ''} onChange={(e) => setEst(k, e.target.value)} placeholder="0" /></td>
              <td style={{ padding: '6px 6px', width: 110 }}><input style={{ ...INN, textAlign: 'right' }} type="number" value={act[k] ?? ''} onChange={(e) => setAct(k, e.target.value)} placeholder="0" /></td>
            </tr>
          ))}
          <tr style={{ borderTop: '2px solid var(--line)', fontWeight: 700 }}>
            <td style={{ fontSize: 13, padding: '8px 6px', color: ACCENT, fontFamily: 'var(--font-serif)' }}>Totals</td>
            <td style={{ padding: '8px 6px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>${totalEst.toLocaleString()}</td>
            <td style={{ padding: '8px 6px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: ACCENT }}>${totalAct.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      {trip.currencyNote && <div className="fs-xs text-muted text-mono">{trip.currencyNote}</div>}
    </div>
  );
}

function PackingSection({ trip, update, templates }) {
  const items = trip.packingItems || {};
  const setCat = (cat, list) => update({ packingItems: { ...items, [cat]: list } });
  const addItem = (cat, text) => {
    if (!text.trim()) return;
    setCat(cat, [...(items[cat] || []), { id: uid(), text: text.trim(), checked: false }]);
  };
  const toggle = (cat, id) => setCat(cat, (items[cat] || []).map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  const delItem = (cat, id) => setCat(cat, (items[cat] || []).filter((i) => i.id !== id));
  const resetAll = () => {
    const next = {};
    Object.keys(items).forEach((cat) => { next[cat] = (items[cat] || []).map((i) => ({ ...i, checked: false })); });
    update({ packingItems: next });
  };
  const loadTemplate = (tid) => {
    const tpl = templates.find((t) => t.id === tid);
    if (!tpl) return;
    const next = { ...items };
    PACK_CATS.forEach((cat) => {
      const tplItems = (tpl.categories?.[cat] || []).map((text) => ({ id: uid(), text, checked: false }));
      next[cat] = [...(next[cat] || []), ...tplItems];
    });
    update({ packingItems: next });
  };
  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 12 }}>
      <div className="row row--between" style={{ flexWrap: 'wrap', gap: 8 }}>
        <select style={{ ...INN, width: 'auto' }} value="" onChange={(e) => { loadTemplate(e.target.value); e.target.value = ''; }}>
          <option value="">Load template…</option>
          {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button className="btn btn--ghost" onClick={resetAll}>Reset all checks</button>
      </div>
      {PACK_CATS.map((cat) => (
        <PackCategory key={cat} cat={cat} list={items[cat] || []} onAdd={addItem} onToggle={toggle} onDel={delItem} />
      ))}
    </div>
  );
}

function PackCategory({ cat, list, onAdd, onToggle, onDel }) {
  const [text, setText] = useState('');
  const done = list.filter((i) => i.checked).length;
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 12, background: 'var(--card-2)' }}>
      <div className="row row--between" style={{ marginBottom: 8 }}>
        <strong style={{ fontSize: 13, color: 'var(--ink)' }}>{cat}</strong>
        <span className="fs-xs text-mono text-muted">{done}/{list.length}</span>
      </div>
      <div className="col gap-sm" style={{ display: 'grid', gap: 4 }}>
        {list.map((i) => (
          <div key={i.id} className="row" style={{ gap: 8, alignItems: 'center' }}>
            <button onClick={() => onToggle(cat, i.id)} style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${i.checked ? ACCENT : 'var(--line)'}`, background: i.checked ? ACCENT : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
              {i.checked && <Icon name="check" size={12} />}
            </button>
            <span style={{ fontSize: 13, flex: 1, color: i.checked ? 'var(--muted)' : 'var(--ink)', textDecoration: i.checked ? 'line-through' : 'none' }}>{i.text}</span>
            <button className="btn btn--icon btn--ghost" onClick={() => onDel(cat, i.id)}><Icon name="x" size={13} /></button>
          </div>
        ))}
      </div>
      <form className="row" style={{ gap: 6, marginTop: 8 }} onSubmit={(e) => { e.preventDefault(); onAdd(cat, text); setText(''); }}>
        <input style={INN} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Add to ${cat}…`} />
        <button type="submit" className="btn btn--icon btn--ghost"><Icon name="plus" size={15} /></button>
      </form>
    </div>
  );
}

function VisaSection({ trip, update }) {
  const checks = trip.visaChecks || {};
  const toggle = (key) => update({ visaChecks: { ...checks, [key]: !checks[key] } });
  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 10 }}>
      <div className="col gap-sm" style={{ display: 'grid', gap: 4 }}>
        {VISA_CHECKS.map(({ key, label }) => (
          <div key={key} className="row" style={{ gap: 9, alignItems: 'center' }}>
            <button onClick={() => toggle(key)} style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${checks[key] ? ACCENT : 'var(--line)'}`, background: checks[key] ? ACCENT : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
              {checks[key] && <Icon name="check" size={12} />}
            </button>
            <span style={{ fontSize: 13, color: checks[key] ? 'var(--muted)' : 'var(--ink)' }}>{label}</span>
          </div>
        ))}
      </div>
      <Field label="Visa details / notes">
        <textarea style={{ ...INN, minHeight: 70, resize: 'vertical' }} value={trip.visaDetails || ''} onChange={(e) => update({ visaDetails: e.target.value })} placeholder="Visa requirements, appointment dates, document numbers…" />
      </Field>
    </div>
  );
}

function ContentSection({ trip, update }) {
  const plan = trip.contentPlan || {};
  const setPlan = (patch) => update({ contentPlan: { ...plan, ...patch } });
  const mode = plan.mode || 'realtime';
  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 12 }}>
      <Field label="Content goals">
        <textarea style={{ ...INN, minHeight: 60, resize: 'vertical' }} value={plan.goals || ''} onChange={(e) => setPlan({ goals: e.target.value })} placeholder="What story do you want to tell?" />
      </Field>
      <Field label="Planned shots / videos">
        <textarea style={{ ...INN, minHeight: 60, resize: 'vertical' }} value={plan.shots || ''} onChange={(e) => setPlan({ shots: e.target.value })} placeholder="Shot list…" />
      </Field>
      <Field label="Hashtags">
        <input style={INN} value={plan.hashtags || ''} onChange={(e) => setPlan({ hashtags: e.target.value })} placeholder="#travel #wanderlust" />
      </Field>
      <Field label="Posting style">
        <div className="row" style={{ gap: 14 }}>
          {[['realtime', 'Post in real time'], ['recap', 'Recap after']].map(([val, lbl]) => (
            <label key={val} className="row" style={{ gap: 6, alignItems: 'center', cursor: 'pointer', fontSize: 13, color: 'var(--ink)' }}>
              <input type="radio" name={`postmode-${trip.id}`} checked={mode === val} onChange={() => setPlan({ mode: val })} style={{ accentColor: ACCENT }} />
              {lbl}
            </label>
          ))}
        </div>
      </Field>
    </div>
  );
}

function MemoriesSection({ trip, update }) {
  if (trip.status !== 'Complete') {
    return <div className="empty fs-xs text-muted">Memories unlock once the trip is marked Complete.</div>;
  }
  const m = trip.memories;
  if (!m) {
    const init = (e) => {
      update({ memories: { favoriteMoment: '', bestMeal: '', wouldGoBack: '', rating: 0, notes: '', carouselPosted: false, carouselLink: '' } });
      burstConfetti(e.clientX, e.clientY);
    };
    return (
      <div className="empty col gap-md" style={{ display: 'grid', gap: 12, placeItems: 'center', padding: 20 }}>
        <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Trip complete! Add your memories.</div>
        <button className="btn btn--pink" onClick={init}><Icon name="star" size={14} /> Add memories</button>
      </div>
    );
  }
  const setM = (patch) => update({ memories: { ...m, ...patch } });
  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 12 }}>
      <Field label="Favorite moment">
        <input style={INN} value={m.favoriteMoment} onChange={(e) => setM({ favoriteMoment: e.target.value })} placeholder="The best part…" />
      </Field>
      <Field label="Best meal">
        <input style={INN} value={m.bestMeal} onChange={(e) => setM({ bestMeal: e.target.value })} placeholder="What you'd order again" />
      </Field>
      <Field label="Would go back?">
        <div className="row" style={{ gap: 8 }}>
          {['Yes', 'No', 'Maybe'].map((opt) => {
            const on = m.wouldGoBack === opt;
            return <button key={opt} onClick={() => setM({ wouldGoBack: opt })} style={{ fontSize: 12.5, padding: '6px 14px', borderRadius: 999, border: `1px solid ${on ? ACCENT : 'var(--line)'}`, background: on ? ACCENT + '18' : 'var(--card)', color: on ? ACCENT : 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'inherit' }}>{opt}</button>;
          })}
        </div>
      </Field>
      <Field label="Rating">
        <div className="row" style={{ gap: 4 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setM({ rating: n })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: n <= (m.rating || 0) ? '#f5a623' : 'var(--line)', padding: 0, display: 'flex' }} title={`${n} star`}>
              <Icon name="star" size={22} />
            </button>
          ))}
        </div>
      </Field>
      <Field label="Notes / reflection">
        <textarea style={{ ...INN, minHeight: 70, resize: 'vertical' }} value={m.notes} onChange={(e) => setM({ notes: e.target.value })} placeholder="Reflections from the trip…" />
      </Field>
      <label className="row" style={{ gap: 8, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
        <button onClick={() => setM({ carouselPosted: !m.carouselPosted })} style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${m.carouselPosted ? ACCENT : 'var(--line)'}`, background: m.carouselPosted ? ACCENT : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          {m.carouselPosted && <Icon name="check" size={12} />}
        </button>
        Carousel posted
      </label>
      <Field label="Carousel link">
        <input style={INN} value={m.carouselLink} onChange={(e) => setM({ carouselLink: e.target.value })} placeholder="https://…" />
      </Field>
    </div>
  );
}

function TripCard({ trip, update, remove, templates, defaultOpen, defaultSection }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [section, setSection] = useState(defaultSection || 'Overview');
  const days = daysAway(trip.departure);
  return (
    <div className="card" style={{ borderLeft: `3px solid ${ACCENT}` }}>
      <div className="row row--between" style={{ cursor: 'pointer', alignItems: 'flex-start' }} onClick={() => setOpen((o) => !o)}>
        <div style={{ minWidth: 0 }}>
          <div className="text-serif" style={{ fontSize: 24, fontStyle: 'italic', lineHeight: 1.15, color: 'var(--ink)' }}>{trip.destination || 'Untitled trip'}</div>
          <div className="fs-xs text-mono text-muted" style={{ marginTop: 2 }}>{trip.country || '—'}</div>
          <div className="fs-xs text-muted text-mono" style={{ marginTop: 4 }}>{fmtDate(trip.departure)} → {fmtDate(trip.return)}</div>
        </div>
        <div className="col gap-sm" style={{ alignItems: 'flex-end', gap: 8, textAlign: 'right' }}>
          <StatusPill status={trip.status} />
          {trip.status !== 'Complete' && days != null && (
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: ACCENT, fontFamily: 'var(--font-mono)' }}>{days >= 0 ? days : 0}</span>
              <span className="fs-xs text-muted"> {days >= 0 ? 'days away' : 'in progress'}</span>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="col gap-md" style={{ display: 'grid', gap: 14, marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
          <div className="row row--between" style={{ flexWrap: 'wrap', gap: 8 }}>
            <select style={{ ...INN, width: 'auto' }} value={trip.status} onChange={(e) => update(trip.id, { status: e.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn--ghost" onClick={() => remove(trip.id)}><Icon name="trash" size={14} /> Delete trip</button>
          </div>
          <PillNav items={TRIP_SECTIONS} active={section} onPick={setSection} />
          <div style={{ background: ACCENT_SOFT, borderRadius: 12, padding: 14 }}>
            {section === 'Overview' && <OverviewSection trip={trip} update={(p) => update(trip.id, p)} />}
            {section === 'Itinerary' && <ItinerarySection trip={trip} update={(p) => update(trip.id, p)} />}
            {section === 'Budget' && <BudgetSection trip={trip} update={(p) => update(trip.id, p)} />}
            {section === 'Packing' && <PackingSection trip={trip} update={(p) => update(trip.id, p)} templates={templates} />}
            {section === 'Visa' && <VisaSection trip={trip} update={(p) => update(trip.id, p)} />}
            {section === 'Content' && <ContentSection trip={trip} update={(p) => update(trip.id, p)} />}
            {section === 'Memories' && <MemoriesSection trip={trip} update={(p) => update(trip.id, p)} />}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-tab views ───────────────────────────────────────────────────────────

function UpcomingTab({ trips, update, remove, templates, onAddTrip }) {
  const [adding, setAdding] = useState(false);
  const blankDraft = { destination: '', country: '', departure: '', return: '', status: 'Planning', purpose: 'Leisure' };
  const [draft, setDraft] = useState(blankDraft);
  const upcoming = trips.filter((t) => t.status !== 'Complete')
    .sort((a, b) => (a.departure || '').localeCompare(b.departure || ''));

  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 14 }}>
      <div className="row row--between">
        <span className="fs-xs text-muted text-mono">{upcoming.length} trip{upcoming.length === 1 ? '' : 's'} planned</span>
        <button className="btn btn--pink" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> New trip</button>
      </div>
      {upcoming.length === 0 && <div className="empty fs-xs text-muted">No upcoming adventures yet. Time to plan one!</div>}
      {upcoming.map((t) => <TripCard key={t.id} trip={t} update={update} remove={remove} templates={templates} />)}

      {adding && (
        <Modal title="New trip" onClose={() => setAdding(false)}>
          <div className="col gap-md" style={{ display: 'grid', gap: 12 }}>
            <Field label="Destination"><input style={INN} autoFocus value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} placeholder="Tokyo" /></Field>
            <Field label="Country"><input style={INN} value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} placeholder="Japan" /></Field>
            <div className="row" style={{ gap: 10 }}>
              <Field label="Departure"><input style={INN} type="date" value={draft.departure} onChange={(e) => setDraft({ ...draft, departure: e.target.value })} /></Field>
              <Field label="Return"><input style={INN} type="date" value={draft.return} onChange={(e) => setDraft({ ...draft, return: e.target.value })} /></Field>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <Field label="Status"><select style={INN} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Purpose"><select style={INN} value={draft.purpose} onChange={(e) => setDraft({ ...draft, purpose: e.target.value })}>{PURPOSES.map((p) => <option key={p}>{p}</option>)}</select></Field>
            </div>
            <button className="btn btn--pink" onClick={() => { if (!draft.destination.trim()) return; onAddTrip(draft); setAdding(false); setDraft(blankDraft); }} style={{ marginTop: 4 }}>Create trip</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PastTab({ trips, update, remove, templates }) {
  const past = trips.filter((t) => t.status === 'Complete')
    .sort((a, b) => (b.departure || '').localeCompare(a.departure || ''));
  const [openId, setOpenId] = useState(null);
  const countries = new Set(past.map((t) => (t.country || '').trim()).filter(Boolean));

  if (past.length === 0) return <div className="empty fs-xs text-muted">Your completed trips will appear here.</div>;

  const expanded = past.find((t) => t.id === openId);

  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 14 }}>
      <div className="row" style={{ gap: 12 }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '14px 10px' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: ACCENT, fontFamily: 'var(--font-mono)' }}>{countries.size}</div>
          <div className="fs-xs text-muted text-mono">countries</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '14px 10px' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: ACCENT, fontFamily: 'var(--font-mono)' }}>{past.length}</div>
          <div className="fs-xs text-muted text-mono">trips taken</div>
        </div>
      </div>

      {expanded ? (
        <div className="col gap-md" style={{ display: 'grid', gap: 10 }}>
          <button className="btn btn--ghost" onClick={() => setOpenId(null)} style={{ alignSelf: 'flex-start' }}><Icon name="arrow-l" size={14} /> Back to trips</button>
          <TripCard key={expanded.id} trip={expanded} update={update} remove={remove} templates={templates} defaultOpen defaultSection="Memories" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {past.map((t) => {
            const rating = t.memories?.rating || 0;
            return (
              <div key={t.id} className="card" style={{ borderLeft: `3px solid ${ACCENT}` }}>
                <div className="text-serif" style={{ fontSize: 20, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.15 }}>{t.destination}</div>
                <div className="fs-xs text-muted text-mono" style={{ marginTop: 3 }}>{fmtDate(t.departure)} → {fmtDate(t.return)}</div>
                <div className="row" style={{ gap: 2, marginTop: 8 }}>
                  {[1, 2, 3, 4, 5].map((n) => <span key={n} style={{ color: n <= rating ? '#f5a623' : 'var(--line)', display: 'flex' }}><Icon name="star" size={15} /></span>)}
                </div>
                <button className="btn btn--ghost" onClick={() => setOpenId(t.id)} style={{ marginTop: 10 }}>View</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PackingTab({ templates, setTemplates }) {
  const [editing, setEditing] = useState(null); // template id
  const [adding, setAdding] = useState(false);
  const blank = () => ({ id: uid(), name: '', description: '', categories: PACK_CATS.reduce((o, c) => (o[c] = [], o), {}) });
  const [draft, setDraft] = useState(blank());

  const editTpl = editing ? templates.find((t) => t.id === editing) : null;

  const saveDraft = () => {
    if (!draft.name.trim()) return;
    setTemplates([...templates, draft]);
    setAdding(false); setDraft(blank());
  };
  const updateTpl = (id, patch) => setTemplates(templates.map((t) => t.id === id ? { ...t, ...patch } : t));
  const delTpl = (id) => setTemplates(templates.filter((t) => t.id !== id));

  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 14 }}>
      <div className="row row--between">
        <span className="fs-xs text-muted text-mono">{templates.length} template{templates.length === 1 ? '' : 's'}</span>
        <button className="btn btn--pink" onClick={() => { setDraft(blank()); setAdding(true); }}><Icon name="plus" size={14} /> New template</button>
      </div>
      {templates.length === 0 && <div className="empty fs-xs text-muted">No packing templates yet. Create a reusable one!</div>}
      {templates.map((t) => {
        const total = PACK_CATS.reduce((s, c) => s + (t.categories?.[c]?.length || 0), 0);
        return (
          <div key={t.id} className="card">
            <div className="row row--between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="text-serif" style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--ink)' }}>{t.name}</div>
                {t.description && <div className="fs-xs text-muted" style={{ marginTop: 2 }}>{t.description}</div>}
              </div>
              <div className="row" style={{ gap: 4 }}>
                <button className="btn btn--icon btn--ghost" onClick={() => setEditing(t.id)}><Icon name="edit" size={15} /></button>
                <button className="btn btn--icon btn--ghost" onClick={() => delTpl(t.id)}><Icon name="trash" size={15} /></button>
              </div>
            </div>
            <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {PACK_CATS.filter((c) => (t.categories?.[c]?.length || 0) > 0).map((c) => (
                <span key={c} className="fs-xs text-mono" style={{ padding: '3px 9px', borderRadius: 999, background: ACCENT_SOFT, color: ACCENT }}>{c} · {t.categories[c].length}</span>
              ))}
              {total === 0 && <span className="fs-xs text-muted">No items yet</span>}
            </div>
          </div>
        );
      })}

      {adding && (
        <Modal title="New packing template" onClose={() => setAdding(false)} wide>
          <TemplateForm tpl={draft} onChange={setDraft} />
          <button className="btn btn--pink" onClick={saveDraft} style={{ marginTop: 14 }}>Create template</button>
        </Modal>
      )}
      {editTpl && (
        <Modal title={`Edit · ${editTpl.name}`} onClose={() => setEditing(null)} wide>
          <TemplateForm tpl={editTpl} onChange={(patch) => updateTpl(editTpl.id, patch)} />
          <button className="btn btn--pink" onClick={() => setEditing(null)} style={{ marginTop: 14 }}>Done</button>
        </Modal>
      )}
    </div>
  );
}

function TemplateForm({ tpl, onChange }) {
  const cats = tpl.categories || {};
  const setCatText = (cat, text) => onChange({ ...tpl, categories: { ...cats, [cat]: text.split('\n').map((l) => l.trim()).filter(Boolean) } });
  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 12 }}>
      <Field label="Name"><input style={INN} autoFocus value={tpl.name} onChange={(e) => onChange({ ...tpl, name: e.target.value })} placeholder="Beach week" /></Field>
      <Field label="Description"><input style={INN} value={tpl.description} onChange={(e) => onChange({ ...tpl, description: e.target.value })} placeholder="Warm climate essentials" /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 10 }}>
        {PACK_CATS.map((cat) => (
          <Field key={cat} label={cat}>
            <textarea style={{ ...INN, minHeight: 64, resize: 'vertical' }} value={(cats[cat] || []).join('\n')} onChange={(e) => setCatText(cat, e.target.value)} placeholder="One item per line" />
          </Field>
        ))}
      </div>
    </div>
  );
}

function DocumentsTab({ docs, setDocs }) {
  const set = (key, val) => setDocs({ ...docs, [key]: val });
  const passportMonths = monthsUntil(docs.passportExpiration);
  const warn = passportMonths != null && passportMonths < 12;
  return (
    <div className="card col gap-md" style={{ display: 'grid', gap: 14 }}>
      <CardHead title="Travel documents" sub="Your evergreen travel info, always handy." />
      <Field label="Passport expiration">
        <input style={{ ...INN, ...(warn ? { borderColor: '#f5a623' } : {}) }} type="date" value={docs.passportExpiration || ''} onChange={(e) => set('passportExpiration', e.target.value)} />
        {warn && <span style={{ fontSize: 11.5, color: '#b87410', marginTop: 4 }}>⚠ Passport expires in under 12 months ({fmtDate(docs.passportExpiration)}). Many countries require 6+ months validity.</span>}
      </Field>
      <Field label="Known Traveler Number / TSA PreCheck"><input style={INN} value={docs.knownTraveler || ''} onChange={(e) => set('knownTraveler', e.target.value)} placeholder="KTN" /></Field>
      <Field label="Frequent flyer numbers"><textarea style={{ ...INN, minHeight: 60, resize: 'vertical' }} value={docs.frequentFlyer || ''} onChange={(e) => set('frequentFlyer', e.target.value)} placeholder="Airline — number" /></Field>
      <div className="row" style={{ gap: 10 }}>
        <Field label="Insurance provider"><input style={INN} value={docs.insuranceProvider || ''} onChange={(e) => set('insuranceProvider', e.target.value)} /></Field>
        <Field label="Policy number"><input style={INN} value={docs.insurancePolicy || ''} onChange={(e) => set('insurancePolicy', e.target.value)} /></Field>
      </div>
      <Field label="Emergency contacts"><textarea style={{ ...INN, minHeight: 60, resize: 'vertical' }} value={docs.emergencyContacts || ''} onChange={(e) => set('emergencyContacts', e.target.value)} placeholder="Name — relationship — phone" /></Field>
      <Field label="Preferred airlines / hotels"><textarea style={{ ...INN, minHeight: 60, resize: 'vertical' }} value={docs.preferences || ''} onChange={(e) => set('preferences', e.target.value)} /></Field>
      <Field label="General notes"><textarea style={{ ...INN, minHeight: 60, resize: 'vertical' }} value={docs.generalNotes || ''} onChange={(e) => set('generalNotes', e.target.value)} /></Field>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function TravelView({ state, setState }) {
  const [tab, setTab] = useState('upcoming');
  const trips = state.travelTrips || [];
  const templates = state.travelPackingTemplates || [];
  const docs = state.travelDocuments || {};
  const currentYear = new Date().getFullYear();

  const updateTrip = (id, patch) => setState((s) => ({ ...s, travelTrips: (s.travelTrips || []).map((t) => t.id === id ? { ...t, ...patch } : t) }));
  const removeTrip = (id) => setState((s) => ({ ...s, travelTrips: (s.travelTrips || []).filter((t) => t.id !== id) }));
  const addTrip = (draft) => {
    const trip = {
      id: uid(), ...draft, companions: '', accommodation: '', budget: '',
      itinerary: [], budgetBreakdown: {}, budgetActual: {}, packingItems: {},
      visaChecks: { passport: false, visa: false, insurance: false, flights: false, hotel: false, emergency: false, sim: false, vaccinations: false },
      visaDetails: '', contentPlan: {}, currencyNote: '', memories: null,
    };
    setState((s) => ({ ...s, travelTrips: [...(s.travelTrips || []), trip] }));
  };
  const setTemplates = (next) => setState((s) => ({ ...s, travelPackingTemplates: next }));
  const setDocs = (next) => setState((s) => ({ ...s, travelDocuments: next }));

  return (
    <div className="col gap-md" style={{ display: 'grid', gap: 18 }}>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Adventure · {currentYear}</div>
          <h1 className="page-head__title">Travel Hub</h1>
        </div>
      </div>

      <PillNav items={SUBTABS} active={tab} onPick={setTab} />

      {tab === 'upcoming' && <UpcomingTab trips={trips} update={updateTrip} remove={removeTrip} templates={templates} onAddTrip={addTrip} />}
      {tab === 'past' && <PastTab trips={trips} update={updateTrip} remove={removeTrip} templates={templates} />}
      {tab === 'packing' && <PackingTab templates={templates} setTemplates={setTemplates} />}
      {tab === 'documents' && <DocumentsTab docs={docs} setDocs={setDocs} />}
    </div>
  );
}
