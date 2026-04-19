'use client';

import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="glass w-full max-w-sm rounded-3xl p-8 relative z-10 animate-in fade-in zoom-in duration-300 shadow-2xl shadow-black/50 border border-white/10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-400" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Delete Analysis?</h3>
            <p className="text-zinc-800 text-sm mt-2 leading-relaxed">
              This will permanently clear your current document and chat history.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 cursor-pointer hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-red-500 cursor-pointer hover:bg-red-600 text-white rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
