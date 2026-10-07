'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#080f1c] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="ZH International" width={48} height={48} className="h-12 w-auto" style={{ width: 'auto' }} />
              <div>
                <div className="font-bold text-white text-lg">ZH INTERNATIONAL</div>
                <div className="text-xs text-slate-400 tracking-wider">BUILDING A BETTER TOMORROW</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              A multi-disciplinary organization delivering excellence in construction, engineering and infrastructure development worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/philosophy', label: 'Business Philosophy' },
                { href: '/projects', label: 'Completed Projects' },
                { href: '/management', label: 'Company Management' },
                { href: '/md-message', label: 'MD Message' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-red-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Resources</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/equipment', label: 'Equipment Owned' },
                { href: '/manpower', label: 'Manpower' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact Us' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-red-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@zhinternational.com" className="hover:text-red-400">info@zhinternational.com</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+880 1XXX-XXXXXX</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ZH International. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <p className="hidden sm:block tracking-widest text-xs uppercase">Building A Better Tomorrow</p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white focus-visible:text-white"
            >
              <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 10V7a5 5 0 0110 0v3m-11 0h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2zm6 4v3" />
              </svg>
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
