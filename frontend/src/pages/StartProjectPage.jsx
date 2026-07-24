import { useState, useEffect } from 'react';
import { getBackendUrl } from '../utils/api';
import SEO from '../components/SEO';

function StartProjectPage({ navigateTo }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (document.body) document.body.scrollTop = 0;
    if (document.documentElement) document.documentElement.scrollTop = 0;
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full Name is required.';
    }
    
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errs.phone = 'Please enter a valid phone number (7-15 digits).';
      }
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
      return;
    }

    setSubmitting(true);
    setError('');
    setErrors({});
    
    try {
      const res = await fetch(getBackendUrl('/api/project-submit/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok || res.status === 201) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-sm)',
    color: 'white',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '20px', paddingBottom: '20px', alignItems: 'center' }}>
      <SEO pageName="start-project" />
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Start a Project</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fill out the form below and we'll reach out within 24 hours.</p>
      </div>

      {/* Simple Form Container */}
      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
        
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>Brief Received!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Thank you! Our team will review your requirements and reach out shortly.
            </p>
            <button className="premium-cta-btn" onClick={() => navigateTo('home')} style={{ padding: '0.75rem 2rem' }}>
              Return to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? '#f87171' : 'rgba(255,255,255,0.1)',
                  background: errors.name ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)'
                }} 
              />
              {errors.name && <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? '#f87171' : 'rgba(255,255,255,0.1)',
                  background: errors.email ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)'
                }} 
              />
              {errors.email && <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mobile Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                style={{
                  ...inputStyle,
                  borderColor: errors.phone ? '#f87171' : 'rgba(255,255,255,0.1)',
                  background: errors.phone ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)'
                }} 
                placeholder="e.g. +91 98765 43210" 
              />
              {errors.phone && <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Service Needed</label>
              <select name="service" value={formData.service} onChange={handleChange} style={{...inputStyle, background: 'var(--bg-section)'}}>
                <option value="">Select a service...</option>
                <option value="Technology / Software">Technology / Software</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="AI & Automation">AI & Automation</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Internship Programs">Internship Programs</option>
                <option value="Trading & FinTech Solutions">Trading & FinTech Solutions</option>
                <option value="Web3 & Blockchain Systems">Web3 & Blockchain Systems</option>
                <option value="Multiple Services">Multiple Services</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Estimated Budget</label>
              <select name="budget" value={formData.budget} onChange={handleChange} style={{...inputStyle, background: 'var(--bg-section)'}}>
                <option value="">Select a budget...</option>
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 – $5,000">$1,000 – $5,000</option>
                <option value="$5,000 – $20,000">$5,000 – $20,000</option>
                <option value="$20,000+">$20,000+</option>
                <option value="Let's discuss">Let's discuss</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Project Details</label>
              <textarea name="message" rows="3" value={formData.message} onChange={handleChange} style={{...inputStyle, resize: 'vertical'}} placeholder="Briefly describe your goals..."></textarea>
            </div>

            {error && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-0.25rem' }}>{error}</div>}

            <button 
              type="submit" 
              disabled={submitting}
              className="premium-cta-btn"
              style={{ padding: '0.65rem', fontSize: '0.85rem', marginTop: '0.25rem', width: '100%', borderRadius: 'var(--radius-md)' }}
            >
              {submitting ? 'Submitting...' : 'Submit Brief'}
            </button>

            <div style={{ textAlign: 'center', margin: '0.2rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              — OR —
            </div>

            <a 
              href="tel:+919790080274" 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem', 
                fontSize: '0.85rem', 
                width: '100%', 
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Call Us Directly
            </a>

          </form>
        )}
      </div>
    </div>
  );
}

export default StartProjectPage;
