import { getDb } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return Response.redirect(`${process.env.APP_URL}/?auth=error`);
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.APP_URL}/api/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await res.json();
    if (!tokens.refresh_token) {
      return Response.redirect(`${process.env.APP_URL}/?auth=error`);
    }

    const sql = getDb();
    await sql`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        user_id TEXT PRIMARY KEY,
        refresh_token TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      INSERT INTO auth_tokens (user_id, refresh_token, updated_at)
      VALUES ('dennika', ${tokens.refresh_token}, NOW())
      ON CONFLICT (user_id) DO UPDATE
        SET refresh_token = ${tokens.refresh_token}, updated_at = NOW()
    `;

    return Response.redirect(`${process.env.APP_URL}/?auth=success`);
  } catch (err) {
    console.error('Auth callback error:', err);
    return Response.redirect(`${process.env.APP_URL}/?auth=error`);
  }
}
