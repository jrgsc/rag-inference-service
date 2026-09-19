# RAG Inference Service

Portfolio project: a Node.js API gateway in front of a Python FastAPI service that does retrieval-augmented generation (RAG) over a small corpus, using the Claude API.

## Structure

- `node-gateway/` — Express gateway (auth, rate limiting, caching, routes requests to the Python service)
- `python-service/` — FastAPI service (embeddings, retrieval, Claude calls)
- `docker-compose.yml` — spins up both services locally

## Status

Early scaffolding, not functional yet.

## Corpus

The RAG corpus isn't included in this repo (it's personal/work docs, gitignored
under `python-service/corpus/`). To run this end-to-end yourself, drop your own
markdown docs in there and point the service at them.

## Local dev

```
cp .env.example .env
# fill in ANTHROPIC_API_KEY
docker compose up --build
```

Gateway health check: http://localhost:3000/health
Python service health check: http://localhost:8000/health
