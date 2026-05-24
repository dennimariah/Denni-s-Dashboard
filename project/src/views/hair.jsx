// Hair Regimen — adapted to the dashboard palette
// Original: dark gold/cream/brown · Now: pink/cream + sage accents on light

const HAIR_WEEKS = {
  1: {
    label: "Week 1", subtitle: "Post-Smoothing — Recovery Mode",
    tag: "RECOVERY", tagTone: "mint",
    shampoo: "Design Essentials Almond & Avocado (moisturizing)",
    dc: "Amika Hydro Rush (blue) — pure moisture only",
    proteinNote: null,
    notes: "You just completed your smoothing treatment. Your hair needs pure moisture and zero protein stress for the next several weeks. Be gentle, be consistent.",
    washDaySteps: [
      { id: "prepoo", label: "Pre-Poo (30–60 min before shower)", steps: [
        "Apply Sunny Isle JBCO generously from mid-shaft to ends",
        "Apply The Ordinary Density Serum to scalp",
        "Massage with scalp tool for 5 full minutes",
        "Cover with a plastic cap and let it sit while you get ready",
      ]},
      { id: "cleanse", label: "Cleanse", steps: [
        "Shampoo: Design Essentials Almond & Avocado",
        "Focus entirely on your scalp — do not scrub the ends",
        "Let the suds rinse through the ends naturally",
      ]},
      { id: "dc", label: "Deep Condition", steps: [
        "DC: Amika Hydro Rush (blue)",
        "Divide hair into 4–6 sections",
        "Apply generously mid-shaft to ends — not scalp",
        "Cover with plastic cap",
        "Sit under hooded dryer or heat cap for 30 minutes — heat is mandatory for high porosity",
        "Rinse with COOL water to begin closing the cuticle",
      ]},
      { id: "seal", label: "Cuticle Seal (every week, no exceptions)", steps: [
        "Apply Redken Acidic Bonding Concentrate as a rinse-out",
        "Distribute through hair, leave 2 minutes",
        "Rinse — physically closes your raised high porosity cuticle before heat",
      ]},
      { id: "lco", label: "LCO Application (section by section)", steps: [
        "Towel blot gently — do not rub",
        "Section hair into 4–6 parts and clip",
        "L: Mizani 25 Miracle Milk leave-in",
        "C: TGIN Butter Cream Daily Moisturizer",
        "O: Sunny Isle JBCO from mid-shaft to ends ONLY (not scalp)",
        "Do not skip the order — cream before oil seals moisture in",
      ]},
      { id: "heat", label: "Heat Styling", steps: [
        "Apply thermal protectant spray over each section",
        "Blow dry on MEDIUM heat — Laifen Swift — use tension method",
        "Apply Mizani Press Agent Serum before flat iron",
        "Flat iron: ONE slow pass per section — do not chase it",
        "Let each section cool before touching",
      ]},
    ],
  },
  2: {
    label: "Week 2", subtitle: "Still in Smoothing Recovery Window",
    tag: "MOISTURE", tagTone: "mint",
    shampoo: "Design Essentials Almond & Avocado (moisturizing)",
    dc: "Listen to your hair this week (see note below)",
    proteinNote: null,
    notes: "Start reading your hair's signals to choose your DC. Soft, limp, or overly pliable? → Amika Hydro Rush (pure moisture). Weak, stretchy, or snapping? → Biolage Don't Despair Repair (light protein). This is how you learn your hair.",
    washDaySteps: [
      { id: "prepoo", label: "Pre-Poo", steps: [
        "Sunny Isle JBCO mid-shaft to ends",
        "The Ordinary Density Serum to scalp",
        "Scalp massage 5 minutes",
        "Plastic cap on, let it sit",
      ]},
      { id: "cleanse", label: "Cleanse", steps: [
        "Design Essentials Almond & Avocado",
        "Scalp focus only — no scrubbing the ends",
      ]},
      { id: "dc", label: "Deep Condition", steps: [
        "Dry/limp/soft → Amika Hydro Rush",
        "Weak/stretchy/snapping → Biolage Don't Despair",
        "Section by section, mid-shaft to ends",
        "Plastic cap + heat cap — 30 min",
        "Cool water rinse",
      ]},
      { id: "seal", label: "Cuticle Seal", steps: [
        "Redken ABC — 2 min, rinse",
        "Every single week regardless of what else changes",
      ]},
      { id: "lco", label: "LCO Application", steps: [
        "Towel blot gently",
        "Mizani 25 Miracle Milk (L)",
        "TGIN Butter Cream (C)",
        "Sunny Isle JBCO ends only (O)",
      ]},
      { id: "heat", label: "Heat Styling", steps: [
        "Thermal protectant spray",
        "Blow dry medium heat",
        "Press Agent Serum before flat iron",
        "One slow pass — no repeats",
      ]},
    ],
  },
  3: {
    label: "Week 3", subtitle: "Moisture-Only Continues",
    tag: "MOISTURE", tagTone: "mint",
    shampoo: "Design Essentials Almond & Avocado",
    dc: "Listen to your hair — Amika OR Biolage",
    proteinNote: null,
    notes: "By now your hair should feel noticeably more responsive. Keep listening and choosing your DC accordingly. Temple area should be showing less breakage — look for baby hairs as a sign your follicles are responding.",
    washDaySteps: [
      { id: "prepoo", label: "Pre-Poo", steps: [
        "Sunny Isle JBCO mid-shaft to ends",
        "Density Serum to scalp",
        "5-minute scalp massage",
        "Plastic cap on while you wait",
      ]},
      { id: "cleanse", label: "Cleanse", steps: [
        "Design Essentials Almond & Avocado",
        "Scalp only — suds rinse through ends",
      ]},
      { id: "dc", label: "Deep Condition", steps: [
        "Dry/limp → Amika Hydro Rush",
        "Weak/stretchy → Biolage Don't Despair",
        "Mid-shaft to ends, plastic cap",
        "Heat cap or hooded dryer — 30 min",
        "Cool water rinse",
      ]},
      { id: "seal", label: "Cuticle Seal", steps: [
        "Redken ABC — 2 min, rinse",
        "Every week without exception",
      ]},
      { id: "lco", label: "LCO Application", steps: [
        "Towel blot gently",
        "Camille Rose Honey Hydrate — wig weeks only, not in LCO",
        "Mizani 25 Miracle Milk (L)",
        "TGIN Butter Cream (C)",
        "Sunny Isle JBCO ends only (O)",
      ]},
      { id: "heat", label: "Heat Styling", steps: [
        "Thermal protectant spray",
        "Blow dry medium heat",
        "Press Agent Serum",
        "One slow pass — do not re-pass",
      ]},
    ],
  },
  4: {
    label: "Week 4", subtitle: "Monthly Clarify Day",
    tag: "CLARIFY", tagTone: "peach",
    shampoo: "OUAI Detox Shampoo — removes a month of buildup",
    dc: "Amika Hydro Rush — always follow a clarify with pure moisture",
    proteinNote: "⚡ After this wash day, Week 5 introduces light protein for the first time. Your hair will be ready.",
    notes: "Monthly reset. Clarifying removes all product buildup — smoothing residue, LCO layers, thermal protectants. You may need to lather twice. This is also Olaplex No. 3 day — apply during pre-poo before shampooing.",
    washDaySteps: [
      { id: "prepoo", label: "Pre-Poo — Critical on Clarify Days", steps: [
        "Olaplex No. 3 to damp hair first — sit 30–45 min",
        "Sunny Isle JBCO generously mid-shaft to ends over the No. 3",
        "Density Serum to scalp",
        "Scalp massage 5 min",
        "Plastic cap — sit minimum 30 min",
      ]},
      { id: "cleanse", label: "Cleanse", steps: [
        "OUAI Detox (clarifying)",
        "Lather twice — first removes buildup, second cleans",
        "Scalp focus",
      ]},
      { id: "dc", label: "Deep Condition", steps: [
        "Amika Hydro Rush ONLY — pure moisture after a clarify",
        "Be extra generous",
        "Plastic cap + heat — 30 min",
        "Cool water rinse",
      ]},
      { id: "seal", label: "Cuticle Seal", steps: [
        "Redken ABC — especially important after clarifying",
        "2 min, rinse thoroughly",
      ]},
      { id: "lco", label: "LCO Application", steps: [
        "Towel blot gently",
        "Be generous — clarify needs extra moisture",
        "Mizani 25 (L) → TGIN Butter (C) → JBCO ends (O)",
      ]},
      { id: "heat", label: "Heat Styling", steps: [
        "Thermal protectant spray",
        "Blow dry medium heat",
        "Press Agent Serum",
        "One slow pass — no repeats",
      ]},
    ],
  },
};

const HAIR_NIGHTLY = [
  { id: "ordinary_scalp", label: "The Ordinary Density Serum on scalp",     detail: "Apply in sections, fingertip pad massage — 5 min circular motions" },
  { id: "cecred_temples", label: "Cecred Edge Drops on temples & hairline", detail: "One dropper press per temple — gentle circles only" },
  { id: "jbco_ends",      label: "Sunny Isle JBCO on ends",                  detail: "2–3 drops warmed between fingertips — light coating only" },
  { id: "silk_scarf",     label: "Silk/satin scarf — tied at the nape",      detail: "Fold so the knot sits at the back, not over temples" },
  { id: "bonnet",         label: "Satin bonnet over scarf",                  detail: "Double-layer friction protection" },
];

const HAIR_PROT_STYLES = [
  { ok: true,  style: "Sleek low bun",            note: "Scrunchie only — never rubber band" },
  { ok: true,  style: "Half up, half down",       note: "Avoid clips that crease the hair" },
  { ok: true,  style: "Flat twists under wig",    note: "Stop ½″ before temples. Wig grip band, no gel. Max 5–7 days." },
  { ok: true,  style: "Low silk press ponytail",  note: "Low placement only, minimal tension" },
  { ok: false, style: "Tight cornrows at hairline", note: "Traction risk — especially at temples" },
  { ok: false, style: "High tension styles",      note: "Mid-shaft breakage gets worse with tension" },
  { ok: false, style: "Edge control on temples",  note: "Oil only on that area until it recovers" },
];

const HAIR_MASTER_CYCLE = [
  { wk: 1, desc: "Moisturizing shampoo · Amika Hydro Rush · Post-smoothing recovery", protein: false },
  { wk: 2, desc: "Moisturizing shampoo · Amika or Biolage · Listen to your hair",     protein: false },
  { wk: 3, desc: "Moisturizing shampoo · Amika or Biolage · Listen to your hair",     protein: false },
  { wk: 4, desc: "OUAI Clarify · Amika Hydro Rush · Olaplex No. 3 · Monthly clarify", protein: false },
  { wk: 5, desc: "Moisturizing shampoo · ApHogee 2 Min Keratin (light protein)",      protein: true  },
  { wk: 6, desc: "Moisturizing shampoo · Moisture DC · Back to moisture",             protein: false },
  { wk: 7, desc: "Moisturizing shampoo · ApHogee 2 Min Keratin (light protein)",      protein: true  },
  { wk: 8, desc: "OUAI Clarify · ApHogee Two-Step + Smoothing Treatment · Same day", protein: true, big: true },
];

const HAIR_LOLA = [
  {
    name: "Umectação Oliva — Olive Oil Deep Mask",
    tag: "DC ROTATION",
    tagTone: "mint",
    desc: "Humectant treatment — olive oil penetrates the cortex. Use as your third DC option when hair feels extremely dry, dull, or brittle. More intensive than Amika, less protein-focused than Biolage.",
    howto: [
      "Regular: apply mid-shaft to ends after shampoo, plastic cap, 30 min under heat, rinse",
      "SOS overnight: apply to dry hair the night before wash day, loose bun, sleep, shampoo out",
      "Rotate in with Amika and Biolage based on strand test results",
    ],
  },
  {
    name: "Xapadinha — Disciplining Smoothing Mask",
    tag: "PRESS WEEKS ONLY",
    tagTone: "peach",
    desc: "Smoothing mask aligns the hair fiber and reduces frizz by up to 40%. Use as your DC on weeks you're flat-ironing — makes blow dry/press easier and helps styles last.",
    howto: [
      "Press weeks ONLY — do not use on natural texture or bun weeks",
      "After shampoo, section by section mid-shaft to ends",
      "Plastic cap + heat — 30 min",
      "Rinse, then Redken ABC — locks the smoothing effect in further",
    ],
  },
  {
    name: "Rapunzel Tônico do Crescimento — Growth Tonic",
    tag: "SCALP GROWTH",
    tagTone: "sun",
    desc: "Leave-on growth tonic with Jaborandi, Rosemary, Caffeine, Ginkgo, Nettle, Ginger. Jaborandi is a Brazilian follicle stimulant — combined with Rosemary and Caffeine, one of the strongest natural growth formulas.",
    howto: [
      "Apply to clean dry or slightly damp scalp — do NOT rinse",
      "Massage in gently — scalp only, not the strands",
      "Alternate with The Ordinary Density Serum on different days",
      "Mon / Wed / Fri → Rapunzel Tônico",
      "Tue / Thu / Sat → The Ordinary Density Serum",
      "Sun (wash day pre-poo) → The Ordinary Density Serum",
    ],
  },
];

const HAIR_NEVER = [
  "Apply heat without your double thermal protection stack",
  "Skip wash day — weekly is non-negotiable at your heat frequency",
  "Use rubber bands anywhere in your hair",
  "Use alcohol-based edge control",
  "Do more than one flat iron pass per section",
  "Braid, clip, or apply product to your temple area",
  "Go to sleep without your oil, scarf, and bonnet",
  "Do hard protein and smoothing treatment on separate days",
];

const HAIR_STRAND = [
  { result: "Stretches and snaps back slowly",      meaning: "✅ Balanced — maintain current routine",                                       color: "var(--accent-2)" },
  { result: "Stretches a lot, goes limp or mushy",  meaning: "💧 Moisture overload — use Biolage Don't Despair this week",                   color: "var(--primary)" },
  { result: "Barely stretches, snaps immediately",  meaning: "⚡ Protein deficient — use Biolage or move up your ApHogee Two Minute",        color: "var(--accent-1)" },
];

// ----------------- View -----------------

const HairView = ({ state, setState }) => {
  const { hair } = state;
  const [activeWeek, setActiveWeek] = useState(hair.activeWeek || 1);
  const [expanded, setExpanded] = useState(null);

  const setHair = (patch) => setState(s => ({ ...s, hair: { ...s.hair, ...patch } }));

  const toggleNightly = (id, e) => {
    if (e && !hair.nightlyDone[id]) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setHair({ nightlyDone: { ...hair.nightlyDone, [id]: !hair.nightlyDone[id] } });
  };

  const toggleScalp = (day, e) => {
    if (e && !hair.scalpDays[day]) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setHair({ scalpDays: { ...hair.scalpDays, [day]: !hair.scalpDays[day] } });
  };

  const week = HAIR_WEEKS[activeWeek];
  const nightlyCount = Object.values(hair.nightlyDone).filter(Boolean).length;
  const scalpCount = Object.values(hair.scalpDays).filter(Boolean).length;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">The Silk Collective Studio · Length Retention</div>
          <h1 className="page-head__title">Hair regimen</h1>
          <div className="page-head__date mt-sm">High porosity · 4B coils · Post-smoothing protocol</div>
        </div>
        <div className="row gap-md">
          <Pill tone="pink" mono>{nightlyCount}/5 tonight</Pill>
          <Pill tone="mint" mono>{scalpCount}/3–4 scalp days</Pill>
          <Pill tone="lilac" mono>Week {activeWeek} of 8</Pill>
        </div>
      </div>

      {/* Temple priority banner */}
      <div className="card card--peach" style={{ marginBottom: 16, borderLeft: "4px solid var(--accent-1)" }}>
        <div className="row gap-sm" style={{ alignItems: "flex-start" }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>⚠</span>
          <div>
            <div className="text-mono fs-xs" style={{ letterSpacing: "0.18em", color: "#8b4f1c", fontWeight: 700, marginBottom: 4 }}>TEMPLE PRIORITY ZONE</div>
            <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.55 }}>
              Zero product on temples except nightly oil. No braids, no edge control, no clips within ½″ of your hairline. Nightly Mielle + JBCO only.
            </div>
          </div>
        </div>
      </div>

      {/* Week selector + week card */}
      <div className="bento">
        <div className="card col-12">
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Current week</div>
          <div className="row gap-sm" style={{ marginBottom: 18 }}>
            {[1, 2, 3, 4].map(w => (
              <button
                key={w}
                onClick={() => { setActiveWeek(w); setExpanded(null); setHair({ activeWeek: w }); }}
                style={{
                  flex: 1,
                  padding: "14px 8px",
                  borderRadius: 14,
                  border: activeWeek === w ? "2px solid var(--primary)" : "1px solid var(--line)",
                  background: activeWeek === w ? "var(--primary-soft)" : "var(--card-2)",
                  color: activeWeek === w ? "var(--primary-deep)" : "var(--ink-soft)",
                  fontWeight: activeWeek === w ? 700 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                <div className="text-mono fs-xs" style={{ letterSpacing: "0.1em", opacity: 0.8 }}>WEEK</div>
                <div className="text-serif" style={{ fontSize: 26, marginTop: 2 }}>{w}</div>
              </button>
            ))}
          </div>

          <div className="row row--between" style={{ alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <h2 className="text-serif" style={{ fontSize: 28, margin: 0 }}>{week.label}</h2>
              <div className="text-mono fs-xs text-muted mt-sm" style={{ letterSpacing: "0.08em" }}>{week.subtitle}</div>
            </div>
            <Pill tone={week.tagTone} mono>{week.tag}</Pill>
          </div>
          <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 14, marginTop: 12, color: "var(--ink-soft)", fontSize: 13.5, lineHeight: 1.65 }}>
            {week.notes}
          </div>
          {week.proteinNote && (
            <div className="card card--sun" style={{ marginTop: 12, padding: 12 }}>
              <div style={{ fontSize: 13, color: "#8a6a16", fontWeight: 500 }}>{week.proteinNote}</div>
            </div>
          )}
        </div>

        {/* This week's products */}
        <div className="card col-7">
          <CardHead title="This week's products" sub="The 5 you'll touch on wash day" />
          <div className="col gap-sm">
            {[
              ["Shampoo",                       week.shampoo],
              ["Deep conditioner",              week.dc],
              ["Cuticle seal · every week",     "Redken Acidic Bonding Concentrate · 2 min rinse-out · never skip"],
              ["LCO stack · every wash day",    "Mizani 25 Miracle Milk (L) → TGIN Butter Cream (C) → JBCO ends (O)"],
              ["Heat protection · double layer","Thermal spray (Kenra/IGK/DE) before blow dry + Mizani Press Agent before flat iron"],
            ].map(([label, val]) => (
              <div key={label} className="idea-chip" style={{ alignItems: "flex-start", padding: "12px 14px" }}>
                <span className="idea-chip__bullet" style={{ marginTop: 8 }}/>
                <div style={{ flex: 1 }}>
                  <div className="text-mono fs-xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-deep)", fontWeight: 600, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nightly routine */}
        <div className="card col-5 card--pink">
          <CardHead
            title="Nightly routine"
            sub="No water. Oil only. Every night."
            right={<Pill tone="pink" mono>{nightlyCount}/5</Pill>}
          />
          <div className="col gap-sm">
            {HAIR_NIGHTLY.map(t => {
              const done = !!hair.nightlyDone[t.id];
              return (
                <button
                  key={t.id}
                  onClick={(e) => toggleNightly(t.id, e)}
                  className="row"
                  style={{
                    alignItems: "flex-start",
                    gap: 12,
                    padding: 12,
                    background: done ? "var(--accent-2-soft)" : "rgba(255,255,255,0.7)",
                    border: "1px solid " + (done ? "var(--accent-2)" : "transparent"),
                    borderRadius: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    color: "inherit",
                  }}
                >
                  <span
                    className={cls("task__check", done && "task__check--done")}
                    style={done ? { background: "var(--accent-2)", borderColor: "var(--accent-2)", width: 20, height: 20, flexShrink: 0 } : { width: 20, height: 20, flexShrink: 0 }}
                  >
                    {done && <Icon name="check" size={12} stroke={2.4}/>}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: done ? "#3d6b4f" : "var(--ink)" }}>{t.label}</div>
                    <div className="fs-xs text-muted" style={{ marginTop: 2, lineHeight: 1.4 }}>{t.detail}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wash day steps */}
        <div className="card col-12">
          <CardHead title="Wash day · step by step" sub="Tap any step to expand" />
          <div className="col gap-sm">
            {week.washDaySteps.map((section, idx) => {
              const open = expanded === section.id;
              return (
                <div key={section.id} style={{
                  background: "var(--card-2)",
                  borderRadius: 14,
                  border: "1px solid " + (open ? "var(--primary)" : "var(--line)"),
                  overflow: "hidden",
                  transition: "border-color 0.15s",
                }}>
                  <button
                    onClick={() => setExpanded(open ? null : section.id)}
                    className="row row--between"
                    style={{
                      width: "100%", padding: "12px 14px",
                      background: "transparent", border: 0,
                      cursor: "pointer", textAlign: "left",
                      fontFamily: "inherit", color: "inherit",
                    }}
                  >
                    <div className="row" style={{ gap: 12 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary), var(--accent-1))",
                        display: "grid", placeItems: "center",
                        color: "white", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, fontWeight: 600,
                        flexShrink: 0,
                      }}>{idx + 1}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{section.label}</span>
                    </div>
                    <span style={{ color: "var(--primary)", fontSize: 20, lineHeight: 1, fontFamily: "var(--font-serif)" }}>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open && (
                    <div style={{ padding: "0 14px 14px 54px", borderTop: "1px dashed var(--line)" }}>
                      {section.steps.map((step, si) => (
                        <div key={si} className="row" style={{ gap: 8, marginTop: 10, alignItems: "flex-start" }}>
                          <span style={{ color: "var(--primary)", fontSize: 13, marginTop: 1, flexShrink: 0 }}>›</span>
                          <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scalp tracker */}
        <div className="card col-6 card--mint">
          <CardHead
            title="Scalp massage tracker"
            sub="Density Serum · 5 min minimum"
            right={<Pill tone="mint" mono>{scalpCount}/3–4</Pill>}
          />
          <div className="gym-grid">
            {DAYS_OF_WEEK.map(day => {
              const done = !!hair.scalpDays[day];
              return (
                <button
                  key={day}
                  onClick={(e) => toggleScalp(day, e)}
                  className={cls("gym-cell", done && "gym-cell--done")}
                  style={done ? { background: "var(--accent-2)" } : {}}
                >
                  <span className="gym-cell__day">{day}</span>
                  <span className="gym-cell__icon">{done ? "🌿" : "·"}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-md fs-xs text-soft" style={{ lineHeight: 1.5 }}>
            Mon/Wed/Fri → Rapunzel Tônico · Tue/Thu/Sat → Density Serum · Sun → wash day pre-poo
          </div>
        </div>

        {/* Mid-week refresh */}
        <div className="card col-6 card--lilac">
          <CardHead title="Mid-week refresh" sub="Day 3–4" />
          <div className="col gap-sm">
            {[
              "Boar bristle brush — smooth frizz, redistribute oils",
              "Light JBCO over the surface with fingertips",
              "Re-wrap at night as usual",
              "Do NOT flat iron mid-week — low bun or pin curls",
              "If touching up: low bun or sleek ponytail to wash day",
            ].map((tip, i) => (
              <div key={i} className="row" style={{ gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent-3)", fontSize: 13, marginTop: 1, flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Protective styles */}
        <div className="card col-7">
          <CardHead title="Protective styles" sub="What's safe, what's not" />
          <div className="col gap-sm">
            {HAIR_PROT_STYLES.map((s, i) => (
              <div key={i} className="row" style={{
                gap: 12, alignItems: "flex-start",
                background: "var(--card-2)",
                border: "1px solid var(--line)",
                borderLeft: "3px solid " + (s.ok ? "var(--accent-2)" : "var(--primary)"),
                borderRadius: 12,
                padding: "10px 14px",
              }}>
                <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0, color: s.ok ? "var(--accent-2)" : "var(--primary)" }}>
                  {s.ok ? "✓" : "✗"}
                </span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: s.ok ? "var(--ink)" : "var(--ink-soft)" }}>{s.style}</div>
                  <div className="fs-xs text-muted" style={{ marginTop: 2 }}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strand test */}
        <div className="card col-5">
          <CardHead title="Weekly strand test" sub="Before every wash day" />
          <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 12 }}>
            Pull one shed hair. Hold each end and stretch slowly. Read the result:
          </div>
          <div className="col gap-sm">
            {HAIR_STRAND.map((item, i) => (
              <div key={i} style={{
                background: "var(--card-2)",
                borderRadius: 12,
                padding: 12,
                borderLeft: "3px solid " + item.color,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>{item.result}</div>
                <div className="fs-xs text-muted">{item.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8-week master cycle */}
        <div className="card col-12">
          <CardHead title="8-week master cycle" sub="The big picture" />
          <div className="col gap-sm">
            {HAIR_MASTER_CYCLE.map(({ wk, desc, protein, big }) => {
              const current = wk === activeWeek;
              return (
                <div key={wk} className="row" style={{
                  gap: 14, alignItems: "flex-start",
                  padding: "10px 14px",
                  background: current ? "var(--primary-soft)" : "var(--card-2)",
                  borderRadius: 12,
                  border: "1px solid " + (current ? "var(--primary)" : "var(--line)"),
                }}>
                  <span style={{
                    width: 30, height: 30, flexShrink: 0,
                    borderRadius: "50%",
                    background: current
                      ? "linear-gradient(135deg, var(--primary), var(--accent-1))"
                      : big ? "var(--accent-1-soft)" : protein ? "var(--accent-4-soft)" : "var(--card)",
                    border: "1px solid " + (current ? "var(--primary)" : "var(--line)"),
                    display: "grid", placeItems: "center",
                    fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, fontWeight: 600,
                    color: current ? "white" : "var(--ink)",
                  }}>{wk}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: current ? "var(--ink)" : "var(--ink-soft)", lineHeight: 1.5, fontWeight: current ? 600 : 500 }}>{desc}</div>
                    {big && <div className="text-mono fs-xs" style={{ letterSpacing: "0.1em", color: "var(--accent-1)", marginTop: 2, fontWeight: 600 }}>← FULL RESET DAY · SAME SESSION</div>}
                  </div>
                  {protein && !current && <Pill tone="sun" mono>protein</Pill>}
                  {big && !current && <Pill tone="peach" mono>reset</Pill>}
                  {current && <Pill tone="pink" mono>you are here</Pill>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly progress */}
        <div className="card col-6 card--sun">
          <CardHead title="📸 Monthly progress photo" sub="Same wash day each month" />
          <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 12 }}>
            Growth is slow and you won't see it without documentation. Hair grows ~½″ per month — retention is what makes that stick. Take your photo on your Week 4 clarify day every cycle.
          </div>
          <div className="col gap-sm">
            {[
              "Blow out hair fully — no shrinkage",
              "Hold a tape measure alongside your hair",
              "Same angle, same lighting, every time",
              "Compare every 8 weeks minimum",
              "Temple area gets its own close-up — track separately",
            ].map((tip, i) => (
              <div key={i} className="row" style={{ gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#8a6a16", fontSize: 13, marginTop: 1, flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Never break */}
        <div className="card col-6" style={{ background: "#fff5f5", borderColor: "#f7d0d0" }}>
          <CardHead title="Never break these rules" sub="Non-negotiables" />
          <div className="col gap-sm">
            {HAIR_NEVER.map((rule, i) => (
              <div key={i} className="row" style={{ gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#b1325c", fontSize: 13, marginTop: 1, flexShrink: 0, fontWeight: 700 }}>✗</span>
                <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lola products */}
        <div className="col-12">
          <div className="text-mono fs-xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--primary-deep)", fontWeight: 600, margin: "16px 0 10px" }}>
            🇧🇷 Lola from Rio · How to use
          </div>
          <div className="bento" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {HAIR_LOLA.map((prod, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div className="row row--between" style={{ alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
                  <div className="text-serif" style={{ fontSize: 17, lineHeight: 1.2, flex: 1 }}>{prod.name}</div>
                  <Pill tone={prod.tagTone} mono>{prod.tag}</Pill>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 12 }}>{prod.desc}</div>
                <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 10 }}>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>How to use</div>
                  <div className="col gap-sm">
                    {prod.howto.map((step, si) => (
                      <div key={si} className="row" style={{ gap: 6, alignItems: "flex-start" }}>
                        <span style={{ color: "var(--primary)", fontSize: 12, marginTop: 1, flexShrink: 0 }}>›</span>
                        <span style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

window.HairView = HairView;
