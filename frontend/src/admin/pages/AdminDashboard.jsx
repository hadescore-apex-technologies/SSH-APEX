import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const colorToGlowClass = (color) => {
  if (color === '#4f9cff') return 'admin-glass-card-glow-blue';
  if (color === '#a855f7' || color === '#8b5cf6') return 'admin-glass-card-glow-purple';
  if (color === '#00e5ff' || color === '#06b6d4') return 'admin-glass-card-glow-cyan';
  if (color === '#10b981') return 'admin-glass-card-glow-green';
  if (color === '#f59e0b') return 'admin-glass-card-glow-amber';
  if (color === '#f43f5e') return 'admin-glass-card-glow-rose';
  return 'admin-glass-card-glow-blue';
};

const StatCard = ({ label, value, sub, color, icon, onClick, index }) => {
  const glowClass = colorToGlowClass(color);
  return (
    <div
      onClick={onClick}
      className={`admin-glass-card ${glowClass} admin-animate-fade-in admin-stagger-${(index % 8) + 1}`}
      style={{
        padding: '1rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`, borderRadius: '0 16px 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '0.3rem', fontFamily: 'Outfit, sans-serif' }}>{value ?? '—'}</div>
      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub != null && (
        <div style={{ marginTop: '0.35rem', fontSize: '0.72rem', color: color, fontWeight: '600' }}>
          {sub > 0 ? `+${sub}` : sub} this week
        </div>
      )}
    </div>
  );
};

const RecentRow = ({ item, type, onMarkRead, onNavigate, index }) => {
  const isUnread = item.is_read === false;
  return (
    <div
      className={`admin-table-row admin-animate-fade-in admin-stagger-${(index % 5) + 1}`}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        background: isUnread ? 'rgba(79,156,255,0.06)' : 'transparent',
        borderLeft: isUnread ? '2px solid #4f9cff' : '2px solid transparent',
        gap: '1rem',
        cursor: 'pointer',
      }}
      onClick={onNavigate}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #4f9cff22, #a855f722)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#4f9cff', fontWeight: '800', fontSize: '0.9rem',
        }}>
          {(item.name || item.user_email || '?')[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: '600', color: 'white', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.name || item.user_email}
            {isUnread && <span style={{ marginLeft: '6px', display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', verticalAlign: 'middle' }} />}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.subject || item.role_title || item.course_name || item.email || item.user_email}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {new Date(item.created_at || item.applied_at || item.enrolled_at).toLocaleDateString()}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_dashboard_stats');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_dashboard_stats');
      return !cached;
    } catch {
      return true;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/dashboard-stats/');
        setStats(res.data);
        localStorage.setItem('hadescore_cache_admin_dashboard_stats', JSON.stringify(res.data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid rgba(79,156,255,0.15)', borderTopColor: '#4f9cff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading dashboard…</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Contacts', value: stats?.total_contacts, sub: stats?.contacts_7d, color: '#4f9cff', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', path: '/admin/inbox' },
    { label: 'Applications', value: stats?.total_applications, sub: stats?.applications_7d, color: '#a855f7', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', path: '/admin/inbox' },
    { label: 'Enrollments', value: stats?.total_enrollments, sub: stats?.enrollments_7d, color: '#00e5ff', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', path: '/admin/inbox' },
    { label: 'Newsletter Subs', value: stats?.total_newsletters, sub: stats?.newsletters_30d, color: '#10b981', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', path: '/admin/inbox' },
    { label: 'Project Briefs', value: stats?.total_project_briefs, sub: null, color: '#f59e0b', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', path: '/admin/inbox' },
    { label: 'Active Careers', value: stats?.active_careers, sub: null, color: '#f43f5e', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', path: '/admin/careers' },
    { label: 'Team Leaders', value: stats?.total_leaders, sub: null, color: '#06b6d4', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', path: '/admin/leaders' },
  ];

  const unreadBadges = [
    { label: 'Unread Contacts', value: stats?.unread_contacts, color: '#4f9cff' },
    { label: 'Unread Applications', value: stats?.unread_applications, color: '#a855f7' },
    { label: 'Unread Enrollments', value: stats?.unread_enrollments, color: '#00e5ff' },
    { label: 'Unread Briefs', value: stats?.unread_briefs, color: '#f59e0b' },
  ];

  return (
    <div className="admin-animate-fade-in">
      <style>{`
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }
        .admin-activity-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1400px) {
          .admin-stats-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 1200px) {
          .admin-stats-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .admin-activity-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .admin-stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .admin-activity-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .admin-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .admin-activity-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 400px) {
          .admin-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="admin-page-title" style={{ fontSize: '1.9rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Unread alert strip */}
      {unreadBadges.some(b => b.value > 0) && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.75rem',
          padding: '1rem 1.25rem',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: '12px',
          alignItems: 'center',
        }}>
          <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '0.85rem', marginRight: '0.5rem' }}>⚠ Needs attention:</span>
          {unreadBadges.filter(b => b.value > 0).map(b => (
            <span key={b.label} style={{
              padding: '0.25rem 0.85rem', borderRadius: '9999px',
              background: b.color + '20', color: b.color,
              fontSize: '0.8rem', fontWeight: '700', border: `1px solid ${b.color}40`,
            }}>
              {b.value} {b.label}
            </span>
          ))}
        </div>
      )}

      {/* Stat grid */}
      <div className="admin-stats-grid">
        {statCards.map((c, index) => (
          <StatCard key={c.label} {...c} index={index} onClick={() => navigate(c.path)} />
        ))}
      </div>

      {/* Recent activity */}
      <div className="admin-activity-grid">
        {/* Recent Contacts */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'white', margin: 0 }}>Recent Contacts</h3>
            <button onClick={() => navigate('/admin/inbox')} style={{ fontSize: '0.75rem', color: '#4f9cff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {(stats?.recent_contacts || []).length === 0
              ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No contacts yet</p>
              : (stats.recent_contacts || []).map((c, idx) => (
                <RecentRow key={c.id} item={c} type="contact" index={idx} onNavigate={() => navigate('/admin/inbox')} />
              ))
            }
          </div>
        </div>

        {/* Recent Applications */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'white', margin: 0 }}>Recent Applications</h3>
            <button onClick={() => navigate('/admin/inbox')} style={{ fontSize: '0.75rem', color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {(stats?.recent_applications || []).length === 0
              ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No applications yet</p>
              : (stats.recent_applications || []).map((a, idx) => (
                <RecentRow key={a.id} item={a} type="application" index={idx} onNavigate={() => navigate('/admin/inbox')} />
              ))
            }
          </div>
        </div>

        {/* Recent Enrollments */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'white', margin: 0 }}>Recent Enrollments</h3>
            <button onClick={() => navigate('/admin/inbox')} style={{ fontSize: '0.75rem', color: '#00e5ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {(stats?.recent_enrollments || []).length === 0
              ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No enrollments yet</p>
              : (stats.recent_enrollments || []).map((e, idx) => (
                <RecentRow key={e.id} item={{ ...e, name: e.name || e.user_email }} type="enrollment" index={idx} onNavigate={() => navigate('/admin/inbox')} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
