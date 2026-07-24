import { useState, useEffect } from 'react';
import { DOMAIN_DETAILS_MAP } from '../data/domainDetails';
import { showToast } from './Toast';
import { getBackendUrl } from '../utils/api';

// Icon mapping helper
const getDomainIcon = (iconName) => {
  const style = { width: '22px', height: '22px', strokeWidth: '2.5px', display: 'block' };
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
      return { bg: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.25)', glow: 'rgba(168, 85, 247, 0.2)' };
    case 'shield':
      return { bg: 'rgba(0, 229, 255, 0.12)', color: '#00e5ff', border: 'rgba(0, 229, 255, 0.25)', glow: 'rgba(0, 229, 255, 0.2)' };
    case 'code':
      return { bg: 'rgba(79, 156, 255, 0.12)', color: '#4f9cff', border: 'rgba(79, 156, 255, 0.25)', glow: 'rgba(79, 156, 255, 0.2)' };
    case 'gear':
      return { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316', border: 'rgba(249, 115, 22, 0.25)', glow: 'rgba(249, 115, 22, 0.2)' };
    case 'flight':
      return { bg: 'rgba(14, 165, 233, 0.12)', color: '#0ea5e9', border: 'rgba(14, 165, 233, 0.25)', glow: 'rgba(14, 165, 233, 0.2)' };
    case 'biotech':
      return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'rgba(16, 185, 129, 0.25)', glow: 'rgba(16, 185, 129, 0.2)' };
    case 'wrench':
      return { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)', glow: 'rgba(245, 158, 11, 0.2)' };
    case 'building':
      return { bg: 'rgba(217, 119, 6, 0.12)', color: '#d97706', border: 'rgba(217, 119, 6, 0.25)', glow: 'rgba(217, 119, 6, 0.2)' };
    case 'cpu':
      return { bg: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', border: 'rgba(6, 182, 212, 0.25)', glow: 'rgba(6, 182, 212, 0.2)' };
    case 'bolt':
      return { bg: 'rgba(132, 204, 22, 0.12)', color: '#84cc16', border: 'rgba(132, 204, 22, 0.25)', glow: 'rgba(132, 204, 22, 0.2)' };
    default:
      return { bg: 'rgba(255, 255, 255, 0.08)', color: 'white', border: 'rgba(255, 255, 255, 0.12)', glow: 'rgba(255,255,255,0.05)' };
  }
};

const getDomainKeywords = (icon) => {
  switch (icon) {
    case 'brain':
      return ['ai', 'ml', 'machine', 'deep', 'data', 'intelligence'];
    case 'shield':
      return ['cyber', 'security', 'hacking', 'soc', 'defense'];
    case 'code':
      return ['fullstack', 'web', 'mern', 'react', 'node', 'frontend', 'backend', 'developer'];
    case 'gear':
      return ['robotics', 'mechatronics', 'firmware', 'embedded', 'automation'];
    case 'flight':
      return ['drone', 'uav', 'aerodynamics', 'flight', 'gis'];
    case 'biotech':
      return ['biotech', 'biology', 'bioinformatics', 'clinical'];
    case 'wrench':
      return ['mechanical', 'cad', 'solidworks', 'fea', 'simulation', 'thermal'];
    case 'building':
      return ['civil', 'construction', 'bim', 'revit', 'infrastructure'];
    case 'cpu':
      return ['iot', 'internet', 'sensor', 'embedded', 'hardware'];
    case 'bolt':
      return ['ev', 'battery', 'electric', 'mobility', 'bms', 'powertrain'];
    default:
      return [];
  }
};

const DomainDetailPage = ({ domain, onBack, domainsList, triggerEnroll, onSelectDomain, mentorsList = [], projectsList = [] }) => {
  // Hardcoded fallback template
  const fallback = DOMAIN_DETAILS_MAP[domain.icon] || DOMAIN_DETAILS_MAP.brain;

  // Try to parse the custom JSON configured by the admin
  let customMeta = null;
  if (domain.details_json) {
    try {
      customMeta = JSON.parse(domain.details_json);
    } catch (e) {
      console.error('Failed to parse details_json from DB:', e);
    }
  }

  const keywords = getDomainKeywords(domain.icon);

  // Filter matching mentors from database
  const matchedDbMentors = (mentorsList || []).filter(m => {
    if (!m.is_active) return false;
    
    // If domain has a category, match by exact category first
    if (domain.category) {
      const domainCat = domain.category.toLowerCase().trim();
      const mentorCat = (m.tag || '').toLowerCase().trim();
      return domainCat === mentorCat;
    }
    
    // Fallback to keyword matching if no category
    const mTag = (m.tag || '').toLowerCase();
    const mRole = (m.role || '').toLowerCase();
    return keywords.some(kw => mTag.includes(kw) || mRole.includes(kw));
  });

  // Filter matching projects from database
  const matchedDbProjects = (projectsList || []).filter(p => {
    if (!p.is_active) return false;
    const pName = (p.name || '').toLowerCase();
    const pDesc = (p.desc || '').toLowerCase();
    const pStack = Array.isArray(p.stack) 
      ? p.stack.map(s => s.toLowerCase()).join(' ')
      : (p.stack || '').toLowerCase();
    return keywords.some(kw => pName.includes(kw) || pDesc.includes(kw) || pStack.includes(kw));
  });

  // Merge custom details override with fallbacks
  const meta = {
    subtitle: customMeta?.subtitle || fallback.subtitle,
    longDesc: customMeta?.longDesc || fallback.longDesc,
    durationText: customMeta?.durationText || fallback.durationText,
    stats: {
      package: customMeta?.stats?.package || fallback.stats.package,
      partners: customMeta?.stats?.partners || fallback.stats.partners,
      projects: customMeta?.stats?.projects || fallback.stats.projects,
      placement: customMeta?.stats?.placement || fallback.stats.placement,
    },
    timeline: customMeta?.timeline || fallback.timeline,
    curriculum: customMeta?.curriculum || fallback.curriculum,
    projects: customMeta?.projects || (matchedDbProjects.length > 0 ? matchedDbProjects.map(p => ({
      title: p.name,
      desc: p.desc,
      tags: Array.isArray(p.stack) ? p.stack : (p.stack || '').split(',').map(s => s.trim()).filter(Boolean)
    })) : fallback.projects),
    mentors: customMeta?.mentors || (matchedDbMentors.length > 0 ? matchedDbMentors : fallback.mentors),
    salaryInsights: customMeta?.salaryInsights || fallback.salaryInsights,
    certifications: customMeta?.certifications || fallback.certifications,
    hiringPartners: customMeta?.hiringPartners || fallback.hiringPartners
  };

  const iconMeta = getDomainIconMeta(domain.icon);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [mode, setMode] = useState('online');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast('Name, email, and phone number are required.', 'error');
      return;
    }
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('course_name', domain.title);
    formDataToSend.append('course_category', 'EduSkills Domain');
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
        showToast('Application submitted successfully!', 'success');
      } else {
        saveOffline();
      }
    } catch (error) {
      saveOffline();
    } finally {
      setSubmitting(false);
    }
  };

  const saveOffline = () => {
    const subs = JSON.parse(localStorage.getItem('hadescore_enrollments') || '[]');
    subs.push({ name, email, phone, course: domain.title, mode, date: new Date() });
    localStorage.setItem('hadescore_enrollments', JSON.stringify(subs));
    setSubmitted(true);
    showToast('Application submitted! (Saved offline)', 'success');
  };

  const handleDownload = async () => {
    if (domain.curriculum_image) {
      try {
        showToast('Downloading curriculum image...', 'success');
        const imageUrl = getBackendUrl(domain.curriculum_image);
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const ext = domain.curriculum_image.split('.').pop() || 'png';
        link.download = `${domain.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_curriculum.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Curriculum image downloaded successfully!', 'success');
        return;
      } catch (err) {
        console.error('Failed to download image via fetch, falling back to direct link', err);
      }
      
      const link = document.createElement('a');
      link.href = getBackendUrl(domain.curriculum_image);
      link.target = '_blank';
      link.download = `${domain.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_curriculum`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Opening curriculum image...', 'success');
      return;
    }

    // Generate text syllabus download
    const content = `HADESCORE APEX & TECHNOLOGIES
EDUSKILLS CURRICULUM SYLLABUS

DOMAIN: ${domain.title.toUpperCase()}
DURATION: ${domain.duration || meta.durationText}
EXPECTED OUTCOMES: ${domain.salary} average compensation

ROADMAP:
${meta.timeline.map((t, idx) => `${idx + 1}. [${t.months}] ${t.title}: ${t.desc}`).join('\n')}

DETAILED MODULES:
${meta.curriculum.map((c, idx) => `- Module ${idx + 1}: ${c.title} (${c.skills.join(', ')})`).join('\n')}

HANDS-ON PROJECTS:
${meta.projects.map((p, idx) => `- Project ${idx + 1}: ${p.title} (${p.tags.join(', ')}) - ${p.desc}`).join('\n')}

CERTIFICATIONS TO ACHIEVE:
${meta.certifications.map(cert => `- ${cert}`).join('\n')}

Apply online/offline at HADESCORE learninghub.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${domain.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_curriculum.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Curriculum downloaded successfully!', 'success');
  };

  const handleTalkToMentor = () => {
    // Trigger chatbot greeting customize
    showToast('Connecting with a tech advisor...', 'success');
    // Open chat window if exists on page
    const chatBtn = document.querySelector('.chatbot-trigger-btn');
    if (chatBtn) {
      chatBtn.click();
    }
  };

  // Filter out the current active domain and get 3 alternatives
  const exploreMore = domainsList
    .filter(d => d.icon !== domain.icon)
    .slice(0, 3);

  return (
    <div className="domain-detail-page-container" style={{ color: 'white', fontFamily: 'Inter, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', paddingTop: '0.25rem' }}>
      <style>{`
        /* Dynamic Domain Detail Styling */
        .all-domains-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255,255,255,0.45);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          margin-bottom: 2.5rem;
          transition: all 0.25s ease;
        }
        .all-domains-back:hover {
          color: ${iconMeta.color};
          transform: translateX(-4px);
        }

        .stats-card-premium {
          background: rgba(8, 12, 28, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 1.75rem 2rem;
          transition: all 0.3s ease;
        }
        .stats-card-premium:hover {
          border-color: ${iconMeta.border};
          box-shadow: 0 10px 30px ${iconMeta.glow};
        }

        /* Timeline roadmap style */
        .timeline-container-premium {
          position: relative;
          padding-left: 2.5rem;
          margin-top: 3.5rem;
        }
        .timeline-container-premium::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(180deg, ${iconMeta.color}, rgba(139, 92, 246, 0.1));
        }

        .timeline-step-premium {
          position: relative;
          margin-bottom: 3.5rem;
        }
        .timeline-step-premium:last-child {
          margin-bottom: 0;
        }

        .timeline-node-premium {
          position: absolute;
          left: -2.5rem;
          top: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #060912;
          border: 3px solid ${iconMeta.color};
          box-shadow: 0 0 10px ${iconMeta.color};
          z-index: 2;
        }

        /* Form input designs */
        .apply-input-field {
          width: 100%;
          padding: 0.85rem 1.1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .apply-file-input {
          width: 100%;
          padding: 0.7rem 1.1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: rgba(255,255,255,0.6);
          outline: none;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .apply-file-input:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.15);
        }
        .apply-file-input:focus {
          border-color: ${iconMeta.color};
          box-shadow: 0 0 0 3px ${iconMeta.glow};
        }
        .apply-input-field option {
          background-color: #111827;
          color: #e2e8f0;
        }
        .apply-input-field:focus {
          border-color: ${iconMeta.color};
          box-shadow: 0 0 0 3px ${iconMeta.glow};
          background: rgba(255,255,255,0.05);
        }

        /* Divider lines for insights table */
        .salary-insight-row {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: background 0.25s;
        }
        .salary-insight-row:hover {
          background: rgba(255,255,255,0.015);
        }
        .salary-insight-row:last-child {
          border-bottom: none;
        }

        /* Explore other cards hover */
        .explore-other-card {
          background: rgba(8, 12, 28, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 1.5rem 1.75rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .explore-other-card:hover {
          transform: translateY(-4px);
          background: rgba(16, 22, 42, 0.55);
          border-color: rgba(255,255,255,0.2);
        }

        /* Admissions form styling classes */
        .admission-section {
          margin-bottom: 6.5rem;
          max-width: 800px;
          margin: 0 auto 6.5rem;
        }
        .admission-card {
          background: linear-gradient(135deg, rgba(8,12,28,0.8), rgba(10,14,28,0.9));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 28px;
          padding: 3.5rem 3rem;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          position: relative;
        }
        .admission-glow-bar {
          position: absolute;
          top: 0;
          left: 20%;
          right: 20%;
          height: 1px;
        }
        .admission-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .admission-badge {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .admission-title {
          font-size: 2rem;
          font-weight: 900;
          margin: 0.35rem 0 0.5rem;
          font-family: 'Outfit', sans-serif;
          color: white;
        }
        .admission-desc {
          color: rgba(255,255,255,0.5);
          font-size: 0.92rem;
          margin: 0;
        }
        .admission-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .admission-grid-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .admission-group {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .admission-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.45rem;
          text-align: left;
        }

        /* Responsive Mobile Overrides */
        @media (max-width: 968px) {
          .eduskills-hero-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          
          /* Roadmap layout adjustment */
          .timeline-step-premium > .eduskills-hero-layout {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }

        @media (max-width: 768px) {
          .domain-detail-page-container {
            padding: 0 1.25rem !important;
            padding-top: 0.25rem !important;
          }
          
          /* Intro Hero Alignment */
          .eduskills-hero-layout > div {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          
          .eduskills-hero-layout h1 {
            font-size: 2.25rem !important;
            text-align: center !important;
            line-height: 1.2 !important;
          }
          
          .eduskills-hero-layout h2 {
            font-size: 1.25rem !important;
            text-align: center !important;
            line-height: 1.4 !important;
          }
          
          .eduskills-hero-layout p {
            font-size: 0.95rem !important;
            text-align: center !important;
            line-height: 1.7 !important;
          }
          
          /* Category header badge alignment */
          .eduskills-hero-layout > div > div:first-child {
            justify-content: center !important;
            width: 100% !important;
          }
          
          /* Mobile Button Stacking */
          .eduskills-hero-layout > div > div[style*="flex-wrap"] {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
            gap: 0.85rem !important;
          }
          
          .eduskills-hero-layout > div > div[style*="flex-wrap"] > button {
            width: 100% !important;
            text-align: center !important;
            padding: 0.95rem 1.5rem !important;
          }
          
          /* Centering values inside stats cards */
          .stats-card-premium {
            padding: 1.25rem !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          /* Section headers styling */
          .section-header {
            text-align: center !important;
            margin-bottom: 2rem !important;
          }
          
          .section-header h2 {
            font-size: 1.75rem !important;
            text-align: center !important;
          }
          
          /* Admissions form styling on mobile */
          .admission-card {
            padding: 2.25rem 1.5rem !important;
            border-radius: 20px !important;
          }
          
          .admission-title {
            font-size: 1.4rem !important;
            text-align: center !important;
          }
          
          .admission-grid-row {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          
          .admission-group {
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          
          .admission-label {
            text-align: center !important;
            width: 100% !important;
          }
          
          .apply-input-field, .apply-file-input {
            text-align: center !important;
            text-align-last: center !important;
          }
          
          /* Salary Insight Row fonts and column styling */
          .salary-insight-row {
            grid-template-columns: 1.2fr 1fr 0.8fr !important;
            padding: 1rem 0 !important;
          }
          
          .salary-insight-row span {
            font-size: 0.8rem !important;
          }
          
          /* Hiring cards */
          div[style*="borderRadius: '24px'"] {
            padding: 1.5rem !important;
            grid-column: span 2 !important;
          }
          
          .all-domains-back {
            margin-bottom: 1.5rem !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>

      {/* Back button */}
      <button onClick={onBack} className="all-domains-back">
        <span>←</span> All domains
      </button>

      {/* Main Intro Header */}
      <section style={{ display: 'block', marginBottom: '5.5rem' }} className="eduskills-hero-layout">
        <div>
          {/* Label Category Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: iconMeta.bg,
              color: iconMeta.color,
              border: `1px solid ${iconMeta.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 10px ${iconMeta.glow}`
            }}>
              {getDomainIcon(domain.icon)}
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hadescore EduSkill - Domain</span>
          </div>

          <h1 style={{ fontSize: '4rem', fontWeight: '950', fontFamily: 'Outfit, sans-serif', margin: '0 0 0.85rem', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
            {domain.title}
          </h1>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: iconMeta.color, marginBottom: '1.75rem', fontFamily: 'Outfit' }}>
            {meta.subtitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.18rem', lineHeight: '1.8', marginBottom: '2.75rem', maxWidth: '1000px' }}>
            {domain.desc || meta.longDesc}
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
              onClick={() => triggerEnroll(domain.title)}
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${iconMeta.color}, #6366f1)`,
                border: 'none',
                color: 'white',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: `0 8px 24px ${iconMeta.glow}`,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 12px 30px ${iconMeta.color}`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${iconMeta.glow}`;
              }}
            >
              Enroll Now →
            </button>
            <button 
              onClick={handleDownload}
              style={{
                padding: '1rem 2.25rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              Download Curriculum
            </button>
          </div>
        </div>
      </section>

      {/* Horizontal Stats Row */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '5.5rem' }} className="eduskills-hero-layout">
        <div className="stats-card-premium">
          <div style={{ fontSize: '1.8rem', fontWeight: '950', color: 'white', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>{domain.salary}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Avg. Package</div>
        </div>
        <div className="stats-card-premium">
          <div style={{ fontSize: '1.8rem', fontWeight: '950', color: 'white', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>{meta.stats.projects}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Live Projects</div>
        </div>
        <div className="stats-card-premium">
          <div style={{ fontSize: '1.8rem', fontWeight: '950', color: 'white', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>{domain.status || meta.stats.placement}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Placement Rate</div>
        </div>
      </section>

      {/* Live Projects Section */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header">
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: iconMeta.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Live Projects</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Build a portfolio that hires.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '3rem' }} className="eduskills-hero-layout">
          {meta.projects.map((proj, idx) => (
            <div key={idx} style={{ background: 'rgba(8,12,28,0.45)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '850', color: 'white', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>{proj.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>{proj.desc}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {proj.tags.map((tag, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industry Mentors Row */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header">
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: iconMeta.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Industry Mentors</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Learn from practitioners, not professors.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '3rem' }} className="eduskills-hero-layout">
          {meta.mentors.map((m, idx) => (
            <div key={idx} style={{ background: 'rgba(8,12,28,0.45)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem 1.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${iconMeta.color}, #6366f1)`,
                color: 'white',
                fontSize: '1.15rem',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: `0 0 15px ${iconMeta.glow}`
              }}>
                {m.initial}
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '850', color: 'white', margin: '0 0 0.25rem', fontFamily: 'Outfit' }}>{m.name}</h4>
              <p style={{ fontSize: '0.78rem', color: iconMeta.color, fontWeight: '700', margin: '0 0 0.15rem' }}>{m.role}</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 1rem' }}>{m.company}</p>
              <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '0.2rem 0.5rem', color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: '0.04em' }}>
                {m.exp}
              </span>
              <a 
                href={`mailto:${m.email || 'hadescore.apex.technologies@gmail.com'}?subject=Inquiry%20Regarding%20Mentorship%20with%20${encodeURIComponent(m.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  marginTop: '1rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#db4437';
                  e.currentTarget.style.background = 'rgba(219, 68, 85, 0.08)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Contact
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Salary Insights */}
      <section style={{ marginBottom: '6.5rem' }}>
        <div className="section-header">
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: iconMeta.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Salary Insights</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Career growth timeline</h2>
        </div>

        <div style={{ background: 'rgba(8,12,28,0.45)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem 2rem', marginTop: '3rem' }}>
          {meta.salaryInsights.map((insight, idx) => (
            <div key={idx} className="salary-insight-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '1.25rem 0', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', color: 'white', fontSize: '0.98rem', fontFamily: 'Outfit' }}>{insight.role}</span>
              <span style={{ color: iconMeta.color, fontWeight: '900', fontSize: '1.05rem' }}>{insight.salary}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'right' }}>{insight.exp}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications column */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', marginBottom: '6.5rem' }} className="eduskills-hero-layout">
        {/* Certifications */}
        <div style={{ background: 'rgba(8,12,28,0.45)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem', fontFamily: 'Outfit', color: 'white' }}>Certifications</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {meta.certifications.map((cert, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ color: iconMeta.color, fontSize: '1.1rem' }}>✓</span> {cert}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Main Full-Size Application Form Block */}
      <section className="admission-section">
        <div className="admission-card">
          <div className="admission-glow-bar" style={{ background: `linear-gradient(90deg, transparent, ${iconMeta.color}, transparent)` }} />
          
          <div className="admission-header">
            <span className="admission-badge" style={{ color: iconMeta.color }}>Admission Form</span>
            <h3 className="admission-title">Apply for the {domain.title} Program</h3>
            <p className="admission-desc">Submit your application to secure a cohort seat.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="admission-form">
            <div className="admission-grid-row">
              <div className="admission-group">
                <label className="admission-label">Full Name *</label>
                <input required type="text" placeholder="e.g. John Doe" className="apply-input-field" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="admission-group">
                <label className="admission-label">Email Address *</label>
                <input required type="email" placeholder="e.g. john@example.com" className="apply-input-field" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            
            <div className="admission-grid-row">
              <div className="admission-group">
                <label className="admission-label">Phone Number *</label>
                <input required type="tel" placeholder="e.g. +91 98765 43210" className="apply-input-field" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="admission-group">
                <label className="admission-label">Experience Level</label>
                <input type="text" placeholder="e.g. Fresher, 2 Years" className="apply-input-field" value={experience} onChange={e => setExperience(e.target.value)} />
              </div>
            </div>

            <div className="admission-grid-row">
              <div className="admission-group">
                <label className="admission-label">LinkedIn Profile</label>
                <input type="url" placeholder="https://linkedin.com/in/..." className="apply-input-field" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              </div>
              <div className="admission-group">
                <label className="admission-label">Upload Resume</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} className="apply-file-input" />
              </div>
            </div>

            <div className="admission-group">
              <label className="admission-label">Preferred Learning Mode</label>
              <select className="apply-input-field" value={mode} onChange={e => setMode(e.target.value)}>
                <option value="online">Online Live (Flexible hours)</option>
                <option value="offline">Offline Classroom (Dedicated labs)</option>
                <option value="hybrid">Hybrid Sprint (Online + on-campus)</option>
              </select>
            </div>

            <div className="admission-group">
              <label className="admission-label">Message / Questions</label>
              <textarea placeholder="Why are you interested in this program?" rows="3" className="apply-input-field" value={message} onChange={e => setMessage(e.target.value)} />
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '1rem', marginTop: '1rem', background: `linear-gradient(135deg, ${iconMeta.color}, #6366f1)`, border: 'none', color: 'white', borderRadius: '12px', fontWeight: '900', fontSize: '0.98rem', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: `0 6px 20px ${iconMeta.glow}`, transition: 'all 0.3s ease' }}
              onMouseOver={e => {
                if (!submitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 10px 25px ${iconMeta.color}`;
                }
              }}
              onMouseOut={e => {
                if (!submitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${iconMeta.glow}`;
                }
              }}
            >
              {submitting ? 'Processing Application...' : 'Submit Admission Application'}
            </button>
          </form>

          {submitted && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', color: '#10b981', fontSize: '0.9rem', textAlign: 'center', fontWeight: '700' }}>
              🎉 Thank you! Your application has been successfully submitted. Our academic team will reach out to you shortly.
            </div>
          )}
        </div>
      </section>

      {/* Explore More Domains Footer */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '4.5rem', marginBottom: '4.5rem' }}>
        <div className="section-header">
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>— Explore More Domains</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Discover other tracks</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2.5rem' }} className="eduskills-hero-layout">
          {exploreMore.map((item, idx) => {
            const innerMeta = getDomainIconMeta(item.icon);
            return (
              <div key={idx} className="explore-other-card" onClick={() => onSelectDomain(item)}>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '850', color: 'white', margin: '0 0 0.25rem', fontFamily: 'Outfit' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{item.desc}</p>
                </div>
                <span style={{ color: innerMeta.color, fontSize: '1.2rem', fontWeight: '800', marginLeft: '1rem' }}>→</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DomainDetailPage;
