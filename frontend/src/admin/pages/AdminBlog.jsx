import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const MEDIA = `http://${window.location.hostname}:8000`;

const EMPTY = {
  title: '', slug: '', content: '', author: 'Admin', is_published: true, published_at: '', github_url: '', live_url: ''
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

const AdminBlog = () => {
  const [posts, setPosts] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_blogs');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_blogs');
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

  const fetchPosts = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_blogs');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/blogs/');
      setPosts(res.data);
      localStorage.setItem('hadescore_cache_admin_blogs', JSON.stringify(res.data));
    } catch {
      showToast('Failed to load blog posts', 'error');
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      localStorage.setItem('hadescore_cache_admin_blogs', JSON.stringify(posts));
    } else {
      localStorage.removeItem('hadescore_cache_admin_blogs');
    }
  }, [posts]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY, published_at: new Date().toISOString().substring(0, 16) });
    setImageFile(null);
    setPreviewUrl(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      content: p.content,
      author: p.author || 'Admin',
      is_published: p.is_published,
      published_at: p.published_at ? new Date(p.published_at).toISOString().substring(0, 16) : '',
      github_url: p.github_url || '',
      live_url: p.live_url || ''
    });
    setImageFile(null);
    setPreviewUrl(p.cover_image ? `${MEDIA}${p.cover_image}` : null);
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
      if (k === 'published_at' && v) {
        fd.append(k, new Date(v).toISOString());
      } else {
        fd.append(k, v);
      }
    });
    if (imageFile) fd.append('cover_image', imageFile);

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
    try {
      if (editingId) {
        await apiClient.patch(`/admin/blogs/${editingId}/`, fd, cfg);
        showToast('Blog post updated', 'success');
      } else {
        await apiClient.post('/admin/blogs/', fd, cfg);
        showToast('Blog post created', 'success');
      }
      setModalOpen(false);
      fetchPosts();
    } catch (err) {
      showToast(err.response?.data ? JSON.stringify(err.response.data) : 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post permanently?')) return;
    try {
      await apiClient.delete(`/admin/blogs/${id}/`);
      showToast('Blog post deleted', 'success');
      fetchPosts();
    } catch { showToast('Delete failed', 'error'); }
  };

  const togglePublished = async (p) => {
    try {
      await apiClient.patch(`/admin/blogs/${p.id}/`, { is_published: !p.is_published });
      setPosts(prev => prev.map(x => x.id === p.id ? { ...x, is_published: !x.is_published } : x));
      showToast(`Post ${!p.is_published ? 'published' : 'drafted'}`, 'success');
    } catch { showToast('Status update failed', 'error'); }
  };

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.author || '').toLowerCase().includes(search.toLowerCase())
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Blog & Announcements</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            {posts.filter(p => p.is_published).length} published · {posts.length} total — manage news and technical insights
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(0,229,255,0.3)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,229,255,0.45)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,229,255,0.3)'; }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Write Post
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '380px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search articles…"
          style={{ ...inputCls, paddingLeft: '2.4rem', paddingRight: search ? '2rem' : '1rem' }}
          onFocus={e => e.target.style.borderColor = '#00e5ff'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>No blog posts found. Create your first post.</p>
          <button onClick={openAdd} style={{ padding: '0.65rem 1.5rem', background: 'rgba(0,229,255,0.12)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Create first post</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.map((p, idx) => (
            <div key={p.id} className="admin-glass-card admin-glass-card-glow-cyan admin-animate-fade-in" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', animationDelay: `${idx * 0.05}s` }}>
              {/* Cover Image Preview */}
              <div style={{ height: '140px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                {p.cover_image ? (
                  <img src={`${MEDIA}${p.cover_image}`} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.15)', fontSize: '2.5rem' }}>📷</div>
                )}
                <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', background: p.is_published ? 'rgba(16,185,129,0.85)' : 'rgba(0,0,0,0.6)', color: 'white' }}>
                  {p.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Title & Info */}
              <div>
                <h3 style={{ margin: 0, fontWeight: '700', color: 'white', fontSize: '1rem', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  <span>By {p.author}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {p.github_url && <span title="GitHub Link Configured">🐙</span>}
                    {p.live_url && <span title="Live Link Configured">🔗</span>}
                    <span>{new Date(p.published_at || p.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Text Snippet */}
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {p.content.replace(/<[^>]*>/g, '')}
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  onClick={() => togglePublished(p)}
                  style={{ flex: 1, padding: '0.45rem 0', background: p.is_published ? 'rgba(239,68,68,0.07)' : 'rgba(16,185,129,0.1)', color: p.is_published ? '#ef4444' : '#10b981', border: `1px solid ${p.is_published ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.2)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                >
                  {p.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => openEdit(p)}
                  style={{ flex: 1, padding: '0.45rem 0', background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.18)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                >Edit</button>
                <button
                  onClick={() => handleDelete(p.id)}
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
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, padding: '2rem 1rem', overflowY: 'auto' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="admin-animate-scale-in"
            style={{ width: '100%', maxWidth: '750px', background: '#0a0e1c', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>{editingId ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Cover Image upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {previewUrl
                    ? <img src={previewUrl} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1.5rem' }}>📷</span>
                  }
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.40rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cover Image</label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                  </label>
                  {imageFile && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{imageFile.name}</span>}
                </div>
              </div>

              {/* Title */}
              <Field label="Post Title">
                <input required style={inputCls} value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Introducing Hadescore Tech Stack v2.0"
                />
              </Field>

              {/* Slug & Author & Date Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <Field label="URL Slug (leave blank to auto-generate)">
                  <input style={inputCls} value={form.slug}
                    onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') }))}
                    placeholder="e.g. tech-stack-v2"
                  />
                </Field>

                <Field label="Author Name">
                  <input required style={inputCls} value={form.author}
                    onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                  />
                </Field>

                <Field label="Publish Date">
                  <input type="datetime-local" style={inputCls} value={form.published_at}
                    onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))}
                  />
                </Field>
              </div>

              {/* GitHub & Live Links Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="GitHub Repo URL (Optional)">
                  <input style={inputCls} type="url" value={form.github_url || ''}
                    onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </Field>
                <Field label="Live Demo / Project URL (Optional)">
                  <input style={inputCls} type="url" value={form.live_url || ''}
                    onChange={e => setForm(p => ({ ...p, live_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </Field>
              </div>

              {/* Content Textarea */}
              <Field label="Content (HTML or Markdown formatting supported)">
                <textarea required style={{ ...inputCls, minHeight: '260px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.6' }}
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Write the full post here. You can use standard HTML elements like <p>, <h3>, <ul>, <li>, <strong>, etc."
                />
              </Field>

              {/* Status checkboxes */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <label style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Publish Article Immediately</label>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
                  style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.is_published ? 'linear-gradient(135deg, #00e5ff, #8b5cf6)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}
                >
                  <span style={{ position: 'absolute', top: '3px', left: form.is_published ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              {/* Submit / Cancel buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 16px rgba(0,229,255,0.35)', transition: 'all 0.2s' }}
                >
                  {editingId ? 'Save Article' : 'Create Article'}
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

export default AdminBlog;
