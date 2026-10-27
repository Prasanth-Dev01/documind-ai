import type { ChatResponse, DocumentsResponse, UploadedDocument, UploadResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "The request failed.");
  }
  return data as T;
}

export async function fetchDocuments(): Promise<UploadedDocument[]> {
  const response = await fetch(`${API_URL}/documents`);
  return (await readResponse<DocumentsResponse>(response)).documents;
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return readResponse<UploadResponse>(await fetch(`${API_URL}/upload`, { method: "POST", body: formData }));
}

export async function removeDocument(documentId: string): Promise<void> {
  await readResponse<{ success: boolean }>(await fetch(`${API_URL}/documents/${encodeURIComponent(documentId)}`, { method: "DELETE" }));
}

export async function askQuestion(question: string): Promise<ChatResponse> {
  return readResponse<ChatResponse>(await fetch(`${API_URL}/chat`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }),
  }));
}
