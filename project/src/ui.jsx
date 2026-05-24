// Shared small UI primitives: icons, cards, tags
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ----- Icons (inline svg, stroked, all share consistent style) -----
const Icon = ({ name, size = 18, stroke = 1.6 }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
              stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "home":   return <svg {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case "check":  return <svg {...p}><path d="M5 12l4 4 10-10"/></svg>;
    case "plus":   return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus":  return <svg {...p}><path d="M5 12h14"/></svg>;
    case "arrow-l": return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case "arrow-r": return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case "habit":  return <svg {...p}><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>;
    case "week":   return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 11h18"/></svg>;
    case "quarter":return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3"/></svg>;
    case "money":  return <svg {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>;
    case "book":   return <svg {...p}><path d="M4 4h7a3 3 0 0 1 3 3v13M20 4h-7a3 3 0 0 0-3 3v13"/></svg>;
    case "spark":  return <svg {...p}><path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/><path d="M5 18l.7 1.7L7 20l-1.3.3L5 22l-.7-1.7L3 20l1.3-.3z"/></svg>;
    case "heart":  return <svg {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>;
    case "moon":   return <svg {...p}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8z"/></svg>;
    case "dumbbell": return <svg {...p}><path d="M3 12h2M19 12h2M6 8v8M18 8v8M9 6v12M15 6v12"/></svg>;
    case "chef":   return <svg {...p}><path d="M8 11a4 4 0 1 1 8 0v8H8z"/><path d="M9 14h6"/></svg>;
    case "leaf":   return <svg {...p}><path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 14-9 0 7-3 14-9 14"/><path d="M2 22l7-7"/></svg>;
    case "phone":  return <svg {...p}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>;
    case "edit":   return <svg {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2 2 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>;
    case "trash":  return <svg {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>;
    case "x":      return <svg {...p}><path d="M6 6l12 12M18 6l-12 12"/></svg>;
    case "star":   return <svg {...p}><path d="M12 3l2.6 5.7 6.3.6-4.7 4.4 1.3 6.3L12 17l-5.5 3 1.3-6.3L3 9.3l6.3-.6z"/></svg>;
    case "circle": return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>;
    case "settings": return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.4l2-1.5-2-3.4-2.4.8a7 7 0 0 0-2.4-1.4L13.5 2h-3l-.6 2.6a7 7 0 0 0-2.4 1.4L5 5.2 3 8.6l2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.4l-2 1.5 2 3.4 2.4-.8a7 7 0 0 0 2.4 1.4L10.5 22h3l.6-2.6a7 7 0 0 0 2.4-1.4l2.4.8 2-3.4-2-1.5A7 7 0 0 0 19 12z"/></svg>;
    case "sparkle":return <svg {...p}><path d="M5 3l1.5 3.5L10 8l-3.5 1.5L5 13l-1.5-3.5L0 8l3.5-1.5z" transform="translate(7 4)"/></svg>;
    case "fire":   return <svg {...p}><path d="M12 2s4 4 4 9a4 4 0 0 1-8 0c0-2 1-3 1-3s2 1 2 4"/></svg>;
    default: return null;
  }
};

// Sidebar nav button
const NavItem = ({ id, label, icon, active, badge, onClick }) => (
  <button
    className={cls("sidebar__item", active && "sidebar__item--active")}
    onClick={() => onClick(id)}
  >
    <span className="sidebar__item-icon"><Icon name={icon} /></span>
    <span>{label}</span>
    {badge != null && <span className="sidebar__item-badge">{badge}</span>}
  </button>
);

// Editable inline text
const Editable = ({ value, onChange, placeholder = "", style = {}, multiline = false }) => {
  if (multiline) {
    return (
      <textarea
        className="editable"
        value={value}
        placeholder={placeholder}
        rows={Math.max(2, value.split("\n").length)}
        style={{ resize: "none", ...style }}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      className="editable"
      value={value}
      placeholder={placeholder}
      style={style}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

// Confetti burst at coords (x, y), called by tasks/habits on completion
function burstConfetti(x, y) {
  const colors = ["#e8527a", "#f4a261", "#88b896", "#b39bd8", "#f7c548"];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.background = colors[i % colors.length];
    const angle = (i / 16) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    el.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    el.style.setProperty("--ty", (Math.sin(angle) * dist + 100) + "px");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
  // tiny pop via WebAudio
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.18);
  } catch (e) {}
}

// Reusable card head
const CardHead = ({ title, sub, right }) => (
  <div className="card__head">
    <div>
      <h3 className="card__title">{title}</h3>
      {sub && <div className="card__sub mt-sm">{sub}</div>}
    </div>
    {right}
  </div>
);

const Bar = ({ value, max = 100, color }) => (
  <div className="bar">
    <div className="bar__fill" style={{
      width: Math.min(100, (value / max) * 100) + "%",
      ...(color ? { background: color } : {})
    }}/>
  </div>
);

const Pill = ({ tone = "pink", mono = false, children }) => (
  <span className={cls("pill", `pill--${tone}`, mono && "pill--mono")}>{children}</span>
);

Object.assign(window, { Icon, NavItem, Editable, burstConfetti, CardHead, Bar, Pill });
