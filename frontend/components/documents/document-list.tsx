import type { UploadedDocument } from "../../types";
import { DocumentItem } from "./document-item";

export function DocumentList({ documents, deletingDocumentId, onRemove }: {
  documents: UploadedDocument[];
  deletingDocumentId: string | null;
  onRemove: (documentId: string) => void;
}) {
  return <div className="mt-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Uploaded documents</h3><span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-300">{documents.length}</span></div>
    {documents.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs leading-5 text-slate-500">No documents uploaded yet.</p> : <div className="space-y-2">{documents.map((document) => <DocumentItem key={document.document_id} document={document} deleting={deletingDocumentId !== null} isDeleting={deletingDocumentId === document.document_id} onRemove={onRemove} />)}</div>}
  </div>;
}
