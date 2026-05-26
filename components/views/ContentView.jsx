'use client';

import { useState } from 'react';
import { cls } from '@/lib/helpers';
import { CardHead, Pill, Editable } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

const formats = ['Newsletter', 'TikTok', 'Instagram', 'Blog', 'Podcast', 'Video'];
const statuses = ['Idea', 'Drafting', 'Scheduled', 'Published'];

const formatColor = {
  Newsletter: { bg: 'var(--primary-soft)',  text: 'var(--primary-deep)', accent: 'var(--primary)'  },
  TikTok:     { bg: 'var(--accent-3-soft)', text: '#5e4b85',             accent: 'var(--accent-3)' },
  Instagram:  { bg: 'var(--accent-1-soft)', text: '#8b4f1c',             accent: 'var(--accent-1)' },
  Blog:       { bg: 'var(--accent-2-soft)', text: '#3d6b4f',             accent: 'var(--accent-2)' },
  Podcast:    { bg: 'var(--accent-4-soft)', text: '#8a6a16',             accent: 'var(--accent-4)' },
  Video:      { bg: 'var(--primary-soft)',  text: 'var(--primary-deep)', accent: 'var(--primary)'  },
};

const statusColor = {
  Idea:      'var(--accent-3)',
  Drafting:  'var(--accent-1)',
  Scheduled: 'var(--accent-4)',
  Published: 'var(--accent-2)',
};

export default function ContentView({ state, setState }) {
  const { content } = state;
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [draftOpen, setDraftOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', format: 'Newsletter', status: 'Idea', notes: '' });

  const counts = {
    Idea:      content.filter((c) => c.status === 'Idea').length,
    Drafting:  content.filter((c) => c.status === 'Drafting').length,
    Scheduled: content.filter((c) => c.status === 'Scheduled').length,
    Published: content.filter((c) => c.status === 'Published').length,
  };

  const updateItem = (id, patch) => {
    setState((s) => ({ ...s, content: s.content.map((c) => c.id === id ? { ...c, ...patch } : c) }));
  };

  const removeItem = (id) => {
    setState((s) => ({ ...s, content: s.content.filter((c) => c.id !== id) }));
  };

  const cycleStatus = (id) => {
    const item = content.find((c) => c.id === id);
    const idx = statuses.indexOf(item.status);
    const next = statuses[(idx + 1) % statuses.length];
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    updateItem(id, { status: next, ...(next === 'Published' ? { publishedAt: today } : {}) });
  };

  const saveDraft = () => {
    if (!draft.title.trim()) return;
    setState((s) => ({
      ...s,
      content: [{ id: 'c' + Date.now(), starred: false, tags: [], ...draft }, ...s.content],
    }));
    setDraft({ title: '', format: 'Newsletter', status: 'Idea', notes: '' });
    setDraftOpen(false);
  };

  const toggleStar = (id) => {
    const item = content.find((c) => c.id === id);
    updateItem(id, { starred: !item.starred });
  };

  const now = new Date();
  const qNum = Math.floor(now.getMonth() / 3) + 1;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Content · Q{qNum} plan</div>
          <h1 className="page-head__title">Things to make</h1>
          <div className="page-head__date mt-sm">
            {content.length} pieces in flight · {counts.Published} published this month
          </div>
        </div>
        <div className="row gap-md">
          <button className="btn btn--pink" onClick={() => setDraftOpen(true)}>
            <Icon name="plus" size={14} /> Capture idea
          </button>
        </div>
      </div>

      {/* Stage counters */}
      <div className="bento" style={{ marginBottom: 0 }}>
        {statuses.map((st) => (
          <button
            key={st}
            className="card col-3"
            style={{
              borderColor: filterStatus === st ? statusColor[st] : 'var(--line)',
              borderWidth: filterStatus === st ? 2 : 1,
              background: filterStatus === st ? 'var(--card-2)' : 'var(--card)',
              cursor: 'pointer',
              padding: 18,
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
            onClick={() => setFilterStatus(filterStatus === st ? 'all' : st)}
          >
            <div className="row row--between" style={{ marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor[st] }} />
              <span className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.1em' }}>{counts[st]} items</span>
            </div>
            <div className="text-serif" style={{ fontSize: 28, color: 'var(--ink)', lineHeight: 1 }}>{counts[st]}</div>
            <div className="text-mono fs-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: statusColor[st], marginTop: 4, fontWeight: 600 }}>{st}</div>
          </button>
        ))}
      </div>

      {/* Format filters */}
      <div className="row gap-sm" style={{ flexWrap: 'wrap', margin: '16px 0' }}>
        {['all', ...formats].map((f) => (
          <button
            key={f}
            className="pill pill--mono"
            style={{
              cursor: 'pointer',
              background: filterFormat === f ? 'var(--primary)' : 'var(--card)',
              color: filterFormat === f ? 'white' : 'var(--ink-soft)',
              border: filterFormat === f ? '1px solid var(--primary)' : '1px solid var(--line)',
            }}
            onClick={() => setFilterFormat(f)}
          >
            {f}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <Pill tone="lilac" mono>
          {content.filter((c) =>
            (filterStatus === 'all' || c.status === filterStatus) &&
            (filterFormat === 'all' || c.format === filterFormat)
          ).length} showing
        </Pill>
      </div>

      {/* Kanban board */}
      <div className="bento">
        {statuses.map((st) => {
          const items = content
            .filter((c) => c.status === st)
            .filter((c) => filterStatus === 'all' || c.status === filterStatus)
            .filter((c) => filterFormat === 'all' || c.format === filterFormat);
          return (
            <div key={st} className="card col-3" style={{ minHeight: 360, background: 'var(--card-2)', padding: 16 }}>
              <div className="row row--between" style={{ marginBottom: 14 }}>
                <div className="row gap-sm">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[st] }} />
                  <span className="text-mono fs-xs" style={{ letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', fontWeight: 600 }}>{st}</span>
                </div>
                <span className="text-mono fs-xs text-muted">{items.length}</span>
              </div>

              <div className="col gap-sm">
                {items.length === 0 && (
                  <div className="empty" style={{ padding: '20px 0', border: '1.5px dashed var(--line)', borderRadius: 12 }}>
                    empty · capture one
                  </div>
                )}
                {items.map((c) => {
                  const fc = formatColor[c.format] || formatColor.Newsletter;
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--line)',
                        borderLeft: `3px solid ${fc.accent}`,
                        borderRadius: 12,
                        padding: 12,
                      }}
                    >
                      <div className="row row--between" style={{ marginBottom: 6, alignItems: 'flex-start' }}>
                        <span className="pill pill--mono" style={{ background: fc.bg, color: fc.text, border: 'none', fontSize: 9 }}>
                          {c.format}
                        </span>
                        <button
                          className="btn btn--ghost"
                          style={{ padding: 2, color: c.starred ? 'var(--primary)' : 'var(--muted)', fontSize: 14, lineHeight: 1 }}
                          onClick={() => toggleStar(c.id)}
                          title="Star"
                        >
                          {c.starred ? '★' : '☆'}
                        </button>
                      </div>
                      <Editable
                        value={c.title}
                        onChange={(v) => updateItem(c.id, { title: v })}
                        style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.3 }}
                      />
                      {c.notes && (
                        <Editable
                          value={c.notes}
                          onChange={(v) => updateItem(c.id, { notes: v })}
                          style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.4 }}
                          multiline
                        />
                      )}
                      {c.tags && c.tags.length > 0 && (
                        <div className="row gap-sm" style={{ marginTop: 8, flexWrap: 'wrap', gap: 4 }}>
                          {c.tags.map((tag, i) => (
                            <span key={i} className="pill pill--mono" style={{ fontSize: 9, padding: '2px 7px' }}>#{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="row row--between" style={{ marginTop: 10 }}>
                        <button
                          className="btn btn--ghost"
                          style={{ padding: '4px 8px', fontSize: 11, color: statusColor[st] }}
                          onClick={() => cycleStatus(c.id)}
                        >
                          {st === 'Published' ? '↻ Reset' : '→ Move'}
                        </button>
                        {c.publishedAt && (
                          <span className="text-mono fs-xs text-muted">{c.publishedAt}</span>
                        )}
                        <button
                          className="btn btn--ghost"
                          style={{ padding: 2, color: 'var(--muted)' }}
                          onClick={() => removeItem(c.id)}
                          title="Delete"
                        >
                          <Icon name="x" size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Capture modal */}
      {draftOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(58,29,40,0.42)', zIndex: 60, display: 'grid', placeItems: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={() => setDraftOpen(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 480, width: '100%', padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: 6, background: 'var(--primary)' }} />
            <div style={{ padding: 22 }}>
              <div className="row row--between" style={{ alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>Quick capture</div>
                  <h3 className="text-serif" style={{ fontSize: 30, margin: '4px 0 0', lineHeight: 1.1 }}>New idea</h3>
                </div>
                <button className="btn btn--icon" onClick={() => setDraftOpen(false)}><Icon name="x" size={14} /></button>
              </div>

              <input
                placeholder="What's the idea?"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                style={{ width: '100%', border: 0, background: 'var(--card-2)', borderRadius: 12, padding: '12px 14px', fontSize: 16, outline: 'none', marginBottom: 12 }}
                autoFocus
              />

              <textarea
                placeholder="Notes, angle, hook…"
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                style={{ width: '100%', border: 0, background: 'var(--card-2)', borderRadius: 12, padding: '12px 14px', fontSize: 13.5, lineHeight: 1.55, outline: 'none', minHeight: 80, resize: 'vertical', marginBottom: 16 }}
              />

              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Format</div>
              <div className="row gap-sm" style={{ flexWrap: 'wrap', marginBottom: 14 }}>
                {formats.map((f) => (
                  <button
                    key={f}
                    className="pill pill--mono"
                    style={{
                      cursor: 'pointer',
                      background: draft.format === f ? formatColor[f].accent : 'var(--card-2)',
                      color: draft.format === f ? 'white' : 'var(--ink-soft)',
                      border: '1px solid ' + (draft.format === f ? formatColor[f].accent : 'var(--line)'),
                    }}
                    onClick={() => setDraft((d) => ({ ...d, format: f }))}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="text-mono fs-xs text-muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Status</div>
              <div className="row gap-sm" style={{ flexWrap: 'wrap', marginBottom: 18 }}>
                {statuses.map((st) => (
                  <button
                    key={st}
                    className="pill pill--mono"
                    style={{
                      cursor: 'pointer',
                      background: draft.status === st ? statusColor[st] : 'var(--card-2)',
                      color: draft.status === st ? 'white' : 'var(--ink-soft)',
                      border: '1px solid ' + (draft.status === st ? statusColor[st] : 'var(--line)'),
                    }}
                    onClick={() => setDraft((d) => ({ ...d, status: st }))}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="row row--between">
                <div className="text-mono fs-xs text-muted">⌘ + Enter to save</div>
                <div className="row gap-sm">
                  <button className="btn btn--ghost" onClick={() => setDraftOpen(false)}>Cancel</button>
                  <button className="btn btn--pink" onClick={saveDraft}><Icon name="check" size={14} /> Capture</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
