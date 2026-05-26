'use client';

import { useState } from 'react';
import { cls, DAYS_OF_WEEK } from '@/lib/helpers';
import { CardHead, Pill, burstConfetti, Editable } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

// ── Wash Day Data (8 full weeks) ──────────────────────────────────────────────

const HAIR_WEEKS = {
  1: {
    label: 'Week 1', subtitle: 'Post-Smoothing — Recovery Mode',
    tag: 'RECOVERY', tagTone: 'mint',
    shampoo: 'Design Essentials Almond & Avocado (moisturizing)',
    dc: 'Amika Hydro Rush (blue) — pure moisture only',
    notes: 'You just completed your smoothing treatment. Pure moisture and zero protein stress for the next several weeks. Be gentle, be consistent.',
    washDaySteps: [
      { id: 'prepoo', label: 'Pre-Poo (30–60 min before shower)', steps: ['Apply Sunny Isle JBCO from mid-shaft to ends', 'Apply The Ordinary Density Serum to scalp', 'Massage with scalp tool for 5 full minutes', 'Cover with plastic cap and let it sit'] },
      { id: 'cleanse', label: 'Cleanse', steps: ['Shampoo: Design Essentials Almond & Avocado', 'Focus entirely on your scalp — do not scrub the ends', 'Let the suds rinse through the ends naturally'] },
      { id: 'dc', label: 'Deep Condition', steps: ['DC: Amika Hydro Rush (blue)', 'Divide hair into 4–6 sections', 'Apply generously mid-shaft to ends — not scalp', 'Plastic cap + heat cap — 30 minutes mandatory', 'Rinse with COOL water to close the cuticle'] },
      { id: 'seal', label: 'Cuticle Seal — Every Week', steps: ['Apply Redken Acidic Bonding Concentrate as rinse-out', 'Distribute through hair, leave 2 minutes, rinse', 'Physically closes your raised high porosity cuticle before heat'] },
      { id: 'lco', label: 'LCO Application', steps: ['Towel blot gently — do not rub', 'L: Mizani 25 Miracle Milk leave-in', 'C: TGIN Butter Cream Daily Moisturizer', 'O: Sunny Isle JBCO mid-shaft to ends ONLY (not scalp)', 'Cream before oil — seals moisture in'] },
      { id: 'heat', label: 'Heat Styling', steps: ['Thermal protectant spray over each section', 'Blow dry MEDIUM heat — tension method', 'Mizani Press Agent Serum before flat iron', 'Flat iron: ONE slow pass — do not chase it', 'Let each section cool before touching'] },
    ],
  },
  2: {
    label: 'Week 2', subtitle: 'Still in Smoothing Recovery',
    tag: 'MOISTURE', tagTone: 'mint',
    shampoo: 'Design Essentials Almond & Avocado',
    dc: 'Listen to your hair — Amika OR Biolage',
    notes: 'Start reading your hair\'s signals. Soft, limp, pliable? → Amika Hydro Rush. Weak, stretchy, snapping? → Biolage Don\'t Despair Repair (light protein). This is how you learn your hair.',
    washDaySteps: [
      { id: 'prepoo', label: 'Pre-Poo', steps: ['Sunny Isle JBCO mid-shaft to ends', 'The Ordinary Density Serum to scalp', '5-minute scalp massage', 'Plastic cap on while you wait'] },
      { id: 'cleanse', label: 'Cleanse', steps: ['Design Essentials Almond & Avocado', 'Scalp focus only — no scrubbing the ends'] },
      { id: 'dc', label: 'Deep Condition', steps: ['Dry/limp/soft → Amika Hydro Rush', 'Weak/stretchy/snapping → Biolage Don\'t Despair', 'Section by section, mid-shaft to ends', 'Plastic cap + heat cap — 30 min', 'Cool water rinse'] },
      { id: 'seal', label: 'Cuticle Seal', steps: ['Redken ABC — 2 min, rinse', 'Every single week regardless of what else changes'] },
      { id: 'lco', label: 'LCO Application', steps: ['Towel blot gently', 'Mizani 25 Miracle Milk (L)', 'TGIN Butter Cream (C)', 'Sunny Isle JBCO ends only (O)'] },
      { id: 'heat', label: 'Heat Styling', steps: ['Thermal protectant spray', 'Blow dry medium heat', 'Press Agent Serum before flat iron', 'One slow pass — no repeats'] },
    ],
  },
  3: {
    label: 'Week 3', subtitle: 'Moisture-Only Continues',
    tag: 'MOISTURE', tagTone: 'mint',
    shampoo: 'Design Essentials Almond & Avocado',
    dc: 'Listen to your hair — Amika or Biolage',
    notes: 'By now your hair should feel noticeably more responsive. Temple area should be showing less breakage — look for baby hairs as a sign your follicles are responding.',
    washDaySteps: [
      { id: 'prepoo', label: 'Pre-Poo', steps: ['Sunny Isle JBCO mid-shaft to ends', 'Density Serum to scalp', '5-minute scalp massage', 'Plastic cap on while you wait'] },
      { id: 'cleanse', label: 'Cleanse', steps: ['Design Essentials Almond & Avocado', 'Scalp only — suds rinse through ends'] },
      { id: 'dc', label: 'Deep Condition', steps: ['Dry/limp → Amika Hydro Rush', 'Weak/stretchy → Biolage Don\'t Despair', 'Mid-shaft to ends, plastic cap', 'Heat cap — 30 min', 'Cool water rinse'] },
      { id: 'seal', label: 'Cuticle Seal', steps: ['Redken ABC — 2 min, rinse', 'Every week without exception'] },
      { id: 'lco', label: 'LCO Application', steps: ['Towel blot gently', 'Mizani 25 (L)', 'TGIN Butter (C)', 'JBCO ends only (O)'] },
      { id: 'heat', label: 'Heat Styling', steps: ['Thermal protectant spray', 'Blow dry medium heat', 'Press Agent Serum', 'One slow pass — do not re-pass'] },
    ],
  },
  4: {
    label: 'Week 4', subtitle: 'Monthly Clarify Day',
    tag: 'CLARIFY', tagTone: 'peach',
    shampoo: 'OUAI Detox Shampoo — removes a month of buildup',
    dc: 'Amika Hydro Rush — always follow clarify with pure moisture',
    notes: 'Monthly reset. Clarifying removes all product buildup — smoothing residue, LCO layers, thermal protectants. Lather twice. This is also Olaplex No. 3 day.',
    washDaySteps: [
      { id: 'prepoo', label: 'Pre-Poo — Critical on Clarify Days', steps: ['Olaplex No. 3 to damp hair first — sit 30–45 min', 'Sunny Isle JBCO generously over the No. 3', 'Density Serum to scalp', 'Scalp massage 5 min', 'Plastic cap — sit minimum 30 min'] },
      { id: 'cleanse', label: 'Cleanse', steps: ['OUAI Detox (clarifying)', 'Lather twice — first removes buildup, second cleans', 'Scalp focus'] },
      { id: 'dc', label: 'Deep Condition', steps: ['Amika Hydro Rush ONLY — pure moisture after a clarify', 'Be extra generous', 'Plastic cap + heat — 30 min', 'Cool water rinse'] },
      { id: 'seal', label: 'Cuticle Seal', steps: ['Redken ABC — especially important after clarifying', '2 min, rinse thoroughly'] },
      { id: 'lco', label: 'LCO Application', steps: ['Towel blot gently', 'Be generous — clarify strips moisture', 'Mizani 25 (L) → TGIN Butter (C) → JBCO ends (O)'] },
      { id: 'heat', label: 'Heat Styling', steps: ['Thermal protectant spray', 'Blow dry medium heat', 'Press Agent Serum', 'One slow pass — no repeats'] },
    ],
  },
  5: {
    label: 'Week 5', subtitle: 'First Light Protein — ApHogee 2 Min Keratin',
    tag: 'PROTEIN', tagTone: 'sun',
    shampoo: 'Design Essentials Almond & Avocado',
    dc: 'ApHogee 2 Min Keratin → Amika Hydro Rush (always follow protein with moisture)',
    notes: 'First protein treatment since your smoothing. Four weeks of moisture prep means your hair should be ready. Do your strand test before starting: if it still feels strong and limp, push to week 6. Trust your hair over the schedule.',
    washDaySteps: [
      { id: 'prepoo', label: 'Pre-Poo', steps: ['Sunny Isle JBCO mid-shaft to ends', 'Density Serum to scalp', '5-minute scalp massage', 'Plastic cap on while you wait'] },
      { id: 'cleanse', label: 'Cleanse', steps: ['Design Essentials Almond & Avocado', 'Scalp focus only — clean slate for the protein'] },
      { id: 'protein', label: 'Light Protein', steps: ['ApHogee 2 Min Keratin Reconstructor on soaking wet hair', 'Saturate every strand mid-shaft to ends', 'Leave 2 minutes — do not go over', 'Rinse thoroughly with warm water'] },
      { id: 'dc', label: 'Deep Condition (always after protein)', steps: ['Amika Hydro Rush immediately after protein rinse', 'Protein contracts the strand — moisture rebalances it', 'Plastic cap + heat cap — 30 min', 'Cool water rinse'] },
      { id: 'seal', label: 'Cuticle Seal', steps: ['Redken ABC — 2 min, rinse', 'Even more important after protein — locks the treatment in'] },
      { id: 'lco', label: 'LCO Application', steps: ['Towel blot gently', 'Mizani 25 (L)', 'TGIN Butter (C)', 'JBCO ends only (O)'] },
      { id: 'heat', label: 'Heat Styling', steps: ['Thermal protectant spray', 'Blow dry medium heat', 'Press Agent Serum', 'One slow pass per section'] },
    ],
  },
  6: {
    label: 'Week 6', subtitle: 'Moisture Recovery After Protein',
    tag: 'MOISTURE', tagTone: 'mint',
    shampoo: 'Design Essentials Almond & Avocado',
    dc: 'Amika Hydro Rush or Biolage — listen to your hair',
    notes: 'Back to moisture after protein week. Do your strand test: strong snap-back = balanced. Still stretching too much = another moisture week before the next protein. If your hair feels tight or stiff from last week\'s protein, Amika Hydro Rush is the right call.',
    washDaySteps: [
      { id: 'prepoo', label: 'Pre-Poo', steps: ['Sunny Isle JBCO mid-shaft to ends', 'Density Serum to scalp', '5-minute scalp massage', 'Plastic cap on while you wait'] },
      { id: 'cleanse', label: 'Cleanse', steps: ['Design Essentials Almond & Avocado', 'Scalp only'] },
      { id: 'dc', label: 'Deep Condition', steps: ['Tight/dry/stiff from protein → Amika Hydro Rush', 'Balanced → Amika or Biolage based on strand test', 'Plastic cap + heat cap — 30 min', 'Cool water rinse'] },
      { id: 'seal', label: 'Cuticle Seal', steps: ['Redken ABC — 2 min, rinse'] },
      { id: 'lco', label: 'LCO Application', steps: ['Towel blot gently', 'Mizani 25 (L)', 'TGIN Butter (C)', 'JBCO ends only (O)'] },
      { id: 'heat', label: 'Heat Styling', steps: ['Thermal protectant spray', 'Blow dry medium heat', 'Press Agent Serum', 'One slow pass'] },
    ],
  },
  7: {
    label: 'Week 7', subtitle: 'Second Light Protein Round',
    tag: 'PROTEIN', tagTone: 'sun',
    shampoo: 'Design Essentials Almond & Avocado',
    dc: 'ApHogee 2 Min Keratin → Amika Hydro Rush',
    notes: 'Second pass with ApHogee 2 Min. By now you know what your hair does after protein — you\'ve done it once. If last week you felt stiffness that took 3+ days to soften, use even less product this time or cut the application to 90 seconds.',
    washDaySteps: [
      { id: 'prepoo', label: 'Pre-Poo', steps: ['Sunny Isle JBCO mid-shaft to ends', 'Density Serum to scalp', '5-minute scalp massage', 'Plastic cap on while you wait'] },
      { id: 'cleanse', label: 'Cleanse', steps: ['Design Essentials Almond & Avocado', 'Clean scalp — protein applies to clean hair'] },
      { id: 'protein', label: 'Light Protein', steps: ['ApHogee 2 Min Keratin on soaking wet hair', '2 minutes exactly — set a timer', 'Rinse thoroughly with warm water'] },
      { id: 'dc', label: 'Deep Condition', steps: ['Amika Hydro Rush — generous application', 'Plastic cap + heat cap — 30 min', 'Cool water rinse'] },
      { id: 'seal', label: 'Cuticle Seal', steps: ['Redken ABC — 2 min, rinse'] },
      { id: 'lco', label: 'LCO Application', steps: ['Towel blot gently', 'Mizani 25 (L)', 'TGIN Butter (C)', 'JBCO ends only (O)'] },
      { id: 'heat', label: 'Heat Styling', steps: ['Thermal protectant spray', 'Blow dry medium heat', 'Press Agent Serum', 'One slow pass per section'] },
    ],
  },
  8: {
    label: 'Week 8', subtitle: 'Full Reset — ApHogee Two-Step + Smoothing Treatment',
    tag: 'RESET', tagTone: 'peach',
    shampoo: 'OUAI Detox Shampoo — start completely clean',
    dc: 'ApHogee Two-Step Protein Treatment → Amika Hydro Rush',
    notes: 'The big day. Hard protein + smoothing treatment in one session. This is the most intensive hair day of your 8-week cycle. Block out 3–4 hours minimum. Do NOT rush any step. Your hair will feel stiff after the Two-Step — the smoothing softens it back.',
    washDaySteps: [
      { id: 'prepoo', label: 'Pre-Poo — Apply Night Before If Possible', steps: ['Olaplex No. 3 to damp hair — 30–45 min minimum', 'Sunny Isle JBCO over the No. 3', 'Density Serum to scalp', 'Scalp massage 5 min', 'Plastic cap for duration'] },
      { id: 'cleanse', label: 'Cleanse', steps: ['OUAI Detox — lather twice', 'Hair must be completely product-free for the Two-Step to work', 'Scalp focus, then rinse everything clean'] },
      { id: 'hardprotein', label: 'ApHogee Two-Step Treatment', steps: ['Part 1 (Protein): Apply to damp hair, air dry or hooded dryer until HARD', 'Do NOT touch or manipulate during drying — it will snap', 'Rinse thoroughly when completely dry and hard', 'Part 2 (Balancer): Apply moisturizing balancer, sit 5 min, rinse', 'Hair goes from stiff → flexible again'] },
      { id: 'dc', label: 'Deep Condition — Do Not Skip', steps: ['Amika Hydro Rush — be very generous', 'Hard protein strips moisture — this step puts it back', 'Plastic cap + heat cap — 30 min minimum', 'Cool water rinse'] },
      { id: 'smoothing', label: 'Smoothing Treatment', steps: ['Apply your smoothing treatment per the product instructions', 'This is the start of your next 8-week cycle', 'Follow salon or at-home kit directions exactly'] },
      { id: 'seal', label: 'Cuticle Seal', steps: ['Redken ABC — 2 min, rinse'] },
      { id: 'lco', label: 'LCO Application', steps: ['Towel blot gently', 'Mizani 25 (L)', 'TGIN Butter (C)', 'JBCO ends only (O)'] },
      { id: 'heat', label: 'Heat Styling', steps: ['Thermal protectant spray', 'Blow dry medium heat', 'Press Agent Serum', 'One slow pass — your hair will be the smoothest it has been in 8 weeks'] },
    ],
  },
};

// ── Hairstyle Modes ───────────────────────────────────────────────────────────

const HAIR_STYLES = [
  {
    id: 'natural',
    label: 'Natural / Silk Press',
    desc: 'Full routine applies',
    icon: '🌸',
    nightlyNote: null,
    nightlyRoutine: null, // use default HAIR_NIGHTLY
    canWashDay: true,
  },
  {
    id: 'quickweave',
    label: 'Quick Weave',
    desc: 'Hair braided up, extensions glued in',
    icon: '💇',
    nightlyNote: 'Your hair is braided under the weave — skip the LCO steps. Focus on scalp care through the install and protect the extensions at night.',
    nightlyRoutine: [
      { id: 'scalp_spray', label: 'Scalp spray / oil through wefts', detail: 'Diluted JBCO or scalp spray where you can reach — part gently, don\'t disturb the install' },
      { id: 'edge_drops', label: 'Cecred Edge Drops on exposed hairline', detail: 'Gentle application only — especially temples' },
      { id: 'bonnet', label: 'Satin bonnet over the full install', detail: 'Protects extensions + your hairline from pillowcase friction' },
    ],
    canWashDay: false,
  },
  {
    id: 'sewin',
    label: 'Sew-In / Install',
    desc: 'Braids underneath, hair sewn in',
    icon: '✂️',
    nightlyNote: 'Your natural hair is braided underneath — you can reach the scalp with a spray or dropper. Focus on moisture at the braid parts and edge protection.',
    nightlyRoutine: [
      { id: 'scalp_oil', label: 'JBCO or growth tonic at braid parts', detail: 'Use dropper tip to reach scalp at the parts — don\'t saturate' },
      { id: 'edge_drops', label: 'Cecred Edge Drops on temples & hairline', detail: 'One dropper press per temple — the one thing you can still fully reach' },
      { id: 'silk_scarf', label: 'Silk scarf on hairline', detail: 'Protect your edges and lay your hairline — satin bonnet over' },
      { id: 'bonnet', label: 'Satin bonnet over scarf', detail: 'Double protection for extensions + your hairline' },
    ],
    canWashDay: false,
  },
  {
    id: 'wig',
    label: 'Wig',
    desc: 'Wig over natural hair / braids',
    icon: '👑',
    nightlyNote: 'You can access your full hair under the wig. Do the complete nightly routine before bed — put the wig away properly.',
    nightlyRoutine: null, // full routine
    canWashDay: true,
  },
  {
    id: 'braids',
    label: 'Braids / Twists',
    desc: 'Protective braided style with or without extensions',
    icon: '🌿',
    nightlyNote: 'Scalp care and edge protection only. No manipulation of the braids themselves at night.',
    nightlyRoutine: [
      { id: 'scalp_oil', label: 'JBCO or Density Serum at braid parts', detail: 'Apply with dropper at the scalp — light application only' },
      { id: 'edge_drops', label: 'Cecred Edge Drops on hairline', detail: 'Temples especially — your one exposed area' },
      { id: 'silk_scarf', label: 'Silk scarf tied at the nape', detail: 'Lay your braids back, knot at the back' },
      { id: 'bonnet', label: 'Satin bonnet over scarf', detail: 'Prevents frizz on braids and friction on your hairline' },
    ],
    canWashDay: false,
  },
];

// ── Static Reference Data ─────────────────────────────────────────────────────

const HAIR_NIGHTLY = [
  { id: 'ordinary_scalp', label: 'The Ordinary Density Serum on scalp', detail: 'Apply in sections, fingertip pad massage — 5 min circular motions' },
  { id: 'cecred_temples', label: 'Cecred Edge Drops on temples & hairline', detail: 'One dropper press per temple — gentle circles only' },
  { id: 'jbco_ends', label: 'Sunny Isle JBCO on ends', detail: '2–3 drops warmed between fingertips — light coating only' },
  { id: 'silk_scarf', label: 'Silk/satin scarf — tied at the nape', detail: 'Fold so the knot sits at the back, not over temples' },
  { id: 'bonnet', label: 'Satin bonnet over scarf', detail: 'Double-layer friction protection' },
];

const HAIR_PROT_STYLES = [
  { ok: true, style: 'Sleek low bun', note: 'Scrunchie only — never rubber band' },
  { ok: true, style: 'Half up, half down', note: 'Avoid clips that crease the hair' },
  { ok: true, style: 'Flat twists under wig', note: 'Stop ½″ before temples. Wig grip band, no gel. Max 5–7 days.' },
  { ok: true, style: 'Low silk press ponytail', note: 'Low placement only, minimal tension' },
  { ok: false, style: 'Tight cornrows at hairline', note: 'Traction risk — especially at temples' },
  { ok: false, style: 'High tension styles', note: 'Mid-shaft breakage gets worse with tension' },
  { ok: false, style: 'Edge control on temples', note: 'Oil only on that area until it recovers' },
];

const HAIR_MASTER_CYCLE = [
  { wk: 1, desc: 'Moisturizing shampoo · Amika Hydro Rush · Post-smoothing recovery', protein: false },
  { wk: 2, desc: 'Moisturizing shampoo · Amika or Biolage · Listen to your hair', protein: false },
  { wk: 3, desc: 'Moisturizing shampoo · Amika or Biolage · Listen to your hair', protein: false },
  { wk: 4, desc: 'OUAI Clarify · Amika Hydro Rush · Olaplex No. 3 · Monthly clarify', protein: false },
  { wk: 5, desc: 'Moisturizing shampoo · ApHogee 2 Min Keratin (light protein)', protein: true },
  { wk: 6, desc: 'Moisturizing shampoo · Moisture DC · Back to moisture', protein: false },
  { wk: 7, desc: 'Moisturizing shampoo · ApHogee 2 Min Keratin (light protein)', protein: true },
  { wk: 8, desc: 'OUAI Clarify · ApHogee Two-Step + Smoothing Treatment · Full reset', protein: true, big: true },
];

const HAIR_LOLA = [
  {
    name: 'Umectação Oliva — Olive Oil Deep Mask',
    tag: 'DC ROTATION', tagTone: 'mint',
    desc: 'Humectant treatment — olive oil penetrates the cortex. Use as your third DC option when hair feels extremely dry, dull, or brittle.',
    howto: ['Apply mid-shaft to ends after shampoo, plastic cap, 30 min under heat, rinse', 'SOS overnight: apply to dry hair night before wash day, loose bun, shampoo out in morning', 'Rotate in with Amika and Biolage based on strand test results'],
  },
  {
    name: 'Xapadinha — Disciplining Smoothing Mask',
    tag: 'PRESS WEEKS ONLY', tagTone: 'peach',
    desc: 'Smoothing mask reduces frizz by up to 40%. Use as your DC on weeks you\'re flat-ironing.',
    howto: ['Press weeks ONLY — do not use on natural texture or bun weeks', 'After shampoo, section by section mid-shaft to ends', 'Plastic cap + heat — 30 min', 'Rinse, then Redken ABC — locks the smoothing effect in further'],
  },
  {
    name: 'Rapunzel Tônico do Crescimento — Growth Tonic',
    tag: 'SCALP GROWTH', tagTone: 'sun',
    desc: 'Leave-on growth tonic: Jaborandi, Rosemary, Caffeine, Ginkgo, Nettle, Ginger. One of the strongest natural growth formulas.',
    howto: ['Apply to clean dry or slightly damp scalp — do NOT rinse', 'Mon / Wed / Fri → Rapunzel Tônico', 'Tue / Thu / Sat → The Ordinary Density Serum', 'Sun (wash day pre-poo) → The Ordinary Density Serum'],
  },
];

const HAIR_STRAND = [
  { result: 'Stretches and snaps back slowly', meaning: 'Balanced — maintain current routine', color: 'var(--accent-2)', key: 'balanced' },
  { result: 'Stretches a lot, goes limp or mushy', meaning: 'Moisture overload — use Biolage Don\'t Despair this week', color: 'var(--primary)', key: 'moisture' },
  { result: 'Barely stretches, snaps immediately', meaning: 'Protein deficient — use Biolage or move up your ApHogee', color: 'var(--accent-1)', key: 'protein' },
];

const HAIR_NEVER = [
  'Apply heat without your double thermal protection stack',
  'Skip wash day — weekly is non-negotiable at your heat frequency',
  'Use rubber bands anywhere in your hair',
  'Use alcohol-based edge control',
  'Do more than one flat iron pass per section',
  'Braid, clip, or apply product to your temple area',
  'Go to sleep without your oil, scarf, and bonnet',
  'Do hard protein and smoothing treatment on separate days',
];

const FEELING_EMOJI = ['', '😩', '😕', '😐', '😊', '✨'];

// ── Helpers ───────────────────────────────────────────────────────────────────

const todayKey = () => new Date().toISOString().slice(0, 10);

function LengthSparkline({ log }) {
  if (!log || log.length < 2) return null;
  const vals = log.slice(-12).map(e => e.length);
  const min = Math.min(...vals) - 0.5, max = Math.max(...vals) + 0.5;
  const range = max - min || 1;
  const w = 220, h = 48, pad = 4;
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

// ── Tab: Overview ─────────────────────────────────────────────────────────────

function OverviewTab({ hair, setState }) {
  const today = todayKey();
  const nightlyDone = (hair.nightlyDate === today) ? (hair.nightlyDone || {}) : {};
  const scalpDone = hair.scalpDays || {};

  const currentStyleId = hair.currentStyle || 'natural';
  const currentStyle = HAIR_STYLES.find(s => s.id === currentStyleId) || HAIR_STYLES[0];
  const activeRoutine = currentStyle.nightlyRoutine || HAIR_NIGHTLY;
  const nightlyCount = Object.values(nightlyDone).filter(Boolean).length;
  const scalpCount = Object.values(scalpDone).filter(Boolean).length;

  const toggleNightly = (id, e) => {
    const isChecking = !nightlyDone[id];
    if (e && isChecking) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => ({
      ...s, hair: {
        ...s.hair,
        nightlyDate: today,
        nightlyDone: { ...nightlyDone, [id]: isChecking },
      },
    }));
  };

  const toggleScalp = (day, e) => {
    const isChecking = !scalpDone[day];
    if (e && isChecking) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => ({ ...s, hair: { ...s.hair, scalpDays: { ...scalpDone, [day]: isChecking } } }));
  };

  const activeWeek = hair.activeWeek || 5;
  const week = HAIR_WEEKS[activeWeek];

  return (
    <div className="bento">
      {/* Current style selector */}
      <div className="card col-12" style={{ padding: 20 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>What's your current style?</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {HAIR_STYLES.map(s => (
            <button key={s.id} onClick={() => setState(st => ({ ...st, hair: { ...st.hair, currentStyle: s.id, nightlyDone: {}, nightlyDate: '' } }))} style={{
              padding: '10px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              border: `1.5px solid ${currentStyleId === s.id ? 'var(--primary)' : 'var(--line)'}`,
              background: currentStyleId === s.id ? 'var(--bg)' : 'var(--card)',
              boxShadow: currentStyleId === s.id ? '0 0 0 3px rgba(232,82,122,0.12)' : 'none',
              transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: currentStyleId === s.id ? 'var(--primary)' : 'var(--ink)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.desc}</div>
            </button>
          ))}
        </div>
        {currentStyle.nightlyNote && (
          <div style={{ marginTop: 14, padding: 12, background: 'var(--accent-1-soft, #fde3cf)', borderRadius: 10, fontSize: 13, color: 'var(--ink)', lineHeight: 1.6, borderLeft: '3px solid var(--accent-1)' }}>
            {currentStyle.nightlyNote}
          </div>
        )}
        {!currentStyle.canWashDay && (
          <div style={{ marginTop: 10, padding: 10, background: 'var(--bg)', borderRadius: 10, fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
            Wash day protocol is paused while your hair is installed. Focus on scalp care and edge protection.
          </div>
        )}
      </div>

      {/* Temple alert */}
      <div className="col-12" style={{ background: '#fff8f0', border: '1px solid #f4c27a', borderLeft: '4px solid var(--accent-1)', borderRadius: 14, padding: '14px 18px' }}>
        <div className="row gap-sm" style={{ alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>⚠</span>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8b4f1c', fontWeight: 700, marginBottom: 3 }}>Temple Priority Zone</div>
            <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.55 }}>Zero product on temples except nightly oil. No braids, no edge control, no clips within ½″ of your hairline.</div>
          </div>
        </div>
      </div>

      {/* Current week summary */}
      <div className="card col-6" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>Current week</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500 }}>{week.label}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{week.subtitle}</div>
          </div>
          <Pill tone={week.tagTone} mono>{week.tag}</Pill>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 14 }}>
          {[1,2,3,4,5,6,7,8].map(n => (
            <button key={n} onClick={() => setState(s => ({ ...s, hair: { ...s.hair, activeWeek: n } }))} style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-serif)',
              border: `1.5px solid ${n === activeWeek ? 'var(--primary)' : 'var(--line)'}`,
              background: n === activeWeek ? 'var(--primary)' : HAIR_MASTER_CYCLE[n-1]?.protein ? 'var(--accent-1-soft, #fde3cf)' : 'var(--card)',
              color: n === activeWeek ? 'white' : 'var(--ink)', cursor: 'pointer', fontWeight: 600,
            }}>{n}</button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['Shampoo', week.shampoo], ['Deep Condition', week.dc]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 12, background: 'var(--bg)', borderRadius: 10, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic' }}>
          {week.notes}
        </div>
      </div>

      {/* Nightly routine */}
      <div className="card col-6 card--pink" style={{ padding: 20 }}>
        <CardHead title="Tonight's routine" sub={currentStyle.id === 'natural' || currentStyle.id === 'wig' ? 'No water. Oil only. Every night.' : 'Adapted for your current style.'} right={<Pill tone="pink" mono>{nightlyCount}/{activeRoutine.length}</Pill>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeRoutine.map(t => {
            const done = !!nightlyDone[t.id];
            return (
              <button key={t.id} onClick={(e) => toggleNightly(t.id, e)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, textAlign: 'left',
                background: done ? 'rgba(136,184,150,0.25)' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${done ? 'var(--accent-2)' : 'transparent'}`,
                borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', color: 'inherit', width: '100%',
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                  background: done ? 'var(--accent-2)' : 'transparent',
                  border: `1.5px solid ${done ? 'var(--accent-2)' : 'var(--muted)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--ink)',
                }}>
                  {done && '✓'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: done ? '#3d6b4f' : 'var(--ink)' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{t.detail}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scalp tracker */}
      <div className="card col-12 card--mint" style={{ padding: 20 }}>
        <CardHead title="Scalp massage tracker" sub="Density Serum · 5 min minimum" right={<Pill tone="mint" mono>{scalpCount}/3–4</Pill>} />
        <div className="gym-grid" style={{ marginBottom: 12 }}>
          {DAYS_OF_WEEK.map(day => {
            const done = !!scalpDone[day];
            return (
              <button key={day} onClick={(e) => toggleScalp(day, e)} className={cls('gym-cell', done && 'gym-cell--done')} style={done ? { background: 'var(--accent-2)' } : {}}>
                <span className="gym-cell__day">{day}</span>
                <span className="gym-cell__icon">{done ? '🌿' : '·'}</span>
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Mon / Wed / Fri → Rapunzel Tônico · Tue / Thu / Sat → Density Serum · Sun → wash day pre-poo
        </div>
      </div>
    </div>
  );
}

// ── Tab: Wash Day ─────────────────────────────────────────────────────────────

function WashDayTab({ hair, setState }) {
  const today = todayKey();
  const activeWeek = hair.activeWeek || 5;
  const week = HAIR_WEEKS[activeWeek];
  const [expanded, setExpanded] = useState(null);
  const [logging, setLogging] = useState(false);
  const washDayLog = hair.washDayLog || [];

  const [draft, setDraft] = useState({
    date: today, week: activeWeek,
    shampoo: '', dc: '', strandTest: 'balanced', feeling: 4, notes: '',
  });

  const saveWashDay = () => {
    const entry = { id: `wd-${Date.now()}`, ...draft };
    setState(s => ({ ...s, hair: { ...s.hair, washDayLog: [...(s.hair.washDayLog || []), entry] } }));
    setLogging(false);
    setDraft({ date: today, week: activeWeek, shampoo: '', dc: '', strandTest: 'balanced', feeling: 4, notes: '' });
  };

  const removeEntry = (id) => setState(s => ({ ...s, hair: { ...s.hair, washDayLog: (s.hair.washDayLog || []).filter(e => e.id !== id) } }));

  const recentLogs = [...washDayLog].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="bento">
      {/* Steps */}
      <div className="card col-8" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <CardHead title={`${week.label} · Wash Day`} sub={week.subtitle} />
          <Pill tone={week.tagTone} mono>{week.tag}</Pill>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {week.washDaySteps.map((section, idx) => {
            const open = expanded === section.id;
            return (
              <div key={section.id} style={{ background: 'var(--card-2, var(--bg))', borderRadius: 14, border: `1px solid ${open ? 'var(--primary)' : 'var(--line)'}`, overflow: 'hidden', transition: 'border-color 0.15s' }}>
                <button onClick={() => setExpanded(open ? null : section.id)} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: open ? 'var(--primary)' : 'linear-gradient(135deg, var(--primary), var(--accent-1))', display: 'grid', placeItems: 'center', color: 'white', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{idx + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{section.label}</span>
                  </div>
                  <span style={{ color: 'var(--primary)', fontSize: 20, fontFamily: 'var(--font-serif)' }}>{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div style={{ padding: '0 14px 14px 54px', borderTop: '1px dashed var(--line)' }}>
                    {section.steps.map((step, si) => (
                      <div key={si} style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--primary)', fontSize: 13, marginTop: 1, flexShrink: 0 }}>›</span>
                        <span style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* This week products */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>This Week's Products</div>
          {[['Shampoo', week.shampoo], ['DC', week.dc], ['Cuticle Seal', 'Redken ABC — every week'], ['LCO Stack', 'Mizani 25 → TGIN Butter → JBCO ends'], ['Heat Protect', 'Thermal spray + Mizani Press Agent']].map(([label, val]) => (
            <div key={label} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Mid-week refresh */}
        <div className="card card--lilac" style={{ padding: 18 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 10 }}>Mid-Week Refresh (Day 3–4)</div>
          {['Boar bristle brush — smooth frizz, redistribute oils', 'Light JBCO over the surface with fingertips', 'Re-wrap at night as usual', 'Do NOT flat iron mid-week', 'Low bun or sleek ponytail to wash day'].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ color: 'var(--accent-3)', fontSize: 13, flexShrink: 0 }}>›</span>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log wash day */}
      <div className="card col-12" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <CardHead title="Wash day log" sub={`${washDayLog.length} wash days recorded`} />
          {!logging && <button onClick={() => setLogging(true)} className="btn btn--pink" style={{ fontSize: 12 }}>+ Log wash day</button>}
        </div>

        {logging && (
          <div style={{ background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--line)', padding: 18, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Date</div>
                <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Cycle Week</div>
                <select value={draft.week} onChange={e => setDraft({ ...draft, week: +e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13 }}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Week {n} — {HAIR_WEEKS[n].tag}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Shampoo used</div>
                <input placeholder="e.g. Design Essentials A&A" value={draft.shampoo} onChange={e => setDraft({ ...draft, shampoo: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>DC used</div>
                <input placeholder="e.g. Amika Hydro Rush" value={draft.dc} onChange={e => setDraft({ ...draft, dc: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Strand test result</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {HAIR_STRAND.map(s => (
                  <button key={s.key} onClick={() => setDraft({ ...draft, strandTest: s.key })} style={{ flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 11, cursor: 'pointer', textAlign: 'center', border: `1.5px solid ${draft.strandTest === s.key ? s.color : 'var(--line)'}`, background: draft.strandTest === s.key ? 'var(--bg)' : 'var(--card)', color: 'var(--ink)', fontFamily: 'inherit', lineHeight: 1.3 }}>
                    {s.key === 'balanced' ? '✅' : s.key === 'moisture' ? '💧' : '⚡'}<br /><span style={{ fontSize: 10, textTransform: 'capitalize' }}>{s.key}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>How did your hair feel?</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map(q => (
                  <button key={q} onClick={() => setDraft({ ...draft, feeling: q })} style={{ fontSize: 22, padding: '6px 10px', borderRadius: 10, border: `1.5px solid ${draft.feeling === q ? 'var(--primary)' : 'var(--line)'}`, background: draft.feeling === q ? 'var(--bg)' : 'transparent', cursor: 'pointer' }}>
                    {FEELING_EMOJI[q]}
                  </button>
                ))}
              </div>
            </div>
            <textarea placeholder="Notes (e.g. soft, lots of shine, temple breakage less, tried Xapadinha...)" value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} rows={2}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setLogging(false)} className="btn btn--ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={saveWashDay} className="btn btn--pink" style={{ flex: 1, justifyContent: 'center' }}>Save wash day</button>
            </div>
          </div>
        )}

        {recentLogs.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>No wash days logged yet — tap the button above to start</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentLogs.map(e => (
              <div key={e.id} style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 500 }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                      <span style={{ fontSize: 18 }}>{FEELING_EMOJI[e.feeling || 4]}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Pill tone={HAIR_WEEKS[e.week]?.tagTone || 'pink'} mono>Wk {e.week}</Pill>
                      {e.strandTest && <Pill tone={e.strandTest === 'balanced' ? 'mint' : e.strandTest === 'moisture' ? 'pink' : 'sun'} mono>{e.strandTest}</Pill>}
                    </div>
                  </div>
                  <button onClick={() => removeEntry(e.id)} style={{ color: 'var(--muted)', fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>×</button>
                </div>
                {(e.shampoo || e.dc) && (
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                    {e.shampoo && `Shampoo: ${e.shampoo}`}{e.shampoo && e.dc && ' · '}{e.dc && `DC: ${e.dc}`}
                  </div>
                )}
                {e.notes && <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>{e.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Progress ─────────────────────────────────────────────────────────────

function ProgressTab({ hair, setState }) {
  const today = todayKey();
  const lengthLog = hair.lengthLog || [];
  const [newLength, setNewLength] = useState('');
  const washDayLog = [...(hair.washDayLog || [])].sort((a, b) => b.date.localeCompare(a.date));
  const latestLength = lengthLog.slice(-1)[0]?.length || 15;

  const logLength = () => {
    if (!newLength) return;
    setState(s => ({ ...s, hair: { ...s.hair, lengthLog: [...(s.hair.lengthLog || []), { date: today, length: +newLength }] } }));
    setNewLength('');
  };

  const monthlyGrowth = lengthLog.length >= 2
    ? (lengthLog.slice(-1)[0].length - lengthLog[0].length).toFixed(1)
    : null;

  return (
    <div className="bento">
      {/* Length tracker */}
      <div className="card col-6" style={{ padding: 20 }}>
        <CardHead title="Hair length" sub="Track your growth over time" />
        <div style={{ marginBottom: 16 }}>
          <LengthSparkline log={lengthLog} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500 }}>{latestLength}</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>inches</span>
            {monthlyGrowth && <span style={{ fontSize: 12, color: 'var(--accent-2)', marginLeft: 8 }}>+{monthlyGrowth}″ since start</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input type="number" step="0.25" placeholder="Log length (inches)" value={newLength} onChange={e => setNewLength(e.target.value)}
            style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13 }} />
          <button onClick={logLength} className="btn btn--pink">Log</button>
        </div>
        {lengthLog.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...lengthLog].reverse().slice(0, 6).map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 500 }}>{e.length}″</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 14, padding: 12, background: 'var(--bg)', borderRadius: 10, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Measure on blow-out days only. Hold tape straight down alongside your hair. Temple area gets its own close-up — track separately in notes.
        </div>
      </div>

      {/* Photo tips + temple notes */}
      <div className="card col-6 card--sun" style={{ padding: 20 }}>
        <CardHead title="Monthly progress photo" sub="Same wash day each cycle" />
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>
          Growth is slow and invisible without documentation. Take your photo on your Week 4 clarify day each cycle.
        </div>
        {['Blow out hair fully — no shrinkage', 'Hold a tape measure alongside your hair', 'Same angle, same lighting, every time', 'Temple area gets its own close-up — track separately', 'Compare every 8 weeks minimum'].map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{ color: '#8a6a16', fontSize: 13, flexShrink: 0 }}>›</span>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{tip}</span>
          </div>
        ))}
        <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Temple recovery notes</div>
          <Editable
            value={hair.templeNotes || ''}
            placeholder="Track your temple progress here (baby hairs, breakage, thickness...)"
            onChange={v => setState(s => ({ ...s, hair: { ...s.hair, templeNotes: v } }))}
            style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}
          />
        </div>
      </div>

      {/* Full wash day history */}
      <div className="card col-12" style={{ padding: 20 }}>
        <CardHead title="Full wash day history" sub={`${washDayLog.length} sessions logged`} />
        {washDayLog.length === 0 ? (
          <div className="empty">Log your first wash day in the Wash Day tab</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {washDayLog.map(e => (
              <div key={e.id} style={{ padding: 14, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 12 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{FEELING_EMOJI[e.feeling || 4]}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 500 }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <Pill tone={HAIR_WEEKS[e.week]?.tagTone || 'pink'} mono>Wk {e.week}</Pill>
                </div>
                {e.strandTest && <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>Strand: {e.strandTest === 'balanced' ? '✅ balanced' : e.strandTest === 'moisture' ? '💧 moisture overload' : '⚡ needs protein'}</div>}
                {e.notes && <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>{e.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Reference ────────────────────────────────────────────────────────────

function ReferenceTab({ hair, setState }) {
  const activeWeek = hair.activeWeek || 5;
  return (
    <div className="bento">
      {/* 8-week master cycle */}
      <div className="card col-12" style={{ padding: 20 }}>
        <CardHead title="8-week master cycle" sub="The big picture" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HAIR_MASTER_CYCLE.map(({ wk, desc, protein, big }) => {
            const current = wk === activeWeek;
            return (
              <div key={wk} onClick={() => setState(s => ({ ...s, hair: { ...s.hair, activeWeek: wk } }))} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 14px', background: current ? 'var(--primary-soft, #fbd7e1)' : 'var(--bg)', borderRadius: 12, border: `1px solid ${current ? 'var(--primary)' : 'var(--line)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                <span style={{ width: 30, height: 30, flexShrink: 0, borderRadius: '50%', background: current ? 'linear-gradient(135deg, var(--primary), var(--accent-1))' : big ? 'var(--accent-1-soft, #fde3cf)' : protein ? '#fef3cd' : 'var(--card)', border: `1px solid ${current ? 'var(--primary)' : 'var(--line)'}`, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, fontWeight: 600, color: current ? 'white' : 'var(--ink)' }}>{wk}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: current ? 'var(--ink)' : 'var(--ink-soft)', lineHeight: 1.5, fontWeight: current ? 600 : 500 }}>{desc}</div>
                  {big && <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--accent-1)', marginTop: 2, fontWeight: 600 }}>← FULL RESET DAY · SAME SESSION</div>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {protein && !current && <Pill tone="sun" mono>protein</Pill>}
                  {big && !current && <Pill tone="peach" mono>reset</Pill>}
                  {current && <Pill tone="pink" mono>you are here</Pill>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strand test */}
      <div className="card col-5" style={{ padding: 20 }}>
        <CardHead title="Weekly strand test" sub="Before every wash day" />
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 12 }}>Pull one shed hair. Hold each end and stretch slowly. Read the result:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HAIR_STRAND.map((item) => (
            <div key={item.key} style={{ background: 'var(--bg)', borderRadius: 12, padding: 12, borderLeft: `3px solid ${item.color}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{item.result}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.meaning}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Protective styles */}
      <div className="card col-7" style={{ padding: 20 }}>
        <CardHead title="Protective styles" sub="Safe vs. avoid" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HAIR_PROT_STYLES.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--line)', borderLeft: `3px solid ${s.ok ? 'var(--accent-2)' : 'var(--primary)'}`, borderRadius: 12 }}>
              <span style={{ fontSize: 14, flexShrink: 0, color: s.ok ? 'var(--accent-2)' : 'var(--primary)', fontWeight: 700 }}>{s.ok ? '✓' : '✗'}</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{s.style}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Never break */}
      <div className="card col-6" style={{ padding: 20, background: '#fff5f5', borderColor: '#f7d0d0' }}>
        <CardHead title="Never break these rules" sub="Non-negotiables" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HAIR_NEVER.map((rule, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#b1325c', fontSize: 13, flexShrink: 0, fontWeight: 700 }}>✗</span>
              <span style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lola products */}
      <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {HAIR_LOLA.map((prod, i) => (
          <div key={i} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.2, flex: 1 }}>{prod.name}</div>
              <Pill tone={prod.tagTone} mono>{prod.tag}</Pill>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 10 }}>{prod.desc}</div>
            <div style={{ borderTop: '1px dashed var(--line)', paddingTop: 10 }}>
              {prod.howto.map((step, si) => (
                <div key={si} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ color: 'var(--primary)', fontSize: 12, flexShrink: 0 }}>›</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main HairView ─────────────────────────────────────────────────────────────

export default function HairView({ state, setState }) {
  const { hair } = state;
  const [tab, setTab] = useState('overview');

  const setHair = (patch) => setState(s => ({ ...s, hair: { ...s.hair, ...patch } }));

  const today = todayKey();
  const nightlyDone = (hair.nightlyDate === today) ? (hair.nightlyDone || {}) : {};
  const currentStyleId = hair.currentStyle || 'natural';
  const currentStyle = HAIR_STYLES.find(s => s.id === currentStyleId) || HAIR_STYLES[0];
  const activeRoutine = currentStyle.nightlyRoutine || HAIR_NIGHTLY;
  const nightlyCount = Object.values(nightlyDone).filter(Boolean).length;
  const washDayCount = (hair.washDayLog || []).length;
  const latestLength = (hair.lengthLog || []).slice(-1)[0]?.length || 15;
  const activeWeek = hair.activeWeek || 5;

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'washday', label: 'Wash Day' },
    { id: 'progress', label: 'Progress' },
    { id: 'reference', label: 'Reference' },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">The Silk Collective Studio · Length Retention</div>
          <h1 className="page-head__title">Hair regimen</h1>
          <div className="page-head__date mt-sm">High porosity · 4B coils · 8-week protocol</div>
        </div>
        <div className="row gap-md">
          <Pill tone="pink" mono>{currentStyle.icon} {currentStyle.label}</Pill>
          <Pill tone="pink" mono>{nightlyCount}/{activeRoutine.length} tonight</Pill>
          <Pill tone="lilac" mono>Week {activeWeek} of 8</Pill>
          <Pill tone="mint" mono>{latestLength}″</Pill>
          <Pill tone="sun" mono>{washDayCount} wash days logged</Pill>
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

      {tab === 'overview' && <OverviewTab hair={hair} setState={setState} />}
      {tab === 'washday' && <WashDayTab hair={hair} setState={setState} />}
      {tab === 'progress' && <ProgressTab hair={hair} setState={setState} />}
      {tab === 'reference' && <ReferenceTab hair={hair} setState={setState} />}
    </>
  );
}
