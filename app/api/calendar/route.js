import { getDb } from '@/lib/db';

async function getAccessToken(refreshToken) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  try {
    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        user_id TEXT PRIMARY KEY,
        refresh_token TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const rows = await sql`SELECT refresh_token FROM auth_tokens WHERE user_id = 'dennika'`;
    if (rows.length === 0) {
      return Response.json({ connected: false, events: [] });
    }

    const accessToken = await getAccessToken(rows[0].refresh_token);
    if (!accessToken) {
      return Response.json({ connected: false, events: [] });
    }

    const now = new Date();
    const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const startOfDay = new Date(etNow.getFullYear(), etNow.getMonth(), etNow.getDate());
    const endOfDay = new Date(etNow.getFullYear(), etNow.getMonth(), etNow.getDate() + 1);

    const params = new URLSearchParams({
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '10',
    });

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const data = await res.json();
    const events = (data.items || []).map(event => ({
      id: event.id,
      title: event.summary || '(No title)',
      time: event.start?.dateTime
        ? new Date(event.start.dateTime).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
          })
        : 'All day',
      color: 'var(--primary)',
      meta: event.location || '',
    }));

    return Response.json({ connected: true, events });
  } catch (err) {
    console.error('Calendar fetch error:', err);
    return Response.json({ connected: false, events: [], error: err.message });
  }
}
