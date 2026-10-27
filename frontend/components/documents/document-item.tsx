import { FileText, LoaderCircle, X } from "lucide-react";
import type { UploadedDocument } from "../../types";

export function DocumentItem({ document, deleting, isDeleting, onRemove }: { document: UploadedDocument; deleting: boolean; isDeleting: boolean; onRemove: (id: string) => void }) {
  return <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"><FileText className="mt-0.5 size-5 shrink-0 text-violet-400" /><div className="min-w-0 flex-1"><p className="break-words text-sm font-medium text-slate-200">{document.document_name}</p><p className="mt-1 text-xs text-emerald-400">{document.chunks_created} chunks indexed</p></div><button type="button" aria-label={`Remove ${document.document_name}`} title="Remove document" disabled={deleting} onClick={() => onRemove(document.document_id)} className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50">{isDeleting ? <LoaderCircle className="size-4 animate-spin" /> : <X className="size-4" />}</button></div>;
}
