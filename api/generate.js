==== api/generate.js ==== // Vercel serverless function (Node.js) // Place this file at /api/generate.js

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

module.exports = async (req, res) => { if (req.method !== 'POST') return res.status(405).send('Method not allowed'); const body = req.body; if (!body || !body.prompt) return res.status(400).json({ error: 'No prompt provided' });

const OPENAI_KEY = process.env.OPENAI_API_KEY; if (!OPENAI_KEY) return res.status(500).json({ error: 'Missing OPENAI_API_KEY env variable' });

try { const payload = { model: 'gpt-3.5-turbo', messages: [ { role: 'system', content: 'You are a helpful assistant that writes social media captions.' }, { role: 'user', content: body.prompt } ], temperature: 0.8, max_tokens: 400 };

const r = await fetch(OPENAI_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_KEY}`
  },
  body: JSON.stringify(payload)
});

if (!r.ok) {
  const errTxt = await r.text();
  console.error('OpenAI error', r.status, errTxt);
  return res.status(502).json({ error: 'OpenAI API error', detail: errTxt });
}

const data = await r.json();
const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
  ? data.choices[0].message.content
  : '';

res.setHeader('Content-Type', 'application/json');
res.status(200).send(JSON.stringify({ text }));

} catch (err) { console.error(err); res.status(500).json({ error: 'Server error', detail: String(err) }); } };
