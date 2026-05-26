import { getDb } from '@/lib/db';
import { getDefaultState } from '@/lib/defaultData';

const USER_ID = 'dennika';

export async function GET() {
  try {
    const sql = getDb();
    await sql`
      CREATE TABLE IF NOT EXISTS dashboard_data (
        user_id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    const rows = await sql`SELECT data FROM dashboard_data WHERE user_id = ${USER_ID}`;
    if (rows.length === 0) {
      return Response.json(getDefaultState());
    }
    return Response.json({ ...getDefaultState(), ...rows[0].data });
  } catch (err) {
    console.error('GET /api/data error:', err);
    return Response.json(getDefaultState());
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const sql = getDb();
    await sql`
      INSERT INTO dashboard_data (user_id, data, updated_at)
      VALUES (${USER_ID}, ${JSON.stringify(data)}, NOW())
      ON CONFLICT (user_id) DO UPDATE
        SET data = ${JSON.stringify(data)}, updated_at = NOW()
    `;
    return Response.json({ ok: true });
  } catch (err) {
    console.error('POST /api/data error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
