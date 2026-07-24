import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const MEDIA = `http://${window.location.hostname}:8000`;

const EMPTY = {
  name: '', role: '', company: '', review_text: '', rating: 5, is_approved: true, order: 0
};

const inputCls = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: 'white', fontSize: '0.88rem', outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s', fontFamily: 'inherit',
};

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
  </div>
);

const AdminTestimonials = () => {
  const [reviews, setReviews] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_testimonials');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_testimonials');
      return !cached;
    } catch {
      return true;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState('');
  const showToast = useToast();

  const fetchReviews = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_testimonials');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/testimonials/');
      setReviews(res.data);
      localStorage.setItem('hadescore_cache_admin_testimonials', JSON.stringify(res.data));
    } catch {
      showToast('Failed to load testimonials', 'error');
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      localStorage.setItem('hadescore_cache_admin_testimonials', JSON.stringify(reviews));
    } else {
      localStorage.removeItem('hadescore_cache_admin_testimonials');
    }
  }, [reviews]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY, order: reviews.length });
    setImageFile(null);
    setPreviewUrl(null);
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({
      name: r.name,
      role: r.role,
      company: r.company || '',
      review_text: r.review_text,
      rating: r.rating || 5,
      is_approved: r.is_approved,
      order: r.order ?? 0
    });
    setImageFile(null);
    setPreviewUrl(r.avatar ? `${MEDIA}${r.avatar}` : null);
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
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      fd.append(k, v);
    });
    if (imageFile) fd.append('avatar', imageFile);

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
    try {
      if (editingId) {
        await apiClient.patch(`/admin/testimonials/${editingId}/`, fd, cfg);
        showToast('Testimonial updated', 'success');
      } else {
        await apiClient.post('/admin/testimonials/', fd, cfg);
        showToast('Testimonial created', 'success');
      }
      setModalOpen(false);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data ? JSON.stringify(err.response.data) : 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial permanently?')) return;
    try {
      await apiClient.delete(`/admin/testimonials/${id}/`);
      showToast('Testimonial deleted', 'success');
      fetchReviews();
    } catch { showToast('Delete failed', 'error'); }
  };

  const toggleApproved = async (r) => {
    try {
      await apiClient.patch(`/admin/testimonials/${r.id}/`, { is_approved: !r.is_approved });
      setReviews(prev => prev.map(x => x.id === r.id ? { ...x, is_approved: !x.is_approved } : x));
      showToast(`Review ${!r.is_approved ? 'approved' : 'hidden'}`, 'success');
    } catch { showToast('Approval update failed', 'error'); }
  };

  const filtered = reviews.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || (r.company || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="admin-animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Customer Testimonials</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            {reviews.filter(r => r.is_approved).length} approved · {reviews.length} total — displayed dynamically in the homepage carousel
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #10b981, #00e5ff)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.45)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '380px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search reviews…"
          style={{ ...inputCls, paddingLeft: '2.4rem', paddingRight: search ? '2rem' : '1rem' }}
          onFocus={e => e.target.style.borderColor = '#10b981'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>No testimonials yet. Add reviews to showcase on pages.</p>
          <button onClick={openAdd} style={{ padding: '0.65rem 1.5rem', background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Create first review</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.map((r, idx) => (
            <div key={r.id} className="admin-glass-card admin-glass-card-glow-green admin-animate-fade-in" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', animationDelay: `${idx * 0.05}s` }}>
              {/* Header inside card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '2px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {r.avatar ? (
                    <img src={`${MEDIA}${r.avatar}`} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#10b981', fontWeight: '800', fontSize: '1.2rem' }}>{r.name[0]}</span>
                  )}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: '700', color: 'white', fontSize: '0.95rem' }}>{r.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{r.role} {r.company && `at ${r.company}`}</div>
                </div>
              </div>

              {/* Stars rating */}
              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', fontSize: '0.85rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ opacity: i < r.rating ? 1 : 0.2 }}>★</span>
                ))}
              </div>

              {/* Review Text */}
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5', fontStyle: 'italic' }}>
                "{r.review_text}"
              </p>

              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>Order: {r.order}</div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  onClick={() => toggleApproved(r)}
                  style={{ flex: 1, padding: '0.45rem 0', background: r.is_approved ? 'rgba(239,68,68,0.07)' : 'rgba(16,185,129,0.1)', color: r.is_approved ? '#ef4444' : '#10b981', border: `1px solid ${r.is_approved ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.2)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                >
                  {r.is_approved ? 'Hide' : 'Approve'}
                </button>
                <button
                  onClick={() => openEdit(r)}
                  style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.18)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                >Edit</button>
                <button
                  onClick={() => handleDelete(r.id)}
                  style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="admin-animate-scale-in"
            style={{ width: '100%', maxWidth: '500px', background: '#0a0e1c', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Avatar upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '2px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {previewUrl
                    ? <img src={previewUrl} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1.2rem' }}>📷</span>
                  }
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer Avatar</label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>
                    Choose Avatar
                    <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Name */}
              <Field label="Customer Name">
                <input required style={inputCls} value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Sarah Jenkins"
                />
              </Field>

              {/* Role & Company */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Role / Title">
                  <input required style={inputCls} value={form.role}
                    onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    placeholder="e.g. Director of Ops"
                  />
                </Field>
                <Field label="Company Name">
                  <input style={inputCls} value={form.company}
                    onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                  />
                </Field>
              </div>

              {/* Star Rating & Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Star Rating">
                  <select style={inputCls} value={form.rating} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </Field>
                <Field label="Display Order">
                  <input type="number" min="0" style={inputCls} value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                  />
                </Field>
              </div>

              {/* Review Text */}
              <Field label="Review Text">
                <textarea required style={{ ...inputCls, minHeight: '100px', resize: 'vertical' }}
                  value={form.review_text}
                  onChange={e => setForm(p => ({ ...p, review_text: e.target.value }))}
                  placeholder="What is their feedback on your solutions?"
                />
              </Field>

              {/* Status toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <label style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Approved (Show on site)</label>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_approved: !p.is_approved }))}
                  style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.is_approved ? 'linear-gradient(135deg, #10b981, #00e5ff)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}
                >
                  <span style={{ position: 'absolute', top: '3px', left: form.is_approved ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #10b981, #00e5ff)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' }}
                >
                  {editingId ? 'Save Testimonial' : 'Create Testimonial'}
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

export default AdminTestimonials;
