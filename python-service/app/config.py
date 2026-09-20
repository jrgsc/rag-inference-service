import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

DATASET_DIR = Path(os.getenv("DATASET_DIR", "dataset/fb5.wiki"))
CHROMA_DIR = Path(os.getenv("CHROMA_DIR", ".chroma"))
COLLECTION_NAME = "wiki_docs"

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
VOYAGE_API_KEY = os.getenv("VOYAGE_API_KEY")

CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-opus-5")
VOYAGE_MODEL = os.getenv("VOYAGE_MODEL", "voyage-3")
