import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getBackendUrl } from './utils/api';
import { showToast } from './components/Toast';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import LearningHubPage from './pages/LearningHubPage';
import ServicesPage from './pages/ServicesPage';
import SolutionsPage from './pages/SolutionsPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ApexPage from './pages/ApexPage';
import StartProjectPage from './pages/StartProjectPage';
import Navbar from './components/Navbar';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SecurityPage from './pages/SecurityPage';
import BlogPage from './pages/BlogPage';
import BlogDetail from './pages/BlogDetail';
import ChatBotEnhanced from './components/ChatBotEnhanced';
import VerificationPage from './pages/VerificationPage';





// Scroll Animation Hook
const useScrollAnimation = (currentPage) => {
  useEffect(() => {
    // Assign staggered delay to sibling elements automatically
    const assignStaggerDelays = () => {
      document.querySelectorAll('.programs-grid, .layout-grid, .stats-grid, .benefits-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
          child.dataset.staggerIndex = i;
        });
      });
    };

    assignStaggerDelays();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const stagger = parseInt(el.dataset.staggerIndex || 0);
          const delay = stagger * 0.1;
          const animation = el.dataset.animation || `slideInUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`;
          el.style.animation = animation;
          el.style.opacity = '1';
          el.style.transform = 'none';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const timer = setTimeout(() => {
      document.querySelectorAll('[data-animation], .program-card, .glass-card, .testimonial-card, .stat-item, .bullet-item, .job-card, .benefit-card').forEach(el => {
        if (!el.closest('.site-footer') && !el.closest('.navbar')) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(24px)';
          el.style.transition = 'none';
          el.style.animation = 'none';
          observer.observe(el);
        }
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentPage]);
};

const pageBackgrounds = {
  home: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
  about: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
  services: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80',
  solutions: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
  products: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80',
  apex: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
  learninghub: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80',
  careers: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80',
  contact: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80',
  blog: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&q=80'
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/')[1];
  const currentPage = currentPath || 'home';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactPrefill, setContactPrefill] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Chatbot states (now managed by ChatBotEnhanced component)
  const [chatOpen, setChatOpen] = useState(false);
  const targetSectionRef = useRef(null);

  // Footer state variables
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // 'idle', 'submitting', 'success'
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Enable scroll animations
  useScrollAnimation(currentPage);

  // Preload backdrop images on mount
  useEffect(() => {
    Object.values(pageBackgrounds).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Scroll to top or target section on page change
  useEffect(() => {
    const sectionId = targetSectionRef.current;
    if (sectionId) {
      targetSectionRef.current = null; // Clear immediately
      const scrollToSection = () => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
      const timer = setTimeout(scrollToSection, 120);
      setMobileMenuOpen(false);
      return () => clearTimeout(timer);
    } else {
      const resetScroll = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      };

      // Call immediately
      resetScroll();
      
      // And call again after a tiny delay to ensure the new page DOM has rendered
      const timerId = setTimeout(resetScroll, 50);

      setMobileMenuOpen(false);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [currentPage, location.pathname]);

  // Back to Top visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || (document.body ? document.body.scrollTop : 0) || (document.documentElement ? document.documentElement.scrollTop : 0);
      setShowBackToTop(scrollPos > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (document.body) document.body.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (document.body) document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const scrollOpts = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollOpts);
    if (document.body) document.body.scrollTo(scrollOpts);
    if (document.documentElement) document.documentElement.scrollTo(scrollOpts);
  };

  const navigateTo = (page, sectionId = null) => {
    targetSectionRef.current = sectionId;
    const targetPath = page === 'home' ? '/' : `/${page}`;
    
    if (location.pathname === targetPath || (location.pathname === '/' && page === 'home')) {
      if (!sectionId) {
        const resetScroll = () => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        };
        resetScroll();
        setTimeout(resetScroll, 50);
        setMobileMenuOpen(false);
      } else {
        const scrollToSection = () => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        };
        setTimeout(scrollToSection, 120);
      }
    } else {
      navigate(targetPath);
    }
  };

  const bgImage = pageBackgrounds[currentPage] || pageBackgrounds.home;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="page-background-image" style={{ backgroundImage: `url(${bgImage})` }}></div>
      <div className="bg-grid-overlay"></div>
      <div className="bg-radial-glow"></div>
      {/* Animated morphing background blobs */}
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      <div className="bg-blob bg-blob-3"></div>

      {/* Floating particles */}
      <div className="particles-container" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Navbar */}
      <Navbar currentPage={currentPage} navigateTo={navigateTo} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className={`container page-transition-wrapper ${['home', 'about', 'services', 'solutions', 'apex', 'learninghub', 'careers', 'products', 'blog'].includes(currentPage) ? 'full-bleed-container' : ''}`} key={currentPage} style={{ flex: '1 0 auto' }}>
          <Routes>
            <Route path="/" element={<HomePage navigateTo={navigateTo} chatOpen={chatOpen} setChatOpen={setChatOpen} />} />
            <Route path="/about" element={<AboutPage navigateTo={navigateTo} />} />
            <Route path="/services" element={<ServicesPage navigateTo={navigateTo} />} />
            <Route path="/solutions" element={<SolutionsPage navigateTo={navigateTo} />} />
            <Route path="/apex" element={<ApexPage navigateTo={navigateTo} />} />
            <Route path="/products" element={<ProductsPage navigateTo={navigateTo} />} />
            <Route path="/start-project" element={<StartProjectPage navigateTo={navigateTo} />} />
            <Route path="/learninghub" element={<LearningHubPage navigateTo={navigateTo} setContactPrefill={setContactPrefill} />} />
            <Route path="/careers" element={<CareersPage navigateTo={navigateTo} />} />
            <Route path="/blog" element={<BlogPage navigateTo={navigateTo} />} />
            <Route path="/blog/:slug" element={<BlogDetail navigateTo={navigateTo} />} />
            <Route path="/contact" element={<ContactPage prefill={contactPrefill} setPrefill={setContactPrefill} />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="*" element={<HomePage navigateTo={navigateTo} chatOpen={chatOpen} setChatOpen={setChatOpen} />} />
          </Routes>
        </div>

      {/* Floating Action Buttons */}
      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="back-to-top-btn"
          aria-label="Back to Top"
          style={{
            position: 'fixed',
            bottom: '170px',
            right: '25px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 98,
            transition: 'all 0.3s ease',
            opacity: showBackToTop ? 1 : 0,
            transform: showBackToTop ? 'translateY(0)' : 'translateY(20px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
        </button>
      )}

      {/* Professional Call Button - WhatsApp Style */}
      <a 
        href="tel:+919790080274" 
        className="call-support-btn" 
        aria-label="Call Support"
        title="Call +91 9790080274"
      >
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          animation: 'ripple 1.8s ease-out infinite',
          zIndex: 1
        }}></div>
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          fill="white"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>

      {/* Enhanced Chatbot Component */}
      <ChatBotEnhanced chatOpen={chatOpen} setChatOpen={setChatOpen} />

      {/* Global Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          {/* Top Footer Section */}
          <div className="footer-top">
            <div className="footer-grid">
              {/* Brand Section */}
              <div className="footer-brand">
                <div className="footer-brand-logo" onClick={() => navigateTo('home')}>
                  <img src="/logo.png?v=4" alt="Hadescore Apex Logo" style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0 }} />
                  <div className="footer-brand-text">
                    <span className="footer-brand-title">
                      HADESCORE&nbsp;<span style={{ background: 'linear-gradient(135deg, #4f9cff, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>APEX</span>
                    </span>
                    <span className="footer-brand-subtitle">
                      &amp;&nbsp;TECHNOLOGIES
                    </span>
                  </div>
                </div>
                <p className="footer-brand-desc">
                  Building a future-ready technology and talent acceleration ecosystem.
                </p>
                
                <div className="footer-contacts">
                  <a href="mailto:hadescore.apex.technologies@gmail.com" className="footer-contact-item" target="_blank" rel="noopener noreferrer">
                    <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>hadescore.apex.technologies@gmail.com</span>
                  </a>
                  <a href="tel:+919790080274" className="footer-contact-item">
                    <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>+91 9790080274</span>
                  </a>
                  <div className="footer-contact-item static">
                    <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>Bengaluru,Karnataka ,India</span>
                  </div>
                </div>

                <div className="footer-social-links">
                  <a href="https://www.linkedin.com/company/hadescore-apex-technologies/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="footer-social-btn linkedin" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/hadescore_apex_offi?utm_source=qr&igsh=d3J3bWtrbnBlenNh" target="_blank" rel="noopener noreferrer" className="footer-social-btn instagram" aria-label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links Section 1 */}
              <div className="footer-col">
                <h4 className="footer-col-title">Services</h4>
                <ul className="footer-col-list">
                  <li><span className="footer-col-link" onClick={() => navigateTo('services')}>Software Engineering</span></li>
                  <li><span className="footer-col-link" onClick={() => navigateTo('services')}>AI & Automation</span></li>
                  <li><span className="footer-col-link" onClick={() => navigateTo('services')}>Cloud & DevOps</span></li>
                  <li><span className="footer-col-link" onClick={() => navigateTo('services')}>Mobile & UI/UX</span></li>
                </ul>
              </div>

              {/* Links Section 2 */}
              <div className="footer-col">
                <h4 className="footer-col-title">Company</h4>
                <ul className="footer-col-list">
                  <li><span className="footer-col-link" onClick={() => navigateTo('about')}>About Us</span></li>
                  <li><span className="footer-col-link" onClick={() => navigateTo('careers')}>Careers</span></li>
                  <li><span className="footer-col-link" onClick={() => navigateTo('contact')}>Contact</span></li>
                </ul>
              </div>

              {/* Links Section 3 */}
              <div className="footer-col">
                <h4 className="footer-col-title">Legal</h4>
                <ul className="footer-col-list">
                  <li><span className="footer-col-link" onClick={() => navigateTo('privacy')}>Privacy Policy</span></li>
                  <li><span className="footer-col-link" onClick={() => navigateTo('terms')}>Terms of Service</span></li>
                  <li><span className="footer-col-link" onClick={() => navigateTo('security')}>Security</span></li>
                </ul>
              </div>

              {/* Newsletter Section */}
              <div className="footer-col">
                <h4 className="footer-col-title">Newsletter</h4>
                <p className="footer-newsletter-desc">
                  Get updates on new courses and services.
                </p>
                {newsletterStatus === 'success' ? (
                  <div className="footer-success-badge animate-slide-up">
                    <div className="footer-success-icon-wrapper">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="footer-success-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="footer-success-text-wrapper">
                      <span className="footer-success-title">Subscribed!</span>
                      <span className="footer-success-desc">Joined with {newsletterEmail}</span>
                    </div>
                    <button 
                      onClick={() => setNewsletterStatus('idle')} 
                      className="footer-resubscribe-btn"
                    >
                      Change Email
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const email = e.target.email.value.trim().toLowerCase();
                      
                      if (!email) {
                        showToast('Email address is required.', 'error');
                        return;
                      }

                      const emailRegex = /^[^\s@]+@gmail\.com$/;
                      if (!emailRegex.test(email)) {
                        showToast('Please enter a valid Gmail address (e.g. yourname@gmail.com).', 'error');
                        return;
                      }

                      setNewsletterEmail(email);
                      setNewsletterStatus('submitting');
                      
                      let saved = false;
                      let isDuplicate = false;
                      let isOffline = false;
                      
                      // Micro-interaction delay for premium feel
                      await new Promise((resolve) => setTimeout(resolve, 850));

                      const controller = new AbortController();
                      const timeoutId = setTimeout(() => controller.abort(), 5000);

                      try {
                        const url = getBackendUrl('/api/newsletter/');
                        console.log(`Submitting newsletter subscription for ${email} to ${url}`);
                        const res = await fetch(url, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email }),
                          signal: controller.signal,
                        });
                        clearTimeout(timeoutId);

                        if (res.ok || res.status === 201) {
                          saved = true;
                        } else {
                          const errorData = await res.json().catch(() => ({}));
                          console.warn('Newsletter subscription backend error:', res.status, errorData);
                          
                          // Check if email already exists
                          if (res.status === 400 && errorData.email && errorData.email.some(msg => msg.includes('exists'))) {
                            isDuplicate = true;
                            saved = true; // Mark as saved so we show the success UI state
                          }
                        }
                      } catch (err) {
                        clearTimeout(timeoutId);
                        console.error('Newsletter subscription connection failed:', err);
                        isOffline = true;
                      }

                      if (!saved && isOffline) {
                        // Fallback to local storage if offline
                        try {
                          const subs = JSON.parse(localStorage.getItem('hadescore_newsletter') || '[]');
                          if (!subs.includes(email)) { 
                            subs.push(email); 
                            localStorage.setItem('hadescore_newsletter', JSON.stringify(subs)); 
                          }
                          saved = true;
                        } catch (lsErr) {
                          console.error('Local storage fallback failed:', lsErr);
                        }
                      }

                      if (saved) {
                        setNewsletterStatus('success');
                        if (isDuplicate) {
                          showToast(`ℹ️ You are already subscribed to our newsletter!`, 'info', 5000);
                        } else if (isOffline) {
                          showToast(`🎉 Subscribed offline! You'll get updates at ${email}`, 'success', 5000);
                        } else {
                          showToast(`🎉 Subscribed! You'll get updates at ${email}`, 'success', 5000);
                        }
                      } else {
                        setNewsletterStatus('idle');
                        showToast('Subscription failed. Please try again.', 'error');
                      }
                    }}
                    className="footer-newsletter-form"
                    noValidate
                  >
                    <input 
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      required
                      className="footer-newsletter-input"
                      disabled={newsletterStatus === 'submitting'}
                      onInput={(e) => { e.target.value = e.target.value.toLowerCase(); }}
                    />
                    <button 
                      type="submit" 
                      className="footer-newsletter-submit"
                      disabled={newsletterStatus === 'submitting'}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {newsletterStatus === 'submitting' ? (
                        <>
                          <svg className="footer-spinner" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" fill="none" />
                          </svg>
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="footer-bottom">
            <p className="footer-copyright">© 2026 Hadescore Apex & Technologies. All rights reserved.</p>
            <div className="footer-lang-selector">
              <span className="footer-lang-btn" style={{ cursor: 'default' }}>English</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
