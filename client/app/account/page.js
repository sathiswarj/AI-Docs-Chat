'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  FileText,
  Command,
  Loader2,
  CheckCircle,
  AlertCircle,
  LogOut,
  ArrowLeft,
  Cpu,
  Thermometer,
  Hash,
  ChevronRight,
  Shield,
} from 'lucide-react';

export default function AccountPage() {
  const { user, loading, logout, updateProfile } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    phone: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setForm({
        username: user.username || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);
    const result = await updateProfile(form);
    setSaving(false);
    if (result.success) {
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } else {
      setFeedback({ type: 'error', message: result.error || 'Something went wrong.' });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = (user.username || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <Command size={14} className="text-white" />
            </div>
            <span className="text-[12px] font-black uppercase tracking-[0.25em] text-black">Doc GS</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all text-xs font-bold uppercase tracking-widest border border-slate-200 hover:border-red-200"
        >
          <LogOut size={14} />
          Logout
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center gap-6 shadow-sm">
          <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-black truncate">{user.username}</h1>
            <p className="text-slate-500 text-sm mt-1 truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <Shield size={10} />
                Active Account
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold border ${feedback.type === 'success'
            ? 'bg-green-50 border-green-100 text-green-700'
            : 'bg-red-50 border-red-100 text-red-600'
            } animate-fade-in`}>
            {feedback.type === 'success'
              ? <CheckCircle size={16} />
              : <AlertCircle size={16} />}
            {feedback.message}
          </div>
        )}

        {/* Profile Edit Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Profile Information</h2>
          </div>
          <form onSubmit={handleSave} className="p-8 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={11} /> Name
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your display name"
                className="w-full bg-slate-50 border border-slate-200 text-black px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-black/10 transition-all text-[15px]"
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Mail size={11} /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 px-4 py-3.5 rounded-2xl text-[15px] cursor-not-allowed"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                  Read only
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Phone size={11} /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-50 border border-slate-200 text-black px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-black/10 transition-all text-[15px]"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText size={11} /> About / Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="A short description about yourself..."
                rows={3}
                maxLength={300}
                className="w-full bg-slate-50 border border-slate-200 text-black px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-black/10 transition-all text-[15px] resize-none leading-relaxed"
              />
              <p className="text-right text-[10px] text-slate-400 font-medium">{form.bio.length}/300</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-black hover:bg-slate-800 text-white font-black rounded-2xl shadow-lg text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* LLM Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">LLM Configuration</h2>
          </div>
          <div className="p-8 space-y-4">
            <p className="text-xs text-slate-500 font-medium mb-6">
              Your local Ollama instance powers the AI assistant. Below are the current runtime details.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Cpu, label: 'Model Engine', value: 'Ollama (Local)' },
                { icon: Hash, label: 'Default Model', value: 'Mistral' },

              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-black mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>

        {/* Danger Zone – Logout */}
        <div className="bg-white rounded-3xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-red-50">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-400">Session</h2>
          </div>
          <div className="p-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black mb-1">Sign out of your account</p>
              <p className="text-xs text-slate-500">You will be redirected to the login page.</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-black rounded-2xl text-[11px] uppercase tracking-[0.15em] transition-all border border-red-100 hover:border-red-200 active:scale-[0.97]"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
