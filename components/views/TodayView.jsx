'use client';

import { useState, useEffect } from 'react';
import { MOOD_OPTIONS, DAYS_OF_WEEK, cls } from '@/lib/helpers';
import { CardHead, Pill, burstConfetti } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

export default function TodayView({ state, setState }) {
  const { tasks, gymWeek, habits, habitLogs, moodWeek, journal, parking } = state;
  const [calendar, setCalendar] = useState({ connected: null, events: [] });

  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(setCalendar)
      .catch(() => {});
  }, []);

  const now = new Date();
  const TODAY_IDX = (now.getDay() + 6) % 7;
  const todayShort = DAYS_OF_WEEK[TODAY_IDX];
  const greeting = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const todayTasks = tasks.filter(t => t.day === todayShort).slice(0, 5);
  const taskDone = todayTasks.filter(t => t.done).length;

  const toggleTask = (id, e) => {
    if (e && !tasks.find(t => t.id === id).done) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }));
  };

  const setMoodToday = (option) => {
    setState(s => ({
      ...s,
      moodWeek: s.moodWeek.map((m, i) => i === TODAY_IDX ? { ...m, emoji: option.emoji, mood: 4 } : m),
    }));
  };

  const habitsToday = habits.filter(h => h.section === 'daily').slice(0, 5);
  const habitsCompleteToday = habitsToday.filter(h => habitLogs[h.id] && habitLogs[h.id][TODAY_IDX]).length;

  const toggleHabit = (id, e) => {
    if (e && habitLogs[id] && !habitLogs[id][TODAY_IDX]) {
      const r = e.currentTarget.getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    setState(s => {
      const next = [...(s.habitLogs[id] || Array(7).fill(false))];
      next[TODAY_IDX] = !next[TODAY_IDX];
      return { ...s, habitLogs: { ...s.habitLogs, [id]: next } };
    });
  };

  const briefingMsg = `Good morning Dennika ✦\n${greeting}\n\n📅 Today:\n${
    calendar.events.slice(0, 3).map(a => `• ${a.time} ${a.title}`).join('\n') || '• No events'
  }\n\n✅ Tasks (${taskDone}/${todayTasks.length}):\n${
    todayTasks.map((t, i) => `${i + 1}. ${t.text}`).join('\n') || '• All clear'
  }`;

  const latestJournal = journal[0];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">{greeting}</div>
          <h1 className="page-head__title">Good morning, Dennika ✦</h1>
        </div>
        <div className="row gap-md">
          <Pill tone="pink" mono>{taskDone}/{todayTasks.length} tasks</Pill>
          <Pill tone="mint" mono>{habitsCompleteToday}/{habitsToday.length} habits</Pill>
          <Pill tone="sun" mono>14-day streak 🔥</Pill>
        </div>
      </div>

      <div className="bento">
        <div className="card col-7">
          <CardHead
            title="This week's focus"
            sub="North star"
            right={<button className="btn btn--ghost"><Icon name="edit" size={14}/></button>}
          />
          <div className="focus-box">
            <div className="focus-box__label">North star</div>
            <div className="focus-box__text">
              {state.focus
                ? `"${state.focus}"`
                : <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: 18 }}>
                    Set your focus in the Week view →
                  </span>
              }
            </div>
          </div>
          <div className="mt-lg">
            <div className="row row--between" style={{ marginBottom: 8 }}>
              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>Today's checklist</div>
              <div className="text-mono fs-xs text-muted">{taskDone}/{todayTasks.length}</div>
            </div>
            {todayTasks.length === 0
              ? <div className="empty">No tasks for today — add some in Week view</div>
              : todayTasks.map(t => (
                <div key={t.id} className={cls('task', t.done && 'task--done')}>
                  <button
                    className={cls('task__check', t.done && 'task__check--done')}
                    onClick={(e) => toggleTask(t.id, e)}
                  >
                    {t.done && <Icon name="check" size={14} stroke={2.4}/>}
                  </button>
                  <span className="task__text">{t.text}</span>
                  <span className="task__meta">{t.day}</span>
                </div>
              ))
            }
          </div>
        </div>

        <div className="card col-5">
          <CardHead
            title="Today's agenda"
            sub={calendar.connected ? `${calendar.events.length} events` : 'Google Calendar'}
            right={
              calendar.connected === true
                ? <Pill tone="mint" mono>Live</Pill>
                : calendar.connected === false
                ? <Pill tone="lilac" mono>Not connected</Pill>
                : <Pill tone="lilac" mono>Loading…</Pill>
            }
          />
          {calendar.connected === false && (
            <div className="empty">Add a calendar URL in Themes &amp; settings →</div>
          )}
          {calendar.connected === true && calendar.events.length === 0 && (
            <div className="empty">No events today</div>
          )}
          {calendar.events.map(a => (
            <div key={a.id} className="agenda-item">
              <div className="agenda-time">{a.time}</div>
              <div className="agenda-bar" style={{ background: a.color }}/>
              <div>
                <div className="agenda-title">{a.title}</div>
                {a.meta && <div className="agenda-meta">{a.meta}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="card col-5">
          <CardHead title="How are you feeling?" sub="Today" />
          <div className="mood-grid">
            {MOOD_OPTIONS.map(opt => {
              const active = moodWeek[TODAY_IDX]?.emoji === opt.emoji;
              return (
                <button key={opt.id} className="mood-pick" onClick={() => setMoodToday(opt)}>
                  <span className={cls('mood-emoji', active && 'mood-emoji--active')}>{opt.emoji}</span>
                  <span className="mood-label">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-lg row gap-sm" style={{ flexWrap: 'wrap' }}>
            {moodWeek.map((m, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em' }}>{m.day}</div>
                <div style={{ fontSize: 22, height: 30, marginTop: 4 }}>{m.emoji || '·'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card col-7">
          <CardHead title="Daily habits" sub={`${habitsCompleteToday} of ${habitsToday.length} done today`} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {habitsToday.length === 0
              ? <div className="empty">No habits yet — add some in Habits view</div>
              : habitsToday.map(h => {
                const log = habitLogs[h.id] || Array(7).fill(false);
                const done = log[TODAY_IDX];
                const weekCount = log.filter(Boolean).length;
                return (
                  <div key={h.id} className="row" style={{ padding: '6px 0', borderBottom: '1px dashed var(--line)' }}>
                    <span className="habit-row__icon" style={{ background: h.bg, color: h.color }}>{h.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{h.label}</div>
                      <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.08em', marginTop: 2 }}>
                        {weekCount}/{h.goal} this week
                      </div>
                    </div>
                    <button
                      className={cls('task__check', done && 'task__check--done')}
                      onClick={(e) => toggleHabit(h.id, e)}
                      style={done ? { background: h.color, borderColor: h.color } : {}}
                    >
                      {done && <Icon name="check" size={14} stroke={2.4}/>}
                    </button>
                  </div>
                );
              })
            }
          </div>
        </div>

        {state.show.briefing && (
          <div className="card card--pink col-4">
            <CardHead title="Morning briefing" sub="8:00 am · iMessage" right={<Pill tone="pink" mono>Preview</Pill>} />
            <div className="phone">
              <div className="phone__notch"/>
              <div className="phone__time">Today · 8:00 am</div>
              <div className="phone__handle">Dennika's Dashboard</div>
              <div className="phone__bubble">{briefingMsg}</div>
            </div>
          </div>
        )}

        <div className={cls('card', state.show.briefing ? 'col-4' : 'col-6')}>
          <CardHead title="Movement this week" sub={`${gymWeek.filter(g => g.done).length}/5 goal`} />
          <div className="gym-grid">
            {gymWeek.map((g, i) => (
              <div key={i} className={cls('gym-cell', g.done && 'gym-cell--done', g.rest && 'gym-cell--rest')}>
                <span className="gym-cell__day">{g.day}</span>
                <span className="gym-cell__icon">{g.rest ? '☁︎' : g.done ? '✓' : '·'}</span>
                <span style={{ fontSize: 9, marginTop: 2 }}>{g.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cls('card card--lilac', state.show.briefing ? 'col-4' : 'col-6')}>
          <CardHead
            title="Parking lot"
            sub="Ideas to come back to"
            right={
              <button
                className="btn btn--icon"
                onClick={() => setState(s => ({ ...s, parking: ['New idea', ...s.parking] }))}
              >
                <Icon name="plus" size={14}/>
              </button>
            }
          />
          <div className="col gap-sm">
            {parking.slice(0, 4).map((p, i) => (
              <div key={i} className="idea-chip">
                <span className="idea-chip__bullet"/>
                <span>{p}</span>
              </div>
            ))}
            {parking.length === 0 && <div className="empty">Nothing parked yet</div>}
          </div>
        </div>

        {latestJournal && (
          <div className="card col-12 card--tinted">
            <CardHead
              title="From your journal"
              sub={latestJournal.date}
              right={<button className="btn btn--ghost" onClick={() => setState(s => ({ ...s, page: 'journal' }))}>Open journal →</button>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start' }}>
              <div style={{ fontSize: 56, lineHeight: 1 }}>{latestJournal.mood}</div>
              <div>
                <h4 className="text-serif" style={{ fontSize: 26, margin: '0 0 8px' }}>{latestJournal.title}</h4>
                <p className="text-soft" style={{ margin: 0, lineHeight: 1.65 }}>{latestJournal.body?.split('\n\n')[0]}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
