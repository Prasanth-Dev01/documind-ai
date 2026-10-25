from fastapi import HTTPException

MAX_UPLOAD_BYTES = 10 * 1024 * 1024


def validate_pdf(filename: str | None, content: bytes) -> None:
    if not filename or not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="PDF must be 10 MB or smaller.")
    if not content.startswith(b"%PDF-"):
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid PDF.")


def create_chunks(text: str, chunk_size: int = 1000, overlap: int = 150) -> list[str]:
    text = " ".join(text.split())
    chunks = []
    start = 0
    print(len(text))
    while start < len(text):

        end = min(start + chunk_size, len(text))
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end == len(text):
            break
        start = end - overlap
    return chunks
