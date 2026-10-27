# DocuMind AI

A private, local RAG document chat app. The frontend is Next.js; the API uses FastAPI, persistent ChromaDB, and local Ollama models.

## Requirements

- Python 3.10 or newer
- Node.js and npm
- Ollama with `llama3.2:3b` and `nomic-embed-text` pulled locally

## Start the backend (Windows PowerShell)

```powershell
cd D:\document-ai\backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
ollama pull llama3.2:3b
ollama pull nomic-embed-text
uvicorn main:app --reload
```

The API listens on `http://localhost:8000`.

## Start the frontend (second PowerShell window)

```powershell
cd D:\document-ai\frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to change the API base URL.

## Checks

```powershell
cd D:\document-ai\frontend
npm run lint
npx tsc --noEmit
npm run build
```

Uploaded PDFs, temporary files, ChromaDB persistence, virtual environments, and frontend build artifacts are local runtime data and are ignored by git.
