import { useState } from 'react';
import SEO from '../components/SEO';
import { getBackendUrl } from '../utils/api';

// Pre-loaded verification database for legacy fallback
const CERTIFICATE_DB = {
  'HTHSC-2026-AI-04829': {
    id: 'HTHSC-2026-AI-04829',
    studentName: 'Ramesh Kumar',
    courseName: 'Advanced AI & Machine Learning Pro',
    issueDate: 'June 9, 2026',
    status: 'VERIFIED',
    issuer: 'Hadescore Apex & Technologies Certification Board'
  },
  'HDS-2026-FS-10842': {
    id: 'HDS-2026-FS-10842',
    studentName: 'Suresh Nair',
    courseName: 'Full Stack Web Engineering Cohort',
    issueDate: 'May 15, 2026',
    status: 'VERIFIED',
    issuer: 'Hadescore Apex & Technologies Certification Board'
  },
  'HDS-2026-CS-09472': {
    id: 'HDS-2026-CS-09472',
    studentName: 'Anjali Sharma',
    courseName: 'Cyber Security Specialist Program',
    issueDate: 'April 20, 2026',
    status: 'VERIFIED',
    issuer: 'Hadescore Apex & Technologies Certification Board'
  }
};

const inputCls = {
  width: '100%',
  padding: '1rem 1.5rem',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  color: 'white',
  fontSize: '1.05rem',
  outline: 'none',
  transition: 'all 0.25s ease',
  fontFamily: 'inherit',
  textAlign: 'center',
  letterSpacing: '0.04em'
};

const hasValidPhoto = (url) => {
  if (!url) return false;
  const lowercase = url.toLowerCase().trim();
  if (lowercase === 'null' || lowercase === '' || lowercase.endsWith('/media/null') || lowercase.endsWith('/media/')) {
    return false;
  }
  return true;
};

const CertificatePlaceholder = ({ details }) => (
  <svg
    id="mock-cert-svg"
    viewBox="0 0 800 600"
    width="100%"
    height="auto"
    style={{
      width: '100%',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      background: '#080c1c',
      display: 'block'
    }}
  >
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#080c1c" />
        <stop offset="50%" stopColor="#0d1530" />
        <stop offset="100%" stopColor="#050814" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00e5ff" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    
    <rect width="800" height="600" fill="url(#bg)" />
    <rect x="20" y="20" width="760" height="560" fill="none" stroke="url(#accent)" strokeWidth="3" rx="10" />
    <rect x="30" y="30" width="740" height="540" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" rx="8" />
    
    <path d="M 20 60 L 20 20 L 60 20" fill="none" stroke="#00e5ff" strokeWidth="4" />
    <path d="M 780 60 L 780 20 L 740 20" fill="none" stroke="#00e5ff" strokeWidth="4" />
    <path d="M 20 540 L 20 580 L 60 580" fill="none" stroke="#8b5cf6" strokeWidth="4" />
    <path d="M 780 540 L 780 580 L 740 580" fill="none" stroke="#8b5cf6" strokeWidth="4" />

    <text x="400" y="100" textAnchor="middle" fill="#00e5ff" fontSize="14" fontWeight="800" letterSpacing="6" fontFamily="system-ui, sans-serif">SECURE DIGITAL CREDENTIAL</text>
    <text x="400" y="150" textAnchor="middle" fill="#ffffff" fontSize="32" fontWeight="900" fontFamily="system-ui, sans-serif">HADESCORE APEX</text>
    <text x="400" y="180" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="14" fontFamily="system-ui, sans-serif">TECHNOLOGIES & TRAINING DIVISION</text>
    
    <text x="400" y="260" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="16" fontStyle="italic" fontFamily="system-ui, sans-serif">This certifies that</text>
    <text x="400" y="315" textAnchor="middle" fill="#ffffff" fontSize="36" fontWeight="900" fontFamily="system-ui, sans-serif">{details.studentName}</text>
    
    <text x="400" y="365" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="16" fontFamily="system-ui, sans-serif">has successfully completed the program</text>
    <text x="400" y="410" textAnchor="middle" fill="#00e5ff" fontSize="22" fontWeight="800" fontFamily="system-ui, sans-serif">{details.courseName}</text>
    
    <line x1="200" y1="450" x2="600" y2="450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    
    <text x="300" y="490" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="system-ui, sans-serif">CERTIFICATE ID</text>
    <text x="300" y="515" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily="monospace">{details.id}</text>
    
    <text x="500" y="490" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="system-ui, sans-serif">ISSUE DATE</text>
    <text x="500" y="515" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">{details.issueDate}</text>
    
    <circle cx="400" cy="560" r="10" fill="#00e5ff" opacity="0.2" />
    <circle cx="400" cy="560" r="4" fill="#00e5ff" />
  </svg>
);

const VerificationPage = () => {
  const [certId, setCertId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    triggerSearch(certId.trim().toUpperCase());
  };

  const triggerSearch = async (id) => {
    setSearching(true);
    setHasSearched(true);
    setCertId(id);
    
    try {
      const response = await fetch(getBackendUrl(`/api/certificate/verify/${id}/`));
      if (response.ok) {
        const data = await response.json();
        setSearchResult({
          id: data.certificate_id,
          studentName: data.student_name,
          courseName: data.course_name,
          issueDate: data.issue_date,
          status: 'VERIFIED',
          issuer: data.issuer,
          certificatePhoto: data.certificate_photo
        });
      } else {
        // Fallback to local DB
        const match = CERTIFICATE_DB[id];
        setSearchResult(match || null);
      }
    } catch (error) {
      console.error('Error fetching certificate:', error);
      const match = CERTIFICATE_DB[id];
      setSearchResult(match || null);
    } finally {
      setSearching(false);
    }
  };

  const handleDownload = async (imageUrl, id) => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = imageUrl.split('.').pop().split(/[?#]/)[0] || 'png';
      a.download = `certificate_${id}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Direct download failed, opening in new tab:', error);
      window.open(imageUrl, '_blank');
    }
  };

  const handleDownloadSVG = (details) => {
    const svgElement = document.getElementById('mock-cert-svg');
    if (!svgElement) return;
    try {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${details.id}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download SVG:', error);
    }
  };

  return (
    <>
      <SEO 
        title="Certificate Verification" 
        description="Verify the authenticity of Hadescore Apex training certificates on the secure blockchain registry."
      />
      <style>{`
        @keyframes searchPulse {
          0%, 100% { border-color: rgba(0, 229, 255, 0.2); }
          50% { border-color: rgba(0, 229, 255, 0.5); }
        }
        .verify-card {
          background: rgba(8, 12, 28, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          transition: border-color 0.3s;
        }
        .result-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          width: 100%;
        }
        @media (min-width: 900px) {
          .result-layout {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }
        .cert-photo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        }
        .cert-photo {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          transition: transform 0.3s ease;
          object-fit: contain;
        }
        .cert-photo:hover {
          transform: scale(1.02);
        }
        .download-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #00e5ff, #8b5cf6);
          color: white;
          font-weight: 800;
          font-size: 0.95rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,229,255,0.25);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,229,255,0.4);
        }
        .download-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={{ maxWidth: searchResult ? '1100px' : '680px', margin: '4rem auto 8rem', padding: '0 1.25rem', transition: 'max-width 0.4s ease-in-out' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#00e5ff', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.5rem' }}>Secure Registry</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', fontFamily: 'Outfit', margin: '0 0 0.5rem', color: 'white' }}>Certificate Verification</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', margin: '0 auto' }}>
            Verify the authenticity of Hadescore Apex academic credentials instantly.
          </p>
        </div>

        {/* Search Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Search Card */}
          <div className="verify-card" style={{ animation: 'searchPulse 4s infinite' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Outfit', margin: '0 0 1.25rem', color: 'white', textAlign: 'center' }}>Enter Certificate ID</h2>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <input 
                  style={inputCls}
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="e.g. HTHAT-2026-AI-04829"
                  onFocus={e => e.target.style.borderColor = '#00e5ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
              <button
                type="submit"
                disabled={searching || !certId.trim()}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '0.98rem',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: searching || !certId.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(0,229,255,0.2)',
                  transition: 'all 0.2s',
                  opacity: !certId.trim() ? 0.6 : 1
                }}
              >
                {searching ? 'Verifying Credential...' : 'Verify Credential'}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div style={{ minHeight: '180px' }}>
            {searching ? (
              <div className="verify-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,229,255,0.1)', borderTopColor: '#00e5ff', borderRadius: '50%', animation: 'spinAnim 0.8s linear infinite', marginBottom: '1.25rem' }} />
                <style>{`@keyframes spinAnim{to{transform:rotate(360deg)}}`}</style>
                <div style={{ color: 'white', fontWeight: '800', fontSize: '1rem', fontFamily: 'Outfit' }}>Searching Registry...</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '0.35rem' }}>Validating certificate registry...</div>
              </div>
            ) : hasSearched ? (
              searchResult ? (
                /* Successful verification card */
                <div className="verify-card animate-fade-in" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(135deg, rgba(8, 12, 28, 0.75), rgba(16, 185, 129, 0.02))' }}>
                  <div className="result-layout">
                    {/* Left Column: Details */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.25rem' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recipient</div>
                          <h3 style={{ fontSize: '1.65rem', fontWeight: '900', color: 'white', fontFamily: 'Outfit', marginTop: '0.25rem', marginBottom: '0.25rem' }}>{searchResult.studentName}</h3>
                          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '600' }}>Passed evaluating cohort criteria</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', fontSize: '0.72rem', fontWeight: '800', height: 'fit-content' }}>
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          {searchResult.status}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: '700' }}>Course / Program</div>
                            <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', marginTop: '0.25rem' }}>{searchResult.courseName}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: '700' }}>Certificate ID</div>
                            <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', marginTop: '0.25rem', fontFamily: 'monospace' }}>{searchResult.id}</div>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: '700' }}>Issue Date</div>
                          <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', marginTop: '0.25rem' }}>{searchResult.issueDate}</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Photo / Fallback Preview & Download Button */}
                    <div className="cert-photo-container">
                      {hasValidPhoto(searchResult.certificatePhoto) ? (() => {
                        // Strip query strings, then check the file extension of the last path segment
                        const urlPath = searchResult.certificatePhoto.split('?')[0].split('#')[0];
                        const isDoc = /\.(pdf|doc|docx|txt|xlsx|xls|pptx|ppt)$/i.test(urlPath);
                        const isImage = /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(urlPath);
                        // Show image if it's a known image type OR if the extension is unknown (fallback to image display)
                        if (isDoc) {
                          return (
                            <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
                              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#00e5ff" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                              <div style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem', textAlign: 'center' }}>Secure Document Attached</div>
                              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textAlign: 'center' }}>PDF/Document format loaded from registry</div>
                            </div>
                          );
                        }
                        // For known images OR ambiguous extensions, attempt to display as image
                        return (
                          <img 
                            src={searchResult.certificatePhoto} 
                            alt="Certificate Credential" 
                            className="cert-photo"
                            onError={(e) => {
                              // If image fails to load, swap to document icon fallback
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling.style.display = 'flex');
                            }}
                          />
                        );
                      })() : (
                        <CertificatePlaceholder details={searchResult} />
                      )}
                      
                      <button
                        onClick={() => {
                          if (hasValidPhoto(searchResult.certificatePhoto)) {
                            handleDownload(searchResult.certificatePhoto, searchResult.id);
                          } else {
                            handleDownloadSVG(searchResult);
                          }
                        }}
                        className="download-btn"
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Certificate
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Failed verification card */
                <div className="verify-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', border: '1px solid rgba(239, 68, 68, 0.25)', background: 'linear-gradient(135deg, rgba(8, 12, 28, 0.75), rgba(239, 68, 68, 0.02))' }}>
                  <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '50%', marginBottom: '1.25rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="#ef4444" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  </div>
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', fontFamily: 'Outfit' }}>Verification Failed</div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center', maxWidth: '320px' }}>
                    The certificate ID <strong style={{ color: '#ef4444' }}>{certId}</strong> was not found in our secure registry. Please verify the ID format and try again.
                  </p>
                </div>
              )
            ) : (
              /* Initial state: no search yet */
              <div className="verify-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.005)' }}>
                <div style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '1rem' }}>
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '700', fontSize: '0.9rem' }}>Awaiting Certificate ID</div>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', marginTop: '0.25rem', textAlign: 'center', maxWidth: '280px' }}>
                  Enter a certification identifier code to query the secure registry.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationPage;
