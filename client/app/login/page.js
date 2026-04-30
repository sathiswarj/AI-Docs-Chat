'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Loader2, Command } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex items-center gap-3 mb-12 group transition-all">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Command size={20} className="text-white" />
            </div>
            <span className="text-[13px] font-black uppercase tracking-[0.3em] text-black">Doc GS</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-black mb-3 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 text-base">Enter your details to access your intelligence hub.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 text-black pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-black/10 transition-all text-[15px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security</label>
                <Link href="#" className="text-[10px] font-black text-black hover:opacity-60 uppercase tracking-widest transition-opacity">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-black pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-black/10 transition-all text-[15px]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-slate-900 text-white font-black py-5 rounded-2xl shadow-2xl shadow-black/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] mt-8"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Login <Command size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-xs font-medium">
              New to the nexus?{' '}
              <Link href="/signup" className="text-black font-black hover:opacity-60 transition-opacity">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Image/Visual */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/20 to-transparent mix-blend-overlay"></div>
        <img
          src="/auth-bg.png"
          alt="Nexus Intelligence"
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[10s] ease-out"
        />
        <div className="absolute bottom-20 left-20 right-20 z-20">
          <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-10 rounded-[3rem] shadow-2xl max-w-lg">
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
              ))}
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">
              Augment your research with localized intelligence.
            </h2>
            <p className="text-white/60 text-lg font-medium leading-relaxed">
              Experience the next generation of document analysis. Secure, private, and powered by local LLMs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
