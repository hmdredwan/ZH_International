'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getProjects().then((d: any) => setProjects(d.results || d || [])).catch(() => setProjects([
      { id: 1, title: 'Metro City Bridge Project', short_description: 'A landmark 1.2 km cable-stayed bridge connecting major urban corridors.', location: 'Dhaka', year: 2024, status: 'completed', slug: 'metro-city-bridge' },
      { id: 2, title: 'Skyline Business Tower', short_description: '30-storey Grade-A commercial complex with modern amenities.', location: 'Gulshan, Dhaka', year: 2023, status: 'completed', slug: 'skyline-tower' },
      { id: 3, title: 'National Highway Expansion', short_description: '4-lane expansion of critical coastal highway corridor.', location: "Chittagong-Cox's Bazar", year: 2025, status: 'ongoing', slug: 'highway-expansion' },
    ]));
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="pt-24">
      <section className="page-hero text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Our Projects</h1>
        <p className="text-slate-400">Delivering excellence across every engagement</p>
        <div className="w-20 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
      </section>
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'completed', 'ongoing', 'upcoming'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition ${filter === f ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p, i) => (
            <Link key={p.id || i} href={`/projects/${p.slug || p.id}`}
              className="group card-hover bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
              <div className="aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/15 text-7xl font-bold">{(p.year || '').toString().slice(-2)}</span>
                </div>
                <span className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded ${p.status === 'completed' ? 'bg-emerald-500 text-white' : p.status === 'ongoing' ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'}`}>
                  {p.status}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-red-600 transition mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{p.short_description}</p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{p.location}</span>
                  <span>{p.year}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
