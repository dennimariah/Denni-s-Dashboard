// Finance + budget view

const FinanceView = ({ state, setState }) => {
  const { cards, budget, savings, transactions } = state;
  const [txOpen, setTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // Compute budget spending from transactions instead of static field
  const liveBudget = budget.map(b => {
    const txSpent = transactions
      .filter(t => t.category === b.category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { ...b, spent: txSpent || b.spent };
  });

  const totalDebt = cards.reduce((s, c) => s + c.balance, 0);
  const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
  const totalSpent = liveBudget.reduce((s, b) => s + b.spent, 0);
  const totalBudget = liveBudget.reduce((s, b) => s + b.budget, 0);
  const totalSaved = savings.reduce((s, x) => s + x.saved, 0);
  const totalSavingsGoal = savings.reduce((s, x) => s + x.goal, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Finance · May 2026</div>
          <h1 className="page-head__title">Money & vibes</h1>
        </div>
        <div className="row gap-md">
          <Pill tone="pink" mono>{currency(totalDebt)} owed</Pill>
          <Pill tone="mint" mono>{currency(totalSaved)} saved</Pill>
          <Pill tone="lilac" mono>{Math.round(((totalBudget - totalSpent) / totalBudget) * 100)}% budget left</Pill>
          <button className="btn btn--pink" onClick={() => { setEditingTx(null); setTxOpen(true); }}>
            <Icon name="plus" size={14}/> Log transaction
          </button>
        </div>
      </div>

      <div className="bento">
        {/* Top stats */}
        <div className="card col-12 card--tinted">
          <div className="bento" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Net worth",          value: currency(totalSaved - totalDebt), sub: "this month",         tone: "var(--primary)" },
              { label: "Spent this month",   value: currency(totalSpent),             sub: `of ${currency(totalBudget)}`, tone: "var(--accent-1)" },
              { label: "Total saved",        value: currency(totalSaved),             sub: `of ${currency(totalSavingsGoal)} goal`, tone: "var(--accent-2)" },
              { label: "Credit utilization", value: Math.round(totalDebt / totalLimit * 100) + "%", sub: `${currency(totalDebt)} / ${currency(totalLimit)}`, tone: "var(--accent-3)" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</div>
                <div className="text-serif" style={{ fontSize: 36, color: s.tone, marginTop: 4 }}>{s.value}</div>
                <div className="fs-xs text-muted">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit cards */}
        <div className="card col-7">
          <CardHead
            title="Credit cards"
            sub={`${cards.length} cards · ${currency(totalDebt)} total`}
            right={<button className="btn btn--icon"><Icon name="plus" size={14}/></button>}
          />
          <div className="bento" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {cards.map(c => {
              const util = pct(c.balance, c.limit);
              const gradMap = {
                "var(--primary)":   "linear-gradient(135deg, var(--primary), var(--accent-1))",
                "var(--accent-3)":  "linear-gradient(135deg, var(--accent-3), var(--primary))",
                "var(--accent-1)":  "linear-gradient(135deg, var(--accent-1), var(--accent-4))",
              };
              return (
                <div key={c.id} className="cc" style={{ background: gradMap[c.color] || gradMap["var(--primary)"] }}>
                  <div className="row row--between" style={{ zIndex: 1 }}>
                    <div className="cc__brand">{c.name}</div>
                    <div style={{ width: 28, height: 18, borderRadius: 4, background: "rgba(255,255,255,0.3)" }}/>
                  </div>
                  <div style={{ zIndex: 1 }}>
                    <div className="cc__balance-label">balance</div>
                    <div className="cc__balance">{currency(c.balance)}</div>
                  </div>
                  <div className="row row--between" style={{ zIndex: 1, fontSize: 10 }}>
                    <span className="cc__num">•••• {c.last4}</span>
                    <span className="cc__num">{util}% used</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Savings goals */}
        <div className="card col-5">
          <CardHead
            title="Savings goals"
            sub={`${savings.length} buckets`}
            right={<button className="btn btn--icon"><Icon name="plus" size={14}/></button>}
          />
          <div className="col gap-md">
            {savings.map(s => (
              <div key={s.id}>
                <div className="row row--between" style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  <span className="text-mono fs-xs text-muted">{currency(s.saved)} / {currency(s.goal)}</span>
                </div>
                <Bar value={s.saved} max={s.goal} color={s.color}/>
                <div className="text-mono fs-xs text-muted mt-sm" style={{ letterSpacing: "0.06em" }}>
                  {pct(s.saved, s.goal)}% · {currency(s.goal - s.saved)} to go
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget breakdown */}
        <div className="card col-8">
          <CardHead
            title="Monthly budget"
            sub="May 2026 · 8 days remaining"
            right={
              <div className="row gap-sm">
                <Pill tone="mint" mono>{currency(totalBudget - totalSpent)} left</Pill>
                <button className="btn btn--icon"><Icon name="plus" size={14}/></button>
              </div>
            }
          />
          <div className="col gap-md">
            {liveBudget.map(b => {
              const pctSpent = pct(b.spent, b.budget);
              const over = b.spent > b.budget;
              return (
                <div key={b.id}>
                  <div className="budget-row">
                    <span className="budget-label">{b.category}</span>
                    <span className="budget-amounts">
                      <span style={{ color: over ? "var(--primary)" : "var(--ink)", fontWeight: 600 }}>{currency(b.spent)}</span>
                      <span style={{ margin: "0 4px", color: "var(--muted)" }}>/</span>
                      <span>{currency(b.budget)}</span>
                    </span>
                  </div>
                  <Bar value={Math.min(b.spent, b.budget)} max={b.budget} color={b.color}/>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="card col-4">
          <CardHead
            title="Recent"
            sub={`${transactions.length} transactions`}
            right={<button className="btn btn--icon" onClick={() => { setEditingTx(null); setTxOpen(true); }}><Icon name="plus" size={14}/></button>}
          />
          <div className="col gap-sm" style={{ maxHeight: 360, overflow: "auto" }}>
            {transactions.length === 0 && <div className="empty">No transactions yet</div>}
            {transactions.map(t => (
              <button
                key={t.id}
                className="row"
                style={{
                  padding: "6px 4px",
                  borderBottom: "1px dashed var(--line)",
                  background: "transparent",
                  border: 0,
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  fontFamily: "inherit",
                  color: "inherit",
                }}
                onClick={() => { setEditingTx(t); setTxOpen(true); }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--card-2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span className="habit-row__icon" style={{ background: "var(--card-2)" }}>{t.icon || "💸"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.vendor}</div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.06em" }}>{t.category} · {t.date}</div>
                </div>
                <div className="text-mono fs-sm" style={{ color: t.amount > 0 ? "var(--accent-2)" : "var(--ink)", fontWeight: 600 }}>
                  {t.amount > 0 ? "+" : "-"}{currency(Math.abs(t.amount))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {txOpen && (
        <TransactionModal
          editing={editingTx}
          budget={budget}
          onSave={(tx) => {
            setState(s => ({
              ...s,
              transactions: editingTx
                ? s.transactions.map(t => t.id === editingTx.id ? { ...tx, id: editingTx.id } : t)
                : [{ ...tx, id: "tx" + Date.now() }, ...s.transactions],
            }));
            setTxOpen(false);
            setEditingTx(null);
          }}
          onDelete={editingTx ? () => {
            setState(s => ({ ...s, transactions: s.transactions.filter(t => t.id !== editingTx.id) }));
            setTxOpen(false);
            setEditingTx(null);
          } : null}
          onClose={() => { setTxOpen(false); setEditingTx(null); }}
        />
      )}
    </>
  );
};

window.FinanceView = FinanceView;

// ----------------- Transaction modal -----------------
const TransactionModal = ({ editing, budget, onSave, onDelete, onClose }) => {
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const [form, setForm] = useState(editing || {
    vendor: "",
    amount: "",
    category: budget[0]?.category || "Groceries",
    icon: "💸",
    date: today,
    type: "expense",
  });
  // Normalize: when amount typed positive, mode (expense/income) decides sign.
  const [type, setType] = useState(editing ? (editing.amount > 0 ? "income" : "expense") : "expense");

  const categories = ["Income", ...budget.map(b => b.category), "Other"];

  const submit = () => {
    const amtNum = parseFloat(form.amount);
    if (!form.vendor.trim() || isNaN(amtNum) || amtNum === 0) return;
    const signed = type === "expense" ? -Math.abs(amtNum) : Math.abs(amtNum);
    onSave({
      vendor: form.vendor.trim(),
      amount: signed,
      category: type === "income" ? "Income" : form.category,
      icon: form.icon || (type === "income" ? "✨" : "💸"),
      date: form.date || today,
    });
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(58,29,40,0.42)", zIndex: 60, display: "grid", placeItems: "center", padding: 24, backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div
        className="card"
        style={{ maxWidth: 500, width: "100%", padding: 0, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ height: 6, background: type === "income" ? "var(--accent-2)" : "var(--primary)" }}/>
        <div style={{ padding: 22 }}>
          <div className="row row--between" style={{ alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}>{editing ? "Edit" : "Log"} transaction</div>
              <h3 className="text-serif" style={{ fontSize: 30, margin: "4px 0 0", lineHeight: 1.1 }}>
                {type === "income" ? "Money in" : "What did you spend on?"}
              </h3>
            </div>
            <button className="btn btn--icon" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>

          {/* Expense / Income toggle */}
          <div className="row gap-sm" style={{ marginBottom: 14, background: "var(--card-2)", padding: 4, borderRadius: 12 }}>
            {[
              { id: "expense", label: "Expense", color: "var(--primary)" },
              { id: "income",  label: "Income",  color: "var(--accent-2)" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: 0,
                  background: type === t.id ? t.color : "transparent",
                  color: type === t.id ? "white" : "var(--ink-soft)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}>{t.label}</button>
            ))}
          </div>

          {/* Amount */}
          <div style={{ background: "var(--card-2)", borderRadius: 14, padding: "18px 18px 14px", marginBottom: 14, textAlign: "center" }}>
            <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Amount</div>
            <div className="row" style={{ justifyContent: "center", alignItems: "baseline", gap: 4 }}>
              <span className="text-serif" style={{ fontSize: 38, color: type === "income" ? "var(--accent-2)" : "var(--primary)" }}>
                {type === "income" ? "+" : "-"}$
              </span>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                autoFocus
                style={{
                  width: 200,
                  border: 0,
                  background: "transparent",
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 44,
                  textAlign: "left",
                  outline: "none",
                  color: "var(--ink)",
                }}/>
            </div>
          </div>

          {/* Vendor + date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 10, marginBottom: 14 }}>
            <div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Vendor</div>
              <input
                value={form.vendor}
                onChange={(e) => setForm(f => ({ ...f, vendor: e.target.value }))}
                placeholder="Whole Foods, Spotify…"
                style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", fontSize: 14, background: "var(--card)", outline: "none" }}/>
            </div>
            <div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Date</div>
              <input
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", fontSize: 13, fontFamily: "var(--font-mono)", background: "var(--card)", outline: "none" }}/>
            </div>
          </div>

          {/* Category (only when expense) */}
          {type === "expense" && (
            <>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Category</div>
              <div className="row gap-sm" style={{ flexWrap: "wrap", marginBottom: 14 }}>
                {categories.filter(c => c !== "Income").map(cat => {
                  const b = budget.find(x => x.category === cat);
                  return (
                    <button
                      key={cat}
                      className="pill pill--mono"
                      style={{
                        cursor: "pointer",
                        background: form.category === cat ? (b?.color || "var(--primary)") : "var(--card-2)",
                        color: form.category === cat ? "white" : "var(--ink-soft)",
                        border: "1px solid " + (form.category === cat ? (b?.color || "var(--primary)") : "var(--line)"),
                      }}
                      onClick={() => setForm(f => ({ ...f, category: cat }))}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Icon */}
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Icon</div>
          <div className="row gap-sm" style={{ flexWrap: "wrap", marginBottom: 18 }}>
            {TRANSACTION_ICONS.map(emo => (
              <button
                key={emo}
                onClick={() => setForm(f => ({ ...f, icon: emo }))}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: form.icon === emo ? "var(--primary-soft)" : "var(--card-2)",
                  border: form.icon === emo ? "1.5px solid var(--primary)" : "1.5px solid transparent",
                  cursor: "pointer",
                  fontSize: 16,
                  display: "grid",
                  placeItems: "center",
                  padding: 0,
                }}>{emo}</button>
            ))}
          </div>

          <div className="row row--between">
            <div>
              {onDelete && (
                <button className="btn btn--ghost" style={{ color: "var(--primary)" }} onClick={onDelete}>
                  <Icon name="trash" size={13}/> Delete
                </button>
              )}
            </div>
            <div className="row gap-sm">
              <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn--pink" onClick={submit}>
                <Icon name="check" size={14}/> {editing ? "Save" : "Log it"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.TransactionModal = TransactionModal;
