import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const EMPTY = {
  username: '', email: '', password: '', first_name: '', last_name: '', is_staff: true, is_active: true
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

const AdminUsers = () => {
  const [users, setUsers] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_users');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_users');
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

  const fetchUsers = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_users');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/users/');
      setUsers(res.data);
      localStorage.setItem('hadescore_cache_admin_users', JSON.stringify(res.data));
    } catch {
      showToast('Failed to load users', 'error');
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => {
    if (users && users.length > 0) {
      localStorage.setItem('hadescore_cache_admin_users', JSON.stringify(users));
    } else {
      localStorage.removeItem('hadescore_cache_admin_users');
    }
  }, [users]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingId(u.id);
    setForm({
      username: u.username,
      email: u.email || '',
      password: '', // Leave empty unless resetting
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      is_staff: u.is_staff,
      is_active: u.is_active
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) {
      showToast('Username is required', 'error');
      return;
    }
    if (!editingId && !form.password) {
      showToast('Password is required for new users', 'error');
      return;
    }

    const payload = { ...form };
    if (editingId && !payload.password) {
      delete payload.password; // Do not send empty password on edit
    }

    try {
      if (editingId) {
        await apiClient.patch(`/admin/users/${editingId}/`, payload);
        showToast('User updated successfully', 'success');
      } else {
        await apiClient.post('/admin/users/', payload);
        showToast('User created successfully', 'success');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      const errorData = err.response?.data;
      const msg = errorData ? Object.entries(errorData).map(([k, v]) => `${k}: ${v}`).join(' | ') : 'Save failed';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id, usernameVal, emailVal) => {
    if (usernameVal === 'sales_admin' || emailVal === 'hadescore.apex.technologies@gmail.com') {
      showToast('Main admin account cannot be deleted', 'error');
      return;
    }
    if (window.confirm(`Delete user "${usernameVal}" permanently?`)) {
      try {
        await apiClient.delete(`/admin/users/${id}/`);
        showToast('User deleted', 'success');
        fetchUsers();
      } catch { showToast('Delete failed', 'error'); }
    }
  };

  const filtered = users.filter(u =>
    !search || 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.last_name || '').toLowerCase().includes(search.toLowerCase())
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>System Users</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            {users.filter(u => u.is_staff).length} staff / admins · {users.length} total users
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #4f9cff, #a855f7)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(79,156,255,0.3)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,156,255,0.45)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,156,255,0.3)'; }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add User
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '380px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users…"
          style={{ ...inputCls, paddingLeft: '2.4rem', paddingRight: search ? '2rem' : '1rem' }}
          onFocus={e => e.target.style.borderColor = '#4f9cff'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
      </div>

      {/* Table view */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>No users found matching the search criteria.</p>
        </div>
      ) : (
        <div className="admin-table-scroll-wrapper" style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,12,24,0.7)', backdropFilter: 'blur(12px)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Username</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Email Address</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Full Name</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Can Log In (Staff)</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Active status</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Date Joined</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem', color: 'white', fontWeight: '700', fontSize: '0.88rem' }}>{u.username}</td>
                  <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{u.email || '—'}</td>
                  <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>
                    {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}`.trim() : '—'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
                      background: u.is_staff ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                      color: u.is_staff ? '#10b981' : '#ef4444',
                    }}>{u.is_staff ? 'Yes' : 'No'}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
                      background: u.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                      color: u.is_active ? '#10b981' : '#ef4444',
                    }}>{u.is_active ? 'Active' : 'Suspended'}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
                    {new Date(u.date_joined).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => openEdit(u)} style={{ padding: '0.35rem 0.8rem', marginRight: '0.4rem', background: 'rgba(79,156,255,0.1)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>Edit</button>
                    {u.username !== 'sales_admin' && u.email !== 'hadescore.apex.technologies@gmail.com' ? (
                      <button onClick={() => handleDelete(u.id, u.username, u.email)} style={{ padding: '0.35rem 0.8rem', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>Delete</button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', paddingRight: '0.5rem' }}>System Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && createPortal(
        <div
          className="admin-modal-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="admin-animate-scale-in admin-modal-panel"
            style={{ width: '100%', maxWidth: '520px', background: '#0a0e1c', border: '1px solid rgba(79,156,255,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #4f9cff, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
                {editingId ? 'Edit User' : 'New System User'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Username */}
              <Field label="Username">
                <input required style={inputCls} value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value.trim() }))}
                  placeholder="e.g. janesmith"
                />
              </Field>

              {/* Email */}
              <Field label="Email Address">
                <input type="email" style={inputCls} value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value.trim() }))}
                  placeholder="e.g. jane@hadescore.com"
                />
              </Field>

              {/* First Name & Last Name */}
              <div className="admin-modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="First Name">
                  <input style={inputCls} value={form.first_name}
                    onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
                    placeholder="Jane"
                  />
                </Field>
                <Field label="Last Name">
                  <input style={inputCls} value={form.last_name}
                    onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
                    placeholder="Smith"
                  />
                </Field>
              </div>

              {/* Password */}
              <Field label={editingId ? "New Password (leave blank to keep current)" : "Password"}>
                <input type="password" required={!editingId} style={inputCls} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder={editingId ? "••••••••" : "Choose a secure password"}
                />
              </Field>

              {/* Status checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Is Staff (Authorized for Admin Portal)</label>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, is_staff: !p.is_staff }))}
                    style={{ width: '40px', height: '22px', borderRadius: '11px', background: form.is_staff ? 'linear-gradient(135deg, #4f9cff, #a855f7)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}
                  >
                    <span style={{ position: 'absolute', top: '2px', left: form.is_staff ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Active Status</label>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                    style={{ width: '40px', height: '22px', borderRadius: '11px', background: form.is_active ? 'linear-gradient(135deg, #4f9cff, #a855f7)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}
                  >
                    <span style={{ position: 'absolute', top: '2px', left: form.is_active ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
                  </button>
                </div>
              </div>

              {/* Submit / Cancel buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #4f9cff, #a855f7)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 16px rgba(79,156,255,0.35)', transition: 'all 0.2s' }}
                >
                  {editingId ? 'Save Changes' : 'Create User'}
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

export default AdminUsers;
