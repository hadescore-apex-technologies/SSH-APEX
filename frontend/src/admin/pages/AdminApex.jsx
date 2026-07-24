import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const SECTION_OPTIONS = [
  { value: 'hero', label: 'Hero' },
  { value: 'stats', label: 'Stats' },
  { value: 'labs', label: 'Innovation Labs' },
  { value: 'programs', label: 'Startup Programs' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'research', label: 'Research' },
  { value: 'events', label: 'Events' },
  { value: 'cta', label: 'CTA / Apply' },
];

const EMPTY = {
  section: 'stats', title: '', subtitle: '', description: '', tags: '', icon: '', extra: '', link: '', order: 0, is_active: true,
};

const inputCls = {
  width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.25s, box-shadow 0.25s', fontFamily: 'inherit',
};

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
  </div>
);

const AdminApex = () => {
  const [items, setItems] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_apex');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_apex');
      return !cached;
    } catch {
      return true;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const showToast = useToast();

  const fetchItems = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_apex');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/apex-items/');
      setItems(res.data);
      localStorage.setItem('hadescore_cache_admin_apex', JSON.stringify(res.data));
    } catch (err) {
      showToast('Failed to load Apex content', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (items && items.length > 0) {
      localStorage.setItem('hadescore_cache_admin_apex', JSON.stringify(items));
    } else {
      localStorage.removeItem('hadescore_cache_admin_apex');
    }
  }, [items]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      section: item.section || 'stats',
      title: item.title || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      tags: item.tags || '',
      icon: item.icon || '',
      extra: item.extra || '',
      link: item.link || '',
      order: item.order ?? 0,
      is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, order: Number(form.order) || 0 };
    try {
      if (editingId) {
        await apiClient.put(`/admin/apex-items/${editingId}/`, payload);
        showToast('Apex item updated', 'success');
      } else {
        await apiClient.post('/admin/apex-items/', payload);
        showToast('Apex item created', 'success');
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      showToast(err.response?.data ? JSON.stringify(err.response.data) : 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Apex item permanently?')) return;
    try {
      await apiClient.delete(`/admin/apex-items/${id}/`);
      showToast('Deleted successfully', 'success');
      fetchItems();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const toggleActive = async (item) => {
    try {
      await apiClient.patch(`/admin/apex-items/${item.id}/`, { is_active: !item.is_active });
      setItems(prev => prev.map(x => x.id === item.id ? { ...x, is_active: !x.is_active } : x));
      showToast(`Item ${item.is_active ? 'deactivated' : 'activated'}`, 'success');
    } catch {
      showToast('Status update failed', 'error');
    }
  };

  const filtered = items.filter(item => {
    if (sectionFilter !== 'all' && item.section !== sectionFilter) return false;
    if (showOnlyActive && !item.is_active) return false;
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return [item.title, item.subtitle, item.description, item.section, item.tags].some(value => String(value ?? '').toLowerCase().includes(query));
  });

  return (
    <div className="admin-animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Apex Content</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Manage all sections of the Apex page (Hero, Stats, Innovation Labs, Startup Programs, Portfolio, Research, Events, CTA).</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(14,165,233,0.3)' }}>Add Item</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center' }}>
        <div style={{ flex: '1 1 320px', minWidth: '240px', position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Apex items…" style={{ ...inputCls, paddingLeft: '1rem', width: '100%' }} />
        </div>
        <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} style={{ ...inputCls, maxWidth: '240px' }}>
          <option value="all">All sections</option>
          {SECTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', minWidth: '180px' }}>
          <input type="checkbox" checked={showOnlyActive} onChange={e => setShowOnlyActive(e.target.checked)} style={{ width: '16px', height: '16px' }} />
          Show active only
        </label>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#4f9cff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            {items.length === 0
              ? "No Apex items found. Click 'Add Item' to start adding content."
              : "No Apex items match your search or filters."}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.sort((a, b) => (a.section + a.order).localeCompare(b.section + b.order)).map(item => (
            <div key={item.id} className="admin-glass-card admin-animate-fade-in" style={{ padding: '1.5rem', minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.section}</div>
                  <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'white' }}>{item.title}</h3>
                </div>
                <span style={{ alignSelf: 'flex-start', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', background: item.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: item.is_active ? '#10b981' : 'rgba(255,255,255,0.5)' }}>{item.is_active ? 'Live' : 'Draft'}</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.92rem', lineHeight: 1.6, minHeight: '3.2rem' }}>{item.subtitle || item.description || '(No subtitle yet)'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                {item.tags && <span style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'rgba(79,156,255,0.12)', color: '#7dd3fc', fontSize: '0.78rem' }}>{item.tags}</span>}
                {item.extra && <span style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'rgba(236,72,153,0.12)', color: '#fda4af', fontSize: '0.78rem' }}>{item.extra}</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => toggleActive(item)} style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: item.is_active ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.1)', color: item.is_active ? '#f87171' : '#6ee7b7', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem' }}>{item.is_active ? 'Deactivate' : 'Publish'}</button>
                <button onClick={() => openEdit(item)} style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(79,156,255,0.12)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && createPortal(
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, padding: '1.5rem', overflowY: 'auto' }} onClick={() => setModalOpen(false)}>
          <div className="admin-animate-scale-in admin-modal-panel" style={{ width: '100%', maxWidth: '680px', background: '#0a0e1c', border: '1px solid rgba(79,156,255,0.15)', borderRadius: '20px', padding: '2rem', position: 'relative', marginTop: 'auto', marginBottom: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: 'white' }}>{editingId ? 'Edit Apex Item' : 'New Apex Item'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div className="admin-modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Section">
                  <select className="c-select" style={inputCls} value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
                    {SECTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </Field>
                <Field label="Order">
                  <input type="number" min="0" className="c-input" style={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
                </Field>
              </div>
              <Field label="Title">
                <input required className="c-input" style={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </Field>
              <div className="admin-modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Subtitle">
                  <input className="c-input" style={inputCls} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
                </Field>
                <Field label="Short stat / button text">
                  <input className="c-input" style={inputCls} value={form.extra} onChange={e => setForm(f => ({ ...f, extra: e.target.value }))} placeholder="Optional" />
                </Field>
              </div>
              <Field label="Description">
                <textarea className="c-textarea" style={{ ...inputCls, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </Field>
              <div className="admin-modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Tags">
                  <input className="c-input" style={inputCls} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Comma-separated" />
                </Field>
                <Field label="Icon / emoji">
                  <input className="c-input" style={inputCls} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="e.g. 🚀 or labs" />
                </Field>
              </div>
              <Field label="Link">
                <input className="c-input" style={inputCls} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="Optional URL or contact" />
              </Field>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ flex: 1, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>Publish item</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} style={{ width: '44px', height: '24px', borderRadius: '999px', border: 'none', background: form.is_active ? 'linear-gradient(135deg, #4f46e5, #0ea5e9)' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer' }}>
                  <span style={{ position: 'absolute', top: '3px', left: form.is_active ? '22px' : '4px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.85rem', background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', border: 'none', borderRadius: '14px', color: 'white', cursor: 'pointer', fontWeight: '700' }}>{editingId ? 'Save Item' : 'Create Item'}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminApex;
