'use client';

import { useState } from 'react';
import { CardHead, Pill, Editable } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

// ── Workout Programs ──────────────────────────────────────────────────────────

const WORKOUTS = {
  1: {
    title: 'Glutes + Hamstrings', subtitle: 'Posterior chain. Heavy day.', duration: '50–60 min',
    warmup: '5 min stairmaster · banded clamshells 2×15 each · banded glute bridges 2×15',
    exercises: [
      { name: 'DB Romanian Deadlifts', sets: 4, reps: 10, weight: '40–50 lb', note: 'Slow eccentric, push hips back, feel hamstrings stretch.' },
      { name: 'DB Hip Thrusts', sets: 4, reps: 12, weight: '40–50 lb', note: 'Shoulders on bench. Squeeze hard at the top, hold 1 sec.' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10 ea leg', weight: '20–30 lb', note: 'Front foot far enough out — knee stacked over ankle.' },
      { name: 'Cable Pull-Throughs', sets: 3, reps: 12, weight: '30–50 lb', note: 'Rope between legs, hinge not squat.' },
      { name: 'Single-Leg Cable Kickbacks', sets: 3, reps: '12 ea leg', weight: '15–25 lb', note: 'Pause at peak. No swinging.' },
      { name: 'Weighted Ball Glute Bridge Hold', sets: 3, reps: '30 sec', weight: 'ball on hips', note: 'Constant squeeze. Burner finisher.' },
    ],
    finisher: '10 min stairmaster, level 7–9',
  },
  2: {
    title: 'Back + Biceps + Abs', subtitle: 'Pull day. Posture + arm definition.', duration: '45–55 min',
    warmup: '5 min treadmill incline walk · arm swings · cat-cow 10 reps',
    exercises: [
      { name: 'Single-Arm Cable Lat Pulldown', sets: 4, reps: '10 ea arm', weight: '20–35 lb', note: 'Kneel facing the cable with a D-handle. Pull elbow down toward hip.' },
      { name: 'Single-Arm DB Rows', sets: 4, reps: '10 ea arm', weight: '20–30 lb', note: 'Push higher than 10 lb here — back can handle it.' },
      { name: 'DB Pullovers', sets: 3, reps: 12, weight: '20–30 lb', note: 'Lie on bench, hold one DB overhead, lower behind head, pull back up.' },
      { name: 'Cable Face Pulls', sets: 3, reps: 15, weight: '20–30 lb', note: 'Rope to forehead. Posture gold.' },
      { name: 'DB Bicep Curls', sets: 3, reps: 12, weight: '12–15 lb', note: 'Slow on the way down.' },
      { name: 'Cable Hammer Curls (rope)', sets: 3, reps: 12, weight: '20–30 lb', note: 'Thumbs up. Hits brachialis = thicker arms.' },
      { name: 'Cable Crunches', sets: 3, reps: 15, weight: '30–50 lb', note: 'Round the spine. Hip flexors stay out of it.' },
      { name: 'Weighted Ball Russian Twists', sets: 3, reps: '20 (10 ea)', weight: '6–10 lb ball', note: 'Slow, controlled. Touch ball to floor each side.' },
    ],
    finisher: 'Optional: 10 min incline walk',
  },
  3: {
    title: 'Glutes + Quads', subtitle: 'Lower body volume day.', duration: '50–60 min',
    warmup: '5 min stairmaster · banded lateral walks 2×10 each direction',
    exercises: [
      { name: 'DB Goblet Squats', sets: 4, reps: 12, weight: '35–50 lb', note: 'Heels down, chest up. Sit between the heels.' },
      { name: 'DB Sumo Deadlifts', sets: 4, reps: 10, weight: '40–50 lb', note: 'Wide stance, toes out. Glutes drive the lift.' },
      { name: 'Walking Lunges', sets: 3, reps: '10 ea leg', weight: '20–30 lb', note: 'Long stride for glute emphasis, short for quad.' },
      { name: 'DB Step-Ups', sets: 3, reps: '10 ea leg', weight: '15–25 lb', note: 'Drive through the heel of the up-leg.' },
      { name: 'Cable Glute Kickbacks (high angle)', sets: 3, reps: '15 ea leg', weight: '15–25 lb', note: 'Pulley high. Aims upper glute shelf.' },
      { name: 'Curtsy Lunges', sets: 3, reps: '10 ea leg', weight: '15–20 lb', note: 'Step back and across. Hits glute medius.' },
    ],
    finisher: '10 min stairmaster, level 6–8',
  },
  4: {
    title: 'Shoulders + Chest + Triceps + Abs', subtitle: 'Push day. Toned, defined upper body.', duration: '45–55 min',
    warmup: '5 min light cardio · arm circles · scap push-ups 2×10',
    exercises: [
      { name: 'DB Shoulder Press', sets: 4, reps: 10, weight: '10–15 lb', note: 'Push past 10 lb when reps feel easy. Core tight.' },
      { name: 'DB Lateral Raises', sets: 4, reps: 12, weight: '5–8 lb', note: 'Form > weight. Lead with pinky, slight forward lean.' },
      { name: 'Cable Chest Flyes', sets: 3, reps: 12, weight: '15–25 lb', note: 'Slight bend in elbows. Squeeze at the center.' },
      { name: 'DB Floor Chest Press', sets: 3, reps: 10, weight: '15–25 lb', note: 'Go above 10 lb — chest is bigger than biceps.' },
      { name: 'Cable Tricep Pushdowns (rope)', sets: 3, reps: 12, weight: '25–40 lb', note: 'Elbows pinned. Spread rope at the bottom.' },
      { name: 'DB Overhead Tricep Extension', sets: 3, reps: 12, weight: '10–15 lb', note: 'Both hands one DB. Elbows close to head.' },
      { name: 'Weighted Ball V-Ups', sets: 3, reps: 12, weight: '6–10 lb ball', note: 'Ball passes hand to feet each rep.' },
      { name: 'Cable Woodchoppers', sets: 3, reps: '12 ea side', weight: '15–25 lb', note: 'Rotate from the core, not the arms.' },
    ],
    finisher: '10 min incline walk, 3.5 mph, 10–12% incline',
  },
  5: {
    title: 'Core + Cardio', subtitle: 'Flexible session. Pair with any lifting day or do solo.', duration: '30–40 min',
    warmup: '5 min easy walk → 20 min cardio: Stairmaster intervals (1 min L6 / 1 min L9) or incline walk (3.0 mph at 12%) or stairmaster steady L7',
    exercises: [
      { name: 'Weighted Bench Sit-Ups', sets: 3, reps: 15, weight: '10 lb', note: 'Hold weight at chest. Control the descent.' },
      { name: 'Around the Worlds', sets: 3, reps: 15, weight: '15 lb', note: 'Full circle overhead. Brace the core, slow tempo.' },
      { name: 'Kettlebell Marches', sets: 3, reps: 20, weight: '20 lb', note: 'Hold KB at chest. Drive knee up, keep ribs stacked.' },
      { name: 'Cable Woodchoppers', sets: 3, reps: '15 ea side', weight: '15–25 lb', note: 'Rotate from the core, not the shoulders.' },
      { name: 'Cable Crunches', sets: 3, reps: 15, weight: '30–50 lb', note: 'Round the spine. Hip flexors stay out of it.' },
      { name: 'Weighted Deadbugs', sets: 3, reps: 15, weight: '5–10 lb', note: 'Low back pressed to floor. Opposite arm + leg extend slowly.' },
    ],
    finisher: 'Cooldown walk 3–5 min · hip flexor stretch 30 sec each · pigeon pose 30 sec each · child\'s pose 30 sec',
  },
};

// ── Meal Library ─────────────────────────────────────────────────────────────

const MEALS = {
  breakfast: [
    { id: 'b1', name: 'Sweet Potato Egg Scramble', desc: '2 whole eggs + 4 whites, ½ cup sweet potato, ¼ avocado, sautéed spinach + onion', cal: 390, p: 31, f: 15, c: 31 },
    { id: 'b2', name: 'Protein Oats + Berries', desc: '½ cup rolled oats, 1 scoop whey isolate, ½ cup blueberries, 1 tbsp almond butter', cal: 405, p: 33, f: 13, c: 43 },
    { id: 'b3', name: 'Greek Yogurt Power Bowl', desc: '1.5 cup plain 0% Greek yogurt, 2 tbsp ground flax, ½ cup raspberries, 1 tbsp almond butter', cal: 385, p: 38, f: 15, c: 28 },
    { id: 'b4', name: 'Smoked Salmon + Eggs', desc: '3 oz no-sugar smoked salmon, 2 whole eggs, Ezekiel toast, ¼ avocado', cal: 380, p: 33, f: 20, c: 19 },
    { id: 'b5', name: 'Turkey Veggie Hash', desc: '4 oz lean ground turkey, ½ cup diced sweet potato, bell pepper, kale, 1 fried egg', cal: 400, p: 36, f: 14, c: 28 },
  ],
  lunch: [
    { id: 'l1', name: 'Chicken Quinoa Bowl', desc: '4 oz grilled chicken, ½ cup quinoa, mixed greens, cucumber, tomato, olive oil + lemon', cal: 360, p: 35, f: 7, c: 22 },
    { id: 'l2', name: 'Wild Salmon Poke', desc: '4 oz wild salmon, ½ cup brown rice, cucumber, ¼ cup edamame, coconut aminos', cal: 410, p: 31, f: 19, c: 28 },
    { id: 'l3', name: 'Turkey Lettuce Wraps + Sweet Potato', desc: '5 oz ground turkey 93/7, romaine wraps, salsa, small baked sweet potato, ¼ avocado', cal: 400, p: 33, f: 15, c: 29 },
    { id: 'l4', name: 'Big Chicken Salad', desc: '5 oz grilled chicken, spring mix, peppers, cucumber, ¼ cup chickpeas, ¼ avocado, balsamic', cal: 415, p: 47, f: 15, c: 20 },
    { id: 'l5', name: 'Tuna White Bean Bowl', desc: '1 pouch wild tuna, ⅓ cup cannellini beans, arugula, cherry tomato, lemon olive oil', cal: 370, p: 38, f: 12, c: 26 },
    { id: 'l6', name: 'Pepper Steak + White Rice', desc: '5 oz sirloin, bell peppers, onion, coconut aminos, ¾ cup white rice', cal: 515, p: 44, f: 16, c: 47 },
  ],
  dinner: [
    { id: 'd1', name: 'Baked Salmon Dinner', desc: '4 oz wild salmon, ½ cup quinoa, roasted broccoli + cauliflower with garlic + olive oil', cal: 405, p: 31, f: 17, c: 32 },
    { id: 'd2', name: 'Chicken Stir Fry', desc: '6 oz chicken breast, mixed veg, ½ cup jasmine rice, coconut aminos, ginger, sesame oil', cal: 470, p: 56, f: 11, c: 36 },
    { id: 'd3', name: 'Turkey Meatballs + Zoodles', desc: '5 oz turkey meatballs, zucchini noodles, ½ cup marinara, ½ cup quinoa', cal: 410, p: 39, f: 13, c: 38 },
    { id: 'd4', name: 'Bison Sweet Potato Bowl', desc: '5 oz lean ground bison, ½ cup roasted sweet potato, sautéed kale + garlic', cal: 410, p: 40, f: 17, c: 29 },
    { id: 'd5', name: 'Shrimp Cauli Rice Bowl', desc: '6 oz shrimp, 1 cup cauliflower rice, ½ cup black beans, salsa, ¼ avocado, lime', cal: 380, p: 42, f: 12, c: 28 },
    { id: 'd6', name: 'Lemon-Herb Chicken + Veg', desc: '5 oz baked chicken thigh (skinless), ½ cup wild rice, roasted asparagus + carrots', cal: 430, p: 38, f: 16, c: 30 },
  ],
  snack: [
    { id: 's1', name: 'Apple + Almond Butter', desc: '1 medium apple, 1 tbsp almond butter, cinnamon', cal: 190, p: 4, f: 9, c: 27 },
    { id: 's2', name: 'Protein Shake', desc: '1 scoop whey isolate in water or unsweetened almond milk', cal: 130, p: 25, f: 2, c: 5 },
    { id: 's3', name: 'Hard Boiled Eggs + Cucumber', desc: '2 hard-boiled eggs, sliced cucumber, pinch sea salt', cal: 160, p: 12, f: 10, c: 2 },
    { id: 's4', name: 'Cottage Cheese + Berries', desc: '½ cup low-fat cottage cheese, ½ cup blueberries, cinnamon', cal: 150, p: 14, f: 3, c: 18 },
    { id: 's5', name: 'Tuna Pouch + Rice Cake', desc: '1 pouch wild tuna, 1 brown rice cake, mustard or lemon', cal: 170, p: 22, f: 2, c: 18 },
    { id: 's6', name: 'Turkey Avocado Roll-Ups', desc: '3 slices nitrate-free turkey, ¼ avocado, cucumber sticks', cal: 140, p: 18, f: 6, c: 4 },
    { id: 's7', name: 'Bone Broth + Almonds', desc: '1 cup bone broth, 14 raw almonds', cal: 130, p: 11, f: 8, c: 4 },
    { id: 's8', name: 'Premier Protein Shake', desc: '1 carton ready-to-drink · 11 fl oz', cal: 160, p: 30, f: 3, c: 4 },
    { id: 's9', name: 'Banana', desc: '1 medium banana (~7 inches)', cal: 105, p: 1, f: 0, c: 27 },
  ],
};

const TARGETS = { cal: 1525, p: 130, f: 50, c: 135 };

// ── Helpers ───────────────────────────────────────────────────────────────────

const todayKey = () => new Date().toISOString().slice(0, 10);

const compressImage = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 900;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function MacroBar({ label, value, target, unit, color }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const over = value > target;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <span style={{ color: over ? 'var(--primary)' : 'var(--ink)' }}>{Math.round(value)} / {target}{unit}</span>
      </div>
      <div style={{ height: 6, background: 'var(--line)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: over ? 'var(--primary)' : color, borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

function WeightSparkline({ log }) {
  if (!log || log.length < 2) return null;
  const vals = log.slice(-10).map(e => e.weight);
  const min = Math.min(...vals) - 2, max = Math.max(...vals) + 2;
  const range = max - min || 1;
  const w = 200, h = 44, pad = 4;
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (w - pad * 2);
    const y = pad + ((max - v) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinejoin="round" />
      {vals.map((v, i) => {
        const x = pad + (i / (vals.length - 1)) * (w - pad * 2);
        const y = pad + ((max - v) / range) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r={i === vals.length - 1 ? 4 : 2.5} fill={i === vals.length - 1 ? 'var(--primary)' : 'var(--card)'} stroke="var(--primary)" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

// ── Tab: Sleep ────────────────────────────────────────────────────────────────

const SLEEP_QUALITY = ['', '😫', '😕', '😐', '😊', '✨'];
const SLEEP_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function SleepTab({ fitness, setState }) {
  const today = todayKey();
  const sleepLog = fitness.sleepLog || [];
  const [draft, setDraft] = useState({ date: today, hours: '', quality: 3, notes: '' });
  const [adding, setAdding] = useState(false);

  const weekDays = (() => {
    const now = new Date();
    const mon = (now.getDay() + 6) % 7;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - mon + i);
      return d.toISOString().slice(0, 10);
    });
  })();

  const byDate = sleepLog.reduce((acc, e) => { acc[e.date] = e; return acc; }, {});
  const weekEntries = weekDays.map(d => byDate[d]).filter(Boolean);
  const avg = weekEntries.length > 0
    ? (weekEntries.reduce((s, e) => s + e.hours, 0) / weekEntries.length).toFixed(1)
    : null;

  const addSleep = () => {
    if (!draft.hours) return;
    setState(s => ({
      ...s, fitness: {
        ...s.fitness,
        sleepLog: [
          ...(s.fitness.sleepLog || []).filter(e => e.date !== draft.date),
          { id: `sl-${Date.now()}`, ...draft, hours: +draft.hours },
        ],
      },
    }));
    setDraft({ date: today, hours: '', quality: 3, notes: '' });
    setAdding(false);
  };

  const removeSleep = (id) => setState(s => ({
    ...s, fitness: { ...s.fitness, sleepLog: (s.fitness.sleepLog || []).filter(e => e.id !== id) },
  }));

  return (
    <div>
      {/* Week card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>This week · Target 8h</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 42, fontWeight: 400, lineHeight: 1, marginBottom: 4, color: 'var(--ink)' }}>
          {avg ?? '—'}<span style={{ fontSize: 20, color: 'var(--muted)', fontStyle: 'italic' }}> hr avg</span>
        </div>
        {avg && (
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 16 }}>
            {+avg >= 7.5 ? 'Excellent rest — keep it up' : +avg >= 6.5 ? 'Decent — try 30 min earlier' : 'Sleep debt building — prioritize rest'}
          </div>
        )}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', marginTop: avg ? 0 : 16 }}>
          {weekDays.map((d, i) => {
            const entry = byDate[d];
            const hrs = entry?.hours || 0;
            const pct = Math.min(100, (hrs / 10) * 100);
            const isToday = d === today;
            return (
              <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ height: 64, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                  {/* Empty outline container */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', border: '1.5px solid var(--line)', borderRadius: 4, boxSizing: 'border-box' }} />
                  {/* Filled bar */}
                  {hrs > 0 && (
                    <div style={{
                      position: 'relative', width: '100%', height: `${pct}%`,
                      background: hrs >= 7.5 ? 'var(--accent-2)' : hrs >= 6 ? 'var(--accent-4)' : 'var(--primary)',
                      borderRadius: 3, transition: 'height 0.3s', zIndex: 1,
                    }} />
                  )}
                </div>
                {hrs > 0 && (
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontWeight: 600 }}>{hrs}h</div>
                )}
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: isToday ? 'var(--primary)' : 'var(--muted)', fontWeight: isToday ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {SLEEP_LABELS[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!adding ? (
        <button onClick={() => setAdding(true)} style={{ width: '100%', padding: 16, borderRadius: 14, border: '1px dashed var(--line)', background: 'transparent', color: 'var(--muted)', fontStyle: 'italic', fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
          + Log last night's sleep
        </button>
      ) : (
        <div className="card" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, marginBottom: 14 }}>Log sleep</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Date</div>
              <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Hours slept</div>
              <input type="number" min="1" max="12" step="0.5" placeholder="7.5" value={draft.hours} onChange={e => setDraft({ ...draft, hours: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-serif)', fontSize: 16, boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Quality</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(q => (
                <button key={q} onClick={() => setDraft({ ...draft, quality: q })} style={{
                  fontSize: 22, padding: '6px 10px', borderRadius: 10,
                  border: `1.5px solid ${draft.quality === q ? 'var(--primary)' : 'var(--line)'}`,
                  background: draft.quality === q ? 'var(--bg)' : 'transparent', cursor: 'pointer',
                }}>
                  {SLEEP_QUALITY[q]}
                </button>
              ))}
            </div>
          </div>
          <input placeholder="Notes (woke up twice, vivid dreams...)" value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setAdding(false)} className="btn btn--ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button onClick={addSleep} className="btn btn--pink" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
          </div>
        </div>
      )}

      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 10 }}>Recent nights</div>
      {sleepLog.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>No sleep logged yet — start wearing your watch at night</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...sleepLog].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14).map((e) => (
            <div key={e.id || e.date} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                background: e.hours >= 7.5 ? 'var(--accent-2)' : e.hours >= 6 ? 'var(--accent-1)' : 'var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 600,
              }}>
                {e.hours}h
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                  {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{SLEEP_QUALITY[e.quality || 3]} {e.notes || ''}</div>
              </div>
              <button onClick={() => removeSleep(e.id || e.date)} style={{ color: 'var(--muted)', fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Train ────────────────────────────────────────────────────────────────

function TrainTab({ fitness, setState }) {
  const today = todayKey();
  const currentDay = fitness.currentDay || 1;
  const doneEx = fitness.doneExercises?.[today] || {};
  const w = WORKOUTS[currentDay];
  const doneCt = w.exercises.filter(e => doneEx[`${currentDay}-${e.name}`]).length;

  const toggleEx = (key) => {
    setState(s => ({
      ...s,
      fitness: {
        ...s.fitness,
        doneExercises: {
          ...(s.fitness.doneExercises || {}),
          [today]: { ...(s.fitness.doneExercises?.[today] || {}), [key]: !doneEx[key] },
        },
      },
    }));
  };

  const setDay = (d) => setState(s => ({ ...s, fitness: { ...s.fitness, currentDay: d } }));

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setDay(n)} style={{
            flexShrink: 0, padding: '10px 18px', borderRadius: 14, border: `1px solid ${n === currentDay ? 'var(--ink)' : 'var(--line)'}`,
            background: n === currentDay ? 'var(--ink)' : 'var(--card)', color: n === currentDay ? 'var(--bg)' : 'var(--ink)',
            cursor: 'pointer', textAlign: 'center', minWidth: 64,
          }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 2 }}>Day</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, lineHeight: 1 }}>{n}</div>
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16, padding: 20 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 6 }}>
          Day {currentDay} · {w.duration}
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.1 }}>{w.title}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>{w.subtitle}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-2)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>
            {doneCt}/{w.exercises.length}
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>exercises complete today</span>
        </div>
      </div>

      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>Warm-up</div>
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 16, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
        {w.warmup}
      </div>

      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>Lifts</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {w.exercises.map((ex, i) => {
          const key = `${currentDay}-${ex.name}`;
          const done = !!doneEx[key];
          return (
            <div key={key} style={{ background: done ? 'var(--line)' : 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, opacity: done ? 0.6 : 1, transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <button onClick={() => toggleEx(key)} style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: '50%', marginTop: 2,
                  background: done ? 'var(--accent-2)' : 'transparent', border: `1.5px solid ${done ? 'var(--accent-2)' : 'var(--muted)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11, color: 'var(--ink)',
                }}>
                  {done && '✓'}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.12em' }}>0{i + 1}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, textDecoration: done ? 'line-through' : 'none', color: 'var(--ink)' }}>{ex.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 6 }}>
                    <span><span style={{ color: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sets </span><strong>{ex.sets}</strong></span>
                    <span><span style={{ color: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reps </span><strong>{ex.reps}</strong></span>
                    <span><span style={{ color: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Wt </span><strong style={{ color: 'var(--primary)' }}>{ex.weight}</strong></span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>{ex.note}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>Finisher</div>
      <div style={{ background: 'var(--ink)', color: 'var(--bg)', borderRadius: 14, padding: 16, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        {w.finisher}
      </div>

      <div style={{ background: 'var(--card)', border: '1px dashed var(--line)', borderRadius: 14, padding: 16, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>
        When your last set hits the top of the rep range with 2 reps in reserve, go up. For glutes that means more weight. For upper body — leave the 10 lb shelf.
      </div>
    </div>
  );
}

// ── Tab: Nutrition ────────────────────────────────────────────────────────────

function NutritionTab({ fitness, setState }) {
  const today = todayKey();
  const log = fitness.nutritionByDate?.[today] || [];
  const workoutToday = fitness.workoutByDate?.[today] || { session: '', duration: '', kcal: '', avgHR: '', maxHR: '', notes: '' };
  const [mealCat, setMealCat] = useState('breakfast');
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState({ name: '', cal: '', p: '', f: '', c: '' });
  const [logWorkout, setLogWorkout] = useState(false);
  const [wDraft, setWDraft] = useState(workoutToday);

  const totals = log.reduce((a, m) => ({ cal: a.cal + m.cal, p: a.p + m.p, f: a.f + m.f, c: a.c + m.c }), { cal: 0, p: 0, f: 0, c: 0 });

  const addMeal = (meal) => setState(s => ({
    ...s, fitness: {
      ...s.fitness,
      nutritionByDate: { ...(s.fitness.nutritionByDate || {}), [today]: [...log, { ...meal, loggedAt: Date.now() }] },
    },
  }));

  const removeMeal = (idx) => setState(s => ({
    ...s, fitness: {
      ...s.fitness,
      nutritionByDate: { ...(s.fitness.nutritionByDate || {}), [today]: log.filter((_, i) => i !== idx) },
    },
  }));

  const saveWorkout = () => setState(s => ({
    ...s, fitness: {
      ...s.fitness,
      workoutByDate: { ...(s.fitness.workoutByDate || {}), [today]: wDraft },
    },
  }));

  const submitCustom = () => {
    if (!custom.name) return;
    addMeal({ name: custom.name, cal: +custom.cal || 0, p: +custom.p || 0, f: +custom.f || 0, c: +custom.c || 0 });
    setCustom({ name: '', cal: '', p: '', f: '', c: '' });
    setCustomOpen(false);
  };

  const inp = (placeholder, value, onChange, num) => (
    <input type={num ? 'number' : 'text'} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' }} />
  );

  return (
    <div>
      <div style={{ background: 'var(--ink)', color: 'var(--bg)', borderRadius: 18, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Today's target · 5′7″ · 160 lb · Recomp</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 42, fontWeight: 400, lineHeight: 1, marginBottom: 4 }}>
          {Math.round(totals.cal)}<span style={{ fontSize: 20, opacity: 0.45, fontStyle: 'italic' }}> / {TARGETS.cal} kcal</span>
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 18 }}>
          {TARGETS.cal - totals.cal > 0 ? `${TARGETS.cal - totals.cal} remaining` : `${totals.cal - TARGETS.cal} over`}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Protein', value: totals.p, target: TARGETS.p, unit: 'g' },
            { label: 'Carbs', value: totals.c, target: TARGETS.c, unit: 'g' },
            { label: 'Fat', value: totals.f, target: TARGETS.f, unit: 'g' },
          ].map(m => (
            <div key={m.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, opacity: 0.8 }}>
                <span>{m.label}</span><span>{Math.round(m.value)} / {m.target}{m.unit}</span>
              </div>
              <div style={{ height: 5, borderRadius: 4, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, m.value / m.target * 100)}%`, height: '100%', background: 'rgba(255,255,255,0.55)', borderRadius: 4, transition: 'width 0.4s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {!logWorkout && !workoutToday.session ? (
        <button onClick={() => { setLogWorkout(true); setWDraft(workoutToday); }} style={{ width: '100%', padding: 16, borderRadius: 14, border: '1px dashed var(--line)', background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, cursor: 'pointer', marginBottom: 16 }}>
          + Log today's workout
        </button>
      ) : logWorkout ? (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginBottom: 12, color: 'var(--ink)' }}>Log Today's Workout</div>
          {inp('Session (e.g. Day 1: Glutes + Hamstrings)', wDraft.session, v => setWDraft({ ...wDraft, session: v }))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {inp('Duration (min)', wDraft.duration, v => setWDraft({ ...wDraft, duration: v }), true)}
            {inp('Active kcal', wDraft.kcal, v => setWDraft({ ...wDraft, kcal: v }), true)}
            {inp('Avg HR', wDraft.avgHR, v => setWDraft({ ...wDraft, avgHR: v }), true)}
            {inp('Max HR', wDraft.maxHR, v => setWDraft({ ...wDraft, maxHR: v }), true)}
          </div>
          <textarea placeholder="Exercises, weights, notes…" value={wDraft.notes} onChange={e => setWDraft({ ...wDraft, notes: e.target.value })} rows={3}
            style={{ width: '100%', marginTop: 8, padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => setLogWorkout(false)} className="btn btn--ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button onClick={() => { saveWorkout(); setLogWorkout(false); }} className="btn btn--pink" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-2)', fontWeight: 700 }}>Today's Workout</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, marginTop: 4 }}>{workoutToday.session}</div>
            </div>
            <button className="btn btn--ghost" style={{ fontSize: 11 }} onClick={() => { setLogWorkout(true); setWDraft(workoutToday); }}>Edit</button>
          </div>
          {(workoutToday.duration || workoutToday.kcal || workoutToday.avgHR) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
              {workoutToday.duration && <div><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Duration</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>{workoutToday.duration}m</div></div>}
              {workoutToday.kcal && <div><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active kcal</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>{workoutToday.kcal}</div></div>}
              {workoutToday.avgHR && <div><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avg HR</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>{workoutToday.avgHR} bpm</div></div>}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>Logged Today</div>
        {log.length > 0 && <button className="btn btn--ghost" style={{ fontSize: 11 }} onClick={() => setState(s => ({ ...s, fitness: { ...s.fitness, nutritionByDate: { ...(s.fitness.nutritionByDate || {}), [today]: [] } } }))}>Reset</button>}
      </div>
      {log.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Nothing logged yet · click Library to add a meal</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {log.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{m.cal} kcal · {m.p}P · {m.c}C · {m.f}F</div>
              </div>
              <button onClick={() => removeMeal(i)} style={{ color: 'var(--muted)', fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 10 }}>Meal Library</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {Object.keys(MEALS).map(cat => (
          <button key={cat} onClick={() => setMealCat(cat)} style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: `1px solid ${mealCat === cat ? 'var(--ink)' : 'var(--line)'}`,
            background: mealCat === cat ? 'var(--ink)' : 'var(--card)', color: mealCat === cat ? 'var(--bg)' : 'var(--ink)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
          }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {MEALS[mealCat].map(meal => (
          <div key={meal.id} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.2 }}>{meal.name}</div>
              <button onClick={() => addMeal(meal)} className="btn btn--pink" style={{ flexShrink: 0, fontSize: 11, padding: '4px 12px' }}>Log</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 8 }}>{meal.desc}</div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{meal.cal} kcal · {meal.p}P · {meal.c}C · {meal.f}F</div>
          </div>
        ))}
      </div>
      {!customOpen ? (
        <button onClick={() => setCustomOpen(true)} style={{ width: '100%', padding: 14, borderRadius: 14, border: '1px dashed var(--line)', background: 'transparent', color: 'var(--muted)', fontStyle: 'italic', fontSize: 13, cursor: 'pointer' }}>
          + Add a custom food
        </button>
      ) : (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, marginBottom: 12 }}>Custom entry</div>
          {inp('What did you eat?', custom.name, v => setCustom({ ...custom, name: v }))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {inp('Calories', custom.cal, v => setCustom({ ...custom, cal: v }), true)}
            {inp('Protein (g)', custom.p, v => setCustom({ ...custom, p: v }), true)}
            {inp('Carbs (g)', custom.c, v => setCustom({ ...custom, c: v }), true)}
            {inp('Fat (g)', custom.f, v => setCustom({ ...custom, f: v }), true)}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => setCustomOpen(false)} className="btn btn--ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button onClick={submitCustom} className="btn btn--pink" style={{ flex: 1, justifyContent: 'center' }}>Log it</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────

// ── Log Workout Modal ─────────────────────────────────────────────────────────

function LogWorkoutModal({ onSave, onClose, initial }) {
  const [form, setForm] = useState(initial || {
    date: todayKey(), day: 2, title: 'Back + Biceps + Abs', duration: 50, notes: '',
  });
  const [isCustom, setIsCustom] = useState(initial?.day === 0);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectDay = (d) => {
    if (d === 0) { setIsCustom(true); setF('day', 0); setF('title', ''); }
    else { setIsCustom(false); setF('day', d); setF('title', WORKOUTS[d]?.title || ''); }
  };

  const save = () => {
    if (!form.title.trim()) return;
    onSave({ id: form.id || 'wl-' + Date.now(), ...form, day: +form.day, duration: +form.duration });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(58,29,40,0.42)', zIndex: 60, display: 'grid', placeItems: 'center', padding: 24, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 460, width: '100%', padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 6, background: 'var(--primary)' }} />
        <div style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Log a workout</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, margin: '4px 0 0', lineHeight: 1.1 }}>{initial?.id ? 'Edit entry' : 'New entry'}</h3>
            </div>
            <button className="btn btn--icon" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Date</div>
            <input type="date" value={form.date} onChange={e => setF('date', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card-2)', fontSize: 13.5, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Workout</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {[1,2,3,4,5].map(d => (
                <button key={d} onClick={() => selectDay(d)} style={{
                  padding: '5px 10px', borderRadius: 8, fontSize: 11, fontFamily: 'var(--font-mono)', cursor: 'pointer', border: `1px solid ${form.day === d && !isCustom ? 'var(--primary)' : 'var(--line)'}`,
                  background: form.day === d && !isCustom ? 'var(--primary)' : 'var(--card-2)',
                  color: form.day === d && !isCustom ? '#fff' : 'var(--ink-soft)',
                }}>Day {d}</button>
              ))}
              <button onClick={() => selectDay(0)} style={{
                padding: '5px 10px', borderRadius: 8, fontSize: 11, fontFamily: 'var(--font-mono)', cursor: 'pointer', border: `1px solid ${isCustom ? 'var(--primary)' : 'var(--line)'}`,
                background: isCustom ? 'var(--primary)' : 'var(--card-2)', color: isCustom ? '#fff' : 'var(--ink-soft)',
              }}>Custom</button>
            </div>
            <input value={form.title} onChange={e => setF('title', e.target.value)}
              placeholder="Workout name"
              style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card-2)', fontSize: 13.5, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Duration (min)</div>
              <input type="number" min={1} max={300} value={form.duration} onChange={e => setF('duration', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card-2)', fontSize: 13.5, fontFamily: 'var(--font-serif)', color: 'var(--ink)', outline: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Notes</div>
              <input value={form.notes} onChange={e => setF('notes', e.target.value)}
                placeholder="Optional"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card-2)', fontSize: 13.5, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn--pink" onClick={save}><Icon name="check" size={14}/> Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({ fitness, setState, onSwitchTab }) {
  const GOAL_ZONES = [
    { key: 'glutes', label: 'Glutes', emoji: '🍑', color: 'var(--primary)' },
    { key: 'arms', label: 'Arms', emoji: '💪', color: 'var(--accent-1)' },
    { key: 'core', label: 'Core', emoji: '✂️', color: 'var(--accent-3)' },
    { key: 'back', label: 'Back', emoji: '🏋️', color: 'var(--accent-2)' },
  ];

  const today = todayKey();
  const latestWeight = fitness.weightLog?.slice(-1)[0]?.weight || 160;
  const [newWeight, setNewWeight] = useState('');
  const [photoView, setPhotoView] = useState(null);
  const [logModal, setLogModal] = useState(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  // Which workout day is today?
  const dayOfWeekIdx = (new Date().getDay() + 6) % 7; // 0=Mon
  const workoutDayMap = [1, 2, null, 3, 4, 5, null];
  const todayWorkoutDay = workoutDayMap[dayOfWeekIdx];
  const todayWorkout = todayWorkoutDay ? WORKOUTS[todayWorkoutDay] : null;

  const logWeight = () => {
    if (!newWeight) return;
    setState(s => ({ ...s, fitness: { ...s.fitness, weightLog: [...(s.fitness.weightLog || []), { date: today, weight: +newWeight }] } }));
    setNewWeight('');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await compressImage(file);
    setState(s => ({ ...s, fitness: { ...s.fitness, progressPhotos: [...(s.fitness.progressPhotos || []), { id: `ph-${Date.now()}`, date: today, dataUrl, note: '' }] } }));
    e.target.value = '';
  };

  const deletePhoto = (id) => {
    setState(s => ({ ...s, fitness: { ...s.fitness, progressPhotos: (s.fitness.progressPhotos || []).filter(p => p.id !== id) } }));
    setPhotoView(null);
  };

  const saveWorkoutLog = (entry) => {
    setState(s => {
      const log = s.fitness.workoutLog || [];
      const exists = log.findIndex(e => e.id === entry.id);
      const next = exists >= 0 ? log.map(e => e.id === entry.id ? entry : e) : [...log, entry];
      return { ...s, fitness: { ...s.fitness, workoutLog: next } };
    });
    setLogModal(null);
    setEditingLog(null);
  };

  const deleteWorkoutLog = (id) => {
    setState(s => ({ ...s, fitness: { ...s.fitness, workoutLog: (s.fitness.workoutLog || []).filter(e => e.id !== id) } }));
  };

  const workoutLog = [...(fitness.workoutLog || [])].sort((a, b) => b.date.localeCompare(a.date));
  const watchWorkouts = (fitness.watchWorkouts || []).slice(-5).reverse();
  const photos = [...(fitness.progressPhotos || [])].sort((a, b) => b.date.localeCompare(a.date));

  // Build week strip Mon-Sun
  const weekDays = (() => {
    const d = new Date();
    const mondayOff = (d.getDay() + 6) % 7;
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(d);
      day.setDate(d.getDate() - mondayOff + i);
      return day.toISOString().slice(0, 10);
    });
  })();
  const loggedDates = new Set(workoutLog.map(e => e.date));
  const watchDates = new Set((fitness.watchWorkouts || []).map(w => w.date));
  const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const isRestDay = [false, false, true, false, false, false, true];

  return (
    <div className="bento">

      {/* TODAY'S WORKOUT — full width */}
      <div className="card col-12" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Today's Workout</div>
            {todayWorkout ? (
              <>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '0 0 4px', color: 'var(--ink)' }}>
                  Day {todayWorkoutDay} — {todayWorkout.title}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 4 }}>{todayWorkout.subtitle}</div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{todayWorkout.duration} · {todayWorkout.exercises.length} exercises</div>
              </>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '0 0 4px', color: 'var(--ink)' }}>Rest Day</h3>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>No lifting today. Focus on recovery, stretch, and hydration.</div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end' }}>
            {todayWorkout && (
              <button className="btn btn--pink" onClick={() => onSwitchTab('train')} style={{ whiteSpace: 'nowrap' }}>
                Start Workout →
              </button>
            )}
            <button className="btn btn--ghost" onClick={() => setLogModal({ date: today, day: todayWorkoutDay || 0, title: todayWorkout?.title || '', duration: 50, notes: '' })} style={{ fontSize: 12 }}>
              {todayWorkout ? 'Already done — Log it' : '+ Log a workout'}
            </button>
          </div>
        </div>
      </div>

      {/* MIDDLE LEFT — week strip + history */}
      <div className="card col-7" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>This Week</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {weekDays.map((dateStr, i) => {
              const logged = loggedDates.has(dateStr) || watchDates.has(dateStr);
              const isToday = dateStr === today;
              const entry = workoutLog.find(e => e.date === dateStr);
              return (
                <div key={i} title={entry ? entry.title : isRestDay[i] ? 'Rest' : ''} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: isToday ? 'var(--primary)' : 'var(--muted)', fontWeight: isToday ? 700 : 400 }}>{WEEK_LABELS[i]}</div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700,
                    background: logged ? 'var(--primary)' : isRestDay[i] ? 'var(--card-2)' : 'transparent',
                    border: `1.5px solid ${isToday ? 'var(--primary)' : logged ? 'var(--primary)' : 'var(--line)'}`,
                    color: logged ? '#fff' : isToday ? 'var(--primary)' : 'var(--muted)',
                  }}>
                    {logged ? '✓' : isRestDay[i] ? '–' : ''}
                  </div>
                  {entry && <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textAlign: 'center', maxWidth: 32, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.title.split(' ')[0]}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Recent History</div>
            <button className="btn btn--ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => setLogModal({ date: today, day: todayWorkoutDay || 0, title: todayWorkout?.title || '', duration: 50, notes: '' })}>
              + Log a workout
            </button>
          </div>
          {workoutLog.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>No workouts logged yet. Hit "Log a workout" to get started.</div>
          ) : (
            workoutLog.slice(0, 5).map(entry => (
              <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid var(--line)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{entry.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {entry.date} · {entry.duration}min{entry.day ? ` · Day ${entry.day}` : ''}
                  </div>
                  {entry.notes && <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{entry.notes}</div>}
                </div>
                <button onClick={() => { setEditingLog(entry); setLogModal(entry); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, fontSize: 12 }}>✏</button>
                <button onClick={() => deleteWorkoutLog(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, fontSize: 16, lineHeight: 1 }}>×</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MIDDLE RIGHT — compact body stats + goals */}
      <div className="card col-5" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <CardHead title="Body stats" sub="Track your progress" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 500 }}>{latestWeight}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>lb</span>
            </div>
            <div style={{ flex: 1 }}>
              <WeightSparkline log={fitness.weightLog || []} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" placeholder="Log weight" value={newWeight} onChange={e => setNewWeight(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && logWeight()}
              style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13 }} />
            <button onClick={logWeight} className="btn btn--pink" style={{ padding: '6px 12px' }}>Log</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 12 }}>
            {[{key:'waist',label:'Waist'},{key:'arms',label:'Arms'},{key:'glutes',label:'Glutes'},{key:'hips',label:'Hips'}].map(m => (
              <div key={m.key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{m.label}</div>
                <input type="number" value={fitness.measurements?.[m.key] || ''} placeholder="—"
                  onChange={e => setState(s => ({ ...s, fitness: { ...s.fitness, measurements: { ...(s.fitness.measurements || {}), [m.key]: +e.target.value, date: today } } }))}
                  style={{ width: '100%', padding: '4px 6px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-serif)', fontSize: 15, textAlign: 'center' }} />
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>in</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Body Goals</div>
          {GOAL_ZONES.map(g => {
            const current = +(fitness.measurements?.[g.key] || 0);
            const target = +(fitness.goals?.[g.key] || 0);
            const pct = (current && target) ? Math.min(100, Math.round((current / target) * 100)) : 0;
            return (
              <div key={g.key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: g.color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{g.emoji} {g.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="number" value={target || ''} placeholder="target"
                      onChange={e => setState(s => ({ ...s, fitness: { ...s.fitness, goals: { ...(s.fitness.goals || {}), [g.key]: +e.target.value } } }))}
                      style={{ width: 52, padding: '3px 6px', border: '1px solid var(--line)', borderRadius: 7, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'center' }} />
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>in</span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: g.color, borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
                {pct > 0 && <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 2 }}>{pct}% of goal</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* SLEEP & RECOVERY TIPS — collapsible */}
      <div className="card col-12" style={{ padding: 20 }}>
        <button onClick={() => setTipsOpen(o => !o)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Sleep & Recovery Tips</div>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{tipsOpen ? '▲' : '▼'}</span>
        </button>
        {tipsOpen && (
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { icon: '🌙', title: 'Aim for 7–9 hours', body: 'Sleep is when muscle repair happens. Less than 6 hours = elevated cortisol and reduced fat loss.' },
              { icon: '📵', title: 'Screen-free wind down', body: 'Put your phone down 30 min before bed. Blue light suppresses melatonin production.' },
              { icon: '🌡️', title: 'Cool room = better sleep', body: 'Keep your room around 65–68°F. Body temperature drops as you fall asleep.' },
              { icon: '🧘', title: 'Stretch on rest days', body: 'Light hip flexor and hamstring work on rest days keeps you mobile and reduces soreness.' },
              { icon: '💧', title: 'Hydrate before bed', body: '16 oz of water before sleeping helps with overnight recovery and morning energy.' },
              { icon: '☕', title: 'Cut caffeine by 2pm', body: 'Caffeine has a 5-hour half-life. An afternoon coffee can still disrupt sleep quality at 10pm.' },
            ].map((tip, i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'var(--card-2)', borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{tip.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{tip.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{tip.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Photos */}
      <div className="card col-12" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <CardHead title="Progress photos" sub="Document your transformation" />
          <label style={{ cursor: 'pointer' }}>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            <span className="btn btn--ghost" style={{ fontSize: 12 }}>+ Add photo</span>
          </label>
        </div>
        {photos.length === 0 ? (
          <div className="empty">Upload progress photos to track your transformation over time</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
            {photos.map(photo => (
              <div key={photo.id} style={{ cursor: 'pointer' }} onClick={() => setPhotoView(photo)}>
                <img src={photo.dataUrl} alt={photo.date} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 10, display: 'block', border: '1px solid var(--line)' }} />
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textAlign: 'center', marginTop: 4 }}>{photo.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apple Watch */}
      <div className="card col-12" style={{ padding: 20 }}>
        <CardHead title="Apple Watch log" sub="Auto-logged via Health Auto Export" right={<Pill tone="mint" mono>Auto</Pill>} />
        {watchWorkouts.length === 0 ? (
          <div className="empty">Workouts will appear here after Health Auto Export syncs</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {watchWorkouts.map((w, i) => {
              const realIdx = (fitness.watchWorkouts || []).length - 1 - i;
              return <WatchWorkoutCard key={i} w={w} onSave={patch => setState(s => {
                const arr = [...(s.fitness.watchWorkouts || [])];
                arr[realIdx] = { ...arr[realIdx], ...patch };
                return { ...s, fitness: { ...s.fitness, watchWorkouts: arr } };
              })} />;
            })}
          </div>
        )}
      </div>

      {/* Photo lightbox */}
      {photoView && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setPhotoView(null)}>
          <div style={{ maxWidth: 380, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <img src={photoView.dataUrl} alt={photoView.date} style={{ width: '100%', borderRadius: 14, display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                {new Date(photoView.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <button onClick={() => deletePhoto(photoView.id)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Delete</button>
            </div>
            <button onClick={() => setPhotoView(null)} style={{ position: 'absolute', top: -14, right: -14, width: 30, height: 30, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}

      {/* Log workout modal */}
      {logModal !== null && (
        <LogWorkoutModal
          initial={logModal}
          onSave={saveWorkoutLog}
          onClose={() => { setLogModal(null); setEditingLog(null); }}
        />
      )}
    </div>
  );
}

// ── Watch Workout Card (with inline edit for correcting bad Apple Watch data) ──

function WatchWorkoutCard({ w, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ duration: w.duration, calories: w.calories });
  const emoji = w.type?.includes('Strength') || w.type?.includes('Weight') ? '🏋️' : w.type?.includes('Run') ? '🏃' : '⚡';

  const save = () => {
    onSave({ duration: Number(draft.duration) || 0, calories: Number(draft.calories) || 0 });
    setEditing(false);
  };

  if (editing) return (
    <div style={{ padding: 14, background: 'var(--bg)', border: '1.5px solid var(--primary)', borderRadius: 12 }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--ink)', marginBottom: 8 }}>{w.type}</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>min</div>
          <input type="number" value={draft.duration} onChange={e => setDraft(d => ({ ...d, duration: e.target.value }))}
            style={{ width: '100%', padding: '5px 7px', border: '1px solid var(--line)', borderRadius: 7, background: 'var(--card)', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--ink)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>kcal</div>
          <input type="number" value={draft.calories} onChange={e => setDraft(d => ({ ...d, calories: e.target.value }))}
            style={{ width: '100%', padding: '5px 7px', border: '1px solid var(--line)', borderRadius: 7, background: 'var(--card)', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--ink)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={save} style={{ flex: 1, padding: '5px 0', borderRadius: 7, border: 0, background: 'var(--primary)', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
        <button onClick={() => setEditing(false)} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid var(--line)', background: 'transparent', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
      </div>
    </div>
  );

  const flagged = w.duration > 240 || (w.calories === 0 && w.duration > 0);

  return (
    <div style={{ padding: 14, background: flagged ? '#fff8f0' : 'var(--bg)', border: `1px solid ${flagged ? '#f4a261' : 'var(--line)'}`, borderRadius: 12, position: 'relative' }}>
      <button onClick={() => { setDraft({ duration: w.duration, calories: w.calories }); setEditing(true); }}
        title="Correct this entry"
        style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 2, lineHeight: 1 }}>
        <Icon name="edit" size={12} />
      </button>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginBottom: 2 }}>{w.type}</div>
      {flagged && (
        <div style={{ fontSize: 10, color: '#d4843a', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 4 }}>⚠ Data import issue — click ✏ to correct</div>
      )}
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        {w.duration}min · {w.calories} kcal{w.heartRate ? ` · ${w.heartRate} bpm` : ''}
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{w.date}</div>
    </div>
  );
}

// ── Main FitnessView ──────────────────────────────────────────────────────────

export default function FitnessView({ state, setState }) {
  const [tab, setTab] = useState('overview');
  const fitness = state.fitness || {};
  const today = todayKey();
  const log = fitness.nutritionByDate?.[today] || [];
  const totals = log.reduce((a, m) => ({ cal: a.cal + m.cal, p: a.p + m.p }), { cal: 0, p: 0 });
  const weekStart = (() => { const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d.toISOString().slice(0, 10); })();
  const weekWorkouts = (fitness.workoutLog || []).filter(w => w.date >= weekStart).length;

  const sleepLog = fitness.sleepLog || [];
  const lastSleep = sleepLog.length > 0 ? [...sleepLog].sort((a, b) => b.date.localeCompare(a.date))[0] : null;

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'train', label: 'Train' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'sleep', label: 'Sleep' },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Personal OS · Fitness</div>
          <h1 className="page-head__title">The Routine.</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, maxWidth: 420, lineHeight: 1.5 }}>
            Four lifting days plus an optional core + cardio session. Skip office days. Days 1–4 cycle in order.
          </p>
        </div>
        <div className="row gap-md">
          <Pill tone="pink" mono>{weekWorkouts} workouts logged</Pill>
          <Pill tone="mint" mono>{fitness.weightLog?.slice(-1)[0]?.weight || 160} lb</Pill>
          <Pill tone="sun" mono>{Math.round(totals.cal)}/{TARGETS.cal} kcal</Pill>
          {lastSleep && <Pill tone="lilac" mono>{lastSleep.hours}h sleep</Pill>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: 'var(--line)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: tab === t.id ? 'var(--card)' : 'transparent',
            color: tab === t.id ? 'var(--ink)' : 'var(--muted)',
            fontWeight: tab === t.id ? 600 : 500, fontSize: 13,
            boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab fitness={fitness} setState={setState} onSwitchTab={setTab} />}
      {tab === 'sleep' && <div className="bento"><div className="card col-8" style={{ padding: 20 }}><SleepTab fitness={fitness} setState={setState} /></div><div className="card col-4" style={{ padding: 20 }}><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Sleep tips</div><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{['Aim for 7.5–9h per night','Consistent wake time matters more than bedtime','Avoid screens 30 min before bed','Cool room = deeper sleep (65–68°F)','Magnesium glycinate before bed can help'].map((tip, i) => (<div key={i} style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, borderLeft: '3px solid var(--primary)' }}>{tip}</div>))}</div><div style={{ marginTop: 20, padding: 14, background: 'var(--bg)', borderRadius: 12, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>Sleep is when your muscles actually grow. Non-negotiable for the glute goals.</div></div></div>}
      {tab === 'train' && <div className="bento"><div className="card col-8" style={{ padding: 20 }}><TrainTab fitness={fitness} setState={setState} /></div><div className="card col-4" style={{ padding: 20 }}><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Your Program</div>{[1, 2, 3, 4, 5].map(n => (<div key={n} style={{ padding: '10px 0', borderBottom: '1px dashed var(--line)', fontSize: 13 }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginRight: 8 }}>Day {n}</span><span style={{ color: 'var(--ink)', fontWeight: 500 }}>{WORKOUTS[n].title}</span></div>))}<div style={{ marginTop: 16, padding: 14, background: 'var(--bg)', borderRadius: 12, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>Consistency over intensity. Always.</div></div></div>}
      {tab === 'nutrition' && <div className="bento"><div className="card col-8" style={{ padding: 20 }}><NutritionTab fitness={fitness} setState={setState} /></div><div className="card col-4" style={{ padding: 20 }}><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Daily Targets</div>{[{ label: 'Calories', value: TARGETS.cal, unit: 'kcal', color: 'var(--accent-1)' }, { label: 'Protein', value: TARGETS.p, unit: 'g', color: 'var(--primary)' }, { label: 'Carbs', value: TARGETS.c, unit: 'g', color: 'var(--accent-2)' }, { label: 'Fat', value: TARGETS.f, unit: 'g', color: 'var(--accent-3)' }].map(t => (<MacroBar key={t.label} label={t.label} value={totals[t.label.toLowerCase().slice(0, 1)] || 0} target={t.value} unit={t.unit} color={t.color} />))}<div style={{ marginTop: 20, padding: 14, background: 'var(--bg)', borderRadius: 12 }}><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Goal</div><div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>Recomp — build muscle, lose fat simultaneously. High protein keeps you full and preserves muscle in a slight deficit.</div></div></div></div>}
    </>
  );
}
