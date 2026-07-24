import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { getBackendUrl } from '../../utils/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(getBackendUrl('/api/token/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem('adminToken', data.access);
          localStorage.setItem('adminRefreshToken', data.refresh);
        } else {
          sessionStorage.setItem('adminToken', data.access);
          sessionStorage.setItem('adminRefreshToken', data.refresh);
        }
        showToast('Welcome back!', 'success');
        navigate('/admin/dashboard');
      } else {
        showToast(data.detail || 'Invalid credentials', 'error');
      }
    } catch {
      showToast('Network error — is the server running?', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#060912',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      <style>{`
        @keyframes loginFadeIn { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.97)} }
        @keyframes spinAnim { to { transform: rotate(360deg); } }
        .login-input { width: 100%; padding: 0.85rem 1rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: white; font-size: 0.95rem; outline: none; transition: all 0.25s ease; font-family: inherit; }
        .login-input:focus { border-color: #4f9cff; background: rgba(79,156,255,0.06); box-shadow: 0 0 0 3px rgba(79,156,255,0.1); }
        .login-input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79,156,255,0.1) 0%, transparent 65%)', borderRadius: '50%', animation: 'blobFloat 12s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)', borderRadius: '50%', animation: 'blobFloat 16s ease-in-out infinite reverse', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(79,156,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(79,156,255,0.018) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(10,14,28,0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(79,156,255,0.12)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,156,255,0.05)',
        animation: 'loginFadeIn 0.6s ease both',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Top glow line */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, #4f9cff, #a855f7, transparent)', borderRadius: '1px' }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'linear-gradient(135deg, rgba(79,156,255,0.15), rgba(168,85,247,0.1))', borderRadius: '18px', marginBottom: '1.25rem', border: '1px solid rgba(79,156,255,0.2)' }}>
            <img src="/logo.png?v=4" alt="Hadescore Apex Logo" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '900', color: 'white', margin: '0 0 0.4rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>Admin Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', margin: 0 }}>Hadescore Apex & Technologies</p>
        </div>

         <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Username or Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Username or Email</label>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input
                className="login-input"
                style={{ paddingLeft: '2.5rem' }}
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin or admin@hadescore.com"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input
                className="login-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }}
              >
                {showPw
                  ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '-0.2rem', marginBottom: '0.2rem' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={{
                cursor: 'pointer',
                accentColor: '#4f9cff',
                width: '16px',
                height: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', userSelect: 'none' }}>
              Remember Me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.9rem',
              background: loading ? 'rgba(79,156,255,0.4)' : 'linear-gradient(135deg, #4f9cff, #00e5ff)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(79,156,255,0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              fontFamily: 'Outfit, sans-serif',
            }}
            onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,156,255,0.55)'; }}}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(79,156,255,0.4)'; }}
          >
            {loading && <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spinAnim 0.7s linear infinite' }} />}
            {loading ? 'Authenticating…' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)' }}>
          Restricted access — authorised personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
