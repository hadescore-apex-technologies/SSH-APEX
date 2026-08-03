import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { showToast } from '../components/Toast';
import { getBackendUrl } from '../utils/api';
import CardIcon from '../components/CardIcon';
import controlRoomHero from '../assets/control_room_hero.png';
import SEO from '../components/SEO';
import RotatingLogo from '../components/RotatingLogo';


const culture = [
  { icon: 'cpu', title: 'Real Work from Day One', desc: 'No coffee runs. You work on actual products, real client projects, and things that matter.' },
  { icon: 'growth', title: 'Fast Career Growth', desc: 'We promote from within. Performance-based advancement, not seniority queues.' },
  { icon: 'social', title: 'Cross-Functional Teams', desc: 'Designers, developers, marketers, and strategists work side by side every day.' },
  { icon: 'EDU', title: 'Continuous Learning', desc: 'Free access to all Hadescore Learning Hub programs. Training is part of the job.' },
  { icon: 'incubate', title: 'Build Your Own Thing', desc: 'Have a startup idea? We provide workspace, mentorship, and incubation resources.' },
  { icon: 'web', title: 'Flexible Work', desc: 'Hybrid and remote options available for most roles. Output matters, not attendance.' },
];

const perks = [
  'Competitive Pay',
  'Free Courses',
  'Hybrid Work',
  'Fast Promotion',
  'Mentorship',
  'Certifications',
  'Diverse Team',
  'Startup Spirit',
];



function ApplyModal({ role, onClose }) {
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
    if (!name || !email || !phone || !resumeFile) {
      showToast('Name, email, phone number, and resume are required.', 'error');
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
    if (role.isBackend && role.id) {
      formDataToSend.append('job', role.id);
    }
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
    formDataToSend.append('role_title', role.title || '');
    formDataToSend.append('role_type', role.type || '');
    formDataToSend.append('role_dept', role.dept || '');
    formDataToSend.append('resume', resumeFile);

    try {
      const response = await fetch(getBackendUrl('/api/careers/apply/'), {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitted(true);
        showToast('Application submitted successfully!', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.detail || 'Failed to submit application. Please check fields.', 'error');
      }
    } catch (error) {
      showToast('Network error while submitting application.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(16px)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} className="glass-modal-container" style={{
        border: `1px solid ${role.color}50`,
        width: '100%', maxWidth: '480px',
        padding: '2.5rem', position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1.25rem',
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1,
          transition: 'color 0.2s ease',
        }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>×</button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>Application Sent!</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Thanks {name.split(' ')[0]}! We've received your application for <strong style={{ color: role.color }}>{role.title}</strong>. Our HR team will be in touch within 2–3 business days.
            </p>
            <button onClick={onClose} style={{
              marginTop: '1.5rem', padding: '0.75rem 2rem',
              background: 'var(--primary-light)', border: '1px solid rgba(88,166,255,0.2)',
              color: 'var(--primary)', borderRadius: 'var(--radius-md)',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem',
            }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: role.color,
                  background: `${role.color}15`, border: `1px solid ${role.color}30`,
                  padding: '0.2rem 0.65rem', borderRadius: '99px',
                }}>{role.type}</span>
                <span style={{
                  fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--text-muted)',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  padding: '0.2rem 0.65rem', borderRadius: '99px',
                }}>{role.dept}</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Apply for: {role.title}</h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required placeholder="Full name *" value={name} onChange={e => setName(e.target.value)} className="glass-input" />
              <input required type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)} className="glass-input" />
              <input required type="tel" placeholder="Phone number *" value={phone} onChange={e => setPhone(e.target.value)} className="glass-input" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>LinkedIn URL</span>
                  <input type="url" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={e => setLinkedin(e.target.value)} style={iStyle} onFocus={e => e.target.style.borderColor = role.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Experience</span>
                  <input type="text" placeholder="e.g. 2 Years, Fresher" value={experience} onChange={e => setExperience(e.target.value)} style={iStyle} onFocus={e => e.target.style.borderColor = role.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
              </div>

              {role.type === 'Internship' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>College / University *</span>
                      <input required type="text" placeholder="e.g. MIT, Stanford" value={college} onChange={e => setCollege(e.target.value)} style={iStyle} onFocus={e => e.target.style.borderColor = role.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Degree & Major *</span>
                      <input required type="text" placeholder="e.g. B.Tech CS" value={degree} onChange={e => setDegree(e.target.value)} style={iStyle} onFocus={e => e.target.style.borderColor = role.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Graduation Year *</span>
                      <input required type="text" placeholder="e.g. 2025" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} style={iStyle} onFocus={e => e.target.style.borderColor = role.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Availability *</span>
                      <input required type="text" placeholder="e.g. 3 Months, 6 Months" value={availability} onChange={e => setAvailability(e.target.value)} style={iStyle} onFocus={e => e.target.style.borderColor = role.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    </div>
                  </div>
                </>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Resume / CV (PDF, DOC, DOCX) *</label>
                <input
                  required
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setResumeFile(e.target.files[0])}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.88rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <textarea
                placeholder="Tell us why you're a great fit..."
                value={message} onChange={e => setMessage(e.target.value)}
                rows={3} className="glass-input" style={{ resize: 'vertical' }}
              />
              <button type="submit" disabled={loading} style={{
                padding: '0.9rem', borderRadius: 'var(--radius-md)',
                background: loading ? 'var(--text-muted)' : `linear-gradient(135deg, ${role.color}, #38bdf8)`,
                color: '#fff', border: 'none', fontWeight: '800',
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}>{loading ? 'Submitting...' : 'Submit Application'}</button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

const iStyle = {
  width: '100%', padding: '0.85rem 1rem',
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)', color: 'var(--text-main)',
  fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
};

function RoleCard({ role, onApply }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(16, 22, 42, 0.55)' : 'rgba(8, 12, 28, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: hovered ? `1px solid ${role.color}` : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-xl)', padding: '1.75rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered 
          ? `0 20px 40px rgba(0, 0, 0, 0.45), 0 0 25px ${role.color}30, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
          : '0 10px 30px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '0.05em', color: role.color,
              background: `${role.color}15`, border: `1px solid ${role.color}30`,
              padding: '0.15rem 0.6rem', borderRadius: '99px',
            }}>{role.type}</span>
            <span style={{
              fontSize: '0.68rem', fontWeight: '600', color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
              padding: '0.15rem 0.6rem', borderRadius: '99px',
            }}>{role.mode}</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.2rem' }}>{role.title}</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>{role.dept}</p>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6', flexGrow: 1 }}>{role.desc}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {role.tags.map((t, i) => (
          <span key={i} style={{
            fontSize: '0.7rem', fontWeight: '600',
            background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '0.2rem 0.55rem', borderRadius: '4px',
          }}>{t}</span>
        ))}
      </div>

      <button
        onClick={() => onApply(role)}
        style={{
          padding: '0.7rem 1.25rem', borderRadius: 'var(--radius-md)',
          background: hovered ? role.color : `${role.color}15`,
          color: hovered ? '#fff' : role.color,
          border: `1px solid ${role.color}30`,
          fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
          transition: 'all 0.2s ease', alignSelf: 'flex-start',
        }}
      >Apply Now →</button>
    </div>
  );
}

const mapBackendCareer = (career) => {
  let tags = [];
  if (career.requirements) {
    tags = career.requirements.split(/[,;\n]+/).map(t => t.trim()).filter(Boolean);
  }
  if (tags.length === 0) {
    tags = [career.experience || 'Entry Level', career.location || 'Hybrid'];
  } else {
    tags.push(career.experience || 'Entry Level');
  }

  let dept = 'Engineering';
  const titleLower = career.title.toLowerCase();
  if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
    dept = 'Design';
  } else if (titleLower.includes('marketing') || titleLower.includes('seo') || titleLower.includes('ads')) {
    dept = 'Marketing';
  } else if (titleLower.includes('sales') || titleLower.includes('business') || titleLower.includes('account')) {
    dept = 'Sales';
  } else if (titleLower.includes('trainer') || titleLower.includes('teacher') || titleLower.includes('instructor')) {
    dept = 'Learning Hub';
  }

  const deptColors = {
    'Engineering': '#38bdf8',
    'Marketing': '#f59e0b',
    'Sales': '#10b981',
    'Learning Hub': '#8b5cf6',
    'Design': '#f43f5e'
  };
  const color = deptColors[dept] || '#38bdf8';

  return {
    id: career.id,
    title: career.title,
    type: career.type || 'Full-Time',
    dept: dept,
    mode: career.location || 'Hybrid',
    color: color,
    desc: career.description || '',
    tags: tags.slice(0, 4),
    isBackend: true,
  };
};

function CareersPage({ navigateTo }) {
  const [filterType, setFilterType] = useState('All');
  const [applyRole, setApplyRole] = useState(null);
  const [roles, setRoles] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_careers');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_careers');
      return !cached;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch(getBackendUrl('/api/careers/'));
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const mapped = data.map(mapBackendCareer).filter(r => r.type !== 'Internship');
            setRoles(mapped);
            localStorage.setItem('hadescore_cache_careers', JSON.stringify(mapped));
          } else {
            setRoles([]);
            localStorage.setItem('hadescore_cache_careers', JSON.stringify([]));
          }
        } else {
          if (roles.length === 0) {
            setRoles([]);
          }
        }
      } catch (error) {
        console.error("Error fetching careers:", error);
        if (roles.length === 0) {
          setRoles([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const filtered = filterType === 'All' ? roles : roles.filter(r => r.type === filterType);

  return (
    <div style={{ paddingBottom: '1rem' }}>
      <SEO pageName="careers" />
      {applyRole && <ApplyModal role={applyRole} onClose={() => setApplyRole(null)} />}

      {/* Responsive & Page Specific CSS */}
      <style>{`
        /* ======================== DESKTOP PLACEMENT SECTION ======================== */
        .placement-grid-container {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3rem;
          align-items: center;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(13, 17, 23, 0.6) 100%);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 24px;
          padding: 3.5rem;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        
        .placement-grid-container:hover {
          border-color: rgba(16, 185, 129, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.05);
        }

        .placement-text-section {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .placement-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 99px;
          padding: 0.4rem 0.9rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: #34d399;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.05);
        }

        .placement-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10b981;
          box-shadow: 0 0 8px #10b981;
          display: inline-block;
          animation: placement-pulse 2s infinite ease-in-out;
        }

        @keyframes placement-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 1; }
        }

        .placement-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.2;
          margin: 0 0 1.25rem 0;
          background: linear-gradient(135deg, #ffffff 40%, #a7f3d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .placement-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 520px;
        }

        .placement-register-btn {
          padding: 0.85rem 2rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          border-radius: var(--radius-md);
          font-weight: 700;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        .placement-register-btn:hover {
          background: #10b981;
          color: #060912;
          border-color: #10b981;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
        }

        .placement-register-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .placement-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          position: relative;
          z-index: 1;
        }

        .placement-stat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
        }

        .placement-stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #10b981, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .placement-stat-card:hover {
          background: rgba(16, 185, 129, 0.03);
          border-color: rgba(16, 185, 129, 0.18);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .placement-stat-card:hover::before {
          opacity: 1;
        }

        .placement-stat-num {
          font-size: 1.8rem;
          font-weight: 800;
          color: #10b981;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
        }

        .placement-stat-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ======================== RESPONSIVE & MOBILE REDESIGN ======================== */
        @media (max-width: 968px) {
          .careers-hero-buttons {
            justify-content: center !important;
          }
          .placement-grid-container {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            padding: 2.5rem 1.75rem !important;
            background: linear-gradient(185deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 27, 20, 0.95) 50%, rgba(6, 9, 18, 0.98) 100%) !important;
            border-color: rgba(16, 185, 129, 0.25) !important;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(16, 185, 129, 0.15) !important;
            position: relative;
            overflow: hidden;
            border-radius: 20px !important;
          }
          
          /* Dual glowing lights: top right and bottom left */
          .placement-grid-container::before {
            content: '';
            position: absolute;
            top: -100px;
            right: -50px;
            left: auto;
            transform: none;
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            filter: blur(30px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.85;
          }
          
          .placement-grid-container::after {
            content: '';
            position: absolute;
            bottom: -120px;
            left: -50px;
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(0, 229, 255, 0.18) 0%, transparent 70%);
            border-radius: 50%;
            filter: blur(30px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.85;
          }

          .placement-text-section {
            z-index: 1;
            text-align: center !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .placement-badge-pill {
            margin-bottom: 1rem !important;
            background: rgba(16, 185, 129, 0.15) !important;
          }

          .placement-title {
            font-size: 1.85rem !important;
            line-height: 1.25 !important;
            margin-bottom: 0.75rem !important;
            background: linear-gradient(135deg, #ffffff 20%, #34d399 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
          }

          .placement-desc {
            font-size: 0.88rem !important;
            line-height: 1.6 !important;
            margin-bottom: 1.75rem !important;
            text-align: center;
          }

          .placement-stats-grid {
            z-index: 1;
            max-width: 450px;
            margin: 0 auto;
            width: 100%;
            gap: 1rem !important;
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .placement-stat-card {
            background: rgba(13, 22, 18, 0.55) !important;
            border: 1px solid rgba(16, 185, 129, 0.22) !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02) !important;
            border-radius: 16px !important;
            padding: 1.25rem 0.5rem !important;
            transition: all 0.2s ease;
          }

          .placement-stat-card::before {
            opacity: 0.5 !important;
            height: 2px !important;
          }

          .placement-stat-card:active {
            transform: scale(0.96) !important;
            border-color: rgba(16, 185, 129, 0.5) !important;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.25) !important;
          }

          .placement-stat-num {
            font-size: 1.65rem !important;
            font-weight: 900 !important;
            color: #34d399 !important;
            text-shadow: 0 0 10px rgba(16, 185, 129, 0.15);
          }

          .placement-stat-label {
            font-size: 0.68rem !important;
            line-height: 1.3 !important;
            color: rgba(255, 255, 255, 0.5) !important;
          }
        }

        /* Under 650px: Centered stack layout for cards */
        @media (max-width: 650px) {
          .placement-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
            max-width: 320px !important;
            margin: 0 auto !important;
          }

          .placement-stat-card {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            gap: 0.4rem !important;
            padding: 1.25rem 1rem !important;
            border-radius: 14px !important;
          }

          .placement-stat-card::before {
            width: 40px !important;
            height: 3px !important;
            background: linear-gradient(90deg, transparent, #10b981, transparent) !important;
            left: 50% !important;
            top: 0 !important;
            transform: translateX(-50%) !important;
          }

          .placement-stat-num {
            font-size: 1.7rem !important;
            font-weight: 850 !important;
            color: #34d399 !important;
            min-width: auto !important;
            text-align: center !important;
            margin-bottom: 0 !important;
            flex-shrink: 0 !important;
          }

          .placement-stat-label {
            font-size: 0.78rem !important;
            line-height: 1.4 !important;
            color: rgba(255, 255, 255, 0.7) !important;
            text-align: center !important;
            margin-top: 0 !important;
            text-transform: uppercase;
            letter-spacing: 0.05em !important;
          }
        }

        /* Under 480px: Tighter margins and scaling */
        @media (max-width: 480px) {
          .placement-grid-container {
            padding: 2rem 1.25rem !important;
            gap: 2rem !important;
          }

          .placement-stat-card {
            padding: 1.15rem 1rem !important;
            gap: 0.35rem !important;
          }

          .placement-stat-num {
            font-size: 1.55rem !important;
          }

          .placement-stat-label {
            font-size: 0.72rem !important;
          }
        }
      `},StartLine:712,TargetContent:</style>

      {/* Hero */}
      <section className="page-hero-section" style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060912',
        backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 18, 0.75), rgba(6, 9, 18, 0.95)), url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80)`
      }}>
        <RotatingLogo opacity={0.12} size="default" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '900px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.75rem)', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-0.03em', margin: '0 0 1.5rem', fontFamily: 'Outfit, sans-serif' }}>
            Join the<br /><span style={{ background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hadescore Team</span>
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 'clamp(1rem, 2.2vw, 1.15rem)', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '780px', fontWeight: '400' }}>
            We're building something big — and we need driven, curious, talented people to build it with us. Whether you're a fresher, an experienced professional, or looking for an internship, there's a real place for you here.
          </p>
          <div className="careers-hero-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => {
              const el = document.getElementById('open-roles');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}>See All Roles</button>
            <a href="mailto:hr@hadescore.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Contact HR</a>
          </div>
        </div>
      </section>

      {/* Content wrapper for scrolling contents */}
      <div className="page-content-wrapper">

      {/* Perks strip */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {perks.map((p, i) => (
              <div key={`a-${i}`} style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '99px', padding: '0.6rem 1.5rem',
                fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)',
              }}>
                {p}
              </div>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {perks.map((p, i) => (
              <div key={`b-${i}`} style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '99px', padding: '0.6rem 1.5rem',
                fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)',
              }}>
                {p}
              </div>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {perks.map((p, i) => (
              <div key={`c-${i}`} style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '99px', padding: '0.6rem 1.5rem',
                fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)',
              }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 3.5rem', padding: '0 1rem' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Culture</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem' }}>Why Work at Hadescore?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {culture.map((c, i) => (
            <div key={i} className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.5rem' }}>
              <div style={{
                width: '44px', height: '44px', flexShrink: 0,
                borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)',
                color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(16,185,129,0.15)',
              }}>
                <div style={{ width: '22px', height: '22px' }}><CardIcon type={c.icon} /></div>
              </div>
              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}>{c.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Open Roles */}
      <section id="open-roles" style={{ maxWidth: '1100px', margin: '0 auto 3.5rem', padding: '0 1rem', scrollMarginTop: '100px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Now Hiring</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem' }}>Open Roles</h2>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card" style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.015)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              fontSize: '1.5rem'
            }}>
              💼
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '0.4rem', fontFamily: 'Outfit' }}>No Open Roles Right Now</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', maxWidth: '400px', margin: '0 auto' }}>
                We don't have any active openings at the moment. Keep an eye on this page or register for placement below!
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((role, i) => (
              <RoleCard key={i} role={role} onApply={setApplyRole} />
            ))}
          </div>
        )}
      </section>

      {/* Placement Section */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 3.5rem', padding: '0 1rem' }}>
        <div className="placement-grid-container">
          <div className="placement-text-section">
            <div className="placement-badge-pill">
              <span className="placement-badge-dot"></span>
              Placement Ecosystem
            </div>
            <h2 className="placement-title">
              We Also Help You Get Hired Elsewhere
            </h2>
            <p className="placement-desc">
              Through our Recruitment & Placement division, we connect skilled candidates with the right companies. Students, freshers, and career-switchers — register with us and we'll actively place you.
            </p>
            <button className="placement-register-btn" onClick={() => navigateTo && navigateTo('contact')}>
              Register for Placement →
            </button>
          </div>
          <div className="placement-stats-grid">
            {[
              { num: '20+', label: 'Candidates Placed' },
              { num: '3+', label: 'Hiring Partners' },
              { num: '95%', label: 'Placement Rate' },
              { num: '30d', label: 'Avg. Time to Hire' },
            ].map((s, i) => (
              <div key={i} className="placement-stat-card">
                <div className="placement-stat-num">{s.num}</div>
                <div className="placement-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="blue-cta-banner">
          <h2>Think you belong here?</h2>
          <p>We're always looking for great people. Send us your profile and let's start a conversation.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-white" onClick={() => {
              const el = document.getElementById('open-roles');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}>See All Roles</button>
            <a href="mailto:hr@hadescore.com" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
              padding: '0.9rem 2.25rem', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
              borderRadius: 'var(--radius-md)', fontWeight: '700', cursor: 'pointer',
            }}>Contact HR</a>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

export default CareersPage;
