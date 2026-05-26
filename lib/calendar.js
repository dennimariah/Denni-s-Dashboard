async function fetchICalText(url) {
  const clean = url.replace(/^webcal:\/\//, 'https://');
  const res = await fetch(clean);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function unfold(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n[ \t]/g, '');
}

function parseICalText(text) {
  const lines = unfold(text).split('\n');
  const events = [];
  let ev = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { ev = {}; continue; }
    if (line === 'END:VEVENT') { if (ev) events.push(ev); ev = null; continue; }
    if (!ev) continue;
    const ci = line.indexOf(':');
    if (ci < 1) continue;
    const keyFull = line.slice(0, ci);
    const val = line.slice(ci + 1);
    const si = keyFull.indexOf(';');
    const key = (si < 0 ? keyFull : keyFull.slice(0, si)).toUpperCase();
    const params = si < 0 ? '' : keyFull.slice(si + 1);
    ev[key] = { val, params };
  }
  return events;
}

function parseTzDatetime(y, mo, d, h, mi, s, tz) {
  try {
    const guess = new Date(Date.UTC(y, mo, d, h, mi, s));
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).formatToParts(guess);
    const p = {};
    parts.forEach(x => { p[x.type] = x.value; });
    const hr = p.hour === '24' ? 0 : +p.hour;
    const shown = Date.UTC(+p.year, +p.month - 1, +p.day, hr, +p.minute, +p.second);
    return new Date(2 * guess.getTime() - shown);
  } catch {
    return new Date(Date.UTC(y, mo, d, h, mi, s));
  }
}

function parseICalDate(val, params) {
  if (!val) return null;
  const isAllDay = params.includes('VALUE=DATE') || val.length === 8;
  if (isAllDay) {
    return { date: new Date(Date.UTC(+val.slice(0,4), +val.slice(4,6)-1, +val.slice(6,8))), allDay: true };
  }
  const [y, mo, d, h, mi, s] = [+val.slice(0,4), +val.slice(4,6)-1, +val.slice(6,8), +val.slice(9,11), +val.slice(11,13), +val.slice(13,15)||0];
  const isUtc = val.endsWith('Z');
  const tzid = params.match(/TZID=([^;]+)/)?.[1];
  let date;
  if (isUtc) date = new Date(Date.UTC(y, mo, d, h, mi, s));
  else if (tzid) date = parseTzDatetime(y, mo, d, h, mi, s, tzid);
  else date = new Date(Date.UTC(y, mo, d, h, mi, s));
  return { date, allDay: false };
}

function etDateStr(date, allDay) {
  if (allDay) {
    const y = date.getUTCFullYear(), m = date.getUTCMonth() + 1, d = date.getUTCDate();
    return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
  const s = date.toLocaleDateString('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const [mo, d, y] = s.split('/');
  return `${y}-${mo}-${d}`;
}

function rruleOccursOnDate(dtstart, rruleStr, targetStr) {
  const parts = {};
  rruleStr.split(';').forEach(p => { const [k, v] = p.split('='); parts[k] = v; });
  const freq = parts.FREQ;
  const interval = parseInt(parts.INTERVAL || '1');
  const target = new Date(targetStr + 'T12:00:00Z');
  const start = new Date(dtstart);
  if (start > target) return false;
  if (parts.UNTIL) {
    const u = parseICalDate(parts.UNTIL, '');
    if (u && target > u.date) return false;
  }
  const DAY_NAMES = ['SU','MO','TU','WE','TH','FR','SA'];
  const targetDow = new Date(target.toLocaleString('en-US', { timeZone: 'America/New_York' })).getDay();
  const startDow = new Date(start.toLocaleString('en-US', { timeZone: 'America/New_York' })).getDay();
  const diffMs = target - new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const diffDays = Math.round(diffMs / 86400000);
  if (freq === 'DAILY') return diffDays >= 0 && diffDays % interval === 0;
  if (freq === 'WEEKLY') {
    const byday = parts.BYDAY ? parts.BYDAY.split(',') : [DAY_NAMES[startDow]];
    if (!byday.includes(DAY_NAMES[targetDow])) return false;
    return Math.floor(diffDays / 7) % interval === 0;
  }
  if (freq === 'MONTHLY') {
    if (start.getUTCDate() !== target.getUTCDate()) return false;
    const diffMonths = (target.getUTCFullYear() - start.getUTCFullYear()) * 12 + (target.getUTCMonth() - start.getUTCMonth());
    return diffMonths >= 0 && diffMonths % interval === 0;
  }
  if (freq === 'YEARLY') {
    return start.getUTCMonth() === target.getUTCMonth() && start.getUTCDate() === target.getUTCDate();
  }
  return false;
}

function getEventsForDate(rawEvents, dateStr) {
  const results = [];
  for (const ev of rawEvents) {
    if (!ev.DTSTART) continue;
    const parsed = parseICalDate(ev.DTSTART.val, ev.DTSTART.params);
    if (!parsed) continue;
    const { date, allDay } = parsed;
    const occurs = ev.RRULE
      ? rruleOccursOnDate(date, ev.RRULE.val, dateStr)
      : etDateStr(date, allDay) === dateStr;
    if (!occurs) continue;
    const occDate = ev.RRULE
      ? new Date(new Date(dateStr + 'T00:00:00Z').getTime() + date.getUTCHours() * 3600000 + date.getUTCMinutes() * 60000)
      : date;
    results.push({
      id: `${ev.UID?.val || Math.random()}-${occDate.getTime()}`,
      title: ev.SUMMARY?.val || '(No title)',
      time: allDay ? 'All day' : occDate.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
      }),
      color: 'var(--primary)',
      meta: ev.LOCATION?.val || '',
      sortTime: allDay ? -1 : occDate.getTime(),
    });
  }
  return results.sort((a, b) => a.sortTime - b.sortTime);
}

function todayStr() {
  const now = new Date();
  const s = now.toLocaleDateString('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const [mo, d, y] = s.split('/');
  return `${y}-${mo}-${d}`;
}

// Returns { connected, events } for today
export async function fetchCalendarEvents(calendarUrls = []) {
  if (!calendarUrls?.length) return { connected: false, events: [] };
  const today = todayStr();
  const allEvents = [];
  for (const cal of calendarUrls) {
    try {
      const text = await fetchICalText(cal.url);
      getEventsForDate(parseICalText(text), today).forEach(e => allEvents.push(e));
    } catch (err) {
      console.error(`Calendar "${cal.label}":`, err.message);
    }
  }
  allEvents.sort((a, b) => a.sortTime - b.sortTime);
  return { connected: true, events: allEvents };
}

// Returns { connected, eventsByDate: { 'YYYY-MM-DD': events[] } } for a list of date strings
export async function fetchCalendarEventsByDates(calendarUrls = [], dateStrs = []) {
  if (!calendarUrls?.length) return { connected: false, eventsByDate: {} };
  const eventsByDate = {};
  dateStrs.forEach(d => { eventsByDate[d] = []; });

  for (const cal of calendarUrls) {
    try {
      const text = await fetchICalText(cal.url);
      const raw = parseICalText(text);
      for (const dateStr of dateStrs) {
        getEventsForDate(raw, dateStr).forEach(e => eventsByDate[dateStr].push(e));
      }
    } catch (err) {
      console.error(`Calendar "${cal.label}":`, err.message);
    }
  }

  return { connected: true, eventsByDate };
}
