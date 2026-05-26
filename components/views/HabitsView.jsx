'use client';

import { DAYS_OF_WEEK, cls, pct } from '@/lib/helpers';
import { CardHead, Bar, Pill, burstConfetti } from '@/components/ui/primitives';

// ── Habit definitions (structural, not stored in state) ───────────────────────

const CATEGORIES = [
  {
    id: 'body', label: 'Body', icon: '💪', color: '#e8527a', bg: '#fbd7e1',
    habits: [
      { id: 'hb1',  label: 'Protein goal hit',          icon: '🥩', color: '#e8527a', bg: '#fbd7e1', goal: 7 },
      { id: 'hb2',  label: 'Workout done',               icon: '💪', color: '#7aaee5', bg: '#dceaf7', goal: 5 },
      { id: 'hb3',  label: 'Hydrated',                   icon: '💧', color: '#b39bd8', bg: '#ebe1f5', goal: 7 },
      { id: 'hb4',  label: 'Anti-inflammatory meal',     icon: '🥗', color: '#88b896', bg: '#d8ecdc', goal: 7 },
    ],
  },
  {
    id: 'hair', label: 'Hair', icon: '🎀', color: '#f4a261', bg: '#fde3cf',
    habits: [
      { id: 'hh1',     label: 'Nightly hair protection',    icon: '🎀', color: '#f4a261', bg: '#fde3cf', goal: 7, cadence: 'daily' },
      { id: 'hh2',     label: 'Scalp treatment applied',    icon: '🌱', color: '#6db88a', bg: '#c8e8d4', goal: 7, cadence: 'daily' },
      { id: 'hWashDay', label: 'Wash day protocol complete', icon: '🚿', color: '#7aaee5', bg: '#dceaf7', goal: 1, cadence: 'weekly' },
    ],
  },
  {
    id: 'business', label: 'Business', icon: '👑', color: '#9b7cc8', bg: '#e0d4f5',
    habits: [
      { id: 'hbs1', label: 'School hours logged',       icon: '📚', color: '#9b7cc8', bg: '#e0d4f5', goal: 5 },
      { id: 'hbs2', label: 'Silk Collective task done', icon: '👑', color: '#f7c548', bg: '#fef3cd', goal: 5 },
    ],
  },
  {
    id: 'mind', label: 'Mind & Recovery', icon: '🕊️', color: '#d68d84', bg: '#f8dad5',
    habits: [
      { id: 'hm1',    label: 'Morning devotion',      icon: '🕊️', color: '#d68d84', bg: '#f8dad5', goal: 7, cadence: 'daily' },
      { id: 'hChurch', label: 'Church',               icon: '🙏', color: '#b39bd8', bg: '#ebe1f5', goal: 1, cadence: 'weekly', churchToggle: true },
      { id: 'hm2',    label: 'Screen-free wind down', icon: '🌙', color: '#88b896', bg: '#d8ecdc', goal: 7, cadence: 'daily' },
      { id: 'hm3',    label: 'In bed on time',        icon: '😴', color: '#7aaee5', bg: '#dceaf7', goal: 7, cadence: 'daily' },
    ],
  },
];

// ISO week key: e.g. "2026-W22"
function getWeekKey() {
  const d = new Date();
  const thu = new Date(d);
  thu.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const jan1 = new Date(thu.getFullYear(), 0, 1);
  const wk = Math.ceil(((thu - jan1) / 86400000 + 1) / 7);
  return `${thu.getFullYear()}-W${String(wk).padStart(2, '0')}`;
}

// ── Daily habit row ───────────────────────────────────────────────────────────

function DailyRow({ habit, log, todayIdx, onToggle }) {
  const count = log.filter(Boolean).length;
  const hit = count >= habit.goal;
  return (
    <div className="habit-row">
      <div className="habit-row__head">
        <span className="habit-row__icon" style={{ background: habit.bg, color: habit.color }}>{habit.icon}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{habit.label}</div>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>goal {habit.goal}/wk</div>
        </div>
      </div>
      {log.map((done, i) => (
        <button
          key={i}
          className={cls('habit-cell', done && 'habit-cell--done', i === todayIdx && 'habit-cell--today')}
          style={done ? { background: habit.color, color: 'white' } : {}}
          onClick={(e) => onToggle(habit.id, i, e)}
        >
          {done ? '✓' : ''}
        </button>
      ))}
      <div className="habit-row__score" style={{ color: hit ? habit.color : 'var(--ink-soft)', fontWeight: hit ? 700 : 500 }}>
        {count}/{habit.goal}
      </div>
    </div>
  );
}

// ── Weekly habit row ──────────────────────────────────────────────────────────

function WeeklyRow({ habit, weeklyHabitLogs, onToggleWeekly }) {
  const weekKey = getWeekKey();
  const entry = weeklyHabitLogs[habit.id];
  const done = entry?.weekKey === weekKey && entry?.done;
  return (
    <div className="habit-row">
      <div className="habit-row__head">
        <span className="habit-row__icon" style={{ background: habit.bg, color: habit.color }}>{habit.icon}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{habit.label}</div>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>weekly · resets Mon</div>
        </div>
      </div>
      {/* Spacer cells to align with daily rows */}
      <div style={{ gridColumn: 'span 7', display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
        <button
          onClick={(e) => onToggleWeekly(habit.id, e)}
          style={{
            padding: '6px 18px', borderRadius: 10, border: `1.5px solid ${done ? habit.color : 'var(--line)'}`,
            background: done ? habit.bg : 'var(--bg)', color: done ? habit.color : 'var(--muted)',
            fontWeight: done ? 700 : 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
        >
          {done ? '✓ Done this week' : 'Mark complete'}
        </button>
      </div>
      <div className="habit-row__score" style={{ color: done ? habit.color : 'var(--ink-soft)', fontWeight: done ? 700 : 500 }}>
        {done ? '1/1' : '0/1'}
      </div>
    </div>
  );
}

// ── Church row (special toggle) ───────────────────────────────────────────────

function ChurchRow({ habit, churchLog, onChurchSelect }) {
  const weekKey = getWeekKey();
  const current = churchLog?.weekKey === weekKey ? churchLog.choice : null;
  return (
    <div className="habit-row">
      <div className="habit-row__head">
        <span className="habit-row__icon" style={{ background: habit.bg, color: habit.color }}>{habit.icon}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{habit.label}</div>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>weekly · pick one</div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 7', display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
        {[
          { key: 'inperson', label: '🏛 In Person' },
          { key: 'online',   label: '📺 Watch Online' },
        ].map(opt => {
          const active = current === opt.key;
          return (
            <button
              key={opt.key}
              onClick={(e) => onChurchSelect(active ? null : opt.key, e)}
              style={{
                padding: '6px 16px', borderRadius: 10, border: `1.5px solid ${active ? habit.color : 'var(--line)'}`,
                background: active ? habit.bg : 'var(--bg)', color: active ? habit.color : 'var(--muted)',
                fontWeight: active ? 700 : 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          );
        })}
        {current && (
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            this week ✓
          </span>
        )}
      </div>
      <div className="habit-row__score" style={{ color: current ? habit.color : 'var(--ink-soft)', fontWeight: current ? 700 : 500 }}>
        {current ? '1/1' : '0/1'}
      </div>
    </div>
  );
}

// ── Category section ──────────────────────────────────────────────────────────

function CategorySection({ category, habitLogs, weeklyHabitLogs, churchLog, todayIdx, onToggle, onToggleWeekly, onChurchSelect }) {
  const weekKey = getWeekKey();

  // Compute category completion for summary
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
    <div className="card mt-md" style={{ overflow: 'hidden' }}>
      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px 10px', borderBottom: '1px solid var(--line)', background: category.bg + '55' }}>
        <span style={{ fontSize: 18 }}>{category.icon}</span>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: category.color }}>{category.label}</span>
        <div style={{ flex: 1, height: 1, background: category.color + '30' }} />
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: category.color, fontWeight: 600 }}>{score}%</span>
      </div>

      {/* Column headers */}
      <div className="habit-row" style={{ marginBottom: 2, paddingTop: 10 }}>
        <div />
        {DAYS_OF_WEEK.map(d => <div key={d} className="habit-day-head">{d}</div>)}
        <div className="habit-day-head">Score</div>
      </div>

      {/* Habit rows */}
      <div className="habit-grid">
        {category.habits.map(h => {
          if (h.churchToggle) {
            return <ChurchRow key={h.id} habit={h} churchLog={churchLog} onChurchSelect={onChurchSelect} />;
          }
          if (h.cadence === 'weekly') {
            return <WeeklyRow key={h.id} habit={h} weeklyHabitLogs={weeklyHabitLogs} onToggleWeekly={onToggleWeekly} />;
          }
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

  // Overall weekly stats
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

      {/* Category summary cards */}
      <div className="bento" style={{ marginBottom: 0 }}>
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
            <div key={cat.id} className="card col-3" style={{ background: cat.bg, borderColor: 'transparent', padding: 16 }}>
              <div className="row" style={{ marginBottom: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <span className="text-mono fs-xs" style={{ color: cat.color, fontWeight: 700 }}>{score}%</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: cat.color, marginBottom: 4 }}>{cat.label}</div>
              <div style={{ height: 4, background: cat.color + '30', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: score + '%', background: cat.color, borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
              <div className="text-mono fs-xs" style={{ color: cat.color, opacity: 0.8, marginTop: 4, letterSpacing: '0.06em' }}>
                {cat.habits.length} habits
              </div>
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
