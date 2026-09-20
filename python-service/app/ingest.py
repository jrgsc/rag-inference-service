import chromadb
import voyageai

from . import config


def load_docs():
    docs = []
    for path in config.DATASET_DIR.rglob("*.md"):
        if ".git" in path.parts or ".attachments" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if text.strip():
            docs.append((str(path.relative_to(config.DATASET_DIR)), text))
    return docs


def chunk_text(text, max_chars=1500, overlap=200):
    paragraphs = [p for p in text.split("\n\n") if p.strip()]
    chunks = []
    current = ""
    for p in paragraphs:
        if len(current) + len(p) + 2 <= max_chars:
            current = f"{current}\n\n{p}" if current else p
        else:
            if current:
                chunks.append(current)
            tail = current[-overlap:] if current else ""
            current = f"{tail}\n\n{p}" if tail else p
    if current:
        chunks.append(current)
    return chunks


def run():
    docs = load_docs()
    print(f"found {len(docs)} markdown files")

    chunks, metadatas, ids = [], [], []
    for source, text in docs:
        for i, chunk in enumerate(chunk_text(text)):
            chunks.append(chunk)
            metadatas.append({"source": source, "chunk": i})
            ids.append(f"{source}::{i}")

    print(f"{len(chunks)} chunks, embedding with voyage...")

    vo = voyageai.Client(api_key=config.VOYAGE_API_KEY)
    embeddings = []
    batch_size = 128
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        result = vo.embed(batch, model=config.VOYAGE_MODEL, input_type="document")
        embeddings.extend(result.embeddings)

    client = chromadb.PersistentClient(path=str(config.CHROMA_DIR))
    collection = client.get_or_create_collection(config.COLLECTION_NAME)
    collection.upsert(ids=ids, embeddings=embeddings, documents=chunks, metadatas=metadatas)

    print(f"indexed {len(chunks)} chunks into '{config.COLLECTION_NAME}'")


if __name__ == "__main__":
    run()
