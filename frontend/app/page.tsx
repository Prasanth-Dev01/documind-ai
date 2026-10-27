"use client";

import { useEffect, useState } from "react";
import { askQuestion, fetchDocuments, removeDocument, uploadDocument } from "../lib/api";
import type { Message, UploadedDocument } from "../types";
import { ChatPanel } from "../components/chat/chat-panel";
import { DocumentUpload } from "../components/documents/document-upload";
import { AppHeader } from "../components/layout/app-header";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { fetchDocuments().then(setDocuments).catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load documents.")); }, []);

  async function handleUpload(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) { setError("Please select a PDF file."); return; }
    setUploading(true); setError("");
    try {
      const data = await uploadDocument(file);
      setDocuments((previous) => previous.some((doc) => doc.document_id === data.document_id) ? previous : [...previous, { document_id: data.document_id, document_name: data.document_name, chunks_created: data.chunks_created }]);
      setMessages((previous) => [...previous, { role: "assistant", content: `Successfully processed ${data.document_name}. I created ${data.chunks_created} text chunks from ${data.pages} pages. Ask me anything about this document!` }]);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not connect to the backend."); }
    finally { setUploading(false); }
  }

  async function handleRemove(documentId: string) {
    setDeletingDocumentId(documentId); setError("");
    try {
      await removeDocument(documentId);
      const name = documents.find((doc) => doc.document_id === documentId)?.document_name;
      setDocuments((previous) => previous.filter((doc) => doc.document_id !== documentId));
      if (name) setMessages((previous) => previous.filter((message) => !message.content.includes(`Successfully processed ${name}`)));
    } catch (err) { setError(err instanceof Error ? err.message : "Could not remove document."); }
    finally { setDeletingDocumentId(null); }
  }

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setMessages((previous) => [...previous, { role: "user", content: trimmed }]); setQuestion(""); setLoading(true); setError("");
    try { const data = await askQuestion(trimmed); setMessages((previous) => [...previous, { role: "assistant", content: data.answer, sources: data.sources }]); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not connect to the backend."); }
    finally { setLoading(false); }
  }

  return (
  <main className="min-h-screen bg-[#090b10] text-slate-100">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6">
    <AppHeader />
    <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
    <DocumentUpload uploading={uploading} onUpload={handleUpload} documents={documents} deletingDocumentId={deletingDocumentId} onRemove={handleRemove} />
    <ChatPanel messages={messages} question={question} setQuestion={setQuestion} loading={loading} error={error} onSend={handleSend} />
    </div>
    </div></main>
  );
}
