import { Bot, FileText, LoaderCircle, MessageSquare, Send, User } from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";
import type { Message } from "../../types";

export function ChatPanel({ messages, question, setQuestion, loading, error, onSend }: {
  messages: Message[]; question: string; setQuestion: (value: string) => void; loading: boolean; error: string; onSend: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return <section className="flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"><ChatHeader /><div className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
    {messages.length === 0 && <div className="m-auto max-w-md py-12 text-center"><div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10"><Bot className="size-8 text-violet-300" /></div><h3 className="text-xl font-semibold">Your documents, understood.</h3><p className="mt-3 text-sm leading-6 text-slate-400">Upload a PDF and ask questions. DocuMind retrieves relevant passages and uses a local AI model to answer.</p><div className="mt-6 flex flex-wrap justify-center gap-2">{["Summarize this document", "What are the key skills?"].map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuestion(suggestion)} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-violet-400/50 hover:bg-violet-500/10">{suggestion}</button>)}</div></div>}
    {messages.map((message, index) => <ChatMessage key={`${index}-${message.role}`} message={message} />)}
    {loading && <div className="flex items-center gap-3 text-sm text-slate-400"><LoaderCircle className="size-5 animate-spin text-violet-400" />Searching documents and generating an answer...</div>}
    {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
  </div><ChatInput question={question} setQuestion={setQuestion} loading={loading} onSend={onSend} /></section>;
}

function ChatHeader() { return <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4"><div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15"><MessageSquare className="size-5 text-violet-300" /></div><div><h2 className="font-semibold">Chat with your documents</h2><p className="text-xs text-slate-500">Answers grounded in your uploaded content</p></div></div>; }

function ChatMessage({ message }: { message: Message }) {
  const uniqueSources = message.sources ? Array.from(new Map(message.sources.map((source) => [`${source.document_name}-${source.page_number}`, source])).values()) : [];
  return <div className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}><div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${message.role === "user" ? "bg-slate-700" : "bg-violet-500/15"}`}>{message.role === "user" ? <User className="size-4" /> : <Bot className="size-4 text-violet-300" />}</div><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === "user" ? "bg-violet-600 text-white" : "border border-white/10 bg-white/[0.04] text-slate-200"}`}><p className="whitespace-pre-wrap break-words">{message.content}</p>{uniqueSources.length > 0 && <div className="mt-4 border-t border-white/10 pt-3"><p className="mb-2 text-xs font-semibold text-slate-400">Sources</p><div className="flex flex-wrap gap-2">{uniqueSources.map((source) => <div key={`${source.document_name}-${source.page_number}`} className="rounded-lg border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-xs text-violet-200"><FileText className="mr-1 inline size-3" />{source.document_name} · Page {source.page_number}</div>)}</div></div>}</div></div>;
}

function ChatInput({ question, setQuestion, loading, onSend }: { question: string; setQuestion: (value: string) => void; loading: boolean; onSend: (event: FormEvent<HTMLFormElement>) => void }) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }
  return <form onSubmit={onSend} className="border-t border-white/10 p-4 sm:p-5"><div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 focus-within:border-violet-400/50"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask something about your documents..." rows={2} className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500" /><button type="submit" disabled={loading || !question.trim()} aria-label="Send message" className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40">{loading ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}</button></div><p className="mt-3 text-center text-xs text-slate-600">Runs locally on your machine. AI responses may contain mistakes.</p></form>;
}

