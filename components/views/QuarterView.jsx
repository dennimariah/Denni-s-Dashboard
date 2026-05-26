'use client';

import { cls, pct } from '@/lib/helpers';
import { CardHead, Bar, Editable, burstConfetti } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

const catColor = {
  Health:   { bg: 'var(--primary-soft)',  text: 'var(--primary-deep)', accent: 'var(--primary)' },
  Finance:  { bg: 'var(--accent-2-soft)', text: '#3d6b4f',             accent: 'var(--accent-2)' },
  Business: { bg: 'var(--accent-3-soft)', text: '#5e4b85',             accent: 'var(--accent-3)' },
  Personal: { bg: 'var(--accent-1-soft)', text: '#8b4f1c',             accent: 'var(--accent-1)' },
};

export default function QuarterView({ state, setState }) {
  const { quarterGoals, parking } = state;
  const categories = ['Health', 'Finance', 'Business', 'Personal'];

  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  const year = now.getFullYear();
  const quarterEnd = new Date(year, quarter * 3, 0);
  const daysLeft = Math.ceil((quarterEnd - now) / (1000 * 60 * 60 * 24));

  const toggleGoal = (id, e) => {
    if (e && !quarterGoals.find(g => g.id === id).done) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => ({ ...s, quarterGoals: s.quarterGoals.map(g => g.id === id ? { ...g, done: !g.done } : g) }));
  };

  const editGoal = (id, text) => {
    setState(s => ({ ...s, quarterGoals: s.quarterGoals.map(g => g.id === id ? { ...g, text } : g) }));
  };

  const removeGoal = (id) => {
    setState(s => ({ ...s, quarterGoals: s.quarterGoals.filter(g => g.id !== id) }));
  };

  const addGoal = (cat) => {
    setState(s => ({ ...s, quarterGoals: [...s.quarterGoals, { id: 'g' + Date.now(), category: cat, text: 'New goal', done: false }] }));
  };

  const addParking = () => {
    setState(s => ({ ...s, parking: ['New idea', ...s.parking] }));
  };

  const editParking = (i, text) => {
    setState(s => ({ ...s, parking: s.parking.map((p, j) => j === i ? text : p) }));
  };

  const removeParking = (i) => {
    setState(s => ({ ...s, parking: s.parking.filter((_, j) => j !== i) }));
  };

  const totalDone = quarterGoals.filter(g => g.done).length;
  const totalPct = pct(totalDone, quarterGoals.length);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Q{quarter} · {year}</div>
          <h1 className="page-head__title">The bigger picture</h1>
          <div className="page-head__date mt-sm">{daysLeft} days remaining</div>
        </div>
        <div className="row gap-md">
          <div className="card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="text-serif" style={{ fontSize: 28, color: 'var(--primary)' }}>{totalPct}%</span>
            <span className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em' }}>quarter complete</span>
          </div>
        </div>
      </div>

      <div className="bento">
        <div className="card col-12 card--tinted">
          <div className="bento" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Goals completed', value: `${totalDone}/${quarterGoals.length}`, sub: 'across all categories' },
              { label: 'Categories', value: `${categories.length}`, sub: 'active this quarter' },
              { label: 'Days left', value: `${daysLeft}`, sub: `in Q${quarter}` },
              { label: 'Completion', value: `${totalPct}%`, sub: 'of all goals done' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</div>
                <div className="text-serif" style={{ fontSize: 36, color: 'var(--ink)', marginTop: 4 }}>{s.value}</div>
                <div className="fs-xs text-muted">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {categories.map(cat => {
          const items = quarterGoals.filter(g => g.category === cat);
          const done = items.filter(g => g.done).length;
          const c = catColor[cat];
          return (
            <div key={cat} className="card col-6">
              <CardHead
                title={cat}
                sub={`${done} / ${items.length} goals`}
                right={<button className="btn btn--icon" onClick={() => addGoal(cat)}><Icon name="plus" size={14}/></button>}
              />
              <Bar value={done} max={items.length || 1} color={c.accent} />
              <div className="mt-md">
                {items.map(g => (
                  <div key={g.id} className="goal-row">
                    <button
                      className={cls('goal-check', g.done && 'goal-check--done')}
                      style={g.done ? { background: c.accent, borderColor: c.accent } : {}}
                      onClick={(e) => toggleGoal(g.id, e)}
                    >
                      {g.done && <Icon name="check" size={11} stroke={2.6}/>}
                    </button>
                    <Editable
                      value={g.text}
                      onChange={(v) => editGoal(g.id, v)}
                      style={{ fontSize: 13.5, color: g.done ? 'var(--muted)' : 'var(--ink)', textDecoration: g.done ? 'line-through' : 'none' }}
                    />
                    <button className="btn btn--ghost" style={{ padding: 2, color: 'var(--muted)' }} onClick={() => removeGoal(g.id)}>
                      <Icon name="x" size={11}/>
                    </button>
                  </div>
                ))}
                {items.length === 0 && <div className="empty">no goals yet — add one</div>}
              </div>
            </div>
          );
        })}

        <div className="card col-12 card--lilac">
          <CardHead
            title="Parking lot"
            sub="Ideas to come back to"
            right={<button className="btn btn--icon" onClick={addParking}><Icon name="plus" size={14}/></button>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {parking.map((p, i) => (
              <div key={i} className="idea-chip" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <span className="idea-chip__bullet"/>
                <Editable value={p} onChange={(v) => editParking(i, v)} style={{ fontSize: 13 }}/>
                <button className="btn btn--ghost" style={{ padding: 2 }} onClick={() => removeParking(i)}>
                  <Icon name="x" size={11}/>
                </button>
              </div>
            ))}
            {parking.length === 0 && <div className="empty" style={{ gridColumn: 'span 3' }}>Nothing parked yet</div>}
          </div>
        </div>
      </div>
    </>
  );
}
