'use client';

import { useState } from 'react';
import { cls } from '@/lib/helpers';
import { CardHead, Pill } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

const GROCERY_CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Snacks', 'Other'];

function GroceryView({ state, setState }) {
  const groceryList = state.groceryList || [];
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState('Produce');
  const [filterCat, setFilterCat] = useState('all');

  const addItem = () => {
    if (!newItem.trim()) return;
    setState(s => ({
      ...s,
      groceryList: [...(s.groceryList || []), { id: `g-${Date.now()}`, item: newItem.trim(), category: newCat, checked: false }],
    }));
    setNewItem('');
  };

  const toggleItem = (id) => setState(s => ({
    ...s, groceryList: (s.groceryList || []).map(g => g.id === id ? { ...g, checked: !g.checked } : g),
  }));

  const removeItem = (id) => setState(s => ({
    ...s, groceryList: (s.groceryList || []).filter(g => g.id !== id),
  }));

  const clearChecked = () => setState(s => ({
    ...s, groceryList: (s.groceryList || []).filter(g => !g.checked),
  }));

  const checkedCount = groceryList.filter(g => g.checked).length;
  const uncheckedCount = groceryList.length - checkedCount;

  const grouped = GROCERY_CATEGORIES.reduce((acc, cat) => {
    const items = groceryList.filter(g => g.category === cat && (filterCat === 'all' || filterCat === cat));
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Add item */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>Add item</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="What do you need?"
            style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 14 }}
          />
          <button onClick={addItem} className="btn btn--pink" style={{ padding: '9px 18px' }}>Add</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {GROCERY_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setNewCat(cat)} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontWeight: 500,
              border: `1px solid ${newCat === cat ? 'var(--ink)' : 'var(--line)'}`,
              background: newCat === cat ? 'var(--ink)' : 'var(--card)',
              color: newCat === cat ? 'var(--bg)' : 'var(--ink-soft)',
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Filter + stats */}
      {groceryList.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setFilterCat('all')} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontWeight: 500,
              border: `1px solid ${filterCat === 'all' ? 'var(--primary)' : 'var(--line)'}`,
              background: filterCat === 'all' ? 'var(--primary)' : 'var(--card)',
              color: filterCat === 'all' ? 'white' : 'var(--ink-soft)',
            }}>All ({groceryList.length})</button>
            {Object.keys(grouped).map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontWeight: 500,
                border: `1px solid ${filterCat === cat ? 'var(--primary)' : 'var(--line)'}`,
                background: filterCat === cat ? 'var(--primary)' : 'var(--card)',
                color: filterCat === cat ? 'white' : 'var(--ink-soft)',
              }}>{cat}</button>
            ))}
          </div>
          {checkedCount > 0 && (
            <button onClick={clearChecked} className="btn btn--ghost" style={{ fontSize: 11, color: 'var(--primary)' }}>
              Clear {checkedCount} done
            </button>
          )}
        </div>
      )}

      {/* List grouped by category */}
      {groceryList.length === 0 ? (
        <div className="card">
          <div className="empty" style={{ padding: 60 }}>Your grocery list is empty — add items above</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>
                {cat} · {items.filter(g => !g.checked).length} left
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map(g => (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, opacity: g.checked ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                    <button onClick={() => toggleItem(g.id)} style={{
                      flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                      background: g.checked ? 'var(--accent-2)' : 'transparent',
                      border: `1.5px solid ${g.checked ? 'var(--accent-2)' : 'var(--muted)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11,
                    }}>
                      {g.checked && '✓'}
                    </button>
                    <span style={{ flex: 1, fontSize: 14, color: 'var(--ink)', textDecoration: g.checked ? 'line-through' : 'none' }}>{g.item}</span>
                    <button onClick={() => removeItem(g.id)} style={{ color: 'var(--muted)', fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {groceryList.length > 0 && (
        <div style={{ marginTop: 24, padding: 16, background: 'var(--card)', borderRadius: 14, border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>
            <span>{checkedCount} of {groceryList.length} items checked off</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{Math.round(checkedCount / groceryList.length * 100)}%</span>
          </div>
          <div style={{ height: 5, background: 'var(--line)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${checkedCount / groceryList.length * 100}%`, height: '100%', background: 'var(--accent-2)', borderRadius: 4, transition: 'width 0.4s' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecipesView({ state, setState }) {
  const { recipes } = state;
  const [view, setView] = useState('recipes');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newRecipe, setNewRecipe] = useState({ name: '', type: 'Dinner', time: '30 min', icon: '🍽', bg: '#fde3cf' });

  const types = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Side', 'Snack', 'Dessert'];
  const filtered = filter === 'all' ? recipes : recipes.filter((r) => r.type === filter);
  const favs = recipes.filter((r) => r.fav).length;
  const groceryCount = (state.groceryList || []).filter(g => !g.checked).length;

  const toggleFav = (id) => {
    setState((s) => ({ ...s, recipes: s.recipes.map((r) => r.id === id ? { ...r, fav: !r.fav } : r) }));
  };

  const addRecipe = () => {
    if (!newRecipe.name.trim()) return;
    setState((s) => ({
      ...s,
      recipes: [{ id: 'r' + Date.now(), fav: false, ...newRecipe }, ...s.recipes],
    }));
    setNewRecipe({ name: '', type: 'Dinner', time: '30 min', icon: '🍽', bg: '#fde3cf' });
    setAddOpen(false);
  };

  const removeRecipe = (id) => {
    setState((s) => ({ ...s, recipes: s.recipes.filter((r) => r.id !== id) }));
    setOpen(null);
  };

  const bgOptions = ['#fde3cf', '#fbd7e1', '#d8ecdc', '#ebe1f5', '#fdecbc', '#dceaf7'];
  const iconOptions = ['🍽', '🥗', '🍝', '🥘', '🍜', '🥞', '🍳', '🥑', '🍕', '🍰', '🍫', '🍲', '🥙', '🌮', '🍱', '🥣', '🍛', '🍣'];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Kitchen · {recipes.length} recipes</div>
          <h1 className="page-head__title">{view === 'recipes' ? 'Recipe library' : 'Grocery list'}</h1>
          <div className="page-head__date mt-sm">{view === 'recipes' ? `${favs} favorites` : `${groceryCount} items needed`}</div>
        </div>
        <div className="row gap-md">
          {/* View toggle */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--line)', borderRadius: 10, padding: 3 }}>
            <button onClick={() => setView('recipes')} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: view === 'recipes' ? 'var(--card)' : 'transparent', color: view === 'recipes' ? 'var(--ink)' : 'var(--muted)', fontWeight: view === 'recipes' ? 600 : 500, fontSize: 13, boxShadow: view === 'recipes' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>Recipes</button>
            <button onClick={() => setView('grocery')} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: view === 'grocery' ? 'var(--card)' : 'transparent', color: view === 'grocery' ? 'var(--ink)' : 'var(--muted)', fontWeight: view === 'grocery' ? 600 : 500, fontSize: 13, boxShadow: view === 'grocery' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', position: 'relative' }}>
              Grocery
              {groceryCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{groceryCount}</span>}
            </button>
          </div>
          {view === 'recipes' && (
            <button className="btn btn--pink" onClick={() => setAddOpen(true)}>
              <Icon name="plus" size={14} /> Add recipe
            </button>
          )}
        </div>
      </div>

      {view === 'grocery' ? (
        <GroceryView state={state} setState={setState} />
      ) : (
        <>
          <div className="row gap-sm" style={{ flexWrap: 'wrap', marginBottom: 18 }}>
            {types.map((t) => (
              <button
                key={t}
                className="pill pill--mono"
                style={{
                  cursor: 'pointer',
                  background: filter === t ? 'var(--primary)' : 'var(--card)',
                  color: filter === t ? 'white' : 'var(--ink-soft)',
                  border: filter === t ? '1px solid var(--primary)' : '1px solid var(--line)',
                }}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card">
              <div className="empty" style={{ padding: 60 }}>
                No recipes yet — add your first one with the button above
              </div>
            </div>
          )}

          <div className="recipe-grid">
            {filtered.map((r) => (
              <div key={r.id} className="recipe-card" onClick={() => setOpen(r)}>
                <div className="recipe-card__img" style={{ background: r.bg }}>
                  {r.icon}
                  <button
                    className="recipe-fav"
                    onClick={(e) => { e.stopPropagation(); toggleFav(r.id); }}
                    title="Favorite"
                  >
                    {r.fav ? '♥' : '♡'}
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
        </>
      )}

      {/* Recipe detail modal */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(58,29,40,0.4)', zIndex: 50, display: 'grid', placeItems: 'center', padding: 20 }}
          onClick={() => setOpen(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 560, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ background: open.bg, height: 180, display: 'grid', placeItems: 'center', fontSize: 80, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', position: 'relative' }}>
              {open.icon}
              <button
                className="btn btn--icon"
                style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.8)' }}
                onClick={() => setOpen(null)}
              >
                <Icon name="x" size={14} />
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <div className="row gap-sm" style={{ marginBottom: 6 }}>
                <Pill tone="pink" mono>{open.type}</Pill>
                <Pill tone="lilac" mono>{open.time}</Pill>
              </div>
              <h2 className="text-serif" style={{ fontSize: 32, margin: '8px 0 14px' }}>{open.name}</h2>

              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Ingredients</div>
              <ul style={{ paddingLeft: 18, color: 'var(--ink-soft)', lineHeight: 1.8 }}>
                {(open.ingredients || ['Add ingredients in the edit view']).map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <div className="text-mono fs-xs text-muted mt-md" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Steps</div>
              <ol style={{ paddingLeft: 18, color: 'var(--ink-soft)', lineHeight: 1.8 }}>
                {(open.steps || ['Edit this recipe to add steps']).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>

              {open.notes && (
                <div style={{ marginTop: 16, padding: 14, background: 'var(--card-2)', borderRadius: 12, fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  {open.notes}
                </div>
              )}

              <div className="row mt-lg gap-sm">
                <button className="btn btn--pink"><Icon name="check" size={14} /> I made this</button>
                <button className="btn btn--ghost" onClick={() => toggleFav(open.id)}>
                  {open.fav ? '♥ Favorited' : '♡ Save'}
                </button>
                <button className="btn btn--ghost" style={{ color: 'var(--primary)' }} onClick={() => removeRecipe(open.id)}>
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add recipe modal */}
      {addOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(58,29,40,0.42)', zIndex: 60, display: 'grid', placeItems: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={() => setAddOpen(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 460, width: '100%', padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: 6, background: 'var(--primary)' }} />
            <div style={{ padding: 22 }}>
              <div className="row row--between" style={{ alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>New recipe</div>
                  <h3 className="text-serif" style={{ fontSize: 30, margin: '4px 0 0', lineHeight: 1.1 }}>Add to kitchen</h3>
                </div>
                <button className="btn btn--icon" onClick={() => setAddOpen(false)}><Icon name="x" size={14} /></button>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Recipe name</div>
                <input
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe((r) => ({ ...r, name: e.target.value }))}
                  placeholder="What's it called?"
                  autoFocus
                  style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px', fontSize: 14, background: 'var(--card)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Type</div>
                  <select
                    value={newRecipe.type}
                    onChange={(e) => setNewRecipe((r) => ({ ...r, type: e.target.value }))}
                    style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px', fontSize: 13, background: 'var(--card)', outline: 'none' }}
                  >
                    {['Breakfast', 'Lunch', 'Dinner', 'Side', 'Snack', 'Dessert'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Time</div>
                  <input
                    value={newRecipe.time}
                    onChange={(e) => setNewRecipe((r) => ({ ...r, time: e.target.value }))}
                    placeholder="30 min"
                    style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px', fontSize: 13, background: 'var(--card)', outline: 'none' }}
                  />
                </div>
              </div>

              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Icon</div>
              <div className="row gap-sm" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
                {iconOptions.map((ico) => (
                  <button
                    key={ico}
                    onClick={() => setNewRecipe((r) => ({ ...r, icon: ico }))}
                    style={{
                      width: 36, height: 36, borderRadius: 10, fontSize: 18, cursor: 'pointer', padding: 0,
                      background: newRecipe.icon === ico ? 'var(--primary-soft)' : 'var(--card-2)',
                      border: newRecipe.icon === ico ? '1.5px solid var(--primary)' : '1.5px solid transparent',
                      display: 'grid', placeItems: 'center',
                    }}
                  >
                    {ico}
                  </button>
                ))}
              </div>

              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Card color</div>
              <div className="row gap-sm" style={{ marginBottom: 18 }}>
                {bgOptions.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setNewRecipe((r) => ({ ...r, bg }))}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: bg, padding: 0, cursor: 'pointer',
                      border: newRecipe.bg === bg ? '2px solid var(--primary)' : '2px solid transparent',
                    }}
                  />
                ))}
              </div>

              <div className="row row--between">
                <button className="btn btn--ghost" onClick={() => setAddOpen(false)}>Cancel</button>
                <button className="btn btn--pink" onClick={addRecipe}>
                  <Icon name="check" size={14} /> Add recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
