'use client';

import { useState } from 'react';
import { cls, pct } from '@/lib/helpers';
import { CardHead, Pill, Editable, burstConfetti } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

const WORKOUT_TYPES = ['Weights', 'Cardio', 'Both'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const GOAL_ZONES = [
  { key: 'glutes', label: 'Glutes', emoji: '🍑', color: 'var(--primary)' },
  { key: 'arms',   label: 'Arms',   emoji: '💪', color: 'var(--accent-1)' },
  { key: 'core',   label: 'Core',   emoji: '✂️', color: 'var(--accent-3)' },
  { key: 'back',   label: 'Back',   emoji: '🏋️', color: 'var(--accent-2)' },
];

const TYPE_EMOJI = { Weights: '🏋️', Cardio: '🏃', Both: '⚡' };

function WeightSparkline({ log }) {
  if (!log || log.length < 2) return null;
  const vals = log.slice(-10).map(e => e.weight);
  const min = Math.min(...vals) - 2;
  const max = Math.max(...vals) + 2;
  const range = max - min || 1;
  const w = 220, h = 52, pad = 6;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * innerW;
    const y = pad + (1 - (v - min) / range) * innerH;
    return `${x},${y}`;
  });
  const path = 'M' + pts.join(' L');
  const area = `${path} L${pad + innerW},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <path d={area} fill="var(--primary)" fillOpacity="0.12" stroke="none" />
      <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {vals.map((v, i) => {
        const [x, y] = pts[i].split(',');
        return <circle key={i} cx={x} cy={y} r={i === vals.length - 1 ? 4 : 2.5} fill={i === vals.length - 1 ? 'var(--primary)' : 'var(--card)'} stroke="var(--primary)" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

function WorkoutDayRow({ day, idx, workout, todayIdx, onLog }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Weights', duration: '', calories: '', notes: '' });
  const isToday = idx === todayIdx;
  const done = !!workout;

  const handleLog = (e) => {
    if (!form.duration) return;
    if (e) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    onLog(idx, { ...form, duration: Number(form.duration), calories: Number(form.calories) || 0 });
    setOpen(false);
    setForm({ type: 'Weights', duration: '', calories: '', notes: '' });
  };

  return (
    <div style={{ borderBottom: '1px dashed var(--line)' }}>
      <div
        className="row row--between"
        style={{ padding: '10px 0', cursor: done ? 'default' : 'pointer' }}
        onClick={() => !done && setOpen(o => !o)}
      >
        <div className="row gap-md">
          <span
            className="text-mono fs-xs"
            style={{
              width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center',
              background: done ? 'var(--primary)' : isToday ? 'var(--primary-soft, #fce4ea)' : 'var(--card-2, var(--bg))',
              color: done ? 'white' : isToday ? 'var(--primary)' : 'var(--ink-soft)',
              fontWeight: 700, border: isToday && !done ? '1.5px solid var(--primary)' : '1.5px solid transparent',
            }}
          >
            {done ? <Icon name="check" size={16} /> : day}
          </span>
          <div>
            {done ? (
              <>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {TYPE_EMOJI[workout.type] || '🏃'} {workout.type}
                </div>
                <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>
                  {workout.duration} min{workout.calories ? ` · ${workout.calories} cal` : ''}
                  {workout.notes ? ` · ${workout.notes}` : ''}
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
                {isToday ? 'Log today\'s workout' : day}
              </div>
            )}
          </div>
        </div>
        {done && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                background: workout.type === 'Weights' ? 'var(--accent-1-soft, #fde3cf)' :
                  workout.type === 'Cardio' ? 'var(--accent-2-soft, #d8ecdc)' : 'var(--card-2)',
                color: workout.type === 'Weights' ? 'var(--accent-1)' :
                  workout.type === 'Cardio' ? 'var(--accent-2)' : 'var(--ink-soft)',
              }}
            >
              {workout.type}
            </span>
          </div>
        )}
        {!done && (
          <button
            className="btn btn--icon"
            onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
          >
            <Icon name={open ? 'minus' : 'plus'} size={14} />
          </button>
        )}
      </div>

      {open && !done && (
        <div style={{ padding: '0 0 14px 52px' }}>
          <div className="row gap-sm" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
            {WORKOUT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, type: t }))}
                style={{
                  padding: '5px 14px', borderRadius: 99, border: '1.5px solid',
                  borderColor: form.type === t ? 'var(--primary)' : 'var(--line)',
                  background: form.type === t ? 'var(--primary)' : 'transparent',
                  color: form.type === t ? 'white' : 'var(--ink-soft)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {TYPE_EMOJI[t]} {t}
              </button>
            ))}
          </div>
          <div className="row gap-sm" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
            <div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 4 }}>DURATION (min)</div>
              <input
                type="number" min="0" value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="45"
                style={{ width: 90, border: '1px solid var(--line)', borderRadius: 8, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', outline: 'none' }}
              />
            </div>
            <div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 4 }}>CALORIES</div>
              <input
                type="number" min="0" value={form.calories}
                onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                placeholder="300"
                style={{ width: 90, border: '1px solid var(--line)', borderRadius: 8, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', outline: 'none' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 4 }}>NOTES</div>
              <input
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Leg day, glutes focus…"
                style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 8, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', outline: 'none' }}
              />
            </div>
          </div>
          <button className="btn btn--pink" style={{ fontSize: 12 }} onClick={handleLog}>
            <Icon name="check" size={13} /> Log workout
          </button>
        </div>
      )}
    </div>
  );
}

export default function FitnessView({ state, setState }) {
  const fitness = state.fitness || {};
  const weightLog = fitness.weightLog || [{ date: new Date().toISOString().slice(0, 10), weight: 160 }];
  const measurements = fitness.measurements || { waist: 0, arms: 0, glutes: 0, hips: 0, date: '' };
  const goals = fitness.goals || { glutes: 30, arms: 20, core: 25, back: 20 };
  const goalNotes = fitness.goalNotes || { glutes: '', arms: '', core: '', back: '' };
  const targets = fitness.targets || { calories: 1800, protein: 130, workoutsPerWeek: 3 };
  const nutritionLog = fitness.nutritionLog || [];
  const workoutLog = fitness.workoutLog || [];
  const watchWorkouts = fitness.watchWorkouts || [];

  const [newWeight, setNewWeight] = useState('');
  const [nutritionForm, setNutritionForm] = useState({ calories: '', protein: '' });

  const now = new Date();
  const TODAY_IDX = (now.getDay() + 6) % 7;
  const todayStr = now.toISOString().slice(0, 10);

  const thisWeekWorkouts = workoutLog.filter(w => {
    const d = new Date(w.date || todayStr);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  });

  const currentWeight = weightLog[weightLog.length - 1]?.weight || 160;

  const todayNutrition = nutritionLog.find(n => n.date === todayStr) || { calories: 0, protein: 0 };

  const setFitness = (updater) => {
    setState(s => {
      const next = typeof updater === 'function' ? updater(s.fitness || {}) : updater;
      return { ...s, fitness: next };
    });
  };

  const logWeight = () => {
    const w = parseFloat(newWeight);
    if (!w || w < 50 || w > 500) return;
    setFitness(f => ({
      ...f,
      weightLog: [...(f.weightLog || []), { date: todayStr, weight: w }],
    }));
    setNewWeight('');
  };

  const logNutrition = () => {
    const cal = parseInt(nutritionForm.calories);
    const pro = parseInt(nutritionForm.protein);
    if (!cal && !pro) return;
    setFitness(f => {
      const existing = (f.nutritionLog || []).filter(n => n.date !== todayStr);
      const prev = (f.nutritionLog || []).find(n => n.date === todayStr) || { calories: 0, protein: 0 };
      return {
        ...f,
        nutritionLog: [
          ...existing,
          { date: todayStr, calories: prev.calories + (cal || 0), protein: prev.protein + (pro || 0) },
        ],
      };
    });
    setNutritionForm({ calories: '', protein: '' });
  };

  const logWorkout = (dayIdx, workout) => {
    setFitness(f => {
      const existing = (f.workoutLog || []).filter(w => w.dayIdx !== dayIdx);
      return {
        ...f,
        workoutLog: [...existing, { dayIdx, date: todayStr, ...workout }],
      };
    });
  };

  const last5Nutrition = [...nutritionLog]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <>
      {/* Page header */}
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Fitness · this week</div>
          <h1 className="page-head__title">Body & training</h1>
        </div>
        <div className="row gap-md">
          <Pill tone="pink" mono>{thisWeekWorkouts.length} workouts this week</Pill>
          <Pill tone="mint" mono>{currentWeight} lbs</Pill>
        </div>
      </div>

      <div className="bento">
        {/* Body stats */}
        <div className="card col-6">
          <CardHead
            title="Body stats"
            sub="Track your progress"
            right={
              <div className="row gap-sm">
                <input
                  type="number"
                  placeholder="Log weight"
                  value={newWeight}
                  onChange={e => setNewWeight(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && logWeight()}
                  style={{
                    width: 110, border: '1px solid var(--line)', borderRadius: 8,
                    padding: '6px 10px', fontSize: 12, fontFamily: 'inherit',
                    background: 'var(--bg)', outline: 'none',
                  }}
                />
                <button className="btn btn--pink" style={{ fontSize: 12 }} onClick={logWeight}>
                  <Icon name="plus" size={13} /> Log
                </button>
              </div>
            }
          />

          <div className="row row--between" style={{ alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em' }}>CURRENT WEIGHT</div>
              <div className="text-serif" style={{ fontSize: 42, color: 'var(--primary)', lineHeight: 1.1 }}>
                {currentWeight}
                <span style={{ fontSize: 18, color: 'var(--ink-soft)', marginLeft: 4 }}>lbs</span>
              </div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>
                5&apos;7&quot; · {weightLog.length} entries logged
              </div>
            </div>
            <div>
              <WeightSparkline log={weightLog} />
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em', textAlign: 'center', marginTop: 4 }}>
                last {Math.min(10, weightLog.length)} entries
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
            <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 10 }}>MEASUREMENTS (inches)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { key: 'waist', label: 'Waist', emoji: '✂️' },
                { key: 'arms',  label: 'Arms',  emoji: '💪' },
                { key: 'glutes',label: 'Glutes',emoji: '🍑' },
                { key: 'hips',  label: 'Hips',  emoji: '💃' },
              ].map(({ key, label, emoji }) => (
                <div key={key} style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px' }}>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em', marginBottom: 4 }}>
                    {emoji} {label.toUpperCase()}
                  </div>
                  <div className="row" style={{ alignItems: 'baseline', gap: 4 }}>
                    <Editable
                      value={measurements[key] ? String(measurements[key]) : ''}
                      placeholder="0"
                      style={{ width: 52, fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}
                      onChange={val => setFitness(f => ({
                        ...f,
                        measurements: { ...(f.measurements || {}), [key]: parseFloat(val) || 0, date: todayStr },
                      }))}
                    />
                    <span className="text-mono fs-xs text-muted">in</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="card col-6">
          <CardHead title="Goal zones" sub="Progress toward your body goals" />
          <div className="col gap-md">
            {GOAL_ZONES.map(({ key, label, emoji, color }) => (
              <div key={key}>
                <div className="row row--between" style={{ marginBottom: 6 }}>
                  <div className="row gap-sm" style={{ alignItems: 'center' }}>
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
                  </div>
                  <span className="text-mono fs-xs" style={{ color, fontWeight: 700 }}>{goals[key] || 0}%</span>
                </div>
                <div style={{ position: 'relative', height: 8, background: 'var(--line)', borderRadius: 99, marginBottom: 6 }}>
                  <div
                    style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${Math.min(100, goals[key] || 0)}%`,
                      background: color, borderRadius: 99,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <input
                  type="range" min="0" max="100"
                  value={goals[key] || 0}
                  onChange={e => setFitness(f => ({
                    ...f,
                    goals: { ...(f.goals || {}), [key]: Number(e.target.value) },
                  }))}
                  style={{ width: '100%', accentColor: color, marginBottom: 6 }}
                />
                <Editable
                  value={goalNotes[key] || ''}
                  placeholder={`Notes on ${label.toLowerCase()} training…`}
                  style={{ fontSize: 12, color: 'var(--ink-soft)' }}
                  onChange={val => setFitness(f => ({
                    ...f,
                    goalNotes: { ...(f.goalNotes || {}), [key]: val },
                  }))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Weekly workouts */}
        <div className="card col-12">
          <CardHead
            title="Weekly workouts"
            sub={`${thisWeekWorkouts.length} of ${targets.workoutsPerWeek} goal · click a day to log`}
            right={
              <Pill tone="pink" mono>
                {thisWeekWorkouts.length}/{targets.workoutsPerWeek} this week
              </Pill>
            }
          />
          <div>
            {DAYS.map((day, idx) => {
              const workout = workoutLog.find(w => w.dayIdx === idx);
              return (
                <WorkoutDayRow
                  key={day}
                  day={day}
                  idx={idx}
                  workout={workout}
                  todayIdx={TODAY_IDX}
                  onLog={logWorkout}
                />
              );
            })}
          </div>
        </div>

        {/* Nutrition */}
        <div className="card col-8">
          <CardHead
            title="Nutrition"
            sub={`Today · ${todayStr}`}
            right={
              <div className="row gap-sm">
                <input
                  type="number" placeholder="Cal"
                  value={nutritionForm.calories}
                  onChange={e => setNutritionForm(f => ({ ...f, calories: e.target.value }))}
                  style={{ width: 72, border: '1px solid var(--line)', borderRadius: 8, padding: '6px 8px', fontSize: 12, fontFamily: 'inherit', background: 'var(--bg)', outline: 'none' }}
                />
                <input
                  type="number" placeholder="Protein g"
                  value={nutritionForm.protein}
                  onChange={e => setNutritionForm(f => ({ ...f, protein: e.target.value }))}
                  style={{ width: 84, border: '1px solid var(--line)', borderRadius: 8, padding: '6px 8px', fontSize: 12, fontFamily: 'inherit', background: 'var(--bg)', outline: 'none' }}
                />
                <button className="btn btn--pink" style={{ fontSize: 12 }} onClick={logNutrition}>
                  <Icon name="plus" size={13} /> Log
                </button>
              </div>
            }
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {[
              { label: 'Calories', value: todayNutrition.calories, target: targets.calories, unit: 'kcal', color: 'var(--primary)' },
              { label: 'Protein',  value: todayNutrition.protein,  target: targets.protein,  unit: 'g',    color: 'var(--accent-2)' },
            ].map(({ label, value, target, unit, color }) => {
              const p = Math.min(100, Math.round((value / target) * 100));
              return (
                <div key={label}>
                  <div className="row row--between" style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    <span className="text-mono fs-xs" style={{ color, fontWeight: 700 }}>
                      {value} / {target} {unit}
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: 10, background: 'var(--line)', borderRadius: 99, marginBottom: 4 }}>
                    <div
                      style={{
                        position: 'absolute', left: 0, top: 0, height: '100%',
                        width: `${p}%`, background: color, borderRadius: 99, transition: 'width 0.4s',
                      }}
                    />
                  </div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>
                    {p}% · {Math.max(0, target - value)} {unit} to go
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
            <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 10 }}>LAST 5 DAYS</div>
            {last5Nutrition.length === 0 ? (
              <div className="empty">No nutrition logged yet</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Date', 'Calories', 'vs Target', 'Protein', 'vs Target'].map(h => (
                      <th key={h} className="text-mono fs-xs text-muted" style={{ textAlign: 'left', letterSpacing: '0.08em', paddingBottom: 8, fontWeight: 600, borderBottom: '1px solid var(--line)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {last5Nutrition.map((n, i) => {
                    const calDiff = n.calories - targets.calories;
                    const proDiff = n.protein - targets.protein;
                    return (
                      <tr key={i} style={{ borderBottom: '1px dashed var(--line)' }}>
                        <td className="text-mono fs-xs" style={{ padding: '8px 0', color: 'var(--ink-soft)' }}>{n.date}</td>
                        <td style={{ padding: '8px 8px 8px 0', fontWeight: 600 }}>{n.calories}</td>
                        <td className="text-mono fs-xs" style={{ padding: '8px 8px 8px 0', color: calDiff >= 0 ? 'var(--accent-2)' : 'var(--primary)' }}>
                          {calDiff >= 0 ? '+' : ''}{calDiff}
                        </td>
                        <td style={{ padding: '8px 8px 8px 0', fontWeight: 600 }}>{n.protein}g</td>
                        <td className="text-mono fs-xs" style={{ color: proDiff >= 0 ? 'var(--accent-2)' : 'var(--primary)' }}>
                          {proDiff >= 0 ? '+' : ''}{proDiff}g
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Apple Watch */}
        <div className="card col-4">
          <CardHead
            title="Apple Watch"
            sub="Auto-logged via Apple Shortcut"
            right={<span style={{ fontSize: 20 }}>⌚</span>}
          />
          {watchWorkouts.length === 0 ? (
            <div>
              <div className="empty" style={{ marginBottom: 12 }}>No Watch workouts yet</div>
              <div style={{
                background: 'var(--bg)', borderRadius: 12, padding: '14px 16px',
                border: '1px dashed var(--line)',
              }}>
                <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em', marginBottom: 8 }}>HOW TO SET UP</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  Create an Apple Shortcut that runs after workouts. POST to:
                </div>
                <div
                  className="text-mono fs-xs"
                  style={{
                    background: 'var(--card)', borderRadius: 8, padding: '8px 10px',
                    marginTop: 8, color: 'var(--primary)', wordBreak: 'break-all',
                    border: '1px solid var(--line)',
                  }}
                >
                  POST /api/fitness/watch
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>
                  Body: {'{ type, duration, calories, heartRate, date }'}
                </div>
              </div>
            </div>
          ) : (
            <div className="col gap-sm" style={{ maxHeight: 360, overflow: 'auto' }}>
              {[...watchWorkouts].reverse().map((w, i) => (
                <div key={i} style={{
                  padding: '10px 0', borderBottom: '1px dashed var(--line)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--bg)', display: 'grid', placeItems: 'center', fontSize: 18,
                    flexShrink: 0,
                  }}>
                    {TYPE_EMOJI[w.type] || '⌚'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{w.type}</div>
                    <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>
                      {w.duration} min
                      {w.calories ? ` · ${w.calories} cal` : ''}
                      {w.heartRate ? ` · ❤️ ${w.heartRate} bpm` : ''}
                    </div>
                    <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.06em' }}>{w.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
