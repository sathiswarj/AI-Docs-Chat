'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-md transition-opacity duration-700"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 animate-in zoom-in duration-300 shadow-2xl border border-slate-200 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-black transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-200 shadow-sm">
            <AlertTriangle className="text-black" size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-black tracking-tight">Delete History?</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium px-4">
              This action will permanently delete all document data and chat history. This cannot be undone.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full mt-2">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-black hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Confirm Delete
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              Keep Everything
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
