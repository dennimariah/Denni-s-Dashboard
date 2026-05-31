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
    const defaults = getDefaultState();
    const saved = rows[0].data;
    // For array fields seeded with defaults, don't overwrite with empty arrays from old saves
    const merged = { ...defaults, ...saved };
    if (!saved.quarterGoals?.length) merged.quarterGoals = defaults.quarterGoals;
    if (!saved.habits?.length) merged.habits = defaults.habits;
    if (!saved.travelTrips?.length) merged.travelTrips = defaults.travelTrips;
    if (!saved.travelPackingTemplates?.length) merged.travelPackingTemplates = defaults.travelPackingTemplates;
    if ((saved.devotionAffirmations?.length || 0) < 25) merged.devotionAffirmations = defaults.devotionAffirmations;
    // Seed content if empty
    if (!saved.content?.length) merged.content = defaults.content;
    // Forward new goal fields (silkCollective, successCriteria) onto existing saved goals
    if (saved.quarterGoals?.length) {
      const defaultGoalMap = Object.fromEntries(defaults.quarterGoals.map(g => [g.id, g]));
      merged.quarterGoals = saved.quarterGoals.map(g => ({
        silkCollective: defaultGoalMap[g.id]?.silkCollective || false,
        successCriteria: defaultGoalMap[g.id]?.successCriteria || '',
        ...g,
      }));
    }
    // Ensure new top-level keys exist
    if (!saved.todayMood) merged.todayMood = {};
    if (!saved.quickTasks) merged.quickTasks = [];
    return Response.json(merged);
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
