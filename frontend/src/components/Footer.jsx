import { useState } from 'react';
import { getBackendUrl } from '../utils/api';
import { showToast } from './Toast';

const Footer = ({ navigateTo }) => {
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // 'idle', 'submitting', 'success'
  const [newsletterEmail, setNewsletterEmail] = useState('');

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top Footer Section */}
        <div className="footer-top">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-brand-logo" onClick={() => navigateTo && navigateTo('home')} style={{ cursor: 'pointer' }}>
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
                <a href="mailto:info@apex.hadescoretech.com" className="footer-contact-item" target="_blank" rel="noopener noreferrer">
                  <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>info@apex.hadescoretech.com</span>
                </a>
                <a href="tel:+919790080274" className="footer-contact-item">
                  <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+91 97900 80274</span>
                </a>
                <a href="tel:+919087152252" className="footer-contact-item">
                  <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+91 90871 52252</span>
                </a>

                <div className="footer-contact-item static">
                  <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Bengaluru, Karnataka, India</span>
                </div>
              </div>

              <div className="footer-social-links">
                <a href="https://www.linkedin.com/company/hadescore-apex-technologies/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="footer-social-btn linkedin" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/hadescore_apex_offi?utm_source=qr&igsh=d3J3bWtrbnBlenNh" target="_blank" rel="noopener noreferrer" className="footer-social-btn instagram" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Section 1 */}
            <div className="footer-col">
              <h4 className="footer-col-title">Services</h4>
              <ul className="footer-col-list">
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('services')}>Software Engineering</span></li>
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('services')}>AI & Automation</span></li>
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('services')}>Cloud & DevOps</span></li>
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('services')}>Mobile & UI/UX</span></li>
              </ul>
            </div>

            {/* Links Section 2 */}
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-col-list">
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('about')}>About Us</span></li>
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('careers')}>Careers</span></li>
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('contact')}>Contact</span></li>
              </ul>
            </div>

            {/* Links Section 3 */}
            <div className="footer-col">
              <h4 className="footer-col-title">Legal</h4>
              <ul className="footer-col-list">
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('privacy')}>Privacy Policy</span></li>
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('terms')}>Terms of Service</span></li>
                <li><span className="footer-col-link" onClick={() => navigateTo && navigateTo('security')}>Security</span></li>
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

                    await new Promise((resolve) => setTimeout(resolve, 850));

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    try {
                      const url = getBackendUrl('/api/newsletter/');
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
                        if (res.status === 400 && errorData.email && errorData.email.some(msg => msg.includes('exists'))) {
                          isDuplicate = true;
                          saved = true;
                        }
                      }
                    } catch (err) {
                      clearTimeout(timeoutId);
                      isOffline = true;
                    }

                    if (!saved && isOffline) {
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 Hadescore Private Limited. All Rights Reserved.<br />
            Hadescore APEX & Technologies is a brand of Hadescore Private Limited.</p>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
            <span style={{ cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

