// Week view — full task list by day + weekly focus + gym

const WeekView = ({ state, setState }) => {
  const { tasks, gymWeek } = state;
  const [weekOffset, setWeekOffset] = useState(0);

  const toggleTask = (id, e) => {
    if (e && !tasks.find(t => t.id === id).done) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }));
  };

  const addTaskToDay = (day) => {
    const id = "t" + Date.now();
    setState(s => ({ ...s, tasks: [...s.tasks, { id, text: "New task", done: false, day }] }));
  };

  const editTask = (id, text) => {
    setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, text } : t) }));
  };

  const removeTask = (id) => {
    setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }));
  };

  const taskByDay = DAYS_OF_WEEK.map(d => ({
    day: d,
    items: tasks.filter(t => t.day === d),
  }));

  const totalDone = tasks.filter(t => t.done).length;
  const labels = ["Last week", "This week", "Next week", "+2 weeks"];
  const dateRange = ["May 12 – May 18", "May 19 – May 25", "May 26 – Jun 1", "Jun 2 – Jun 8"];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Week view</div>
          <h1 className="page-head__title">{labels[weekOffset + 1] || "This week"}</h1>
          <div className="page-head__date mt-sm">{dateRange[weekOffset + 1]}</div>
        </div>
        <div className="row gap-md">
          <div className="weeknav">
            <button className="weeknav__btn" onClick={() => setWeekOffset(o => Math.max(-1, o - 1))}><Icon name="arrow-l" size={14}/></button>
            <span className="weeknav__label">{labels[weekOffset + 1]}</span>
            <button className="weeknav__btn" onClick={() => setWeekOffset(o => Math.min(2, o + 1))}><Icon name="arrow-r" size={14}/></button>
          </div>
          <Pill tone="pink" mono>{totalDone}/{tasks.length} done</Pill>
        </div>
      </div>

      <div className="bento">
        {/* Weekly focus + reflections */}
        <div className="card col-7">
          <CardHead title="Weekly focus" sub="What matters this week" />
          <div className="focus-box">
            <div className="focus-box__label">North star</div>
            <Editable
              value={state.focus}
              onChange={(v) => setState(s => ({ ...s, focus: v }))}
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 26, lineHeight: 1.2 }}
              multiline
            />
          </div>
          <div className="bento mt-md" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {[
              { label: "Wins so far", placeholder: "What's going well?", key: "wins" },
              { label: "Push through", placeholder: "Where I need grit", key: "push" },
            ].map(f => (
              <div key={f.key} className="card card--tinted" style={{ padding: 16 }}>
                <div className="card__sub" style={{ marginBottom: 6 }}>{f.label}</div>
                <Editable
                  value={state.reflections[f.key]}
                  onChange={(v) => setState(s => ({ ...s, reflections: { ...s.reflections, [f.key]: v } }))}
                  placeholder={f.placeholder}
                  multiline
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gym tracker */}
        <div className="card col-5">
          <CardHead
            title="Gym sessions"
            sub={`${gymWeek.filter(g => g.done).length}/5 weekly goal`}
            right={<button className="btn btn--icon"><Icon name="plus" size={14}/></button>}
          />
          <div className="gym-grid">
            {gymWeek.map((g, i) => (
              <button
                key={i}
                className={cls("gym-cell", g.done && "gym-cell--done", g.rest && "gym-cell--rest")}
                onClick={() => setState(s => ({ ...s, gymWeek: s.gymWeek.map((x, j) => j === i ? { ...x, done: !x.done } : x) }))}
              >
                <span className="gym-cell__day">{g.day}</span>
                <span className="gym-cell__icon">{g.rest ? "☁︎" : g.done ? "✓" : "·"}</span>
                <span style={{ fontSize: 9, marginTop: 2 }}>{g.type}</span>
              </button>
            ))}
          </div>
          <div className="mt-lg">
            <div className="row row--between" style={{ marginBottom: 6 }}>
              <span className="text-mono fs-xs text-muted">Last 13 weeks</span>
              <span className="text-mono fs-xs text-muted">avg 4.1/wk</span>
            </div>
            <div className="row gap-sm" style={{ alignItems: "flex-end", height: 60 }}>
              {[3, 4, 5, 4, 5, 3, 4, 5, 4, 5, 5, 4, 3].map((v, i) => (
                <div key={i}
                  style={{
                    flex: 1,
                    height: (v / 5) * 100 + "%",
                    background: "var(--primary)",
                    borderRadius: 4,
                    opacity: i === 12 ? 1 : 0.55,
                  }}/>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks by day grid */}
        {taskByDay.map((col, i) => {
          const isToday = col.day === "Tue";
          return (
            <div key={col.day} className={cls("card", "col-3", isToday && "card--pink")} style={{ minHeight: 200 }}>
              <div className="row row--between" style={{ marginBottom: 10 }}>
                <div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em" }}>{col.day}</div>
                  <div className="text-serif" style={{ fontSize: 22 }}>{19 + i}</div>
                </div>
                {isToday && <Pill tone="pink" mono>today</Pill>}
              </div>
              {col.items.length === 0 && (
                <div className="empty" style={{ padding: "12px 0" }}>nothing yet</div>
              )}
              {col.items.map(t => (
                <div key={t.id} className={cls("task", t.done && "task--done")} style={{ padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                  <button
                    className={cls("task__check", t.done && "task__check--done")}
                    onClick={(e) => toggleTask(t.id, e)}
                    style={{ width: 18, height: 18 }}
                  >
                    {t.done && <Icon name="check" size={11} stroke={2.4}/>}
                  </button>
                  <Editable
                    value={t.text}
                    onChange={(v) => editTask(t.id, v)}
                    style={{ fontSize: 12.5, padding: "0 4px", textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--muted)" : "var(--ink)" }}
                  />
                  <button className="btn btn--ghost" style={{ padding: 2, color: "var(--muted)" }} onClick={() => removeTask(t.id)}>
                    <Icon name="x" size={12}/>
                  </button>
                </div>
              ))}
              <button
                className="btn btn--ghost"
                style={{ marginTop: 10, fontSize: 12, padding: "4px 8px" }}
                onClick={() => addTaskToDay(col.day)}
              >
                <Icon name="plus" size={12}/> Add
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

window.WeekView = WeekView;
