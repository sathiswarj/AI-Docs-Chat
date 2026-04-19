'use client';

import React from 'react';
import {
  Bot,
  FileText,
  Trash2,
  User,
  Settings
} from 'lucide-react';

export default function Sidebar({ file, pendingFile, isProcessed, onDelete }) {
  return (
    <aside className="w-72 glass border-r flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Bot className="text-white w-6 h-6" />
        </div>
        <h1 className="font-bold text-xl tracking-tight">DocGS AI</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 py-2">Recents</p>
        {(file || pendingFile) ? (
          <div className="bg-white/5 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group">
            <FileText size={18} className="text-blue-400" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{file ? file.name : pendingFile?.name}</p>
              <p className="text-xs text-zinc-500">{isProcessed ? 'Analyzed' : 'Awaiting upload'}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 cursor-pointer rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete analysis"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="px-3 py-4 border border-dashed border-zinc-800 rounded-xl text-center">
            <p className="text-xs text-zinc-600">No active documents</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800/50 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
            <User size={16} />
          </div>
          <p className="text-sm font-medium">Guest User</p>
          <Settings size={16} className="ml-auto text-zinc-500" />
        </div>
      </div>
    </aside>
  );
}
