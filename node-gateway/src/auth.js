export function requireApiKey(req, res, next) {
  const key = req.get('x-api-key');
  if (!key || key !== process.env.GATEWAY_API_KEY) {
    return res.status(401).json({ error: 'missing or invalid api key' });
  }
  next();
}
