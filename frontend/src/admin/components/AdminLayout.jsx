import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import SessionTimeoutManager from './SessionTimeoutManager';

const NAV = [
  { id: 'dashboard',        path: '/admin/dashboard',         label: 'Dashboard',      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: '#4f9cff', section: 'Overview' },
  { id: 'inbox',            path: '/admin/inbox',             label: 'Inbox / Submissions', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#4f9cff', section: 'Inbox' },
  { id: 'careers',          path: '/admin/careers',           label: 'Careers',        icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#f43f5e', section: 'Manage' },
  { id: 'eduskills',        path: '/admin/eduskills',         label: 'EduSkills Hub',  icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0v6m-7.5-6.3v5c0 1.5 3.5 2.5 7.5 2.5s7.5-1 7.5-2.5v-5', color: '#10b981', section: 'Manage' },
  { id: 'leaders',          path: '/admin/leaders',           label: 'Leadership',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: '#f59e0b', section: 'Manage' },
  { id: 'products',         path: '/admin/products',          label: 'Products',       icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: '#ec4899', section: 'Manage' },
  { id: 'apex',             path: '/admin/apex-items',        label: 'Apex Grid',      icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: '#a855f7', section: 'Manage' },
  { id: 'services',         path: '/admin/services',          label: 'Services',       icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18', color: '#00e5ff', section: 'Manage' },
  { id: 'solutions',        path: '/admin/solutions',         label: 'Solutions',      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: '#a855f7', section: 'Manage' },
  { id: 'blogs',            path: '/admin/blogs',             label: 'Blogs / News',   icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: '#00e5ff', section: 'Manage' },
  { id: 'users',            path: '/admin/users',             label: 'Admin Users',    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: '#4f9cff', section: 'Manage' },
  { id: 'certificates',     path: '/admin/certificates',      label: 'Certificates',   icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zm-3.79-1.11L7 23l5-3 5 3-1.21-9.12', color: '#10b981', section: 'Manage' },
];

const SIDEBAR_WIDTH = 220;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // ── Swipe / Drag state for mobile sidebar ──────────────────────
  const dragStartX = useRef(null);
  const dragCurrentX = useRef(null);
  const isDragging = useRef(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  // Close sidebar when page changes on mobile
  useEffect(() => {
    setMobileSidebar(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient.get('/admin/notifications/');
        setNotifications(res.data);
      } catch (e) {
        console.error('Failed to fetch notifications', e);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const totalUnread = [
    'contacts',
    'contact-inquiries',
    'regular-job-applications',
    'internship-applications',
    'enrollments',
    'project-briefs',
    'newsletters'
  ].reduce((s, k) => s + (notifications[k] || 0), 0);


  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRefreshToken');
    navigate('/admin/login');
  };

  // ── Touch / Mouse drag handlers ─────────────────────────────────
  const getClientX = (e) => e.touches ? e.touches[0].clientX : e.clientX;

  const onDragStart = useCallback((e) => {
    dragStartX.current = getClientX(e);
    isDragging.current = true;
  }, []);

  const onDragMove = useCallback((e) => {
    if (!isDragging.current || dragStartX.current === null) return;
    dragCurrentX.current = getClientX(e);
    const delta = dragCurrentX.current - dragStartX.current;

    if (sidebarRef.current) {
      if (mobileSidebar) {
        // Dragging to close — only allow dragging left
        const offset = Math.min(0, delta);
        sidebarRef.current.style.transform = `translateX(${offset}px)`;
        if (overlayRef.current) {
          const ratio = 1 + offset / SIDEBAR_WIDTH;
          overlayRef.current.style.opacity = Math.max(0, ratio * 0.6);
        }
      } else {
        // Dragging to open from left edge — only allow dragging right
        const offset = Math.max(0, Math.min(delta - SIDEBAR_WIDTH, 0));
        const translated = -SIDEBAR_WIDTH + Math.max(0, delta);
        sidebarRef.current.style.transform = `translateX(${Math.min(0, translated)}px)`;
        if (overlayRef.current) {
          const ratio = Math.max(0, delta) / SIDEBAR_WIDTH;
          overlayRef.current.style.opacity = Math.min(0.6, ratio * 0.6);
          overlayRef.current.style.pointerEvents = ratio > 0 ? 'all' : 'none';
        }
      }
    }
  }, [mobileSidebar]);

  const onDragEnd = useCallback((e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = (dragCurrentX.current ?? dragStartX.current) - dragStartX.current;
    dragStartX.current = null;
    dragCurrentX.current = null;

    // Reset inline transform — let CSS animation take over
    if (sidebarRef.current) sidebarRef.current.style.transform = '';
    if (overlayRef.current) {
      overlayRef.current.style.opacity = '';
      overlayRef.current.style.pointerEvents = '';
    }

    const threshold = SIDEBAR_WIDTH * 0.35;
    if (mobileSidebar) {
      if (delta < -threshold) setMobileSidebar(false);
    } else {
      if (delta > threshold) setMobileSidebar(true);
    }
  }, [mobileSidebar]);

  // Edge swipe detector — allows swiping from the left edge to open
  const onEdgeTouchStart = useCallback((e) => {
    if (e.touches[0].clientX < 24) {
      onDragStart(e);
    }
  }, [onDragStart]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
    window.addEventListener('touchstart', onEdgeTouchStart);
    return () => {
      window.removeEventListener('touchmove', onDragMove);
      window.removeEventListener('touchend', onDragEnd);
      window.removeEventListener('touchstart', onEdgeTouchStart);
    };
  }, [onDragMove, onDragEnd, onEdgeTouchStart]);

  // ── Sidebar content function ─────────────────────────────────────
  const renderSidebarContent = (isMobile = false) => (
    <>
      {/* Brand */}
      <div className="admin-sidebar-brand" style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <img src="/logo.png?v=4" alt="Hadescore Apex Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', flexShrink: 0 }} />
        {(isMobile || sidebarOpen) && (
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>HADESCORE</div>
            <div style={{ fontSize: '0.65rem', color: '#4f9cff', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Portal</div>
          </div>
        )}
        {/* Close button on mobile */}
        {isMobile && (
          <button
            onClick={() => setMobileSidebar(false)}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '5px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '0.25rem 0.4rem' }} className="admin-sidebar-nav">
        {(() => {
          return NAV.map(item => {
            const active = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            let badge = notifications[item.id];
            if (item.id === 'inbox') {
              badge = ['contacts', 'contact-inquiries', 'regular-job-applications', 'internship-applications', 'enrollments', 'project-briefs', 'newsletters']
                .reduce((s, k) => s + (notifications[k] || 0), 0);
            }
            return (
              <div key={item.path} style={{ marginBottom: '1px' }}>
                <Link
                  to={item.path}
                  onClick={() => setMobileSidebar(false)}
                  title={!sidebarOpen && !isMobile ? item.label : undefined}
                  className={`admin-sidebar-link ${active ? 'active' : ''}`}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: (isMobile || sidebarOpen) ? '0.55rem' : '0',
                    justifyContent: (isMobile || sidebarOpen) ? 'flex-start' : 'center',
                    padding: (isMobile || sidebarOpen) ? '0.35rem 0.55rem' : '0.35rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    background: active ? `${item.color}18` : 'transparent',
                    border: `1px solid ${active ? item.color + '30' : 'transparent'}`,
                    color: active ? 'white' : 'rgba(255,255,255,0.45)',
                    fontWeight: active ? '700' : '500',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    minHeight: '32px', // Touch target
                    '--link-accent': item.color,
                  }}
                  onMouseOver={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}}
                  onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={active ? item.color : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d={item.icon} />
                  </svg>
                  {(isMobile || sidebarOpen) && <span style={{ flex: 1 }}>{item.label}</span>}
                  {(isMobile || sidebarOpen) && badge > 0 && (
                    <span style={{ background: '#ef4444', color: 'white', fontSize: '0.68rem', fontWeight: '800', padding: '1px 6px', borderRadius: '999px', lineHeight: '1.6' }}>{badge}</span>
                  )}
                  {!(isMobile || sidebarOpen) && badge > 0 && (
                    <span style={{ position: 'absolute', top: '4px', right: '4px', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }} />
                  )}
                </Link>
              </div>
            );
          });
        })()}
      </nav>

      {/* Bottom logout */}
      <div style={{ padding: '0.5rem 0.55rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: (isMobile || sidebarOpen) ? 'flex-start' : 'center',
            gap: '0.55rem',
            padding: '0.38rem 0.55rem', borderRadius: '6px',
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            color: '#ef4444', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
            transition: 'all 0.2s ease', minHeight: '32px',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          {(isMobile || sidebarOpen) && 'Logout'}
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#060912', color: 'var(--text-main)', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .admin-main-content { animation: adminFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

        /* Desktop sidebar visible, mobile overlay hidden */
        @media (min-width: 769px) {
          .admin-desktop-sidebar { display: flex !important; }
          .admin-mobile-overlay  { display: none  !important; }
          .admin-mobile-btn      { display: none  !important; }
          .admin-mobile-edge-grip { display: none !important; }
        }

        /* Mobile: hide desktop sidebar, show mobile controls */
        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-mobile-btn { display: flex !important; }
          .admin-main-content { padding: 1rem !important; }
          .admin-topbar { padding: 0 0.75rem !important; }
          .admin-page-title { font-size: 1.3rem !important; }
        }

        @media (max-width: 480px) {
          .admin-main-content { padding: 0.75rem !important; }
        }

        /* Mobile sidebar slide animation */
        .admin-mobile-sidebar-panel {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .admin-mobile-sidebar-panel.open {
          transform: translateX(0) !important;
        }
        .admin-mobile-sidebar-panel.closed {
          transform: translateX(-100%) !important;
        }

        /* Overlay fade */
        .admin-mobile-overlay-bg {
          transition: opacity 0.3s ease;
        }

        /* Edge grip visual hint */
        .admin-mobile-edge-grip {
          position: fixed;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 6px;
          height: 56px;
          background: linear-gradient(135deg, #4f9cff, #a855f7);
          border-radius: 0 6px 6px 0;
          z-index: 198;
          opacity: 0.6;
          cursor: grab;
        }
      `}</style>

      {/* Decorative bg */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79,156,255,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(79,156,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(79,156,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside
        className="admin-desktop-sidebar"
        style={{
          width: sidebarOpen ? '220px' : '60px',
          background: 'rgba(8,12,24,0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* ── Mobile: edge grip (swipe hint) ──────────────────────── */}
      {!mobileSidebar && (
        <div
          className="admin-mobile-edge-grip"
          onTouchStart={onDragStart}
          onMouseDown={onDragStart}
          title="Swipe to open menu"
        />
      )}

      {/* ── Mobile sidebar overlay ───────────────────────────────── */}
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="admin-mobile-overlay-bg"
        onClick={() => setMobileSidebar(false)}
        style={{
          display: 'block',
          position: 'fixed',
          inset: 0,
          zIndex: 199,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          opacity: mobileSidebar ? 1 : 0,
          pointerEvents: mobileSidebar ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        className={`admin-mobile-sidebar-panel ${mobileSidebar ? 'open' : 'closed'}`}
        onTouchStart={onDragStart}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${SIDEBAR_WIDTH}px`,
          height: '100%',
          background: 'rgba(8,12,24,0.99)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 200,
          touchAction: 'pan-y',
          willChange: 'transform',
          boxShadow: mobileSidebar ? '8px 0 32px rgba(0,0,0,0.6)' : 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        {renderSidebarContent(true)}
      </aside>

      {/* ── Main content area ─────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1, height: '100vh' }}>
        {/* Topbar */}
        <header className="admin-topbar" style={{
          height: '60px',
          background: 'rgba(8,12,24,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Mobile hamburger */}
            <button
              className="admin-mobile-btn"
              onClick={() => setMobileSidebar(!mobileSidebar)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', padding: '6px 8px', borderRadius: '10px', display: 'none', alignItems: 'center', justifyContent: 'center', minWidth: '36px', minHeight: '36px' }}
              aria-label="Toggle menu"
            >
              {mobileSidebar
                ? <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>

            {/* Desktop collapse toggle */}
            <button
              className="admin-desktop-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '5px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {sidebarOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>

            {/* Breadcrumb */}
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
              {NAV.find(n => location.pathname.startsWith(n.path) && n.path !== '/admin/dashboard')?.label || 'Dashboard'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Notification bell */}
            {totalUnread > 0 && (
              <div style={{ position: 'relative' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '0.6rem', fontWeight: '800', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              </div>
            )}

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f9cff, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.8rem' }}>A</div>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }} className="admin-desktop-sidebar">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-main-content" key={location.pathname} style={{ flex: 1, padding: '2rem', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
      <SessionTimeoutManager onLogout={handleLogout} />
    </div>
  );
};

export default AdminLayout;
