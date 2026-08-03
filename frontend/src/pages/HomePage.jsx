import { useState, useEffect } from 'react';
import hologramAdvantage from '../assets/hologram_advantage.png';
import CardIcon from '../components/CardIcon';
import TestimonialCarousel from '../components/TestimonialCarousel';
import FAQSection from '../components/FAQSection';
import SEO from '../components/SEO';
import GEO_AEO_Enhanced from '../components/GEO_AEO_Enhanced';
import AdvancedSEO from '../components/AdvancedSEO';
import { allFAQs, servicesData } from '../data/faqData';
import RotatingLogo from '../components/RotatingLogo';
import { initAnalytics } from '../utils/analytics';

function HomePage({ navigateTo }) {
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statCounts, setStatCounts] = useState({
    students: 0,
    partners: 0,
    clusters: 0,
    uptime: 0
  });

  useEffect(() => {
    if (statsAnimated) return;

    // Initialize advanced analytics
    initAnalytics();

    const statsElement = document.getElementById('stats-section');
    if (!statsElement) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setStatsAnimated(true);
        animateStats();
      }
    }, { threshold: 0.1 });

    observer.observe(statsElement);
    return () => observer.disconnect();
  }, [statsAnimated]);

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setStatCounts({
        students: Math.floor(200 * progress),
        partners: Math.floor(10 * progress),
        clusters: Math.floor(10 * progress),
        uptime: Math.min(99.9, (99.9 * progress))
      });

      if (step >= steps) {
        clearInterval(timer);
        setStatCounts({
          students: 200,
          partners: 10,
          clusters: 10,
          uptime: 99.9
        });
      }
    }, interval);
  };

  return (
    <div>
      <SEO pageName="home" />
      <GEO_AEO_Enhanced 
        servicesOffered={servicesData}
        faqs={allFAQs}
      />
      <AdvancedSEO 
        pageName="home"
        articles={[]}
        reviews={[]}
      />
      {/* Responsive CSS */}
      <style>{`
        .page-hero-section {
          background-image: linear-gradient(to bottom, rgba(6, 9, 18, 0.45), rgba(6, 9, 18, 0.95)), url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80);
        }
        .home-hero-section {
          background-image: none !important;
          background-color: #060912 !important;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .home-hero-text-content {
          position: relative;
          z-index: 2;
          pointer-events: auto;
        }
        
        @media (max-width: 968px) {
          .page-hero-section h1 {
            font-size: 2.25rem !important;
          }
          .page-hero-section p {
            max-width: 100% !important;
          }
          .home-hero-buttons {
            justify-content: center !important;
          }
        }
        
        @media (max-width: 768px) {
          .home-hero-section {
            margin-top: -30px !important;
          }
          .home-hero-section > div {
            margin-top: -35px !important;
          }
          .home-hero-section .home-hero-text-content {
            margin-top: -190px !important;
          }
        }
        
        .divisions-section {
          margin-bottom: 6.5rem;
          margin-top: 1rem;
        }
        .divisions-header {
          text-align: left;
          margin-bottom: 3.5rem;
        }
        .divisions-title {
          font-size: 2.75rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          color: white;
          font-family: 'Outfit', sans-serif;
        }
        .divisions-title span {
          background: linear-gradient(135deg, #a855f7 0%, #4f9cff 50%, #00e5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .divisions-subtitle {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 680px;
          margin-top: 0.5rem;
        }
        .divisions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .division-card {
          background: rgba(8, 12, 28, 0.45) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 20px;
          padding: 2.25rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .division-card:hover {
          transform: translateY(-6px);
          background: rgba(16, 22, 42, 0.55) !important;
        }
        .division-card.theme-cyan:hover {
          border-color: rgba(0, 229, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 229, 255, 0.08), 0 0 0 1px rgba(0, 229, 255, 0.05);
        }
        .division-card.theme-purple:hover {
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.08), 0 0 0 1px rgba(139, 92, 246, 0.05);
        }
        .division-card.theme-pink:hover {
          border-color: rgba(236, 72, 153, 0.3);
          box-shadow: 0 20px 40px rgba(236, 72, 153, 0.08), 0 0 0 1px rgba(236, 72, 153, 0.05);
        }
        .div-number {
          float: right;
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.25);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .div-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.75rem;
          position: relative;
        }
        .div-icon-box::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          opacity: 0.15;
        }
        .div-icon-box.icon-cyan {
          background: rgba(0, 229, 255, 0.12);
          color: #00e5ff;
          box-shadow: 0 0 16px rgba(0, 229, 255, 0.2);
        }
        .div-icon-box.icon-purple {
          background: rgba(139, 92, 246, 0.12);
          color: #a855f7;
          box-shadow: 0 0 16px rgba(139, 92, 246, 0.2);
        }
        .div-icon-box.icon-pink {
          background: rgba(236, 72, 153, 0.12);
          color: #ec4899;
          box-shadow: 0 0 16px rgba(236, 72, 153, 0.2);
        }
        .div-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.75rem;
          font-family: 'Outfit', sans-serif;
        }
        .div-desc {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .div-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .div-list-item {
          font-size: 0.9rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .div-list-item::before {
          content: '•';
          font-size: 1.25rem;
          line-height: 1;
        }
        .division-card.theme-cyan .div-list-item::before { color: #00e5ff; }
        .division-card.theme-purple .div-list-item::before { color: #a855f7; }
        .division-card.theme-pink .div-list-item::before { color: #ec4899; }
        
        @media (max-width: 968px) {
          .divisions-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .divisions-header {
            text-align: center !important;
          }
          .divisions-title {
            font-size: 2.25rem !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="page-hero-section home-hero-section">
        <RotatingLogo opacity={0.18} size="default" />
        
        <div className="home-hero-text-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <span className="badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Hadescore Ecosystem</span>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.75rem)', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-0.03em', margin: '0 0 1.5rem', fontFamily: 'Outfit, sans-serif' }}>
            Building a Next-Generation<br /><span style={{ background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Multi-Domain</span> Tech Ecosystem.
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 'clamp(1rem, 2.2vw, 1.15rem)', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '780px', fontWeight: '400' }}>
            Integrating Software Engineering, Mobile Applications, UI/UX Design, AI Automation, Digital Marketing, Cybersecurity, Talent Acceleration, and Startup Incubation under a single platform.
          </p>
          <div className="home-hero-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigateTo('services', 'service-domains')}>
              Explore Services
            </button>
            <button className="btn btn-secondary" style={{ border: '1px solid var(--border)' }} onClick={() => navigateTo('learninghub', 'domain-explorer')}>
              Explore Courses →
            </button>
          </div>
        </div>
      </section>

      {/* Content wrapper for scrolling contents */}
      <div className="page-content-wrapper">
        {/* Stats Panel */}
        <div id="stats-section" className="stats-grid" data-animation="slideInUp 0.6s ease-out forwards">
        <div className="stat-item">
          <div className="stat-number">{statCounts.students >= 1000 ? `${Math.floor(statCounts.students / 1000)}k+` : `${statCounts.students}+`}</div>
          <div className="stat-label">Students Trained</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{statCounts.partners}+</div>
          <div className="stat-label">Ecosystem Partners</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{statCounts.clusters}+</div>
          <div className="stat-label">Strategic Clusters</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{statCounts.uptime.toFixed(1)}%</div>
          <div className="stat-label">System Uptime</div>
        </div>
      </div>

      {/* One Platform. Three Divisions. */}
      <section className="divisions-section" data-animation="slideInUp 0.6s ease-out forwards">
        <div className="divisions-header">
          <h2 className="divisions-title">One platform. <span>Three divisions.</span></h2>
          <p className="divisions-subtitle">
            A unified ecosystem with single authentication, shared CRM, analytics &amp; design system — operating across services, education and innovation.
          </p>
        </div>

        <div className="divisions-grid">
          {/* Division 01 */}
          <div className="division-card theme-cyan" onClick={() => window.open("https://hadescoretech.com/", "_blank")}>
            <span className="div-number">Division 01</span>
            <div className="div-icon-box icon-cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
              </svg>
            </div>
            <h3 className="div-title">Hadescore Technologies</h3>
            <p className="div-desc">
              Enterprise technology services &amp; digital transformation — web, mobile, AI solutions, SaaS, cloud, cybersecurity, ERP &amp; CRM.
            </p>
            <ul className="div-list">
              <li className="div-list-item">Web &amp; Mobile Apps</li>
              <li className="div-list-item">AI Solutions</li>
              <li className="div-list-item">Cloud &amp; DevOps</li>
              <li className="div-list-item">Cybersecurity</li>
              <li className="div-list-item">ERP / CRM / SaaS</li>
            </ul>
          </div>

          {/* Division 02 */}
          <div className="division-card theme-purple" onClick={() => navigateTo('learninghub')}>
            <span className="div-number">Division 02</span>
            <div className="div-icon-box icon-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>
            <h3 className="div-title">Hadescore EduSkill</h3>
            <p className="div-desc">
              Learn → Build → Earn. Industry-grade training, internships, mentorship &amp; placements across software, AI, design &amp; engineering.
            </p>
            <ul className="div-list">
              <li className="div-list-item">Live Courses</li>
              <li className="div-list-item">Internships</li>
              <li className="div-list-item">Mentor Network</li>
              <li className="div-list-item">Certifications</li>
              <li className="div-list-item">Placement Portal</li>
            </ul>
          </div>

          {/* Division 03 */}
          <div className="division-card theme-pink" onClick={() => navigateTo('apex')}>
            <span className="div-number">Division 03</span>
            <div className="div-icon-box icon-pink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.25-2.5 3-2.5 5.5 2.5 0 4.25-1 5.5-2.5" />
                <path d="M12 2C6.5 2 2 6.5 2 12c0 1.5.3 3 .8 4.2L7 12l5 5 4.2 4.2c1.2.5 2.7.8 4.2.8 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                <path d="M9 15l-3 3M15 9l3-3M9 9l3 3" />
              </svg>
            </div>
            <h3 className="div-title">Hadescore Apex</h3>
            <p className="div-desc">
              Innovation Labs, startup incubation, AI research &amp; emerging technologies — robotics, drones, IoT, biotech, EV &amp; Industry 4.0.
            </p>
            <ul className="div-list">
              <li className="div-list-item">Innovation Labs</li>
              <li className="div-list-item">Startup Incubation</li>
              <li className="div-list-item">Research Centers</li>
              <li className="div-list-item">Hackathons</li>
              <li className="div-list-item">Investor Connect</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Specializations */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Expertise</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem' }}>Our Core Specializations</h2>
        </div>

        <div className="programs-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Block 1 */}
          <div className="lovable-card" style={{ padding: '2rem' }} data-animation="slideInUp 0.6s ease-out forwards">
            <div className="program-icon-box" style={{ background: 'var(--border)', color: 'var(--text-main)', marginBottom: '1.5rem', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CardIcon type="web" /></div>
            <h3 className="program-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Software & App Development</h3>
            <p className="program-desc" style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>High-performance custom software, native iOS/Android development, and responsive UI/UX experiences.</p>
            <ul className="check-list" style={{ listStyle: 'none', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> MERN & Python Stacks</li>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> Kotlin & Flutter Mobile</li>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> ERP & CRM Platforms</li>
            </ul>
          </div>

          {/* Block 2 */}
          <div className="lovable-card" style={{ padding: '2rem' }} data-animation="slideInUp 0.6s ease-out 0.1s forwards">
            <div className="program-icon-box" style={{ background: 'var(--border)', color: 'var(--text-main)', marginBottom: '1.5rem', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CardIcon type="ai" /></div>
            <h3 className="program-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>AI, Cyber & Automation</h3>
            <p className="program-desc" style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>Integrating generative intelligence, SOC analytics, and automation workflows to secure operations.</p>
            <ul className="check-list" style={{ listStyle: 'none', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> Custom LLM & Prompt Eng</li>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> SOC Analyst Training</li>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> Zero-Trust Security Audits</li>
            </ul>
          </div>

          {/* Block 3 */}
          <div className="lovable-card" style={{ padding: '2rem' }} data-animation="slideInUp 0.6s ease-out 0.2s forwards">
            <div className="program-icon-box" style={{ background: 'var(--border)', color: 'var(--text-main)', marginBottom: '1.5rem', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CardIcon type="incubate" /></div>
            <h3 className="program-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Ecosystem Incubation</h3>
            <p className="program-desc" style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>Fostering talent acceleration, placement assistance, and early-stage startup incubation support.</p>
            <ul className="check-list" style={{ listStyle: 'none', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> Mentor-Driven Bootcamps</li>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> Recruitment & Placement</li>
              <li className="check-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span className="check-icon" style={{ color: 'var(--text-main)', marginRight: '8px' }}>✓</span> Incubation Workspace Access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hadescore Advantage */}
      <section className="why-choose-layout" style={{ marginBottom: '7rem' }} data-animation="slideInUp 0.6s ease-out forwards">
        <div>
          <img src={hologramAdvantage} style={{ width: '100%', borderRadius: '16px', border: '1px solid var(--border)' }} alt="Advantage Hologram" />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>The Hadescore Advantage</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1.25rem', lineHeight: '1.15' }}>Learn, Build, Earn, and Innovate</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
            We are not just a traditional technology firm or training institute. We connect talent development directly with real-world enterprise execution and incubation.
          </p>

          <div className="bullets-list" style={{ gap: '2rem' }}>
            <div className="bullet-item">
              <div className="bullet-icon-box"><CardIcon type="growth" /></div>
              <div className="bullet-info">
                <h3>Practical Talent Acceleration</h3>
                <p>Bridge the academic gap with hands-on lab training, live client projects, and expert mentorship.</p>
              </div>
            </div>
            <div className="bullet-item">
              <div className="bullet-icon-box"><CardIcon type="cpu" /></div>
              <div className="bullet-info">
                <h3>Multi-Domain Innovation</h3>
                <p>Engage across cutting-edge fields: from AI, Software, and Cybersecurity to Drones and Biotech.</p>
              </div>
            </div>
            <div className="bullet-item">
              <div className="bullet-icon-box"><CardIcon type="incubate" /></div>
              <div className="bullet-info">
                <h3>Incubation & Funding</h3>
                <p>Gain workspace access, pitch deck coaching, and fast-track incubation channels for high-growth startups.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Testimonials section */}
      <TestimonialCarousel />

      {/* FAQ Section for AEO */}
      <FAQSection faqs={allFAQs.slice(0, 8)} />

      {/* Blue CTA Banner */}
      <section className="blue-cta-banner" data-animation="slideInUp 0.6s ease-out forwards">
        <h2>Ready to Join the Ecosystem?</h2>
        <p>Whether you are a startup needing development services, a business seeking brand strategy, or a student accelerating your skills, we build the future together.</p>
        <button className="btn-white" onClick={() => navigateTo('contact')}>Get in Touch</button>
      </section>
      </div>
    </div>
  );
}

export default HomePage;
