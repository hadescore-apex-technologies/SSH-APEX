import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const EMPTY = {
  title: '', location: '', type: 'Full-Time', experience: '',
  description: '', requirements: '', is_active: true,
};

const inputCls = {
  width: '100%', padding: '0.8rem 1rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: 'white', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s', fontFamily: 'inherit',
};

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
  </div>
);

const AdminCareers = () => {
  const [careers, setCareers] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_careers');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_careers');
      return !cached;
    } catch {
      return true;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const showToast = useToast();

  const fetchCareers = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_careers');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/careers/');
      setCareers(res.data);
      localStorage.setItem('hadescore_cache_admin_careers', JSON.stringify(res.data));
    } catch (e) {
      showToast('Failed to load careers', 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (careers && careers.length > 0) {
      localStorage.setItem('hadescore_cache_admin_careers', JSON.stringify(careers));
    } else {
      localStorage.removeItem('hadescore_cache_admin_careers');
    }
  }, [careers]);

  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (c) => { setEditingId(c.id); setForm({ title: c.title, location: c.location, type: c.type, experience: c.experience, description: c.description, requirements: c.requirements || '', is_active: c.is_active }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/admin/careers/${editingId}/`, form);
        showToast('Career updated', 'success');
      } else {
        await apiClient.post('/admin/careers/', form);
        showToast('Career posted', 'success');
      }
      setModalOpen(false);
      fetchCareers();
    } catch (e) {
      showToast(e.response?.data ? JSON.stringify(e.response.data) : 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await apiClient.delete(`/admin/careers/${id}/`);
      showToast('Deleted', 'success');
      fetchCareers();
    } catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (c) => {
    try {
      await apiClient.patch(`/admin/careers/${c.id}/`, { is_active: !c.is_active });
      setCareers(prev => prev.map(x => x.id === c.id ? { ...x, is_active: !x.is_active } : x));
      showToast(`Job ${!c.is_active ? 'activated' : 'deactivated'}`, 'success');
    } catch { showToast('Failed to update status', 'error'); }
  };

  const filtered = careers.filter(c =>
    filter === 'all' ? true : filter === 'active' ? c.is_active : !c.is_active
  );

  const TYPE_OPTS = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="admin-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#4f9cff', borderRadius: '50%' }} />
    </div>
  );

  return (
    <div className="admin-animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Careers</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            {careers.filter(c => c.is_active).length} active · {careers.filter(c => !c.is_active).length} inactive
          </p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #4f9cff, #00e5ff)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(79,156,255,0.3)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,156,255,0.45)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,156,255,0.3)'; }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Post Job
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([val, lbl]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: `1px solid ${filter === val ? 'rgba(79,156,255,0.4)' : 'rgba(255,255,255,0.08)'}`, background: filter === val ? 'rgba(79,156,255,0.12)' : 'transparent', color: filter === val ? '#4f9cff' : 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>No job postings found.</p>
          <button onClick={openAdd} style={{ padding: '0.65rem 1.5rem', background: 'rgba(79,156,255,0.12)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Create first posting</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((c, idx) => (
            <div key={c.id} 
              className={`admin-glass-card admin-animate-fade-in admin-stagger-${Math.min(idx + 1, 8)} ${c.is_active ? 'admin-glass-card-glow-green' : 'admin-glass-card-glow-rose'}`}
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                borderLeft: `3px solid ${c.is_active ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>{c.title}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', background: c.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: c.is_active ? '#10b981' : 'rgba(255,255,255,0.3)' }}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[['📍', c.location], ['🕒', c.type], ['⚡', c.experience]].map(([icon, val]) => val && (
                    <span key={icon} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{icon} {val}</span>
                  ))}
                </div>
                {c.description && (
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', margin: '0.5rem 0 0', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {c.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => toggleActive(c)} style={{ padding: '0.45rem 0.85rem', background: c.is_active ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.1)', color: c.is_active ? '#ef4444' : '#10b981', border: `1px solid ${c.is_active ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.2)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', transition: 'background 0.2s' }}>
                  {c.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => openEdit(c)} style={{ padding: '0.45rem 0.85rem', background: 'rgba(79,156,255,0.1)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.18)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ padding: '0.45rem 0.85rem', background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, padding: '2rem 1rem', overflowY: 'auto' }} onClick={() => setModalOpen(false)}>
          <div className="admin-animate-scale-in" style={{ width: '100%', maxWidth: '600px', background: '#0a0e1c', border: '1px solid rgba(79,156,255,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #4f9cff, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>{editingId ? 'Edit Job Posting' : 'New Job Posting'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Row 1 */}
              <Field label="Job Title">
                <input className="admin-input" required style={inputCls} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior React Developer" />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Location">
                  <input className="admin-input" required style={inputCls} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Chennai / Remote" />
                </Field>
                <Field label="Type">
                  <select className="admin-select" style={inputCls} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Experience Required">
                <input className="admin-input" style={inputCls} value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. 2–4 years" />
              </Field>

              <Field label="Job Description">
                <textarea className="admin-textarea" required style={{ ...inputCls, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the role, responsibilities…" />
              </Field>

              <Field label="Requirements (optional)">
                <textarea className="admin-textarea" style={{ ...inputCls, minHeight: '80px', resize: 'vertical' }} value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} placeholder="Skills, qualifications…" />
              </Field>

              {/* Active toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <label style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                  Publish immediately (set as Active)
                </label>
                <button type="button" onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))} style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.is_active ? 'linear-gradient(135deg, #10b981, #00e5ff)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
                  <span style={{ position: 'absolute', top: '3px', left: form.is_active ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #4f9cff, #00e5ff)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 16px rgba(79,156,255,0.35)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,156,255,0.5)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,156,255,0.35)'; }}>
                  {editingId ? 'Save Changes' : 'Post Job'}
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

export default AdminCareers;
