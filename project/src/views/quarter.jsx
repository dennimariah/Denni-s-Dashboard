// Quarter view — goals + parking lot + quarterly stats

const QuarterView = ({ state, setState }) => {
  const { quarterGoals, parking } = state;

  const categories = ["Health", "Finance", "Business", "Personal"];
  const catColor = {
    Health:   { bg: "var(--primary-soft)",  text: "var(--primary-deep)",  accent: "var(--primary)" },
    Finance:  { bg: "var(--accent-2-soft)", text: "#3d6b4f",              accent: "var(--accent-2)" },
    Business: { bg: "var(--accent-3-soft)", text: "#5e4b85",              accent: "var(--accent-3)" },
    Personal: { bg: "var(--accent-1-soft)", text: "#8b4f1c",              accent: "var(--accent-1)" },
  };

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

  const addGoal = (cat) => {
    setState(s => ({ ...s, quarterGoals: [...s.quarterGoals, { id: "g" + Date.now(), category: cat, text: "New goal", done: false }] }));
  };

  const addParking = () => {
    setState(s => ({ ...s, parking: ["New idea", ...s.parking] }));
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
          <div className="page-head__greeting">Q2 · April – June 2026</div>
          <h1 className="page-head__title">The bigger picture</h1>
          <div className="page-head__date mt-sm">38 days remaining</div>
        </div>
        <div className="row gap-md">
          <div className="card" style={{ padding: "10px 18px", display: "flex", alignItems: "baseline", gap: 10 }}>
            <span className="text-serif" style={{ fontSize: 28, color: "var(--primary)" }}>{totalPct}%</span>
            <span className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.1em" }}>quarter complete</span>
          </div>
        </div>
      </div>

      <div className="bento">
        {/* Quarter at-a-glance */}
        <div className="card col-12 card--tinted">
          <div className="bento" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Goals completed", value: `${totalDone}/${quarterGoals.length}`, sub: "across 4 categories" },
              { label: "Books read",      value: "4",                   sub: "of 6 target" },
              { label: "Gym sessions",    value: "47",                  sub: "vs 52 target" },
              { label: "Savings added",   value: "$2,180",              sub: "this quarter" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</div>
                <div className="text-serif" style={{ fontSize: 36, color: "var(--ink)", marginTop: 4 }}>{s.value}</div>
                <div className="fs-xs text-muted">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal categories */}
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
                      className={cls("goal-check", g.done && "goal-check--done")}
                      style={g.done ? { background: c.accent, borderColor: c.accent } : {}}
                      onClick={(e) => toggleGoal(g.id, e)}
                    >
                      {g.done && <Icon name="check" size={11} stroke={2.6}/>}
                    </button>
                    <Editable
                      value={g.text}
                      onChange={(v) => editGoal(g.id, v)}
                      style={{ fontSize: 13.5, color: g.done ? "var(--muted)" : "var(--ink)", textDecoration: g.done ? "line-through" : "none" }}
                    />
                  </div>
                ))}
                {items.length === 0 && <div className="empty">no goals yet — add one</div>}
              </div>
            </div>
          );
        })}

        {/* Parking lot */}
        <div className="card col-7 card--lilac">
          <CardHead
            title="Parking lot"
            sub="Ideas to come back to"
            right={<button className="btn btn--icon" onClick={addParking}><Icon name="plus" size={14}/></button>}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {parking.map((p, i) => (
              <div key={i} className="idea-chip" style={{ background: "rgba(255,255,255,0.7)" }}>
                <span className="idea-chip__bullet"/>
                <Editable value={p} onChange={(v) => editParking(i, v)} style={{ fontSize: 13 }}/>
                <button className="btn btn--ghost" style={{ padding: 2 }} onClick={() => removeParking(i)}>
                  <Icon name="x" size={11}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card col-5 card--peach">
          <CardHead
            title="Wins this quarter"
            sub="What you're proud of"
            right={<button className="btn btn--icon"><Icon name="plus" size={14}/></button>}
          />
          <div className="col gap-sm">
            {[
              { txt: "Hit 4 weeks straight of pilates 🌸", color: "var(--primary)" },
              { txt: "Paid off the small Amex card 💸",     color: "var(--accent-2)" },
              { txt: "Finished my morning routine system ✨", color: "var(--accent-3)" },
              { txt: "Sonoma weekend was actually restful 🍇", color: "var(--accent-1)" },
            ].map((w, i) => (
              <div key={i} className="idea-chip" style={{ background: "rgba(255,255,255,0.75)" }}>
                <span className="idea-chip__bullet" style={{ background: w.color }}/>
                <span>{w.txt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

window.QuarterView = QuarterView;
