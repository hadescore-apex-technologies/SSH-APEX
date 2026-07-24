import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getBackendUrl } from '../../utils/api';

const SessionTimeoutManager = ({ onLogout }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const lastActivity = useRef(null);
  if (lastActivity.current === null) {
    lastActivity.current = Date.now();
  }

  const INACTIVITY_LIMIT = 14 * 60 * 1000; // 14 minutes before warning
  const COUNTDOWN_START = 60; // 60 seconds countdown

  const handleKeepSignedIn = async () => {
    // Renew JWT tokens manually
    try {
      const refresh = localStorage.getItem('adminRefreshToken') || sessionStorage.getItem('adminRefreshToken');
      if (refresh) {
        const BASE = getBackendUrl('/api');
        const res = await axios.post(`${BASE}/token/refresh/`, { refresh });
        if (localStorage.getItem('adminRefreshToken')) {
          localStorage.setItem('adminToken', res.data.access);
        } else {
          sessionStorage.setItem('adminToken', res.data.access);
        }
      }
    } catch (e) {
      console.error('Failed to renew token during timeout check:', e);
    }
    setShowWarning(false);
    lastActivity.current = Date.now();
  };

  const handleAutoLogout = () => {
    setShowWarning(false);
    onLogout();
  };

  useEffect(() => {
    // 1. Inactivity tracking
    const updateActivity = () => {
      // Throttle updating to once every 3 seconds to avoid constant state/ref updates
      if (Date.now() - lastActivity.current > 3000) {
        lastActivity.current = Date.now();
        if (showWarning) {
          // If warning is shown and user performs an action, reset it
          handleKeepSignedIn();
        }
      }
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // 2. Timer interval
    const interval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity.current;

      if (!showWarning && timeSinceLastActivity >= INACTIVITY_LIMIT) {
        setShowWarning(true);
        setCountdown(COUNTDOWN_START);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(interval);
    };
  }, [showWarning]);

  // 3. Countdown timer while warning is active
  useEffect(() => {
    let countdownInterval;
    if (showWarning) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            handleAutoLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [showWarning]);

  if (!showWarning) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      <style>{`
        @keyframes pulseWarning {
          0%, 100% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.25); border-color: rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 50px rgba(245, 158, 11, 0.5); border-color: rgba(245, 158, 11, 0.8); }
        }
      `}</style>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(10, 14, 28, 0.95)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '24px',
        padding: '2.5rem',
        textAlign: 'center',
        animation: 'pulseWarning 2.5s infinite',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Warning Icon */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.12)',
          color: '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', margin: '0 0 0.75rem', fontFamily: 'Outfit, sans-serif' }}>Session Expiry Warning</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 2rem' }}>
          You have been inactive for a while. You will be automatically signed out in:
        </p>

        {/* Countdown Circle */}
        <div style={{
          fontSize: '3.5rem',
          fontWeight: '900',
          color: '#f59e0b',
          fontFamily: 'Outfit, sans-serif',
          margin: '0 auto 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.05)',
          border: '2px solid rgba(245, 158, 11, 0.25)',
        }}>
          {countdown}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleAutoLogout}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              color: '#ef4444',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            Sign Out
          </button>
          <button
            onClick={handleKeepSignedIn}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: 'linear-gradient(135deg, #4f9cff, #00e5ff)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '800',
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(79, 156, 255, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 156, 255, 0.45)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 156, 255, 0.3)'; }}
          >
            Stay Signed In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutManager;
