import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const EMPTY = {
  name: '', tagline: '', description: '', icon: '', color: '#4f9cff',
  category: '', is_active: true, is_coming_soon: false, order: 0,
};

const inputCls = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: 'white', fontSize: '0.88rem', outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s', fontFamily: 'inherit',
};

const COLOR_OPTIONS = [
  { label: 'Blue',       value: '#4f9cff' },
  { label: 'Sky Blue',   value: '#0ea5e9' },
  { label: 'Purple',     value: '#8b5cf6' },
  { label: 'Cyan',       value: '#00e5ff' },
  { label: 'Green',      value: '#10b981' },
  { label: 'Amber',      value: '#f59e0b' },
  { label: 'Rose',       value: '#f43f5e' },
  { label: 'Pink',       value: '#ec4899' },
];

const CATEGORY_OPTS = [
  'SaaS', 'CRM', 'LMS', 'ERP', 'Analytics',
  'Automation', 'AI/ML', 'Mobile App', 'Enterprise', 'Other',
];

const colorGlowMap = {
  '#4f9cff': 'admin-glass-card-glow-blue',
  '#0ea5e9': 'admin-glass-card-glow-cyan',
  '#8b5cf6': 'admin-glass-card-glow-purple',
  '#a855f7': 'admin-glass-card-glow-purple',
  '#00e5ff': 'admin-glass-card-glow-cyan',
  '#06b6d4': 'admin-glass-card-glow-cyan',
  '#10b981': 'admin-glass-card-glow-green',
  '#f59e0b': 'admin-glass-card-glow-amber',
  '#f43f5e': 'admin-glass-card-glow-rose',
  '#ef4444': 'admin-glass-card-glow-rose',
  '#ec4899': 'admin-glass-card-glow-rose',
};

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
  </div>
);

const AdminProducts = () => {
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_products');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_products');
      return !cached;
    } catch {
      return true;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const showToast = useToast();

  const fetchProducts = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_products');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/products/');
      setProducts(res.data);
      localStorage.setItem('hadescore_cache_admin_products', JSON.stringify(res.data));
    } catch {
      showToast('Failed to load products', 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      localStorage.setItem('hadescore_cache_admin_products', JSON.stringify(products));
    } else {
      localStorage.removeItem('hadescore_cache_admin_products');
    }
  }, [products]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name, tagline: p.tagline, description: p.description,
      icon: p.icon || '', color: p.color || '#4f9cff',
      category: p.category || '', is_active: p.is_active, is_coming_soon: p.is_coming_soon || false, order: p.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, order: Number(form.order) || 0 };
    try {
      if (editingId) {
        await apiClient.put(`/admin/products/${editingId}/`, payload);
        showToast('Product updated', 'success');
      } else {
        await apiClient.post('/admin/products/', payload);
        showToast('Product created', 'success');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (e) {
      showToast(e.response?.data ? JSON.stringify(e.response.data) : 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await apiClient.delete(`/admin/products/${id}/`);
      showToast('Product deleted', 'success');
      fetchProducts();
    } catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (p) => {
    try {
      await apiClient.patch(`/admin/products/${p.id}/`, { is_active: !p.is_active });
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
      showToast(`Product ${!p.is_active ? 'published' : 'unpublished'}`, 'success');
    } catch { showToast('Status update failed', 'error'); }
  };

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.category || '').toLowerCase().includes(search.toLowerCase())
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Products</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            {products.filter(p => p.is_active).length} published · {products.length} total — changes reflect on the main website instantly
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(236,72,153,0.3)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(236,72,153,0.45)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,72,153,0.3)'; }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '380px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          style={{ ...inputCls, paddingLeft: '2.4rem', paddingRight: search ? '2rem' : '1rem' }}
          className="c-input"
          onFocus={e => e.target.style.borderColor = '#ec4899'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>No products yet. Add your first product to display on the website.</p>
          <button onClick={openAdd} style={{ padding: '0.65rem 1.5rem', background: 'rgba(236,72,153,0.12)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Create first product</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map((p, idx) => {
            const glowClass = colorGlowMap[p.color] || 'admin-glass-card-glow-blue';
            return (
              <div key={p.id} className={`admin-glass-card ${glowClass} admin-animate-fade-in admin-stagger-${(idx % 8) + 1}`} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Color accent */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle at top right, ${p.color || '#ec4899'}20, transparent)`, borderRadius: '0 14px 0 0' }} />

                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: (p.color || '#ec4899') + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                      {p.icon || '📦'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem', lineHeight: '1.3' }}>{p.name}</div>
                      {p.category && <div style={{ fontSize: '0.72rem', color: p.color || '#ec4899', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.category}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                    {p.is_coming_soon && (
                      <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                        Coming Soon
                      </span>
                    )}
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', background: p.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: p.is_active ? '#10b981' : 'rgba(255,255,255,0.3)' }}>
                      {p.is_active ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Tagline */}
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', lineHeight: '1.4' }}>{p.tagline}</p>

                {/* Description */}
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>

                {/* Order badge */}
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>Order: {p.order}</div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => toggleActive(p)}
                    style={{ flex: 1, padding: '0.45rem 0', background: p.is_active ? 'rgba(239,68,68,0.07)' : 'rgba(16,185,129,0.1)', color: p.is_active ? '#ef4444' : '#10b981', border: `1px solid ${p.is_active ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.2)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                  >
                    {p.is_active ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.18)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                  >Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal via Portal */}
      {modalOpen && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, padding: '2rem 1rem', overflowY: 'auto' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="admin-animate-scale-in"
            style={{ width: '100%', maxWidth: '580px', background: '#0a0e1c', border: '1px solid rgba(236,72,153,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #ec4899, transparent)' }} />

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>{editingId ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Name */}
              <Field label="Product Name">
                <input className="c-input" required style={inputCls} value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Hadescore CRM"
                  onFocus={e => e.target.style.borderColor = '#ec4899'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>

              {/* Tagline */}
              <Field label="Tagline">
                <input className="c-input" required style={inputCls} value={form.tagline}
                  onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))}
                  placeholder="e.g. Manage Your Leads. Close More Deals."
                  onFocus={e => e.target.style.borderColor = '#ec4899'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>

              {/* Two-col row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Category">
                  <select className="c-select" style={inputCls} value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  >
                    <option value="">Select…</option>
                    {CATEGORY_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>

                <Field label="Icon (emoji)">
                  <input className="c-input" style={inputCls} value={form.icon}
                    onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                    placeholder="🚀"
                    onFocus={e => e.target.style.borderColor = '#ec4899'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </Field>

                <Field label="Accent Color">
                  <select className="c-select" style={inputCls} value={form.color}
                    onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  >
                    {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label} ({c.value})</option>)}
                  </select>
                </Field>

                <Field label="Display Order">
                  <input className="c-input" type="number" min="0" style={inputCls} value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                    placeholder="0"
                    onFocus={e => e.target.style.borderColor = '#ec4899'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </Field>
              </div>

              {/* Color preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: form.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>Color preview — used as card accent on the website</span>
              </div>

              {/* Description */}
              <Field label="Description">
                <textarea className="c-textarea" required style={{ ...inputCls, minHeight: '90px', resize: 'vertical' }}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What does this product do? Who is it for?"
                  onFocus={e => e.target.style.borderColor = '#ec4899'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>

              {/* Coming Soon toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <label style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Mark as Coming Soon</label>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_coming_soon: !p.is_coming_soon }))}
                  style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.is_coming_soon ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}
                >
                  <span style={{ position: 'absolute', top: '3px', left: form.is_coming_soon ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              {/* Active toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <label style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Publish on website</label>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                  style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.is_active ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}
                >
                  <span style={{ position: 'absolute', top: '3px', left: form.is_active ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              {/* Submit row */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 16px rgba(236,72,153,0.35)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(236,72,153,0.5)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,72,153,0.35)'; }}
                >
                  {editingId ? 'Save Changes' : 'Create Product'}
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

export default AdminProducts;
