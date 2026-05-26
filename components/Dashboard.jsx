'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cls, MOOD_OPTIONS } from '@/lib/helpers';
import { THEMES, applyTheme } from '@/lib/themes';
import { NavItem, Pill } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import TodayView from '@/components/views/TodayView';
import WeekView from '@/components/views/WeekView';
import HabitsView from '@/components/views/HabitsView';
import QuarterView from '@/components/views/QuarterView';
import FinanceView from '@/components/views/FinanceView';
import JournalView from '@/components/views/JournalView';
import RecipesView from '@/components/views/RecipesView';
import ContentView from '@/components/views/ContentView';
import HairView from '@/components/views/HairView';
import FitnessView from '@/components/views/FitnessView';
import SilkCollectiveView from '@/components/views/SilkCollectiveView';
import TravelView from '@/components/views/TravelView';
import MonthlyReviewView from '@/components/views/MonthlyReviewView';
import DevotionView from '@/components/views/DevotionView';

const VIEWS = { today: TodayView, week: WeekView, habits: HabitsView, quarter: QuarterView, finance: FinanceView, journal: JournalView, recipes: RecipesView, content: ContentView, hair: HairView, fitness: FitnessView, silk: SilkCollectiveView, travel: TravelView, review: MonthlyReviewView, devotion: DevotionView };

const NAV = [
  { id: 'today', label: 'Today', icon: 'spark' },
  { id: 'week', label: 'This week', icon: 'week' },
  { id: 'habits', label: 'Habits', icon: 'habit' },
  { id: 'quarter', label: 'Quarterly Goals', icon: 'quarter' },
  { id: 'finance', label: 'Finance', icon: 'money' },
  { id: 'journal', label: 'Journal', icon: 'book' },
  { id: 'recipes', label: 'Kitchen', icon: 'chef' },
  { id: 'content', label: 'Content', icon: 'sparkle' },
  { id: 'hair', label: 'Hair', icon: 'leaf' },
  { id: 'fitness', label: 'Fitness', icon: 'habit' },
  { id: 'silk', label: 'The Silk Collective', icon: 'star' },
  { id: 'travel', label: 'Travel Hub', icon: 'calendar' },
  { id: 'review', label: 'Monthly Review', icon: 'book' },
  { id: 'devotion', label: 'Devotion', icon: 'heart' },
];

const ORDER_KEY = 'dashboard:sectionOrder';

function loadOrder() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(ORDER_KEY)); } catch { return null; }
}

function saveOrder(order) {
  try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch {}
}

function SortableNavItem({ id, label, icon, active, badge, editMode, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative',
    borderRadius: 10,
    background: isDragging ? 'var(--card)' : undefined,
    boxShadow: isDragging ? '0 4px 16px rgba(0,0,0,0.10)' : undefined,
    opacity: isDragging ? 0.92 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <button
        className={cls('sidebar__item', active && 'sidebar__item--active', editMode && 'sidebar__item--edit')}
        onClick={() => !editMode && onClick(id)}
        style={editMode ? { cursor: 'default', paddingLeft: 8 } : {}}
      >
        {editMode && (
          <span
            {...listeners}
            style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', padding: '0 6px 0 2px', cursor: 'grab', flexShrink: 0 }}
          >
            <Icon name="grip" size={16} />
          </span>
        )}
        <span className="sidebar__item-icon" style={editMode ? { opacity: 0.5 } : {}}>
          <Icon name={icon} />
        </span>
        <span style={editMode ? { opacity: 0.65 } : {}}>{label}</span>
        {!editMode && badge != null && badge > 0 && (
          <span className="sidebar__item-badge">{badge}</span>
        )}
      </button>
    </div>
  );
}

export default function Dashboard({ initialData }) {
  const [state, setState] = useState(initialData);
  const [theme, setTheme] = useState('strawberry');
  const [tweakOpen, setTweakOpen] = useState(false);
  const [shortcut, setShortcut] = useState(null);
  const [briefingSending, setBriefingSending] = useState(false);
  const [briefingStatus, setBriefingStatus] = useState(null);
  const [calLabel, setCalLabel] = useState('');
  const [calUrl, setCalUrl] = useState('');
  const [navOrder, setNavOrder] = useState(() => loadOrder() || NAV.map(n => n.id));
  const [editMode, setEditMode] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const saveTimer = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setNavOrder(prev => {
      const oldIdx = prev.indexOf(active.id);
      const newIdx = prev.indexOf(over.id);
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const exitEditMode = () => {
    setEditMode(false);
    saveOrder(navOrder);
    setOrderSaved(true);
    setTimeout(() => setOrderSaved(false), 1500);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const persistState = useCallback((s) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
      } catch (e) {}
    }, 800);
  }, []);

  const setStateAndPersist = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persistState(next);
      return next;
    });
  }, [persistState]);

  const setPage = (id) => setStateAndPersist(s => ({ ...s, page: id }));
  const ActiveView = VIEWS[state.page] || TodayView;

  const openTasks = state.tasks.filter(t => !t.done).length;
  const badges = { today: openTasks, week: openTasks };
  const orderedNav = navOrder
    .map(id => NAV.find(n => n.id === id))
    .filter(Boolean)
    .concat(NAV.filter(n => !navOrder.includes(n.id)));
  const visibleNav = orderedNav.filter(n => state.show[n.id] !== false);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark">D</div>
          <div>
            <div className="sidebar__brand-name">Dennika</div>
            <div className="sidebar__brand-sub">Personal OS · v2</div>
          </div>
        </div>

        <div className="row row--between" style={{ alignItems: 'center', paddingRight: 4 }}>
          <div className="sidebar__section-label" style={{ marginBottom: 0 }}>Workspace</div>
          {editMode ? (
            <button
              className="btn btn--ghost"
              style={{ fontSize: 11, padding: '3px 10px', height: 'auto', color: 'var(--primary)', borderColor: 'var(--primary)' }}
              onClick={exitEditMode}
            >
              Done
            </button>
          ) : (
            <button
              className="btn btn--icon"
              title="Edit order"
              style={{ color: 'var(--muted)', width: 26, height: 26 }}
              onClick={() => setEditMode(true)}
            >
              <Icon name="grip" size={15} />
            </button>
          )}
        </div>

        {orderSaved && (
          <div style={{ fontSize: 11, color: 'var(--primary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', padding: '4px 4px 2px', opacity: 1, transition: 'opacity 0.4s' }}>
            ✓ Order saved
          </div>
        )}

        <div style={editMode ? { background: 'var(--card)', borderRadius: 12, border: '1px solid var(--line)', padding: '4px 0', margin: '6px 0' } : { margin: '2px 0' }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={visibleNav.map(n => n.id)} strategy={verticalListSortingStrategy}>
              {visibleNav.map(n => (
                <SortableNavItem
                  key={n.id}
                  id={n.id}
                  label={n.label}
                  icon={n.icon}
                  active={state.page === n.id}
                  badge={badges[n.id]}
                  editMode={editMode}
                  onClick={setPage}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="sidebar__section-label">Shortcuts</div>
        <button className="sidebar__item" onClick={() => setShortcut('mood')}>
          <span className="sidebar__item-icon"><Icon name="heart" /></span>
          <span>Mood check-in</span>
        </button>
        <button className="sidebar__item" onClick={() => setTweakOpen(o => !o)}>
          <span className="sidebar__item-icon"><Icon name="settings" /></span>
          <span>Themes & settings</span>
        </button>

        <div className="sidebar__footer">
          <div className="sidebar__avatar">D</div>
          <div>
            <div className="sidebar__user">Dennika</div>
            <div className="sidebar__streak">14-day streak 🔥</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <ActiveView state={state} setState={setStateAndPersist} />
      </main>

      {tweakOpen && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 50, width: 280, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', border: '1px solid var(--line)', borderRadius: 18, boxShadow: 'var(--shadow-lg)', padding: 20 }}>
          <div className="row row--between" style={{ marginBottom: 16 }}>
            <div className="text-mono fs-xs" style={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink)' }}>Tweaks</div>
            <button className="btn btn--icon" onClick={() => setTweakOpen(false)}><Icon name="x" size={13}/></button>
          </div>

          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Color theme</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
            {Object.entries(THEMES).map(([key, t]) => (
              <button key={key} onClick={() => setTheme(key)}
                style={{ border: theme === key ? '2px solid var(--primary)' : '1px solid var(--line)', borderRadius: 12, padding: 10, background: t.vars['--card'], cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                  {t.swatches.slice(0, 4).map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c }}/>)}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: t.vars['--ink'] }}>{t.label}</div>
              </button>
            ))}
          </div>

          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Calendars</div>
          {(state.calendarUrls || []).map((cal, i) => (
            <div key={i} className="row row--between" style={{ marginBottom: 6, fontSize: 12 }}>
              <span style={{ color: 'var(--ink-soft)' }}>{cal.label}</span>
              <button className="btn btn--icon" style={{ width: 20, height: 20 }} onClick={() => setStateAndPersist(s => ({ ...s, calendarUrls: s.calendarUrls.filter((_, j) => j !== i) }))}>
                <Icon name="x" size={11}/>
              </button>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            <input
              placeholder="Name (e.g. iCloud)"
              value={calLabel}
              onChange={e => setCalLabel(e.target.value)}
              style={{ fontSize: 12, padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', background: 'var(--bg)' }}
            />
            <input
              placeholder="webcal:// or https:// URL"
              value={calUrl}
              onChange={e => setCalUrl(e.target.value)}
              style={{ fontSize: 12, padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', background: 'var(--bg)' }}
            />
            <button
              className="btn btn--ghost"
              style={{ fontSize: 11, justifyContent: 'center' }}
              onClick={() => {
                if (!calLabel.trim() || !calUrl.trim()) return;
                setStateAndPersist(s => ({ ...s, calendarUrls: [...(s.calendarUrls || []), { label: calLabel.trim(), url: calUrl.trim() }] }));
                setCalLabel(''); setCalUrl('');
              }}
            >
              + Add calendar
            </button>
          </div>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Morning briefing</div>
          <button
            className="btn btn--pink"
            style={{ width: '100%', marginBottom: 18, fontSize: 12, justifyContent: 'center' }}
            disabled={briefingSending}
            onClick={async () => {
              setBriefingSending(true);
              setBriefingStatus(null);
              try {
                const r = await fetch('/api/briefing/send', { method: 'POST' });
                const j = await r.json();
                setBriefingStatus(j.ok ? 'sent' : 'error');
              } catch {
                setBriefingStatus('error');
              }
              setBriefingSending(false);
              setTimeout(() => setBriefingStatus(null), 4000);
            }}
          >
            {briefingSending ? 'Sending…' : briefingStatus === 'sent' ? '✓ Sent to your phone!' : briefingStatus === 'error' ? '✗ Error — check Vercel logs' : '📱 Send test briefing now'}
          </button>
          <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Show views</div>
          <div className="col gap-sm">
            {NAV.map(n => (
              <label key={n.id} className="row row--between" style={{ cursor: 'pointer' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{n.label}</span>
                <div onClick={() => setStateAndPersist(s => ({ ...s, show: { ...s.show, [n.id]: !s.show[n.id] } }))}
                  style={{ width: 38, height: 22, borderRadius: 999, background: state.show[n.id] !== false ? 'var(--primary)' : 'var(--line)', display: 'flex', alignItems: 'center', padding: '0 3px', transition: 'background 0.2s', cursor: 'pointer' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', transform: state.show[n.id] !== false ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 0.2s' }}/>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {shortcut === 'mood' && (
        <MoodModal state={state} setState={setStateAndPersist} onClose={() => setShortcut(null)} />
      )}
    </div>
  );
}

function MoodModal({ state, setState, onClose }) {
  const [chosen, setChosen] = useState(null);

  const now = new Date();
  const TODAY_IDX = (now.getDay() + 6) % 7;

  const save = () => {
    if (!chosen) return;
    setState(s => ({
      ...s,
      moodWeek: s.moodWeek.map((m, i) => i === TODAY_IDX ? { ...m, emoji: chosen, mood: 4 } : m),
    }));
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(58,29,40,0.42)', zIndex: 60, display: 'grid', placeItems: 'center', padding: 24, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 460, width: '100%', padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 6, background: 'var(--primary)' }}/>
        <div style={{ padding: 22 }}>
          <div className="row row--between" style={{ alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>Mood check-in</div>
              <h3 className="text-serif" style={{ fontSize: 30, margin: '4px 0 0', lineHeight: 1.1 }}>How are you, really?</h3>
            </div>
            <button className="btn btn--icon" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>
          <div className="mood-grid" style={{ gap: 10 }}>
            {MOOD_OPTIONS.map(opt => (
              <button key={opt.id} className="mood-pick" onClick={() => setChosen(opt.emoji)}>
                <span className={cls('mood-emoji', chosen === opt.emoji && 'mood-emoji--active')} style={{ width: 48, height: 48, fontSize: 24 }}>{opt.emoji}</span>
                <span className="mood-label">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="row row--between mt-lg">
            <div className="text-mono fs-xs text-muted">Logs to your mood tracker</div>
            <div className="row gap-sm">
              <button className="btn btn--ghost" onClick={onClose}>Skip</button>
              <button className="btn btn--pink" onClick={save}><Icon name="check" size={14}/> Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
