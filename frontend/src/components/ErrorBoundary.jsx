import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an crash:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#060912',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif',
        }}>
          <style>{`
            .error-card {
              max-width: 500px;
              width: 100%;
              background: rgba(10, 14, 28, 0.85);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(239, 68, 68, 0.25);
              border-radius: 24px;
              padding: 3rem 2.5rem;
              text-align: center;
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.1);
            }
            .error-btn {
              padding: 0.85rem 2rem;
              background: linear-gradient(135deg, #ef4444, #f43f5e);
              color: white;
              border: none;
              border-radius: 12px;
              font-weight: 700;
              font-size: 0.95rem;
              cursor: pointer;
              box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
              transition: all 0.25s ease;
              font-family: inherit;
            }
            .error-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(239, 68, 68, 0.45);
            }
            .error-btn:active {
              transform: scale(0.98);
            }
          `}</style>
          <div className="error-card">
            {/* Crash Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="17"/>
              </svg>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>Something went wrong</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.95rem', lineHeight: '1.65', margin: '0 0 2rem' }}>
              The application encountered an unexpected runtime error. We've logged the error, and you can try reloading the page to resume.
            </p>

            <button className="error-btn" onClick={this.handleReload}>
              Reload Application
            </button>

            {import.meta.env.DEV && this.state.error && (
              <details style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }}>
                <summary style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Error Details (Dev Mode)</summary>
                <pre style={{ color: '#ef4444', fontSize: '0.75rem', overflowX: 'auto', marginTop: '0.5rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
