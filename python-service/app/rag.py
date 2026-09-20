import anthropic
import chromadb
import voyageai

from . import config

_chroma = chromadb.PersistentClient(path=str(config.CHROMA_DIR))
_collection = _chroma.get_or_create_collection(config.COLLECTION_NAME)
_voyage = voyageai.Client(api_key=config.VOYAGE_API_KEY)
_claude = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)


def retrieve(query: str, k: int = 5):
    embedded = _voyage.embed([query], model=config.VOYAGE_MODEL, input_type="query")
    results = _collection.query(query_embeddings=embedded.embeddings, n_results=k)
    chunks = results["documents"][0]
    sources = [m["source"] for m in results["metadatas"][0]]
    return list(zip(chunks, sources))


def answer(query: str, k: int = 5):
    hits = retrieve(query, k)
    context = "\n\n---\n\n".join(f"[{src}]\n{chunk}" for chunk, src in hits)

    prompt = f"""Answer the question using only the context below. If the context doesn't cover it, say so.

Context:
{context}

Question: {query}"""

    response = _claude.messages.create(
        model=config.CLAUDE_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    text = next(b.text for b in response.content if b.type == "text")

    return {
        "answer": text,
        "sources": sorted(set(src for _, src in hits)),
    }
