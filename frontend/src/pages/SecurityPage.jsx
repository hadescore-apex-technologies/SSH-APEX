import React, { useEffect } from 'react';
import SEO from '../components/SEO';

function SecurityPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      paddingTop: '6rem',
      paddingBottom: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <SEO pageName="security" />
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
          Security <span style={{ color: 'var(--accent)' }}>& Compliance</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
          At Hadescore Apex, the security of our clients, students, and partners is our highest priority. We employ enterprise-grade security measures across our entire ecosystem.
        </p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>Data Protection & Encryption</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
            All data in transit is encrypted using industry-standard TLS 1.3. Data at rest is encrypted using AES-256 encryption. We regularly rotate our encryption keys and enforce strict access controls.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            Our infrastructure is continuously monitored for unauthorized access attempts, and we deploy advanced Web Application Firewalls (WAF) to block malicious traffic before it reaches our servers.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>Compliance & Auditing</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
            We adhere to global security standards and frameworks. Our operations are aligned with ISO 27001 principles and we undergo regular third-party penetration testing and vulnerability assessments.
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            <li>Annual independent security audits</li>
            <li>Strict employee access and least-privilege principles</li>
            <li>Comprehensive incident response planning</li>
            <li>Regular security awareness training for all staff</li>
          </ul>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>Vulnerability Disclosure</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
            We welcome the contribution of security researchers. If you believe you have found a security vulnerability in any of our systems or products, please report it to us immediately.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            Contact our security team at: <strong><a href="mailto:security@hadescore.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4f9cff', textDecoration: 'none' }}>security@hadescore.com</a></strong>
          </p>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '3rem', textAlign: 'center' }}>
          Last updated: October 2026
        </p>
      </div>
    </div>
  );
}

export default SecurityPage;
