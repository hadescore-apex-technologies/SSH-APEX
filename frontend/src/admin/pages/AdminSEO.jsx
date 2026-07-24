import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const MEDIA = `http://${window.location.hostname}:8000`;

const CORE_PAGES = [
  { key: 'home', label: 'Home Page' },
  { key: 'solutions', label: 'Solutions Page' },
  { key: 'services', label: 'Services Page' },
  { key: 'apex', label: 'Apex Innovation' },
  { key: 'eduskills', label: 'EduSkills Learning' },
  { key: 'careers', label: 'Careers & Jobs' },
  { key: 'products', label: 'Products Hub' },
  { key: 'about', label: 'About Us' },
  { key: 'blog', label: 'Blog Listing' },
];

const inputCls = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: 'white', fontSize: '0.88rem', outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s', fontFamily: 'inherit',
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '1.2rem' }}>
    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
  </div>
);

const AdminSEO = () => {
  const [seoList, setSeoList] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_seo');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_seo');
      return !cached;
    } catch {
      return true;
    }
  });
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', keywords: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const showToast = useToast();

  const fetchSeoSettings = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_seo');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/seo-settings/');
      setSeoList(res.data);
      localStorage.setItem('hadescore_cache_admin_seo', JSON.stringify(res.data));
    } catch {
      showToast('Failed to load SEO settings', 'error');
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchSeoSettings(); }, [fetchSeoSettings]);

  // Load selected page settings
  useEffect(() => {
    const matched = seoList.find(s => s.page_name === selectedPage);
    if (matched) {
      setForm({
        title: matched.title || '',
        description: matched.description || '',
        keywords: matched.keywords || ''
      });
      setPreviewUrl(matched.og_image ? `${MEDIA}${matched.og_image}` : null);
    } else {
      setForm({ title: '', description: '', keywords: '' });
      setPreviewUrl(null);
    }
    setImageFile(null);
  }, [selectedPage, seoList]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const matched = seoList.find(s => s.page_name === selectedPage);
    
    const fd = new FormData();
    fd.append('page_name', selectedPage);
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('keywords', form.keywords);
    if (imageFile) fd.append('og_image', imageFile);

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
    try {
      if (matched) {
        await apiClient.patch(`/admin/seo-settings/${matched.id}/`, fd, cfg);
        showToast('SEO settings updated', 'success');
      } else {
        await apiClient.post('/admin/seo-settings/', fd, cfg);
        showToast('SEO settings created', 'success');
      }
      fetchSeoSettings();
    } catch {
      showToast('Failed to save SEO settings', 'error');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="admin-animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-animate-fade-in { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Sidebar: Page list */}
      <div className="admin-glass-card admin-glass-card-glow-amber" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'white', margin: '0 0 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Dynamic Pages</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {CORE_PAGES.map(p => {
            const hasData = seoList.some(s => s.page_name === p.key);
            const active = selectedPage === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setSelectedPage(p.key)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 0.9rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '0.88rem', fontWeight: '600', textAlign: 'left',
                  background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
                  color: active ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                  borderLeft: active ? '3px solid #f59e0b' : '3px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <span>{p.label}</span>
                {hasData && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} title="SEO configured" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main editor form */}
      <div className="admin-glass-card admin-glass-card-glow-amber" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', margin: '0 0 0.5rem', fontFamily: 'Outfit, sans-serif' }}>
          SEO Meta Tags for <span style={{ color: '#f59e0b' }}>{CORE_PAGES.find(p => p.key === selectedPage)?.label}</span>
        </h2>
        <p style={{ margin: '0 0 1.5rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
          Customize head metadata tags. These settings improve Google search index ratings and social media share previews.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* SEO Title */}
          <Field label="Browser Tab Title (Meta Title)">
            <input required style={inputCls} value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Hadescore | Premium Software Development Services"
              onFocus={e => e.target.style.borderColor = '#f59e0b'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </Field>

          {/* Description */}
          <Field label="Search Snippet Description (Meta Description)">
            <textarea required style={{ ...inputCls, minHeight: '80px', resize: 'vertical' }}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Provide a search snippet description. Maximum length: 150-160 characters."
              onFocus={e => e.target.style.borderColor = '#f59e0b'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </Field>

          {/* Keywords */}
          <Field label="Keywords (Comma separated)">
            <input style={inputCls} value={form.keywords}
              onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))}
              placeholder="software, development, AI, cybersecurity, startup, cloud, innovation"
              onFocus={e => e.target.style.borderColor = '#f59e0b'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </Field>

          {/* Open Graph Image */}
          <Field label="Open Graph Share Image (OG Image)">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '150px', height: '90px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {previewUrl
                  ? <img src={previewUrl} alt="OG Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1.5rem' }}>📷</span>
                }
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>OG Image (Recommended 1200 x 630 px)</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                </label>
                {imageFile && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{imageFile.name}</span>}
              </div>
            </div>
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white',
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
              boxShadow: '0 4px 16px rgba(245,158,11,0.25)', transition: 'all 0.2s', marginTop: '1rem', alignSelf: 'flex-start'
            }}
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSEO;
