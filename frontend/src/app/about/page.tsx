'use client';
import { useEffect, useState } from 'react';
import { getAbout } from '@/lib/api';

export default function AboutPage() {
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    getAbout().then(setAbout).catch(() => setAbout({
      title: 'About ZH International',
      short_description: 'ZH International is a leading multi-disciplinary organization committed to excellence.',
      full_content: 'Established with a vision to build a better tomorrow, ZH International has grown into a trusted name in the industry. We deliver world-class projects with integrity, innovation, and unmatched quality.',
      vision: 'To be a globally recognized leader in sustainable infrastructure and construction excellence.',
      mission: 'Delivering innovative, high-quality projects that create lasting value for our clients, communities, and stakeholders.',
      values: 'Integrity, Excellence, Innovation, Safety, Sustainability, Teamwork',
    }));
  }, []);

  if (!about) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pt-24">
      <section className="page-hero text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{about.title}</h1>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
      </section>
      <section className="py-20 max-w-5xl mx-auto px-4">
        <p className="text-lg text-slate-600 leading-relaxed mb-10">{about.short_description}</p>
        <div className="text-slate-700 leading-relaxed whitespace-pre-line mb-16">{about.full_content}</div>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-600 rounded-full" /> Vision
            </h3>
            <p className="text-slate-600 leading-relaxed">{about.vision}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-600 rounded-full" /> Mission
            </h3>
            <p className="text-slate-600 leading-relaxed">{about.mission}</p>
          </div>
        </div>
        {about.values && (
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Our Core Values</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {about.values.split(',').map((v: string, i: number) => (
                <span key={i} className="px-5 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold border border-red-100">
                  {v.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
