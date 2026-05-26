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
      {/* Day selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {[1,2,3,4,5].map(n => (
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

      {/* Day header */}
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

      {/* Warm-up */}
      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>Warm-up</div>
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 16, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
        {w.warmup}
      </div>

      {/* Exercises */}
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
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.12em' }}>0{i+1}</span>
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

      {/* Finisher */}
      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>Finisher</div>
      <div style={{ background: 'var(--ink)', color: 'var(--bg)', borderRadius: 14, padding: 16, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        {w.finisher}
      </div>

      <div style={{ background: 'var(--card)', border: '1px dashed var(--line)', borderRadius: 14, padding: 16, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>
        When your last set hits the top of the rep range with 2 reps in reserve, go up. For glutes that means more weight. For upper body — leave the 10 lb shelf. Your back, chest, and shoulders can handle more.
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
      {/* Macro summary */}
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

      {/* Log today's workout */}
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

      {/* Today's food log */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>Logged Today</div>
        {log.length > 0 && <button className="btn btn--ghost" style={{ fontSize: 11 }} onClick={() => setState(s => ({ ...s, fitness: { ...s.fitness, nutritionByDate: { ...(s.fitness.nutritionByDate || {}), [today]: [] } } }))}>Reset</button>}
      </div>
      {log.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Nothing logged yet · tap Library to add a meal</div>
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

      {/* Meal library */}
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
          {inp("What did you eat?", custom.name, v => setCustom({ ...custom, name: v }))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {inp("Calories", custom.cal, v => setCustom({ ...custom, cal: v }), true)}
            {inp("Protein (g)", custom.p, v => setCustom({ ...custom, p: v }), true)}
            {inp("Carbs (g)", custom.c, v => setCustom({ ...custom, c: v }), true)}
            {inp("Fat (g)", custom.f, v => setCustom({ ...custom, f: v }), true)}
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

function OverviewTab({ fitness, setState }) {
  const GOAL_ZONES = [
    { key: 'glutes', label: 'Glutes', emoji: '🍑', color: 'var(--primary)' },
    { key: 'arms', label: 'Arms', emoji: '💪', color: 'var(--accent-1)' },
    { key: 'core', label: 'Core', emoji: '✂️', color: 'var(--accent-3)' },
    { key: 'back', label: 'Back', emoji: '🏋️', color: 'var(--accent-2)' },
  ];

  const today = todayKey();
  const latestWeight = fitness.weightLog?.slice(-1)[0]?.weight || 160;
  const [newWeight, setNewWeight] = useState('');

  const logWeight = () => {
    if (!newWeight) return;
    setState(s => ({
      ...s, fitness: {
        ...s.fitness,
        weightLog: [...(s.fitness.weightLog || []), { date: today, weight: +newWeight }],
      },
    }));
    setNewWeight('');
  };

  const watchWorkouts = (fitness.watchWorkouts || []).slice(-5).reverse();

  return (
    <div className="bento">
      {/* Body stats */}
      <div className="card col-6" style={{ padding: 20 }}>
        <CardHead title="Body stats" sub="Track your progress" />
        <div style={{ marginBottom: 16 }}>
          <WeightSparkline log={fitness.weightLog || []} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 500 }}>{latestWeight}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>lb</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="number" placeholder="Log weight" value={newWeight} onChange={e => setNewWeight(e.target.value)}
            style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13 }} />
          <button onClick={logWeight} className="btn btn--pink" style={{ padding: '7px 14px' }}>Log</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          {[
            { key: 'waist', label: 'Waist', unit: '"' },
            { key: 'arms', label: 'Arms', unit: '"' },
            { key: 'glutes', label: 'Glutes', unit: '"' },
            { key: 'hips', label: 'Hips', unit: '"' },
          ].map(m => (
            <div key={m.key}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{m.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="number" value={fitness.measurements?.[m.key] || ''} placeholder="0"
                  onChange={e => setState(s => ({ ...s, fitness: { ...s.fitness, measurements: { ...(s.fitness.measurements || {}), [m.key]: +e.target.value, date: today } } }))}
                  style={{ width: 60, padding: '5px 8px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-serif)', fontSize: 16 }} />
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{m.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal zones */}
      <div className="card col-6" style={{ padding: 20 }}>
        <CardHead title="Goal zones" sub="Progress toward your goals" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {GOAL_ZONES.map(g => (
            <div key={g.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{g.emoji} {g.label}</div>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{fitness.goals?.[g.key] || 0}%</span>
              </div>
              <input type="range" min={0} max={100} value={fitness.goals?.[g.key] || 0}
                onChange={e => setState(s => ({ ...s, fitness: { ...s.fitness, goals: { ...(s.fitness.goals || {}), [g.key]: +e.target.value } } }))}
                style={{ width: '100%', accentColor: g.color, marginBottom: 6 }} />
              <Editable value={fitness.goalNotes?.[g.key] || ''} placeholder="Add a note..."
                onChange={v => setState(s => ({ ...s, fitness: { ...s.fitness, goalNotes: { ...(s.fitness.goalNotes || {}), [g.key]: v } } }))}
                style={{ fontSize: 12, color: 'var(--ink-soft)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Apple Watch */}
      <div className="card col-12" style={{ padding: 20 }}>
        <CardHead title="Apple Watch log" sub="Auto-logged via Health Auto Export" right={<Pill tone="mint" mono>Auto</Pill>} />
        {watchWorkouts.length === 0 ? (
          <div className="empty">Workouts will appear here after Health Auto Export syncs</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {watchWorkouts.map((w, i) => (
              <div key={i} style={{ padding: 14, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 12 }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{w.type?.includes('Strength') || w.type?.includes('Weight') ? '🏋️' : w.type?.includes('Run') ? '🏃' : '⚡'}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginBottom: 2 }}>{w.type}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  {w.duration}min · {w.calories} kcal{w.heartRate ? ` · ${w.heartRate} bpm` : ''}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{w.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
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
  const weekWorkouts = Object.values(fitness.workoutByDate || {}).filter(w => w.session).length;

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'train', label: 'Train' },
    { id: 'nutrition', label: 'Nutrition' },
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
        </div>
      </div>

      {/* Tab bar */}
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

      {tab === 'overview' && <OverviewTab fitness={fitness} setState={setState} />}
      {tab === 'train' && <div className="bento"><div className="card col-8" style={{ padding: 20 }}><TrainTab fitness={fitness} setState={setState} /></div><div className="card col-4" style={{ padding: 20 }}><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Your Program</div>{[1,2,3,4,5].map(n => (<div key={n} style={{ padding: '10px 0', borderBottom: '1px dashed var(--line)', fontSize: 13 }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginRight: 8 }}>Day {n}</span><span style={{ color: 'var(--ink)', fontWeight: 500 }}>{WORKOUTS[n].title}</span></div>))}<div style={{ marginTop: 16, padding: 14, background: 'var(--bg)', borderRadius: 12, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>Consistency over intensity. Always.</div></div></div>}
      {tab === 'nutrition' && <div className="bento"><div className="card col-8" style={{ padding: 20 }}><NutritionTab fitness={fitness} setState={setState} /></div><div className="card col-4" style={{ padding: 20 }}><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Daily Targets</div>{[{ label: 'Calories', value: TARGETS.cal, unit: 'kcal', color: 'var(--accent-1)' }, { label: 'Protein', value: TARGETS.p, unit: 'g', color: 'var(--primary)' }, { label: 'Carbs', value: TARGETS.c, unit: 'g', color: 'var(--accent-2)' }, { label: 'Fat', value: TARGETS.f, unit: 'g', color: 'var(--accent-3)' }].map(t => (<MacroBar key={t.label} label={t.label} value={totals[t.label.toLowerCase().slice(0,1)] || 0} target={t.value} unit={t.unit} color={t.color} />))}<div style={{ marginTop: 20, padding: 14, background: 'var(--bg)', borderRadius: 12 }}><div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Goal</div><div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>Recomp — build muscle, lose fat simultaneously. High protein keeps you full and preserves muscle in a slight deficit.</div></div></div></div>}
    </>
  );
}
