// Main app
const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "strawberry",
  "show": {
    "today": true,
    "week": true,
    "habits": true,
    "quarter": true,
    "finance": true,
    "journal": true,
    "recipes": true,
    "content": true,
    "hair": true,
    "briefing": true
  }
} /*EDITMODE-END*/;

const App = () => {
  const [tweak, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [shortcut, setShortcut] = useS(null);

  const [state, setState] = useS(() => ({
    page: "today",
    tasks: SEED_TASKS,
    habits: SEED_HABITS,
    habitLogs: SEED_HABIT_LOGS,
    agenda: SEED_AGENDA,
    gymWeek: SEED_GYM_WEEK,
    cards: SEED_CARDS,
    budget: SEED_BUDGET,
    savings: SEED_SAVINGS,
    quarterGoals: SEED_QUARTER_GOALS,
    parking: SEED_PARKING_LOT,
    journal: SEED_JOURNAL,
    recipes: SEED_RECIPES,
    content: SEED_CONTENT,
    transactions: SEED_TRANSACTIONS,
    moodWeek: SEED_MOOD_WEEK,
    hair: {
      activeWeek: 1,
      nightlyDone: {},
      scalpDays: { Mon: true, Wed: true }
    },
    focus: "Move slow. Finish the newsletter. Be in my body.",
    reflections: {
      wins: "Pilates 3x already, kept the 8am wake-up.",
      push: "Newsletter draft — keep it short, ship Friday."
    },
    show: TWEAK_DEFAULTS.show
  }));

  // Sync visibility tweaks down into state
  useE(() => {
    setState((s) => ({ ...s, show: tweak.show }));
  }, [tweak.show]);

  // Apply theme on mount + when changed
  useE(() => {
    applyTheme(tweak.theme);
  }, [tweak.theme]);

  const nav = [
  { id: "today", label: "Today", icon: "spark" },
  { id: "week", label: "This week", icon: "week" },
  { id: "habits", label: "Habits", icon: "habit" },
  { id: "quarter", label: "Quarter", icon: "quarter" },
  { id: "finance", label: "Finance", icon: "money" },
  { id: "journal", label: "Journal", icon: "book" },
  { id: "recipes", label: "Kitchen", icon: "chef" },
  { id: "content", label: "Content", icon: "sparkle" },
  { id: "hair", label: "Hair", icon: "leaf" }].
  filter((n) => state.show[n.id] !== false);

  // Counts for sidebar badges
  const openTasks = state.tasks.filter((t) => !t.done).length;
  const badges = {
    today: openTasks,
    week: openTasks
  };

  const VIEWS = {
    today: TodayView,
    week: WeekView,
    habits: HabitsView,
    quarter: QuarterView,
    finance: FinanceView,
    journal: JournalView,
    recipes: RecipesView,
    content: ContentView,
    hair: HairView
  };
  const ActiveView = VIEWS[state.page] || TodayView;

  const setPage = (id) => setState((s) => ({ ...s, page: id }));

  return (
    <div className="app" data-screen-label={state.page}>
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark">D</div>
          <div>
            <div className="sidebar__brand-name">Dennika</div>
            <div className="sidebar__brand-sub">Personal OS · v2</div>
          </div>
        </div>

        <div className="sidebar__section-label">Workspace</div>
        {nav.map((n) =>
        <NavItem
          key={n.id}
          id={n.id}
          label={n.label}
          icon={n.icon}
          active={state.page === n.id}
          badge={badges[n.id]}
          onClick={setPage} />

        )}

        <div className="sidebar__section-label">Shortcuts</div>
        <button className="sidebar__item" data-comment-anchor="5296f3d0d6-button-109-9" onClick={() => setShortcut("mood")}>
          <span className="sidebar__item-icon"><Icon name="heart" /></span>
          <span>Mood check-in</span>
        </button>
        <button className="sidebar__item" onClick={() => setShortcut("briefing")}>
          <span className="sidebar__item-icon"><Icon name="phone" /></span>
          <span>Briefing settings</span>
        </button>

        <div className="sidebar__footer">
          <div className="sidebar__avatar">D</div>
          <div>
            <div className="sidebar__user">Dennika</div>
            <div className="sidebar__streak">14-day streak 🔥</div>
          </div>
        </div>
      </aside>

      <main className="main" data-screen-label={state.page}>
        <ActiveView state={state} setState={setState} />
      </main>

      <DashboardTweaks tweak={tweak} setTweak={setTweak} />
      {shortcut === "mood" && <MoodCheckInModal state={state} setState={setState} onClose={() => setShortcut(null)} />}
      {shortcut === "briefing" && <BriefingSettingsModal onClose={() => setShortcut(null)} />}
    </div>);

};

// ----------------- Shortcut modals -----------------
const Modal = ({ title, sub, onClose, children, accent = "var(--primary)" }) => (
  <div
    style={{ position: "fixed", inset: 0, background: "rgba(58,29,40,0.42)", zIndex: 60, display: "grid", placeItems: "center", padding: 24, backdropFilter: "blur(4px)" }}
    onClick={onClose}>
    <div
      className="card"
      style={{ maxWidth: 460, width: "100%", padding: 0, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}
      onClick={(e) => e.stopPropagation()}>
      <div style={{ height: 6, background: accent }}/>
      <div style={{ padding: 22 }}>
        <div className="row row--between" style={{ alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}>{sub}</div>
            <h3 className="text-serif" style={{ fontSize: 30, margin: "4px 0 0", lineHeight: 1.1 }}>{title}</h3>
          </div>
          <button className="btn btn--icon" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

const MoodCheckInModal = ({ state, setState, onClose }) => {
  const [chosen, setChosen] = useS(state.moodWeek[1].emoji);
  const [note, setNote] = useS("");

  const save = () => {
    setState((s) => ({
      ...s,
      moodWeek: s.moodWeek.map((m, i) => i === 1 ? { ...m, emoji: chosen, mood: 4 } : m)
    }));
    onClose();
  };

  return (
    <Modal title="How are you, really?" sub="Mood check-in · Tuesday" onClose={onClose}>
      <div className="mood-grid" style={{ gap: 10 }}>
        {MOOD_OPTIONS.map((opt) => {
          const active = chosen === opt.emoji;
          return (
            <button key={opt.id} className="mood-pick" onClick={() => setChosen(opt.emoji)}>
              <span className={cls("mood-emoji", active && "mood-emoji--active")} style={{ width: 48, height: 48, fontSize: 24 }}>{opt.emoji}</span>
              <span className="mood-label">{opt.label}</span>
            </button>);
        })}
      </div>

      <div className="mt-lg">
        <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>One-line note (optional)</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's shaping the day?"
          style={{ width: "100%", minHeight: 70, border: "1px solid var(--line)", borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.5, background: "var(--card-2)", outline: "none", resize: "vertical" }}/>
      </div>

      <div className="row row--between mt-lg">
        <div className="text-mono fs-xs text-muted">Auto-logs to your journal mood trend</div>
        <div className="row gap-sm">
          <button className="btn btn--ghost" onClick={onClose}>Skip</button>
          <button className="btn btn--pink" onClick={save}><Icon name="check" size={14}/> Save</button>
        </div>
      </div>
    </Modal>);
};

const BriefingSettingsModal = ({ onClose }) => {
  const [time, setTime] = useS("08:00");
  const [channel, setChannel] = useS("iMessage");
  const [includes, setIncludes] = useS({
    weather: true,
    agenda: true,
    tasks: true,
    focus: true,
    habits: false,
    quote: true
  });

  const toggle = (k) => setIncludes((i) => ({ ...i, [k]: !i[k] }));

  const include = [
    ["weather", "Today's weather"],
    ["agenda",  "Calendar events"],
    ["tasks",   "Open tasks (1–5)"],
    ["focus",   "Weekly focus"],
    ["habits",  "Today's habit list"],
    ["quote",   "Tiny morning quote"]
  ];

  return (
    <Modal title="Morning briefing" sub="Settings · sends every morning" onClose={onClose} accent="var(--accent-3)">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Delivery time</div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "var(--font-mono)", background: "var(--card-2)", outline: "none" }}/>
        </div>
        <div>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Channel</div>
          <div className="row gap-sm" style={{ gap: 4 }}>
            {["iMessage", "SMS", "Email"].map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  border: channel === c ? "1px solid var(--primary)" : "1px solid var(--line)",
                  background: channel === c ? "var(--primary-soft)" : "var(--card)",
                  color: channel === c ? "var(--primary-deep)" : "var(--ink-soft)",
                  fontWeight: channel === c ? 600 : 500,
                  borderRadius: 10,
                  fontSize: 12.5,
                  cursor: "pointer"
                }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>What to include</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {include.map(([k, label]) => {
          const on = includes[k];
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--line)",
                background: on ? "var(--primary-soft)" : "var(--card-2)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                fontSize: 13,
                color: on ? "var(--primary-deep)" : "var(--ink-soft)",
                fontWeight: on ? 600 : 500
              }}>
              <span style={{
                width: 16, height: 16, borderRadius: 5,
                background: on ? "var(--primary)" : "white",
                border: on ? "0" : "1.5px solid var(--line)",
                color: "white", display: "grid", placeItems: "center", flexShrink: 0
              }}>
                {on && <Icon name="check" size={11} stroke={2.6}/>}
              </span>
              {label}
            </button>);
        })}
      </div>

      <div className="card card--pink" style={{ marginTop: 18, padding: 14 }}>
        <div className="text-mono fs-xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-deep)", marginBottom: 6 }}>Preview · arrives at {time}</div>
        <div style={{ whiteSpace: "pre-line", fontSize: 12.5, lineHeight: 1.55, color: "var(--ink)" }}>
{`Good morning Dennika ✦
${includes.weather ? "70° and sunny, light breeze\n" : ""}${includes.agenda ? "📅 3 events today\n" : ""}${includes.tasks ? "✅ 4 open tasks\n" : ""}${includes.focus ? '"Move slow. Finish the newsletter."\n' : ""}${includes.habits ? "🌸 5 habits queued\n" : ""}${includes.quote ? "✨ \"Begin gently.\"" : ""}`}
        </div>
      </div>

      <div className="row row--between mt-lg">
        <div className="text-mono fs-xs text-muted">Delivered via {channel}</div>
        <div className="row gap-sm">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--pink" onClick={onClose}><Icon name="check" size={14}/> Save</button>
        </div>
      </div>
    </Modal>);
};

// ----------------- Tweaks panel -----------------
const DashboardTweaks = ({ tweak, setTweak }) => {
  const toggleShow = (key) => {
    setTweak("show", { ...tweak.show, [key]: !tweak.show[key] });
  };

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Color theme" subtitle="Swap palettes anywhere">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(THEMES).map(([key, t]) => {
            const active = tweak.theme === key;
            return (
              <button
                key={key}
                onClick={() => setTweak("theme", key)}
                style={{
                  border: active ? "2px solid var(--primary)" : "1px solid var(--line)",
                  borderRadius: 12,
                  padding: 10,
                  background: t.vars["--card"],
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit"
                }}>
                
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  {t.swatches.map((c, i) =>
                  <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: c, border: i === 0 ? "1px solid #00000010" : "none" }} />
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.vars["--ink"] }}>{t.label}</div>
              </button>);

          })}
        </div>
      </TweakSection>

      <TweakSection title="Show components" subtitle="Toggle widgets and views on/off">
        {[
        ["today", "Today dashboard"],
        ["week", "Week view"],
        ["habits", "Habit tracker"],
        ["quarter", "Quarter view"],
        ["finance", "Finance & budget"],
        ["journal", "Journal"],
        ["recipes", "Recipe library"],
        ["content", "Content ideas"],
        ["hair", "Hair regimen"],
        ["briefing", "SMS briefing preview"]].
        map(([key, label]) =>
        <TweakToggle
          key={key}
          label={label}
          value={!!tweak.show[key]}
          onChange={() => toggleShow(key)} />

        )}
      </TweakSection>

      <TweakSection title="Tips">
        <div style={{ fontSize: 11.5, lineHeight: 1.55, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          · Click any checkbox to feel a confetti pop<br />
          · Tap habit cells to toggle daily marks<br />
          · Click on any task or goal text to edit<br />
          · The mood emojis on Today save your day's vibe
        </div>
      </TweakSection>
    </TweaksPanel>);

};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);