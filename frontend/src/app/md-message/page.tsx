'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getMDMessage, getMediaUrl } from '@/lib/api';

type ManagingDirectorMessage = {
  title: string;
  message: string;
  name: string;
  designation: string;
  photo?: string | null;
};

const fallbackMessage: ManagingDirectorMessage = {
  title: 'A Message from Our Managing Director',
  message: 'It is with great pride that I welcome you to ZH International. Since our inception, we have remained steadfast in our commitment to excellence, integrity, and innovation.\n\nAs we look ahead, we continue to invest in people, technology, and sustainable practices to build not just structures, but a better tomorrow for generations to come.',
  name: 'Managing Director',
  designation: 'Managing Director, ZH International',
};

export default function MDMessagePage() {
  const [message, setMessage] = useState<ManagingDirectorMessage | null>(null);
  const [photoUnavailable, setPhotoUnavailable] = useState(false);

  useEffect(() => {
    getMDMessage()
      .then((data) => setMessage(data?.message ? data : fallbackMessage))
      .catch(() => setMessage(fallbackMessage));
  }, []);

  useEffect(() => {
    setPhotoUnavailable(false);
  }, [message?.photo]);

  if (!message) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div role="status" aria-label="Loading message" className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    );
  }

  const photoUrl = message.photo ? getMediaUrl(message.photo) : '';
  const paragraphs = message.message.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="pt-24">
      <section className="page-hero text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-red-400">Leadership perspective</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-semibold text-white md:text-6xl">{message.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          A message on our values, our people, and the future we are building together.
        </p>
        <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-red-600" />
      </section>

      <section className="overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <article className="animate-fade-in-up overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.32)]">
            <div className="grid lg:items-start lg:grid-cols-[0.82fr_1.18fr]">
              <aside className="relative isolate min-h-[420px] overflow-hidden bg-slate-950 sm:min-h-[540px]">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_10%,rgba(220,38,38,0.35),transparent_48%),linear-gradient(145deg,#101c2c,#080f1c)]" />
                <div className="absolute -right-24 -top-20 -z-10 h-80 w-80 rounded-full border border-white/10 shadow-[0_0_0_36px_rgba(255,255,255,0.025),0_0_0_72px_rgba(255,255,255,0.02)]" />
                <div className="flex min-h-[inherit] flex-col items-center px-8 py-10 text-center">
                  <div className="relative mb-7 aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl shadow-black/30">
                    {photoUrl && !photoUnavailable ? (
                      <Image
                        key={photoUrl}
                        src={photoUrl}
                        alt={`Portrait of ${message.name}`}
                        fill
                        sizes="(max-width: 1024px) 280px, 280px"
                        unoptimized
                        className="object-cover object-center"
                        onError={() => setPhotoUnavailable(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                        <span className="grid h-24 w-24 place-items-center rounded-full border border-white/20 bg-white/10 text-5xl font-semibold">
                          {message.name?.trim().charAt(0).toUpperCase() || 'M'}
                        </span>
                        <span className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                          {photoUnavailable ? 'Portrait unavailable' : 'Leadership'}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Managing Director</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{message.name}</h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">{message.designation}</p>
                  <div className="mt-7 w-full max-w-[280px] border-t border-white/15 pt-6 text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">Our guiding principles</p>
                    <div className="mt-4 space-y-3">
                      {[
                        ['01', 'Creativity'],
                        ['02', 'Responsibility'],
                        ['03', 'Mutual trust'],
                      ].map(([number, value]) => (
                        <div key={number} className="flex items-center gap-3">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[10px] font-semibold text-red-300">
                            {number}
                          </span>
                          <span className="text-sm font-medium text-white/85">{value}</span>
                          <span className="ml-auto h-px w-8 bg-white/15" aria-hidden="true" />
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs leading-5 text-slate-300">
                      Building a better tomorrow through innovation, integrity, and sustainable growth.
                    </p>
                  </div>
                </div>
              </aside>

              <div className="px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                  <span className="h-px w-8 bg-red-500" />
                  A note from our leadership
                </div>
                <div className="mt-8 text-6xl font-serif leading-[0.6] text-red-100" aria-hidden="true">“</div>
                <div className="mt-5 space-y-5 text-justify text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className={`animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-10 flex flex-col gap-5 border-t border-slate-100 pt-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{message.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{message.designation}</p>
                  </div>
                  <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition-colors hover:text-red-800">
                    Learn about our company
                    <span aria-hidden="true" className="transition-transform hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Purposeful progress', text: 'Building responsibly for the needs of today and tomorrow.' },
              { title: 'People first', text: 'Valuing the teams and partnerships behind every achievement.' },
              { title: 'Built on trust', text: 'Growing through integrity, quality and dependable delivery.' },
            ].map((value, index) => (
              <div key={value.title} className={`animate-fade-in-up stagger-${index + 1} rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1`}>
                <span className="text-xs font-bold tracking-[0.18em] text-red-600">0{index + 1}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{value.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
