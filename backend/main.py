# .\.venv\Scripts\Activate.ps1
# python -m uvicorn main:app --reload --port 8000

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import traceback
from services.document_service import delete_document as remove_document, get_documents as list_documents, process_upload
from services.embedding_service import CHAT_MODEL, EMBED_MODEL
from services.rag_service import chat_with_documents, collection

app = FastAPI(title="DocuMind AI - RAG API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "DocuMind AI RAG API is running!", "documents_count": collection.count()}


@app.get("/health")
def health():
    try:
        models = ollama.list()
        installed_models = [model.model for model in models.models]
        return {"status": "ok", "chat_model": CHAT_MODEL, "embedding_model": EMBED_MODEL, "chat_model_available": any(CHAT_MODEL in model for model in installed_models), "embedding_model_available": any(EMBED_MODEL in model for model in installed_models)}
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Ollama is not reachable.") from exc


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        return await process_upload(file)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Could not process PDF.") from exc
    finally:
        await file.close()


@app.get("/documents")
def get_documents():
    return {"documents": list_documents()}


@app.delete("/documents/{document_id}")
def delete_document(document_id: str):
    try:
        return remove_document(document_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Document not found.") from exc


@app.post("/chat")
def chat(request: ChatRequest):
    try:
        return chat_with_documents(request.question)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Could not generate an answer.") from exc
