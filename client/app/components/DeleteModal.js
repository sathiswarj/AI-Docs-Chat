'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl transition-opacity duration-700"
        onClick={onClose}
      ></div>
      <div className="bg-zinc-950 w-full max-w-lg rounded-[3.5rem] p-12 relative z-10 animate-in zoom-in duration-500 shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-2xl text-zinc-600 hover:text-white transition-all border border-transparent hover:border-white/5"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center gap-8">
          <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <AlertTriangle className="text-red-500" size={48} />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white tracking-tighter">Terminate Session?</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium px-8">
              This action will irreversibly wipe all document metadata and encrypted message history from the active memory core.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full mt-4">
            <button
              onClick={onConfirm}
              className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-3xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(220,38,38,0.2)] active:scale-95"
            >
              Confirm Termination
            </button>
            <button
              onClick={onClose}
              className="w-full py-5 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white rounded-3xl text-sm font-black uppercase tracking-widest transition-all border border-white/5"
            >
              Cancel Operation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
