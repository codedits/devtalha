"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-md bg-white border border-zinc-200 p-3">
            <Lock size={20} className="text-zinc-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Admin Access</h1>
            <p className="text-zinc-500 text-xs mt-0.5">Portfolio Content Manager</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 transition placeholder:text-zinc-400"
            />
          </div>
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 text-white py-2.5 text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
