import { getDb } from '@/lib/db';
import { getDefaultState } from '@/lib/defaultData';

const USER_ID = 'dennika';

export async function POST(request) {
  try {
    const body = await request.json();

    // Handle Health Auto Export format: { data: { workouts: [...] } }
    // or simple format: { type, duration, calories, heartRate, date }
    const workoutsRaw = body?.data?.workouts;
    const entries = workoutsRaw
      ? workoutsRaw.map(w => ({
          type: (w.workoutActivityType || '').replace('HKWorkoutActivityType', '') || 'Workout',
          duration: Math.round(Number(w.duration) || 0),
          calories: Math.round(Number(w.totalEnergyBurned) || 0),
          heartRate: w.averageHeartRate ? Math.round(Number(w.averageHeartRate)) : null,
          date: w.startDate ? w.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
          loggedAt: new Date().toISOString(),
        }))
      : [{
          type: body.type || 'Workout',
          duration: Math.round(Number(body.duration) || 0),
          calories: Math.round(Number(body.calories) || 0),
          heartRate: body.heartRate ? Math.round(Number(body.heartRate)) : null,
          date: body.date || new Date().toISOString().slice(0, 10),
          loggedAt: new Date().toISOString(),
        }];

    const entry = entries[0];

    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS dashboard_data (
        user_id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const rows = await sql`SELECT data FROM dashboard_data WHERE user_id = ${USER_ID}`;
    const current = rows.length > 0 ? rows[0].data : getDefaultState();

    const fitness = current.fitness || getDefaultState().fitness;
    const watchWorkouts = [...(fitness.watchWorkouts || []), ...entries];

    const updated = {
      ...current,
      fitness: { ...fitness, watchWorkouts },
    };

    await sql`
      INSERT INTO dashboard_data (user_id, data, updated_at)
      VALUES (${USER_ID}, ${JSON.stringify(updated)}, NOW())
      ON CONFLICT (user_id) DO UPDATE
        SET data = ${JSON.stringify(updated)}, updated_at = NOW()
    `;

    return Response.json({ ok: true, entry });
  } catch (err) {
    console.error('POST /api/fitness/watch error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
