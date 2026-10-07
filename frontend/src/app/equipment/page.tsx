'use client';
import { useEffect, useState } from 'react';
import { getEquipment } from '@/lib/api';

export default function EquipmentPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    getEquipment().then(setItems).catch(() => setItems([
      { id: 1, name: 'Excavator CAT 320', quantity: 8, category: 'Heavy Machinery', description: 'High-performance hydraulic excavators.' },
      { id: 2, name: 'Tower Crane 12T', quantity: 5, category: 'Lifting Equipment' },
      { id: 3, name: 'Concrete Mixer Truck', quantity: 12, category: 'Concrete Equipment' },
      { id: 4, name: 'Bulldozer D6', quantity: 4, category: 'Heavy Machinery' },
      { id: 5, name: 'Mobile Crane 50T', quantity: 3, category: 'Lifting Equipment' },
    ]));
  }, []);

  return (
    <div className="pt-24">
      <section className="page-hero text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Equipment Owned</h1>
        <p className="text-slate-400">Modern fleet for world-class delivery</p>
        <div className="w-20 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
      </section>
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((eq, i) => (
            <div key={eq.id || i} className="card-hover bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{eq.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{eq.category}</p>
                <p className="text-red-600 font-semibold mt-2">Qty: {eq.quantity}</p>
                {eq.description && <p className="text-xs text-slate-500 mt-1">{eq.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
