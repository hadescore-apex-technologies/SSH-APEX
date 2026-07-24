import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { showToast } from '../components/Toast';
import { getBackendUrl, fetchWithNoCache } from '../utils/api';
import CardIcon from '../components/CardIcon';
import DomainDetailPage from '../components/DomainDetailPage';
import SEO from '../components/SEO';
import RotatingLogo from '../components/RotatingLogo';


function EnrollModal({ course, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [mode, setMode] = useState('online');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast('Name, email, and phone number are required.', 'error');
      return;
    }
    if (resumeFile) {
      const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
      if (!allowedExtensions.exec(resumeFile.name)) {
        showToast('Only PDF, DOC, and DOCX files are allowed for resumes.', 'error');
        return;
      }
      if (resumeFile.size > 5 * 1024 * 1024) {
        showToast('Resume file size must be under 5MB.', 'error');
        return;
      }
    }
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('course_name', course.name);
    formDataToSend.append('course_category', course.category || 'Education');
    formDataToSend.append('name', name);
    formDataToSend.append('user_email', email);
    formDataToSend.append('phone', phone);
    formDataToSend.append('linkedin', linkedin || '');
    formDataToSend.append('experience', experience || '');
    formDataToSend.append('message', message || '');
    formDataToSend.append('mode', mode);
    if (resumeFile) {
      formDataToSend.append('resume', resumeFile);
    }

    try {
      const response = await fetch(getBackendUrl('/api/enroll/'), {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitted(true);
        showToast('Enrollment submitted successfully!', 'success');
      } else {
        // Fallback to local storage storage
        const subs = JSON.parse(localStorage.getItem('hadescore_enrollments') || '[]');
        subs.push({ name, email, phone, course: course.name, mode, date: new Date() });
        localStorage.setItem('hadescore_enrollments', JSON.stringify(subs));
        setSubmitted(true);
        showToast('Enrollment submitted! (Saved offline)', 'success');
      }
    } catch (error) {
      const subs = JSON.parse(localStorage.getItem('hadescore_enrollments') || '[]');
      subs.push({ name, email, phone, course: course.name, mode, date: new Date() });
      localStorage.setItem('hadescore_enrollments', JSON.stringify(subs));
      setSubmitted(true);
      showToast('Enrollment submitted! (Saved offline)', 'success');
    } finally {
      setLoading(false);
    }
  };

  const iStyle = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', color: 'white',
    fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
    transition: 'all 0.25s ease',
  };

  return createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(16px)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem 1rem 1rem',
    }}>
      <div onClick={e => e.stopPropagation()} className="glass-modal-container" style={{
        border: `1px solid rgba(139, 92, 246, 0.4)`,
        width: '100%', maxWidth: '480px',
        padding: '2.5rem', position: 'relative',
        marginTop: '4rem',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1,
          transition: 'color 0.2s ease',
        }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>×</button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', color: 'white', fontFamily: 'Outfit' }}>Enrollment Received!</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Thanks <strong>{name}</strong>! We have registered your inquiry for the <strong>{course.name}</strong>. Our advisor team will reach out to you via email shortly.
            </p>
            <button onClick={onClose} style={{
              padding: '0.75rem 2.25rem',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none', color: 'white', borderRadius: '12px',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{
                fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: '#8b5cf6',
                background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '0.3rem 0.8rem', borderRadius: '99px',
              }}>EduSkills Admission</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '0.75rem', color: 'white', fontFamily: 'Outfit' }}>{course.name}</h3>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>⏱ Duration: {course.duration || '9 Months'}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <input required placeholder="Your Full Name *" value={name} onChange={e => setName(e.target.value)} className="glass-input" />
              <input required type="email" placeholder="Your Email Address *" value={email} onChange={e => setEmail(e.target.value)} className="glass-input" />
              <input required type="tel" placeholder="Your Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} className="glass-input" />
              <input type="text" placeholder="Experience (e.g. Fresher, 2 Years)" value={experience} onChange={e => setExperience(e.target.value)} className="glass-input" />
              <input type="url" placeholder="LinkedIn Profile URL" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="glass-input" />
              <div style={{ padding: '0.2rem 0' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontWeight: '700' }}>Upload Resume (Optional)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} style={{ width: '100%', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'rgba(255,255,255,0.6)', outline: 'none', fontSize: '0.85rem' }} />
              </div>
              <textarea placeholder="Any message or questions?" rows="2" value={message} onChange={e => setMessage(e.target.value)} className="glass-input" style={{ resize: 'vertical' }} />


              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                {['online', 'offline'].map(m => (
                  <button key={m} type="button" onClick={() => setMode(m)} style={{
                    flex: 1, padding: '0.8rem', borderRadius: '12px',
                    border: `1px solid ${mode === m ? '#8b5cf6' : 'rgba(255,255,255,0.06)'}`,
                    background: mode === m ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.02)',
                    color: mode === m ? 'white' : 'rgba(255,255,255,0.5)',
                    fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
                    textTransform: 'capitalize', transition: 'all 0.25s ease',
                  }}>{m === 'online' ? 'Online Live' : 'Offline Campus'}</button>
                ))}
              </div>

              <button type="submit" style={{
                padding: '0.9rem', borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6, #00e5ff)',
                color: 'white', border: 'none', fontWeight: '800',
                fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.75rem',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)',
                transition: 'transform 0.2s ease',
              }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {loading ? 'Processing...' : 'Confirm Admission Refer'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

const getDomainIcon = (iconName) => {
  const style = { width: '20px', height: '20px', strokeWidth: '2.5px', display: 'block' };
  switch (iconName) {
    case 'brain':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3.5 3.5 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3.5 3.5 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'gear':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'flight':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'biotech':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 10.5C3.5 11.5 2 13 2 15s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5c0-1.5-1-2.5-2-3.5" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
          <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
      );
    case 'wrench':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'building':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="9" y1="22" x2="9" y2="16" />
          <line x1="15" y1="22" x2="15" y2="16" />
          <line x1="9" y1="16" x2="15" y2="16" />
          <path d="M8 6h8M8 10h8M8 14h8" />
        </svg>
      );
    case 'cpu':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
        </svg>
      );
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" style={style} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
  }
};

const getDomainIconMeta = (iconName) => {
  switch (iconName) {
    case 'brain':
      return { bg: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.25)' };
    case 'shield':
      return { bg: 'rgba(0, 229, 255, 0.12)', color: '#00e5ff', border: 'rgba(0, 229, 255, 0.25)' };
    case 'code':
      return { bg: 'rgba(79, 156, 255, 0.12)', color: '#4f9cff', border: 'rgba(79, 156, 255, 0.25)' };
    case 'gear':
      return { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316', border: 'rgba(249, 115, 22, 0.25)' };
    case 'flight':
      return { bg: 'rgba(14, 165, 233, 0.12)', color: '#0ea5e9', border: 'rgba(14, 165, 233, 0.25)' };
    case 'biotech':
      return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'rgba(16, 185, 129, 0.25)' };
    case 'wrench':
      return { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' };
    case 'building':
      return { bg: 'rgba(217, 119, 6, 0.12)', color: '#d97706', border: 'rgba(217, 119, 6, 0.25)' };
    case 'cpu':
      return { bg: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', border: 'rgba(6, 182, 212, 0.25)' };
    case 'bolt':
      return { bg: 'rgba(132, 204, 22, 0.12)', color: '#84cc16', border: 'rgba(132, 204, 22, 0.25)' };
    default:
      return { bg: 'rgba(255, 255, 255, 0.08)', color: 'white', border: 'rgba(255, 255, 255, 0.12)' };
  }
};

function InternApplyModal({ onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [experience, setExperience] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [availability, setAvailability] = useState('');
  const [message, setMessage] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !college || !degree || !graduationYear || !availability || !resumeFile) {
      showToast('Please fill all mandatory fields including resume.', 'error');
      return;
    }
    if (resumeFile) {
      const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
      if (!allowedExtensions.exec(resumeFile.name)) {
        showToast('Only PDF, DOC, and DOCX files are allowed for resumes.', 'error');
        return;
      }
      if (resumeFile.size > 5 * 1024 * 1024) {
        showToast('Resume file size must be under 5MB.', 'error');
        return;
      }
    }
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('phone', phone);
    formDataToSend.append('linkedin', linkedin || '');
    formDataToSend.append('experience', experience || '');
    formDataToSend.append('college_name', college || '');
    formDataToSend.append('degree', degree || '');
    formDataToSend.append('graduation_year', graduationYear || '');
    formDataToSend.append('availability', availability || '');
    formDataToSend.append('cover_letter', message || '');
    formDataToSend.append('role_title', 'Learning Hub Intern');
    formDataToSend.append('role_type', 'Internship');
    formDataToSend.append('role_dept', 'Learning Hub');
    formDataToSend.append('resume', resumeFile);

    try {
      const response = await fetch(getBackendUrl('/api/careers/apply/'), {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitted(true);
        showToast('Internship Application submitted!', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.detail || 'Failed to submit application.', 'error');
      }
    } catch (error) {
      showToast('Network error while submitting application.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const iStyle = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', color: 'white',
    fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
    transition: 'all 0.25s ease',
  };

  return createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(16px)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      overflowY: 'auto'
    }}>
      <div onClick={e => e.stopPropagation()} className="glass-modal-container" style={{
        border: '1px solid rgba(139, 92, 246, 0.4)',
        width: '100%', maxWidth: '580px',
        padding: '2.5rem', position: 'relative',
        margin: 'auto'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1,
        }}>×</button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', color: 'white', fontFamily: 'Outfit' }}>Application Sent!</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Thanks <strong>{name}</strong>! We've received your internship application. Our team will review your profile and reach out via email shortly.
            </p>
            <button onClick={onClose} style={{
              padding: '0.75rem 2.25rem', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none', color: 'white', borderRadius: '12px', fontWeight: '700', cursor: 'pointer'
            }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '99px' }}>Internship Ecosystem</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '0.75rem', color: 'white', fontFamily: 'Outfit' }}>Apply for Internship</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Fill in your details below to apply for our stipend-paid internships.</p>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <input required placeholder="Your Full Name *" value={name} onChange={e => setName(e.target.value)} style={iStyle} />
              <input required type="email" placeholder="Your Email Address *" value={email} onChange={e => setEmail(e.target.value)} style={iStyle} />
              <input required type="tel" placeholder="Your Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} style={iStyle} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input required placeholder="College / University *" value={college} onChange={e => setCollege(e.target.value)} style={iStyle} />
                <input required placeholder="Degree & Major *" value={degree} onChange={e => setDegree(e.target.value)} style={iStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input required placeholder="Graduation Year *" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} style={iStyle} />
                <input required placeholder="Availability (e.g. 3 Months) *" value={availability} onChange={e => setAvailability(e.target.value)} style={iStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input placeholder="Experience Level" value={experience} onChange={e => setExperience(e.target.value)} style={iStyle} />
                <input type="url" placeholder="LinkedIn Profile URL" value={linkedin} onChange={e => setLinkedin(e.target.value)} style={iStyle} />
              </div>

              <div style={{ padding: '0.2rem 0' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontWeight: '700' }}>Upload Resume (PDF/DOC) *</label>
                <input required type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} style={iStyle} />
              </div>

              <textarea placeholder="Why are you applying for this internship?" rows="3" value={message} onChange={e => setMessage(e.target.value)} style={{ ...iStyle, resize: 'vertical' }} />

              <button type="submit" disabled={loading} style={{
                padding: '0.9rem', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #00e5ff)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.75rem', opacity: loading ? 0.7 : 1
              }}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

function LearningHubPage({ navigateTo }) {
  const [activeDomain, setActiveDomain] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInternModal, setShowInternModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');



  // Live Projects Data (hardcoded fallback - will be replaced by API data)
  const projects = [
    { name: 'FinSight AI', complexity: 'Advanced', duration: '8 weeks', desc: 'Fintech analytics copilot', stack: ['Python', 'LangChain', 'FastAPI'], mentor: 'Dr. Aarav Mehta' },
    { name: 'ShieldOps SOC', complexity: 'Pro', duration: '10 weeks', desc: 'Enterprise SOC simulation', stack: ['Splunk', 'ELK', 'Wazuh'], mentor: 'Rohan Bhatia' },
    { name: 'QuickCart MERN', complexity: 'Intermediate', duration: '6 weeks', desc: 'E-commerce platform', stack: ['React', 'Node', 'Mongo', 'Stripe'], mentor: 'Sneha Iyer' },
    { name: 'AgriDrone Mapper', complexity: 'Advanced', duration: '12 weeks', desc: 'Crop health mapping', stack: ['ROS', 'OpenCV', 'DJI SDK'], mentor: 'Aditi Rao' },
    { name: 'MediGenome', complexity: 'Pro', duration: '10 weeks', desc: 'Genome variant analysis', stack: ['Python', 'BioPython', 'Streamlit'], mentor: 'Priya Nair' },
    { name: 'VoltGrid EV', complexity: 'Advanced', duration: '9 weeks', desc: 'EV battery telematics', stack: ['MATLAB', 'Simulink', 'IoT'], mentor: 'Karan Verma' }
  ];

  // Programs Tracks Data
  const programTracks = [
    {
      title: 'Foundation',
      duration: '3 months',
      price: '₹19,999',
      desc: 'For first/second-year students entering tech.',
      features: ['6 modules', '2 mini projects', 'Foundation Cert']
    },
    {
      title: 'Career Track',
      duration: '9 months',
      price: '₹79,999',
      popular: true,
      desc: 'Job-ready in 9 months. Mentorship + internship + placement.',
      features: ['12 modules', '4 industry projects', 'Paid internship', 'Placement guarantee*']
    },
    {
      title: 'Pro Cohort',
      duration: '12 months',
      price: '₹1,49,999',
      desc: 'Elite path with capstone + startup pod + senior mentor.',
      features: ['18 modules', '6 projects + capstone', '1:1 senior mentor', 'Founder track']
    }
  ];



  const triggerEnroll = (trackName) => {
    setSelectedCourse({
      name: trackName,
      duration: trackName.includes('Foundation') ? '3 Months' : trackName.includes('Career') ? '9 Months' : '12 Months'
    });
  };

  // ALWAYS fetch fresh from DB — no localStorage caching for EduSkills.
  // This guarantees admin changes (add/edit/delete) ALWAYS appear on the website.
  // Clear any old stale localStorage keys left from previous code versions.
  const CACHE_VERSION = 'v4_sync'; // bump this to force-clear old caches
  const CACHE_KEY = `hadescore_eduskills_cv_${CACHE_VERSION}`;
  if (!sessionStorage.getItem(CACHE_KEY)) {
    // First load of this session — wipe ALL old EduSkills localStorage keys
    ['mentors', 'domains', 'projects'].forEach(k => {
      localStorage.removeItem(`hadescore_cache_eduskills_${k}`);
    });
    sessionStorage.setItem(CACHE_KEY, '1');
  }

  const [mentorsList, setMentorsList] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_eduskills_mentors');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [domainsList, setDomainsList] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_eduskills_domains');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [projectsList, setProjectsList] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_eduskills_projects');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [domainSearchTerm, setDomainSearchTerm] = useState('');

  // Fetch ALL EduSkills data fresh from the backend database
  // Never reads from localStorage — always reflects what admin has set
  const fetchAllData = (showSpinner = false) => {
    // Reset to null (loading) before each fetch ONLY if we want to show spinner
    if (showSpinner) {
      setMentorsList(null);
      setDomainsList(null);
      setProjectsList(null);
    }

    // Fetch Mentors
    fetchWithNoCache(getBackendUrl(`/api/eduskills/mentors/`))
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setMentorsList(list);
        localStorage.setItem('hadescore_cache_eduskills_mentors', JSON.stringify(list));
      })
      .catch(() => {
        setMentorsList(prev => prev !== null ? prev : []);
      });

    // Fetch Domains
    fetchWithNoCache(getBackendUrl(`/api/eduskills/domains/`))
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setDomainsList(list); // Always use API data, even if empty
        localStorage.setItem('hadescore_cache_eduskills_domains', JSON.stringify(list));
      })
      .catch(() => {
        setDomainsList(prev => prev !== null ? prev : []);
      });

    // Fetch Live Projects
    fetchWithNoCache(getBackendUrl(`/api/eduskills/projects/`))
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        const formatted = list.map(p => ({
          ...p,
          stack: typeof p.stack === 'string'
            ? p.stack.split(',').map(s => s.trim()).filter(Boolean)
            : (Array.isArray(p.stack) ? p.stack : [])
        }));
        setProjectsList(formatted);
        localStorage.setItem('hadescore_cache_eduskills_projects', JSON.stringify(formatted));
      })
      .catch(() => {
        setProjectsList(prev => prev !== null ? prev : []);
      });
  };

  // Fetch on mount
  useEffect(() => {
    const hasMentors = localStorage.getItem('hadescore_cache_eduskills_mentors');
    const hasDomains = localStorage.getItem('hadescore_cache_eduskills_domains');
    const hasProjects = localStorage.getItem('hadescore_cache_eduskills_projects');
    const needsLoader = !hasMentors || !hasDomains || !hasProjects;
    fetchAllData(needsLoader);
  }, []);

  // Refetch when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAllData(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleSelectDomain = (dom) => {
    setActiveDomain(dom);
    const scrollContainer = document.body;
    if (scrollContainer) scrollContainer.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeDomain) {
    return (
      <div style={{ color: 'white', fontFamily: 'Inter, sans-serif', padding: '0.25rem 0', marginTop: '-30px' }}>
        {selectedCourse && <EnrollModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
        {showInternModal && <InternApplyModal onClose={() => setShowInternModal(false)} />}
        <DomainDetailPage 
          domain={activeDomain} 
          onBack={() => {
            setActiveDomain(null);
            setTimeout(() => {
              const explorer = document.getElementById('domain-explorer');
              if (explorer) {
                explorer.scrollIntoView({ behavior: 'smooth' });
              }
            }, 50);
          }}
          domainsList={domainsList}
          triggerEnroll={triggerEnroll}
          onSelectDomain={handleSelectDomain}
          mentorsList={mentorsList}
          projectsList={projectsList}
        />
      </div>
    );
  }

  return (
    <div style={{ color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <SEO pageName="eduskills" />
      {selectedCourse && <EnrollModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
      {showInternModal && <InternApplyModal onClose={() => setShowInternModal(false)} />}

      <style>{`
        /* Custom Domain Explorer styling */
        .domain-grid-custom {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        @media (max-width: 1300px) {
          .domain-grid-custom {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 900px) {
          .domain-grid-custom {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .domain-grid-custom {
            grid-template-columns: 1fr;
          }
        }

        .domain-card-custom {
          background: rgba(8, 12, 28, 0.45) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 24px;
          padding: 2rem 1.75rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .domain-card-custom:hover {
          transform: translateY(-6px);
          background: rgba(16, 22, 42, 0.55) !important;
          border-color: rgba(0, 229, 255, 0.3) !important;
          box-shadow: 0 20px 40px rgba(0, 229, 255, 0.08), 0 0 0 1px rgba(0, 229, 255, 0.05);
        }
        .domain-card-custom:hover .domain-explore-arrow {
          transform: translateX(4px);
        }

        .domain-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        /* Floating shapes animation styling */
        @keyframes floatSlow1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.1); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.05); }
        }
        
        /* Floating shapes elements */
        .glow-shape-1 {
          position: fixed; width: 450px; height: 450px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
          border-radius: 50%; top: 10%; left: -5%; pointer-events: none; z-index: -1;
          animation: floatSlow1 16s ease-in-out infinite;
        }
        .glow-shape-2 {
          position: fixed; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%);
          border-radius: 50%; bottom: 10%; right: -5%; pointer-events: none; z-index: -1;
          animation: floatSlow2 20s ease-in-out infinite;
        }

        /* Glassmorphism card default styles */
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
        .division-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        /* Hover animation directions */
        .hover-card-drift {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card-drift:hover {
          transform: translateY(-8px);
          background: rgba(16, 22, 42, 0.55) !important;
          border-color: rgba(139, 92, 246, 0.35) !important;
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.05);
        }
        
        .mode-card-cyan:hover {
          border-color: rgba(0, 229, 255, 0.3) !important;
          box-shadow: 0 15px 30px rgba(0, 229, 255, 0.08);
          background: rgba(16, 22, 42, 0.55) !important;
          transform: translateY(-6px);
        }
        .mode-card-purple:hover {
          border-color: rgba(139, 92, 246, 0.3) !important;
          box-shadow: 0 15px 30px rgba(139, 92, 246, 0.08);
          background: rgba(16, 22, 42, 0.55) !important;
          transform: translateY(-6px);
        }
        .mode-card-pink:hover {
          border-color: rgba(236, 72, 153, 0.3) !important;
          box-shadow: 0 15px 30px rgba(236, 72, 153, 0.08);
          background: rgba(16, 22, 42, 0.55) !important;
          transform: translateY(-6px);
        }

        /* Custom back link button */
        .back-ecosystem-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255,255,255,0.45);
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 2rem;
          transition: all 0.25s ease;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .back-ecosystem-link:hover {
          color: #8b5cf6;
          transform: translateX(-4px);
        }

        /* Layout Grid responsive details */
        @media (max-width: 968px) {
          .modes-grid, .success-grid, .community-grid, .program-grid-custom {
            grid-template-columns: 1fr !important;
          }
          .domain-grid, .projects-grid-custom {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          }
        }
      `}</style>

      {/* Floating Ambient Background Shapes */}
      <div className="glow-shape-1"></div>
      <div className="glow-shape-2"></div>

      {/* Hero Section */}
      <section className="page-hero-section" style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060912',
        backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 18, 0.75), rgba(6, 9, 18, 0.95)), url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80)`
      }}>
        <RotatingLogo opacity={0.12} size="default" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '900px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.75rem)', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif', margin: '0 0 1.5rem' }}>
            Learn. Build. Earn.<br /><span style={{ background: 'linear-gradient(135deg, #a855f7, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Innovate.</span>
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 'clamp(1rem, 2.2vw, 1.15rem)', lineHeight: '1.7', maxWidth: '780px', margin: '0 auto 2.25rem', fontWeight: '400' }}>
            Transform your career with industry-ready training, live projects, internships, mentorship, placement support and startup opportunities — all under one premium ecosystem.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              className="btn" 
              style={{
                background: 'linear-gradient(95deg, #6366f1 0%, #00e5ff 100%)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.45)',
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.6)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.45)';
              }}
              onClick={() => {
                document.getElementById('programs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Programs <span style={{ marginLeft: '4px' }}>→</span>
            </button>
            <button 
              className="btn" 
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
              onClick={() => setShowInternModal(true)}
            >
              Apply for Internship
            </button>
            <button 
              className="btn" 
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
              onClick={() => {
                document.getElementById('mentors-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Talk to Mentor
            </button>
          </div>
        </div>
      </section>

      {/* Content wrapper for scrolling contents */}
      <div className="page-content-wrapper">

      {/* Training Modes */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header">
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Training Modes</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Learn the way that fits you.</h2>
        </div>
        <div className="modes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {/* Mode 1 */}
          <div className="division-card mode-card-cyan" style={{ border: '1px solid rgba(0, 229, 255, 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '0.4rem', fontFamily: 'Outfit' }}>Offline Classroom</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>Face-to-face cohorts inside our premium campuses.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Face-to-face learning', 'Hands-on lab access', '1:1 mentor support', 'Networking events', 'Capstone showcase'].map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#00e5ff', fontWeight: '800' }}>✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
          {/* Mode 2 */}
          <div className="division-card mode-card-purple" style={{ border: '1px solid rgba(168, 85, 247, 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '0.4rem', fontFamily: 'Outfit' }}>Online Live</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>Live interactive classes with global reach.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Live interactive classes', 'Lifetime recordings', 'Remote labs', 'Flexible schedule', 'Global access'].map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#a855f7', fontWeight: '800' }}>✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
          {/* Mode 3 */}
          <div className="division-card mode-card-pink" style={{ border: '1px solid rgba(236, 72, 153, 0.1)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ec4899', color: 'white', fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Most flexible</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '0.4rem', fontFamily: 'Outfit' }}>Hybrid</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>The best of both worlds — online + on-campus sprints.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Online + offline mix', 'Real client projects', 'Industry mentorship', 'Internship integration', 'Premium support'].map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#ec4899', fontWeight: '800' }}>✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why Hadescore Stats */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Why Hadescore</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Numbers that speak louder.</h2>
        </div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3rem' }}>
          {[
            { num: '10,000+', lbl: 'Students Trained' },
            { num: '500+', lbl: 'Industry Projects' },
            { num: '250+', lbl: 'Internship Slots' },
            { num: '100+', lbl: 'Industry Mentors' },
            { num: '50+', lbl: 'Technology Domains' },
            { num: '95%', lbl: 'Student Satisfaction' }
          ].map((stat, i) => (
            <div className="stat-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-number" style={{ background: 'linear-gradient(135deg, #a855f7, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.3))' }}>{stat.num}</div>
              <div className="stat-label" style={{ fontSize: '0.85rem' }}>{stat.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Placement & Career Support */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header">
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Placement & Career Support</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Career growth starts here.</h2>
        </div>
        
        <div className="why-choose-layout" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2.5rem', alignItems: 'center', marginTop: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {[
              'Placement Assistance', 'Resume Building', 'LinkedIn Optimization', 
              'Mock Interviews', 'Career Guidance', 'Freelancing Support', 'Startup Mentorship'
            ].map((srv, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#00e5ff', fontSize: '1.1rem' }}>✓</span>
                <span style={{ fontSize: '0.92rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)' }}>{srv}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', background: 'rgba(10,14,28,0.5)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>Placement Outcomes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { val: '500+', text: 'Career Opportunities' },
                { val: '90%', text: 'Interview Success' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: idx < 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{item.text}</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#00e5ff' }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


      </section>

      {/* Industry Mentors - Only show if mentors exist */}
      {mentorsList && mentorsList.length > 0 && (
      <section id="mentors-section" style={{ marginBottom: '6.5rem' }}>
        <div className="section-header" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Industry Mentors</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Learn from practitioners, not lecturers.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Search bar & filter row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search mentors by name or role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  background: 'rgba(8, 12, 28, 0.45)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '9999px',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#00e5ff';
                  e.target.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.15)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Filter pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['All', 'AI / ML', 'Fullstack', 'Cyber', 'Data', 'Cloud', 'Robotics', 'Design', 'Marketing', 'Others'].map(filter => {
                const isActive = selectedFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '9999px',
                      background: isActive ? 'linear-gradient(135deg, #00e5ff, #8b5cf6)' : 'rgba(8, 12, 28, 0.45)',
                      border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? '0 4px 15px rgba(0, 229, 255, 0.35)' : 'none',
                    }}
                    onMouseOver={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = '#00e5ff';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseOut={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                      }
                    }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filtered Mentors Grid */}
        {mentorsList === null ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            Loading mentors...
          </div>
        ) : (
        <div className="domain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
          {mentorsList.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  m.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTag = selectedFilter === 'All' || m.tag.replace(/\s+/g, '') === selectedFilter.replace(/\s+/g, '');
            return matchesSearch && matchesTag;
          }).map((m, i) => (
            <div className="division-card hover-card-drift" key={i} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #00e5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.95rem', boxShadow: '0 0 10px rgba(0, 229, 255, 0.25)' }}>
                    {m.initial}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: 'white' }}>{m.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: '600' }}>{m.role}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.company}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>⏱ {m.exp}</span>
                  <span style={{ color: '#8b5cf6', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>{m.tag}</span>
                </div>
              </div>
              
              <a 
                href={`mailto:${m.email || 'hadescore.apex.technologies@gmail.com'}?subject=Inquiry%20Regarding%20Mentorship%20with%20${encodeURIComponent(m.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  marginTop: '1.25rem', 
                  width: '100%',
                  padding: '0.55rem 1rem', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'rgba(255,255,255,0.85)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(219, 68, 85, 0.15), rgba(139, 92, 246, 0.15))';
                  e.currentTarget.style.borderColor = '#db4437';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(219, 68, 85, 0.2)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Contact Mentor
              </a>
            </div>
          ))}
          {mentorsList.length > 0 && mentorsList.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  m.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTag = selectedFilter === 'All' || m.tag.replace(/\s+/g, '') === selectedFilter.replace(/\s+/g, '');
            return matchesSearch && matchesTag;
          }).length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {mentorsList.length === 0 ? 'No mentors available. Check back soon.' : 'No mentors found matching your search/filter criteria.'}
            </div>
          )}
          {mentorsList.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              No mentors available. Check back soon.
            </div>
          )}
        </div>
        )}
      </section>
      )}

      {/* Domain Explorer - Rendered unconditionally so scroll anchors work immediately */}
      <section id="domain-explorer" style={{ marginBottom: '6.5rem' }}>
        <div className="section-header">
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Domain Explorer</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Pick your future-ready domain.</h2>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '500px', margin: '2rem auto 2.5rem', position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(168,85,247,0.4)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={domainSearchTerm}
            onChange={(e) => setDomainSearchTerm(e.target.value)}
            placeholder="Search domains (e.g. AI, Cybersecurity, Fullstack)…"
            style={{
              width: '100%',
              padding: '0.85rem 3rem 0.85rem 3rem',
              background: 'rgba(168,85,247,0.06)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '14px',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.3s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => { e.target.style.borderColor = '#a855f7'; e.target.style.background = 'rgba(168,85,247,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(168,85,247,0.2)'; e.target.style.background = 'rgba(168,85,247,0.06)'; }}
          />
          {domainSearchTerm && (
            <button
              onClick={() => setDomainSearchTerm('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '1.3rem',
                lineHeight: 1,
                padding: '0.25rem',
                transition: 'color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.color = '#a855f7'}
              onBlur={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              onMouseOver={(e) => e.currentTarget.style.color = '#a855f7'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              ×
            </button>
          )}
        </div>

        {domainsList === null ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            Loading domains...
          </div>
        ) : domainsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>No domains available yet. Check back soon.</p>
          </div>
        ) : (() => {
          const filteredDomains = domainsList.filter(dom => 
            !domainSearchTerm || 
            dom.title.toLowerCase().includes(domainSearchTerm.toLowerCase()) ||
            (dom.desc && dom.desc.toLowerCase().includes(domainSearchTerm.toLowerCase())) ||
            (dom.badge && dom.badge.toLowerCase().includes(domainSearchTerm.toLowerCase()))
          );
          
          return filteredDomains.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(168,85,247,0.1)', borderRadius: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>No domains match "{domainSearchTerm}"</p>
              <button
                onClick={() => setDomainSearchTerm('')}
                style={{
                  padding: '0.5rem 1.25rem',
                  background: 'rgba(168,85,247,0.15)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: '10px',
                  color: '#a855f7',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '0.75rem'
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
        <div className="domain-grid-custom">
          {filteredDomains.map((dom, i) => {
            const iconMeta = getDomainIconMeta(dom.icon);
            return (
              <div 
                className="domain-card-custom" 
                key={i} 
                onClick={() => handleSelectDomain(dom)}
              >
                {/* Header row: Icon & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '1.75rem' }}>
                  <div 
                    className="domain-icon-circle"
                    style={{
                      background: iconMeta.bg,
                      color: iconMeta.color,
                      border: `1px solid ${iconMeta.border}`,
                      marginBottom: 0
                    }}
                  >
                    {getDomainIcon(dom.icon)}
                  </div>
                  {dom.badge && (
                    <span 
                      style={{
                        background: dom.badge.toLowerCase().includes('popular') 
                          ? 'linear-gradient(135deg, #a855f7, #ec4899)' 
                          : 'linear-gradient(135deg, #10b981, #84cc16)',
                        color: 'white',
                        fontSize: '0.62rem',
                        fontWeight: '800',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '99px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {dom.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem', fontFamily: 'Outfit', lineHeight: '1.3' }}>
                  {dom.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '2.0rem', flexGrow: 1 }}>
                  {dom.desc}
                </p>

                {/* Footer specs & link */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {dom.duration && (
                      <span style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '0.3rem 0.65rem', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: '600' }}>
                        {dom.duration}
                      </span>
                    )}
                    <span style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '0.3rem 0.65rem', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: '600' }}>
                      {dom.salary}
                    </span>
                  </div>
                  <div style={{ color: iconMeta.color, fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    Explore <span className="domain-explore-arrow" style={{ display: 'inline-block', transition: 'transform 0.2s' }}>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          );
        })()}
      </section>


      {/* Internship Ecosystem */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header">
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Internship Ecosystem</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Gain real industry experience.</h2>
        </div>
        
        <div className="why-choose-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center', marginTop: '3.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {[
              { t: 'Virtual Internships', d: 'Remote, structured, mentor-reviewed sprints.' },
              { t: 'Live Client Projects', d: 'Ship features for actual paying customers.' },
              { t: 'Industry Mentorship', d: 'Weekly 1:1s with senior practitioners.' },
              { t: 'Performance Tracking', d: 'Sprint reviews & measurable KPIs.' },
              { t: 'Completion Certificates', d: 'QR-verifiable industry-recognized certs.' },
              { t: 'Recommendation Letters', d: 'From industry mentors and practitioners.' },
              { t: 'Placement Assistance', d: 'Top interns get fast-tracked to offers.' }
            ].map((srv, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#00e5ff' }}>✓</span> {srv.t}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.45', paddingLeft: '1.35rem' }}>{srv.d}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem 2rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: '24px', textAlign: 'center', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#8b5cf6', color: 'white', fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.85rem', borderRadius: '4px' }}>Guaranteed Stipend</span>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>💼</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit' }}>Stipend Paid</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>Earn while you learn and construct your industrial background.</p>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: '0.5rem', fontFamily: 'Outfit' }}>
              ₹8k–₹25k/mo
            </div>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>depending on track &amp; sprint evaluations</span>
            
            <button className="btn" style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #00e5ff)', color: 'white', fontWeight: '800', fontSize: '0.95rem', border: 'none', cursor: 'pointer', boxShadow: '0 5px 25px rgba(139, 92, 246, 0.45)', transition: 'all 0.3s ease' }} onClick={() => setShowInternModal(true)}>
              Apply for Internship →
            </button>
          </div>
        </div>
      </section>

      {/* Certification Verification Mockup */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Certification</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Industry-recognized, Certificate Verification.</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem' }}>
          <div style={{ width: '100%', maxWidth: '600px', padding: '3rem 2.5rem', background: 'rgba(8, 12, 28, 0.45)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)', padding: '0.25rem 0.75rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hadescore Pro</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', marginTop: '0.75rem', marginBottom: '0.35rem', fontFamily: 'Outfit' }}>Certificate of Completion</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                  Verify Hadescore credentials, evaluation grades, and cryptographic signatures on our secure registry.
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '0.15rem' }}>Cert ID</div>
                  <div style={{ color: 'white', fontWeight: '700' }}>HTHAT-2026-AI-04829</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '0.15rem' }}>Verification</div>
                  <div style={{ color: '#00e5ff', fontWeight: '700' }}>Unique Certificate ID</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <a 
                  href="/verification" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    fontSize: '0.82rem', 
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.75rem 1.75rem', 
                    borderRadius: '10px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.25)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 229, 255, 0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 229, 255, 0.25)';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Verify Certificate Authenticity
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Numbers */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Community</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Plug into a 12,000+ learner network.</h2>
        </div>

        <div className="community-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3.5rem' }}>
          {[
            { title: 'Student Community', val: '12k+' },
            { title: 'Mentor Network', val: '100+' },
            { title: 'Hackathons', val: 'Monthly' },
            { title: 'Coding Challenges', val: 'Weekly' },
            { title: 'Workshops', val: '20+ /mo' },
            { title: 'Tech Events', val: 'Quarterly' }
          ].map((item, idx) => (
            <div className="division-card hover-card-drift" key={idx} style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{item.title}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', fontFamily: 'Outfit' }}>{item.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="blue-cta-banner" style={{ background: 'linear-gradient(135deg, #1e1b4b, #0c0a24)', border: '1px solid rgba(139, 92, 246, 0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', padding: '3.5rem 2.5rem', borderRadius: '24px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#00e5ff', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.5rem' }}>Your future starts today.</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: 'white', fontFamily: 'Outfit', lineHeight: '1.15' }}>Cohort-based, mentor-led, placement-backed.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '640px', margin: '0 auto 2.5rem', fontSize: '0.98rem' }}>
            Join the most premium learning ecosystem in India.
          </p>
          <button className="btn" style={{ background: 'linear-gradient(135deg, #8b5cf6, #00e5ff)', border: 'none', padding: '0.9rem 2.25rem', borderRadius: '12px', color: 'white', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 5px 25px rgba(139, 92, 246, 0.45)', transition: 'all 0.3s ease' }} onClick={() => navigateTo('solutions')}>
            Explore Apex Innovation →
          </button>
        </div>
      </section>
      </div>
    </div>
  );
}

export default LearningHubPage;
