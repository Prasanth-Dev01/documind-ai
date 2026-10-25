# 

from pathlib import Path
import uuid

from fastapi import HTTPException, UploadFile
from pypdf import PdfReader

from .embedding_service import create_embedding
from .pdf_service import create_chunks, validate_pdf
from .rag_service import collection

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)


async def process_upload(file: UploadFile) -> dict:
    content = await file.read()
    validate_pdf(file.filename, content)
    document_name = Path(file.filename or "document.pdf").name
    document_id = uuid.uuid4().hex
    pdf_path = DATA_DIR / f"{document_id}.pdf"

    try:
        pdf_path.write_bytes(content)
        reader = PdfReader(str(pdf_path))
        records = []
        for page_number, page in enumerate(reader.pages, start=1):
            for chunk_index, chunk in enumerate(create_chunks(page.extract_text() or "")):
                print(len(create_chunks(page.extract_text() or "")))
                records.append({"id": f"{document_id}-{page_number}-{chunk_index}", "text": chunk, "page": page_number})
        if not records:
            raise HTTPException(status_code=422, detail="No extractable text found in this PDF.")

        embeddings = [create_embedding(record["text"]) for record in records]
        collection.add(
            ids=[record["id"] for record in records],
            documents=[record["text"] for record in records],
            embeddings=embeddings,
            metadatas=[{"document_id": document_id, "document_name": document_name, "page_number": record["page"]} for record in records],
        )
        return {"message": "PDF processed successfully!", "document_id": document_id, "document_name": document_name, "pages": len(reader.pages), "chunks_created": len(records)}
    except HTTPException:
        raise
    except Exception as exc:
        raise RuntimeError("PDF processing failed") from exc
    finally:
        pdf_path.unlink(missing_ok=True)

# api to get all documents 
def get_documents() -> list[dict]:
    result = collection.get(include=["metadatas"])
    documents = {}
    for metadata in result["metadatas"] or []:
        document_id = metadata.get("document_id")
        if not document_id:
            continue
        if document_id not in documents:
            documents[document_id] = {"document_id": document_id, "document_name": metadata.get("document_name", "Document"), "chunks_created": 0}
        documents[document_id]["chunks_created"] += 1
    return list(documents.values())


def delete_document(document_id: str) -> dict:
    result = collection.get(where={"document_id": document_id}, include=["metadatas"])
    ids = result["ids"]
    if not ids:
        raise KeyError(document_id)
    collection.delete(ids=ids)
    return {"success": True, "document_id": document_id, "deleted_chunks": len(ids)}
