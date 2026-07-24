import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const ICON_OPTIONS = [
  'web','mobile','ai','cyber','uiux','database','marketing',
  'recruitment','growth','incubate','cpu','RET','FIN','HLT','EDU','SUP','MFG',
  'internship','trading','web3',
];

const EMPTY = {
  title: '', subtitle: '', icon_type: 'web', tags: '', order: 0, is_active: true,
};

const inputCls = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: 'white', fontSize: '0.88rem', outline: 'none',
  transition: 'border-color 0.25s', fontFamily: 'inherit',
};

const Field = ({ label, hint, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
    {hint && <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>{hint}</p>}
  </div>
);

export default function AdminServices() {
  const [items, setItems]       = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_services');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading]   = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_services');
      return !cached;
    } catch {
      return true;
    }
  });
  const [modalOpen, setModal]   = useState(false);
  const [editingId, setEditing] = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [search, setSearch]     = useState('');
  const [saving, setSaving]     = useState(false);
  const showToast = useToast();

  const fetchAll = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_services');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/services/');
      setItems(res.data);
      localStorage.setItem('hadescore_cache_admin_services', JSON.stringify(res.data));
    } catch { showToast('Failed to load services', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => {
    if (items && items.length > 0) {
      localStorage.setItem('hadescore_cache_admin_services', JSON.stringify(items));
    } else {
      localStorage.removeItem('hadescore_cache_admin_services');
    }
  }, [items]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, order: items.length + 1 });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title, subtitle: item.subtitle, icon_type: item.icon_type,
      tags: item.tags || '', order: item.order, is_active: item.is_active,
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.patch(`/admin/services/${editingId}/`, form);
        showToast('Service updated ✓', 'success');
      } else {
        await apiClient.post('/admin/services/', form);
        showToast('Service created ✓', 'success');
      }
      setModal(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data ? JSON.stringify(err.response.data) : 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await apiClient.delete(`/admin/services/${id}/`);
      showToast('Service deleted', 'success');
      fetchAll();
    } catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (item) => {
    try {
      await apiClient.patch(`/admin/services/${item.id}/`, { is_active: !item.is_active });
      setItems(prev => prev.map(x => x.id === item.id ? { ...x, is_active: !x.is_active } : x));
      showToast(`Service ${!item.is_active ? 'activated' : 'deactivated'}`, 'success');
    } catch { showToast('Status update failed', 'error'); }
  };

  const filtered = items.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) || (s.subtitle || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#00e5ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="admin-animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Services</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            {items.filter(s => s.is_active !== false).length} active · {items.length} total — manage the services listed on your website
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(0,229,255,0.3)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,229,255,0.45)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,229,255,0.3)'; }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Service
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '380px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search services…"
          style={{ ...inputCls, paddingLeft: '2.4rem', paddingRight: search ? '2rem' : '1rem' }}
          onFocus={e => e.target.style.borderColor = '#00e5ff'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛠️</div>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>No services found. Add your first service.</p>
          <button onClick={openAdd} style={{ padding: '0.65rem 1.5rem', background: 'rgba(0,229,255,0.12)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Add Service</button>
        </div>
      ) : (
        <div className="admin-table-scroll-wrapper" style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#', 'Icon', 'Title', 'Subtitle', 'Tags', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: '700', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.25)', fontWeight: '700' }}>{s.order || idx + 1}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ display: 'inline-block', padding: '3px 8px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '6px', color: '#00e5ff', fontSize: '0.7rem', fontWeight: '700', fontFamily: 'monospace' }}>
                      {s.icon_type}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'white', fontWeight: '600', maxWidth: '180px' }}>{s.title}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.45)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.subtitle}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
                    {(s.tags || '').split('\n').filter(Boolean).length} items
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button
                      onClick={() => toggleActive(s)}
                      style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', border: 'none', background: s.is_active !== false ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: s.is_active !== false ? '#10b981' : 'rgba(255,255,255,0.3)' }}
                    >
                      {s.is_active !== false ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(s)} style={{ padding: '0.4rem 0.85rem', background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.18)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Edit</button>
                      <button onClick={() => handleDelete(s.id, s.title)} style={{ padding: '0.4rem 0.85rem', background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && createPortal(
        <div
          className="admin-modal-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, padding: '2rem 1rem', overflowY: 'auto' }}
          onClick={() => setModal(false)}
        >
          <div
            className="admin-animate-scale-in admin-modal-panel"
            style={{ width: '100%', maxWidth: '680px', background: '#0a0e1c', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>{editingId ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="admin-modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Title">
                  <input required style={inputCls} value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Cybersecurity"
                    onFocus={e => e.target.style.borderColor = '#00e5ff'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </Field>
                <Field label="Icon Type">
                  <select
                    style={{ ...inputCls, cursor: 'pointer' }}
                    value={form.icon_type}
                    onChange={e => setForm(f => ({ ...f, icon_type: e.target.value }))}
                  >
                    {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Subtitle / Tagline">
                <input style={inputCls} value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="e.g. Protect What You Build."
                  onFocus={e => e.target.style.borderColor = '#00e5ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>

              <Field label="Service Items (one per line)" hint="Each line becomes a bullet point on the website.">
                <textarea
                  required
                  style={{ ...inputCls, minHeight: '180px', resize: 'vertical', lineHeight: '1.7' }}
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder={"Website Development\nMobile App Development\nAI Integration"}
                  onFocus={e => e.target.style.borderColor = '#00e5ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>

              <div className="admin-modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Display Order">
                  <input type="number" min="1" style={inputCls} value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                    onFocus={e => e.target.style.borderColor = '#00e5ff'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </Field>
                <Field label="Visibility">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', height: '48px', boxSizing: 'border-box' }}>
                    <span style={{ flex: 1, fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>Show on website</span>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                      style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.is_active ? 'linear-gradient(135deg, #00e5ff, #8b5cf6)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}
                    >
                      <span style={{ position: 'absolute', top: '3px', left: form.is_active ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                    </button>
                  </div>
                </Field>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button
                  type="submit" disabled={saving}
                  style={{ flex: 2, padding: '0.8rem', background: saving ? 'rgba(0,229,255,0.3)' : 'linear-gradient(135deg, #00e5ff, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', boxShadow: '0 4px 16px rgba(0,229,255,0.35)', transition: 'all 0.2s' }}
                >
                  {saving ? 'Saving…' : (editingId ? 'Save Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
