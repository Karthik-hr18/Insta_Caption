// api/generate.js - Groq-compatible serverless function for Vercel.
// Replace your existing api/generate.js with this file.
//
// Environment variable required:
//   GROQ_API_KEY  (preferred)  OR  OPENAI_API_KEY (fallback)
//
// Endpoint used: https://api.groq.com/openai/v1/chat/completions

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const body = req.body || {};
    if (!body.prompt) return res.status(400).json({ error: 'No prompt provided' });

    const API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || null;
    if (!API_KEY) return res.status(500).json({ error: 'Missing GROQ_API_KEY environment variable' });

    const payload = {
      model: process.env.GROQ_MODEL || qwen/qwen3-32b,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes social media captions.' },
        { role: 'user', content: body.prompt }
      ],
      temperature: 0.8,
      max_tokens: 400
    };

    // Vercel runtime provides fetch. If not, this will throw and be handled below.
    if (typeof fetch === 'undefined') {
      throw new Error('fetch is not available in this runtime');
    }

    const r = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('Groq API error', r.status, detail);
      return res.status(502).json({ error: 'Groq API error', status: r.status, detail: detail.substring(0,1000) });
    }

    const data = await r.json();
    const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content
      : '';

    return res.status(200).json({ text });
  } catch (err) {
    console.error('generate error', err && err.stack ? err.stack : String(err));
    return res.status(500).json({ error: 'Server error', detail: String(err) });
  }
};
