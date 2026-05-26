'use client';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '@/components/ui/Icon';
import { CardHead, Bar as ProgressBar, burstConfetti } from '@/components/ui/primitives';

const SC_GOLD = '#b8860b';
const SC_SOFT = '#faf3e0';
const SC_BORDER = '#e8d49c';

const STATUS_CFG = {
  not_started: { label: 'Not started', color: '#888' },
  in_progress:  { label: 'In progress', color: '#5b8df5' },
  on_track:     { label: 'On track',    color: '#3dba7a' },
  at_risk:      { label: 'At risk',     color: '#f5a623' },
  complete:     { label: 'Complete',    color: '#3dba7a' },
};

const INN = { fontSize:13, padding:'8px 10px', border:'1px solid var(--line)', borderRadius:8, background:'var(--card)', outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
const INS = { ...INN, width:'auto' };

function getMondayKey() {
  const d = new Date();
  const diff = (d.getDay() === 0 ? -6 : 1 - d.getDay());
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function monthStr() { return new Date().toISOString().slice(0, 7); }

function getMonthRevenue(fin) {
  const m = monthStr();
  return (fin?.revenue || []).filter(r => (r.date || '').startsWith(m)).reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
}

function getMonthExpenses(fin) {
  const m = monthStr();
  return (fin?.expenses || []).filter(e => (e.date || '').startsWith(m)).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
}

function getPhaseStats(checklist) {
  const phases = checklist?.phases || [];
  let total = 0, done = 0;
  const phaseStats = phases.map(p => {
    const t = p.items.length, d = p.items.filter(i => i.done).length;
    total += t; done += d;
    return { pct: t > 0 ? Math.round(d / t * 100) : 0, done: d, total: t };
  });
  return { total, done, pct: total > 0 ? Math.round(done / total * 100) : 0, phaseStats };
}

function getPhaseLabel(phaseStats) {
  if (!phaseStats?.length) return 'Phase: Getting Started';
  if (phaseStats[4]?.pct === 100) return 'Phase: Active';
  if (phaseStats[3]?.pct === 100) return 'Phase: Launch';
  if (phaseStats[2]?.pct === 100) return 'Phase: Brand & Presence';
  if (phaseStats[1]?.pct === 100) return 'Phase: Operations';
  if (phaseStats[0]?.pct === 100) return 'Phase: Financial Setup';
  return 'Phase: Legal Foundation';
}

function DonutRing({ pct, size = 80, color = SC_GOLD }) {
  const r = size * 0.42, c = size / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={6} />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" transform={`rotate(-90 ${c} ${c})`} style={{ transition: 'stroke-dashoffset 0.4s' }} />
      <text x={c} y={c + 5} textAnchor="middle" fontSize={size * 0.18} fontWeight={700} fill={color} fontFamily="serif">{pct}%</text>
    </svg>
  );
}

function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] || { label: status, color: '#888' };
  return <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: cfg.color + '22', color: cfg.color, fontWeight: 600, whiteSpace: 'nowrap' }}>{cfg.label}</span>;
}

function Modal({ onClose, children, maxWidth = 600 }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(58,29,40,0.42)', zIndex:60, display:'grid', placeItems:'center', padding:24, backdropFilter:'blur(4px)' }} onClick={onClose}>
      <div className="card" style={{ maxWidth, width:'100%', padding:0, overflow:'hidden', boxShadow:'var(--shadow-lg)', maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHead({ title, sub, onClose, color = SC_GOLD }) {
  return (
    <>
      <div style={{ height:5, background:color }} />
      <div style={{ padding:'18px 22px 0' }}>
        <div className="row row--between" style={{ alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <div className="text-mono fs-xs text-muted" style={{ letterSpacing:'0.14em', textTransform:'uppercase' }}>{sub}</div>
            <h3 className="text-serif" style={{ fontSize:26, margin:'4px 0 0', lineHeight:1.1 }}>{title}</h3>
          </div>
          <button className="btn btn--icon" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
      </div>
    </>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function OverviewTab({ state, setState, onOpsOpen }) {
  const { scSetupChecklist, scFinances, scClients = [], scBookingsThisWeek = 0, quarterGoals = [] } = state;
  const { total, done, pct, phaseStats } = getPhaseStats(scSetupChecklist);
  const monthRev = getMonthRevenue(scFinances);
  const goal = scFinances?.revenueGoal || 3000;
  const goalPct = Math.min(100, Math.round(monthRev / goal * 100));
  const activeClients = scClients.filter(c => c.lastVisit && (Date.now() - new Date(c.lastVisit)) / 86400000 <= 60).length;
  const linkedGoals = quarterGoals.filter(g => g.category === 'business' || (g.title || '').toLowerCase().includes('silk'));
  const mondayKey = getMondayKey();
  const weekTodos = (state.scWeeklyTodos || {})[mondayKey] || [];
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim() || weekTodos.length >= 7) return;
    setState(s => { const k = getMondayKey(); return { ...s, scWeeklyTodos: { ...s.scWeeklyTodos, [k]: [...((s.scWeeklyTodos||{})[k]||[]), { id:'td'+Date.now(), text:newTodo.trim(), done:false }] } }; });
    setNewTodo('');
  };

  return (
    <div className="col gap-md">
      <div className="card" style={{ borderLeft:`4px solid ${SC_GOLD}`, background:SC_SOFT, border:`1px solid ${SC_BORDER}` }}>
        <div className="row row--between" style={{ alignItems:'flex-start', gap:16 }}>
          <div style={{ flex:1 }}>
            <div className="text-mono fs-xs" style={{ color:SC_GOLD, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4 }}>Business Hub</div>
            <h2 className="text-serif" style={{ fontSize:28, margin:'0 0 4px' }}>The Silk Collective Studio</h2>
            <div style={{ fontSize:14, color:'var(--ink-soft)', marginBottom:4 }}>{getPhaseLabel(phaseStats)}</div>
            <div className="text-mono fs-xs text-muted">{done} of {total} setup items complete</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <DonutRing pct={pct} />
            <button className="btn btn--ghost" style={{ fontSize:11, color:SC_GOLD, border:`1px solid ${SC_GOLD}`, padding:'4px 12px' }} onClick={onOpsOpen}>Studio Ops ›</button>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[
          { label:'Active clients', value:activeClients, sub:'seen in 60 days' },
          { label:'Revenue this month', value:`$${monthRev.toFixed(0)}`, sub:`of $${goal} goal` },
          { label:'Monthly goal', value:`${goalPct}%`, sub: goalPct >= 100 ? '🎉 Hit it!' : `$${(goal-monthRev).toFixed(0)} to go` },
          { label:'Bookings this week', value:null, sub:'tap to edit' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding:16, textAlign:'center' }}>
            <div className="text-mono fs-xs text-muted" style={{ letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>{s.label}</div>
            {i === 3
              ? <input type="number" min={0} value={scBookingsThisWeek} onChange={e => setState(s2 => ({...s2, scBookingsThisWeek: parseInt(e.target.value)||0}))} style={{ width:56, textAlign:'center', fontSize:28, fontFamily:'var(--font-serif)', border:0, background:'transparent', color:SC_GOLD, outline:'none' }} />
              : <div className="text-serif" style={{ fontSize:28, color:SC_GOLD }}>{s.value}</div>
            }
            <div className="fs-xs text-muted">{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className="card">
          <CardHead title="Quarterly Goals — Silk Collective" sub={`${linkedGoals.length} goals`} />
          <div style={{ marginTop:12 }} className="col gap-sm">
            {linkedGoals.length === 0 && <div className="empty">No business goals yet. Add them in Quarterly Goals.</div>}
            {linkedGoals.map(g => {
              const days = g.targetDate ? Math.ceil((new Date(g.targetDate) - Date.now()) / 86400000) : null;
              return (
                <div key={g.id} style={{ padding:'8px 0', borderBottom:'1px dashed var(--line)' }}>
                  <div className="row row--between" style={{ gap:8, alignItems:'flex-start' }}>
                    <span style={{ fontSize:13, fontWeight:500, flex:1 }}>{g.title}</span>
                    <select value={g.status} onChange={e => setState(s => ({...s, quarterGoals: s.quarterGoals.map(x => x.id===g.id ? {...x, status:e.target.value} : x)}))}
                      style={{ fontSize:11, padding:'2px 6px', borderRadius:8, border:`1px solid ${STATUS_CFG[g.status]?.color||'#888'}`, color:STATUS_CFG[g.status]?.color||'#888', background:'var(--card)', fontFamily:'inherit', cursor:'pointer' }}>
                      {Object.entries(STATUS_CFG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  {days !== null && <div className="text-mono fs-xs text-muted" style={{ marginTop:2 }}>{days>0?`${days}d remaining`:days===0?'Due today':`${Math.abs(days)}d overdue`}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <CardHead title="This Week's Focus" sub={`${weekTodos.filter(t=>t.done).length}/${weekTodos.length} done`} />
          <div className="col gap-sm" style={{ margin:'12px 0' }}>
            {weekTodos.length === 0 && <div className="empty">Add up to 7 priorities for this week.</div>}
            {weekTodos.map(t => (
              <div key={t.id} className="row" style={{ gap:8, alignItems:'center' }}>
                <button onClick={() => setState(s => { const k=getMondayKey(); return {...s, scWeeklyTodos:{...s.scWeeklyTodos,[k]:((s.scWeeklyTodos||{})[k]||[]).map(x=>x.id===t.id?{...x,done:!x.done}:x)}}; })}
                  style={{ width:18, height:18, borderRadius:4, border:`2px solid ${t.done?SC_GOLD:'var(--line)'}`, background:t.done?SC_GOLD:'transparent', display:'grid', placeItems:'center', cursor:'pointer', flexShrink:0, padding:0 }}>
                  {t.done && <svg width="10" height="8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>}
                </button>
                <span style={{ flex:1, fontSize:13, textDecoration:t.done?'line-through':'none', color:t.done?'var(--muted)':'var(--ink)' }}>{t.text}</span>
                <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={() => setState(s => { const k=getMondayKey(); return {...s, scWeeklyTodos:{...s.scWeeklyTodos,[k]:((s.scWeeklyTodos||{})[k]||[]).filter(x=>x.id!==t.id)}}; })}><Icon name="x" size={10}/></button>
              </div>
            ))}
          </div>
          {weekTodos.length < 7 && (
            <div className="row" style={{ gap:8 }}>
              <input value={newTodo} onChange={e => setNewTodo(e.target.value)} onKeyDown={e => e.key==='Enter' && addTodo()} placeholder="Add a priority…" style={{ ...INN, flex:1, width:'auto' }} />
              <button className="btn btn--pink" style={{ padding:'0 12px' }} onClick={addTodo}><Icon name="plus" size={13}/></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SETUP ────────────────────────────────────────────────────────────────────
function SetupTab({ state, setState }) {
  const checklist = state.scSetupChecklist || { phases: [] };
  const { total, done, pct, phaseStats } = getPhaseStats(checklist);
  const [open, setOpen] = useState({ phase1: true });

  const toggle = (phaseId, itemId, e) => {
    setState(s => {
      const phases = (s.scSetupChecklist?.phases || []).map(p => {
        if (p.id !== phaseId) return p;
        return { ...p, items: p.items.map(i => (i.id===itemId && !i.locked) ? {...i, done:!i.done} : i) };
      });
      const phase = phases.find(p => p.id === phaseId);
      if (phase && phase.items.every(i => i.done)) burstConfetti(e.clientX, e.clientY);
      return { ...s, scSetupChecklist: { ...s.scSetupChecklist, phases } };
    });
  };

  return (
    <div className="col gap-md">
      <div className="card" style={{ background:SC_SOFT, border:`1px solid ${SC_BORDER}` }}>
        <div className="row" style={{ gap:12, alignItems:'center' }}>
          <div className="text-serif" style={{ fontSize:36, color:SC_GOLD }}>{done}</div>
          <div>
            <div style={{ fontWeight:600, fontSize:14 }}>of {total} items complete</div>
            <div className="text-mono fs-xs text-muted">{pct}% overall progress</div>
          </div>
        </div>
        <div style={{ marginTop:10, height:6, borderRadius:999, background:'rgba(0,0,0,0.08)' }}>
          <div style={{ height:'100%', borderRadius:999, background:SC_GOLD, width:`${pct}%`, transition:'width 0.4s' }}/>
        </div>
      </div>

      {(checklist.phases || []).map((phase, idx) => {
        const ps = phaseStats[idx] || { pct:0 };
        const prevPct = idx > 0 ? (phaseStats[idx-1]?.pct || 0) : 100;
        const locked = idx > 0 && prevPct < 80;
        const isOpen = !!open[phase.id];
        const phaseDone = phase.items.filter(i => i.done).length;
        return (
          <div key={phase.id} className="card" style={{ opacity: locked ? 0.7 : 1 }}>
            <button className="row row--between" style={{ width:'100%', background:'transparent', border:0, cursor:'pointer', padding:0, fontFamily:'inherit' }}
              onClick={() => setOpen(o => ({...o, [phase.id]: !o[phase.id]}))}>
              <div className="row" style={{ gap:10, alignItems:'center' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:ps.pct===100?SC_GOLD:'var(--card-2)', display:'grid', placeItems:'center', fontSize:12, fontWeight:700, color:ps.pct===100?'white':SC_GOLD, border:`2px solid ${ps.pct===100?SC_GOLD:'var(--line)'}`, flexShrink:0 }}>
                  {ps.pct===100 ? '✓' : idx+1}
                </div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>Phase {idx+1} — {phase.title}</div>
                  <div className="text-mono fs-xs text-muted">{phaseDone}/{phase.items.length} complete · {ps.pct}%</div>
                </div>
              </div>
              <Icon name={isOpen ? 'arrow-l' : 'arrow-r'} size={14}/>
            </button>
            <div style={{ margin:'10px 0 0', height:4, borderRadius:999, background:'var(--card-2)' }}>
              <div style={{ height:'100%', borderRadius:999, background:SC_GOLD, width:`${ps.pct}%`, transition:'width 0.4s' }}/>
            </div>
            {locked && <div className="text-mono fs-xs" style={{ color:'#f5a623', marginTop:6, fontSize:11 }}>⚠ Complete the previous phase first (recommended)</div>}
            {isOpen && (
              <div className="col" style={{ gap:8, marginTop:12 }}>
                {phase.items.map(item => (
                  <label key={item.id} style={{ display:'flex', gap:10, alignItems:'flex-start', cursor:item.locked?'default':'pointer' }}>
                    <button onClick={e => { e.preventDefault(); toggle(phase.id, item.id, e); }}
                      style={{ width:20, height:20, borderRadius:5, border:`2px solid ${item.done?SC_GOLD:'var(--line)'}`, background:item.done?SC_GOLD:'transparent', display:'grid', placeItems:'center', cursor:item.locked?'default':'pointer', flexShrink:0, marginTop:1, padding:0 }}>
                      {item.done && <svg width="10" height="8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>}
                    </button>
                    <span style={{ fontSize:13.5, lineHeight:1.5, color:item.done?'var(--muted)':'var(--ink)', textDecoration:item.done?'line-through':'none' }}>
                      {item.text}{item.locked && <span style={{ color:SC_GOLD, fontSize:11, marginLeft:6, fontFamily:'var(--font-mono)' }}>✓ pre-verified</span>}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── FINANCES ─────────────────────────────────────────────────────────────────
const EXPENSE_CATS = ['Products/Supplies','Marketing','Education','Software','Booth Rent','Insurance','Equipment','Misc'];
const SCHEDULE_C = ['Home office','Product costs','Marketing & advertising','Education & training','Mileage','Professional services','Equipment','Software subscriptions','Booth rent','Insurance premiums'];
const PAYMENT_METHODS = ['Cash','Card','Zelle','Other'];

function FinancesTab({ state, setState }) {
  const [inner, setInner] = useState('revenue');
  const fin = state.scFinances || {};
  const revenue = fin.revenue || [];
  const expenses = fin.expenses || [];
  const revenueGoal = fin.revenueGoal || 3000;
  const pricingMenu = fin.pricingMenu || [];
  const scheduleCTracked = fin.scheduleCTracked || {};

  const monthRev = getMonthRevenue(fin);
  const monthExp = getMonthExpenses(fin);
  const net = monthRev - monthExp;

  const [revForm, setRevForm] = useState({ date:todayStr(), service:'', client:'', amount:'', payment:'Card', notes:'' });
  const [expForm, setExpForm] = useState({ date:todayStr(), category:'Products/Supplies', description:'', amount:'', receipt:'' });
  const [editPm, setEditPm] = useState(null);

  const addRevenue = () => {
    if (!revForm.amount) return;
    setState(s => ({...s, scFinances:{...s.scFinances, revenue:[{id:'r'+Date.now(),...revForm}, ...(s.scFinances?.revenue||[])]}}));
    setRevForm({ date:todayStr(), service:'', client:'', amount:'', payment:'Card', notes:'' });
  };

  const addExpense = () => {
    if (!expForm.amount) return;
    setState(s => ({...s, scFinances:{...s.scFinances, expenses:[{id:'e'+Date.now(),...expForm}, ...(s.scFinances?.expenses||[])]}}));
    setExpForm({ date:todayStr(), category:'Products/Supplies', description:'', amount:'', receipt:'' });
  };

  // Last 6 months chart data
  const chartData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0,7);
      const label = d.toLocaleDateString('en-US',{month:'short'});
      const rev = revenue.filter(r=>(r.date||'').startsWith(key)).reduce((s,r)=>s+(parseFloat(r.amount)||0),0);
      const exp = expenses.filter(e=>(e.date||'').startsWith(key)).reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
      months.push({ month:label, Revenue:Math.round(rev), Expenses:Math.round(exp) });
    }
    return months;
  }, [revenue, expenses]);

  const topCat = useMemo(() => {
    const m = monthStr();
    const totals = {};
    expenses.filter(e=>(e.date||'').startsWith(m)).forEach(e => { totals[e.category]=(totals[e.category]||0)+(parseFloat(e.amount)||0); });
    return Object.entries(totals).sort((a,b)=>b[1]-a[1])[0];
  }, [expenses]);

  return (
    <div className="col gap-md">
      <div className="row" style={{ gap:8, background:'var(--card-2)', padding:4, borderRadius:12, display:'inline-flex', marginBottom:4 }}>
        {['revenue','expenses','summary'].map(t => (
          <button key={t} onClick={()=>setInner(t)} style={{ padding:'6px 16px', borderRadius:9, border:0, background:inner===t?SC_GOLD:'transparent', color:inner===t?'white':'var(--ink-soft)', fontWeight:600, fontSize:13, cursor:'pointer', textTransform:'capitalize', fontFamily:'inherit' }}>{t}</button>
        ))}
      </div>

      {inner === 'revenue' && (
        <div className="col gap-md">
          <div className="card" style={{ background:SC_SOFT, border:`1px solid ${SC_BORDER}` }}>
            <div className="row" style={{ gap:16, alignItems:'center' }}>
              <div className="text-serif" style={{ fontSize:36, color:SC_GOLD }}>${monthRev.toFixed(0)}</div>
              <div>
                <div style={{ fontWeight:600 }}>Revenue this month</div>
                <div style={{ height:6, borderRadius:999, background:'rgba(0,0,0,0.08)', width:180, marginTop:4 }}>
                  <div style={{ height:'100%', borderRadius:999, background:SC_GOLD, width:`${Math.min(100,monthRev/revenueGoal*100)}%` }}/>
                </div>
                <div className="text-mono fs-xs text-muted">{Math.round(Math.min(100,monthRev/revenueGoal*100))}% of ${revenueGoal} goal</div>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <div className="text-mono fs-xs text-muted">Monthly goal</div>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginTop:4 }}>
                  <span style={{ fontSize:13 }}>$</span>
                  <input type="number" value={revenueGoal} onChange={e => setState(s=>({...s,scFinances:{...s.scFinances,revenueGoal:parseFloat(e.target.value)||0}}))} style={{ width:80, ...INN, padding:'4px 8px' }}/>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <CardHead title="Log Revenue" sub="add a service" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:12 }}>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Date</div><input type="date" value={revForm.date} onChange={e=>setRevForm(f=>({...f,date:e.target.value}))} style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Service</div>
                <select value={revForm.service} onChange={e=>setRevForm(f=>({...f,service:e.target.value}))} style={INN}>
                  <option value="">Select…</option>
                  {pricingMenu.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Client (optional)</div><input value={revForm.client} onChange={e=>setRevForm(f=>({...f,client:e.target.value}))} placeholder="Client name" style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Amount ($)</div><input type="number" value={revForm.amount} onChange={e=>setRevForm(f=>({...f,amount:e.target.value}))} placeholder="0.00" style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Payment</div>
                <select value={revForm.payment} onChange={e=>setRevForm(f=>({...f,payment:e.target.value}))} style={INN}>
                  {PAYMENT_METHODS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Notes</div><input value={revForm.notes} onChange={e=>setRevForm(f=>({...f,notes:e.target.value}))} placeholder="Optional" style={INN}/></div>
            </div>
            <button className="btn btn--pink" style={{ marginTop:12 }} onClick={addRevenue}><Icon name="plus" size={13}/> Add entry</button>
          </div>
          <div className="card">
            <CardHead title="Revenue Log" sub={`${revenue.length} entries`}/>
            <div className="col gap-sm" style={{ marginTop:12, maxHeight:300, overflowY:'auto' }}>
              {revenue.length === 0 && <div className="empty">No revenue logged yet. Add your first service above.</div>}
              {revenue.map(r => (
                <div key={r.id} className="row row--between" style={{ padding:'8px 0', borderBottom:'1px dashed var(--line)' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{r.service || 'Service'} {r.client && <span style={{ color:'var(--muted)', fontWeight:400 }}>· {r.client}</span>}</div>
                    <div className="text-mono fs-xs text-muted">{r.date} · {r.payment}</div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <span style={{ fontWeight:700, color:SC_GOLD, fontSize:14 }}>${parseFloat(r.amount).toFixed(2)}</span>
                    <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={() => setState(s=>({...s,scFinances:{...s.scFinances,revenue:(s.scFinances?.revenue||[]).filter(x=>x.id!==r.id)}}))}><Icon name="x" size={10}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {inner === 'expenses' && (
        <div className="col gap-md">
          <div className="card" style={{ background:'#fff8f8', border:'1px solid #f5d5d5' }}>
            <div className="row" style={{ gap:16, alignItems:'center' }}>
              <div className="text-serif" style={{ fontSize:36, color:'var(--primary)' }}>${monthExp.toFixed(0)}</div>
              <div>
                <div style={{ fontWeight:600 }}>Expenses this month</div>
                {topCat && <div className="text-mono fs-xs text-muted">Top: {topCat[0]} (${topCat[1].toFixed(0)})</div>}
              </div>
            </div>
          </div>
          <div className="card">
            <CardHead title="Log Expense" sub="add a cost"/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:12 }}>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Date</div><input type="date" value={expForm.date} onChange={e=>setExpForm(f=>({...f,date:e.target.value}))} style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Category</div>
                <select value={expForm.category} onChange={e=>setExpForm(f=>({...f,category:e.target.value}))} style={INN}>
                  {EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Amount ($)</div><input type="number" value={expForm.amount} onChange={e=>setExpForm(f=>({...f,amount:e.target.value}))} placeholder="0.00" style={INN}/></div>
              <div style={{ gridColumn:'1/-1' }}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Description</div><input value={expForm.description} onChange={e=>setExpForm(f=>({...f,description:e.target.value}))} placeholder="What was it for?" style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Receipt note</div><input value={expForm.receipt} onChange={e=>setExpForm(f=>({...f,receipt:e.target.value}))} placeholder="e.g. emailed, in folder" style={INN}/></div>
            </div>
            <button className="btn btn--pink" style={{ marginTop:12 }} onClick={addExpense}><Icon name="plus" size={13}/> Add expense</button>
          </div>
          <div className="card">
            <CardHead title="Expense Log" sub={`${expenses.length} entries`}/>
            <div className="col gap-sm" style={{ marginTop:12, maxHeight:300, overflowY:'auto' }}>
              {expenses.length === 0 && <div className="empty">No expenses yet. Log business costs to track your Schedule C deductions.</div>}
              {expenses.map(e => (
                <div key={e.id} className="row row--between" style={{ padding:'8px 0', borderBottom:'1px dashed var(--line)' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{e.description || e.category}</div>
                    <div className="text-mono fs-xs text-muted">{e.date} · {e.category}</div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <span style={{ fontWeight:700, color:'var(--primary)', fontSize:14 }}>${parseFloat(e.amount).toFixed(2)}</span>
                    <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={() => setState(s=>({...s,scFinances:{...s.scFinances,expenses:(s.scFinances?.expenses||[]).filter(x=>x.id!==e.id)}}))}><Icon name="x" size={10}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {inner === 'summary' && (
        <div className="col gap-md">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { label:'Revenue', value:`$${monthRev.toFixed(0)}`, color:SC_GOLD },
              { label:'Expenses', value:`$${monthExp.toFixed(0)}`, color:'var(--primary)' },
              { label:'Net', value:`${net >= 0?'+':''}$${net.toFixed(0)}`, color: net >= 0 ? '#3dba7a' : 'var(--primary)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign:'center', padding:18 }}>
                <div className="text-mono fs-xs text-muted" style={{ textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>{s.label}</div>
                <div className="text-serif" style={{ fontSize:32, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <CardHead title="6-Month Revenue vs Expenses"/>
            <div style={{ height:220, marginTop:16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top:4, right:4, bottom:0, left:0 }}>
                  <XAxis dataKey="month" tick={{ fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                  <Tooltip formatter={v=>`$${v}`}/>
                  <Bar dataKey="Revenue" fill={SC_GOLD} radius={[4,4,0,0]}/>
                  <Bar dataKey="Expenses" fill="#e8527a" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <CardHead title="Schedule C Prep" sub="track your deductible categories"/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
              {SCHEDULE_C.map(cat => (
                <label key={cat} style={{ display:'flex', gap:8, alignItems:'center', cursor:'pointer', fontSize:13 }}>
                  <button onClick={() => setState(s=>({...s,scFinances:{...s.scFinances,scheduleCTracked:{...(s.scFinances?.scheduleCTracked||{}),[cat]:!(s.scFinances?.scheduleCTracked||{})[cat]}}}))}
                    style={{ width:18, height:18, borderRadius:4, border:`2px solid ${scheduleCTracked[cat]?SC_GOLD:'var(--line)'}`, background:scheduleCTracked[cat]?SC_GOLD:'transparent', display:'grid', placeItems:'center', flexShrink:0, cursor:'pointer', padding:0 }}>
                    {scheduleCTracked[cat] && <svg width="10" height="8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>}
                  </button>
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <CardHead title="Service Pricing Sheet" sub="edit anytime" right={
              <button className="btn btn--pink" style={{ fontSize:11 }} onClick={() => setState(s=>({...s,scFinances:{...s.scFinances,pricingMenu:[...(s.scFinances?.pricingMenu||[]),{id:'pm'+Date.now(),name:'',duration:'',priceMin:0,priceMax:0,notes:''}]}}))}>
                <Icon name="plus" size={12}/> Add
              </button>
            }/>
            <table style={{ width:'100%', marginTop:12, borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr>{['Service','Duration','Price Range','Notes',''].map(h=><th key={h} style={{ textAlign:'left', padding:'4px 8px', fontSize:11, color:'var(--muted)', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</th>)}</tr></thead>
              <tbody>
                {pricingMenu.map(p => (
                  <tr key={p.id} style={{ borderTop:'1px dashed var(--line)' }}>
                    <td style={{ padding:'6px 8px' }}><input value={p.name} onChange={e=>setState(s=>({...s,scFinances:{...s.scFinances,pricingMenu:s.scFinances.pricingMenu.map(x=>x.id===p.id?{...x,name:e.target.value}:x)}}))} style={{ ...INN, padding:'3px 6px' }}/></td>
                    <td style={{ padding:'6px 8px' }}><input value={p.duration} onChange={e=>setState(s=>({...s,scFinances:{...s.scFinances,pricingMenu:s.scFinances.pricingMenu.map(x=>x.id===p.id?{...x,duration:e.target.value}:x)}}))} style={{ ...INN, padding:'3px 6px', width:90 }}/></td>
                    <td style={{ padding:'6px 8px' }}>
                      <div className="row" style={{ gap:4 }}>
                        <span>$</span><input type="number" value={p.priceMin} onChange={e=>setState(s=>({...s,scFinances:{...s.scFinances,pricingMenu:s.scFinances.pricingMenu.map(x=>x.id===p.id?{...x,priceMin:parseFloat(e.target.value)||0}:x)}}))} style={{ ...INN, padding:'3px 6px', width:55 }}/>
                        <span>–</span><span>$</span><input type="number" value={p.priceMax} onChange={e=>setState(s=>({...s,scFinances:{...s.scFinances,pricingMenu:s.scFinances.pricingMenu.map(x=>x.id===p.id?{...x,priceMax:parseFloat(e.target.value)||0}:x)}}))} style={{ ...INN, padding:'3px 6px', width:55 }}/>
                      </div>
                    </td>
                    <td style={{ padding:'6px 8px' }}><input value={p.notes} onChange={e=>setState(s=>({...s,scFinances:{...s.scFinances,pricingMenu:s.scFinances.pricingMenu.map(x=>x.id===p.id?{...x,notes:e.target.value}:x)}}))} placeholder="Notes" style={{ ...INN, padding:'3px 6px' }}/></td>
                    <td style={{ padding:'6px 8px' }}><button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>setState(s=>({...s,scFinances:{...s.scFinances,pricingMenu:s.scFinances.pricingMenu.filter(x=>x.id!==p.id)}}))}><Icon name="x" size={10}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
const BLANK_CLIENT = { name:'', phone:'', email:'', hairType:'', sensitivities:'', preferredServices:'', lastVisit:'', nextAppt:'', referredBy:'', serviceHistory:[], notes:'' };

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || BLANK_CLIENT);
  const [newService, setNewService] = useState({ date:todayStr(), service:'', price:'', notes:'' });
  const f = (k, v) => setForm(x => ({...x, [k]:v}));
  return (
    <Modal onClose={onClose} maxWidth={640}>
      <ModalHead title={form.name || 'New Client'} sub="client profile" onClose={onClose}/>
      <div style={{ padding:'0 22px 22px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {[['name','Name'],['phone','Phone'],['email','Email'],['referredBy','Referred by']].map(([k,l])=>(
            <div key={k}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>{l}</div><input value={form[k]} onChange={e=>f(k,e.target.value)} style={INN}/></div>
          ))}
        </div>
        {[['hairType','Hair type & texture'],['sensitivities','Product sensitivities / allergies'],['preferredServices','Preferred services'],['notes','Notes']].map(([k,l])=>(
          <div key={k} style={{ marginBottom:10 }}>
            <div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>{l}</div>
            <textarea value={form[k]} onChange={e=>f(k,e.target.value)} rows={2} style={{ ...INN, resize:'vertical' }}/>
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {[['lastVisit','Last visit'],['nextAppt','Next appointment']].map(([k,l])=>(
            <div key={k}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>{l}</div><input type="date" value={form[k]} onChange={e=>f(k,e.target.value)} style={INN}/></div>
          ))}
        </div>
        <div className="text-mono fs-xs text-muted" style={{ marginBottom:8 }}>Service History</div>
        <div className="col gap-sm" style={{ marginBottom:10 }}>
          {(form.serviceHistory||[]).map((sv,i)=>(
            <div key={i} style={{ background:'var(--card-2)', borderRadius:8, padding:'8px 10px', fontSize:12 }}>
              <div className="row row--between"><span style={{ fontWeight:600 }}>{sv.service} — ${sv.price}</span><span className="text-muted">{sv.date}</span></div>
              {sv.notes && <div style={{ color:'var(--ink-soft)', marginTop:2 }}>{sv.notes}</div>}
            </div>
          ))}
        </div>
        <div style={{ background:'var(--card-2)', borderRadius:10, padding:12, marginBottom:14 }}>
          <div className="text-mono fs-xs text-muted" style={{ marginBottom:8 }}>Add visit</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:8 }}>
            <input type="date" value={newService.date} onChange={e=>setNewService(x=>({...x,date:e.target.value}))} style={INN}/>
            <input value={newService.service} onChange={e=>setNewService(x=>({...x,service:e.target.value}))} placeholder="Service" style={INN}/>
            <input type="number" value={newService.price} onChange={e=>setNewService(x=>({...x,price:e.target.value}))} placeholder="Price" style={INN}/>
          </div>
          <input value={newService.notes} onChange={e=>setNewService(x=>({...x,notes:e.target.value}))} placeholder="Notes" style={{ ...INN, marginBottom:8 }}/>
          <button className="btn btn--ghost" onClick={()=>{ if(!newService.service) return; setForm(x=>({...x,serviceHistory:[...(x.serviceHistory||[]),{...newService}]})); setNewService({date:todayStr(),service:'',price:'',notes:''}); }}>+ Add visit</button>
        </div>
        <div className="row row--between">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--pink" onClick={()=>onSave(form)}><Icon name="check" size={14}/> Save client</button>
        </div>
      </div>
    </Modal>
  );
}

function ClientsTab({ state, setState }) {
  const [inner, setInner] = useState('list');
  const clients = state.scClients || [];
  const reviews = state.scReviews || [];
  const [search, setSearch] = useState('');
  const [modalClient, setModalClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [revForm, setRevForm] = useState({ platform:'Google', date:todayStr(), stars:5, quote:'', client:'' });

  const today60 = Date.now() - 60*86400000;
  const today90 = Date.now() - 90*86400000;
  const active = clients.filter(c => c.lastVisit && new Date(c.lastVisit) > today60);
  const followUp = clients.filter(c => c.lastVisit && new Date(c.lastVisit) <= today60 && new Date(c.lastVisit) > today90);
  const lapsed = clients.filter(c => c.lastVisit && new Date(c.lastVisit) <= today90);
  const noVisit = clients.filter(c => !c.lastVisit);
  const avgRating = reviews.length ? (reviews.reduce((s,r)=>s+(r.stars||0),0)/reviews.length).toFixed(1) : null;

  const saveClient = (form) => {
    setState(s => {
      const existing = s.scClients||[];
      const updated = modalClient?.id ? existing.map(c=>c.id===modalClient.id?{...form,id:modalClient.id}:c) : [{...form,id:'cl'+Date.now()},...existing];
      return {...s, scClients: updated};
    });
    setModalOpen(false); setModalClient(null);
  };

  const filtered = clients.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="col gap-md">
      <div className="row" style={{ gap:8, background:'var(--card-2)', padding:4, borderRadius:12, display:'inline-flex' }}>
        {['list','retention','reviews'].map(t=>(
          <button key={t} onClick={()=>setInner(t)} style={{ padding:'6px 16px', borderRadius:9, border:0, background:inner===t?SC_GOLD:'transparent', color:inner===t?'white':'var(--ink-soft)', fontWeight:600, fontSize:13, cursor:'pointer', textTransform:'capitalize', fontFamily:'inherit' }}>{t}</button>
        ))}
      </div>

      {inner === 'list' && (
        <div className="col gap-md">
          <div className="row row--between">
            <div className="row" style={{ gap:8, flex:1 }}>
              <div style={{ position:'relative', flex:1, maxWidth:300 }}>
                <Icon name="search" size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients…" style={{ ...INN, paddingLeft:32 }}/>
              </div>
            </div>
            <button className="btn btn--pink" onClick={()=>{ setModalClient(null); setModalOpen(true); }}><Icon name="plus" size={13}/> New client</button>
          </div>
          {filtered.length === 0 && <div className="empty" style={{ padding:32 }}>Your first client profile will live here. Add them before or after their appointment.</div>}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:14 }}>
            {filtered.map(c => {
              const daysSince = c.lastVisit ? Math.floor((Date.now()-new Date(c.lastVisit))/86400000) : null;
              const flag = daysSince >= 90 ? 'lapsed' : daysSince >= 60 ? 'followup' : null;
              return (
                <div key={c.id} className="card" style={{ padding:16, cursor:'pointer', borderLeft:flag==='lapsed'?'3px solid #e8527a':flag==='followup'?'3px solid #f5a623':'3px solid transparent' }} onClick={()=>{ setModalClient(c); setModalOpen(true); }}>
                  <div className="row row--between" style={{ marginBottom:6 }}>
                    <div style={{ fontWeight:700, fontSize:15 }}>{c.name}</div>
                    {flag && <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, background:flag==='lapsed'?'#fde8e8':'#fef3cd', color:flag==='lapsed'?'#e8527a':'#b8860b', fontWeight:600 }}>{flag==='lapsed'?'Lapsed':'Follow up'}</span>}
                  </div>
                  {c.phone && <div className="text-mono fs-xs text-muted">{c.phone}</div>}
                  {c.hairType && <div style={{ fontSize:12, color:'var(--ink-soft)', marginTop:4 }}>{c.hairType}</div>}
                  {c.lastVisit && <div className="text-mono fs-xs text-muted" style={{ marginTop:4 }}>Last visit: {c.lastVisit}</div>}
                  {c.nextAppt && <div className="text-mono fs-xs" style={{ color:SC_GOLD, marginTop:2 }}>Next: {c.nextAppt}</div>}
                  <div className="text-mono fs-xs text-muted" style={{ marginTop:4 }}>{(c.serviceHistory||[]).length} visits logged</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {inner === 'retention' && (
        <div className="col gap-md">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[{label:'Active',count:active.length,color:'#3dba7a'},{label:'Due for follow-up',count:followUp.length,color:'#f5a623'},{label:'Lapsed',count:lapsed.length,color:'#e8527a'}].map(s=>(
              <div key={s.label} className="card" style={{ textAlign:'center', padding:16, borderTop:`3px solid ${s.color}` }}>
                <div className="text-serif" style={{ fontSize:32, color:s.color }}>{s.count}</div>
                <div style={{ fontSize:13, color:'var(--ink-soft)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {[...followUp,...lapsed].length === 0 && <div className="empty">No clients need follow-up right now. Keep it up!</div>}
          {[...followUp,...lapsed].map(c => {
            const isLapsed = lapsed.includes(c);
            return (
              <div key={c.id} className="card" style={{ borderLeft:`3px solid ${isLapsed?'#e8527a':'#f5a623'}` }}>
                <div className="row row--between">
                  <div>
                    <div style={{ fontWeight:600 }}>{c.name}</div>
                    <div className="text-mono fs-xs text-muted">Last visit: {c.lastVisit} · {isLapsed?'Lapsed (90+ days)':'Due for follow-up (60+ days)'}</div>
                  </div>
                  <button className="btn btn--ghost" style={{ fontSize:12 }} onClick={()=>{ const msg=`Hey ${c.name.split(' ')[0]}! It's been a while — I'd love to get you back in the chair. I have openings coming up, want me to send you some dates?`; navigator.clipboard?.writeText(msg); }}>📋 Copy reach-out</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {inner === 'reviews' && (
        <div className="col gap-md">
          <div className="row" style={{ gap:16, alignItems:'center' }}>
            {avgRating && <div className="card" style={{ padding:16, textAlign:'center', minWidth:120 }}>
              <div className="text-serif" style={{ fontSize:36, color:SC_GOLD }}>{avgRating}</div>
              <div style={{ fontSize:13 }}>avg rating</div>
              <div className="text-mono fs-xs text-muted">{reviews.length} reviews</div>
            </div>}
            <button className="btn btn--ghost" style={{ fontSize:12 }} onClick={()=>navigator.clipboard?.writeText(`Hi! I'd really appreciate it if you left me a Google review — it helps me grow my business so much! Here's the link: [your Google review link]`)}>📋 Copy review request</button>
          </div>
          <div className="card">
            <CardHead title="Log a Review" sub="add a new review"/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:12 }}>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Platform</div>
                <select value={revForm.platform} onChange={e=>setRevForm(f=>({...f,platform:e.target.value}))} style={INN}><option>Google</option><option>Instagram</option></select>
              </div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Date</div><input type="date" value={revForm.date} onChange={e=>setRevForm(f=>({...f,date:e.target.value}))} style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Stars</div>
                <select value={revForm.stars} onChange={e=>setRevForm(f=>({...f,stars:parseInt(e.target.value)}))} style={INN}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{'★'.repeat(n)}</option>)}</select>
              </div>
              <div style={{ gridColumn:'1/-1' }}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Quote snippet</div><input value={revForm.quote} onChange={e=>setRevForm(f=>({...f,quote:e.target.value}))} placeholder="What they said…" style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Client (optional)</div><input value={revForm.client} onChange={e=>setRevForm(f=>({...f,client:e.target.value}))} style={INN}/></div>
            </div>
            <button className="btn btn--pink" style={{ marginTop:12 }} onClick={()=>{ setState(s=>({...s,scReviews:[{id:'rv'+Date.now(),...revForm},...(s.scReviews||[])]})); setRevForm({platform:'Google',date:todayStr(),stars:5,quote:'',client:''}); }}><Icon name="plus" size={13}/> Add review</button>
          </div>
          <div className="col gap-sm">
            {reviews.map(r=>(
              <div key={r.id} className="card" style={{ padding:14 }}>
                <div className="row row--between">
                  <div><span style={{ color:'#f5a623' }}>{'★'.repeat(r.stars||0)}</span><span style={{ fontSize:11, color:'var(--muted)', marginLeft:6 }}>{r.platform} · {r.date}</span></div>
                  <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>setState(s=>({...s,scReviews:(s.scReviews||[]).filter(x=>x.id!==r.id)}))}><Icon name="x" size={10}/></button>
                </div>
                {r.quote && <div style={{ fontSize:13, fontStyle:'italic', color:'var(--ink-soft)', marginTop:6 }}>"{r.quote}"</div>}
                {r.client && <div className="text-mono fs-xs text-muted" style={{ marginTop:4 }}>— {r.client}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {modalOpen && <ClientModal client={modalClient} onSave={saveClient} onClose={()=>{ setModalOpen(false); setModalClient(null); }}/>}
    </div>
  );
}

// ─── MARKETING ────────────────────────────────────────────────────────────────
const CAMP_TYPES = ['EDDM','Paid Social','Organic','Email','Referral','Promotion','Event'];
const CAMP_STATUSES = ['Planning','Active','Paused','Complete'];
const IDEA_COSTS = ['free','low','medium','high'];
const IDEA_COST_COLORS = { free:'#3dba7a', low:'#5b8df5', medium:'#f5a623', high:'#e8527a' };

function MarketingTab({ state, setState }) {
  const [inner, setInner] = useState('campaigns');
  const campaigns = state.scCampaigns || [];
  const budget = state.scMarketingBudget || { monthly:500, costPerClientLog:[] };
  const ideas = state.scIdeasBank || [];
  const finances = state.scFinances || {};
  const [campModal, setCampModal] = useState(null);
  const [campOpen, setCampOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({ title:'', type:'Organic', cost:'free', notes:'', status:'Idea' });
  const [newCpc, setNewCpc] = useState({ campaign:'', spend:'', booked:'' });

  const monthMktExp = (finances.expenses||[]).filter(e=>(e.date||'').startsWith(monthStr()) && e.category==='Marketing').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const budgetRemaining = budget.monthly - monthMktExp;

  const donutData = useMemo(()=>{
    const paid = (finances.expenses||[]).filter(e=>e.category==='Marketing' && e.description?.toLowerCase().includes('paid')).reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
    const organic = monthMktExp - paid;
    return [{ name:'Paid', value:Math.max(0,paid) },{ name:'Organic/Free', value:Math.max(0,organic) }];
  },[finances, monthMktExp]);

  const BLANK_CAMP = { name:'', type:'EDDM', status:'Planning', startDate:'', endDate:'', goal:'', estimatedCost:0, actualCost:0, notes:'', linkedGoal:'' };

  const saveCampaign = (form) => {
    setState(s=>{ const existing=s.scCampaigns||[]; const updated=form.id?existing.map(c=>c.id===form.id?form:c):[{...form,id:'camp'+Date.now()},...existing]; return {...s,scCampaigns:updated}; });
    setCampOpen(false); setCampModal(null);
  };

  return (
    <div className="col gap-md">
      <div className="row" style={{ gap:8, background:'var(--card-2)', padding:4, borderRadius:12, display:'inline-flex' }}>
        {['campaigns','budget','ideas'].map(t=>(
          <button key={t} onClick={()=>setInner(t)} style={{ padding:'6px 16px', borderRadius:9, border:0, background:inner===t?SC_GOLD:'transparent', color:inner===t?'white':'var(--ink-soft)', fontWeight:600, fontSize:13, cursor:'pointer', textTransform:'capitalize', fontFamily:'inherit' }}>{t}</button>
        ))}
      </div>

      {inner === 'campaigns' && (
        <div className="col gap-md">
          <div className="row row--between">
            <div/>
            <button className="btn btn--pink" onClick={()=>{ setCampModal(BLANK_CAMP); setCampOpen(true); }}><Icon name="plus" size={13}/> New campaign</button>
          </div>
          {CAMP_STATUSES.map(status => {
            const group = campaigns.filter(c=>c.status===status);
            if (group.length === 0) return null;
            return (
              <div key={status}>
                <div className="text-mono fs-xs" style={{ textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--muted)', marginBottom:8, fontWeight:700 }}>{status}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                  {group.map(c=>(
                    <div key={c.id} className="card" style={{ padding:16, cursor:'pointer' }} onClick={()=>{ setCampModal(c); setCampOpen(true); }}>
                      <div className="row row--between" style={{ marginBottom:6 }}>
                        <div style={{ fontWeight:700, fontSize:14 }}>{c.name}</div>
                        <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background:'var(--card-2)', color:'var(--ink-soft)' }}>{c.type}</span>
                      </div>
                      {c.goal && <div style={{ fontSize:12, color:'var(--ink-soft)', marginBottom:4 }}>{c.goal}</div>}
                      <div className="text-mono fs-xs text-muted">{c.startDate}{c.endDate?` → ${c.endDate}`:''}</div>
                      {(c.estimatedCost>0||c.actualCost>0) && <div className="text-mono fs-xs text-muted" style={{ marginTop:4 }}>Est: ${c.estimatedCost} · Actual: ${c.actualCost}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {campaigns.length === 0 && <div className="empty" style={{ padding:32 }}>No campaigns yet. Your EDDM and launch campaigns will live here.</div>}
        </div>
      )}

      {inner === 'budget' && (
        <div className="col gap-md">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {[{ label:'Monthly budget', value:`$${budget.monthly}` },{ label:'Spent this month', value:`$${monthMktExp.toFixed(0)}` },{ label:'Remaining', value:`$${budgetRemaining.toFixed(0)}`, color:budgetRemaining<0?'#e8527a':SC_GOLD }].map(s=>(
              <div key={s.label} className="card" style={{ textAlign:'center', padding:16 }}>
                <div className="text-mono fs-xs text-muted" style={{ textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>{s.label}</div>
                <div className="text-serif" style={{ fontSize:28, color:s.color||SC_GOLD }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="row" style={{ gap:8, alignItems:'center' }}>
            <span style={{ fontSize:13 }}>Monthly budget: $</span>
            <input type="number" value={budget.monthly} onChange={e=>setState(s=>({...s,scMarketingBudget:{...s.scMarketingBudget,monthly:parseFloat(e.target.value)||0}}))} style={{ ...INN, width:100 }}/>
          </div>
          {monthMktExp > 0 && (
            <div className="card">
              <CardHead title="Paid vs Organic"/>
              <div style={{ height:200, marginTop:12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                    <Cell fill={SC_GOLD}/><Cell fill="#88b896"/>
                  </Pie><Tooltip formatter={v=>`$${v.toFixed(0)}`}/></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <div className="card">
            <CardHead title="Cost Per Client Tracker"/>
            <div className="col gap-sm" style={{ margin:'12px 0' }}>
              {(budget.costPerClientLog||[]).map((e,i)=>(
                <div key={i} className="row row--between" style={{ fontSize:13, padding:'6px 0', borderBottom:'1px dashed var(--line)' }}>
                  <span>{e.campaign}</span>
                  <span className="text-mono" style={{ color:'var(--muted)' }}>${e.spend} / {e.booked} clients = <strong style={{ color:SC_GOLD }}>${e.booked>0?(e.spend/e.booked).toFixed(2):'—'}/client</strong></span>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:8 }}>
              <input value={newCpc.campaign} onChange={e=>setNewCpc(x=>({...x,campaign:e.target.value}))} placeholder="Campaign name" style={INN}/>
              <input type="number" value={newCpc.spend} onChange={e=>setNewCpc(x=>({...x,spend:e.target.value}))} placeholder="$ spent" style={INN}/>
              <input type="number" value={newCpc.booked} onChange={e=>setNewCpc(x=>({...x,booked:e.target.value}))} placeholder="Clients booked" style={INN}/>
              <button className="btn btn--pink" onClick={()=>{ if(!newCpc.campaign) return; setState(s=>({...s,scMarketingBudget:{...s.scMarketingBudget,costPerClientLog:[...(s.scMarketingBudget?.costPerClientLog||[]),{...newCpc,spend:parseFloat(newCpc.spend)||0,booked:parseInt(newCpc.booked)||0}]}})); setNewCpc({campaign:'',spend:'',booked:''}); }}><Icon name="plus" size={13}/></button>
            </div>
          </div>
        </div>
      )}

      {inner === 'ideas' && (
        <div className="col gap-md">
          <div className="card">
            <CardHead title="Add Idea"/>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:10, marginTop:12, marginBottom:10 }}>
              <input value={newIdea.title} onChange={e=>setNewIdea(x=>({...x,title:e.target.value}))} placeholder="Idea title" style={INN}/>
              <select value={newIdea.type} onChange={e=>setNewIdea(x=>({...x,type:e.target.value}))} style={INN}>{CAMP_TYPES.map(t=><option key={t}>{t}</option>)}</select>
              <select value={newIdea.cost} onChange={e=>setNewIdea(x=>({...x,cost:e.target.value}))} style={INN}>{IDEA_COSTS.map(c=><option key={c}>{c}</option>)}</select>
            </div>
            <input value={newIdea.notes} onChange={e=>setNewIdea(x=>({...x,notes:e.target.value}))} placeholder="Notes…" style={{ ...INN, marginBottom:10 }}/>
            <button className="btn btn--pink" onClick={()=>{ if(!newIdea.title) return; setState(s=>({...s,scIdeasBank:[{id:'idea'+Date.now(),...newIdea},...(s.scIdeasBank||[])]})); setNewIdea({title:'',type:'Organic',cost:'free',notes:'',status:'Idea'}); }}><Icon name="plus" size={13}/> Add idea</button>
          </div>
          {ideas.map(idea=>(
            <div key={idea.id} className="card" style={{ padding:14, borderLeft:`3px solid ${IDEA_COST_COLORS[idea.cost]||'#888'}` }}>
              <div className="row row--between">
                <div style={{ flex:1 }}>
                  <div className="row" style={{ gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:600, fontSize:14 }}>{idea.title}</span>
                    <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background:(IDEA_COST_COLORS[idea.cost]||'#888')+'22', color:IDEA_COST_COLORS[idea.cost]||'#888', fontWeight:600 }}>{idea.cost}</span>
                    <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background:'var(--card-2)', color:'var(--ink-soft)' }}>{idea.type}</span>
                  </div>
                  {idea.notes && <div style={{ fontSize:12, color:'var(--ink-soft)' }}>{idea.notes}</div>}
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginLeft:12 }}>
                  <button style={{ fontSize:11, padding:'3px 10px', borderRadius:8, border:`1px solid ${idea.status==='Moved to Campaign'?SC_GOLD:'var(--line)'}`, background:idea.status==='Moved to Campaign'?SC_SOFT:'transparent', color:idea.status==='Moved to Campaign'?SC_GOLD:'var(--ink-soft)', cursor:'pointer', fontFamily:'inherit' }}
                    onClick={()=>setState(s=>({...s,scIdeasBank:(s.scIdeasBank||[]).map(x=>x.id===idea.id?{...x,status:x.status==='Idea'?'Moved to Campaign':'Idea'}:x)}))}>
                    {idea.status==='Moved to Campaign'?'✓ In campaign':'Move to campaign'}
                  </button>
                  <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>setState(s=>({...s,scIdeasBank:(s.scIdeasBank||[]).filter(x=>x.id!==idea.id)}))}><Icon name="x" size={10}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {campOpen && campModal && (
        <Modal onClose={()=>{ setCampOpen(false); setCampModal(null); }}>
          <ModalHead title={campModal.name||'New Campaign'} sub="campaign details" onClose={()=>{ setCampOpen(false); setCampModal(null); }}/>
          <div style={{ padding:'0 22px 22px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
              <div style={{ gridColumn:'1/-1' }}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Campaign name</div><input value={campModal.name} onChange={e=>setCampModal(x=>({...x,name:e.target.value}))} style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Type</div><select value={campModal.type} onChange={e=>setCampModal(x=>({...x,type:e.target.value}))} style={INN}>{CAMP_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Status</div><select value={campModal.status} onChange={e=>setCampModal(x=>({...x,status:e.target.value}))} style={INN}>{CAMP_STATUSES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Start date</div><input type="date" value={campModal.startDate} onChange={e=>setCampModal(x=>({...x,startDate:e.target.value}))} style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>End date</div><input type="date" value={campModal.endDate} onChange={e=>setCampModal(x=>({...x,endDate:e.target.value}))} style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Est. cost ($)</div><input type="number" value={campModal.estimatedCost} onChange={e=>setCampModal(x=>({...x,estimatedCost:parseFloat(e.target.value)||0}))} style={INN}/></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Actual cost ($)</div><input type="number" value={campModal.actualCost} onChange={e=>setCampModal(x=>({...x,actualCost:parseFloat(e.target.value)||0}))} style={INN}/></div>
              <div style={{ gridColumn:'1/-1' }}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Goal</div><input value={campModal.goal} onChange={e=>setCampModal(x=>({...x,goal:e.target.value}))} placeholder="e.g. Book 10 new clients" style={INN}/></div>
              <div style={{ gridColumn:'1/-1' }}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Notes / results</div><textarea value={campModal.notes} onChange={e=>setCampModal(x=>({...x,notes:e.target.value}))} rows={3} style={{ ...INN, resize:'vertical' }}/></div>
            </div>
            <div className="row row--between" style={{ marginTop:8 }}>
              {campModal.id && <button className="btn btn--ghost" style={{ color:'var(--primary)' }} onClick={()=>{ setState(s=>({...s,scCampaigns:(s.scCampaigns||[]).filter(c=>c.id!==campModal.id)})); setCampOpen(false); setCampModal(null); }}><Icon name="trash" size={13}/> Delete</button>}
              <div className="row gap-sm" style={{ marginLeft:'auto' }}>
                <button className="btn btn--ghost" onClick={()=>{ setCampOpen(false); setCampModal(null); }}>Cancel</button>
                <button className="btn btn--pink" onClick={()=>saveCampaign(campModal)}><Icon name="check" size={14}/> Save</button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


// ─── CONTENT ──────────────────────────────────────────────────────────────────
const CONTENT_TYPES = ['Transformation','Educational','Promo','Behind the Scenes','Client Result','Personal Brand'];
const PLATFORMS = ['IG','TikTok','Both'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const PRIORITIES = ['high','medium','low'];
const PRIORITY_COLORS = { high:'#e8527a', medium:'#f5a623', low:'#3dba7a' };

function ContentTab({ state, setState }) {
  const [inner, setInner] = useState('calendar');
  const calendar = state.scContentCalendar || [];
  const ideas = state.scContentIdeas || [];
  const hashtagSets = state.scHashtagSets || [];
  const platformStats = state.scPlatformStats || {};
  const brandRef = state.scBrandRef || {};
  const [editingBrand, setEditingBrand] = useState(false);
  const [brandEdit, setBrandEdit] = useState(null);
  const [newPost, setNewPost] = useState({ day:'Mon', platform:'IG', type:'Transformation', caption:'', posted:false });
  const [newIdea, setNewIdea] = useState({ title:'', platform:'IG', type:'Transformation', priority:'medium', status:'Idea' });
  const [newSet, setNewSet] = useState({ name:'', platform:'Instagram', tags:'' });

  const currentWeek = useMemo(() => {
    const monday = new Date(); monday.setDate(monday.getDate() - (monday.getDay()===0?6:monday.getDay()-1));
    return monday.toISOString().slice(0,10);
  },[]);

  const weekPosts = calendar.filter(p => p.week === currentWeek);

  const addPost = () => {
    setState(s=>({...s, scContentCalendar:[{id:'cp'+Date.now(),...newPost, week:currentWeek}, ...(s.scContentCalendar||[])]}));
    setNewPost({ day:'Mon', platform:'IG', type:'Transformation', caption:'', posted:false });
  };

  const logFollowers = () => {
    const snap = { date:todayStr(), ig:platformStats.igFollowers||0, tiktok:platformStats.tiktokFollowers||0 };
    setState(s=>({...s, scPlatformStats:{...s.scPlatformStats, igTrend:[...(s.scPlatformStats?.igTrend||[]).slice(-7),snap], tiktokTrend:[...(s.scPlatformStats?.tiktokTrend||[]).slice(-7),snap]}}));
  };

  const igTrend = (platformStats.igTrend||[]).map(x=>({date:x.date, followers:x.ig}));
  const tiktokTrend = (platformStats.tiktokTrend||[]).map(x=>({date:x.date, followers:x.tiktok}));

  return (
    <div className="col gap-md">
      <div className="row" style={{ gap:8, background:'var(--card-2)', padding:4, borderRadius:12, display:'inline-flex', flexWrap:'wrap' }}>
        {['calendar','stats','brand','ideas'].map(t=>(
          <button key={t} onClick={()=>setInner(t)} style={{ padding:'6px 16px', borderRadius:9, border:0, background:inner===t?SC_GOLD:'transparent', color:inner===t?'white':'var(--ink-soft)', fontWeight:600, fontSize:13, cursor:'pointer', textTransform:'capitalize', fontFamily:'inherit' }}>{t}</button>
        ))}
      </div>

      {inner === 'calendar' && (
        <div className="col gap-md">
          <div className="card">
            <CardHead title="Add Post" sub="this week"/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 2fr auto', gap:10, marginTop:12, alignItems:'end' }}>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Day</div><select value={newPost.day} onChange={e=>setNewPost(x=>({...x,day:e.target.value}))} style={INN}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Platform</div><select value={newPost.platform} onChange={e=>setNewPost(x=>({...x,platform:e.target.value}))} style={INN}>{PLATFORMS.map(p=><option key={p}>{p}</option>)}</select></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Type</div><select value={newPost.type} onChange={e=>setNewPost(x=>({...x,type:e.target.value}))} style={INN}>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Caption snippet</div><input value={newPost.caption} onChange={e=>setNewPost(x=>({...x,caption:e.target.value}))} placeholder="What's the caption?" style={INN}/></div>
              <button className="btn btn--pink" onClick={addPost} style={{ padding:'8px 14px' }}><Icon name="plus" size={13}/></button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8 }}>
            {DAYS.map(day=>{
              const posts = weekPosts.filter(p=>p.day===day);
              return (
                <div key={day} style={{ minHeight:120 }}>
                  <div className="text-mono fs-xs" style={{ textAlign:'center', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--muted)', marginBottom:6 }}>{day}</div>
                  <div className="col gap-sm">
                    {posts.length===0 && <div style={{ border:'1.5px dashed var(--line)', borderRadius:10, padding:'14px 8px', textAlign:'center', fontSize:11, color:'var(--muted)' }}>free</div>}
                    {posts.map(p=>(
                      <div key={p.id} style={{ background:'var(--card)', border:`2px solid ${p.posted?SC_GOLD:'var(--line)'}`, borderRadius:10, padding:8, fontSize:11 }}>
                        <div style={{ fontWeight:600, color:SC_GOLD, marginBottom:3 }}>{p.platform}</div>
                        <div style={{ color:'var(--ink-soft)', marginBottom:4 }}>{p.type}</div>
                        {p.caption && <div style={{ color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.caption}</div>}
                        <div className="row row--between" style={{ marginTop:6 }}>
                          <button style={{ fontSize:10, padding:'2px 6px', borderRadius:6, border:`1px solid ${p.posted?SC_GOLD:'var(--line)'}`, background:p.posted?SC_SOFT:'transparent', color:p.posted?SC_GOLD:'var(--muted)', cursor:'pointer', fontFamily:'inherit' }}
                            onClick={()=>setState(s=>({...s,scContentCalendar:(s.scContentCalendar||[]).map(x=>x.id===p.id?{...x,posted:!x.posted}:x)}))}>
                            {p.posted?'✓ Posted':'Post'}
                          </button>
                          <button style={{ background:'transparent', border:0, cursor:'pointer', color:'var(--muted)', fontSize:12, padding:0 }} onClick={()=>setState(s=>({...s,scContentCalendar:(s.scContentCalendar||[]).filter(x=>x.id!==p.id)}))}>&times;</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {inner === 'stats' && (
        <div className="col gap-md">
          <div className="card">
            <CardHead title="Platform Snapshot" right={<button className="btn btn--ghost" style={{ fontSize:12 }} onClick={logFollowers}>📊 Log this week</button>}/>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:12 }}>
              {[['igFollowers','IG Followers'],['tiktokFollowers','TikTok Followers'],['weeklyPostCount','Posts this week']].map(([k,l])=>(
                <div key={k}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>{l}</div>
                  <input type="number" value={platformStats[k]||0} onChange={e=>setState(s=>({...s,scPlatformStats:{...s.scPlatformStats,[k]:parseInt(e.target.value)||0}}))} style={INN}/></div>
              ))}
              {[['igLastPost','IG last post'],['tiktokLastPost','TikTok last post']].map(([k,l])=>(
                <div key={k}><div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>{l}</div>
                  <input type="date" value={platformStats[k]||''} onChange={e=>setState(s=>({...s,scPlatformStats:{...s.scPlatformStats,[k]:e.target.value}}))} style={INN}/></div>
              ))}
            </div>
          </div>
          {igTrend.length > 1 && (
            <div className="card"><CardHead title="IG Follower Trend"/>
              <div style={{ height:180, marginTop:12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={igTrend}><XAxis dataKey="date" tick={{fontSize:10}} tickFormatter={d=>d.slice(5)}/><YAxis tick={{fontSize:10}}/><Tooltip/><Line type="monotone" dataKey="followers" stroke={SC_GOLD} strokeWidth={2} dot={false}/></LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {tiktokTrend.length > 1 && (
            <div className="card"><CardHead title="TikTok Follower Trend"/>
              <div style={{ height:180, marginTop:12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tiktokTrend}><XAxis dataKey="date" tick={{fontSize:10}} tickFormatter={d=>d.slice(5)}/><YAxis tick={{fontSize:10}}/><Tooltip/><Line type="monotone" dataKey="followers" stroke="#88b896" strokeWidth={2} dot={false}/></LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {inner === 'brand' && (
        <div className="col gap-md">
          <div className="card" style={{ borderLeft:`4px solid ${SC_GOLD}` }}>
            <div className="row row--between" style={{ marginBottom:12 }}>
              <CardHead title="Brand Reference" sub="The Silk Collective Studio"/>
              <button className="btn btn--ghost" onClick={()=>{ setEditingBrand(true); setBrandEdit({...brandRef}); }}>
                <Icon name="edit" size={13}/> Edit
              </button>
            </div>
            <div className="text-mono fs-xs text-muted" style={{ marginBottom:6, textTransform:'uppercase', letterSpacing:'0.1em' }}>Content Pillars</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
              {(brandRef.pillars||[]).map((p,i)=><span key={i} style={{ fontSize:12, padding:'4px 10px', borderRadius:999, background:SC_SOFT, color:SC_GOLD, border:`1px solid ${SC_BORDER}`, fontWeight:600 }}>{p}</span>)}
            </div>
            <div className="text-mono fs-xs text-muted" style={{ marginBottom:4, textTransform:'uppercase', letterSpacing:'0.1em' }}>Brand Voice</div>
            <div style={{ fontSize:13, color:'var(--ink-soft)', marginBottom:12, lineHeight:1.6 }}>{brandRef.voice}</div>
            <div className="text-mono fs-xs text-muted" style={{ marginBottom:4, textTransform:'uppercase', letterSpacing:'0.1em' }}>Target Audience</div>
            <div style={{ fontSize:13, color:'var(--ink-soft)', lineHeight:1.6 }}>{brandRef.audience}</div>
          </div>
          <div className="card">
            <CardHead title="Hashtag Sets" right={<button className="btn btn--pink" style={{ fontSize:11 }} onClick={()=>{ if(!newSet.name||!newSet.tags) return; setState(s=>({...s,scHashtagSets:[{id:'hs'+Date.now(),...newSet},...(s.scHashtagSets||[])]})); setNewSet({name:'',platform:'Instagram',tags:''}); }}><Icon name="plus" size={12}/> Add</button>}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, margin:'12px 0 12px' }}>
              <input value={newSet.name} onChange={e=>setNewSet(x=>({...x,name:e.target.value}))} placeholder="Set name" style={INN}/>
              <select value={newSet.platform} onChange={e=>setNewSet(x=>({...x,platform:e.target.value}))} style={INN}><option>Instagram</option><option>TikTok</option><option>Both</option></select>
              <span/>
              <input value={newSet.tags} onChange={e=>setNewSet(x=>({...x,tags:e.target.value}))} placeholder="#tag1 #tag2 #tag3…" style={{ ...INN, gridColumn:'1/3' }}/>
            </div>
            {hashtagSets.map(s=>(
              <div key={s.id} style={{ background:'var(--card-2)', borderRadius:10, padding:12, marginBottom:8 }}>
                <div className="row row--between" style={{ marginBottom:6 }}>
                  <div><span style={{ fontWeight:600, fontSize:13 }}>{s.name}</span><span className="text-mono fs-xs text-muted" style={{ marginLeft:8 }}>{s.platform}</span></div>
                  <div className="row" style={{ gap:8 }}>
                    <button className="btn btn--ghost" style={{ fontSize:11 }} onClick={()=>navigator.clipboard?.writeText(s.tags)}>📋 Copy</button>
                    <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>setState(s2=>({...s2,scHashtagSets:(s2.scHashtagSets||[]).filter(x=>x.id!==s.id)}))}><Icon name="x" size={10}/></button>
                  </div>
                </div>
                <div style={{ fontSize:12, color:'var(--ink-soft)', lineHeight:1.6 }}>{s.tags}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {inner === 'ideas' && (
        <div className="col gap-md">
          <div className="card">
            <CardHead title="Add Content Idea"/>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:10, marginTop:12, marginBottom:10 }}>
              <input value={newIdea.title} onChange={e=>setNewIdea(x=>({...x,title:e.target.value}))} placeholder="Idea title" style={INN}/>
              <select value={newIdea.platform} onChange={e=>setNewIdea(x=>({...x,platform:e.target.value}))} style={INN}>{PLATFORMS.map(p=><option key={p}>{p}</option>)}</select>
              <select value={newIdea.type} onChange={e=>setNewIdea(x=>({...x,type:e.target.value}))} style={INN}>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select>
              <select value={newIdea.priority} onChange={e=>setNewIdea(x=>({...x,priority:e.target.value}))} style={INN}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select>
            </div>
            <button className="btn btn--pink" onClick={()=>{ if(!newIdea.title) return; setState(s=>({...s,scContentIdeas:[{id:'ci'+Date.now(),...newIdea},...(s.scContentIdeas||[])]})); setNewIdea({title:'',platform:'IG',type:'Transformation',priority:'medium',status:'Idea'}); }}><Icon name="plus" size={13}/> Add idea</button>
          </div>
          {ideas.length === 0 && <div className="empty" style={{ padding:28 }}>Capture Silk Collective content ideas here — separate from your personal content pipeline.</div>}
          {ideas.map(idea=>(
            <div key={idea.id} className="card" style={{ padding:14, borderLeft:`3px solid ${PRIORITY_COLORS[idea.priority]||'#888'}` }}>
              <div className="row row--between">
                <div className="row" style={{ gap:8, flexWrap:'wrap', flex:1 }}>
                  <span style={{ fontWeight:600, fontSize:14 }}>{idea.title}</span>
                  <span style={{ fontSize:11, padding:'2px 7px', borderRadius:999, background:'var(--card-2)', color:'var(--ink-soft)' }}>{idea.platform}</span>
                  <span style={{ fontSize:11, padding:'2px 7px', borderRadius:999, background:'var(--card-2)', color:'var(--ink-soft)' }}>{idea.type}</span>
                  <span style={{ fontSize:11, padding:'2px 7px', borderRadius:999, background:(PRIORITY_COLORS[idea.priority]||'#888')+'22', color:PRIORITY_COLORS[idea.priority]||'#888', fontWeight:600 }}>{idea.priority}</span>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginLeft:12 }}>
                  <select value={idea.status} onChange={e=>setState(s=>({...s,scContentIdeas:(s.scContentIdeas||[]).map(x=>x.id===idea.id?{...x,status:e.target.value}:x)}))} style={{ ...INS, fontSize:11, padding:'3px 8px' }}>
                    {['Idea','In Production','Posted'].map(s=><option key={s}>{s}</option>)}
                  </select>
                  <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>setState(s=>({...s,scContentIdeas:(s.scContentIdeas||[]).filter(x=>x.id!==idea.id)}))}><Icon name="x" size={10}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingBrand && brandEdit && (
        <Modal onClose={()=>setEditingBrand(false)}>
          <ModalHead title="Edit Brand Reference" sub="brand" onClose={()=>setEditingBrand(false)}/>
          <div style={{ padding:'0 22px 22px' }}>
            <div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Content Pillars (one per line)</div>
            <textarea value={(brandEdit.pillars||[]).join('\n')} onChange={e=>setBrandEdit(x=>({...x,pillars:e.target.value.split('\n').filter(Boolean)}))} rows={6} style={{ ...INN, resize:'vertical', marginBottom:10 }}/>
            <div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Brand Voice</div>
            <textarea value={brandEdit.voice||''} onChange={e=>setBrandEdit(x=>({...x,voice:e.target.value}))} rows={3} style={{ ...INN, resize:'vertical', marginBottom:10 }}/>
            <div className="text-mono fs-xs text-muted" style={{ marginBottom:4 }}>Target Audience</div>
            <textarea value={brandEdit.audience||''} onChange={e=>setBrandEdit(x=>({...x,audience:e.target.value}))} rows={2} style={{ ...INN, resize:'vertical', marginBottom:14 }}/>
            <div className="row row--between">
              <button className="btn btn--ghost" onClick={()=>setEditingBrand(false)}>Cancel</button>
              <button className="btn btn--pink" onClick={()=>{ setState(s=>({...s,scBrandRef:brandEdit})); setEditingBrand(false); }}><Icon name="check" size={14}/> Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── EDUCATION ────────────────────────────────────────────────────────────────
function EducationTab({ state, setState }) {
  const edu = state.scEducation || {};
  const ceLog = edu.ceLog || [];
  const wishlist = edu.wishlist || [];
  const completed = edu.completed || [];
  const events = edu.events || [];
  const ceRequired = edu.ceHoursRequired || 4;
  const ceHours = ceLog.reduce((s,e)=>s+(parseFloat(e.hours)||0),0);
  const [ceForm, setCeForm] = useState({ date:todayStr(), provider:'', topic:'', hours:'', certificate:false });
  const [wlForm, setWlForm] = useState({ name:'', topic:'', provider:'', cost:'', priority:'medium', notes:'' });
  const [compForm, setCompForm] = useState({ name:'', date:todayStr(), provider:'', certificate:false, notes:'' });
  const [evForm, setEvForm] = useState({ name:'', date:'', location:'', cost:'', registered:false, notes:'' });

  const updEdu = (patch) => setState(s=>({...s, scEducation:{...s.scEducation,...patch}}));

  return (
    <div className="col gap-md">
      {/* CE Credits */}
      <div className="card">
        <div className="row row--between" style={{ marginBottom:12 }}>
          <CardHead title="CE Credits" sub="Maryland cosmetology renewal"/>
          <div className="row" style={{ gap:8, alignItems:'center' }}>
            <span style={{ fontSize:13 }}>Hours required:</span>
            <input type="number" value={ceRequired} onChange={e=>updEdu({ceHoursRequired:parseFloat(e.target.value)||0})} style={{ ...INN, width:60 }}/>
          </div>
        </div>
        <div className="row" style={{ gap:16, alignItems:'center', marginBottom:12 }}>
          <div className="text-serif" style={{ fontSize:36, color:SC_GOLD }}>{ceHours.toFixed(1)}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>of {ceRequired} hours logged</div>
            <div style={{ height:8, borderRadius:999, background:'var(--card-2)' }}>
              <div style={{ height:'100%', borderRadius:999, background:SC_GOLD, width:`${Math.min(100,ceHours/ceRequired*100)}%`, transition:'width 0.4s' }}/>
            </div>
          </div>
        </div>
        <div style={{ background:'var(--card-2)', borderRadius:10, padding:12, marginBottom:12 }}>
          <div className="text-mono fs-xs text-muted" style={{ marginBottom:8 }}>Log CE hours</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr 2fr 1fr', gap:8, marginBottom:8 }}>
            <input type="date" value={ceForm.date} onChange={e=>setCeForm(x=>({...x,date:e.target.value}))} style={INN}/>
            <input value={ceForm.provider} onChange={e=>setCeForm(x=>({...x,provider:e.target.value}))} placeholder="Provider" style={INN}/>
            <input value={ceForm.topic} onChange={e=>setCeForm(x=>({...x,topic:e.target.value}))} placeholder="Topic" style={INN}/>
            <input type="number" value={ceForm.hours} onChange={e=>setCeForm(x=>({...x,hours:e.target.value}))} placeholder="Hours" style={INN}/>
          </div>
          <div className="row" style={{ gap:12, alignItems:'center' }}>
            <label style={{ display:'flex', gap:6, alignItems:'center', fontSize:13, cursor:'pointer' }}>
              <input type="checkbox" checked={ceForm.certificate} onChange={e=>setCeForm(x=>({...x,certificate:e.target.checked}))}/> Certificate received
            </label>
            <button className="btn btn--pink" onClick={()=>{ if(!ceForm.hours) return; updEdu({ceLog:[{id:'ce'+Date.now(),...ceForm},...ceLog]}); setCeForm({date:todayStr(),provider:'',topic:'',hours:'',certificate:false}); }}><Icon name="plus" size={13}/> Add</button>
          </div>
        </div>
        <div className="col gap-sm">
          {ceLog.length === 0 && <div className="empty">No CE hours logged yet. Add your first entry above.</div>}
          {ceLog.map(e=>(
            <div key={e.id} className="row row--between" style={{ fontSize:13, padding:'6px 0', borderBottom:'1px dashed var(--line)' }}>
              <div><div style={{ fontWeight:600 }}>{e.topic}</div><div className="text-mono fs-xs text-muted">{e.date} · {e.provider}{e.certificate?' · 📜 cert':''}</div></div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <span style={{ fontWeight:700, color:SC_GOLD }}>{e.hours}h</span>
                <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>updEdu({ceLog:ceLog.filter(x=>x.id!==e.id)})}><Icon name="x" size={10}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className="card">
          <CardHead title="Course Wishlist" sub={`${wishlist.length} courses`}/>
          <div style={{ background:'var(--card-2)', borderRadius:10, padding:10, margin:'12px 0 10px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:6 }}>
              <input value={wlForm.name} onChange={e=>setWlForm(x=>({...x,name:e.target.value}))} placeholder="Course name" style={{ ...INN, padding:'6px 8px', fontSize:12 }}/>
              <input value={wlForm.topic} onChange={e=>setWlForm(x=>({...x,topic:e.target.value}))} placeholder="Topic area" style={{ ...INN, padding:'6px 8px', fontSize:12 }}/>
              <input value={wlForm.provider} onChange={e=>setWlForm(x=>({...x,provider:e.target.value}))} placeholder="Provider" style={{ ...INN, padding:'6px 8px', fontSize:12 }}/>
              <input value={wlForm.cost} onChange={e=>setWlForm(x=>({...x,cost:e.target.value}))} placeholder="Est. cost" style={{ ...INN, padding:'6px 8px', fontSize:12 }}/>
            </div>
            <button className="btn btn--ghost" style={{ fontSize:11 }} onClick={()=>{ if(!wlForm.name) return; updEdu({wishlist:[{id:'wl'+Date.now(),...wlForm},...wishlist]}); setWlForm({name:'',topic:'',provider:'',cost:'',priority:'medium',notes:''}); }}>+ Add</button>
          </div>
          {wishlist.map(c=>(
            <div key={c.id} style={{ padding:'8px 0', borderBottom:'1px dashed var(--line)' }}>
              <div className="row row--between">
                <div><div style={{ fontWeight:600, fontSize:13 }}>{c.name}</div><div className="text-mono fs-xs text-muted">{c.topic}{c.provider?` · ${c.provider}`:''}{c.cost?` · ${c.cost}`:''}</div></div>
                <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>updEdu({wishlist:wishlist.filter(x=>x.id!==c.id)})}><Icon name="x" size={10}/></button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <CardHead title="Completed" sub={`${completed.length} courses`}/>
          <div style={{ background:'var(--card-2)', borderRadius:10, padding:10, margin:'12px 0 10px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:6 }}>
              <input value={compForm.name} onChange={e=>setCompForm(x=>({...x,name:e.target.value}))} placeholder="Course name" style={{ ...INN, padding:'6px 8px', fontSize:12 }}/>
              <input type="date" value={compForm.date} onChange={e=>setCompForm(x=>({...x,date:e.target.value}))} style={{ ...INN, padding:'6px 8px', fontSize:12 }}/>
              <input value={compForm.provider} onChange={e=>setCompForm(x=>({...x,provider:e.target.value}))} placeholder="Provider" style={{ ...INN, padding:'6px 8px', fontSize:12 }}/>
              <label style={{ display:'flex', gap:6, alignItems:'center', fontSize:12, cursor:'pointer', padding:'0 4px' }}>
                <input type="checkbox" checked={compForm.certificate} onChange={e=>setCompForm(x=>({...x,certificate:e.target.checked}))}/> Certificate
              </label>
            </div>
            <button className="btn btn--ghost" style={{ fontSize:11 }} onClick={()=>{ if(!compForm.name) return; updEdu({completed:[{id:'co'+Date.now(),...compForm},...completed]}); setCompForm({name:'',date:todayStr(),provider:'',certificate:false,notes:''}); }}>+ Add</button>
          </div>
          {completed.map(c=>(
            <div key={c.id} style={{ padding:'8px 0', borderBottom:'1px dashed var(--line)' }}>
              <div className="row row--between">
                <div><div style={{ fontWeight:600, fontSize:13 }}>{c.name}{c.certificate&&<span style={{ color:SC_GOLD, marginLeft:6, fontSize:11 }}>📜</span>}</div><div className="text-mono fs-xs text-muted">{c.date}{c.provider?` · ${c.provider}`:''}</div></div>
                <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>updEdu({completed:completed.filter(x=>x.id!==c.id)})}><Icon name="x" size={10}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="card">
        <CardHead title="Industry Events" sub={`${events.length} events`} right={
          <button className="btn btn--pink" style={{ fontSize:11 }} onClick={()=>{ if(!evForm.name) return; updEdu({events:[{id:'ev'+Date.now(),...evForm},...events]}); setEvForm({name:'',date:'',location:'',cost:'',registered:false,notes:''}); }}><Icon name="plus" size={12}/> Add</button>
        }/>
        <div style={{ background:'var(--card-2)', borderRadius:10, padding:10, margin:'12px 0 10px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8 }}>
          <input value={evForm.name} onChange={e=>setEvForm(x=>({...x,name:e.target.value}))} placeholder="Event name" style={INN}/>
          <input type="date" value={evForm.date} onChange={e=>setEvForm(x=>({...x,date:e.target.value}))} style={INN}/>
          <input value={evForm.location} onChange={e=>setEvForm(x=>({...x,location:e.target.value}))} placeholder="Location" style={INN}/>
          <input value={evForm.cost} onChange={e=>setEvForm(x=>({...x,cost:e.target.value}))} placeholder="Cost" style={INN}/>
        </div>
        {events.map(ev=>(
          <div key={ev.id} className="card" style={{ padding:14, marginBottom:8, borderLeft:`3px solid ${ev.registered?SC_GOLD:'var(--line)'}` }}>
            <div className="row row--between">
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{ev.name}</div>
                <div className="text-mono fs-xs text-muted">{ev.date}{ev.location?` · ${ev.location}`:''}{ev.cost?` · ${ev.cost}`:''}</div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button style={{ fontSize:11, padding:'3px 10px', borderRadius:8, border:`1px solid ${ev.registered?SC_GOLD:'var(--line)'}`, background:ev.registered?SC_SOFT:'transparent', color:ev.registered?SC_GOLD:'var(--ink-soft)', cursor:'pointer', fontFamily:'inherit' }}
                  onClick={()=>updEdu({events:events.map(x=>x.id===ev.id?{...x,registered:!x.registered}:x)})}>
                  {ev.registered?'✓ Registered':'Register'}
                </button>
                <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>updEdu({events:events.filter(x=>x.id!==ev.id)})}><Icon name="x" size={10}/></button>
              </div>
            </div>
            {ev.notes && <div style={{ fontSize:12, color:'var(--ink-soft)', marginTop:4 }}>{ev.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OPERATIONS MODAL ─────────────────────────────────────────────────────────
const INV_CATS = ['Shampoo','Conditioner','Treatment','Styler','Heat Protection','Tool','Disposable','Other'];

function OperationsModal({ state, setState, onClose }) {
  const [inner, setInner] = useState('policies');
  const policies = state.scPolicies || '';
  const consultForm = state.scConsultationForm || [];
  const inventory = state.scInventory || [];
  const [newQ, setNewQ] = useState('');
  const [editQ, setEditQ] = useState(null);
  const [invForm, setInvForm] = useState({ name:'', category:'Shampoo', qty:0, threshold:2, reorderLink:'', notes:'' });

  return (
    <Modal onClose={onClose} maxWidth={700}>
      <ModalHead title="Studio Operations" sub="policies · forms · inventory" onClose={onClose}/>
      <div style={{ padding:'0 22px 22px' }}>
        <div className="row" style={{ gap:8, background:'var(--card-2)', padding:4, borderRadius:12, marginBottom:16, display:'inline-flex' }}>
          {['policies','consultation','inventory'].map(t=>(
            <button key={t} onClick={()=>setInner(t)} style={{ padding:'5px 14px', borderRadius:9, border:0, background:inner===t?SC_GOLD:'transparent', color:inner===t?'white':'var(--ink-soft)', fontWeight:600, fontSize:12, cursor:'pointer', textTransform:'capitalize', fontFamily:'inherit' }}>{t}</button>
          ))}
        </div>

        {inner === 'policies' && (
          <div className="col gap-md">
            <textarea value={policies} onChange={e=>setState(s=>({...s,scPolicies:e.target.value}))} rows={14} style={{ ...INN, resize:'vertical', lineHeight:1.7, fontSize:13 }}/>
            <div className="row" style={{ gap:10, justifyContent:'flex-end' }}>
              <button className="btn btn--ghost" onClick={()=>navigator.clipboard?.writeText(policies)}>📋 Copy to share</button>
            </div>
          </div>
        )}

        {inner === 'consultation' && (
          <div className="col gap-md">
            <div className="col gap-sm">
              {consultForm.map((q,i)=>(
                <div key={q.id} style={{ background:'var(--card-2)', borderRadius:10, padding:'10px 12px' }}>
                  {editQ === q.id ? (
                    <div className="row" style={{ gap:8 }}>
                      <input defaultValue={q.text} id={`eq-${q.id}`} style={{ ...INN, flex:1 }}/>
                      <button className="btn btn--pink" style={{ fontSize:11 }} onClick={()=>{ const val=document.getElementById(`eq-${q.id}`).value; setState(s=>({...s,scConsultationForm:(s.scConsultationForm||[]).map(x=>x.id===q.id?{...x,text:val}:x)})); setEditQ(null); }}><Icon name="check" size={12}/></button>
                      <button className="btn btn--ghost" style={{ fontSize:11 }} onClick={()=>setEditQ(null)}>✕</button>
                    </div>
                  ) : (
                    <div className="row row--between">
                      <span style={{ fontSize:13 }}><span className="text-mono" style={{ color:SC_GOLD, marginRight:8 }}>{i+1}.</span>{q.text}</span>
                      <div style={{ display:'flex', gap:8 }}>
                        <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>setEditQ(q.id)}><Icon name="edit" size={11}/></button>
                        <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>setState(s=>({...s,scConsultationForm:(s.scConsultationForm||[]).filter(x=>x.id!==q.id)}))}><Icon name="x" size={10}/></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="row" style={{ gap:8 }}>
              <input value={newQ} onChange={e=>setNewQ(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&newQ.trim()){ setState(s=>({...s,scConsultationForm:[...(s.scConsultationForm||[]),{id:'cq'+Date.now(),text:newQ.trim()}]})); setNewQ(''); } }} placeholder="Add a question…" style={{ ...INN, flex:1 }}/>
              <button className="btn btn--pink" onClick={()=>{ if(!newQ.trim()) return; setState(s=>({...s,scConsultationForm:[...(s.scConsultationForm||[]),{id:'cq'+Date.now(),text:newQ.trim()}]})); setNewQ(''); }}><Icon name="plus" size={13}/></button>
            </div>
            <button className="btn btn--ghost" style={{ alignSelf:'flex-start', fontSize:12 }} onClick={()=>navigator.clipboard?.writeText(consultForm.map((q,i)=>`${i+1}. ${q.text}`).join('\n'))}>📋 Copy as form</button>
          </div>
        )}

        {inner === 'inventory' && (
          <div className="col gap-md">
            <div style={{ background:'var(--card-2)', borderRadius:10, padding:12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8, marginBottom:8 }}>
                <input value={invForm.name} onChange={e=>setInvForm(x=>({...x,name:e.target.value}))} placeholder="Product name" style={INN}/>
                <select value={invForm.category} onChange={e=>setInvForm(x=>({...x,category:e.target.value}))} style={INN}>{INV_CATS.map(c=><option key={c}>{c}</option>)}</select>
                <input type="number" value={invForm.qty} onChange={e=>setInvForm(x=>({...x,qty:parseInt(e.target.value)||0}))} placeholder="Qty" style={INN}/>
                <input type="number" value={invForm.threshold} onChange={e=>setInvForm(x=>({...x,threshold:parseInt(e.target.value)||0}))} placeholder="Low stock #" style={INN}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr auto', gap:8 }}>
                <input value={invForm.reorderLink} onChange={e=>setInvForm(x=>({...x,reorderLink:e.target.value}))} placeholder="Reorder link (optional)" style={INN}/>
                <input value={invForm.notes} onChange={e=>setInvForm(x=>({...x,notes:e.target.value}))} placeholder="Notes" style={INN}/>
                <button className="btn btn--pink" onClick={()=>{ if(!invForm.name) return; setState(s=>({...s,scInventory:[{id:'inv'+Date.now(),...invForm},...(s.scInventory||[])]})); setInvForm({name:'',category:'Shampoo',qty:0,threshold:2,reorderLink:'',notes:''}); }}><Icon name="plus" size={13}/></button>
              </div>
            </div>
            {inventory.length === 0 && <div className="empty">Your back bar inventory will live here. Add your first product above.</div>}
            {inventory.map(item=>{
              const low = item.qty <= item.threshold;
              return (
                <div key={item.id} style={{ background:low?'#fff8e6':'var(--card)', border:`1px solid ${low?'#f5a623':'var(--line)'}`, borderRadius:10, padding:'10px 14px' }}>
                  <div className="row row--between">
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{item.name} {low&&<span style={{ fontSize:11, color:'#f5a623', fontWeight:700 }}>⚠ Low stock</span>}</div>
                      <div className="text-mono fs-xs text-muted">{item.category}{item.notes?` · ${item.notes}`:''}</div>
                    </div>
                    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                      <div style={{ textAlign:'right' }}>
                        <input type="number" value={item.qty} onChange={e=>setState(s=>({...s,scInventory:(s.scInventory||[]).map(x=>x.id===item.id?{...x,qty:parseInt(e.target.value)||0}:x)}))} style={{ ...INN, width:56, textAlign:'center', padding:'3px 6px' }}/>
                        <div className="text-mono fs-xs text-muted">low at {item.threshold}</div>
                      </div>
                      {item.reorderLink && <a href={item.reorderLink} target="_blank" rel="noreferrer" style={{ fontSize:11, color:SC_GOLD }}>Reorder ↗</a>}
                      <button className="btn btn--icon" style={{ width:20, height:20 }} onClick={()=>setState(s=>({...s,scInventory:(s.scInventory||[]).filter(x=>x.id!==item.id)}))}><Icon name="x" size={10}/></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
const SUB_TABS = ['overview','setup','finances','clients','marketing','content','education'];
const SUB_LABELS = { overview:'Overview', setup:'Setup', finances:'Finances', clients:'Clients', marketing:'Marketing', content:'Content', education:'Education' };

export default function SilkCollectiveView({ state, setState }) {
  const [tab, setTab] = useState('overview');
  const [opsOpen, setOpsOpen] = useState(false);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting" style={{ color:SC_GOLD }}>The Silk Collective Studio</div>
          <h1 className="page-head__title">Business Hub</h1>
        </div>
      </div>

      <div style={{ overflowX:'auto', marginBottom:20, paddingBottom:4 }}>
        <div style={{ display:'flex', gap:6, background:'var(--card-2)', padding:4, borderRadius:14, width:'max-content', minWidth:'100%' }}>
          {SUB_TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'7px 18px', borderRadius:11, border:0, background:tab===t?SC_GOLD:'transparent', color:tab===t?'white':'var(--ink-soft)', fontWeight:600, fontSize:13, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', transition:'background 0.15s' }}>
              {SUB_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview'   && <OverviewTab   state={state} setState={setState} onOpsOpen={()=>setOpsOpen(true)} />}
      {tab === 'setup'      && <SetupTab      state={state} setState={setState} />}
      {tab === 'finances'   && <FinancesTab   state={state} setState={setState} />}
      {tab === 'clients'    && <ClientsTab    state={state} setState={setState} />}
      {tab === 'marketing'  && <MarketingTab  state={state} setState={setState} />}
      {tab === 'content'    && <ContentTab    state={state} setState={setState} />}
      {tab === 'education'  && <EducationTab  state={state} setState={setState} />}

      {opsOpen && <OperationsModal state={state} setState={setState} onClose={()=>setOpsOpen(false)} />}
    </>
  );
}
