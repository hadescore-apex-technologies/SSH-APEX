import { useState } from 'react';
import { getBackendUrl } from '../utils/api';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(getBackendUrl('/api/newsletter/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontSize: '0.95rem'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            padding: '0.75rem 1.5rem',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {status === 'success' && (
        <p style={{ marginTop: '0.75rem', color: '#22c55e', fontSize: '0.9rem' }}>
          ✓ Successfully subscribed!
        </p>
      )}
      
      {status === 'error' && (
        <p style={{ marginTop: '0.75rem', color: '#ef4444', fontSize: '0.9rem' }}>
          ✗ Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;
