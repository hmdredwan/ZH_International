'use client';
import { useEffect, useState } from 'react';
import { getManpower } from '@/lib/api';

export default function ManpowerPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    getManpower().then(setItems).catch(() => setItems([
      { id: 1, role: 'Civil Engineers', count: 45, category_name: 'Engineering' },
      { id: 2, role: 'Electrical Engineers', count: 18, category_name: 'Engineering' },
      { id: 3, role: 'Project Managers', count: 22, category_name: 'Engineering' },
      { id: 4, role: 'Welders', count: 60, category_name: 'Skilled Labor' },
      { id: 5, role: 'Electricians', count: 40, category_name: 'Skilled Labor' },
      { id: 6, role: 'Heavy Equipment Operators', count: 35, category_name: 'Skilled Labor' },
    ]));
  }, []);

  const total = items.reduce((s, i) => s + (i.count || 0), 0);

  return (
    <div className="pt-24">
      <section className="page-hero text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Manpower</h1>
        <p className="text-slate-400">Skilled professionals powering our success</p>
        <div className="w-20 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
      </section>
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-red-50 border border-red-100 rounded-2xl px-10 py-6">
            <div className="text-4xl font-bold text-red-600">{total}+</div>
            <div className="text-sm text-slate-600 font-medium mt-1">Total Skilled Workforce</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((m, i) => (
                <tr key={m.id || i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{m.role}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{m.category_name || '—'}</td>
                  <td className="px-6 py-4 text-right font-semibold text-red-600">{m.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
