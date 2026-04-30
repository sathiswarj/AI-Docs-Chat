'use client';

import React from 'react';
import {
  FileText,
  Trash2,
  User,
  ChevronRight,
  LogOut,
  Command,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import Link from 'next/link';

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
    <aside className="w-85 h-screen flex flex-col border-r border-slate-200 bg-sidebar z-20">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
            <Command size={18} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900">DocGS</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-black hover:bg-slate-200/50 rounded-xl transition-all group border border-slate-200 bg-white mb-6 shadow-sm"
          >
            <Plus size={18} />
            <span className="text-[13px] font-extrabold uppercase tracking-widest">New Chat</span>
          </button>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Recent Analysis</p>
            {conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => onSelectConversation(conv._id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group cursor-pointer border ${activeConversationId === conv._id ? 'bg-white border-slate-200 shadow-sm text-black' : 'text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-200/30'}`}
              >
                <FileText size={14} className={activeConversationId === conv._id ? 'text-black' : 'text-slate-400'} />
                <span className="text-[12px] font-semibold truncate flex-1">{conv.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Active Document</p>
          {(file || pendingFile) ? (
            <div className="mx-2 p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner">
                  <FileText size={18} className="text-black" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[12px] font-bold text-slate-900 truncate">{file ? file.name : pendingFile?.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isProcessed ? 'Live' : 'Processing...'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-2 p-6 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
              <FileText size={20} className="text-slate-300 mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No Document</p>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-black transition-colors">
          <div className="flex items-center gap-3">
            <Link href="/account" className="flex items-center gap-3 flex-1 overflow-hidden group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm group-hover:bg-black group-hover:border-black transition-all">
                <User size={16} className="text-slate-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-bold text-slate-900 truncate group-hover:text-black">{user?.username || 'Operator'}</p>
                <p className="text-[9px] text-slate-400 truncate font-medium group-hover:text-slate-600">{user?.email}</p>
              </div>
            </Link>
            <button onClick={logout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-all" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
