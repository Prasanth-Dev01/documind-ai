# DocuMind AI — Local RAG Document Chatbot

A privacy-focused AI document assistant that lets users upload multiple PDF documents, ask questions in natural language, and receive answers based on relevant document content with source references.

Built using Next.js, FastAPI, ChromaDB, and Ollama. The AI models run locally, so no paid LLM API is required.

## Features

- **Multiple PDF Uploads** — Upload and manage multiple PDF documents.
- **PDF Text Extraction** — Extract text from PDF pages using pypdf.
- **Text Chunking** — Split document content into smaller overlapping chunks for retrieval.
- **Local Embeddings** — Generate embeddings using Ollama.
- **Vector Database** — Store document chunks and metadata in persistent ChromaDB.
- **RAG Question Answering** — Retrieve relevant chunks and generate context-based answers.
- **Source References** — Display source document names and page numbers.
- **Document Management** — View uploaded documents and remove individual documents.
- **Selective Deletion** — Delete only the selected document's chunks from ChromaDB.
- **Persistent Storage** — Retain indexed documents locally across application restarts.
- **Responsive UI** — Modern dark-themed interface built with Next.js and Tailwind CSS.

## Tech Stack

### Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react

### Backend
- Python
- FastAPI
- ChromaDB
- Ollama
- pypdf

### Local AI Models
- **LLM:** `llama3.2:3b`
- **Embedding Model:** `nomic-embed-text`

## Architecture

```text
                 User
                  |
                  v
          Next.js Frontend
          /       |       \
      Upload     Chat    Documents
                  |
                  v
            FastAPI Backend
                  |
          +-------+--------+
          |                |
          v                v
      PDF Parser       Ollama
      and Chunking   Embeddings / LLM
          |                |
          +-------+--------+
                  |
                  v
              ChromaDB
          Vector Search
          and Metadata
```

## How It Works

1. **Upload:** The user uploads a PDF through the frontend.
2. **Extract:** The backend extracts text from each PDF page.
3. **Chunk:** The extracted text is split into smaller overlapping chunks.
4. **Embed:** Ollama generates embeddings for each chunk.
5. **Store:** Chunks, embeddings, document IDs, filenames, and page numbers are stored in ChromaDB.
6. **Retrieve:** When a question is submitted, its embedding is used to find relevant document chunks.
7. **Generate:** The local language model generates an answer using the retrieved context.
8. **Cite:** The response includes source document and page information.
9. **Manage:** Users can view uploaded documents and delete individual documents and their associated chunks.

## Prerequisites

Install the following:

- Node.js and npm
- Python
- Ollama
- Git (for cloning and version control)

Download the required Ollama models:

```bash
ollama pull llama3.2:3b
ollama pull nomic-embed-text
```

Make sure Ollama is running before starting the backend.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd document-ai
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Set up the backend

Open a terminal:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
uvicorn main:app --reload --port 8000
```

If PowerShell does not allow virtual environment activation, run:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Backend URLs:

- API: http://localhost:8000
- Health Check: http://localhost:8000/health
- API Documentation: http://localhost:8000/docs

### 3. Set up the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the application:

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API status and document chunk count |
| GET | `/health` | Check backend and Ollama availability |
| POST | `/upload` | Upload and process a PDF |
| GET | `/documents` | List indexed documents |
| DELETE | `/documents/{document_id}` | Delete one document's chunks |
| POST | `/chat` | Ask a question about uploaded documents |

### Example Chat Request

```json
{
  "question": "What is the remote work policy?"
}
```

The API returns an answer and source information based on the retrieved document context.

## Project Structure

```text
document-ai/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── services/
│   ├── chroma_db/
│   └── data/
│
├── .gitignore
└── README.md
```

The exact folders may vary depending on the current implementation. The `services/` folder is applicable if the backend has been refactored into separate modules.

## Privacy and Security

- Document processing and AI inference are designed to run locally.
- No paid LLM API is required for the configured setup.
- Do not commit private PDFs, resumes, uploaded documents, ChromaDB data, or environment secrets.
- Keep virtual environments and dependency folders out of version control.
- Review authentication, CORS, and upload security before exposing the API publicly.
- AI-generated responses may contain errors. Verify important answers against the source document.

## Current Limitations

- Text-based PDFs are supported; scanned PDFs may require OCR.
- Answer quality depends on document content, chunking, embeddings, and retrieval quality.
- Response speed depends on the local machine and model.
- The current retrieval configuration returns a limited number of relevant chunks.

## Future Improvements

- OCR support for scanned PDFs.
- Improved retrieval using metadata filtering, hybrid search, and reranking.
- Automated frontend and backend tests.
- Document selection for targeted conversations.
- Enhanced upload progress and accessibility.
- Optional streaming responses.

## License

Add a license if you want to specify how others may use, modify, or distribute this project.
