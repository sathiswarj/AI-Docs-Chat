'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Trash2,
  User,
  ChevronRight,
  LogOut,
  Command
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ file, pendingFile, isProcessed, onDelete }) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-72 h-screen flex flex-col border-r border-white/5 bg-black z-20 shadow-2xl">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 premium-gradient rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 border border-white/10">
            <Command size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">DocGS</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4 mb-3">System Hub</p>
          <div className="flex items-center gap-3 px-4 py-3.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-white/5">
            <LayoutDashboard size={18} className="group-hover:text-primary transition-colors" />
            <span className="text-[13px] font-bold">Workspace</span>
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5 text-white bg-white/5 rounded-2xl transition-all border border-white/5 shadow-inner">
            <FileText size={18} className="text-primary" />
            <span className="text-[13px] font-bold">Intel Analysis</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4 mb-3">Active Context</p>
          {(file || pendingFile) ? (
            <div className="mx-2 p-4 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4 relative overflow-hidden group shadow-lg">
              <div className="flex items-center gap-3 relative">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                  <FileText size={18} className="text-primary" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[12px] font-black text-zinc-200 truncate">{file ? file.name : pendingFile?.name}</p>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{isProcessed ? 'Analysis Live' : 'Processing...'}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/5"
              >
                Clear Cache
              </button>
            </div>
          ) : (
            <div className="mx-2 p-8 border border-dashed border-white/5 rounded-[2.5rem] text-center bg-zinc-900/10">
              <FileText size={24} className="text-zinc-800 mx-auto mb-4" />
              <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">No Intelligence Loaded</p>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center border border-white/10 shadow-lg">
              <User size={18} className="text-zinc-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[12px] font-black text-white truncate">{user?.username || 'Operator'}</p>
              <p className="text-[10px] text-zinc-600 truncate font-medium">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-2 hover:bg-white/5 rounded-xl text-zinc-600 hover:text-red-500 transition-all active:scale-90">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
