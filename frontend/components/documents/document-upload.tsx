import { FileText, LoaderCircle, Upload } from "lucide-react";
import type { UploadedDocument } from "../../types";
import { DocumentList } from "./document-list";

export function DocumentUpload({ uploading, onUpload, documents, deletingDocumentId, onRemove }: {
  uploading: boolean;
  onUpload: (file?: File) => void;
  documents: UploadedDocument[];
  deletingDocumentId: string | null;
  onRemove: (documentId: string) => void;
}) {
  return <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5">
    <div className="mb-5 flex items-center gap-2"><FileText className="size-5 text-violet-400" /><h2 className="font-semibold">Your documents</h2></div>
    <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-violet-400/40 bg-violet-500/10 px-4 py-5 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20 has-[:disabled]:opacity-50">
      {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}{uploading ? "Processing PDF..." : "Upload a PDF"}
      <input type="file" accept=".pdf,application/pdf" className="sr-only" disabled={uploading} onChange={(event) => { onUpload(event.target.files?.[0]); event.currentTarget.value = ""; }} />
    </label>
    <p className="mt-3 text-xs leading-5 text-slate-500">Upload a text-based PDF to start asking questions. Maximum 10 MB.</p>
    <DocumentList documents={documents} deletingDocumentId={deletingDocumentId} onRemove={onRemove} />
    <div className="mt-6 rounded-xl bg-white/[0.04] p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Powered by</p><div className="space-y-3 text-sm text-slate-300"><p className="flex items-center gap-2"><span className="size-2 rounded-full bg-violet-400" />Ollama · Local LLM</p><p className="flex items-center gap-2"><span className="size-2 rounded-full bg-blue-400" />ChromaDB · Vector search</p><p className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-400" />Local embeddings</p></div></div>
  </aside>;
}
