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
    <main className="flex-1 flex flex-col relative mesh-gradient min-h-screen">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-10 z-20 sticky top-0 bg-black/20 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">Intelligence Nexus</span>
        </div>

        <div className="flex items-center gap-4">
          {isUploading && (
            <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Stream Active
            </div>
          )}
          {isProcessed && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${showPreview ? 'bg-primary text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
              >
                <Eye size={12} /> {showPreview ? 'Close Preview' : 'View Content'}
              </button>
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/5">
                <ShieldCheck size={12} /> Verified
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Preview Panel */}
      <div className={`absolute right-0 top-16 bottom-0 w-1/3 bg-black/90 backdrop-blur-2xl border-l border-white/10 z-30 transition-all duration-500 transform ${showPreview ? 'translate-x-0' : 'translate-x-full shadow-none'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Extracted Intelligence</h3>
            <button onClick={() => setShowPreview(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            <pre className="text-[13px] text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed">
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
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-xl ${msg.role === 'ai' ? 'bg-zinc-900 border-white/10' : 'premium-gradient border-white/20'}`}>
              {msg.role === 'ai' ? <Zap size={20} className="text-primary" /> : <User size={20} className="text-white" />}
            </div>
            <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-5 rounded-3xl text-[15px] leading-relaxed shadow-2xl ${msg.role === 'ai' ? 'bg-zinc-900/80 border border-white/5 text-zinc-200 rounded-tl-none backdrop-blur-md' : 'bg-white text-black font-medium rounded-tr-none'}`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] px-2">
                {msg.role === 'ai' ? 'Analysis Node' : 'Authenticated System'}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-6 max-w-4xl mx-auto">
            <div className="w-11 h-11 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
              <Zap size={20} className="text-primary animate-pulse" />
            </div>
            <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-3xl rounded-tl-none flex items-center gap-4 backdrop-blur-md">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mr-4">Processing Intelligence</span>
              <button
                onClick={onStop}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                <Square size={10} fill="currentColor" /> Stop
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-10 pt-0 z-20">
        {!isProcessed && !isUploading && !pendingFile && messages.length === 1 && (
          <div className="max-w-lg mx-auto mb-12 text-center">
            <div className="bg-zinc-900/40 border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
              <div className="w-20 h-20 premium-gradient rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30">
                <Upload size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white mb-3">Load Intelligence</h2>
              <p className="text-zinc-500 text-base mb-10 leading-relaxed px-6">Select a document source to initialize the document analysis sequence.</p>
              <button
                onClick={onUploadClick}
                className="px-10 py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-xl cursor-pointer"
              >
                Initialize File
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto relative">
          <form
            onSubmit={sendMessage}
            className={`relative group transition-all duration-500 ${(!isProcessed && !pendingFile) ? 'opacity-30 grayscale' : 'opacity-100'}`}
          >
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isProcessed ? "Ask a question..." : "Awaiting document..."}
                className="w-full bg-zinc-900 border border-white/5 focus:border-primary/40 rounded-3xl py-5 pl-8 pr-40 outline-none transition-all placeholder:text-zinc-700 text-[15px] text-zinc-100 shadow-2xl backdrop-blur-2xl"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                {isProcessed && !input && (
                  <button
                    type="button"
                    onClick={() => setInput("Summarize this document for me")}
                    className="h-10 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5"
                  >
                    Summarize
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || (!isProcessed && !pendingFile) || isThinking || isUploading}
                  className="w-12 h-12 bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 rounded-2xl flex items-center justify-center transition-all hover:bg-primary hover:text-white shadow-xl cursor-pointer"
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
