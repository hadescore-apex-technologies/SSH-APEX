import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

// Form initial templates
const MEDIA = `http://${window.location.hostname}:8000`;

const TEMPLATES = {
  mentors: { name: '', role: '', company: '', exp: '', tag: '', email: '', order: 0, is_active: true },
  domains: { title: '', desc: '', salary: '', status: '', duration: '', badge: '', icon: 'code', category: '', details_json: '', order: 0, is_active: true },
  projects: { name: '', complexity: 'Intermediate', duration: '', desc: '', stack: '', mentor: '', order: 0, is_active: true }
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

const AdminEduSkills = () => {
  const [activeTab, setActiveTab] = useState('mentors'); // 'mentors' | 'domains' | 'projects'
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(`hadescore_cache_admin_eduskills_${activeTab}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(`hadescore_cache_admin_eduskills_${activeTab}`);
      return !cached;
    } catch {
      return true;
    }
  });
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(TEMPLATES.mentors);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const showToast = useToast();
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const fetchTab = useCallback(async () => {
    const cached = localStorage.getItem(`hadescore_cache_admin_eduskills_${activeTab}`);
    if (!cached) setLoading(true);
    try {
      const endpoint = `/admin/eduskills-${activeTab}/`;
      const res = await apiClient.get(endpoint);
      setData(res.data);
      localStorage.setItem(`hadescore_cache_admin_eduskills_${activeTab}`, JSON.stringify(res.data));
    } catch (err) {
      showToast(`Failed to load ${activeTab}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, showToast]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(`hadescore_cache_admin_eduskills_${activeTab}`);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
      } else {
        setData([]);
        setLoading(true);
      }
    } catch {
      setData([]);
      setLoading(true);
    }
    fetchTab();
  }, [activeTab, fetchTab]);

  useEffect(() => {
    if (data && data.length > 0) {
      localStorage.setItem(`hadescore_cache_admin_eduskills_${activeTab}`, JSON.stringify(data));
    } else {
      localStorage.removeItem(`hadescore_cache_admin_eduskills_${activeTab}`);
    }
  }, [data, activeTab]);

  useEffect(() => {
    // Reset form when active tab changes
    setForm(TEMPLATES[activeTab]);
  }, [activeTab]);

  const openAdd = () => {
    setEditingId(null);
    setForm(TEMPLATES[activeTab]);
    setImageFile(null);
    setPreviewUrl(null);
    // Auto‑increment order index for mentors and domains
    if (activeTab === 'mentors' || activeTab === 'domains') {
      const maxOrder = data.reduce((m, i) => Math.max(m, i.order || 0), 0);
      setForm(prev => ({ ...prev, order: maxOrder + 1 }));
    }
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setImageFile(null);
    setPreviewUrl(item.curriculum_image ? `${MEDIA}${item.curriculum_image}` : null);
    // Fill form based on current tab schema
    if (activeTab === 'mentors') {
      setForm({ name: item.name, role: item.role, company: item.company, exp: item.exp, tag: item.tag, email: item.email || '', order: item.order, is_active: item.is_active });
    } else if (activeTab === 'domains') {
      setForm({ title: item.title, desc: item.desc, salary: item.salary, status: item.status, duration: item.duration || '', badge: item.badge || '', icon: item.icon || 'code', category: item.category || '', details_json: item.details_json || '', order: item.order, is_active: item.is_active });
    } else if (activeTab === 'projects') {
      setForm({ name: item.name, complexity: item.complexity, duration: item.duration, desc: item.desc, stack: item.stack, mentor: item.mentor || '', order: item.order, is_active: item.is_active });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = `/admin/eduskills-${activeTab}/`;

    try {
      if (activeTab === 'domains') {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          if (k !== 'curriculum_image') {
            fd.append(k, v);
          }
        });
        fd.set('order', Number(form.order) || 0);
        if (imageFile) {
          fd.append('curriculum_image', imageFile);
        }

        const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (editingId) {
          await apiClient.patch(`${endpoint}${editingId}/`, fd, cfg);
          showToast(`Domain updated successfully`, 'success');
        } else {
          await apiClient.post(endpoint, fd, cfg);
          showToast(`Domain created successfully`, 'success');
        }
      } else {
        const payload = { ...form, order: Number(form.order) || 0 };
      // Map domainId to backend foreign key field if present
      if (payload.domainId) {
        payload.domain = payload.domainId;
        delete payload.domainId;
      }        if (editingId) {
          await apiClient.put(`${endpoint}${editingId}/`, payload);
          showToast(`${activeTab.substring(0, activeTab.length - 1)} updated successfully`, 'success');
        } else {
          await apiClient.post(endpoint, payload);
          showToast(`${activeTab.substring(0, activeTab.length - 1)} created successfully`, 'success');
        }
      }
      setModalOpen(false);
      fetchTab();
    } catch (err) {
      showToast(err.response?.data ? JSON.stringify(err.response.data) : 'Save failed', 'error');
    }
  };  

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to permanently delete this ${activeTab.substring(0, activeTab.length - 1)}?`)) return;
    try {
      const endpoint = `/admin/eduskills-${activeTab}/${id}/`;
      await apiClient.delete(endpoint);
      showToast('Deleted successfully', 'success');
      fetchTab();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const toggleField = async (item, fieldName) => {
    try {
      const endpoint = `/admin/eduskills-${activeTab}/${item.id}/`;
      const val = !item[fieldName];
      await apiClient.patch(endpoint, { [fieldName]: val });
      setData(prev => prev.map(x => x.id === item.id ? { ...x, [fieldName]: val } : x));
      showToast(`Status updated successfully`, 'success');
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      showToast('Please select a CSV file', 'error');
      return;
    }

    setBulkUploading(true);
    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      const res = await apiClient.post('/admin/eduskills-mentors/bulk-upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        showToast(`Successfully created ${res.data.created} mentors!`, 'success');
        if (res.data.errors && res.data.errors.length > 0) {
          console.warn('Bulk upload errors:', res.data.errors);
          showToast(`${res.data.errors.length} rows had errors. Check console.`, 'warning');
        }
        setBulkModalOpen(false);
        setBulkFile(null);
        fetchTab();
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Bulk upload failed', 'error');
    } finally {
      setBulkUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const res = await apiClient.get('/admin/eduskills-mentors/download-template/', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mentors_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Template downloaded successfully', 'success');
    } catch (err) {
      showToast('Failed to download template', 'error');
    }
  };

  const filtered = data.filter(item => {
    if (!search) return true;
    const term = search.toLowerCase();
    const textStr = (item.name || item.title || item.role || item.company || item.desc || '').toLowerCase();
    return textStr.includes(term);
  });

  return (
    <div className="admin-animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>EduSkills Ecosystem</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            Manage all live Mentors, Domains, Projects, and Tracks cards shown in the Learning Hub.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {activeTab === 'mentors' && (
            <button onClick={() => setBulkModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.25)'; }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Bulk Upload
            </button>
          )}
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #10b981, #00e5ff)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.45)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add {activeTab.substring(0, activeTab.length - 1)}
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'mentors', label: 'Mentors' },
          { key: 'domains', label: 'Placement Domains' }
        ].map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSearch(''); }} style={{
            padding: '0.6rem 1.2rem',
            border: 'none',
            background: activeTab === t.key ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
            color: activeTab === t.key ? '#10b981' : 'rgba(255,255,255,0.45)',
            borderBottom: activeTab === t.key ? '2px solid #10b981' : 'none',
            fontWeight: '700',
            fontSize: '0.88rem',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '380px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activeTab}…`} style={{ ...inputCls, paddingLeft: '2.4rem', paddingRight: search ? '2rem' : '1rem' }}
          onFocus={e => e.target.style.borderColor = '#10b981'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35vh', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16,185,129,0.15)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>No {activeTab} found.</p>
          <button onClick={openAdd} style={{ padding: '0.65rem 1.5rem', background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Create first one</button>
        </div>
      ) : (
        /* Data lists customized by active tab */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((item, idx) => (
            <div key={item.id} className="admin-glass-card admin-animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', borderLeft: `3px solid ${item.is_active ? '#10b981' : 'rgba(255,255,255,0.1)'}` }}>
              
              {/* Card top banner/info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: '800', color: 'white', fontSize: '1.05rem', lineHeight: '1.3' }}>
                  {item.name || item.title}
                </div>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', background: item.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: item.is_active ? '#10b981' : 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Tab specific properties */}
              {activeTab === 'mentors' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                  <div>💼 <strong>Role:</strong> {item.role} @ {item.company}</div>
                  <div>⚡ <strong>Experience:</strong> {item.exp}</div>
                  <div>🏷️ <strong>Category:</strong> {item.tag}</div>
                  {item.email && <div>📧 <strong>Email:</strong> {item.email}</div>}
                  <div>🔢 <strong>Order Index:</strong> {item.order}</div>
                </div>
              )}

              {activeTab === 'domains' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{item.desc}</p>
                  <div>🏷️ <strong>Icon:</strong> {item.icon}</div>
                  {item.badge && <div>⭐ <strong>Badge:</strong> {item.badge}</div>}
                  <div>⏱️ <strong>Duration:</strong> {item.duration}</div>
                  <div>💰 <strong>Salary:</strong> {item.salary}</div>
                  <div>📈 <strong>Status (Fallback):</strong> {item.status}</div>
                  <div>⚙️ <strong>Subpage Custom JSON:</strong> {item.details_json ? 'Configured ✅' : 'Default Fallback ⚠️'}</div>
                  <div>🖼️ <strong>Curriculum Image:</strong> {item.curriculum_image ? 'Uploaded ✅' : 'None ❌'}</div>
                  <div>🔢 <strong>Order Index:</strong> {item.order}</div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.desc}</p>
                  <div>📶 <strong>Complexity:</strong> {item.complexity}</div>
                  <div>⏱️ <strong>Duration:</strong> {item.duration}</div>
                  <div>🛠️ <strong>Stack:</strong> {item.stack}</div>
                  {item.mentor && <div>🎓 <strong>Mentor:</strong> {item.mentor}</div>}
                  <div>🔢 <strong>Order Index:</strong> {item.order}</div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                <button onClick={() => toggleField(item, 'is_active')} style={{ flex: 1, padding: '0.45rem 0', background: item.is_active ? 'rgba(239,68,68,0.07)' : 'rgba(16,185,129,0.1)', color: item.is_active ? '#ef4444' : '#10b981', border: `1px solid ${item.is_active ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.2)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                  {item.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => openEdit(item)} style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(79,156,255,0.1)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.18)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Modal */}
      {modalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, padding: '2rem 1rem', overflowY: 'auto' }} onClick={() => setModalOpen(false)}>
          <div className="admin-animate-scale-in" style={{ width: '100%', maxWidth: '560px', background: '#0a0e1c', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
                {editingId ? 'Edit' : 'Add New'} {activeTab.substring(0, activeTab.length - 1)}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Form rendering conditional on activeTab */}
              {activeTab === 'mentors' && (
                <>
                  <Field label="Mentor Name">
                    <input style={inputCls} required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Elena Rodriguez" />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Role Title">
                      <input style={inputCls} required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Chief Technology Officer" />
                    </Field>
                    <Field label="Company">
                      <input style={inputCls} required value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="e.g. Stripe" />
                    </Field>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Experience (String)">
                      <input style={inputCls} required value={form.exp} onChange={e => setForm(p => ({ ...p, exp: e.target.value }))} placeholder="e.g. 14 yrs" />
                    </Field>
                    <Field label="Category Tag">
                      <select style={inputCls} required value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}>
                        <option value="">Select a category...</option>
                        <option value="AI / ML">AI / ML</option>
                        <option value="Fullstack">Fullstack</option>
                        <option value="Cyber">Cyber</option>
                        <option value="Data">Data</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Others">Others</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Email Address">
                    <input style={inputCls} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="e.g. mentor.mehta@gmail.com (optional)" />
                  </Field>
                </>
              )}

              {activeTab === 'domains' && (
                <>
                  {/* Curriculum Image upload */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
                    <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {previewUrl ? (
                        <img src={previewUrl} alt="Curriculum Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1.5rem' }}>📷</span>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.40rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Curriculum Image (Optional)</label>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                        Choose Image
                        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                      </label>
                      {imageFile && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{imageFile.name}</span>}
                    </div>
                  </div>

                  <Field label="Domain Title">
                    <input style={inputCls} required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. AI & Data Science" />
                  </Field>
                  <Field label="Short Description">
                    <input style={inputCls} required value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="e.g. Focus on building and training machine learning algorithms..." />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Duration">
                      <input style={inputCls} required value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 9 mo" />
                    </Field>
                    <Field label="Salary (e.g. LPA range)">
                      <input style={inputCls} required value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="e.g. ₹8-32 LPA" />
                    </Field>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Icon Class (e.g. brain, shield, code, gear, flight, biotech, wrench, building, cpu, bolt)">
                      <select style={inputCls} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
                        <option value="brain">Brain (AI & Data Science)</option>
                        <option value="shield">Shield (Cybersecurity)</option>
                        <option value="code">Code (Fullstack Dev)</option>
                        <option value="gear">Gear (Robotics)</option>
                        <option value="flight">Flight (Drone Tech)</option>
                        <option value="biotech">Biotech (Biotechnology)</option>
                        <option value="wrench">Wrench (Mechanical)</option>
                        <option value="building">Building (Civil & Smart City)</option>
                        <option value="cpu">CPU (IoT & Industry 4.0)</option>
                        <option value="bolt">Bolt (EV Technology)</option>
                      </select>
                    </Field>
                    <Field label="Card Badge (optional)">
                      <input style={inputCls} value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} placeholder="e.g. MOST POPULAR or NEW" />
                    </Field>
                  </div>
                  <Field label="Mentor Category (matches mentors with this category)">
                    <select style={inputCls} value={form.category || ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      <option value="">No specific category</option>
                      <option value="AI / ML">AI / ML</option>
                      <option value="Fullstack">Fullstack</option>
                      <option value="Cyber">Cyber</option>
                      <option value="Data">Data</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Robotics">Robotics</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Others">Others</option>
                    </select>
                  </Field>
                  <Field label="Placement Status (Legacy / Fallback)">
                    <input style={inputCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} placeholder="e.g. 92% placed" />
                  </Field>
                </>
              )}

              {activeTab === 'projects' && (
                <>
                  <Field label="Project Name">
                    <input style={inputCls} required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. AI Financial Auditor" />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Complexity">
                      <select style={inputCls} value={form.complexity} onChange={e => setForm(p => ({ ...p, complexity: e.target.value }))}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Pro">Pro</option>
                      </select>
                    </Field>
                    <Field label="Duration">
                      <input style={inputCls} required value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 8 weeks" />
                    </Field>
                  </div>
                  <Field label="Tech Stack (Comma Separated)">
                    <input style={inputCls} required value={form.stack} onChange={e => setForm(p => ({ ...p, stack: e.target.value }))} placeholder="e.g. Python, LangChain, FastAPI" />
                  </Field>
                  <Field label="Assigned Mentor Name">
                    <input style={inputCls} value={form.mentor} onChange={e => setForm(p => ({ ...p, mentor: e.target.value }))} placeholder="e.g. Dr. Alistair Vance (optional)" />
                  </Field>
                  <Field label="Project Description">
                    <textarea style={{ ...inputCls, minHeight: '90px', resize: 'vertical' }} required value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Explain the project objectives and milestones..." />
                  </Field>
                </>
              )}

              {/* Order index (Shared field) */}
              <Field label="Display Sorting Order Index (Lower displays first)">
                <input style={inputCls} type="number" min="0" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
              </Field>

              {/* Active / Publish toggle (Shared field) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <label style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Publish Immediately (Active)</label>
                <button type="button" onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))} style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.is_active ? 'linear-gradient(135deg, #10b981, #00e5ff)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
                  <span style={{ position: 'absolute', top: '3px', left: form.is_active ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              {/* Form buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #10b981, #00e5ff)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 16px rgba(16,185,129,0.35)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.5)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.35)'; }}>
                  {editingId ? 'Save Changes' : `Create ${activeTab.substring(0, activeTab.length - 1)}`}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Bulk Upload Modal */}
      {bulkModalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '2rem 1rem' }} onClick={() => setBulkModalOpen(false)}>
          <div className="admin-animate-scale-in" style={{ width: '100%', maxWidth: '520px', background: '#0a0e1c', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            
            {/* Close button */}
            <button onClick={() => setBulkModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', width: '32px', height: '32px', borderRadius: '50%', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
              ×
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', margin: '0 0 0.5rem', fontFamily: 'Outfit, sans-serif' }}>Bulk Upload Mentors</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', margin: '0 0 2rem', lineHeight: '1.5' }}>
              Upload multiple mentors at once using a CSV file. Download the template to see the required format.
            </p>

            <form onSubmit={handleBulkUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Download Template */}
              <div style={{ padding: '1.25rem', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <span style={{ color: '#8b5cf6', fontWeight: '700', fontSize: '0.9rem' }}>CSV Template</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: '0 0 1rem', lineHeight: '1.5' }}>
                  Download the template with example data and required column headers.
                </p>
                <button type="button" onClick={downloadTemplate} style={{ padding: '0.6rem 1.2rem', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', width: '100%', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)'; }}>
                  Download Template CSV
                </button>
              </div>

              {/* File Upload */}
              <Field label="Upload CSV File">
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                  style={{ ...inputCls, padding: '0.85rem 1rem', cursor: 'pointer' }}
                />
                {bulkFile && (
                  <p style={{ color: '#10b981', fontSize: '0.82rem', margin: '0.5rem 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {bulkFile.name}
                  </p>
                )}
              </Field>

              {/* CSV Format Info */}
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: 0, lineHeight: '1.6' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Required columns:</strong> name, role, company<br/>
                  <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Optional columns:</strong> exp, tag, email, order, is_active<br/>
                  <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Category (tag) options:</strong> AI / ML, Fullstack, Cyber, Data, Cloud, Robotics, Design, Marketing, Others<br/>
                  <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Order:</strong> Leave empty for auto-increment
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setBulkModalOpen(false)} style={{ flex: 1, padding: '0.85rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                  Cancel
                </button>
                <button type="submit" disabled={!bulkFile || bulkUploading} style={{ flex: 1, padding: '0.85rem', background: bulkFile && !bulkUploading ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' : 'rgba(255,255,255,0.08)', color: bulkFile && !bulkUploading ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '12px', cursor: bulkFile && !bulkUploading ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '0.9rem', boxShadow: bulkFile && !bulkUploading ? '0 4px 16px rgba(139, 92, 246, 0.3)' : 'none' }}>
                  {bulkUploading ? 'Uploading...' : 'Upload Mentors'}
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

export default AdminEduSkills;
