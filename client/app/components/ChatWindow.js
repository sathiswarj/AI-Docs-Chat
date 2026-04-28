'use client';

import React from 'react';
import {
  FileText,
  User,
  Loader2,
  ShieldCheck,
  Upload,
  Send,
  Zap,
  Eye,
  X,
  Square
} from 'lucide-react';

export default function ChatWindow({
  messages,
  input,
  setInput,
  sendMessage,
  isUploading,
  isThinking,
  isProcessed,
  pendingFile,
  onUploadClick,
  messagesEndRef,
  extractedText,
  showPreview,
  setShowPreview,
  onStop
}) {
  return (
    <main className="flex-1 flex flex-col relative min-h-screen bg-white">
      <header className="h-16 border-b border-slate-200 flex items-center justify-between px-10 z-20 sticky top-0 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Analysis Session</span>
        </div>

        <div className="flex items-center gap-4">
          {isUploading && (
            <div className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Stream Active
            </div>
          )}
          {isProcessed && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${showPreview ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Eye size={12} /> {showPreview ? 'Close Preview' : 'View Content'}
              </button>
              <div className="bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                <ShieldCheck size={12} /> Document Verified
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Preview Panel */}
      <div className={`absolute right-0 top-16 bottom-0 w-1/3 bg-white/95 backdrop-blur-2xl border-l border-slate-200 z-30 transition-all duration-500 transform ${showPreview ? 'translate-x-0 shadow-2xl' : 'translate-x-full shadow-none'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Extracted Intelligence</h3>
            <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-black transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            <pre className="text-[13px] text-slate-600 font-mono whitespace-pre-wrap leading-relaxed opacity-80">
              {extractedText || "No content extracted."}
            </pre>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth custom-scrollbar z-10">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-6 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${msg.role === 'ai' ? 'bg-white border-slate-200' : 'bg-black border-slate-800'}`}>
              {msg.role === 'ai' ? <Zap size={20} className="text-black" /> : <User size={20} className="text-white" />}
            </div>
            <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-5 rounded-3xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'ai' ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none' : 'bg-black text-white font-medium rounded-tr-none'}`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] px-2">
                {msg.role === 'ai' ? 'Analysis Node' : 'System Operator'}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-6 max-w-4xl mx-auto">
            <div className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Zap size={20} className="text-black animate-pulse" />
            </div>
            <div className="p-5 bg-white border border-slate-200 rounded-3xl rounded-tl-none flex items-center gap-4 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mr-4">Processing Intelligence</span>
              <button
                onClick={onStop}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm border border-slate-200"
              >
                <Square size={10} fill="currentColor" /> Stop
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-10 pt-0 z-20">
        <div className="max-w-4xl mx-auto relative">
          <form
            onSubmit={sendMessage}
            className="relative group transition-all duration-500"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your query here..."
                className="w-full bg-white border border-slate-200 focus:border-black/20 focus:ring-4 focus:ring-slate-100 rounded-3xl py-5 pl-16 pr-20 outline-none transition-all placeholder:text-slate-400 text-[15px] text-slate-900 shadow-xl shadow-slate-100"
              />
              <button
                type="button"
                onClick={onUploadClick}
                className="absolute left-3 z-30 w-10 h-10 bg-slate-50 hover:bg-slate-200 text-slate-500 hover:text-black rounded-2xl flex items-center justify-center transition-all border border-slate-200 shadow-sm cursor-pointer"
                title="Upload Document"
              >
                <Upload size={18} />
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking || isUploading}
                  className="w-12 h-12 bg-black disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl flex items-center justify-center transition-all hover:bg-slate-800 shadow-lg cursor-pointer"
                >
                  <Send size={22} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
