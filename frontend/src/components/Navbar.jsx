import { useState, useEffect } from 'react';

const Navbar = ({ currentPage, navigateTo, mobileMenuOpen, setMobileMenuOpen }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || (document.body ? document.body.scrollTop : 0) || (document.documentElement ? document.documentElement.scrollTop : 0);
      setScrolled(scrollPos > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (document.body) document.body.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (document.body) document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <div className="header-logo" onClick={() => navigateTo('home')}>
        <img src="/logo.png?v=4" alt="Hadescore Apex & Technologies Logo" className="header-logo-img" />
        <div className="header-logo-text">
          <span className="header-logo-title">
            HADESCORE&nbsp;<span style={{ background: 'linear-gradient(135deg, #4f9cff, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>APEX</span>
          </span>
          <span className="header-logo-subtitle">
            &amp;&nbsp;TECHNOLOGIES
          </span>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="header-nav-center">
        {[
          { page: 'home', label: 'Home' },
          { page: 'about', label: 'About' },
          { page: 'solutions', label: 'Solutions' },
          { page: 'apex', label: 'Apex' },
          { page: 'services', label: 'Services' },
          { page: 'products', label: 'Products' },
          { page: 'learninghub', label: 'EduSkills' },
          { page: 'careers', label: 'Careers' },
          { page: 'blog', label: 'Blog' }
        ].map(({ page, label }) => (
          <span
            key={page}
            className={`header-link ${currentPage === page ? 'active' : ''}`}
            onClick={() => navigateTo(page)}
          >
            {label}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="header-nav-right">
        <button className="premium-cta-btn" onClick={() => navigateTo('contact')}>
          Contact
        </button>

        {/* Mobile toggle */}
        <button
          className="mobile-menu-trigger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
        >
          <div style={{
            width: '22px', height: '2px',
            background: 'var(--text-main)',
            marginBottom: '5px',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }} />
          <div style={{
            width: '22px', height: '2px',
            background: 'var(--text-main)',
            marginBottom: '5px',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            opacity: mobileMenuOpen ? 0 : 1
          }} />
          <div style={{
            width: '22px', height: '2px',
            background: 'var(--text-main)',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
          }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        {[
          { page: 'home', label: 'Home' },
          { page: 'about', label: 'About' },
          { page: 'solutions', label: 'Solutions' },
          { page: 'apex', label: 'Apex' },
          { page: 'services', label: 'Services' },
          { page: 'products', label: 'Products' },
          { page: 'learninghub', label: 'EduSkills' },
          { page: 'careers', label: 'Careers' },
          { page: 'blog', label: 'Blog' }
        ].map(({ page, label }) => (
          <span
            key={page}
            className={`header-link ${currentPage === page ? 'active' : ''}`}
            onClick={() => { navigateTo(page); setMobileMenuOpen(false); }}
          >
            {label}
          </span>
        ))}
        <button
          className="premium-cta-btn"
          onClick={() => { navigateTo('contact'); setMobileMenuOpen(false); }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}
        >
          Contact
        </button>
      </div>
    </header>
  );
};

export default Navbar;
