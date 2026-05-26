import { getDefaultState } from '@/lib/defaultData';
import { getDb } from '@/lib/db';
import PinGate from '@/components/PinGate';
import Dashboard from '@/components/Dashboard';

async function getData() {
  try {
    const sql = getDb();
    await sql`
      CREATE TABLE IF NOT EXISTS dashboard_data (
        user_id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    const rows = await sql`SELECT data FROM dashboard_data WHERE user_id = 'dennika'`;
    if (rows.length === 0) return getDefaultState();
    return { ...getDefaultState(), ...rows[0].data };
  } catch (err) {
    console.error('getData error:', err);
    return getDefaultState();
  }
}

export default async function Page() {
  const initialData = await getData();
  return (
    <PinGate>
      <Dashboard initialData={initialData} />
    </PinGate>
  );
}
