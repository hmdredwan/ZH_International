'use client';
import { useEffect, useState } from 'react';
import { getManagement } from '@/lib/api';

export default function ManagementPage() {
  const [members, setMembers] = useState<any[]>([]);
  useEffect(() => {
    getManagement().then(setMembers).catch(() => setMembers([
      { id: 1, name: 'Managing Director', position: 'Managing Director', bio: 'Leading ZH International with vision and integrity.', is_md: true },
      { id: 2, name: 'Chief Engineer', position: 'Chief Engineer', bio: 'Overseeing technical excellence across all projects.' },
      { id: 3, name: 'Project Director', position: 'Project Director', bio: 'Ensuring timely and quality delivery of every engagement.' },
      { id: 4, name: 'Finance Director', position: 'Director of Finance', bio: 'Stewarding financial strategy and transparency.' },
    ]));
  }, []);

  return (
    <div className="pt-24">
      <section className="page-hero text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Company Management</h1>
        <p className="text-slate-400">Leadership that drives excellence</p>
        <div className="w-20 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
      </section>
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((m, i) => (
            <div key={m.id || i} className="card-hover bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm text-center">
              <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-slate-400/50 flex items-center justify-center text-3xl font-bold text-white">
                  {m.name?.charAt(0) || 'Z'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-lg">{m.name}</h3>
                <p className="text-red-600 text-sm font-semibold mt-1">{m.position}</p>
                {m.bio && <p className="text-slate-500 text-sm mt-3 leading-relaxed">{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
