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
import Footer from './components/Footer';





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
      <Footer navigateTo={navigateTo} />
    </div>
  );
}

export default App;
