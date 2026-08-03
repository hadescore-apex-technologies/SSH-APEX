import SEO from '../components/SEO';

const TermsPage = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <SEO pageName="terms" />
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Terms of Service</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Last updated: January 2024
        </p>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: '2rem' }}>1. Acceptance of Terms</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          By accessing and using Hadescore Apex & Technologies' services, you accept and agree to be bound 
          by the terms and provision of this agreement.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>2. Use License</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          Permission is granted to temporarily use our services for personal, non-commercial transitory viewing only. 
          This is the grant of a license, not a transfer of title.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>3. User Responsibilities</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          You agree not to:
        </p>
        <ul style={{ lineHeight: '2', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
          <li>Use our services for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt our services</li>
          <li>Transmit any malicious code or harmful content</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>4. Intellectual Property</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          All content, trademarks, and data on this website are the property of Hadescore Apex & Technologies 
          and are protected by copyright and other intellectual property laws.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>5. Limitation of Liability</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          Hadescore Apex & Technologies shall not be liable for any indirect, incidental, special, 
          consequential or punitive damages resulting from your use of our services.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>6. Changes to Terms</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          We reserve the right to modify these terms at any time. Continued use of our services 
          constitutes acceptance of any changes.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>7. Contact Information</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          For questions about these Terms of Service, please contact us at <a href="mailto:info@apex.hadescoretech.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4f9cff', textDecoration: 'none' }}>info@apex.hadescoretech.com</a>
        </p>
      </section>
    </div>
  );
};

export default TermsPage;
