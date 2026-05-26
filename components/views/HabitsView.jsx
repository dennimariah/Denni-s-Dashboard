'use client';

import { DAYS_OF_WEEK, cls, pct } from '@/lib/helpers';
import { CardHead, Bar, burstConfetti } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

function Section({ title, items, habitLogs, toggleCell, todayIdx }) {
  return (
    <div className="card mt-md">
      <CardHead
        title={title}
        sub={`${items.length} habits`}
        right={<button className="btn btn--ghost"><Icon name="edit" size={14}/> Manage</button>}
      />
      <div className="habit-row" style={{ marginBottom: 4 }}>
        <div/>
        {DAYS_OF_WEEK.map((d, i) => (
          <div key={d} className="habit-day-head">{d}</div>
        ))}
        <div className="habit-day-head">Score</div>
      </div>
      <div className="habit-grid">
        {items.map(h => {
          const log = habitLogs[h.id] || Array(7).fill(false);
          const count = log.filter(Boolean).length;
          const hit = count >= h.goal;
          return (
            <div key={h.id} className="habit-row">
              <div className="habit-row__head">
                <span className="habit-row__icon" style={{ background: h.bg, color: h.color }}>{h.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label}</div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>goal {h.goal}/wk</div>
                </div>
              </div>
              {log.map((done, i) => (
                <button
                  key={i}
                  className={cls('habit-cell', done && 'habit-cell--done', i === todayIdx && 'habit-cell--today')}
                  style={done ? { background: h.color, color: 'white' } : {}}
                  onClick={(e) => toggleCell(h.id, i, e)}
                >
                  {done ? '✓' : ''}
                </button>
              ))}
              <div className="habit-row__score" style={{ color: hit ? h.color : 'var(--ink-soft)', fontWeight: hit ? 700 : 500 }}>
                {count}/{h.goal}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HabitsView({ state, setState }) {
  const { habits, habitLogs } = state;
  const now = new Date();
  const TODAY_IDX = (now.getDay() + 6) % 7;

  const toggleCell = (habitId, dayIdx, e) => {
    const log = habitLogs[habitId] || Array(7).fill(false);
    if (e && !log[dayIdx]) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => {
      const arr = [...(s.habitLogs[habitId] || Array(7).fill(false))];
      arr[dayIdx] = !arr[dayIdx];
      return { ...s, habitLogs: { ...s.habitLogs, [habitId]: arr } };
    });
  };

  const daily = habits.filter(h => h.section === 'daily');
  const devo = habits.filter(h => h.section === 'devotional');

  const overallDone = habits.reduce((sum, h) => sum + (habitLogs[h.id] || []).filter(Boolean).length, 0);
  const overallGoal = habits.reduce((sum, h) => sum + h.goal, 0);
  const overallPct = pct(overallDone, overallGoal);

  const summary = habits.map(h => {
    const count = (habitLogs[h.id] || []).filter(Boolean).length;
    return { ...h, count, percent: pct(count, h.goal) };
  });

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Habits · this week</div>
          <h1 className="page-head__title">Habit tracker</h1>
        </div>
        <div className="row gap-md">
          <div className="card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="text-serif" style={{ fontSize: 28, color: 'var(--primary)' }}>{overallPct}%</span>
            <span className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em' }}>this week</span>
          </div>
        </div>
      </div>

      <div className="bento" style={{ marginBottom: 0 }}>
        {summary.slice(0, 5).map(h => (
          <div key={h.id} className="card col-3" style={{ background: h.bg, borderColor: 'transparent', padding: 16 }}>
            <div className="row" style={{ marginBottom: 8 }}>
              <span className="habit-row__icon" style={{ background: 'white', color: h.color }}>{h.icon}</span>
              <span className="text-mono fs-xs" style={{ color: h.color, fontWeight: 600 }}>{h.percent}%</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{h.label}</div>
            <div className="text-mono fs-xs" style={{ color: h.color, opacity: 0.8, marginTop: 2, letterSpacing: '0.06em' }}>
              {h.count}/{h.goal}
            </div>
          </div>
        ))}
      </div>

      {habits.length === 0 && <div className="card mt-md"><div className="empty">No habits yet — edit your habits to get started</div></div>}
      {daily.length > 0 && <Section title="Daily" items={daily} habitLogs={habitLogs} toggleCell={toggleCell} todayIdx={TODAY_IDX} />}
      {devo.length > 0 && <Section title="Devotional" items={devo} habitLogs={habitLogs} toggleCell={toggleCell} todayIdx={TODAY_IDX} />}
    </>
  );
}
