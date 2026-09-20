import Redis from 'ioredis';
import crypto from 'crypto';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const TTL_SECONDS = 60 * 60;

function keyFor(question) {
  const hash = crypto.createHash('sha256').update(question.trim().toLowerCase()).digest('hex');
  return `query:${hash}`;
}

export async function getCached(question) {
  const raw = await redis.get(keyFor(question));
  return raw ? JSON.parse(raw) : null;
}

export async function setCached(question, answer) {
  await redis.set(keyFor(question), JSON.stringify(answer), 'EX', TTL_SECONDS);
}
