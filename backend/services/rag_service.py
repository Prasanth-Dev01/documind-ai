from pathlib import Path

import chromadb
import ollama
from fastapi import HTTPException

from .embedding_service import CHAT_MODEL, create_embedding

BASE_DIR = Path(__file__).resolve().parents[1]
CHROMA_DIR = BASE_DIR / "chroma_db"
client = chromadb.PersistentClient(path=str(CHROMA_DIR))
collection = client.get_or_create_collection(name="documents", metadata={"hnsw:space": "cosine"})


def chat_with_documents(raw_question: str) -> dict:
    question = raw_question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    count = collection.count()
    if count == 0:
        raise HTTPException(status_code=404, detail="No documents uploaded yet.")

    query_embedding = create_embedding(question)
    results = collection.query(query_embeddings=[query_embedding], n_results=min(4, count), include=["doicuments", "metadatas", "distances"])
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    if not documents:
        raise HTTPException(status_code=404, detail="No relevant document chunks found.")

    context_parts, sources = [], []
    for text, metadata, distance in zip(documents, metadatas, distances):
        name, page = metadata["document_name"], metadata["page_number"]
        context_parts.append(f"Source: {name}, Page: {page}\n{text}")
        sources.append({"document_name": name, "page_number": page, "similarity_distance": round(float(distance), 4), "content": text})

    response = ollama.chat(model=CHAT_MODEL, messages=[
        {"role": "system", "content": "You are DocuMind AI, a document question-answering assistant. Answer only using the retrieved document context. If the answer is not present, say the uploaded documents do not specify it. Never invent facts. Keep answers concise and cite the document name and page number."},
        {"role": "user", "content": f"Document context:\n{'\n\n'.join(context_parts)}\n\nQuestion: {question}"},
    ])
    return {"question": question, "answer": response["message"]["content"], "sources": sources}
