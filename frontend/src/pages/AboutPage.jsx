import { useRef, useState, useEffect } from 'react';
import { getBackendUrl } from '../utils/api';
import axios from 'axios';
import laboratoryVision from '../assets/laboratory_vision.png';
import CardIcon from '../components/CardIcon';
import SEO from '../components/SEO';
import RotatingLogo from '../components/RotatingLogo';

function AboutPage({ navigateTo }) {
  const galleryRef = useRef(null);
  const [leaders, setLeaders] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_leaders');
      const parsed = cached ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  
  useEffect(() => {
    axios.get(getBackendUrl('/api/leaders/'))
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLeaders(res.data);
          try { localStorage.setItem('hadescore_cache_leaders', JSON.stringify(res.data)); } catch (e) { /* quota exceeded */ }
        }
      })
      .catch(err => console.error("Failed to load leaders", err));
  }, []);

  return (
    <div>
      <SEO pageName="about" />
      {/* Hero Section */}
      <section className="page-hero-section" style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060912',
        backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 18, 0.75), rgba(6, 9, 18, 0.95)), url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80)`
      }}>
        <RotatingLogo opacity={0.12} size="default" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '900px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 4.75rem)',
            fontWeight: '900',
            maxWidth: '960px',
            margin: '0 auto 1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            fontFamily: 'Outfit, sans-serif'
          }} data-animation="slideInUp 0.8s ease-out forwards">
            Architecting the <span style={{ background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Next Digital Epoch</span>
          </h1>

          <p style={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            lineHeight: '1.7',
            maxWidth: '780px',
            margin: '0 auto',
            fontWeight: '400'
          }} data-animation="slideInUp 0.8s ease-out 0.15s forwards">
            Hadescore Apex & Technologies is a multi-domain technology and talent acceleration platform, blending technological permanence with forward-leaning engineering.
          </p>
        </div>
      </section>

      {/* Content wrapper for scrolling contents */}
      <div className="page-content-wrapper">

      {/* Vision & Mission Layout Grid */}
      <section className="vision-mission-grid" style={{ marginBottom: '6.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Vision card */}
          <div className="testimonial-card" data-animation="fadeInLeft 0.6s ease-out forwards">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'Outfit' }}>Our Vision</h3>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              To build a future-ready technology ecosystem where students, startups, creators, businesses, and innovators can learn, build, collaborate, launch, and scale under one platform.
            </p>
          </div>

          {/* Mission card */}
          <div className="testimonial-card" data-animation="fadeInLeft 0.6s ease-out 0.1s forwards">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'Outfit' }}>Mission Objectives</h3>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(79, 156, 255, 0.15), rgba(0, 229, 255, 0.1))', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
            </div>
            <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Build a strong, multi-domain technology service company</li>
              <li>Develop innovative products and solutions for businesses</li>
              <li>Create a highly active student and startup community</li>
              <li>Establish a recognized innovation and training ecosystem</li>
              <li>Drive technological advancement and digital transformation</li>
            </ul>
          </div>
        </div>
        <div data-animation="fadeInRight 0.6s ease-out 0.2s forwards">
          <img src={laboratoryVision} className="vision-mission-image" alt="Hadescore Cleanroom Lab" />
        </div>
      </section>

      {/* Foundational Values */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header" data-animation="slideInUp 0.6s ease-out forwards">
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Foundational Values</h2>
          <p>The pillars that uphold the Hadescore standard.</p>
        </div>
        <div className="programs-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div className="program-card" data-animation="slideInUp 0.6s ease-out forwards">
            <div className="program-icon-box"><CardIcon type="incubate" /></div>
            <h3 className="program-title">Ecosystem Integration</h3>
            <p className="program-desc">Connecting technology, education, innovation, career development, and startup support under a single platform.</p>
          </div>
          <div className="program-card" data-animation="slideInUp 0.6s ease-out 0.1s forwards">
            <div className="program-icon-box"><CardIcon type="growth" /></div>
            <h3 className="program-title">Practical Acceleration</h3>
            <p className="program-desc">Bridging the academic-industry gap with hands-on lab projects, mentorship, and placement opportunities.</p>
          </div>
          <div className="program-card" data-animation="slideInUp 0.6s ease-out 0.2s forwards">
            <div className="program-icon-box"><CardIcon type="performance" /></div>
            <h3 className="program-title">Sustainable Permanence</h3>
            <p className="program-desc">Building resilient digital architectures and sustainable revenue pipelines to guarantee long-term stability.</p>
          </div>
        </div>
      </section>

      {/* Our Business Verticals */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header" data-animation="slideInUp 0.6s ease-out forwards">
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Our Business Verticals</h2>
          <p>Comprehensive solutions across technology, marketing, and talent development.</p>
        </div>
        <div className="programs-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Technology Services */}
          <div className="program-card" data-animation="slideInUp 0.6s ease-out forwards">
            <div className="program-icon-box"><CardIcon type="web" /></div>
            <h3 className="program-title">Technology Services</h3>
            <ul className="check-list">
              <li className="check-item"><span className="check-icon">✓</span> Website Development</li>
              <li className="check-item"><span className="check-icon">✓</span> Mobile App Development</li>
              <li className="check-item"><span className="check-icon">✓</span> ERP & CRM Solutions</li>
              <li className="check-item"><span className="check-icon">✓</span> UI/UX Design</li>
              <li className="check-item"><span className="check-icon">✓</span> AI Integration Services</li>
            </ul>
          </div>

          {/* Digital Marketing Services */}
          <div className="program-card" data-animation="slideInUp 0.6s ease-out 0.1s forwards">
            <div className="program-icon-box"><CardIcon type="marketing" /></div>
            <h3 className="program-title">Digital Marketing Services</h3>
            <ul className="check-list">
              <li className="check-item"><span className="check-icon">✓</span> Branding</li>
              <li className="check-item"><span className="check-icon">✓</span> SEO</li>
              <li className="check-item"><span className="check-icon">✓</span> Social Media Management</li>
              <li className="check-item"><span className="check-icon">✓</span> Performance Marketing</li>
              <li className="check-item"><span className="check-icon">✓</span> Content Production</li>
            </ul>
          </div>

          {/* Internship & Training Programs */}
          <div className="program-card" data-animation="slideInUp 0.6s ease-out 0.2s forwards">
            <div className="program-icon-box"><CardIcon type="learning" /></div>
            <h3 className="program-title">Internship & Training Programs</h3>
            <ul className="check-list">
              <li className="check-item"><span className="check-icon">✓</span> Fullstack Development</li>
              <li className="check-item"><span className="check-icon">✓</span> AI & Automation</li>
              <li className="check-item"><span className="check-icon">✓</span> UI/UX</li>
              <li className="check-item"><span className="check-icon">✓</span> Mobile App Development</li>
              <li className="check-item"><span className="check-icon">✓</span> Digital Marketing</li>
              <li className="check-item"><span className="check-icon">✓</span> Cybersecurity</li>
            </ul>
          </div>

          {/* SaaS Products */}
          <div className="program-card" data-animation="slideInUp 0.6s ease-out 0.3s forwards">
            <div className="program-icon-box"><CardIcon type="database" /></div>
            <h3 className="program-title">SaaS Products</h3>
            <ul className="check-list">
              <li className="check-item"><span className="check-icon">✓</span> CRM Systems</li>
              <li className="check-item"><span className="check-icon">✓</span> Attendance Platforms</li>
              <li className="check-item"><span className="check-icon">✓</span> LMS Platforms</li>
              <li className="check-item"><span className="check-icon">✓</span> AI Automation Tools</li>
              <li className="check-item"><span className="check-icon">✓</span> Business Management Software</li>
            </ul>
          </div>

          {/* Recruitment & Placement */}
          <div className="program-card" data-animation="slideInUp 0.6s ease-out 0.4s forwards">
            <div className="program-icon-box"><CardIcon type="recruitment" /></div>
            <h3 className="program-title">Recruitment & Placement</h3>
            <ul className="check-list">
              <li className="check-item"><span className="check-icon">✓</span> Talent Hiring</li>
              <li className="check-item"><span className="check-icon">✓</span> Placement Partnerships</li>
              <li className="check-item"><span className="check-icon">✓</span> Recruitment Services</li>
            </ul>
          </div>

          {/* Startup Ecosystem */}
          <div className="program-card" data-animation="slideInUp 0.6s ease-out 0.5s forwards">
            <div className="program-icon-box"><CardIcon type="incubate" /></div>
            <h3 className="program-title">Startup Ecosystem</h3>
            <ul className="check-list">
              <li className="check-item"><span className="check-icon">✓</span> Incubation Support</li>
              <li className="check-item"><span className="check-icon">✓</span> Workspace Access</li>
              <li className="check-item"><span className="check-icon">✓</span> Mentorship Programs</li>
              <li className="check-item"><span className="check-icon">✓</span> Startup Collaboration</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Executive Leadership - Redesigned Founder & Team Section */}
      {(() => {
        const leadersList = Array.isArray(leaders) ? leaders : [];
        const founder = leadersList.find(l => l.is_founder);
        const teamMembers = leadersList.filter(l => !l.is_founder);
        const themeColors = {
          cyan: { border: '#00e5ff', shadow: 'rgba(0, 229, 255, 0.4)' },
          purple: { border: '#a855f7', shadow: 'rgba(168, 85, 247, 0.4)' },
          green: { border: '#10b981', shadow: 'rgba(16, 185, 129, 0.4)' },
          pink: { border: '#ec4899', shadow: 'rgba(236, 72, 153, 0.4)' },
          blue: { border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.4)' },
        };

        return (
          <>
            {/* 1. Founder Section */}
            {founder && (
              <section style={{ marginBottom: '5rem', maxWidth: '1100px', margin: '0 auto 5rem', padding: '0 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '2.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>— THE FOUNDER</span>
                </div>
                
                <div
                  className="founder-card-container"
                  style={{
                    background: 'rgba(11, 15, 30, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    display: 'flex',
                    gap: '2.5rem',
                    alignItems: 'center',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 229, 255, 0.02)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Background aura */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(0, 229, 255, 0.05) 0%, transparent 60%)',
                    pointerEvents: 'none'
                  }}></div>

                  {/* Left Column: Avatar & Socials */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '24px',
                        background: founder.image ? 'transparent' : 'linear-gradient(135deg, #a855f7, #00e5ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: '0 0 35px rgba(0, 229, 255, 0.3)',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {founder.image ? (
                        <img
                          src={getBackendUrl(founder.image)}
                          alt={founder.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <span style={{ fontSize: '3.5rem', fontWeight: '800', color: '#030712', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                          {founder.initials || 'RH'}
                        </span>
                      )}
                    </div>

                    {/* Socials */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {founder.linkedin_url && (
                        <a
                          href={founder.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="leader-social-btn leader-linkedin-btn"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '38px', height: '38px', borderRadius: '10px',
                            background: 'rgba(10, 102, 194, 0.15)',
                            border: '1px solid rgba(10, 102, 194, 0.4)',
                            color: '#4a9eff'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {founder.email && (
                        <a
                          href={`mailto:${founder.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="leader-social-btn leader-email-btn"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '38px', height: '38px', borderRadius: '10px',
                            background: 'rgba(0, 229, 255, 0.12)',
                            border: '1px solid rgba(0, 229, 255, 0.4)',
                            color: '#00e5ff'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                            <path d="M2 7l10 7 10-7"/>
                          </svg>
                        </a>
                      )}
                      {founder.portfolio_url && (
                        <a
                          href={founder.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="leader-social-btn"
                          title="View Portfolio"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '38px', height: '38px', borderRadius: '10px',
                            background: 'rgba(168, 85, 247, 0.15)',
                            border: '1px solid rgba(168, 85, 247, 0.45)',
                            color: '#c084fc',
                            transition: 'all 0.25s ease'
                          }}
                        >
                          {/* Briefcase / portfolio icon */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2"/>
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                            <line x1="12" y1="12" x2="12" y2="16"/>
                            <line x1="10" y1="14" x2="14" y2="14"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Name, Quote, Stats */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: '0 0 0.25rem 0', fontFamily: 'Outfit, sans-serif' }}>
                        {founder.name}
                      </h3>
                      <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#00e5ff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {founder.role}
                      </p>
                    </div>

                    <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.75)', fontStyle: 'italic', lineHeight: '1.65', margin: '0.5rem 0 1.5rem', fontWeight: '400', borderLeft: '3px solid #00e5ff', paddingLeft: '1.25rem' }}>
                      "{founder.quote || founder.detail}"
                    </p>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {founder.stat1_value && (
                        <div style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '0.85rem 1.25rem', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00e5ff', fontFamily: 'Outfit, sans-serif' }}>{founder.stat1_value}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{founder.stat1_label}</div>
                        </div>
                      )}
                      {founder.stat2_value && (
                        <div style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '0.85rem 1.25rem', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00e5ff', fontFamily: 'Outfit, sans-serif' }}>{founder.stat2_value}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{founder.stat2_label}</div>
                        </div>
                      )}
                      {founder.stat3_value && (
                        <div style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '0.85rem 1.25rem', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00e5ff', fontFamily: 'Outfit, sans-serif' }}>{founder.stat3_value}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{founder.stat3_label}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 2. Leadership Grid Section */}
            {teamMembers.length > 0 && (
              <section style={{ marginBottom: '6.5rem', maxWidth: '1100px', margin: '0 auto 6.5rem', padding: '0 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '3.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>— LEADERSHIP TEAM</span>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '0.4rem', fontFamily: 'Outfit, sans-serif' }}>
                    The minds behind the <span style={{ background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>mission</span>
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {teamMembers.map((leader, idx) => {
                    const theme = themeColors[leader.color_theme] || themeColors.cyan;
                    return (
                      <div
                        key={idx}
                        className="leader-grid-card"
                        style={{
                          background: 'rgba(11, 15, 30, 0.45)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '20px',
                          padding: '2.25rem 2rem',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '1.25rem',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-6px)';
                          e.currentTarget.style.borderColor = theme.border;
                          e.currentTarget.style.boxShadow = `0 15px 30px ${theme.shadow}`;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Circular neon glow avatar */}
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            border: `2px solid ${theme.border}`,
                            boxShadow: `0 0 15px ${theme.shadow}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            background: leader.image ? 'transparent' : 'rgba(13, 20, 38, 0.8)',
                            position: 'relative',
                            flexShrink: 0
                          }}
                        >
                          {leader.image ? (
                            <img
                              src={getBackendUrl(leader.image)}
                              alt={leader.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#ffffff' }}
                            />
                          ) : (
                            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
                              {leader.initials || 'LD'}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white', margin: '0 0 0.25rem 0', fontFamily: 'Outfit' }}>
                            {leader.name}
                          </h3>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                            {leader.role}
                          </p>
                        </div>

                        {leader.detail && (
                          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5', margin: '0.25rem 0 0.5rem' }}>
                            {leader.detail}
                          </p>
                        )}

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto' }}>
                          {leader.linkedin_url && (
                            <a
                              href={leader.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="leader-social-btn leader-linkedin-btn"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '34px', height: '34px', borderRadius: '8px',
                                background: 'rgba(10, 102, 194, 0.15)',
                                border: '1px solid rgba(10, 102, 194, 0.35)',
                                color: '#4a9eff'
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                          )}
                          {leader.email && (
                            <a
                              href={`mailto:${leader.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="leader-social-btn leader-email-btn"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '34px', height: '34px', borderRadius: '8px',
                                background: 'rgba(0, 229, 255, 0.12)',
                                border: '1px solid rgba(0, 229, 255, 0.3)',
                                color: '#00e5ff'
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <path d="M2 7l10 7 10-7"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        );
      })()}

      <section>
        {/* Styles: scrollbar + social button animations */}
        <style>{`
          .vision-mission-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2.5rem;
            align-items: center;
          }
          @media (min-width: 992px) {
            .vision-mission-grid {
              grid-template-columns: 1.1fr 0.9fr;
            }
          }
          @media (max-width: 991px) {
            .vision-mission-grid .testimonial-card {
              text-align: left !important;
              align-items: flex-start !important;
            }
            .vision-mission-grid .testimonial-card ul {
              align-items: flex-start !important;
              justify-content: flex-start !important;
            }
            .vision-mission-grid .testimonial-card li {
              text-align: left !important;
              justify-content: flex-start !important;
              align-items: flex-start !important;
            }
          }
          .vision-mission-image {
            width: 100%;
            max-width: 570px;
            height: 495px;
            border-radius: 16px;
            border: 1px solid var(--border);
            object-fit: cover;
            margin: 0 auto;
            display: block;
            box-shadow: 0 15px 35px rgba(0, 229, 255, 0.08);
          }

          .founder-card-container {
            display: flex;
            flex-direction: row;
            gap: 2.5rem;
            align-items: center;
          }
          @media (max-width: 768px) {
            .founder-card-container {
              flex-direction: column;
              text-align: center;
              padding: 1.5rem !important;
            }
            .founder-card-container p {
              border-left: none !important;
              padding-left: 0 !important;
            }
          }

          /* Social button base */
          .leader-social-btn {
            transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, background 0.22s ease;
            cursor: pointer !important;
            pointer-events: all !important;
          }

          /* LinkedIn pulse glow */
          .leader-linkedin-btn {
            animation: linkedin-glow-pulse 2.8s ease-in-out infinite;
          }
          @keyframes linkedin-glow-pulse {
            0%, 100% { box-shadow: 0 0 8px rgba(10,102,194,0.3); }
            50%       { box-shadow: 0 0 20px rgba(10,102,194,0.7), 0 0 35px rgba(10,102,194,0.2); }
          }

          /* Email pulse glow */
          .leader-email-btn {
            animation: email-glow-pulse 2.8s ease-in-out infinite;
            animation-delay: 0.6s;
          }
          @keyframes email-glow-pulse {
            0%, 100% { box-shadow: 0 0 8px rgba(0,229,255,0.25); }
            50%       { box-shadow: 0 0 20px rgba(0,229,255,0.65), 0 0 35px rgba(0,229,255,0.15); }
          }

          /* Hover effects */
          .leader-linkedin-btn:hover {
            transform: translateY(-4px) scale(1.12) !important;
            background: rgba(10,102,194,0.4) !important;
            box-shadow: 0 0 25px rgba(10,102,194,0.8), 0 8px 20px rgba(0,0,0,0.3) !important;
            animation: none;
          }
          .leader-email-btn:hover {
            transform: translateY(-4px) scale(1.12) !important;
            background: rgba(0,229,255,0.3) !important;
            box-shadow: 0 0 25px rgba(0,229,255,0.75), 0 8px 20px rgba(0,0,0,0.3) !important;
            animation: none;
          }

          /* Click / active press */
          .leader-linkedin-btn:active {
            transform: scale(0.93) !important;
            box-shadow: 0 0 10px rgba(10,102,194,0.5) !important;
          }
          .leader-email-btn:active {
            transform: scale(0.93) !important;
            box-shadow: 0 0 10px rgba(0, 229, 255, 0.5) !important;
          }
        `}</style>
      </section>

      {/* CTA Section */}
      <section className="cta-card" data-animation="slideInUp 0.6s ease-out forwards" style={{ padding: '3.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Why Hadescore Apex & Technologies?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              We don't just build code; we architect complete ecosystems that connect education, innovation, entrepreneurship, and placement.
            </p>
          </div>
          <button className="btn btn-primary" style={{ padding: '0.95rem 2.25rem', borderRadius: '8px' }} onClick={() => navigateTo('contact')}>
            Partner with Us
          </button>
        </div>
      </section>
      </div>
    </div>
  );
}

export default AboutPage;
