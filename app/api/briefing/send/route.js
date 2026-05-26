import { getDb } from '@/lib/db';
import { getDefaultState } from '@/lib/defaultData';
import { sendMorningBriefing } from '@/lib/sms';

async function getUserData() {
  try {
    const sql = getDb();
    const rows = await sql`SELECT data FROM dashboard_data WHERE user_id = 'dennika'`;
    if (rows.length === 0) return getDefaultState();
    return { ...getDefaultState(), ...rows[0].data };
  } catch {
    return getDefaultState();
  }
}

// Called by Vercel cron daily
export async function GET(request) {
  const auth = request.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await getUserData();
    const msg = await sendMorningBriefing(data);
    return Response.json({ ok: true, sid: msg.sid });
  } catch (err) {
    console.error('Briefing send error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// Called by the dashboard "Send test" button
export async function POST() {
  try {
    const data = await getUserData();
    const msg = await sendMorningBriefing(data);
    return Response.json({ ok: true, sid: msg.sid });
  } catch (err) {
    console.error('Briefing send error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
