'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPhilosophies } from '@/lib/api';

const philosophySections = [
  {
    number: '01',
    eyebrow: 'Our approach',
    title: 'Our Business Philosophy',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85',
    alt: 'Contemporary architecture illustrating thoughtful design and modern construction',
    paragraphs: [
      <>At ZH International, we recognize that the construction industry is continuously evolving through advancements in engineering, technology, materials, project management, and operational techniques. So we focus on <strong>Creativity, Responsibility &amp; Mutual Trust.</strong> We believe that adopting contemporary approaches and developing innovative capabilities are essential to improving construction quality, optimizing resources, enhancing productivity, and meeting the demands of a competitive market.</>,
      'Our business philosophy is centered on combining practical industry knowledge with modern methodologies and a commitment to continuous improvement. We aim to develop the organizational capabilities necessary to undertake diverse construction projects, participate in institutional and public-sector tender opportunities, and support clients through efficient supply and service delivery. By maintaining a professional approach to procurement, sourcing, coordination, and project-related activities, we seek to establish lasting value for our clients and business partners.',
    ],
  },
  {
    number: '02',
    eyebrow: 'What we do',
    title: 'Construction and Supply Trading Operations',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85',
    alt: 'Construction professionals coordinating work on an active project site',
    paragraphs: [
      'ZH International is primarily engaged in construction-related business and supply trading activities, with a particular focus on tender-based opportunities in Bangladesh. Our business operations are intended to address the requirements of government institutions, private organizations, corporate clients, and other eligible entities, subject to the relevant project specifications, contractual requirements, and applicable regulations.',
      'Our construction-oriented vision emphasizes the gradual development of capabilities in modern building practices, infrastructure-related activities, technical coordination, and project execution. Alongside construction, our supply trading operations aim to facilitate the sourcing and delivery of products, materials, equipment, and other required items in accordance with client specifications and contractual commitments.',
      'We understand that successful tender business requires careful attention to documentation, compliance, procurement planning, supplier coordination, pricing considerations, delivery schedules, and professional communication. Accordingly, ZH International seeks to strengthen its operational systems and business relationships to support reliable and efficient performance across its activities.',
    ],
  },
  {
    number: '03',
    eyebrow: 'Progress with purpose',
    title: 'Commitment to Innovation and Modernization',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=85',
    alt: 'Engineer using modern technology to plan and coordinate technical work',
    paragraphs: [
      'One of the principal objectives of ZH International is to contribute to the introduction of updated construction methods and innovative approaches within Bangladesh’s construction sector. We recognize the importance of technological development, improved construction processes, resource efficiency, workplace safety, and sustainable practices in shaping the future of the industry.',
      'Our long-term approach involves exploring opportunities to incorporate relevant technologies, modern engineering concepts, and improved management techniques as our technical and operational capabilities expand. We aspire to foster a business culture that values innovation, professional development, learning, and adaptability, enabling the organization to respond effectively to emerging industry trends and changing client expectations.',
      'Through this approach, ZH International aims to build a strong foundation for future growth while contributing to the broader advancement of construction practices in Bangladesh.',
    ],
  },
  {
    number: '04',
    eyebrow: 'A long-term view',
    title: 'Vision for Diversification and Growth',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=85',
    alt: 'Growing city skyline representing sustainable business and infrastructure development',
    paragraphs: [
      'ZH International has a long-term ambition to expand its business operations across multiple sectors, gradually developing a diversified business portfolio supported by professional management, strategic partnerships, and sustainable organizational growth. While construction and supply trading remain our principal areas of focus, we intend to explore additional opportunities that complement our capabilities and align with market demand.',
      'Our growth strategy is based on strengthening our core business activities, developing reliable supplier and client networks, improving operational efficiency, and pursuing opportunities for expansion in a structured and responsible manner. We believe that sustainable growth is achieved through consistent performance, sound business decisions, ethical conduct, and the ability to adapt to an increasingly competitive business environment.',
      'Our ultimate aspiration is to establish ZH International as one of the largest and most respected construction firms in Bangladesh, recognized for its commitment to modern construction methodology, quality-oriented practices, professional service, and responsible contribution to national development.',
    ],
  },
  {
    number: '05',
    eyebrow: 'People and partnerships',
    title: 'Our Commitment to Stakeholders',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85',
    alt: 'Colleagues collaborating in a professional planning meeting',
    paragraphs: [
      'The confidence of our clients, business partners, suppliers, employees, and other stakeholders is an essential part of our organizational development. ZH International is committed to cultivating professional relationships based on transparency, mutual respect, reliability, and responsible business conduct.',
      'We aim to approach every business opportunity with diligence and a commitment to fulfilling applicable requirements. By emphasizing effective communication, careful planning, timely coordination, and continuous improvement, we seek to strengthen stakeholder confidence and develop long-term relationships that support mutual success.',
    ],
  },
  {
    number: '06',
    eyebrow: 'The road ahead',
    title: 'Looking Ahead',
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85',
    alt: 'Modern bridge extending toward the horizon',
    paragraphs: [
      'Since its establishment in 2018, ZH International has been guided by an ambition to build a progressive and professionally managed organization capable of participating in Bangladesh’s evolving construction and commercial landscape. Our journey toward becoming a leading construction firm is founded on a long-term commitment to learning, innovation, quality, and operational development.',
      'With the leadership of Mr. Sakhir Ahammad, Proprietor, ZH International looks forward to expanding its capabilities, embracing emerging opportunities, developing its sectoral presence, and contributing to the development of modern construction and infrastructure in Bangladesh.',
    ],
  },
];

const fallbackValues = [
  { id: 'quality', title: 'Quality First', description: 'We never compromise on quality. Every project is executed to the highest international standards.' },
  { id: 'safety', title: 'Safety Commitment', description: 'The safety of our people and communities is paramount in every operation we undertake.' },
  { id: 'innovation', title: 'Innovation Driven', description: 'We embrace modern technology and innovative methods to deliver superior results.' },
  { id: 'partnership', title: 'Client Partnership', description: 'We build lasting relationships through transparency, communication, and shared success.' },
];

export default function PhilosophyPage() {
  const [items, setItems] = useState(fallbackValues);

  useEffect(() => {
    getPhilosophies()
      .then((records) => {
        if (records.length) setItems(records);
      })
      .catch(() => {
        // Keep the editorial values visible when the content service is unavailable.
      });
  }, []);

  return (
    <div className="pt-24">
      <section className="page-hero text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-red-400">Creativity · Responsibility · Mutual Trust</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-semibold text-white md:text-6xl">Our Business Philosophy</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          The ideas, standards and relationships that guide how we build and grow.
        </p>
        <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-red-600" />
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-600">What guides us</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Principles behind every partnership</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <article key={item.id || index} className="card-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-sm font-bold tracking-widest text-red-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {['Creativity', 'Responsibility', 'Mutual Trust'].map((value, index) => (
              <div key={value} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  0{index + 1}
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">{value}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {[
                      'Modern thinking that improves how we deliver.',
                      'Professional conduct at every stage of our work.',
                      'Strong relationships built on transparency.',
                    ][index]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {philosophySections.map((section, index) => (
          <section
            key={section.number}
            className={`grid items-center gap-9 border-b border-slate-200 py-14 last:border-0 sm:py-20 lg:grid-cols-2 lg:gap-16 ${
              index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="relative">
              <div
                role="img"
                aria-label={section.alt}
                className="aspect-[4/3] overflow-hidden rounded-3xl bg-cover bg-center shadow-xl shadow-slate-900/10"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0.15)), url("${section.image}")` }}
              />
              <span className="absolute -bottom-4 right-5 rounded-xl bg-white px-4 py-2 text-xs font-bold tracking-[0.18em] text-red-600 shadow-lg sm:right-8">
                ZH INTERNATIONAL · {section.number}
              </span>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-600">{section.eyebrow}</p>
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl">
                {section.title}
              </h2>
              <div className="my-6 h-1 w-14 rounded-full bg-red-600" />
              <div className="space-y-4 text-justify text-[0.98rem] leading-7 text-slate-600">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-center sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(220,38,38,0.26),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">Our promise</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            ZH International — Building a Better Tomorrow
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">Through Innovation, Integrity, and Sustainable Growth.</p>
          <Link href="/contact" className="btn-primary mt-8">Build with us</Link>
        </div>
      </section>
    </div>
  );
}
