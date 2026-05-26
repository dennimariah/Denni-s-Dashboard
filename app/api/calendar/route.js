import { getDb } from '@/lib/db';
import { getDefaultState } from '@/lib/defaultData';
import { fetchCalendarEvents } from '@/lib/calendar';

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`SELECT data FROM dashboard_data WHERE user_id = 'dennika'`;
    const data = rows.length > 0 ? { ...getDefaultState(), ...rows[0].data } : getDefaultState();
    return Response.json(await fetchCalendarEvents(data.calendarUrls || []));
  } catch (err) {
    console.error('Calendar route error:', err);
    return Response.json({ connected: false, events: [] });
  }
}
