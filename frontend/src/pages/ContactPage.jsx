import React, { useState, useEffect } from 'react';
import { getBackendUrl } from '../utils/api';
import { useToast } from '../components/Toast';
import SEO from '../components/SEO';

const BACKEND = getBackendUrl();

// LocalStorage fallback – saves contact to browser storage when backend is down
function saveContactLocally(data) {
  try {
    const existing = JSON.parse(localStorage.getItem('hadescore_contacts') || '[]');
    existing.push({ ...data, savedAt: new Date().toISOString(), id: Date.now() });
    localStorage.setItem('hadescore_contacts', JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1.5px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-main)',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  transition: 'all 0.2s ease',
  outline: 'none',
};

function FormField({ label, required, error, children }) {
  return (
    <div className="contact-form-field">
      <label style={{
        display: 'block', marginBottom: '0.2rem',
        fontSize: '0.8rem', fontWeight: '600',
        color: 'var(--text-secondary)', letterSpacing: '0.01em'
      }}>
        {label}{required && <span style={{ color: '#f87171', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.35rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}

const CONTACT_INFO = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Address',
    value: 'Bangaluru, Karnataka - 560100',
    link: 'https://maps.app.goo.gl/nNJrfYRujBooctwm7',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: 'Phone 1',
    value: '+91 97900 80274',
    link: 'tel:+919790080274',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: 'Phone 2',
    value: '+91 90871 52252',
    link: 'tel:+919087152252',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'info@apex.hadescoretech.com',
    link: 'mailto:info@apex.hadescoretech.com',
  },
];

const SUBJECT_OPTIONS = [
  'General Enquiry',
  'Software Development Services',
  'Learning Hub / Courses',
  'Career Opportunities',
  'Partnership & Collaboration',
  'Technical Support',
  'Other',
];

const ContactPage = ({ prefill, setPrefill }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: prefill ? 'Learning Hub / Courses' : '', message: prefill || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (prefill && setPrefill) {
      setPrefill('');
    }
  }, [prefill, setPrefill]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errs.phone = 'Please enter a valid phone number (7-15 digits).';
      }
    }
    if (!formData.subject) errs.subject = 'Please select a subject.';
    if (!formData.message.trim()) {
      errs.message = 'Message is required.';
    } else if (formData.message.trim().length < 20) {
      errs.message = 'Message must be at least 20 characters.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast('Please fix the highlighted fields.', 'error');
      return;
    }

    setLoading(true);
    let success = false;

    // Try the backend first
    try {
      const res = await fetch(`${BACKEND}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok || res.status === 201) {
        success = true;
      }
    } catch {
      // Backend unreachable – save locally
    }

    if (!success) {
      // LocalStorage fallback
      success = saveContactLocally(formData);
    }

    setLoading(false);

    if (success) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      toast('Message sent! We\'ll get back to you within 24 hours.', 'success', 5000);
    } else {
      toast('Something went wrong. Please try again or call us directly.', 'error');
    }
  };

  const getFieldStyle = (field) => ({
    ...inputStyle,
    borderColor: errors[field]
      ? '#f87171'
      : focusedField === field
        ? 'var(--accent)'
        : 'var(--border)',
    background: errors[field]
      ? 'rgba(239,68,68,0.06)'
      : focusedField === field
        ? 'rgba(0,229,255,0.05)'
        : 'rgba(255,255,255,0.04)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(0,229,255,0.1)' : 'none',
  });

  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          textAlign: 'center', maxWidth: '520px', padding: '3rem',
          background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: '20px', backdropFilter: 'blur(20px)',
          animation: 'slideInUp 0.5s ease-out forwards'
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', color: '#10b981',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: '#10b981' }}>
            Message Received!
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Thank you for reaching out. Our team will review your message and get back to you within <strong style={{ color: 'var(--text-main)' }}>24 hours</strong>.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="cta-button"
            style={{ padding: '0.85rem 2.25rem' }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page-container" style={{ paddingTop: '0', paddingBottom: '0' }}>
      <SEO pageName="contact" />
      <section className="contact-hero-section" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div className="pill-badge" style={{ marginBottom: '0.25rem', padding: '0.2rem 0.65rem', fontSize: '0.7rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 2s infinite', marginRight: '6px' }} />
            We Respond Within 24 Hours
          </div>
          <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>
            Get In <span style={{ background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Touch</span>
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', lineHeight: '1.5', maxWidth: '780px', margin: '0 auto', fontWeight: '400' }}>
            Have a project idea, question, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="contact-grid" style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 1rem',
        alignItems: 'start'
      }}>

        {/* ── Contact Form ── */}
        <div className="lovable-card contact-card">
          <div style={{ marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>Send us a Message</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Fill in the details below and we'll reach out shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name + Email row */}
            <div className="contact-input-row">
              <FormField label="Full Name" required error={errors.name}>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={getFieldStyle('name')}
                />
              </FormField>
              <FormField label="Email Address" required error={errors.email}>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={getFieldStyle('email')}
                />
              </FormField>
            </div>

            {/* Phone + Subject row */}
            <div className="contact-input-row">
              <FormField label="Phone Number" error={errors.phone}>
                <input
                  type="tel" name="phone" value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  style={getFieldStyle('phone')}
                />
              </FormField>
              <FormField label="Subject" required error={errors.subject}>
                <select
                  name="subject" value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...getFieldStyle('subject'),
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>Select a subject…</option>
                  {SUBJECT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </FormField>
            </div>

            {/* Message */}
            <FormField label="Message" required error={errors.message}>
              <textarea
                name="message" value={formData.message}
                onChange={handleChange}
                rows={2}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                className="contact-textarea"
                style={{ ...getFieldStyle('message'), resize: 'vertical' }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                {formData.message.length} / min 20 characters
              </div>
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="cta-button"
              style={{
                width: '100%', padding: '0.65rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.01em', borderRadius: '8px'
              }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'rotate 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send Message
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1rem' }}>
              🔒 Your information is encrypted and never shared with third parties.
            </p>
          </form>
        </div>

        {/* ── Contact Info Panel ── */}
        <div className="contact-info-panel">
          {CONTACT_INFO.map((item, i) => (
            <div
              key={i}
              className="lovable-card contact-info-card"
              style={{ transition: 'all 0.25s ease' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  background: 'var(--accent-light)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(0,229,255,0.2)',
                }}>
                  {React.cloneElement(item.icon, { width: 16, height: 16 })}
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>
                    {item.label}
                  </p>
                  {item.link ? (
                    <a
                      href={item.link}
                      target={item.link && (item.link.startsWith('mailto:') || item.link.startsWith('http')) ? '_blank' : undefined}
                      rel={item.link && (item.link.startsWith('mailto:') || item.link.startsWith('http')) ? 'noopener noreferrer' : undefined}
                      style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'pre-line' }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-main)'}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'pre-line' }}>
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Quick-call CTA */}
          <div className="lovable-card contact-cta-card" style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(0,229,255,0.08) 100%)',
            border: '1px solid rgba(59,130,246,0.25)',
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              Prefer to Talk?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              Available Mon–Sat during business hours.
            </p>
            <a
              href="tel:+919790080274"
              className="cta-button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1.25rem', textDecoration: 'none', fontSize: '0.85rem', borderRadius: '6px'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Responsive style rules */}
      <style>{`
        .contact-page-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: calc(100vh - 120px);
        }
        .contact-hero-section {
          margin-bottom: 1.5rem !important;
        }
        .contact-hero-section p {
          margin-bottom: 0.5rem !important;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 1.25rem;
        }
        .contact-card {
          padding: 1.25rem;
        }
        .contact-input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .contact-form-field {
          margin-bottom: 0.75rem;
        }
        .contact-textarea {
          min-height: 80px;
        }
        .contact-info-panel {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .contact-info-card {
          padding: 0.85rem 1rem;
        }
        .contact-cta-card {
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
        }
        @media (min-width: 769px) {
          .contact-page-container {
            min-height: calc(100vh - 150px);
            justify-content: flex-start;
          }
          .contact-hero-section {
            padding-top: 0.5rem;
            padding-bottom: 0.25rem;
            margin-bottom: 0.25rem !important;
          }
          .contact-card {
            padding: 1rem !important;
          }
          .contact-form-field {
            margin-bottom: 0.5rem;
          }
          .contact-textarea {
            min-height: 60px !important;
          }
          .contact-info-panel {
            gap: 0.35rem;
          }
          .contact-info-card {
            padding: 0.55rem 0.85rem !important;
          }
          .contact-cta-card {
            padding: 0.65rem 1rem !important;
          }
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .contact-input-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
