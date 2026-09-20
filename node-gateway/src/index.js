import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { requireApiKey } from './auth.js';
import { handleQuery } from './query.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/query', requireApiKey, limiter, handleQuery);

app.listen(PORT, () => {
  console.log(`gateway listening on port ${PORT}`);
});
