'use client';

import { useState, useEffect } from 'react';
import { DAYS_OF_WEEK, cls } from '@/lib/helpers';
import { CardHead, Pill, Editable, burstConfetti } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

function getWeekRange(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = (day === 0 ? -6 : 1 - day) + offsetWeeks * 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

export default function WeekView({ state, setState }) {
  const { tasks, gymWeek } = state;
  const [weekOffset, setWeekOffset] = useState(0);
  const [calEvents, setCalEvents] = useState({});

  const now = new Date();
  const TODAY_IDX = (now.getDay() + 6) % 7;
  const todayShort = DAYS_OF_WEEK[TODAY_IDX];

  const getWeekDates = (offset = 0) => {
    const day = now.getDay();
    const mondayOffset = (day === 0 ? -6 : 1 - day) + offset * 7;
    return DAYS_OF_WEEK.map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() + mondayOffset + i);
      return d;
    });
  };
  const weekDateObjs = getWeekDates(weekOffset);
  const weekDates = weekDateObjs.map(d => d.getDate());

  const toDateStr = (d) => {
    const s = d.toLocaleDateString('en-US', {
      timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
    });
    const [mo, day, y] = s.split('/');
    return `${y}-${mo}-${day}`;
  };

  useEffect(() => {
    const dates = weekDateObjs.map(toDateStr).join(',');
    fetch(`/api/calendar?dates=${dates}`)
      .then(r => r.json())
      .then(data => { if (data.connected) setCalEvents(data.eventsByDate || {}); })
      .catch(() => {});
  }, [weekOffset]);

  const toggleTask = (id, e) => {
    if (e && !tasks.find(t => t.id === id).done) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }));
  };

  const addTaskToDay = (day) => {
    const id = 't' + Date.now();
    setState(s => ({ ...s, tasks: [...s.tasks, { id, text: 'New task', done: false, day }] }));
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
  const labels = ['Last week', 'This week', 'Next week', '+2 weeks'];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Week view</div>
          <h1 className="page-head__title">{labels[weekOffset + 1] || 'This week'}</h1>
          <div className="page-head__date mt-sm">{getWeekRange(weekOffset)}</div>
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
        <div className="card col-7">
          <CardHead title="Weekly focus" sub="What matters this week" />
          <div className="focus-box">
            <div className="focus-box__label">North star</div>
            <Editable
              value={state.focus}
              onChange={(v) => setState(s => ({ ...s, focus: v }))}
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 26, lineHeight: 1.2 }}
              multiline
            />
          </div>
          <div className="bento mt-md" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {[
              { label: 'Wins so far', placeholder: "What's going well?", key: 'wins' },
              { label: 'Push through', placeholder: 'Where I need grit', key: 'push' },
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

        <div className="card col-5">
          <CardHead
            title="Gym sessions"
            sub={`${gymWeek.filter(g => g.done).length}/5 weekly goal`}
          />
          <div className="gym-grid">
            {gymWeek.map((g, i) => (
              <button
                key={i}
                className={cls('gym-cell', g.done && 'gym-cell--done', g.rest && 'gym-cell--rest')}
                onClick={() => setState(s => ({ ...s, gymWeek: s.gymWeek.map((x, j) => j === i ? { ...x, done: !x.done } : x) }))}
              >
                <span className="gym-cell__day">{g.day}</span>
                <span className="gym-cell__icon">{g.rest ? '☁︎' : g.done ? '✓' : '·'}</span>
                <span style={{ fontSize: 9, marginTop: 2 }}>{g.type}</span>
              </button>
            ))}
          </div>
        </div>

        {taskByDay.map((col, i) => {
          const isToday = weekOffset === 0 && col.day === todayShort;
          const dayStr = toDateStr(weekDateObjs[i]);
          const dayCalEvents = calEvents[dayStr] || [];
          return (
            <div key={col.day} className={cls('card', 'col-3', isToday && 'card--pink')} style={{ minHeight: 200 }}>
              <div className="row row--between" style={{ marginBottom: 10 }}>
                <div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em' }}>{col.day}</div>
                  <div className="text-serif" style={{ fontSize: 22 }}>{weekDates[i]}</div>
                </div>
                {isToday && <Pill tone="pink" mono>today</Pill>}
              </div>
              {dayCalEvents.map(e => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderBottom: '1px dashed var(--line)', marginBottom: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }}/>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{e.time}</div>
                  </div>
                </div>
              ))}
              {col.items.length === 0 && dayCalEvents.length === 0 && <div className="empty" style={{ padding: '12px 0' }}>nothing yet</div>}
              {col.items.map(t => (
                <div key={t.id} className={cls('task', t.done && 'task--done')} style={{ padding: '6px 0', borderBottom: '1px dashed var(--line)' }}>
                  <button
                    className={cls('task__check', t.done && 'task__check--done')}
                    onClick={(e) => toggleTask(t.id, e)}
                    style={{ width: 18, height: 18 }}
                  >
                    {t.done && <Icon name="check" size={11} stroke={2.4}/>}
                  </button>
                  <Editable
                    value={t.text}
                    onChange={(v) => editTask(t.id, v)}
                    style={{ fontSize: 12.5, padding: '0 4px', textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--muted)' : 'var(--ink)' }}
                  />
                  <button className="btn btn--ghost" style={{ padding: 2, color: 'var(--muted)' }} onClick={() => removeTask(t.id)}>
                    <Icon name="x" size={12}/>
                  </button>
                </div>
              ))}
              <button
                className="btn btn--ghost"
                style={{ marginTop: 10, fontSize: 12, padding: '4px 8px' }}
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
}
