import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

/* ── helpers ── */
const fmt = (val, key) => {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean')
    return (
      <span style={{
        padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
        background: val ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
        color: val ? '#10b981' : '#ef4444',
      }}>{val ? 'Yes' : 'No'}</span>
    );
  if (typeof val === 'string' && (key?.includes('email')))
    return <a href={`mailto:${val}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4f9cff', textDecoration: 'none' }}>{val}</a>;
  if (key === 'resume' && val) {
    const filename = val.split('/').pop();
    return <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: '#4f9cff', textDecoration: 'underline' }}>{filename || 'Download'}</a>;
  }
  if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/))
    return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  if (typeof val === 'object') return JSON.stringify(val).substring(0, 60) + '…';
  if (typeof val === 'string' && val.length > 60) return val.substring(0, 60) + '…';
  return String(val);
};

const fmtFull = (val, key) => {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (key === 'resume' && val) {
    const filename = val.split('/').pop();
    return <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: '#4f9cff', textDecoration: 'underline' }}>{filename || 'Download'}</a>;
  }
  if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/))
    return new Date(val).toLocaleString();
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
};

/* ── sub-components ── */
const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#4f9cff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>Loading…</span>
  </div>
);

const DetailModal = ({ item, columns, onClose, onUpdateStatus }) => {
  const hasStatus = 'status' in item;
  const emailVal = item.email || item.user_email;
  
  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#0d1020', border: '1px solid rgba(79,156,255,0.15)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto', animation: 'detailIn 0.3s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes detailIn{from{opacity:0;transform:scale(0.95) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>Record #{item.id}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>×</button>
        </div>
        
        {/* Quick actions panel */}
        {(hasStatus || emailVal) && (
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.85rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {hasStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Status:</span>
                <select
                  value={item.status || 'pending'}
                  onChange={e => onUpdateStatus(item.id, e.target.value)}
                  style={{
                    background: '#0d1020', border: '1px solid rgba(79,156,255,0.3)',
                    borderRadius: '8px', color: 'white', fontSize: '0.8rem', padding: '0.3rem 0.5rem', outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
            {emailVal && (
              <a
                href={`mailto:${emailVal}?subject=Response regarding your inquiry`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.4rem 0.8rem', background: 'rgba(79,156,255,0.15)', color: '#4f9cff',
                  border: '1px solid rgba(79,156,255,0.25)', borderRadius: '8px', fontSize: '0.78rem',
                  fontWeight: '600', textDecoration: 'none'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                Reply via Email
              </a>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {['id', ...columns].map(col => (
            <div key={col} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'flex-start', paddingTop: '1px' }}>{col.replace(/_/g, ' ')}</span>
              <span style={{ fontSize: '0.88rem', color: 'white', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{fmtFull(item[col], col)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ── main component ── */
const ResourceListView = ({ resource, title, onDeleteSuccess }) => {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(`hadescore_cache_admin_${resource}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(`hadescore_cache_admin_${resource}`);
      return !cached;
    } catch {
      return true;
    }
  });
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const showToast = useToast();
  const navigate = useNavigate();

  const fetchResource = useCallback(async (silent = false) => {
    const cached = localStorage.getItem(`hadescore_cache_admin_${resource}`);
    if (!silent && !cached) setLoading(true);
    try {
      const res = await apiClient.get(`/admin/${resource}/`);
      setData(res.data);
      localStorage.setItem(`hadescore_cache_admin_${resource}`, JSON.stringify(res.data));
      if (silent) showToast(`${title} refreshed`, 'success');
    } catch (err) {
      showToast(`Failed to load ${title}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [resource, title]);

  useEffect(() => {
    if (data && data.length > 0) {
      localStorage.setItem(`hadescore_cache_admin_${resource}`, JSON.stringify(data));
    } else {
      localStorage.removeItem(`hadescore_cache_admin_${resource}`);
    }
  }, [data, resource]);

  useEffect(() => { fetchResource(); }, [fetchResource]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record permanently?')) return;
    try {
      await apiClient.delete(`/admin/${resource}/${id}/`);
      showToast('Deleted', 'success');
      fetchResource(true);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch { showToast('Delete failed', 'error'); }
  };

  const handleMarkRead = async (id) => {
    try {
      await apiClient.post(`/admin/${resource}/${id}/mark-read/`);
      setData(prev => prev.map(r => r.id === id ? { ...r, is_read: true } : r));
    } catch { showToast('Could not mark as read', 'error'); }
  };

  const handleUpdateStatus = async (id, statusVal) => {
    try {
      await apiClient.patch(`/admin/${resource}/${id}/`, { status: statusVal });
      setData(prev => prev.map(r => r.id === id ? { ...r, status: statusVal } : r));
      if (detailItem && detailItem.id === id) {
        setDetailItem(prev => ({ ...prev, status: statusVal }));
      }
      showToast(`Status updated to ${statusVal}`, 'success');
    } catch { showToast('Could not update status', 'error'); }
  };

  const handleMarkAllRead = async () => {
    const unread = data.filter(r => r.is_read === false);
    if (unread.length === 0) return;
    try {
      await apiClient.post(`/admin/${resource}/mark-all-read/`);
      setData(prev => prev.map(r => ({ ...r, is_read: true })));
      showToast(`Marked ${unread.length} as read`, 'success');
    } catch { showToast('Some items failed', 'error'); }
  };

  const handleResetSequence = async () => {
    if (!window.confirm('Reset ID counter to #1? This only works when the list is completely empty.')) return;
    try {
      await apiClient.post(`/admin/${resource}/reset-sequence/`);
      showToast('ID counter reset to #1 ✓', 'success');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Reset failed';
      showToast(msg, 'error');
    }
  };

  const downloadCSV = () => {
    if (!data.length) { showToast('No data to export', 'info'); return; }
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(h => {
        let v = row[h];
        if (v === null || v === undefined) v = '';
        if (typeof v === 'object') v = JSON.stringify(v);
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `${resource}_${new Date().toISOString().split('T')[0]}.csv`,
      style: 'display:none',
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast('CSV downloaded', 'success');
  };

  if (loading) return <Spinner />;

  const columns = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'id') : [];
  const hasIsRead = data.some(r => 'is_read' in r);
  const unreadCount = hasIsRead ? data.filter(r => !r.is_read).length : 0;

  // search filter
  const filtered = data.filter(row =>
    !search.trim() ||
    Object.values(row).some(v =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    )
  );

  // sort
  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const av = a[sortCol] ?? ''; const bv = b[sortCol] ?? '';
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      })
    : filtered;

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  return (
    <div className="admin-animate-fade-in">

      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>{title}</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            {filtered.length} of {data.length} records{unreadCount > 0 ? ` · ${unreadCount} unread` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} style={{ padding: '0.55rem 1rem', background: 'rgba(79,156,255,0.1)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>
              Mark all read ({unreadCount})
            </button>
          )}
          <button onClick={() => fetchResource(true)} style={{ padding: '0.55rem 1rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
          <button onClick={downloadCSV} style={{ padding: '0.55rem 1rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '400px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#4f9cff'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>
        )}
      </div>

      {/* Empty state */}
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h3 style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>No {title.toLowerCase()} yet</h3>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Records will appear here once submitted.</p>
          <button
            onClick={handleResetSequence}
            style={{ padding: '0.55rem 1.25rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
            Reset IDs to #1
          </button>
        </div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
          No results match "<strong style={{ color: 'white' }}>{search}</strong>"
        </div>
      ) : (
        <>
          <style>{`
            .admin-table-wrapper { display: block; }
            .admin-card-list { display: none; }
            @media (max-width: 768px) {
              .admin-table-wrapper { display: none !important; }
              .admin-card-list { display: flex !important; }
            }
          `}</style>

          {/* Desktop: Table view */}
          <div className="admin-table-wrapper" style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,12,24,0.7)', backdropFilter: 'blur(12px)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
                    onClick={() => handleSort('id')}>
                    ID {sortCol === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  {columns.map(col => (
                    <th key={col}
                      style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort(col)}
                    >
                      {col.replace(/_/g, ' ')} {sortCol === col && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                  ))}
                  <th style={{ padding: '1rem', textAlign: 'right', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((item, idx) => {
                  const isUnread = 'is_read' in item && !item.is_read;
                  return (
                    <tr key={item.id}
                      className={`admin-table-row admin-animate-fade-in admin-stagger-${(idx % 8) + 1}`}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: isUnread ? 'rgba(79,156,255,0.05)' : 'transparent',
                        borderLeft: isUnread ? '2px solid #4f9cff' : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setDetailItem(item)}
                    >
                      <td style={{ padding: '0.9rem 1rem', color: '#4f9cff', fontWeight: '700', fontSize: '0.85rem' }}>
                        #{item.id}
                        {isUnread && <span style={{ marginLeft: '6px', display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', verticalAlign: 'middle' }} />}
                      </td>
                      {columns.map(col => (
                        <td key={col} style={{ padding: '0.9rem 1rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{fmt(item[col], col)}</td>
                      ))}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        {'status' in item && (
                          <select
                            value={item.status || 'pending'}
                            onChange={e => handleUpdateStatus(item.id, e.target.value)}
                            style={{
                              background: '#0d1020', border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem',
                              padding: '0.25rem 0.4rem', marginRight: '0.4rem', outline: 'none', cursor: 'pointer'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        )}
                        {isUnread && (
                          <button onClick={() => handleMarkRead(item.id)} style={{ padding: '0.3rem 0.7rem', marginRight: '0.4rem', background: 'rgba(79,156,255,0.1)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '7px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>✓ Read</button>
                        )}
                        {(item.email || item.user_email) && (
                          <a href={`mailto:${item.email || item.user_email}?subject=Response regarding your inquiry`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.3rem 0.7rem', marginRight: '0.4rem', background: 'rgba(79,156,255,0.12)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '7px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Reply</a>
                        )}
                        <button onClick={() => setDetailItem(item)} style={{ padding: '0.3rem 0.7rem', marginRight: '0.4rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>View</button>
                        <button onClick={() => handleDelete(item.id)} style={{ padding: '0.3rem 0.7rem', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '7px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card view */}
          <div className="admin-card-list" style={{ display: 'none', flexDirection: 'column', gap: '0.75rem' }}>
            {sorted.map((item, idx) => {
              const isUnread = 'is_read' in item && !item.is_read;
              const displayCols = columns.slice(0, 4); // Show first 4 columns
              return (
                <div
                  key={item.id}
                  className={`admin-animate-fade-in admin-stagger-${(idx % 8) + 1}`}
                  onClick={() => setDetailItem(item)}
                  style={{
                    background: isUnread ? 'rgba(79,156,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isUnread ? 'rgba(79,156,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '14px',
                    padding: '1rem 1.15rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Card header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#4f9cff', fontWeight: '800', fontSize: '0.82rem' }}>#{item.id}</span>
                      {isUnread && (
                        <span style={{ padding: '1px 8px', borderRadius: '999px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '0.68rem', fontWeight: '700' }}>NEW</span>
                      )}
                    </div>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>

                  {/* Card fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {displayCols.map(col => (
                      <div key={col}>
                        <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                          {col.replace(/_/g, ' ')}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {fmt(item[col], col)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card status and actions */}
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }} onClick={e => e.stopPropagation()}>
                    {'status' in item && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: '600', textTransform: 'uppercase' }}>Status:</span>
                        <select
                          value={item.status || 'pending'}
                          onChange={e => handleUpdateStatus(item.id, e.target.value)}
                          style={{
                            background: '#0d1020', border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '6px', color: 'white', fontSize: '0.78rem', padding: '0.2rem 0.4rem', outline: 'none', cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="contacted">Contacted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {isUnread && (
                        <button onClick={() => handleMarkRead(item.id)} style={{ flex: 1, padding: '0.45rem', background: 'rgba(79,156,255,0.1)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>✓ Read</button>
                      )}
                      {(item.email || item.user_email) && (
                        <a href={`mailto:${item.email || item.user_email}?subject=Response regarding your inquiry`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '0.45rem', background: 'rgba(79,156,255,0.12)', color: '#4f9cff', border: '1px solid rgba(79,156,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Reply</a>
                      )}
                      <button onClick={() => setDetailItem(item)} style={{ flex: 1, padding: '0.45rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>View</button>
                      <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '0.45rem', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Detail modal */}
      {detailItem && (
        <DetailModal item={detailItem} columns={columns} onClose={() => setDetailItem(null)} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
};

export default ResourceListView;
