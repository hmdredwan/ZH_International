'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getHomepage, getMediaUrl } from '@/lib/api';

type HeroSlide = {
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaText: string;
  ctaLink: string;
};

const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'Engineering the future',
    title: 'Building what',
    emphasis: 'moves us forward.',
    description: 'From bold infrastructure to enduring places, we turn ambitious ideas into a better built world.',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2400&q=85',
    imageAlt: 'Contemporary architecture reaching into the sky',
    ctaText: 'Discover our projects',
    ctaLink: '/projects',
  },
  {
    eyebrow: 'Infrastructure with purpose',
    title: 'Connecting people.',
    emphasis: 'Creating possibility.',
    description: 'We deliver dependable engineering and construction solutions that help communities thrive.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2400&q=85',
    imageAlt: 'Construction team working on a major infrastructure project',
    ctaText: 'Discover our projects',
    ctaLink: '/projects',
  },
  {
    eyebrow: 'Built on trust',
    title: 'Made to last.',
    emphasis: 'Designed for life.',
    description: 'Quality, safety and integrity shape every detail of the places and partnerships we build.',
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=2400&q=85',
    imageAlt: 'Modern bridge architecture over the water',
    ctaText: 'Discover our projects',
    ctaLink: '/projects',
  },
];

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    getHomepage()
      .then(setData)
      .catch(() => {
        // Fallback static content when API offline
        setData({
          about: {
            short_description: 'ZH International is a leading multi-disciplinary organization committed to excellence in construction, engineering, and infrastructure development.',
            years_of_experience: 15,
            projects_completed: 120,
            clients_served: 85,
            team_members: 350,
          },
          philosophies: [
            { id: 1, title: 'Quality First', description: 'We never compromise on quality. Every project is executed to the highest international standards.', icon: 'shield' },
            { id: 2, title: 'Safety Commitment', description: 'The safety of our people and communities is paramount in every operation.', icon: 'hard-hat' },
            { id: 3, title: 'Innovation Driven', description: 'We embrace modern technology and innovative methods to deliver superior results.', icon: 'lightbulb' },
            { id: 4, title: 'Client Partnership', description: 'We build lasting relationships through transparency and shared success.', icon: 'handshake' },
          ],
          featured_projects: [
            { id: 1, title: 'Metro City Bridge Project', short_description: 'A landmark 1.2 km cable-stayed bridge.', location: 'Dhaka', year: 2024, slug: 'metro-city-bridge' },
            { id: 2, title: 'Skyline Business Tower', short_description: '30-storey Grade-A commercial complex.', location: 'Gulshan', year: 2023, slug: 'skyline-tower' },
            { id: 3, title: 'National Highway Expansion', short_description: '4-lane expansion of critical coastal highway.', location: "Chittagong", year: 2025, slug: 'highway-expansion' },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const about = data?.about || {};
  const philosophies = data?.philosophies?.length ? data.philosophies : [
    { id: 'quality', title: 'Quality First', description: 'We never compromise on quality. Every project is executed to the highest international standards.' },
    { id: 'safety', title: 'Safety Commitment', description: 'The safety of our people and communities is paramount in every operation.' },
    { id: 'innovation', title: 'Innovation Driven', description: 'We embrace modern technology and innovative methods to deliver superior results.' },
    { id: 'partnership', title: 'Client Partnership', description: 'We build lasting relationships through transparency and shared success.' },
  ];
  const projects = data?.featured_projects || [];
  const slides = useMemo<HeroSlide[]>(() => {
    const managedHeroes = Array.isArray(data?.heroes) ? data.heroes.filter((hero: any) => hero.is_active) : [];
    if (!managedHeroes.length) return heroSlides;
    return managedHeroes.map((hero: any, index: number) => ({
      eyebrow: 'ZH International',
      title: hero.title || 'Building a better tomorrow.',
      emphasis: '',
      description: hero.subtitle || about.short_description || 'Building a better tomorrow.',
      image: getMediaUrl(hero.background_image) || heroSlides[index % heroSlides.length].image,
      imageAlt: hero.title || 'ZH International construction project',
      ctaText: hero.cta_text || 'Discover our projects',
      ctaLink: hero.cta_link || '/projects',
    }));
  }, [about.short_description, data]);
  useEffect(() => {
    if (carouselPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [carouselPaused, slides.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70 tracking-widest text-sm">LOADING</p>
        </div>
      </div>
    );
  }

  const slideIndex = activeSlide % slides.length;
  const slide = slides[slideIndex];

  return (
    <>
      {/* Hero */}
      <section
        className="hero-carousel relative min-h-[760px] h-[100svh] max-h-[1100px] flex items-center overflow-hidden bg-slate-950"
        aria-roledescription="carousel"
        aria-label="ZH International featured work"
        onMouseEnter={() => setCarouselPaused(true)}
        onMouseLeave={() => setCarouselPaused(false)}
        onFocus={() => setCarouselPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setCarouselPaused(false);
        }}
      >
        {slides.map((item, index) => (
          <div
            key={item.image}
            className={`hero-carousel__image ${index === slideIndex ? 'is-active' : ''}`}
            style={{ backgroundImage: `url("${item.image}")` }}
            role="img"
            aria-label={item.imageAlt}
            aria-hidden={index !== slideIndex}
          />
        ))}
        <div className="hero-carousel__shade absolute inset-0" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-28 pb-36">
          <div key={activeSlide} className="max-w-4xl text-white animate-fade-in-up">
            <p className="mb-6 flex items-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-white/75">
              <span className="h-px w-10 bg-red-500" />
              {slide.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[0.98] tracking-[-0.045em]">
              {slide.title}<br />
              {slide.emphasis && <span className="text-red-400">{slide.emphasis}</span>}
            </h1>
            <p className="mt-7 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-white/75">
              {slide.description}
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link href={slide.ctaLink} className="btn-primary">
                {slide.ctaText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
              <Link href="/contact" className="btn-glass">
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-9 left-6 right-6 sm:left-10 sm:right-10 lg:left-12 lg:right-12 z-10 flex items-end justify-between gap-6">
          <div className="flex items-center gap-3" role="group" aria-label="Choose a hero slide">
            {slides.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`hero-carousel__dot ${index === slideIndex ? 'is-active' : ''}`}
                aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
                aria-pressed={index === slideIndex}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs font-medium tracking-[0.2em] text-white/65">
              {String(slideIndex + 1).padStart(2, '0')} <span className="text-white/30">/</span> {String(slides.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => setActiveSlide((slideIndex + slides.length - 1) % slides.length)}
              className="hero-carousel__arrow"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 12H5m6 6-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide((slideIndex + 1) % slides.length)}
              className="hero-carousel__arrow"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 sm:-mt-16 z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_24px_80px_-32px_rgba(15,23,42,0.28)] border border-white grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 overflow-hidden">
            {[
              { value: about.years_of_experience || 15, label: 'Years Experience', suffix: '+' },
              { value: about.projects_completed || 120, label: 'Projects Completed', suffix: '+' },
              { value: about.clients_served || 85, label: 'Clients Served', suffix: '+' },
              { value: about.team_members || 350, label: 'Team Members', suffix: '+' },
            ].map((stat, i) => (
              <div key={i} className="p-6 sm:p-8 text-center hover:bg-slate-50 transition-colors">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">
                  {stat.value}<span className="text-red-600">{stat.suffix}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company introduction */}
      <section className="overflow-hidden bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-8">
          <div className="animate-fade-in-up">
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
              <span className="h-px w-9 bg-red-500" /> Who we are
            </p>
            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Shaping a better world, <span className="text-red-600">one project at a time.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              {about.short_description || 'ZH International brings people, engineering and ambition together to deliver construction and infrastructure that stands the test of time.'}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
              From the first conversation to the final handover, we focus on safe delivery, lasting partnerships and quality in every detail.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/about" className="btn-primary">
                Discover our company
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Building a better tomorrow</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              role="img"
              aria-label="Modern high-rise construction project"
              className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-cover bg-center shadow-2xl shadow-slate-900/15"
              style={{
                backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(5, 12, 22, 0.55)), url("${about.image ? getMediaUrl(about.image) : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85'}")`,
              }}
            />
            <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur sm:-left-8 sm:right-12 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Quality. Safety. Integrity.</p>
                  <p className="mt-1 text-sm text-slate-500">The standards behind everything we build.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core capabilities */}
      <section className="bg-slate-950 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                <span className="h-px w-9 bg-red-500" /> What we do
              </p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl md:text-5xl">
                The expertise to take on what’s next.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400 sm:text-base">
              Integrated capabilities, reliable teams and a practical approach to complex projects.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Building & construction',
                detail: 'Creating considered spaces and dependable buildings, from early planning through delivery.',
                image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=85',
                alt: 'Construction professionals working together on site',
                number: '01',
              },
              {
                title: 'Infrastructure & civil works',
                detail: 'Delivering essential infrastructure that connects communities and supports progress.',
                image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85',
                alt: 'City skyline and urban infrastructure at dusk',
                number: '02',
              },
              {
                title: 'Engineering solutions',
                detail: 'Bringing technical knowledge and careful coordination to demanding project challenges.',
                image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85',
                alt: 'Contemporary architectural engineering',
                number: '03',
              },
            ].map((capability) => (
              <article key={capability.number} className="group relative isolate min-h-[390px] overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
                <div
                  role="img"
                  aria-label={capability.alt}
                  className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url("${capability.image}")` }}
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/5" />
                <div className="flex min-h-[390px] flex-col justify-between p-6 sm:p-7">
                  <span className="self-start rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-white/80 backdrop-blur">
                    {capability.number} / 03
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">{capability.title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-200">{capability.detail}</p>
                    <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-red-300">
                      Discuss a project
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy feature */}
      <section className="overflow-hidden bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
          <div className="relative order-2 lg:order-1">
            <div
              role="img"
              aria-label="Construction team planning a project together"
              className="aspect-[5/4] rounded-[2rem] bg-cover bg-center shadow-2xl shadow-slate-900/15"
              style={{
                backgroundImage: 'linear-gradient(180deg, rgba(8,15,28,0.02), rgba(8,15,28,0.18)), url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85")',
              }}
            />
            <div className="absolute -bottom-5 left-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-left-5 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Our foundation</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">Creativity. Responsibility. Mutual trust.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
              <span className="h-px w-9 bg-red-500" /> How we think
            </p>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Progress built on <span className="text-red-600">trust and fresh thinking.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Construction is always evolving. We bring practical industry knowledge together with modern methods, responsible operations and a commitment to continuous improvement.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              From tender opportunities and supply coordination to construction delivery, our aim is to create lasting value for clients, partners and the communities we serve.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Creativity', 'Responsibility', 'Mutual trust'].map((value) => (
                <span key={value} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">{value}</span>
              ))}
            </div>
            <Link href="/philosophy" className="btn-primary mt-8">
              Explore our philosophy
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy preview */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-red-600 font-semibold tracking-widest text-sm uppercase mb-2">Our Foundation</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Business Philosophy</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {philosophies.slice(0, 4).map((p: any, i: number) => (
              <div
                key={p.id || i}
                className="card-hover bg-white rounded-xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/philosophy" className="btn-outline">
              View All Philosophies
            </Link>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="home-approach relative isolate overflow-hidden bg-slate-950 py-20 text-white sm:py-28">
        <div className="home-approach__glow home-approach__glow--top" aria-hidden="true" />
        <div className="home-approach__glow home-approach__glow--bottom" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
          <div className="home-approach__content">
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
              <span className="h-px w-9 bg-red-500" /> From ambition to impact
            </p>
            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              Good work starts with <span className="text-red-400">a thoughtful process.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              Every opportunity deserves careful attention. We bring people, planning and practical experience together to move work forward with purpose.
            </p>

            <div className="home-approach__steps mt-9">
              {[
                {
                  number: '01',
                  title: 'Understand the opportunity',
                  detail: 'Listen closely, clarify requirements and align on what success means.',
                },
                {
                  number: '02',
                  title: 'Plan with purpose',
                  detail: 'Coordinate documentation, sourcing and delivery around project needs.',
                },
                {
                  number: '03',
                  title: 'Build lasting value',
                  detail: 'Work responsibly, communicate clearly and keep improving at every stage.',
                },
              ].map((step) => (
                <article className="home-approach__step group" key={step.number}>
                  <span className="home-approach__step-number">{step.number}</span>
                  <div>
                    <h3 className="font-semibold text-white transition-colors group-hover:text-red-300">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{step.detail}</p>
                  </div>
                  <svg className="home-approach__step-arrow h-5 w-5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </article>
              ))}
            </div>

            <Link href="/about" className="btn-glass mt-8">
              Learn about our approach
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="home-approach__visual">
            <div
              role="img"
              aria-label="Construction team reviewing project plans at a work site"
              className="home-approach__image"
              style={{
                backgroundImage: 'linear-gradient(180deg, rgba(4,10,20,0.02) 30%, rgba(4,10,20,0.6) 100%), url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85")',
              }}
            />
            <div className="home-approach__image-ring" aria-hidden="true" />
            <div className="home-approach__badge">
              <span className="home-approach__badge-icon" aria-hidden="true">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Our promise</span>
                <span className="mt-1 block font-semibold text-slate-950">Responsibility in every step</span>
              </span>
            </div>
            <div className="home-approach__caption">
              <span className="h-px w-8 bg-red-400" />
              <span>Built together. Moving forward.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-red-600 font-semibold tracking-widest text-sm uppercase mb-2">Our Work</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Featured Projects</h2>
            </div>
            <Link href="/projects" className="text-red-600 font-semibold hover:underline flex items-center gap-1">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any, i: number) => (
              <Link
                key={project.id || i}
                href={`/projects/${project.slug || project.id}`}
                className="group card-hover bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm"
              >
                <div
                  role="img"
                  aria-label={`${project.title} project`}
                  className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 bg-cover bg-center"
                  style={project.featured_image ? {
                    backgroundImage: `linear-gradient(180deg, transparent, rgba(15, 23, 42, 0.42)), url("${getMediaUrl(project.featured_image)}")`,
                  } : {
                    backgroundImage: `linear-gradient(180deg, transparent, rgba(15, 23, 42, 0.42)), url("${[
                      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1100&q=85',
                      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=85',
                      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1100&q=85',
                    ][i % 3]}")`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!project.featured_image && <span className="text-white/35 text-6xl font-bold">{(project.year || 'ZH').toString().slice(-2)}</span>}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {project.year || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {project.short_description}
                  </p>
                  <div className="flex items-center text-xs text-slate-500 gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {project.location || '—'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>}

      {/* CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Build Something Great?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Partner with ZH International for world-class construction and engineering solutions.
          </p>
          <Link href="/contact" className="btn-primary text-base px-10 py-4">
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
