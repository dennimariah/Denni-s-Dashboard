// Journal view — list + new entry editor

const JournalView = ({ state, setState }) => {
  const { journal, moodWeek } = state;
  const [draft, setDraft] = useState({ title: "", body: "", mood: "🌸" });
  const [filter, setFilter] = useState("all");

  const save = () => {
    if (!draft.title.trim() && !draft.body.trim()) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    setState(s => ({
      ...s,
      journal: [{ id: "j" + Date.now(), date: dateStr, ...draft }, ...s.journal],
    }));
    setDraft({ title: "", body: "", mood: "🌸" });
  };

  const remove = (id) => {
    setState(s => ({ ...s, journal: s.journal.filter(j => j.id !== id) }));
  };

  const entries = journal;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Journal</div>
          <h1 className="page-head__title">Field notes from your life</h1>
          <div className="page-head__date mt-sm">{journal.length} entries · most recent {journal[0]?.date}</div>
        </div>
        <div className="row gap-md">
          {MOOD_OPTIONS.slice(2, 7).map(m => (
            <button
              key={m.id}
              className={cls("mood-emoji", draft.mood === m.emoji && "mood-emoji--active")}
              style={{ width: 36, height: 36, fontSize: 18 }}
              onClick={() => setDraft(d => ({ ...d, mood: m.emoji }))}
              title={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="bento">
        <div className="col-8">
          {/* Editor */}
          <div className="journal-editor">
            <div className="row row--between" style={{ marginBottom: 8 }}>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}>
                New entry · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div className="row gap-sm">
                <span style={{ fontSize: 20 }}>{draft.mood}</span>
                <span className="text-mono fs-xs text-muted">mood</span>
              </div>
            </div>
            <input
              placeholder="A title for today…"
              value={draft.title}
              onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
            />
            <textarea
              placeholder="What's on your mind? What happened today? What are you grateful for, working through, dreaming about…"
              value={draft.body}
              onChange={(e) => setDraft(d => ({ ...d, body: e.target.value }))}
            />
            <div className="row row--between mt-md">
              <div className="text-mono fs-xs text-muted">
                {draft.body.split(/\s+/).filter(Boolean).length} words
              </div>
              <button className="btn btn--pink" onClick={save}>
                <Icon name="spark" size={14}/> Save entry
              </button>
            </div>
          </div>

          {/* Entries list */}
          <div style={{ marginTop: 22 }}>
            <div className="row row--between" style={{ marginBottom: 12 }}>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}>Past entries</div>
              <div className="row gap-sm">
                {["all", "good", "okay", "low"].map(f => (
                  <button
                    key={f}
                    className="pill pill--mono"
                    style={{
                      cursor: "pointer",
                      background: filter === f ? "var(--primary)" : "var(--card-2)",
                      color: filter === f ? "white" : "var(--ink-soft)",
                    }}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {entries.map(e => (
              <div key={e.id} className="journal-entry">
                <div className="journal-entry__mood">{e.mood}</div>
                <div className="journal-entry__date">{e.date}</div>
                <h3 className="journal-entry__title">{e.title}</h3>
                <p className="journal-entry__body">{e.body}</p>
                <button
                  className="btn btn--ghost"
                  style={{ position: "absolute", top: 14, right: 50, padding: 4 }}
                  onClick={() => remove(e.id)}
                  title="Delete"
                >
                  <Icon name="trash" size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar — mood trends + prompts */}
        <div className="col-4">
          <div className="card card--pink">
            <CardHead title="This week's mood" sub="7-day weather" />
            <div className="row gap-sm" style={{ alignItems: "flex-end" }}>
              {moodWeek.map((m, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 26, height: 32 }}>{m.emoji || "·"}</div>
                  <div className="text-mono fs-xs" style={{ marginTop: 2, color: "var(--primary-deep)" }}>{m.day}</div>
                </div>
              ))}
            </div>
            <div className="mt-md text-soft fs-sm" style={{ lineHeight: 1.55 }}>
              Mostly steady this week with a Wednesday peak. Take note of what worked.
            </div>
          </div>

          <div className="card mt-md">
            <CardHead title="Writing prompts" sub="If you need a nudge" />
            <div className="col gap-sm">
              {[
                "What's something you'd love to forget about today?",
                "Three things you're grateful for, big or small.",
                "If today were a color, what would it be?",
                "What did your body need today, and did you give it?",
                "Who took up too much space in your head?",
              ].map((p, i) => (
                <button
                  key={i}
                  className="idea-chip"
                  style={{ background: "var(--card-2)", textAlign: "left", cursor: "pointer", border: "1px solid var(--line)" }}
                  onClick={() => setDraft(d => ({ ...d, title: p }))}
                >
                  <span className="idea-chip__bullet" style={{ background: "var(--accent-3)" }}/>
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card card--mint mt-md">
            <CardHead title="Streaks" sub="Consistency" />
            <div className="col gap-sm">
              <div className="row row--between">
                <span>Journaling</span>
                <Pill tone="mint" mono>11 days</Pill>
              </div>
              <div className="row row--between">
                <span>Longest streak</span>
                <Pill tone="mint" mono>34 days</Pill>
              </div>
              <div className="row row--between">
                <span>Entries this year</span>
                <Pill tone="mint" mono>87</Pill>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

window.JournalView = JournalView;
