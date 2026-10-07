'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login } from '@/lib/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_rgba(220,38,38,0.18),_transparent_36%),linear-gradient(135deg,#080f1c,#172538)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="ZH International" width={80} height={80} className="mx-auto mb-4" style={{ width: 'auto' }} />
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-2">Secure access for authorized administrators</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-[0_30px_90px_-28px_rgba(0,0,0,0.65)] ring-1 ring-white/10 space-y-5">
          {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input id="admin-username" name="username" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-xs text-center text-slate-400">Your credentials are managed by the site administrator.</p>
        </form>
      </div>
    </div>
  );
}
