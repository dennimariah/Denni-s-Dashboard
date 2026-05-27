'use client';

import { DAYS_OF_WEEK, cls, pct } from '@/lib/helpers';
import { burstConfetti } from '@/components/ui/primitives';

// ── Habit definitions ─────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'body', label: 'Body', icon: '💪', color: '#e8527a',
    habits: [
      { id: 'hb1',  label: 'Protein goal hit',          icon: '🥩', color: '#e8527a', goal: 7 },
      { id: 'hb2',  label: 'Workout done',               icon: '💪', color: '#7aaee5', goal: 5 },
      { id: 'hb3',  label: 'Hydrated',                   icon: '💧', color: '#b39bd8', goal: 7 },
      { id: 'hb4',  label: 'Anti-inflammatory meal',     icon: '🥗', color: '#88b896', goal: 7 },
    ],
  },
  {
    id: 'hair', label: 'Hair', icon: '🎀', color: '#f4a261',
    habits: [
      { id: 'hh1',      label: 'Nightly hair protection',    icon: '🎀', color: '#f4a261', goal: 7, cadence: 'daily' },
      { id: 'hh2',      label: 'Scalp treatment applied',    icon: '🌱', color: '#6db88a', goal: 7, cadence: 'daily' },
      { id: 'hWashDay', label: 'Wash day protocol complete', icon: '🚿', color: '#7aaee5', goal: 1, cadence: 'weekly' },
    ],
  },
  {
    id: 'business', label: 'Business', icon: '👑', color: '#9b7cc8',
    habits: [
      { id: 'hbs1', label: 'School hours logged',       icon: '📚', color: '#9b7cc8', goal: 5 },
      { id: 'hbs2', label: 'Silk Collective task done', icon: '👑', color: '#f7c548', goal: 5 },
    ],
  },
  {
    id: 'mind', label: 'Mind & Recovery', icon: '🕊️', color: '#d68d84',
    habits: [
      { id: 'hm1',     label: 'Morning devotion',      icon: '🕊️', color: '#d68d84', goal: 7, cadence: 'daily' },
      { id: 'hChurch', label: 'Church',                icon: '🙏', color: '#b39bd8', goal: 1, cadence: 'weekly', churchToggle: true },
      { id: 'hm2',     label: 'Screen-free wind down', icon: '🌙', color: '#88b896', goal: 7, cadence: 'daily' },
      { id: 'hm3',     label: 'In bed on time',        icon: '😴', color: '#7aaee5', goal: 7, cadence: 'daily' },
    ],
  },
];

function getWeekKey() {
  const d = new Date();
  const thu = new Date(d);
  thu.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const jan1 = new Date(thu.getFullYear(), 0, 1);
  const wk = Math.ceil(((thu - jan1) / 86400000 + 1) / 7);
  return `${thu.getFullYear()}-W${String(wk).padStart(2, '0')}`;
}

// ── Row components ────────────────────────────────────────────────────────────

function DailyRow({ habit, log, todayIdx, onToggle }) {
  const count = log.filter(Boolean).length;
  const hit = count >= habit.goal;
  return (
    <div className="habit-row">
      <div className="habit-row__head">
        <span className="habit-row__icon" style={{ background: habit.color + '22' }}>{habit.icon}</span>
        <div style={{ minWidth: 0 }}>
          <div title={habit.label} style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{habit.label}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{habit.goal}/wk</div>
        </div>
      </div>
      {log.map((done, i) => (
        <button
          key={i}
          className={cls('habit-cell', done && 'habit-cell--done')}
          style={done
            ? { background: habit.color }
            : i === todayIdx
            ? { background: habit.color + '18' }
            : {}}
          onClick={(e) => onToggle(habit.id, i, e)}
          title={done ? '✓' : DAYS_OF_WEEK[i]}
        >
          {done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>
      ))}
      <div className="habit-row__score" style={{ color: hit ? habit.color : 'var(--muted)', fontWeight: hit ? 700 : 400 }}>
        {count}/{habit.goal}
      </div>
    </div>
  );
}

function WeeklyRow({ habit, weeklyHabitLogs, onToggleWeekly }) {
  const weekKey = getWeekKey();
  const entry = weeklyHabitLogs[habit.id];
  const done = entry?.weekKey === weekKey && entry?.done;
  return (
    <div className="habit-row">
      <div className="habit-row__head">
        <span className="habit-row__icon" style={{ background: habit.color + '22' }}>{habit.icon}</span>
        <div style={{ minWidth: 0 }}>
          <div title={habit.label} style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{habit.label}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>weekly</div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 7', display: 'flex', alignItems: 'center', paddingLeft: 2 }}>
        <button
          onClick={(e) => onToggleWeekly(habit.id, e)}
          style={{
            padding: '5px 14px', borderRadius: 8, border: `1px solid ${done ? habit.color : 'var(--line)'}`,
            background: done ? habit.color + '18' : 'transparent',
            color: done ? habit.color : 'var(--muted)',
            fontWeight: done ? 600 : 400, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
          }}
        >
          {done ? '✓ Done this week' : 'Mark complete'}
        </button>
      </div>
      <div className="habit-row__score" style={{ color: done ? habit.color : 'var(--muted)', fontWeight: done ? 700 : 400 }}>
        {done ? '1/1' : '0/1'}
      </div>
    </div>
  );
}

function ChurchRow({ habit, churchLog, onChurchSelect }) {
  const weekKey = getWeekKey();
  const current = churchLog?.weekKey === weekKey ? churchLog.choice : null;
  return (
    <div className="habit-row">
      <div className="habit-row__head">
        <span className="habit-row__icon" style={{ background: habit.color + '22' }}>{habit.icon}</span>
        <div style={{ minWidth: 0 }}>
          <div title={habit.label} style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{habit.label}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>weekly · pick one</div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 7', display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 2 }}>
        {[{ key: 'inperson', label: '🏛 In Person' }, { key: 'online', label: '📺 Watch Online' }].map(opt => {
          const active = current === opt.key;
          return (
            <button
              key={opt.key}
              onClick={(e) => onChurchSelect(active ? null : opt.key, e)}
              style={{
                padding: '5px 12px', borderRadius: 8, border: `1px solid ${active ? habit.color : 'var(--line)'}`,
                background: active ? habit.color + '18' : 'transparent',
                color: active ? habit.color : 'var(--muted)',
                fontWeight: active ? 600 : 400, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
              }}
            >{opt.label}</button>
          );
        })}
      </div>
      <div className="habit-row__score" style={{ color: current ? habit.color : 'var(--muted)', fontWeight: current ? 700 : 400 }}>
        {current ? '1/1' : '0/1'}
      </div>
    </div>
  );
}

// ── Category section ──────────────────────────────────────────────────────────

function CategorySection({ category, habitLogs, weeklyHabitLogs, churchLog, todayIdx, onToggle, onToggleWeekly, onChurchSelect }) {
  const weekKey = getWeekKey();
  let done = 0, total = 0;
  for (const h of category.habits) {
    if (h.churchToggle) {
      total += 1;
      if (churchLog?.weekKey === weekKey && churchLog?.choice) done += 1;
    } else if (h.cadence === 'weekly') {
      total += 1;
      const e = weeklyHabitLogs[h.id];
      if (e?.weekKey === weekKey && e?.done) done += 1;
    } else {
      const log = habitLogs[h.id] || Array(7).fill(false);
      done += log.filter(Boolean).length;
      total += h.goal;
    }
  }
  const score = total ? pct(done, total) : 0;

  return (
    <div className="card" style={{ padding: '14px 18px', marginTop: 12 }}>
      {/* Editorial section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>{category.icon}</span>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: category.color }}>{category.label}</span>
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }} title="check-ins completed this week vs. total possible">{done}/{total} this week</span>
        <div style={{ width: 48, height: 3, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: score + '%', background: category.color, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: category.color, fontWeight: 600, minWidth: 28, textAlign: 'right' }} title="completion rate this week">{score}%</span>
      </div>

      {/* Column headers — only render once above habits */}
      <div className="habit-row" style={{ marginBottom: 2 }}>
        <div />
        {DAYS_OF_WEEK.map((d, i) => (
          <div key={d} className="habit-day-head" style={{ color: i === todayIdx ? category.color : undefined, fontWeight: i === todayIdx ? 700 : undefined }}>{d.slice(0, 1)}</div>
        ))}
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textAlign: 'right' }}>pts</div>
      </div>

      {/* Habit rows */}
      <div className="habit-grid">
        {category.habits.map(h => {
          if (h.churchToggle) return <ChurchRow key={h.id} habit={h} churchLog={churchLog} onChurchSelect={onChurchSelect} />;
          if (h.cadence === 'weekly') return <WeeklyRow key={h.id} habit={h} weeklyHabitLogs={weeklyHabitLogs} onToggleWeekly={onToggleWeekly} />;
          const log = habitLogs[h.id] || Array(7).fill(false);
          return <DailyRow key={h.id} habit={h} log={log} todayIdx={todayIdx} onToggle={onToggle} />;
        })}
      </div>
    </div>
  );
}

// ── Main HabitsView ───────────────────────────────────────────────────────────

export default function HabitsView({ state, setState }) {
  const { habitLogs = {}, weeklyHabitLogs = {}, churchLog = {} } = state;
  const todayIdx = (new Date().getDay() + 6) % 7;
  const weekKey = getWeekKey();

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

  const toggleWeekly = (habitId, e) => {
    const entry = weeklyHabitLogs[habitId];
    const currentDone = entry?.weekKey === weekKey && entry?.done;
    if (e && !currentDone) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => ({
      ...s,
      weeklyHabitLogs: { ...s.weeklyHabitLogs, [habitId]: { weekKey, done: !currentDone } },
    }));
  };

  const selectChurch = (choice, e) => {
    if (e && choice) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => ({ ...s, churchLog: { weekKey, choice } }));
  };

  // Overall stats
  let totalDone = 0, totalGoal = 0;
  for (const cat of CATEGORIES) {
    for (const h of cat.habits) {
      if (h.churchToggle) {
        totalGoal += 1;
        if (churchLog?.weekKey === weekKey && churchLog?.choice) totalDone += 1;
      } else if (h.cadence === 'weekly') {
        totalGoal += 1;
        const e = weeklyHabitLogs[h.id];
        if (e?.weekKey === weekKey && e?.done) totalDone += 1;
      } else {
        const log = habitLogs[h.id] || Array(7).fill(false);
        totalDone += log.filter(Boolean).length;
        totalGoal += h.goal;
      }
    }
  }
  const overallPct = pct(totalDone, totalGoal);

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

      {/* Compact category summary chips */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
        {CATEGORIES.map(cat => {
          let done = 0, total = 0;
          for (const h of cat.habits) {
            if (h.churchToggle) {
              total += 1;
              if (churchLog?.weekKey === weekKey && churchLog?.choice) done += 1;
            } else if (h.cadence === 'weekly') {
              total += 1;
              const e = weeklyHabitLogs[h.id];
              if (e?.weekKey === weekKey && e?.done) done += 1;
            } else {
              const log = habitLogs[h.id] || Array(7).fill(false);
              done += log.filter(Boolean).length;
              total += h.goal;
            }
          }
          const score = total ? pct(done, total) : 0;
          return (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10 }}>
              <span style={{ fontSize: 14 }}>{cat.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{cat.label}</div>
                <div style={{ width: 56, height: 2, background: 'var(--line)', borderRadius: 1, marginTop: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: score + '%', background: cat.color, borderRadius: 1, transition: 'width 0.3s' }} />
                </div>
              </div>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: cat.color, fontWeight: 700 }}>{score}%</span>
            </div>
          );
        })}
      </div>

      {CATEGORIES.map(cat => (
        <CategorySection
          key={cat.id}
          category={cat}
          habitLogs={habitLogs}
          weeklyHabitLogs={weeklyHabitLogs}
          churchLog={churchLog}
          todayIdx={todayIdx}
          onToggle={toggleCell}
          onToggleWeekly={toggleWeekly}
          onChurchSelect={selectChurch}
        />
      ))}
    </>
  );
}
