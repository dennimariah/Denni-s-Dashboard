import { useState, useEffect } from "react";

const weeks = {
  1: {
    label: "Week 1", subtitle: "Post-Smoothing — Recovery Mode",
    tag: "RECOVERY", tagColor: "#7eb89a",
    shampoo: "Design Essentials Almond & Avocado (moisturizing)",
    dc: "Amika Hydro Rush (blue) — pure moisture only",
    proteinNote: null,
    notes: "You just completed your smoothing treatment. Your hair needs pure moisture and zero protein stress for the next several weeks. Be gentle, be consistent.",
    washDaySteps: [
      { id: "prepoo", label: "Pre-Poo (30–60 min before shower)", steps: [
        "Apply Sunny Isle JBCO generously from mid-shaft to ends",
        "Apply The Ordinary Density Serum to scalp",
        "Massage with scalp tool for 5 full minutes",
        "Cover with a plastic cap and let it sit while you get ready"
      ]},
      { id: "cleanse", label: "Cleanse", steps: [
        "Shampoo: Design Essentials Almond & Avocado",
        "Focus entirely on your scalp — do not scrub the ends",
        "Let the suds rinse through the ends naturally"
      ]},
      { id: "dc", label: "Deep Condition", steps: [
        "DC: Amika Hydro Rush (blue)",
        "Divide hair into 4–6 sections",
        "Apply generously mid-shaft to ends — not scalp",
        "Cover with plastic cap",
        "Sit under hooded dryer or heat cap for 30 minutes — heat is mandatory for high porosity",
        "Rinse with COOL water to begin closing the cuticle"
      ]},
      { id: "seal", label: "Cuticle Seal (every week, no exceptions)", steps: [
        "Apply Redken Acidic Bonding Concentrate as a rinse-out",
        "Distribute through hair, leave 2 minutes",
        "Rinse — this step physically closes your raised high porosity cuticle before heat"
      ]},
      { id: "lco", label: "LCO Application (section by section)", steps: [
        "Towel blot gently — do not rub",
        "Section hair into 4–6 parts and clip",
        "Per section — L: Mizani 25 Miracle Milk leave-in",
        "Per section — C: TGIN Butter Cream Daily Moisturizer",
        "Per section — O: Sunny Isle JBCO from mid-shaft to ends ONLY (not scalp)",
        "Do not skip the order — cream before oil seals moisture in"
      ]},
      { id: "heat", label: "Heat Styling", steps: [
        "Apply thermal protectant spray over each section",
        "Blow dry on MEDIUM heat — Laifen Swift — use tension method",
        "Apply Mizani Press Agent Serum before flat iron",
        "Flat iron: ONE slow pass per section — do not chase it with repeat passes",
        "Let each section cool before touching"
      ]}
    ]
  },
  2: {
    label: "Week 2", subtitle: "Still in Smoothing Recovery Window",
    tag: "MOISTURE", tagColor: "#7eb89a",
    shampoo: "Design Essentials Almond & Avocado (moisturizing)",
    dc: "Listen to your hair this week (see note below)",
    proteinNote: null,
    notes: "Start reading your hair's signals to choose your DC. Hair feels soft, limp, or overly pliable? → Amika Hydro Rush (pure moisture). Hair feels weak, stretchy, or keeps snapping? → Biolage Don't Despair Repair (has light protein). This is how you learn your hair.",
    washDaySteps: [
      { id: "prepoo", label: "Pre-Poo (30–60 min before shower)", steps: [
        "Apply Sunny Isle JBCO generously from mid-shaft to ends",
        "Apply The Ordinary Density Serum to scalp",
        "Scalp massage with tool — 5 full minutes",
        "Plastic cap on, let it sit"
      ]},
      { id: "cleanse", label: "Cleanse", steps: [
        "Shampoo: Design Essentials Almond & Avocado",
        "Scalp focus only — no scrubbing the ends"
      ]},
      { id: "dc", label: "Deep Condition", steps: [
        "Hair feels dry, limp, or very soft → Amika Hydro Rush",
        "Hair feels weak, stretchy, or is snapping → Biolage Don't Despair Repair",
        "Apply section by section, mid-shaft to ends",
        "Plastic cap + hooded dryer or heat cap — 30 minutes",
        "Rinse with COOL water"
      ]},
      { id: "seal", label: "Cuticle Seal", steps: [
        "Redken ABC — distribute, leave 2 minutes, rinse",
        "Every single week regardless of what else changes"
      ]},
      { id: "lco", label: "LCO Application", steps: [
        "Towel blot gently",
        "Section by section — L: Mizani 25 Miracle Milk",
        "C: TGIN Butter Cream Daily Moisturizer",
        "O: Sunny Isle JBCO from mid-shaft to ends only"
      ]},
      { id: "heat", label: "Heat Styling", steps: [
        "Thermal protectant spray over each section",
        "Blow dry on medium heat — Laifen Swift",
        "Mizani Press Agent Serum before flat iron",
        "One slow flat iron pass — no repeat passes"
      ]}
    ]
  },
  3: {
    label: "Week 3", subtitle: "Moisture-Only Continues",
    tag: "MOISTURE", tagColor: "#7eb89a",
    shampoo: "Design Essentials Almond & Avocado (moisturizing)",
    dc: "Listen to your hair — Amika Hydro Rush OR Biolage Don't Despair",
    proteinNote: null,
    notes: "By now your hair should feel noticeably more responsive. Keep listening and choosing your DC accordingly. Consistency in your nightly routine this week will compound. Temple area should be showing less breakage — look for baby hairs as a sign your follicles are responding.",
    washDaySteps: [
      { id: "prepoo", label: "Pre-Poo (30–60 min before shower)", steps: [
        "Apply Sunny Isle JBCO generously from mid-shaft to ends",
        "The Ordinary Density Serum to scalp",
        "5-minute scalp massage with tool",
        "Plastic cap on while you wait"
      ]},
      { id: "cleanse", label: "Cleanse", steps: [
        "Shampoo: Design Essentials Almond & Avocado",
        "Scalp only — let suds rinse through ends"
      ]},
      { id: "dc", label: "Deep Condition", steps: [
        "Dry or limp hair → Amika Hydro Rush",
        "Weak or stretchy hair → Biolage Don't Despair Repair",
        "Apply mid-shaft to ends, plastic cap",
        "Heat cap or hooded dryer — 30 minutes",
        "Cool water rinse"
      ]},
      { id: "seal", label: "Cuticle Seal", steps: [
        "Redken ABC — 2 minutes, rinse",
        "Every week without exception"
      ]},
      { id: "lco", label: "LCO Application", steps: [
        "Towel blot gently",
        "Camille Rose Honey Hydrate is for wig weeks only — not in your LCO stack",
        "Section by section — Mizani 25 Miracle Milk (L)",
        "TGIN Butter Cream Daily Moisturizer (C)",
        "Sunny Isle JBCO mid-shaft to ends (O)"
      ]},
      { id: "heat", label: "Heat Styling", steps: [
        "Thermal protectant spray",
        "Blow dry medium heat — Laifen Swift",
        "Mizani Press Agent Serum before flat iron",
        "One slow pass — do not re-pass"
      ]}
    ]
  },
  4: {
    label: "Week 4", subtitle: "Monthly Clarify Day",
    tag: "CLARIFY", tagColor: "#c4914a",
    shampoo: "OUAI Detox Shampoo — removes a full month of buildup",
    dc: "Amika Hydro Rush — always follow a clarify with pure moisture",
    proteinNote: "⚡ After this wash day, Week 5 introduces light protein for the first time. Your hair will be ready.",
    notes: "This is your monthly reset. Clarifying removes all product buildup from smoothing treatment residue, LCO layers, and thermal protectants. You may need to lather twice. This is also your Olaplex No. 3 day — apply it during your pre-poo before shampooing. It works as a bond repair layer underneath everything else.",
    washDaySteps: [
      { id: "prepoo", label: "Pre-Poo — Critical on Clarify Days", steps: [
        "This step matters even more today — do not skip",
        "Apply Olaplex No. 3 to damp hair first — sit 30–45 min before shampooing",
        "Apply Sunny Isle JBCO very generously mid-shaft to ends over the No. 3",
        "The Ordinary Density Serum to scalp",
        "Scalp massage 5 minutes",
        "Plastic cap — sit minimum 30 minutes"
      ]},
      { id: "cleanse", label: "Cleanse", steps: [
        "Shampoo: OUAI Detox (clarifying)",
        "You may lather twice today — first lather removes buildup, second cleanse cleans",
        "Scalp focus — ends will get what rinses through"
      ]},
      { id: "dc", label: "Deep Condition", steps: [
        "DC: Amika Hydro Rush ONLY today — pure moisture after a clarify",
        "Be extra generous — clarifying strips moisture, this restores it",
        "Plastic cap + heat cap or hooded dryer — 30 full minutes",
        "Cool water rinse"
      ]},
      { id: "seal", label: "Cuticle Seal", steps: [
        "Redken ABC — especially important after clarifying",
        "2 minutes, rinse thoroughly"
      ]},
      { id: "lco", label: "LCO Application", steps: [
        "Towel blot gently",
        "Be generous with your LCO today — your hair needs extra after clarifying",
        "Mizani 25 Miracle Milk (L) → TGIN Butter Cream (C) → Sunny Isle JBCO ends (O)"
      ]},
      { id: "heat", label: "Heat Styling", steps: [
        "Thermal protectant spray over each section",
        "Blow dry medium heat — Laifen Swift",
        "Mizani Press Agent Serum before flat iron",
        "One slow pass — no repeat passes"
      ]}
    ]
  }
};

const nightlyTasks = [
  { id: "ordinary_scalp", label: "The Ordinary Density Serum on scalp", detail: "Apply in sections, massage with fingertip pads — 5 min circular motions", icon: "✦" },
  { id: "cecred_temples", label: "Cecred Edge Drops on temples & hairline", detail: "One dropper press per temple — fingertip press, gentle circles only", icon: "✦" },
  { id: "jbco_ends", label: "Sunny Isle JBCO on ends", detail: "2–3 drops warmed between fingertips — light coating only, no water", icon: "✦" },
  { id: "silk_scarf", label: "Silk/satin scarf — tie at the NAPE, not temples", detail: "Fold so knot sits at back of head only", icon: "✦" },
  { id: "bonnet", label: "Satin bonnet over scarf", detail: "Double layer friction protection", icon: "✦" },
];

const protStyles = [
  { ok: true, style: "Sleek low bun", note: "Scrunchie only — never rubber band" },
  { ok: true, style: "Half up, half down", note: "Avoid clips that crease the hair" },
  { ok: true, style: "Flat twists under wig", note: "Stop ½ inch before temples. Wig grip band, not gel. Max 5–7 days." },
  { ok: true, style: "Low silk press ponytail", note: "Low placement only, minimal tension" },
  { ok: false, style: "Tight cornrows at hairline", note: "Traction risk — especially at temples" },
  { ok: false, style: "High tension styles of any kind", note: "Mid-shaft breakage gets worse with tension" },
  { ok: false, style: "Edge control on temples", note: "Oil only on that area until it recovers" },
];

const masterCycle = [
  { wk: 1, desc: "Moisturizing shampoo · Amika Hydro Rush · Post-smoothing recovery", protein: false },
  { wk: 2, desc: "Moisturizing shampoo · Amika or Biolage · Listen to your hair", protein: false },
  { wk: 3, desc: "Moisturizing shampoo · Amika or Biolage · Listen to your hair", protein: false },
  { wk: 4, desc: "OUAI Clarify · Amika Hydro Rush · Olaplex No. 3 in pre-poo · Monthly clarify", protein: false },
  { wk: 5, desc: "Moisturizing shampoo · ApHogee 2 Min Keratin (light protein)", protein: true },
  { wk: 6, desc: "Moisturizing shampoo · Moisture DC · Back to moisture", protein: false },
  { wk: 7, desc: "Moisturizing shampoo · ApHogee 2 Min Keratin (light protein)", protein: true },
  { wk: 8, desc: "OUAI Clarify · ApHogee Two-Step + Smoothing Treatment · Same day", protein: true, big: true },
];

export default function HairRegimen() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [expandedStep, setExpandedStep] = useState(null);
  const [nightlyDone, setNightlyDone] = useState({});
  const [scalpDays, setScalpDays] = useState({});

  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    (async () => {
      try {
        const n = await window.storage.get("nightly_" + todayKey);
        if (n) setNightlyDone(JSON.parse(n.value));
      } catch {}
      try {
        const s = await window.storage.get("scalp_tracker");
        if (s) setScalpDays(JSON.parse(s.value));
      } catch {}
    })();
  }, []);

  const toggleNightly = async (id) => {
    const upd = { ...nightlyDone, [id]: !nightlyDone[id] };
    setNightlyDone(upd);
    try { await window.storage.set("nightly_" + todayKey, JSON.stringify(upd)); } catch {}
  };

  const toggleScalp = async (day) => {
    const upd = { ...scalpDays, [day]: !scalpDays[day] };
    setScalpDays(upd);
    try { await window.storage.set("scalp_tracker", JSON.stringify(upd)); } catch {}
  };

  const nightlyCount = Object.values(nightlyDone).filter(Boolean).length;
  const scalpCount = Object.values(scalpDays).filter(Boolean).length;
  const week = weeks[activeWeek];

  const gold = "#c9954a";
  const goldLight = "#d4a85a";
  const cream = "#f0e6d3";
  const muted = "#9a8878";
  const bg = "#080504";
  const card = "#110b08";
  const border = "#261610";
  const green = "#5a9a78";
  const greenBg = "#091a10";

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: bg, minHeight: "100vh", color: cream, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: "36px 20px 20px", borderBottom: `1px solid ${border}`, background: "linear-gradient(180deg, #130c08 0%, ${bg} 100%)" }}>
        <p style={{ fontSize: 10, letterSpacing: 5, color: gold, margin: "0 0 10px", fontFamily: "sans-serif", fontWeight: 700 }}>
          THE SILK COLLECTIVE STUDIO
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.2, color: cream }}>
          Length Retention<br />Regimen
        </h1>
        <p style={{ fontSize: 12, color: muted, margin: 0, fontFamily: "sans-serif" }}>
          High Porosity · 4B Coils · Post-Smoothing Protocol
        </p>
      </div>

      {/* Temple Banner */}
      <div style={{ margin: "16px 16px 0", background: "#1a0c04", borderLeft: `3px solid ${gold}`, borderRadius: "0 8px 8px 0", padding: "12px 14px" }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 5px", fontFamily: "sans-serif", fontWeight: 700 }}>⚠ TEMPLE PRIORITY ZONE</p>
        <p style={{ fontSize: 12, color: "#c0a888", margin: 0, fontFamily: "sans-serif", lineHeight: 1.6 }}>
          Zero product on temples except nightly oil. No braids, no edge control, no clips within ½ inch of your hairline. Nightly Mielle + JBCO only.
        </p>
      </div>

      <div style={{ padding: "20px 16px 0" }}>

        {/* Week Tabs */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: muted, margin: "0 0 10px", fontFamily: "sans-serif" }}>CURRENT WEEK</p>
          <div style={{ display: "flex", gap: 6 }}>
            {[1,2,3,4].map(w => (
              <button key={w} onClick={() => { setActiveWeek(w); setExpandedStep(null); }} style={{
                flex: 1, padding: "12px 4px",
                background: activeWeek === w ? "linear-gradient(135deg, #2a1a08, #1a1008)" : card,
                border: `1px solid ${activeWeek === w ? gold : border}`,
                borderRadius: 8, color: activeWeek === w ? gold : "#5a4838",
                fontFamily: "sans-serif", fontSize: 12, fontWeight: activeWeek === w ? 700 : 400,
                cursor: "pointer", transition: "all 0.15s"
              }}>
                Week {w}
              </button>
            ))}
          </div>
        </div>

        {/* Week Card */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>{week.label}</h2>
              <p style={{ margin: 0, fontSize: 13, color: muted, fontFamily: "sans-serif" }}>{week.subtitle}</p>
            </div>
            <span style={{
              background: week.tagColor + "18", border: `1px solid ${week.tagColor}`,
              color: week.tagColor, fontSize: 9, letterSpacing: 2, padding: "4px 9px",
              borderRadius: 4, fontFamily: "sans-serif", fontWeight: 700, flexShrink: 0
            }}>{week.tag}</span>
          </div>
          <p style={{ margin: "14px 0 0", fontSize: 12, color: "#b8a080", fontFamily: "sans-serif", lineHeight: 1.7, borderTop: `1px solid ${border}`, paddingTop: 12 }}>
            {week.notes}
          </p>
          {week.proteinNote && (
            <div style={{ marginTop: 10, background: "#1a1208", border: `1px solid ${gold}44`, borderRadius: 6, padding: "8px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: goldLight, fontFamily: "sans-serif" }}>{week.proteinNote}</p>
            </div>
          )}
        </div>

        {/* This Week's Products */}
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 10px", fontFamily: "sans-serif", fontWeight: 700 }}>
          THIS WEEK'S PRODUCTS
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
          {[
            ["SHAMPOO", week.shampoo],
            ["DEEP CONDITIONER", week.dc],
            ["CUTICLE SEAL — EVERY WEEK", "Redken Acidic Bonding Concentrate · 2 min rinse-out · never skip"],
            ["LCO STACK — EVERY WASH DAY", "Mizani 25 Miracle Milk (L) → TGIN Butter Cream Daily Moisturizer (C) → Sunny Isle JBCO ends only (O)"],
            ["HEAT PROTECTION — DOUBLE LAYER", "Thermal spray (Kenra/IGK/DE) before blow dry + Mizani Press Agent Serum before flat iron"],
          ].map(([label, val]) => (
            <div key={label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 8, padding: "11px 13px" }}>
              <p style={{ margin: "0 0 3px", fontSize: 9, letterSpacing: 2, color: "#6a5848", fontFamily: "sans-serif" }}>{label}</p>
              <p style={{ margin: 0, fontSize: 12, color: cream, fontFamily: "sans-serif", lineHeight: 1.5 }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Wash Day Steps */}
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 10px", fontFamily: "sans-serif", fontWeight: 700 }}>
          WASH DAY — STEP BY STEP
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
          {week.washDaySteps.map((section, idx) => (
            <div key={section.id} style={{
              background: card, borderRadius: 10, overflow: "hidden",
              border: `1px solid ${expandedStep === section.id ? gold : border}`,
              transition: "border-color 0.15s"
            }}>
              <button onClick={() => setExpandedStep(expandedStep === section.id ? null : section.id)} style={{
                width: "100%", padding: "13px 14px", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                background: "transparent", border: "none", cursor: "pointer", textAlign: "left"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "#0d0806", fontWeight: 800, fontFamily: "sans-serif"
                  }}>{idx + 1}</span>
                  <span style={{ fontSize: 13, color: cream, fontFamily: "sans-serif", fontWeight: 600 }}>{section.label}</span>
                </div>
                <span style={{ color: gold, fontSize: 20, lineHeight: 1 }}>{expandedStep === section.id ? "−" : "+"}</span>
              </button>
              {expandedStep === section.id && (
                <div style={{ padding: "4px 14px 14px", borderTop: `1px solid ${border}` }}>
                  {section.steps.map((step, si) => (
                    <div key={si} style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "flex-start" }}>
                      <span style={{ color: gold, fontSize: 12, flexShrink: 0, marginTop: 2 }}>›</span>
                      <span style={{ fontSize: 12, color: "#c0a888", fontFamily: "sans-serif", lineHeight: 1.6 }}>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nightly Routine */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: 0, fontFamily: "sans-serif", fontWeight: 700 }}>NIGHTLY ROUTINE</p>
          <span style={{ fontSize: 11, fontFamily: "sans-serif", color: nightlyCount === 5 ? green : gold }}>
            {nightlyCount}/5 tonight
          </span>
        </div>
        <p style={{ fontSize: 11, color: muted, margin: "0 0 10px", fontFamily: "sans-serif" }}>No water. Oil only. Every single night.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
          {nightlyTasks.map(task => (
            <button key={task.id} onClick={() => toggleNightly(task.id)} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              background: nightlyDone[task.id] ? greenBg : card,
              border: `1px solid ${nightlyDone[task.id] ? green : border}`,
              borderRadius: 8, padding: "11px 13px", cursor: "pointer",
              textAlign: "left", transition: "all 0.15s"
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                background: nightlyDone[task.id] ? green : "transparent",
                border: `1px solid ${nightlyDone[task.id] ? green : "#4a3020"}`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {nightlyDone[task.id] && <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 13, color: nightlyDone[task.id] ? green : cream, fontFamily: "sans-serif" }}>
                  {task.label}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: muted, fontFamily: "sans-serif" }}>{task.detail}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Scalp Tracker */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: 0, fontFamily: "sans-serif", fontWeight: 700 }}>SCALP MASSAGE TRACKER</p>
          <span style={{ fontSize: 11, fontFamily: "sans-serif", color: scalpCount >= 3 ? green : gold, fontWeight: 700 }}>
            {scalpCount} / 3–4 this week
          </span>
        </div>
        <p style={{ fontSize: 11, color: muted, margin: "0 0 10px", fontFamily: "sans-serif" }}>The Ordinary Density Serum · 5 min minimum · tap to log</p>
        <div style={{ display: "flex", gap: 5, marginBottom: 18 }}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => (
            <button key={day} onClick={() => toggleScalp(day)} style={{
              flex: 1, padding: "10px 2px",
              background: scalpDays[day] ? greenBg : card,
              border: `1px solid ${scalpDays[day] ? green : border}`,
              borderRadius: 6, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5
            }}>
              <span style={{ fontSize: 8, color: scalpDays[day] ? green : "#4a3828", fontFamily: "sans-serif", letterSpacing: 0.5 }}>{day}</span>
              <span style={{ fontSize: 15 }}>{scalpDays[day] ? "🌿" : "·"}</span>
            </button>
          ))}
        </div>

        {/* Protective Styles */}
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 10px", fontFamily: "sans-serif", fontWeight: 700 }}>PROTECTIVE STYLES</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
          {protStyles.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              background: card, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 13px"
            }}>
              <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{s.ok ? "✅" : "❌"}</span>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 12, color: s.ok ? cream : "#8a6858", fontFamily: "sans-serif", fontWeight: 600 }}>{s.style}</p>
                <p style={{ margin: 0, fontSize: 11, color: muted, fontFamily: "sans-serif" }}>{s.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-Week Refresh */}
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 10px", fontFamily: "sans-serif", fontWeight: 700 }}>MID-WEEK REFRESH (DAY 3–4)</p>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: 14, marginBottom: 18 }}>
          {[
            "Boar bristle brush — smooth frizz and redistribute oils",
            "Lightly run JBCO-coated fingers over the surface of your hair",
            "Re-wrap at night as usual",
            "Do NOT flat iron mid-week — use a low bun or pin curls to reset",
            "If you need to touch up, low bun or sleek ponytail gets you to wash day"
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < 4 ? 8 : 0 }}>
              <span style={{ color: gold, fontSize: 12, flexShrink: 0, marginTop: 2 }}>›</span>
              <span style={{ fontSize: 12, color: "#c0a888", fontFamily: "sans-serif", lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* 8-Week Master Cycle */}
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 10px", fontFamily: "sans-serif", fontWeight: 700 }}>8-WEEK MASTER CYCLE</p>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 14px", marginBottom: 18 }}>
          {masterCycle.map(({ wk, desc, protein, big }) => (
            <div key={wk} style={{ display: "flex", gap: 10, marginBottom: wk < 8 ? 10 : 0, alignItems: "flex-start" }}>
              <span style={{
                width: 22, height: 22, flexShrink: 0, borderRadius: "50%",
                background: wk === activeWeek ? `linear-gradient(135deg, ${gold}, ${goldLight})` :
                             big ? "#2a1608" : protein ? "#1a1208" : "#130e0a",
                border: `1px solid ${wk === activeWeek ? gold : big ? gold + "88" : protein ? gold + "44" : border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontFamily: "sans-serif", fontWeight: 800,
                color: wk === activeWeek ? "#080504" : big ? gold : protein ? gold + "cc" : "#5a4838"
              }}>{wk}</span>
              <p style={{ margin: 0, fontSize: 11, color: wk === activeWeek ? cream : wk > 4 ? "#6a5848" : "#9a8878", fontFamily: "sans-serif", lineHeight: 1.5 }}>
                {desc}
                {big && <span style={{ color: gold, display: "block", fontSize: 10, marginTop: 2 }}>← Full reset day · same session</span>}
              </p>
            </div>
          ))}
        </div>

        {/* Strand Test */}
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 10px", fontFamily: "sans-serif", fontWeight: 700 }}>WEEKLY STRAND TEST — DO THIS BEFORE EVERY WASH DAY</p>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#b8a080", fontFamily: "sans-serif", lineHeight: 1.6 }}>
            Pull one shed hair. Hold each end and stretch slowly. Read the result:
          </p>
          {[
            { result: "Stretches and snaps back slowly", meaning: "✅ Balanced — maintain current routine", color: green },
            { result: "Stretches a lot, goes limp or mushy", meaning: "💧 Moisture overload — use Biolage Don't Despair this week", color: "#7eb89a" },
            { result: "Barely stretches, snaps immediately", meaning: "⚡ Protein deficient — use Biolage or move up your ApHogee Two Minute", color: gold },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0d0906", borderRadius: 8, padding: "10px 12px", marginBottom: i < 2 ? 6 : 0, borderLeft: `3px solid ${item.color}` }}>
              <p style={{ margin: "0 0 3px", fontSize: 12, color: cream, fontFamily: "sans-serif", fontWeight: 600 }}>{item.result}</p>
              <p style={{ margin: 0, fontSize: 11, color: muted, fontFamily: "sans-serif" }}>{item.meaning}</p>
            </div>
          ))}
        </div>

        {/* Progress Photo Tracker */}
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 4px", fontFamily: "sans-serif", fontWeight: 700 }}>📸 MONTHLY PROGRESS PHOTO</p>
        <p style={{ fontSize: 11, color: muted, margin: "0 0 10px", fontFamily: "sans-serif" }}>Same wash day every month · stretched hair · same lighting · same position</p>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#b8a080", fontFamily: "sans-serif", lineHeight: 1.6 }}>
            Growth is slow and you won't see it without documentation. Hair grows ~½ inch per month — retention is what makes that stick. Take your photo on your Week 4 clarify day every cycle.
          </p>
          {[
            "Blow out hair fully before photo — no shrinkage",
            "Hold a tape measure or ruler alongside your hair",
            "Same angle, same lighting, every time — consistency is everything",
            "Compare every 8 weeks minimum — don't compare week to week",
            "Temple area gets its own close-up photo — track regrowth separately",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < 4 ? 8 : 0 }}>
              <span style={{ color: gold, fontSize: 12, flexShrink: 0, marginTop: 2 }}>›</span>
              <span style={{ fontSize: 12, color: "#c0a888", fontFamily: "sans-serif", lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>


        {/* Brazil Products */}
        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 4px", fontFamily: "sans-serif", fontWeight: 700 }}>🇧🇷 LOLA FROM RIO — HOW TO USE</p>
        <p style={{ fontSize: 11, color: muted, margin: "0 0 10px", fontFamily: "sans-serif" }}>Three products, three different roles in your regimen</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {[
            {
              name: "Umectação Oliva — Olive Oil Deep Mask",
              tag: "DC ROTATION",
              tagColor: "#7eb89a",
              desc: "Humectant treatment — olive oil penetrates the cortex, not just the surface. Use this as your third DC option when hair feels extremely dry, dull, or brittle. More intensive than Amika but less protein-focused than Biolage.",
              howto: [
                "Regular use: apply mid-shaft to ends after shampooing, plastic cap, 30 min under heat cap, rinse",
                "SOS overnight use: apply to dry hair section by section the night before wash day, loose bun, sleep on it, shampoo out in the morning",
                "Rotate in alongside Amika and Biolage based on strand test results"
              ]
            },
            {
              name: "Xapadinha — Disciplining Smoothing Mask",
              tag: "PRESS WEEKS ONLY",
              tagColor: "#c4914a",
              desc: "Smoothing mask that aligns the hair fiber and reduces frizz by up to 40%. Use this as your DC specifically on weeks when you're planning to flat iron — it makes your blow dry and press significantly easier and helps your style last longer.",
              howto: [
                "Press weeks only — do NOT use on natural texture or bun weeks",
                "Apply after shampooing, section by section mid-shaft to ends",
                "Plastic cap + heat cap — 30 minutes",
                "Rinse, then follow with Redken ABC as usual — the ABC locks the smoothing effect in further"
              ]
            },
            {
              name: "Rapunzel Tônico do Crescimento — Growth Tonic",
              tag: "SCALP GROWTH",
              tagColor: "#d4a85a",
              desc: "Powerful leave-on growth tonic with Jaborandi (Pilocarpus), Rosemary, Caffeine, Ginkgo Biloba, Nettle, and Ginger. Jaborandi is a Brazilian plant used for over a century for follicle stimulation — combined with Rosemary and Caffeine this is one of the strongest natural growth formulas available.",
              howto: [
                "Apply directly to clean dry or slightly damp scalp — do NOT rinse out",
                "Massage in gently — do not apply to the hair strands, scalp only",
                "Alternate with The Ordinary Density Serum on different days — do not stack both daily",
                "Mon / Wed / Fri → Rapunzel Tônico",
                "Tue / Thu / Sat → The Ordinary Density Serum",
                "Sun (wash day pre-poo) → The Ordinary Density Serum"
              ]
            }
          ].map((prod, i) => (
            <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 13, color: cream, fontFamily: "sans-serif", fontWeight: 700, flex: 1, paddingRight: 8 }}>{prod.name}</p>
                <span style={{
                  background: prod.tagColor + "18", border: `1px solid ${prod.tagColor}`,
                  color: prod.tagColor, fontSize: 8, letterSpacing: 1.5, padding: "3px 7px",
                  borderRadius: 4, fontFamily: "sans-serif", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap"
                }}>{prod.tag}</span>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#b8a080", fontFamily: "sans-serif", lineHeight: 1.6 }}>{prod.desc}</p>
              <div style={{ borderTop: `1px solid ${border}`, paddingTop: 10 }}>
                <p style={{ margin: "0 0 6px", fontSize: 9, letterSpacing: 2, color: "#6a5848", fontFamily: "sans-serif" }}>HOW TO USE</p>
                {prod.howto.map((step, si) => (
                  <div key={si} style={{ display: "flex", gap: 8, marginBottom: si < prod.howto.length - 1 ? 6 : 0 }}>
                    <span style={{ color: gold, fontSize: 12, flexShrink: 0, marginTop: 2 }}>›</span>
                    <span style={{ fontSize: 12, color: "#c0a888", fontFamily: "sans-serif", lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10, letterSpacing: 3, color: gold, margin: "0 0 10px", fontFamily: "sans-serif", fontWeight: 700 }}>NEVER BREAK THESE RULES</p>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 14 }}>
          {[
            "Apply heat without your double thermal protection stack",
            "Skip wash day — weekly is non-negotiable at your heat frequency",
            "Use rubber bands anywhere in your hair",
            "Use alcohol-based edge control",
            "Do more than one flat iron pass per section",
            "Braid, clip, or apply product to your temple area",
            "Go to sleep without your oil, scarf, and bonnet",
            "Do hard protein and smoothing treatment on separate days",
          ].map((rule, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < 7 ? 8 : 0 }}>
              <span style={{ color: "#7a2a18", fontSize: 12, flexShrink: 0, marginTop: 2, fontWeight: 700 }}>✕</span>
              <span style={{ fontSize: 12, color: "#7a6858", fontFamily: "sans-serif", lineHeight: 1.5 }}>{rule}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
