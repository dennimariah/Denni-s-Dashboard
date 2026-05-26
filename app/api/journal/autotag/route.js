import Anthropic from '@anthropic-ai/sdk';

const VALID_TAGS = ['work', 'family', 'friends', 'love', 'selfcare', 'growth', 'mental', 'gratitude', 'goals', 'body'];

export async function POST(request) {
  try {
    const { title, body } = await request.json();
    if (!process.env.ANTHROPIC_API_KEY) return Response.json({ tags: [] });

    const client = new Anthropic();
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Categorize this journal entry with 1-3 tags from this list only: work, family, friends, love, selfcare, growth, mental, gratitude, goals, body.

Title: ${title || ''}
Entry: ${(body || '').slice(0, 500)}

Reply with ONLY a JSON array of tag strings. Example: ["friends","growth"]`,
      }],
    });

    const text = msg.content[0]?.text?.trim() || '[]';
    const match = text.match(/\[.*\]/s);
    if (!match) return Response.json({ tags: [] });
    const parsed = JSON.parse(match[0]);
    const tags = parsed.filter(t => VALID_TAGS.includes(t));
    return Response.json({ tags });
  } catch (err) {
    console.error('autotag error:', err);
    return Response.json({ tags: [] });
  }
}
