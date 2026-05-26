import { getDb } from '@/lib/db';
import { getDefaultState } from '@/lib/defaultData';
import { fetchCalendarEvents, fetchCalendarEventsByDates } from '@/lib/calendar';

async function getCalendarUrls() {
  const sql = getDb();
  const rows = await sql`SELECT data FROM dashboard_data WHERE user_id = 'dennika'`;
  const data = rows.length > 0 ? { ...getDefaultState(), ...rows[0].data } : getDefaultState();
  return data.calendarUrls || [];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dates = searchParams.get('dates'); // comma-separated YYYY-MM-DD list
    const urls = await getCalendarUrls();

    if (dates) {
      const dateList = dates.split(',').filter(Boolean);
      return Response.json(await fetchCalendarEventsByDates(urls, dateList));
    }

    return Response.json(await fetchCalendarEvents(urls));
  } catch (err) {
    console.error('Calendar route error:', err);
    return Response.json({ connected: false, events: [] });
  }
}
