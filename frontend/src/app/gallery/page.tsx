'use client';
import { useEffect, useState } from 'react';
import { getGallery } from '@/lib/api';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  useEffect(() => {
    getGallery().then((d: any) => setImages(d.results || d || [])).catch(() => setImages([]));
  }, []);

  return (
    <div className="pt-24">
      <section className="page-hero text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Gallery</h1>
        <p className="text-slate-400">Moments from our journey</p>
        <div className="w-20 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
      </section>
      <section className="py-20 max-w-7xl mx-auto px-4">
        {images.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Gallery Coming Soon</h3>
            <p className="text-slate-500">Images will appear here once uploaded from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={img.id || i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative group">
                {img.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.image} alt={img.title || ''} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No image</div>
                )}
                {(img.title || img.caption) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                    <p className="text-white text-sm font-medium">{img.title || img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
