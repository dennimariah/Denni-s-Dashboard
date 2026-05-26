import { getDb } from '@/lib/db';
import { getDefaultState } from '@/lib/defaultData';

const USER_ID = 'dennika';

export async function POST(request) {
  try {
    const body = await request.json();

    // Health Auto Export format: { data: { sleep: [...] } }
    // Each entry has startDate, endDate, value (INBED, ASLEEP, AWAKE, etc.)
    const sleepRaw = body?.data?.sleep;

    let entries = [];

    if (sleepRaw && sleepRaw.length > 0) {
      // Group by date, sum ASLEEP duration
      const byDate = {};
      for (const s of sleepRaw) {
        if (!s.startDate || !s.endDate) continue;
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        const date = start.toISOString().slice(0, 10);
        const hours = (end - start) / 1000 / 3600;
        if (!byDate[date]) byDate[date] = { inBed: 0, asleep: 0 };
        if (s.value === 'INBED') byDate[date].inBed += hours;
        if (s.value === 'ASLEEP' || s.value === 'CORE' || s.value === 'DEEP' || s.value === 'REM') byDate[date].asleep += hours;
      }
      entries = Object.entries(byDate).map(([date, d]) => ({
        id: `sl-watch-${date}`,
        date,
        hours: Math.round((d.asleep || d.inBed) * 10) / 10,
        quality: 3,
        notes: 'Auto-logged from Apple Watch',
        source: 'watch',
      })).filter(e => e.hours > 0);
    } else {
      // Simple format: { date, hours, quality }
      entries = [{
        id: `sl-${Date.now()}`,
        date: body.date || new Date().toISOString().slice(0, 10),
        hours: Math.round(Number(body.hours) * 10) / 10 || 0,
        quality: body.quality || 3,
        notes: body.notes || '',
      }];
    }

    if (entries.length === 0) return Response.json({ ok: false, error: 'No valid sleep data' }, { status: 400 });

    const sql = getDb();
    await sql`CREATE TABLE IF NOT EXISTS dashboard_data (user_id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW())`;

    const rows = await sql`SELECT data FROM dashboard_data WHERE user_id = ${USER_ID}`;
    const current = rows.length > 0 ? rows[0].data : getDefaultState();
    const fitness = current.fitness || getDefaultState().fitness;

    const existingLog = fitness.sleepLog || [];
    const newDates = new Set(entries.map(e => e.date));
    const merged = [...existingLog.filter(e => !newDates.has(e.date)), ...entries];

    const updated = { ...current, fitness: { ...fitness, sleepLog: merged } };
    await sql`INSERT INTO dashboard_data (user_id, data, updated_at) VALUES (${USER_ID}, ${JSON.stringify(updated)}, NOW()) ON CONFLICT (user_id) DO UPDATE SET data = ${JSON.stringify(updated)}, updated_at = NOW()`;

    return Response.json({ ok: true, entries });
  } catch (err) {
    console.error('POST /api/fitness/sleep error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
