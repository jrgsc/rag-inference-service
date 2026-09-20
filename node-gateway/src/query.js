import { getCached, setCached } from './cache.js';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

export async function handleQuery(req, res) {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'question is required' });
  }

  const cached = await getCached(question);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const upstream = await fetch(`${PYTHON_SERVICE_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!upstream.ok) {
    return res.status(upstream.status).json({ error: 'upstream query failed' });
  }

  const answer = await upstream.json();
  await setCached(question, answer);
  res.json(answer);
}
