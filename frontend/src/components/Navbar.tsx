'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type NavLink = {
  label: string;
  href: string;
  children?: never;
} | {
  label: string;
  children: { href: string; label: string }[];
  href?: never;
};

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  {
    label: 'About Us',
    children: [
      { href: '/about', label: 'About' },
      { href: '/philosophy', label: 'Philosophy' },
      { href: '/md-message', label: 'MD Message' },
    ],
  },
  { href: '/projects', label: 'Projects' },
  {
    label: 'Resources',
    children: [
      { href: '/management', label: 'Management' },
      { href: '/manpower', label: 'Manpower' },
      { href: '/equipment', label: 'Equipment' },
    ],
  },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const solidHeader = scrolled || pathname !== '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenDropdown(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`));
  const hasActiveChild = (children: { href: string; label: string }[]) => children.some((child) => isActive(child.href));
  const linkColor = (active: boolean) => active
    ? 'text-red-600 bg-red-50'
    : solidHeader
      ? 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
      : 'text-white/90 hover:text-white hover:bg-white/10';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidHeader
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] border-b border-slate-100 py-2'
          : 'bg-transparent border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="ZH International"
              width={56}
              height={56}
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              style={{ width: 'auto' }}
              priority
            />
            <div className="hidden sm:block">
              <span className={`font-bold text-lg tracking-tight ${solidHeader ? 'text-slate-800' : 'text-white'}`}>
                ZH <span className="text-red-600">INTERNATIONAL</span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              if (link.children) {
                const active = hasActiveChild(link.children);
                const expanded = openDropdown === link.label;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenDropdown(null);
                    }}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={expanded}
                      onClick={() => setOpenDropdown(expanded ? null : link.label)}
                      className={`inline-flex items-center gap-1 px-2 py-2 text-xs font-medium rounded-md transition-colors xl:text-sm ${linkColor(active)}`}
                    >
                      {link.label}
                      <svg className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {expanded && (
                      <div className="absolute left-0 top-full z-50 w-56 pt-2">
                        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 text-slate-800 shadow-xl shadow-slate-900/15 animate-fade-in">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                isActive(child.href) ? 'bg-red-50 font-semibold text-red-700' : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 py-2 text-xs xl:text-sm font-medium rounded-md transition-colors ${linkColor(isActive(link.href))}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-md ${solidHeader ? 'text-slate-800' : 'text-white'}`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-navigation" className="lg:hidden mt-4 pb-3 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
            <nav aria-label="Mobile navigation" className="p-2">
              {navLinks.map((link) => {
                if (link.children) {
                  const active = hasActiveChild(link.children);
                  const expanded = openMobileDropdown === link.label;
                  return (
                    <div key={link.label} className="border-b border-slate-100 last:border-0">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setOpenMobileDropdown(expanded ? null : link.label)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold ${
                          active ? 'text-red-700' : 'text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {link.label}
                        <svg className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      {expanded && (
                        <div className="mb-2 ml-3 space-y-1 border-l border-slate-200 pl-3">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                                isActive(child.href) ? 'bg-red-50 font-semibold text-red-700' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                      isActive(link.href) ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
