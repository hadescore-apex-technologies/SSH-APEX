const Footer = ({ navigateTo }) => {
  return (
    <footer className="site-footer">
      <div className="container" style={{ padding: 0 }}>
        {/* Top Footer Section */}
        <div className="footer-top">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="logo-container" style={{ padding: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="/logo.png?v=4" alt="Hadescore Apex Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} />
                <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: '800' }}>HADESCORE APEX <span style={{ color: '#60a5fa' }}>& TECHNOLOGIES</span></span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6', maxWidth: '280px' }}>
                Building a future-ready technology and talent acceleration ecosystem.
              </p>
              <div className="social-links" style={{ display: 'flex', gap: '0.75rem' }}>
                <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.background = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>in</a>
                <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.background = '#E4405F'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#E4405F'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Section 1 */}
            <div className="footer-col">
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Services</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('services')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>Software Engineering</span></li>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('services')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>AI & Automation</span></li>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('services')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>Cloud & DevOps</span></li>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('services')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>Mobile & UI/UX</span></li>
              </ul>
            </div>

            {/* Links Section 2 */}
            <div className="footer-col">
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Company</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('about')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>About Us</span></li>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('careers')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>Careers</span></li>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('contact')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>Contact</span></li>
              </ul>
            </div>

            {/* Links Section 3 */}
            <div className="footer-col">
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Legal</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('privacy')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>Privacy Policy</span></li>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('terms')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>Terms of Service</span></li>
                <li><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'all 0.2s ease' }} onClick={() => navigateTo('about')} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '0.5rem'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}>Security</span></li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="footer-col" style={{ gridColumn: 'auto' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Newsletter</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                Get updates on new courses and services.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  alert(`Thank you for subscribing with ${email}!`);
                  e.target.reset();
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'rgba(0, 229, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1rem',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent-dark))',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 Hadescore Apex & Technologies. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
            <span style={{ cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
