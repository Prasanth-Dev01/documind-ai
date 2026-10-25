from pathlib import Path
import chromadb
import ollama

BASE_DIR = Path(__file__).resolve().parents[1]
EMBED_MODEL = "nomic-embed-text"
CHAT_MODEL = "llama3.2:3b"


def create_embedding(text: str) -> list[float]:
    response = ollama.embed(model=EMBED_MODEL, input=text)
    return response["embeddings"][0]
