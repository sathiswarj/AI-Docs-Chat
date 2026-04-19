'use client';

import React from 'react';
import {
  Bot,
  User,
  Loader2,
  CheckCircle2,
  MessageSquare,
  Upload,
  Send
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
  messagesEndRef
}) {
  return (
    <main className="flex-1 flex flex-col relative">
      <header className="h-16 border-b glass flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-2 md:hidden">
          <Bot className="text-primary w-6 h-6" />
          <span className="font-bold">DocGS AI</span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          {isUploading && (
            <div className="flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Uploading PDF...
            </div>
          )}
          {isProcessed && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
              <CheckCircle2 size={12} /> Context Loaded
            </div>
          )}
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <MessageSquare size={20} className="text-zinc-400" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-zinc-800 border' : 'bg-primary shadow-lg shadow-primary/20'}`}>
              {msg.role === 'ai' ? <Bot size={18} className="text-blue-400" /> : <User size={18} className="text-white" />}
            </div>
            <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai' ? 'chat-bubble-ai rounded-tl-none' : 'chat-bubble-user rounded-tr-none shadow-lg'}`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-zinc-500 font-medium px-1 uppercase tracking-widest mt-1">
                {msg.role === 'ai' ? 'AI Assistant' : 'You'}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-4 max-w-3xl animate-pulse">
            <div className="w-8 h-8 bg-zinc-800 border rounded-lg flex items-center justify-center shrink-0">
              <Bot size={18} className="text-blue-400" />
            </div>
            <div className="p-4 chat-bubble-ai rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-blue-400" />
              <span className="text-sm italic">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 relative">
        {!isProcessed && !isUploading && !pendingFile && messages.length === 1 && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-8 w-full max-w-lg text-center">
            <div className="glass p-8 rounded-3xl border-dashed border-2 border-zinc-700/50 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Upload className="text-blue-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold">Ready to analyze?</h3>
              <p className="text-zinc-400 text-sm">Upload a technical doc, research paper, or any PDF to start chatting.</p>
              <button
                onClick={onUploadClick}
                className="px-6 py-2 bg-white/5 border hover:bg-white/10 rounded-full transition-all text-sm font-medium cursor-pointer"
              >
                Select PDF
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={sendMessage}
          className={`max-w-4xl mx-auto relative group transition-all ${(!isProcessed && !pendingFile) ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isProcessed ? "Ask questions about your document..." : (pendingFile ? "Click send to upload and process..." : "Upload a PDF first to chat")}
            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-6 pr-14 outline-none transition-all placeholder:text-zinc-600 shadow-2xl"
          />
          <button
            type="submit"
            disabled={!input.trim() || (!isProcessed && !pendingFile) || isThinking || isUploading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary disabled:bg-zinc-800 text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[10px] text-zinc-600 mt-4 font-medium uppercase tracking-tighter">
          Powered by Google Gemini AI • DocGS Chat v1.0
        </p>
      </div>
    </main>
  );
}
