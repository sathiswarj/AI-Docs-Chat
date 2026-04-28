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

export default function Sidebar({ 
  file, 
  pendingFile, 
  isProcessed, 
  onNewChat, 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onDeleteConversation 
}) {
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
          <button 
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-zinc-400 hover:text-white hover:bg-primary/10 rounded-2xl transition-all group cursor-pointer border border-dashed border-white/10 hover:border-primary/40 mb-2"
          >
            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-all">
              <Command size={14} className="text-primary" />
            </div>
            <span className="text-[13px] font-bold">New Chat</span>
          </button>
          
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4 mb-3 mt-6">Recent Intel</p>
            {conversations.map((conv) => (
              <div 
                key={conv._id}
                onClick={() => onSelectConversation(conv._id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group cursor-pointer border ${activeConversationId === conv._id ? 'bg-white/10 border-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:bg-white/5'}`}
              >
                <div className={`w-2 h-2 rounded-full ${activeConversationId === conv._id ? 'bg-primary animate-pulse' : 'bg-zinc-800'}`} />
                <span className="text-[12px] font-bold truncate flex-1">{conv.title}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
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
