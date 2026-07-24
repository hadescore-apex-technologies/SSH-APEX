import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const EMPTY = {
  title: '', description: '', category: '', level: 'Beginner',
  duration: '', lessons: '', price: '', icon: '', color: '#4f9cff', is_active: true,
};

const inputCls = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: 'white', fontSize: '0.88rem', outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s', fontFamily: 'inherit',
};

const colorToGlowClass = (color) => {
  if (color === '#4f9cff') return 'admin-glass-card-glow-blue';
  if (color === '#a855f7' || color === '#8b5cf6') return 'admin-glass-card-glow-purple';
  if (color === '#00e5ff' || color === '#06b6d4') return 'admin-glass-card-glow-cyan';
  if (color === '#10b981') return 'admin-glass-card-glow-green';
  if (color === '#f59e0b') return 'admin-glass-card-glow-amber';
  if (color === '#f43f5e') return 'admin-glass-card-glow-rose';
  return 'admin-glass-card-glow-blue';
};

const Field = ({ label, children, half }) => (
  <div style={half ? {} : {}}>
    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
  </div>
);

const LEVEL_OPTS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const CATEGORY_OPTS = ['Full Stack', 'Mobile Dev', 'AI / ML', 'Cybersecurity', 'Robotics', 'Drone Tech', 'Biotech', 'Startup', 'Marketing', 'Design'];

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const showToast = useToast();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/courses/');
      setCourses(res.data);
    } catch (e) {
      showToast('Failed to load courses', 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ title: c.title, description: c.description, category: c.category, level: c.level, duration: c.duration, lessons: c.lessons, price: c.price, icon: c.icon || '', color: c.color || '#4f9cff', is_active: c.is_active });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, lessons: Number(form.lessons) || 0, price: parseFloat(form.price) || 0 };
    try {
      if (editingId) {
        await apiClient.put(`/admin/courses/${editingId}/`, payload);
        showToast('Course updated', 'success');
      } else {
        await apiClient.post('/admin/courses/', payload);
        showToast('Course created', 'success');
      }
      setModalOpen(false);
      fetchCourses();
    } catch (e) {
      showToast(e.response?.data ? JSON.stringify(e.response.data) : 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await apiClient.delete(`/admin/courses/${id}/`);
      showToast('Course deleted', 'success');
      fetchCourses();
    } catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (c) => {
    try {
      await apiClient.patch(`/admin/courses/${c.id}/`, { is_active: !c.is_active });
      setCourses(prev => prev.map(x => x.id === c.id ? { ...x, is_active: !x.is_active } : x));
      showToast(`Course ${!c.is_active ? 'activated' : 'deactivated'}`, 'success');
    } catch { showToast('Status update failed', 'error'); }
  };

  const filtered = courses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#4f9cff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="admin-animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Courses</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            {courses.filter(c => c.is_active).length} active · {courses.length} total
          </p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #8b5cf6, #4f9cff)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(139,92,246,0.3)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.45)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.3)'; }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Course
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '380px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses…" style={{ ...inputCls, paddingLeft: '2.4rem', paddingRight: search ? '2rem' : '1rem' }} className="c-input"
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>No courses found.</p>
          <button onClick={openAdd} style={{ padding: '0.65rem 1.5rem', background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Create first course</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map((c, idx) => (
            <div key={c.id} className={`admin-glass-card ${colorToGlowClass(c.color || '#8b5cf6')} admin-animate-fade-in admin-stagger-${(idx % 8) + 1}`} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle at top right, ${c.color || '#8b5cf6'}18, transparent)`, borderRadius: '0 14px 0 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: (c.color || '#8b5cf6') + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    {c.icon || '📚'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', lineHeight: '1.3' }}>{c.title}</div>
                    <div style={{ fontSize: '0.72rem', color: c.color || '#8b5cf6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.category}</div>
                  </div>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', background: c.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: c.is_active ? '#10b981' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                {[['Level', c.level], ['Duration', c.duration], ['Lessons', c.lessons], ['Price', c.price ? `₹${c.price}` : 'Free']].map(([lbl, val]) => val !== undefined && val !== '' && (
                  <div key={lbl}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lbl}</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{String(val)}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button onClick={() => toggleActive(c)} style={{ flex: 1, padding: '0.45rem 0', background: c.is_active ? 'rgba(239,68,68,0.07)' : 'rgba(16,185,129,0.1)', color: c.is_active ? '#ef4444' : '#10b981', border: `1px solid ${c.is_active ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.2)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                  {c.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => openEdit(c)} style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.18)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, padding: '2rem 1rem', overflowY: 'auto' }} onClick={() => setModalOpen(false)}>
          <div className="admin-animate-scale-in" style={{ width: '100%', maxWidth: '560px', background: '#0a0e1c', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>{editingId ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Course Title">
                <input className="c-input" required style={inputCls} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Full Stack MERN Bootcamp" />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Category">
                  <select className="c-select" style={inputCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    <option value="">Select…</option>
                    {CATEGORY_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Level">
                  <select className="c-select" style={inputCls} value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                    {LEVEL_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Duration">
                  <input className="c-input" style={inputCls} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 3 months" />
                </Field>
                <Field label="Lessons">
                  <input className="c-input" type="number" min="0" style={inputCls} value={form.lessons} onChange={e => setForm(p => ({ ...p, lessons: e.target.value }))} placeholder="e.g. 48" />
                </Field>
                <Field label="Price (₹)">
                  <input className="c-input" type="number" min="0" step="0.01" style={inputCls} value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0 = Free" />
                </Field>
                <Field label="Icon (emoji)">
                  <input className="c-input" style={inputCls} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="📚" />
                </Field>
              </div>

              <Field label="Description">
                <textarea className="c-textarea" required style={{ ...inputCls, minHeight: '90px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What students will learn…" />
              </Field>

              {/* Active toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <label style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Publish course (Active)</label>
                <button type="button" onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))} style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.is_active ? 'linear-gradient(135deg, #8b5cf6, #4f9cff)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
                  <span style={{ position: 'absolute', top: '3px', left: form.is_active ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #8b5cf6, #4f9cff)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 16px rgba(139,92,246,0.35)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.5)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.35)'; }}>
                  {editingId ? 'Save Changes' : 'Create Course'}
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

export default AdminCourses;
