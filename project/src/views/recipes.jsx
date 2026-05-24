// Recipe log view

const RecipesView = ({ state, setState }) => {
  const { recipes } = state;
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);

  const types = ["all", "Breakfast", "Lunch", "Dinner", "Side", "Snack", "Dessert"];

  const filtered = filter === "all" ? recipes : recipes.filter(r => r.type === filter);
  const favs = recipes.filter(r => r.fav).length;

  const toggleFav = (id) => {
    setState(s => ({ ...s, recipes: s.recipes.map(r => r.id === id ? { ...r, fav: !r.fav } : r) }));
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Kitchen · {recipes.length} recipes</div>
          <h1 className="page-head__title">Recipe library</h1>
          <div className="page-head__date mt-sm">{favs} favorites · 3 tried this month</div>
        </div>
        <div className="row gap-md">
          <button className="btn btn--ghost"><Icon name="search" size={14}/> Search</button>
          <button className="btn btn--pink"><Icon name="plus" size={14}/> Add recipe</button>
        </div>
      </div>

      {/* Filters */}
      <div className="row gap-sm" style={{ flexWrap: "wrap", marginBottom: 18 }}>
        {types.map(t => (
          <button
            key={t}
            className="pill pill--mono"
            style={{
              cursor: "pointer",
              background: filter === t ? "var(--primary)" : "var(--card)",
              color: filter === t ? "white" : "var(--ink-soft)",
              border: filter === t ? "1px solid var(--primary)" : "1px solid var(--line)",
            }}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="recipe-grid">
        {filtered.map(r => (
          <div key={r.id} className="recipe-card" onClick={() => setOpen(r)}>
            <div className="recipe-card__img" style={{ background: r.bg }}>
              {r.icon}
              <button
                className="recipe-fav"
                onClick={(e) => { e.stopPropagation(); toggleFav(r.id); }}
                title="Favorite"
              >
                {r.fav ? "♥" : "♡"}
              </button>
            </div>
            <div className="recipe-card__body">
              <h4 className="recipe-card__title">{r.name}</h4>
              <div className="recipe-card__meta">
                <span>{r.time}</span>
                <span>·</span>
                <span>{r.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe modal */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(58,29,40,0.4)", zIndex: 50, display: "grid", placeItems: "center", padding: 20 }}
          onClick={() => setOpen(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 560, width: "100%", maxHeight: "85vh", overflow: "auto", padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ background: open.bg, height: 180, display: "grid", placeItems: "center", fontSize: 80, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", position: "relative" }}>
              {open.icon}
              <button
                className="btn btn--icon"
                style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.8)" }}
                onClick={() => setOpen(null)}
              >
                <Icon name="x" size={14}/>
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <div className="row gap-sm" style={{ marginBottom: 6 }}>
                <Pill tone="pink" mono>{open.type}</Pill>
                <Pill tone="lilac" mono>{open.time}</Pill>
              </div>
              <h2 className="text-serif" style={{ fontSize: 32, margin: "8px 0 14px" }}>{open.name}</h2>

              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Ingredients</div>
              <ul style={{ paddingLeft: 18, color: "var(--ink-soft)", lineHeight: 1.8 }}>
                <li>1 cup of the main thing</li>
                <li>2 tbsp of the secret thing</li>
                <li>Salt, pepper, a squeeze of lemon</li>
                <li>Whatever herb you have on hand</li>
              </ul>

              <div className="text-mono fs-xs text-muted mt-md" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Steps</div>
              <ol style={{ paddingLeft: 18, color: "var(--ink-soft)", lineHeight: 1.8 }}>
                <li>Get your mise en place sorted, queen.</li>
                <li>Heat the pan medium-low; add the fat.</li>
                <li>Combine, taste, season. Trust yourself.</li>
                <li>Plate it pretty. Photograph optional.</li>
              </ol>

              <div className="row mt-lg gap-sm">
                <button className="btn btn--pink"><Icon name="check" size={14}/> I made this</button>
                <button className="btn btn--ghost"><Icon name="edit" size={14}/> Edit</button>
                <button className="btn btn--ghost" onClick={() => toggleFav(open.id)}>
                  {open.fav ? "♥ Favorited" : "♡ Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

window.RecipesView = RecipesView;
