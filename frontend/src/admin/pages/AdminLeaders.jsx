import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';
import { getBackendUrl } from '../../utils/api';

const inputStyle = {
  width: '100%', padding: '0.8rem 1rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: 'white', fontSize: '0.9rem', outline: 'none',
  transition: 'all 0.25s ease', fontFamily: 'inherit',
};

const AdminLeaders = () => {
  const [leaders, setLeaders] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_leaders');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_leaders');
      return !cached;
    } catch {
      return true;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form, setForm] = useState({
    name: '', role: '', detail: '', linkedin_url: '', portfolio_url: '', email: '', order: 0,
    is_founder: false, initials: '', color_theme: 'cyan', quote: '',
    stat1_value: '', stat1_label: '', stat2_value: '', stat2_label: '',
    stat3_value: '', stat3_label: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const showToast = useToast();
  const navigate = useNavigate();

  const fetchLeaders = async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_leaders');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/leaders/');
      setLeaders(res.data);
      localStorage.setItem('hadescore_cache_admin_leaders', JSON.stringify(res.data));
    } catch (e) {
      showToast('Failed to load leaders', 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (leaders && leaders.length > 0) {
      localStorage.setItem('hadescore_cache_admin_leaders', JSON.stringify(leaders));
    } else {
      localStorage.removeItem('hadescore_cache_admin_leaders');
    }
  }, [leaders]);

  useEffect(() => { fetchLeaders(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      name: '', role: '', detail: '', linkedin_url: '', portfolio_url: '', email: '', order: leaders.length,
      is_founder: false, initials: '', color_theme: 'cyan', quote: '',
      stat1_value: '', stat1_label: '', stat2_value: '', stat2_label: '',
      stat3_value: '', stat3_label: ''
    });
    setImageFile(null);
    setPreviewUrl(null);
    setModalOpen(true);
  };

  const openEdit = (l) => {
    setEditingId(l.id);
    setForm({
      name: l.name, role: l.role, detail: l.detail || '', linkedin_url: l.linkedin_url || '', portfolio_url: l.portfolio_url || '', email: l.email || '', order: l.order,
      is_founder: l.is_founder || false,
      initials: l.initials || '',
      color_theme: l.color_theme || 'cyan',
      quote: l.quote || '',
      stat1_value: l.stat1_value || '',
      stat1_label: l.stat1_label || '',
      stat2_value: l.stat2_value || '',
      stat2_label: l.stat2_label || '',
      stat3_value: l.stat3_value || '',
      stat3_label: l.stat3_label || ''
    });
    setImageFile(null);
    setPreviewUrl(l.image ? getBackendUrl(l.image) : null);
    setModalOpen(true);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, v === true ? 'true' : v === false ? 'false' : v);
      });
      if (imageFile) fd.append('image', imageFile);
      if (editingId) {
        await apiClient.patch(`/admin/leaders/${editingId}/`, fd);
        showToast('Leader updated', 'success');
      } else {
        await apiClient.post('/admin/leaders/', fd);
        showToast('Leader added', 'success');
      }
      setModalOpen(false);
      fetchLeaders();
    } catch (e) {
      showToast('Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leader?')) return;
    try {
      await apiClient.delete(`/admin/leaders/${id}/`);
      showToast('Deleted', 'success');
      fetchLeaders();
    } catch { showToast('Delete failed', 'error'); }
  };

  if (loading && !leaders.length)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="admin-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#4f9cff', borderRadius: '50%' }} />
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>Loading leaders…</span>
      </div>
    );

  return (
    <div className="admin-animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Executive Leadership</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>{leaders.length} team member{leaders.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #4f9cff, #00e5ff)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(79,156,255,0.35)', transition: 'all 0.2s ease' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(79,156,255,0.5)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,156,255,0.35)'; }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Leader
        </button>
      </div>

      {/* Grid of leader cards */}
      {leaders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>No leaders added yet.</p>
          <button onClick={openAdd} style={{ padding: '0.65rem 1.5rem', background: 'rgba(79,156,255,0.15)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.25)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Add first leader</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {leaders.map((l, idx) => (
            <div key={l.id} 
              className={`admin-glass-card admin-animate-fade-in admin-stagger-${Math.min(idx + 1, 8)} admin-glass-card-glow-blue`}
              style={{
                padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Avatar */}
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(79,156,255,0.25)', background: l.image ? 'transparent' : 'rgba(79,156,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {l.image
                    ? <img src={getBackendUrl(l.image)} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} className="leader-avatar-img" />
                    : <span style={{ color: '#4f9cff', fontWeight: '800', fontSize: '1.3rem' }}>{l.initials || l.name[0]}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', color: 'white', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {l.name}
                    {l.is_founder && <span style={{ padding: '0.1rem 0.4rem', background: 'rgba(0,229,255,0.15)', color: '#00e5ff', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>Founder</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', background: 'linear-gradient(135deg, #4f9cff, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l.role}</div>
                </div>
                <div style={{ flexShrink: 0, padding: '0.25rem 0.7rem', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>#{l.order}</div>
              </div>
              {l.is_founder && l.quote && <p style={{ fontSize: '0.83rem', color: '#a78bfa', fontStyle: 'italic', margin: 0 }}>"{l.quote.substring(0, 80)}..."</p>}
              {!l.is_founder && l.detail && <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5', margin: 0 }}>{l.detail}</p>}

              {/* LinkedIn + Email links on card */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {l.linkedin_url ? (
                  <a href={l.linkedin_url} target="_blank" rel="noopener noreferrer"
                    title="Open LinkedIn"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.7rem', background: 'rgba(10,102,194,0.15)', border: '1px solid rgba(10,102,194,0.35)', borderRadius: '7px', color: '#4a9eff', fontSize: '0.75rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background='rgba(10,102,194,0.3)'; e.currentTarget.style.boxShadow='0 0 10px rgba(10,102,194,0.4)'; }}
                    onMouseOut={e => { e.currentTarget.style.background='rgba(10,102,194,0.15)'; e.currentTarget.style.boxShadow='none'; }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    No LinkedIn
                  </span>
                )}
                {l.email ? (
                  <a href={`mailto:${l.email}`}
                    target="_blank" rel="noopener noreferrer"
                    title={`Email: ${l.email}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.7rem', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '7px', color: '#00e5ff', fontSize: '0.75rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background='rgba(0,229,255,0.2)'; e.currentTarget.style.boxShadow='0 0 10px rgba(0,229,255,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.background='rgba(0,229,255,0.08)'; e.currentTarget.style.boxShadow='none'; }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                    {l.email}
                  </a>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                    No Email
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
                <button onClick={() => openEdit(l)} style={{ flex: 1, minWidth: 0, padding: '0.55rem 0.4rem', background: 'rgba(79,156,255,0.1)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(l.id)} style={{ flex: 1, minWidth: 0, padding: '0.55rem 0.4rem', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem' }} onClick={() => setModalOpen(false)}>
          <div className="admin-animate-scale-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto', background: '#0a0e1c', border: '1px solid rgba(79,156,255,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            {/* Top glow */}
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #4f9cff, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>{editingId ? 'Edit Leader' : 'Add Leader'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Image preview + upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: previewUrl ? '#ffffff' : 'rgba(79,156,255,0.1)', border: '2px solid rgba(79,156,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {previewUrl
                    ? <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#ffffff' }} />
                    : <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="rgba(79,156,255,0.4)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Photo (Optional - Initials will be used if blank)</label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'rgba(79,156,255,0.1)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                  </label>
                  {imageFile && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{imageFile.name}</span>}
                </div>
              </div>

              {/* Is Founder Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.2rem 0' }}>
                <input
                  type="checkbox"
                  id="is_founder"
                  name="is_founder"
                  checked={form.is_founder}
                  onChange={e => setForm(p => ({ ...p, is_founder: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4f9cff' }}
                />
                <label htmlFor="is_founder" style={{ fontSize: '0.88rem', fontWeight: '700', color: 'white', cursor: 'pointer' }}>Designate as Founder</label>
              </div>

              {/* Glow Theme Choice */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Glow Theme Color</label>
                <select
                  style={inputStyle}
                  name="color_theme"
                  value={form.color_theme}
                  onChange={e => setForm(p => ({ ...p, color_theme: e.target.value }))}
                >
                  <option value="cyan">Cyan Glow</option>
                  <option value="purple">Purple Glow</option>
                  <option value="green">Green Glow</option>
                  <option value="pink">Pink/Magenta Glow</option>
                  <option value="blue">Blue Glow</option>
                </select>
              </div>

              {[
                { label: 'Full Name', name: 'name', required: true, placeholder: 'e.g. Rohit Hadescore' },
                { label: 'Role / Title', name: 'role', required: true, placeholder: 'e.g. Founder & CEO' },
                { label: 'Initials (Optional)', name: 'initials', required: false, placeholder: 'e.g. RH (automatically generated if blank)' },
                { label: 'Short Bio (Optional for Founder)', name: 'detail', required: false, placeholder: 'Brief description' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.label}</label>
                  <input
                    className="admin-input"
                    style={inputStyle}
                    name={f.name}
                    value={form[f.name]}
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                    required={f.required}
                  />
                </div>
              ))}

              {/* Founder specific details */}
              {form.is_founder && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(79,156,255,0.03)', border: '1px solid rgba(79,156,255,0.1)', borderRadius: '12px', marginTop: '0.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#4f9cff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Founder Details & Stats</h3>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Founder's Quote</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                      name="quote"
                      value={form.quote}
                      onChange={e => setForm(p => ({ ...p, quote: e.target.value }))}
                      placeholder="e.g. India has the talent. India has the ambition..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.2rem' }}>Stat 1 Value</label>
                      <input style={inputStyle} value={form.stat1_value} onChange={e => setForm(p => ({ ...p, stat1_value: e.target.value }))} placeholder="e.g. 12+" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.2rem' }}>Stat 1 Label</label>
                      <input style={inputStyle} value={form.stat1_label} onChange={e => setForm(p => ({ ...p, stat1_label: e.target.value }))} placeholder="e.g. YEARS BUILDING" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.2rem' }}>Stat 2 Value</label>
                      <input style={inputStyle} value={form.stat2_value} onChange={e => setForm(p => ({ ...p, stat2_value: e.target.value }))} placeholder="e.g. 4" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.2rem' }}>Stat 2 Label</label>
                      <input style={inputStyle} value={form.stat2_label} onChange={e => setForm(p => ({ ...p, stat2_label: e.target.value }))} placeholder="e.g. VENTURES" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.2rem' }}>Stat 3 Value</label>
                      <input style={inputStyle} value={form.stat3_value} onChange={e => setForm(p => ({ ...p, stat3_value: e.target.value }))} placeholder="e.g. 2K+" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.2rem' }}>Stat 3 Label</label>
                      <input style={inputStyle} value={form.stat3_label} onChange={e => setForm(p => ({ ...p, stat3_label: e.target.value }))} placeholder="e.g. MENTEES" />
                    </div>
                  </div>
                </div>
              )}

              {/* LinkedIn URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn URL
                  </span>
                </label>
                <input
                  className="admin-input"
                  style={{ ...inputStyle, borderColor: form.linkedin_url ? 'rgba(10,102,194,0.4)' : 'rgba(255,255,255,0.08)' }}
                  type="url"
                  name="linkedin_url"
                  value={form.linkedin_url}
                  onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              {/* Portfolio URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                    Portfolio URL
                  </span>
                </label>
                <input
                  className="admin-input"
                  style={{ ...inputStyle, borderColor: form.portfolio_url ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.08)' }}
                  type="url"
                  name="portfolio_url"
                  value={form.portfolio_url}
                  onChange={e => setForm(p => ({ ...p, portfolio_url: e.target.value }))}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                    Email Address
                  </span>
                </label>
                <input
                  className="admin-input"
                  style={{ ...inputStyle, borderColor: form.email ? 'rgba(0,229,255,0.35)' : 'rgba(255,255,255,0.08)' }}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="leader@hadescore.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Display Order</label>
                <input
                  className="admin-input"
                  style={{ ...inputStyle, width: '120px' }}
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                  min="0"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #4f9cff, #00e5ff)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(79,156,255,0.35)', transition: 'all 0.2s' }}>
                  {editingId ? 'Save Changes' : 'Add Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminLeaders;
