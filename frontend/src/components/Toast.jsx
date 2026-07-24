import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

let externalShowToast = null;

export function showToast(message, type = 'success', duration = 4000) {
  if (externalShowToast) externalShowToast(message, type, duration);
}

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

const COLORS = {
  success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', icon: '#10b981', bar: '#10b981' },
  error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  icon: '#ef4444', bar: '#ef4444' },
  info:    { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)', icon: '#3b82f6', bar: '#3b82f6' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', icon: '#f59e0b', bar: '#f59e0b' },
};

function ToastItem({ id, message, type, duration, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const c = COLORS[type] || COLORS.info;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => dismiss(), duration - 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <div
      onClick={dismiss}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        padding: '0.9rem 1.1rem 0.9rem 1rem',
        cursor: 'pointer',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '380px',
        width: '100%',
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.9)',
        opacity: visible && !leaving ? 1 : 0,
      }}
    >
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '2px',
        background: c.bar,
        animation: `toastProgress ${duration}ms linear forwards`,
        borderRadius: '0 0 12px 12px',
      }} />

      {/* Icon */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: `rgba(${c.icon.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(',')},0.15)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: c.icon, flexShrink: 0
      }}>
        {ICONS[type]}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-main)',
          lineHeight: '1.45',
          margin: 0,
          wordBreak: 'break-word',
        }}>
          {message}
        </p>
      </div>

      {/* Close */}
      <div style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>×</div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Expose to module-level so showToast() can work anywhere
  useEffect(() => {
    externalShowToast = addToast;
    return () => { externalShowToast = null; };
  }, [addToast]);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastItem
              id={t.id}
              message={t.message}
              type={t.type}
              duration={t.duration}
              onRemove={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
