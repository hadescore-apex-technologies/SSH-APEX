import { useState, useEffect } from 'react';
import CardIcon from '../components/CardIcon';
import laboratoryVision from '../assets/laboratory_vision.png';
import controlRoomHero from '../assets/control_room_hero.png';
import TestimonialCarousel from '../components/TestimonialCarousel';
import SEO from '../components/SEO';
import { getBackendUrl } from '../utils/api';
import RotatingLogo from '../components/RotatingLogo';


const comparisonFeatures = [
  { label: 'Custom Software', startup: true, smb: true, edu: false, enterprise: true },
  { label: 'Brand Identity', startup: true, smb: true, edu: false, enterprise: true },
  { label: 'AI Integration', startup: true, smb: false, edu: false, enterprise: true },
  { label: 'SEO & Marketing', startup: true, smb: true, edu: false, enterprise: true },
  { label: 'CRM / ERP Setup', startup: false, smb: true, edu: false, enterprise: true },
  { label: 'Workshops & MOU', startup: false, smb: false, edu: true, enterprise: false },
  { label: 'Internship Programs', startup: false, smb: false, edu: true, enterprise: false },
  { label: 'Cybersecurity Audit', startup: false, smb: false, edu: false, enterprise: true },
  { label: 'Incubation Support', startup: true, smb: false, edu: false, enterprise: false },
  { label: 'Dedicated Dev Team', startup: false, smb: false, edu: false, enterprise: true },
];

const caseStudies = [
  {
    tag: 'Startup',
    color: '#0ea5e9',
    title: 'Zero to Launch in 60 Days',
    desc: 'A fintech startup came to us with an idea and no tech team. We delivered an MVP web platform, brand identity, and digital marketing setup — on time, on budget.',
    img: laboratoryVision,
    metrics: ['60-day delivery', 'Full MVP', 'Brand + Marketing'],
  },
  {
    tag: 'Enterprise',
    color: '#8b5cf6',
    title: 'AI-Powered Operations for a Manufacturing Firm',
    desc: 'We integrated custom AI dashboards, automated inventory tracking, and a cybersecurity audit for a mid-size manufacturing company expanding to three new locations.',
    img: controlRoomHero,
    metrics: ['3 locations', 'AI dashboards', 'Security hardened'],
  },
];

const Check = ({ active, color }) => active ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || 'var(--accent)'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function BentoSolutionCard({ solution, index }) {
  return (
    <div className="bento-solution-card" style={{ animationDelay: `${index * 0.1}s`, '--accent-color': solution.color }}>
      <div className="bento-icon-wrapper">
        <CardIcon type={solution.type} />
      </div>
      <h3 className="bento-title">{solution.title}</h3>
      <p className="bento-subtitle">{solution.subtitle}</p>
      <div className="bento-divider"></div>
      <ul className="bento-tags">
        {solution.tags.map((tag, i) => (
          <li key={i} className="bento-tag-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="bento-check">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SolutionsPage({ navigateTo }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [solutionsData, setSolutionsData] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_solutions');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch(getBackendUrl('/api/solutions/'))
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map(s => ({
            type: s.icon_type,
            color: s.accent_color || '#0ea5e9',
            title: s.title,
            subtitle: s.subtitle,
            tags: s.tags_list || [],
          }));
          setSolutionsData(formatted);
          localStorage.setItem('hadescore_cache_solutions', JSON.stringify(formatted));
        }
      })
      .catch(() => {});
  }, []);


  return (
    <div style={{ paddingBottom: '2rem' }}>
      <SEO pageName="solutions" />
      {/* Hero */}
      <section className="page-hero-section" style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060912',
        backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 18, 0.75), rgba(6, 9, 18, 0.95)), url(https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80)`
      }}>
        <RotatingLogo opacity={0.12} size="default" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '900px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 4.75rem)',
            fontWeight: '900',
            maxWidth: '900px',
            margin: '0 auto 1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            fontFamily: 'Outfit, sans-serif',
          }}>
            Solutions Built for <span style={{ background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Your World</span>
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            maxWidth: '780px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            We don't believe in one-size-fits-all. Our solutions are tailored combinations of services designed for specific industries and business types.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigateTo('contact')}>Find My Solution</button>
            <button className="btn btn-secondary" style={{ border: '1px solid var(--border)' }} onClick={() => navigateTo('services')}>View All Services →</button>
          </div>
        </div>
      </section>

      {/* Content wrapper for scrolling contents */}
      <div className="page-content-wrapper">

      {/* Bento Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 4rem', padding: '0 1rem' }}>
        <div className="bento-grid">
          {solutionsData.map((sol, i) => (
            <BentoSolutionCard key={i} solution={sol} index={i} />
          ))}
        </div>
      </section>

      {/* Implementation Process */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 4rem', padding: '0 1rem' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Process</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.4rem' }}>How We Implement</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {[
            { step: '01', title: 'Discovery', desc: 'We analyze your requirements and define scope.' },
            { step: '02', title: 'Design', desc: 'We craft intuitive and scalable architectures.' },
            { step: '03', title: 'Development', desc: 'We build the solution with cutting-edge tech.' },
            { step: '04', title: 'Deployment', desc: 'We launch, monitor, and scale the product.' }
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(255,255,255,0.05)', marginBottom: '-1.5rem', pointerEvents: 'none' }}>{s.step}</div>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem', position: 'relative' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 4rem', padding: '0 1rem' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>In Action</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.4rem' }}>Real Solutions, Real Results</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {caseStudies.map((cs, i) => (
            <div key={i} className="glass-card case-study-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={cs.img}
                  alt={cs.title}
                  className="case-study-img"
                  style={{ width: '100%', height: '280px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13,17,23,0.9) 0%, transparent 60%)',
                }} />
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: cs.color,
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>{cs.tag}</span>
              </div>
              <div className="case-study-body" style={{ padding: '1.75rem' }}>
                <h3 className="case-study-title" style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>{cs.title}</h3>
                <p className="case-study-desc" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{cs.desc}</p>
                <div className="case-study-metrics" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {cs.metrics.map((m, j) => (
                    <span key={j} style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(88,166,255,0.2)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                    }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials section */}
      <TestimonialCarousel />

      {/* CTA */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="interactive-cta-banner" style={{ padding: '3rem 2rem' }}>
          <div className="cta-glow"></div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Not sure which solution fits?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Tell us about your organisation and we'll map out the right solution for your goals.
          </p>
          <button className="premium-cta-btn" onClick={() => navigateTo('contact')} style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
            Talk to Us
          </button>
        </div>
      </section>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .case-study-card {
            max-width: 450px;
            margin: 0 auto;
            width: 100%;
          }
          .case-study-img {
            height: 220px !important;
          }
          .case-study-body {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.25rem !important;
          }
          .case-study-desc {
            text-align: center;
            margin-bottom: 1.25rem;
            font-size: 0.82rem !important;
          }
          .case-study-metrics {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default SolutionsPage;
