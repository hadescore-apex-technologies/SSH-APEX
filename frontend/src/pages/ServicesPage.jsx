import { useEffect, useState, useRef } from 'react';
import CardIcon from '../components/CardIcon';
import SEO from '../components/SEO';
import { getBackendUrl } from '../utils/api';
import RotatingLogo from '../components/RotatingLogo';

const SERVICE_OPTIONS = ['Technology / Software', 'Digital Marketing', 'AI & Automation', 'Cybersecurity', 'UI/UX Design', 'Multiple Services'];
const BUDGET_OPTIONS = ["Under $1,000", "$1,000 – $5,000", "$5,000 – $20,000", "$20,000+", "Let's discuss"];
const TOTAL_STEPS = 4;

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-main)',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'inherit',
};

const processSteps = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'We start by understanding your goals, challenges, and timeline before recommending any solution.'
  },
  {
    num: '02',
    title: 'Proposal & Planning',
    desc: 'We deliver a detailed scope, timeline, and cost breakdown. No hidden fees, no surprises — full transparency.'
  },
  {
    num: '03',
    title: 'Build & Deliver',
    desc: 'Our team executes with regular updates and milestone reviews. You stay in control throughout the entire process.'
  }
];

const industries = [
  { icon: 'FIN', label: 'Finance & Fintech' },
  { icon: 'HLT', label: 'Healthcare' },
  { icon: 'EDU', label: 'Education & EdTech' },
  { icon: 'RET', label: 'Retail & E-Commerce' },
  { icon: 'SUP', label: 'Logistics & Supply Chain' },
  { icon: 'MFG', label: 'Manufacturing' },
  { icon: 'incubate', label: 'Startups & Incubation' },
  { icon: 'cpu', label: 'Enterprise IT' }
];

const advantages = [
  {
    icon: 'growth',
    title: 'Multi-Domain Expertise',
    desc: 'One team covering software, marketing, AI, cybersecurity, and more — no need to manage multiple vendors.'
  },
  {
    icon: 'ai',
    title: 'AI-First Approach',
    desc: 'We bake intelligence into every solution — from automated workflows to smart analytics dashboards.'
  },
  {
    icon: 'incubate',
    title: 'Startup-Friendly',
    desc: 'Flexible engagement models, milestone-based billing, and incubation support for early-stage teams.'
  },
  {
    icon: 'web',
    title: 'End-to-End Delivery',
    desc: 'Strategy, design, development, and launch — we see every project from first idea to live production.'
  }
];

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOutQuad * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, started]);

  return <span ref={elementRef}>{count}{suffix}</span>;
};

const InteractiveServiceCard = ({ service, index }) => {
  return (
    <div className="interactive-service-card vertical-card" style={{ animationDelay: `${index * 0.15}s`, display: 'flex', flexDirection: 'column' }}>
      <div className="service-card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
        <div className="service-card-icon">
          <CardIcon type={service.type} />
        </div>
        <div>
          <h2 className="service-card-title" style={{ fontSize: '1.25rem' }}>{service.title}</h2>
          <p className="service-card-subtitle" style={{ fontSize: '0.9rem' }}>{service.subtitle}</p>
        </div>
      </div>
      <div className="service-card-body" style={{ flexGrow: 1 }}>
        <ul className="service-tags-list">
          {service.tags.map((tag, i) => (
            <li key={i} className="service-tag-item" style={{ fontSize: '0.9rem', alignItems: 'flex-start' }}>
              <span className="service-tag-bullet" style={{ marginTop: '0.4rem' }}></span>
              <span style={{ lineHeight: '1.4' }}>{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function ServicesPage({ navigateTo }) {
  const [activeStep, setActiveStep] = useState(0);
  const [servicesData, setServicesData] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_services');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const servicesRef = useRef(null);

  useEffect(() => {
    fetch(getBackendUrl('/api/services/'))
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map(s => ({
            type: s.icon_type,
            title: s.title,
            subtitle: s.subtitle,
            tags: s.tags_list || [],
          }));
          setServicesData(formatted);
          localStorage.setItem('hadescore_cache_services', JSON.stringify(formatted));
        }
      })
      .catch(() => {});
  }, []);


  return (
    <div style={{ paddingBottom: '2rem' }}>
      <SEO pageName="services" />
      <section
        className="page-hero-section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#060912',
          backgroundImage: 'linear-gradient(to bottom, rgba(6, 9, 18, 0.75), rgba(6, 9, 18, 0.95)), url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80)',
        }}
      >
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
            What We <span style={{ background: 'linear-gradient(135deg, #38bdf8, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Build For You</span>
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            maxWidth: '780px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            End-to-end technology and marketing services for startups, SMBs, enterprises, and institutions. Every service is built to create real impact.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="premium-cta-btn"
              onClick={() => navigateTo('start-project')}
              style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', background: 'linear-gradient(135deg, #38bdf8, #2dd4bf)' }}
            >
              Start a Project
            </button>
          </div>
        </div>
      </section>

      {/* Content wrapper for scrolling contents */}
      <div className="page-content-wrapper">

      {/* Animated Stats Section */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 5rem', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ background: '#1c2128', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ade80', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
              <AnimatedCounter end={200} suffix="+" />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Projects Delivered</div>
          </div>

          <div style={{ background: '#1c2128', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ade80', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
              <AnimatedCounter end={50} suffix="+" />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Clients</div>
          </div>

          <div style={{ background: '#1c2128', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ade80', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
              <AnimatedCounter end={8} suffix="+" />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Service Domains</div>
          </div>

          <div style={{ background: '#1c2128', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ade80', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
              <AnimatedCounter end={99} suffix="%" />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Client Satisfaction</div>
          </div>

        </div>
      </section>

      {/* Services List */}
      <section id="service-domains" ref={servicesRef} style={{ maxWidth: '1400px', margin: '0 auto 6rem', padding: '0 2rem' }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>What We Do</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem' }}>Our Service Domains</h2>
        </div>
        <div className="interactive-services-container">
          {servicesData.map((service, i) => (
            <InteractiveServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* How We Work */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 6rem', padding: '0 1rem' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Process</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem' }}>How We Work</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          {/* Vertical Connector line */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            bottom: '2rem',
            left: '3.5rem',
            width: '2px',
            background: 'linear-gradient(180deg, var(--primary), var(--accent))',
            opacity: 0.3,
            zIndex: 0,
          }} />

          {processSteps.map((step, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(i)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '2rem',
                padding: '1.5rem',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
                background: activeStep === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                borderRadius: '16px',
                border: activeStep === i ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Step circle */}
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                background: activeStep === i
                  ? 'linear-gradient(135deg, var(--primary), var(--accent-dark))'
                  : 'var(--bg-card)',
                border: `2px solid ${activeStep === i ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '800',
                fontSize: '1.1rem',
                color: activeStep === i ? '#fff' : 'var(--text-muted)',
                boxShadow: activeStep === i ? '0 0 20px rgba(88,166,255,0.4)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {step.num}
              </div>
              <div style={{ textAlign: 'left', paddingTop: '0.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: activeStep === i ? 'var(--text-main)' : 'var(--text-secondary)',
                  transition: 'color 0.3s ease',
                }}>{step.title}</h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                  margin: 0,
                }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 6rem', padding: '0 1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Why Us</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1rem', lineHeight: '1.15' }}>Built Different, Delivered Better</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
              We're not a typical agency. Hadescore Apex & Technologies combines enterprise-grade engineering with startup agility — giving you the best of both worlds.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
              {advantages.map((a, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '16px', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}><CardIcon type={a.icon} /></div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-main)' }}>{a.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 6rem', padding: '0 1rem' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Reach</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem' }}>Industries We Serve</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}>
          {industries.map((ind, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid rgba(88,166,255,0.15)',
              }}>
                <div style={{ width: '20px', height: '20px' }}>
                  <CardIcon type={ind.icon} />
                </div>
              </div>
              <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ind.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="interactive-cta-banner">
          <div className="cta-glow"></div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to start a project?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Talk to our team to discover how we can help.</p>
          <button className="premium-cta-btn" onClick={() => navigateTo('contact')} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            Contact Us
          </button>
        </div>
      </section>
      </div>
    </div>
  );
}

export default ServicesPage;
